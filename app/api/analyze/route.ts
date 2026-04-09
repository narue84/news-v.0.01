import { NextRequest, NextResponse } from 'next/server';
import { analyzeNews } from '@/lib/openai';
import { ProcessedNewsItem } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newsItems: ProcessedNewsItem[] = body.newsItems;

    if (!newsItems || !Array.isArray(newsItems) || newsItems.length === 0) {
      return NextResponse.json(
        { success: false, error: 'News items are required' },
        { status: 400 }
      );
    }

    const analysis = await analyzeNews(newsItems);

    return NextResponse.json({ success: true, data: analysis });
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to analyze news' },
      { status: 500 }
    );
  }
}
