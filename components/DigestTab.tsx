'use client';

import { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, Loader2, Calendar, Clock, Database } from 'lucide-react';

export default function DigestTab() {
  const [digest, setDigest] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCached, setIsCached] = useState(false);
  const [cachedAt, setCachedAt] = useState<Date | null>(null);
  const [nextRefreshIn, setNextRefreshIn] = useState<number | null>(null);

  async function fetchDigest(forceRefresh = false) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/digest', {
        method: forceRefresh ? 'POST' : 'GET',
      });
      const data = await res.json();
      if (data.success) {
        setDigest(data.data);
        setIsCached(data.cached ?? false);
        if (data.cachedAt) {
          const cachedDate = new Date(data.cachedAt);
          setCachedAt(cachedDate);
          const elapsed = Date.now() - data.cachedAt;
          const remaining = 5 * 60 * 1000 - elapsed;
          setNextRefreshIn(remaining > 0 ? Math.ceil(remaining / 1000) : 0);
        } else {
          setCachedAt(new Date());
          setNextRefreshIn(5 * 60);
        }
      } else {
        setError('브리핑 생성에 실패했습니다.');
      }
    } catch {
      setError('네트워크 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDigest();
  }, []);

  // Countdown timer
  useEffect(() => {
    if (nextRefreshIn === null || nextRefreshIn <= 0) return;
    const timer = setInterval(() => {
      setNextRefreshIn((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [nextRefreshIn]);

  const today = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  function formatCountdown(secs: number) {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5" />
              <span className="font-medium text-blue-100 text-sm">AI 데일리 브리핑</span>
            </div>
            <h2 className="text-2xl font-bold">오늘의 주요 뉴스</h2>
            <p className="text-blue-200 text-sm mt-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {today}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <button
              onClick={() => fetchDigest(true)}
              disabled={loading || (nextRefreshIn !== null && nextRefreshIn > 0)}
              className="flex items-center gap-1.5 px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title={nextRefreshIn && nextRefreshIn > 0 ? `${formatCountdown(nextRefreshIn)} 후 재생성 가능` : '강제 재생성'}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              재생성
            </button>
            {nextRefreshIn !== null && nextRefreshIn > 0 && (
              <span className="text-xs text-blue-200 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatCountdown(nextRefreshIn)} 후 갱신
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Cache notice */}
      {isCached && cachedAt && (
        <div className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-700">
          <Database className="w-4 h-4 flex-shrink-0" />
          <span>
            캐시된 브리핑 표시 중 ({cachedAt.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })} 생성)
            {nextRefreshIn !== null && nextRefreshIn > 0 && ` · ${formatCountdown(nextRefreshIn)} 후 자동 갱신`}
          </span>
        </div>
      )}

      {/* Content */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        {loading ? (
          <div className="flex flex-col items-center py-12 gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
            <div className="text-center">
              <p className="font-medium text-gray-700">AI 브리핑 생성 중...</p>
              <p className="text-sm text-gray-500 mt-1">오늘의 주요 뉴스를 분석하고 있습니다</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            <p>{error}</p>
            <button onClick={() => fetchDigest()} className="mt-3 text-sm text-blue-600 hover:underline">
              다시 시도
            </button>
          </div>
        ) : digest ? (
          <div className="space-y-4">
            <div className="prose prose-sm max-w-none">
              {digest.split('\n').filter(Boolean).map((paragraph, i) => {
                if (paragraph.match(/^#{1,3}\s/) || (paragraph.startsWith('**') && paragraph.endsWith('**'))) {
                  const clean = paragraph.replace(/^#+\s*/, '').replace(/^\*\*/, '').replace(/\*\*$/, '');
                  return (
                    <h3 key={i} className="font-bold text-gray-900 text-base mt-5 mb-2 first:mt-0 flex items-center gap-2">
                      <span className="w-1.5 h-5 bg-blue-600 rounded-full inline-block flex-shrink-0" />
                      {clean}
                    </h3>
                  );
                }
                return (
                  <p key={i} className="text-gray-700 leading-relaxed text-sm">
                    {paragraph.replace(/\*\*/g, '')}
                  </p>
                );
              })}
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                GPT-5.4 생성
              </span>
              {cachedAt && (
                <span>{cachedAt.toLocaleTimeString('ko-KR')}</span>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
