import { NaverNewsResponse, ProcessedNewsItem } from './types';

const NAVER_API_BASE = 'https://openapi.naver.com/v1/search/news.json';

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#[0-9]+;/g, '').trim();
}

export async function fetchNaverNews(
  query: string,
  display = 20,
  start = 1,
  sort: 'date' | 'sim' = 'date'
): Promise<ProcessedNewsItem[]> {
  const clientId = process.env.NAVER_CLIENT_ID;
  const clientSecret = process.env.NAVER_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Naver API credentials not configured');
  }

  const params = new URLSearchParams({
    query,
    display: String(display),
    start: String(start),
    sort,
  });

  const response = await fetch(`${NAVER_API_BASE}?${params}`, {
    headers: {
      'X-Naver-Client-Id': clientId,
      'X-Naver-Client-Secret': clientSecret,
    },
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error(`Naver API error: ${response.status} ${response.statusText}`);
  }

  const data: NaverNewsResponse = await response.json();

  return data.items.map((item) => ({
    title: item.title,
    link: item.link,
    description: item.description,
    pubDate: item.pubDate,
    cleanTitle: stripHtml(item.title),
    cleanDescription: stripHtml(item.description),
  }));
}

export const TRENDING_QUERIES = [
  '오늘 뉴스',
  '속보',
  '이슈',
];

export const CATEGORY_QUERIES: Record<string, string> = {
  '정치': '정치 국회 대통령',
  '경제': '경제 주식 금리 부동산',
  'IT/과학': 'IT 인공지능 기술 스타트업',
  '스포츠': '스포츠 축구 야구 농구',
  '사회': '사회 사건 사고 환경',
  '문화/연예': '연예 문화 영화 드라마',
};
