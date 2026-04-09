'use client';

import { useState, useRef } from 'react';
import { Search, X } from 'lucide-react';
import NewsFeed from './NewsFeed';

const popularKeywords = ['인공지능', '주식', '부동산', '대통령', '국회', '올림픽', '날씨', 'K-pop'];

export default function SearchTab() {
  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSearch(query?: string) {
    const q = query || inputValue.trim();
    if (q) {
      setSearchQuery(q);
      if (query) setInputValue(query);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleSearch();
  }

  function handleClear() {
    setInputValue('');
    setSearchQuery('');
    inputRef.current?.focus();
  }

  return (
    <div className="space-y-4">
      {/* Search input */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="뉴스 키워드를 입력하세요..."
              className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {inputValue && (
              <button
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            onClick={() => handleSearch()}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            검색
          </button>
        </div>

        {/* Popular keywords */}
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="text-xs text-gray-400">인기 검색어:</span>
          {popularKeywords.map((kw) => (
            <button
              key={kw}
              onClick={() => handleSearch(kw)}
              className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
            >
              #{kw}
            </button>
          ))}
        </div>
      </div>

      {searchQuery ? (
        <NewsFeed
          key={searchQuery}
          query={searchQuery}
          title={`"${searchQuery}" 검색 결과`}
        />
      ) : (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500">검색어를 입력해주세요</p>
          <p className="text-sm text-gray-400 mt-1">AI가 검색 결과를 분석해 드립니다</p>
        </div>
      )}
    </div>
  );
}
