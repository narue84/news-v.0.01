'use client';

import { MessageCircle } from 'lucide-react';

interface CommentAnalysisProps {
  analysis: string;
}

export default function CommentAnalysis({ analysis }: CommentAnalysisProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <MessageCircle className="w-4 h-4 text-indigo-500" />
        예상 여론 반응
      </div>
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100">
        <div className="flex gap-2">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-200 flex items-center justify-center">
            <span className="text-sm">💬</span>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">{analysis}</p>
        </div>
      </div>
    </div>
  );
}
