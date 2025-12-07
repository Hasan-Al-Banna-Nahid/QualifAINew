// app/api/qualifai/seo-analysis/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { apifyService } from '@/app/(main)/lib/services/apify.service';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { url } = body;

        if (!url) {
            return NextResponse.json(
                { error: 'URL is required' },
                { status: 400 }
            );
        }

        // Validate URL format
        try {
            new URL(url);
        } catch (error) {
            return NextResponse.json(
                { error: 'Invalid URL format' },
                { status: 400 }
            );
        }

        // Perform SEO analysis using Apify
        const analysis = await apifyService.analyzeSEO(url);

        return NextResponse.json({
            success: true,
            data: analysis,
        });
    } catch (error: any) {
        console.error('SEO Analysis Error:', error);

        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Failed to analyze SEO',
                details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
            },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const url = searchParams.get('url');

    if (!url) {
        return NextResponse.json(
            { error: 'URL parameter is required' },
            { status: 400 }
        );
    }

    try {
        // Validate URL format
        new URL(url);

        // Perform SEO analysis using Apify
        const analysis = await apifyService.analyzeSEO(url);

        return NextResponse.json({
            success: true,
            data: analysis,
        });
    } catch (error: any) {
        console.error('SEO Analysis Error:', error);

        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Failed to analyze SEO',
                details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
            },
            { status: 500 }
        );
    }
}
