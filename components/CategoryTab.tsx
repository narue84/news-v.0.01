'use client';

import { useState } from 'react';
import { CategoryType } from '@/lib/types';
import NewsFeed from './NewsFeed';

const categories: CategoryType[] = ['전체', '정치', '경제', 'IT/과학', '스포츠', '사회', '문화/연예'];

const categoryIcons: Record<string, string> = {
  '전체': '🌐',
  '정치': '🏛️',
  '경제': '💹',
  'IT/과학': '💻',
  '스포츠': '⚽',
  '사회': '👥',
  '문화/연예': '🎬',
};

export default function CategoryTab() {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('전체');

  const query = activeCategory === '전체' ? '오늘 주요 뉴스' : activeCategory;
  const apiCategory = activeCategory === '전체' ? undefined : activeCategory;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeCategory === cat
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:text-blue-600'
            }`}
          >
            <span>{categoryIcons[cat]}</span>
            {cat}
          </button>
        ))}
      </div>

      <NewsFeed
        key={activeCategory}
        query={query}
        category={apiCategory}
        title={`${categoryIcons[activeCategory]} ${activeCategory} 뉴스`}
      />
    </div>
  );
}
