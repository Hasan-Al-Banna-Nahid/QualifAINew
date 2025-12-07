import { NextRequest, NextResponse } from 'next/server';
import { apifyService } from '@/app/(main)/lib/services/apify.service';

export const maxDuration = 60; // Set max duration to 60 seconds for long-running analysis

export async function POST(req: NextRequest) {
    try {
        const { url } = await req.json();

        if (!url) {
            return NextResponse.json(
                { error: 'URL is required' },
                { status: 400 }
            );
        }

        // Run WordPress analysis using Apify service
        const analysisResult = await apifyService.analyzeWordPress(url);

        return NextResponse.json(analysisResult);
    } catch (error: any) {
        console.error('WordPress analysis failed:', error);
        return NextResponse.json(
            {
                error: 'WordPress analysis failed',
                details: error.message
            },
            { status: 500 }
        );
    }
}
