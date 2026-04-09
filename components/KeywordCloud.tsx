'use client';

import { Keyword } from '@/lib/types';

interface KeywordCloudProps {
  keywords: Keyword[];
}

const colorPalette = [
  'bg-blue-100 text-blue-700 hover:bg-blue-200',
  'bg-purple-100 text-purple-700 hover:bg-purple-200',
  'bg-green-100 text-green-700 hover:bg-green-200',
  'bg-orange-100 text-orange-700 hover:bg-orange-200',
  'bg-pink-100 text-pink-700 hover:bg-pink-200',
  'bg-teal-100 text-teal-700 hover:bg-teal-200',
  'bg-indigo-100 text-indigo-700 hover:bg-indigo-200',
  'bg-yellow-100 text-yellow-700 hover:bg-yellow-200',
];

export default function KeywordCloud({ keywords }: KeywordCloudProps) {
  const sorted = [...keywords].sort((a, b) => b.score - a.score);
  const maxScore = sorted[0]?.score || 10;

  return (
    <div className="flex flex-wrap gap-2">
      {sorted.map((kw, i) => {
        const colorClass = colorPalette[i % colorPalette.length];
        const fontSize = kw.score >= 8 ? 'text-base font-bold' : kw.score >= 6 ? 'text-sm font-semibold' : 'text-xs font-medium';
        const padding = kw.score >= 8 ? 'px-4 py-2' : 'px-3 py-1.5';

        return (
          <div
            key={kw.word}
            className={`inline-flex items-center gap-1.5 rounded-full cursor-default transition-colors ${colorClass} ${fontSize} ${padding}`}
            title={`중요도: ${kw.score}/10`}
          >
            <span>{kw.word}</span>
            <span className="opacity-60 text-xs">
              {'▮'.repeat(Math.round(kw.score / maxScore * 3))}
            </span>
          </div>
        );
      })}
    </div>
  );
}
