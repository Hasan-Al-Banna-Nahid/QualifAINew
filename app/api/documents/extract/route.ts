import { NextResponse } from 'next/server';
import pdf from 'pdf-parse';
import mammoth from 'mammoth';

export async function POST(request: Request) {
    try {
        const { url, type } = await request.json();

        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        console.log(`Extracting text from ${url} (${type})`);

        // Fetch the file
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch file: ${response.statusText}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        let extractedText = '';

        // Determine file type and extract text
        if (type === 'application/pdf' || url.toLowerCase().endsWith('.pdf')) {
            const data = await pdf(buffer);
            extractedText = data.text;
        } else if (
            type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
            url.toLowerCase().endsWith('.docx')
        ) {
            const result = await mammoth.extractRawText({ buffer });
            extractedText = result.value;
        } else if (
            type === 'text/plain' ||
            type === 'text/markdown' ||
            type === 'text/csv' ||
            type === 'application/json' ||
            url.toLowerCase().endsWith('.txt') ||
            url.toLowerCase().endsWith('.md') ||
            url.toLowerCase().endsWith('.csv') ||
            url.toLowerCase().endsWith('.json')
        ) {
            extractedText = buffer.toString('utf-8');
        } else if (url.includes('docs.google.com/document/d/')) {
            // Handle Google Docs - Attempt to fetch as text/plain export if public
            try {
                const docIdMatch = url.match(/document\/d\/([a-zA-Z0-9-_]+)/);
                if (docIdMatch && docIdMatch[1]) {
                    const exportUrl = `https://docs.google.com/document/d/${docIdMatch[1]}/export?format=txt`;
                    console.log(`Attempting to fetch Google Doc export from: ${exportUrl}`);
                    // Note: This fetch needs to be a separate call, not using the original buffer if the original url was the view url
                    const docResponse = await fetch(exportUrl);
                    if (docResponse.ok) {
                        extractedText = await docResponse.text();
                    }
                }
            } catch (e) {
                console.warn('Error handling Google Doc URL:', e);
            }

            if (!extractedText) {
                extractedText = buffer.toString('utf-8');
            }
        } else {
            // Fallback for other types or unknown types, try to read as text
            console.warn(`Unknown file type: ${type}, attempting to read as text.`);
            extractedText = buffer.toString('utf-8');
        }

        // Basic cleaning
        extractedText = extractedText.trim();

        return NextResponse.json({ text: extractedText });

    } catch (error) {
        console.error('Text extraction error:', error);
        return NextResponse.json({ error: 'Internal server error: ' + (error as Error).message }, { status: 500 });
    }
}
