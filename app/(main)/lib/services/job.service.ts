import { Job, JobStatus, JobResult } from "@/app/types/job";
import { qualifAIService } from "./qualifai.service";
import { v4 as uuidv4 } from "uuid";

// In-memory queue fallback
const memoryQueue: Map<string, Job> = new Map();

class JobService {

    // Create a new job
    async createJob(type: 'qa_run', data: Job['data']): Promise<Job> {
        const job: Job = {
            id: uuidv4(),
            type,
            data,
            status: 'pending',
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };

        // TODO: persist to Firestore
        memoryQueue.set(job.id, job);

        // Trigger processing immediately for this implementation (simulate background worker)
        // In a real system, this would be picked up by a separate worker process
        this.processJob(job.id).catch(err => console.error("Background processing failed", err));

        return job;
    }

    async getJob(id: string): Promise<Job | null> {
        return memoryQueue.get(id) || null;
    }

    async listJobs(): Promise<Job[]> {
        return Array.from(memoryQueue.values()).sort((a, b) => b.createdAt - a.createdAt);
    }

    // The "Worker" logic
    private async processJob(id: string) {
        const job = memoryQueue.get(id);
        if (!job) return;

        // Update status to processing
        job.status = 'processing';
        job.processingStartedAt = Date.now();
        job.updatedAt = Date.now();
        memoryQueue.set(id, job);

        try {
            const results: JobResult[] = [];
            const { services, url, requirements, credentials } = job.data;

            if (!url) {
                throw new Error("URL is required for QA Run");
            }

            // Parallel Execution of Service Blueprints
            const promises = services.map(async (service) => {
                try {
                    let serviceResults: any[] = [];

                    switch (service) {
                        case 'wordpress':
                            serviceResults = await qualifAIService.runWordPressAudit(url, requirements || []);
                            break;
                        case 'seo':
                            serviceResults = await qualifAIService.runSEOAudit(url, requirements || []);
                            break;
                        case 'ppc':
                            serviceResults = await qualifAIService.runPPCAudit(credentials, requirements || []);
                            break;
                        case 'content':
                            serviceResults = await qualifAIService.runContentAudit(credentials, requirements || []);
                            break;
                        default:
                            // Fallback or generic
                            // serviceResults = await qualifAIService.runGeneralQA(url, requirements || []);
                            serviceResults = [];
                    }

                    return {
                        service,
                        results: serviceResults,
                        status: 'success'
                    } as JobResult;

                } catch (error) {
                    console.error(`Service ${service} failed:`, error);
                    return {
                        service,
                        status: 'error',
                        error: error instanceof Error ? error.message : 'Unknown error'
                    } as JobResult;
                }
            });

            // Wait for all services to complete in parallel
            const completedResults = await Promise.all(promises);

            // Store results
            job.status = 'completed';
            job.result = completedResults;
            job.completedAt = Date.now();
            job.updatedAt = Date.now();

        } catch (error) {
            console.error("Job processing failed:", error);
            job.status = 'failed';
            job.error = error instanceof Error ? error.message : 'Unknown fatal error';
            job.updatedAt = Date.now();
        }

        memoryQueue.set(id, job);
    }
}

export const jobService = new JobService();
