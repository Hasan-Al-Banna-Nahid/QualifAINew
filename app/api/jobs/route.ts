import { NextResponse } from 'next/server';
import { jobService } from '@/app/(main)/lib/services/job.service';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { type, data } = body;

        if (!type || !data) {
            return NextResponse.json({ error: 'Missing type or data' }, { status: 400 });
        }

        const job = await jobService.createJob(type, data);
        return NextResponse.json(job, { status: 201 });

    } catch (error) {
        console.error('Job creation failed:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const jobs = await jobService.listJobs();
        return NextResponse.json(jobs);
    } catch (error) {
        console.error('Failed to list jobs:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
