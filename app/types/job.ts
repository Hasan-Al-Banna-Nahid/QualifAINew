export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface Job {
    id: string;
    type: 'qa_run';
    data: {
        projectId: string;
        services: string[]; // e.g. ['wordpress', 'seo']
        requirements?: any[];
        url?: string;
        credentials?: any;
    };
    status: JobStatus;
    result?: any;
    error?: string;
    createdAt: number;
    updatedAt: number;
    processingStartedAt?: number;
    completedAt?: number;
}

export interface JobResult {
    service: string;
    results: any[]; // QAResult[]
    status: 'success' | 'error';
    error?: string;
}
