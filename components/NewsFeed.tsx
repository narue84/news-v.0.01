'use client';

import { useState, useEffect, useCallback } from 'react';
import { ProcessedNewsItem, AnalysisResult } from '@/lib/types';
import HeadlineCard from './HeadlineCard';
import NewsCard from './NewsCard';
import AnalysisPanel from './AnalysisPanel';
import { RefreshCw, AlertCircle, Zap } from 'lucide-react';

interface NewsFeedProps {
  query?: string;
  category?: string;
  sort?: 'date' | 'sim';
  autoRefresh?: boolean;
  refreshInterval?: number;
  title?: string;
}

export default function NewsFeed({
  query = '오늘 뉴스 이슈',
  category,
  sort = 'date',
  autoRefresh = false,
  refreshInterval = 60000,
  title,
}: NewsFeedProps) {
  const [news, setNews] = useState<ProcessedNewsItem[]>([]);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [loadingNews, setLoadingNews] = useState(false);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchNews = useCallback(async () => {
    setLoadingNews(true);
    setError(null);
    try {
      const params = new URLSearchParams({ query, display: '20', sort: sort || 'date' });
      if (category) params.set('category', category);

      const res = await fetch(`/api/news?${params}`);
      const data = await res.json();

      if (data.success) {
        setNews(data.data);
        setLastUpdated(new Date());
        setSelectedIndex(null);
        setAnalysis(null);
      } else {
        setError('뉴스를 불러오지 못했습니다.');
      }
    } catch {
      setError('네트워크 오류가 발생했습니다.');
    } finally {
      setLoadingNews(false);
    }
  }, [query, category, sort]);

  const analyzeCurrentNews = useCallback(async (items: ProcessedNewsItem[]) => {
    if (items.length === 0) return;
    setLoadingAnalysis(true);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newsItems: items }),
      });
      const data = await res.json();
      if (data.success) {
        setAnalysis(data.data);
      }
    } catch {
      console.error('Analysis failed');
    } finally {
      setLoadingAnalysis(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  useEffect(() => {
    if (news.length > 0 && !analysis && !loadingAnalysis) {
      analyzeCurrentNews(news);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [news]);

  useEffect(() => {
    if (!autoRefresh) return;
    const timer = setInterval(fetchNews, refreshInterval);
    return () => clearInterval(timer);
  }, [autoRefresh, refreshInterval, fetchNews]);

  function handleSelectNews(index: number) {
    setSelectedIndex(index === selectedIndex ? null : index);
  }

  const headlines = news.slice(0, 3);
  const restNews = news.slice(3);

  return (
    <div className="space-y-5">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {title && <h2 className="font-bold text-gray-900 text-lg">{title}</h2>}
          {autoRefresh && (
            <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
              <Zap className="w-3 h-3" />
              자동 갱신
            </span>
          )}
          {lastUpdated && (
            <span className="text-xs text-gray-400">
              {lastUpdated.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })} 기준
            </span>
          )}
        </div>
        <button
          onClick={fetchNews}
          disabled={loadingNews}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loadingNews ? 'animate-spin' : ''}`} />
          새로고침
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Main layout: left=news, right=analysis */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        {/* Left: news content */}
        <div className="xl:col-span-3 space-y-4">
          {loadingNews ? (
            <div className="space-y-3">
              {/* Headline skeletons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="h-64 bg-gray-100 rounded-2xl animate-pulse sm:col-span-2" />
                <div className="h-52 bg-gray-100 rounded-2xl animate-pulse" />
                <div className="h-52 bg-gray-100 rounded-2xl animate-pulse" />
              </div>
              <div className="space-y-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Top 3 Headline cards */}
              {headlines.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {headlines[0] && (
                    <HeadlineCard
                      news={headlines[0]}
                      rank={1}
                      isSelected={selectedIndex === 0}
                      onSelect={() => handleSelectNews(0)}
                    />
                  )}
                  <div className="flex flex-col gap-3">
                    {headlines[1] && (
                      <HeadlineCard
                        news={headlines[1]}
                        rank={2}
                        isSelected={selectedIndex === 1}
                        onSelect={() => handleSelectNews(1)}
                      />
                    )}
                    {headlines[2] && (
                      <HeadlineCard
                        news={headlines[2]}
                        rank={3}
                        isSelected={selectedIndex === 2}
                        onSelect={() => handleSelectNews(2)}
                      />
                    )}
                  </div>
                </div>
              )}

              {/* Rest of news */}
              {restNews.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-500 px-1">그 외 주요 뉴스</h3>
                  {restNews.map((item, i) => (
                    <NewsCard
                      key={item.link}
                      news={item}
                      index={i + 3}
                      isSelected={selectedIndex === i + 3}
                      onSelect={() => handleSelectNews(i + 3)}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Right: AI Analysis panel */}
        <div className="xl:col-span-2">
          <div className="sticky top-32">
            <AnalysisPanel analysis={analysis} isLoading={loadingAnalysis} />
          </div>
        </div>
      </div>
    </div>
  );
}
