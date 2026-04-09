'use client';

import { Sentiment } from '@/lib/types';

interface SentimentBadgeProps {
  sentiment: Sentiment;
  showDetail?: boolean;
}

const sentimentConfig = {
  긍정: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200', emoji: '😊' },
  부정: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', emoji: '😠' },
  중립: { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200', emoji: '😐' },
};

const emotionEmoji: Record<string, string> = {
  희망: '🌟', 분노: '😡', 불안: '😰', 기쁨: '😄',
  슬픔: '😢', 놀라움: '😲', 공포: '😨', 혐오: '🤢',
};

export default function SentimentBadge({ sentiment, showDetail = false }: SentimentBadgeProps) {
  const config = sentimentConfig[sentiment.label] || sentimentConfig['중립'];
  const emotionIcon = emotionEmoji[sentiment.emotion] || '💭';
  const scorePercent = Math.round((sentiment.score + 1) / 2 * 100);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 flex-wrap">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border ${config.bg} ${config.text} ${config.border}`}>
          <span>{config.emoji}</span>
          {sentiment.label}
        </span>
        <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium bg-purple-100 text-purple-700 border border-purple-200`}>
          <span>{emotionIcon}</span>
          {sentiment.emotion}
        </span>
      </div>

      {/* Sentiment Score Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-gray-500">
          <span>부정</span>
          <span className="font-medium text-gray-700">감정 지수: {scorePercent}%</span>
          <span>긍정</span>
        </div>
        <div className="relative h-2 bg-gradient-to-r from-red-200 via-gray-200 to-green-200 rounded-full overflow-hidden">
          <div
            className="absolute top-0 w-3 h-3 -translate-y-0.5 rounded-full bg-white border-2 border-gray-400 shadow"
            style={{ left: `calc(${scorePercent}% - 6px)` }}
          />
        </div>
      </div>

      {showDetail && sentiment.detail && (
        <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3 leading-relaxed">
          {sentiment.detail}
        </p>
      )}
    </div>
  );
}
