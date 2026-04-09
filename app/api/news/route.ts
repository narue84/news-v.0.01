import { NextRequest, NextResponse } from 'next/server';
import { fetchNaverNews, CATEGORY_QUERIES } from '@/lib/naver';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query') || '오늘 뉴스 이슈';
  const display = Number(searchParams.get('display') || '20');
  const sort = (searchParams.get('sort') || 'date') as 'date' | 'sim';
  const category = searchParams.get('category');

  try {
    const searchQuery = category && CATEGORY_QUERIES[category]
      ? CATEGORY_QUERIES[category]
      : query;

    const news = await fetchNaverNews(searchQuery, display, 1, sort);

    return NextResponse.json({ success: true, data: news, query: searchQuery });
  } catch (error) {
    console.error('News fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}
