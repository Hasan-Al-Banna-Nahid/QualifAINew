import { NextResponse } from 'next/server';
import { jobService } from '@/app/(main)/lib/services/job.service';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const job = await jobService.getJob(id);

        if (!job) {
            return NextResponse.json({ error: 'Job not found' }, { status: 404 });
        }

        return NextResponse.json(job);
    } catch (error) {
        console.error('Failed to get job:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
