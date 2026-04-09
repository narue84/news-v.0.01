'use client';

import { Newspaper, TrendingUp } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600">
              <Newspaper className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">뉴스 AI 분석</h1>
              <p className="text-xs text-gray-500">네이버 뉴스 · AI 인사이트</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <TrendingUp className="w-4 h-4 text-blue-500" />
            <span className="hidden sm:inline">실시간 AI 분석 서비스</span>
          </div>
        </div>
      </div>
    </header>
  );
}
