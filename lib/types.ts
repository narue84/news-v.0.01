export interface NaverNewsItem {
  title: string;
  originallink: string;
  link: string;
  description: string;
  pubDate: string;
}

export interface NaverNewsResponse {
  lastBuildDate: string;
  total: number;
  start: number;
  display: number;
  items: NaverNewsItem[];
}

export interface ProcessedNewsItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  cleanTitle: string;
  cleanDescription: string;
}

export interface Keyword {
  word: string;
  score: number;
}

export interface Sentiment {
  label: '긍정' | '부정' | '중립';
  emotion: string;
  score: number;
  detail: string;
}

export interface MindMapNode {
  id: string;
  label: string;
  children?: MindMapNode[];
}

export interface MindMapData {
  center: string;
  branches: {
    label: string;
    children: string[];
  }[];
}

export interface AnalysisResult {
  keywords: Keyword[];
  sentiment: Sentiment;
  mindmap: MindMapData;
  category: string;
  trend_insight: string;
  comment_analysis: string;
  interest_score: number;
  summary: string;
}

export type TabType = 'realtime' | 'daily' | 'weekly' | 'category' | 'digest' | 'search' | 'bookmark';

export type CategoryType = '전체' | '정치' | '경제' | 'IT/과학' | '스포츠' | '사회' | '문화/연예';

export interface BookmarkedNews extends ProcessedNewsItem {
  savedAt: string;
  id: string;
}
