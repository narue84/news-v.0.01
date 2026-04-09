'use client';

import { useState } from 'react';
import { AnalysisResult } from '@/lib/types';
import KeywordCloud from './KeywordCloud';
import SentimentBadge from './SentimentBadge';
import MindMap from './MindMap';
import TrendInsight from './TrendInsight';
import CommentAnalysis from './CommentAnalysis';
import InterestMeter from './InterestMeter';
import { Brain, ChevronDown, ChevronUp, FileText, Loader2 } from 'lucide-react';

interface AnalysisPanelProps {
  analysis: AnalysisResult | null;
  isLoading?: boolean;
}

interface SectionProps {
  title: string;
  icon: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function Section({ title, icon, defaultOpen = false, children }: SectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <span>{icon}</span>
          {title}
        </span>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

export default function AnalysisPanel({ analysis, isLoading }: AnalysisPanelProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
            <Brain className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">AI 분석 중</p>
            <p className="text-xs text-gray-400">GPT-5.4 처리 중...</p>
          </div>
          <Loader2 className="w-4 h-4 text-blue-500 animate-spin ml-auto" />
        </div>
        <div className="p-4 space-y-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-9 bg-gray-100 rounded-lg animate-pulse"
              style={{ animationDelay: `${i * 0.08}s`, width: `${85 + (i % 3) * 5}%` }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
          <span className="text-xl">🤖</span>
        </div>
        <p className="text-gray-500 text-sm font-medium">AI 분석 대기 중</p>
        <p className="text-gray-400 text-xs mt-1">뉴스 로드 후 자동 분석됩니다</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden max-h-[calc(100vh-180px)] flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2 flex-shrink-0 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
          <Brain className="w-3.5 h-3.5 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900">AI 분석 결과</p>
          <p className="text-xs text-gray-500">GPT-5.4 기반</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5 bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
          완료
        </div>
      </div>

      {/* Scrollable content */}
      <div className="overflow-y-auto flex-1 scrollbar-hide">
        {/* Summary - always visible */}
        {analysis.summary && (
          <div className="px-4 py-3 bg-amber-50 border-b border-amber-100">
            <div className="flex items-start gap-2">
              <FileText className="w-3.5 h-3.5 text-amber-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-gray-700 leading-relaxed">{analysis.summary}</p>
            </div>
          </div>
        )}

        {/* Quick stats row */}
        <div className="grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-100">
          <div className="px-3 py-2.5 text-center">
            <p className="text-xs text-gray-400">감정</p>
            <p className={`text-sm font-bold mt-0.5 ${
              analysis.sentiment.label === '긍정' ? 'text-green-600' :
              analysis.sentiment.label === '부정' ? 'text-red-600' : 'text-gray-600'
            }`}>{analysis.sentiment.label}</p>
          </div>
          <div className="px-3 py-2.5 text-center">
            <p className="text-xs text-gray-400">관심도</p>
            <p className="text-sm font-bold text-blue-600 mt-0.5">{analysis.interest_score}<span className="text-xs font-normal text-gray-400">/100</span></p>
          </div>
          <div className="px-3 py-2.5 text-center">
            <p className="text-xs text-gray-400">카테고리</p>
            <p className="text-xs font-bold text-purple-600 mt-0.5 truncate">{analysis.category}</p>
          </div>
        </div>

        {/* Collapsible sections */}
        <Section title="키워드 분석" icon="🏷️" defaultOpen>
          <KeywordCloud keywords={analysis.keywords} />
        </Section>

        <Section title="감정 분석" icon="💭">
          <SentimentBadge sentiment={analysis.sentiment} showDetail />
        </Section>

        <Section title="트렌드 인사이트" icon="📈">
          <TrendInsight insight={analysis.trend_insight} category={analysis.category} />
        </Section>

        <Section title="댓글 여론 분석" icon="💬">
          <CommentAnalysis analysis={analysis.comment_analysis} />
        </Section>

        <Section title="관심도 측정" icon="📊">
          <InterestMeter score={analysis.interest_score} />
        </Section>

        <Section title="마인드맵" icon="🗺️">
          <MindMap data={analysis.mindmap} />
        </Section>
      </div>
    </div>
  );
}
