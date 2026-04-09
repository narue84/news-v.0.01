'use client';

import { TrendingUp } from 'lucide-react';

interface TrendInsightProps {
  insight: string;
  category: string;
}

const categoryColors: Record<string, string> = {
  '정치': 'bg-red-100 text-red-700',
  '경제': 'bg-green-100 text-green-700',
  'IT/과학': 'bg-blue-100 text-blue-700',
  '스포츠': 'bg-orange-100 text-orange-700',
  '사회': 'bg-purple-100 text-purple-700',
  '문화/연예': 'bg-pink-100 text-pink-700',
};

export default function TrendInsight({ insight, category }: TrendInsightProps) {
  const categoryClass = categoryColors[category] || 'bg-gray-100 text-gray-700';

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-blue-600" />
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryClass}`}>
          {category}
        </span>
      </div>
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{insight}</p>
      </div>
    </div>
  );
}
