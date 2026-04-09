'use client';

import { TabType } from '@/lib/types';
import { Flame, Sun, Calendar, Grid3X3, Sparkles, Search, Bookmark } from 'lucide-react';

interface TabNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'realtime', label: '실시간 핫이슈', icon: Flame },
  { id: 'daily', label: '일간 핫이슈', icon: Sun },
  { id: 'weekly', label: '주간 핫이슈', icon: Calendar },
  { id: 'category', label: '카테고리별', icon: Grid3X3 },
  { id: 'digest', label: 'AI 브리핑', icon: Sparkles },
  { id: 'search', label: '키워드 검색', icon: Search },
  { id: 'bookmark', label: '북마크', icon: Bookmark },
];

export default function TabNav({ activeTab, onTabChange }: TabNavProps) {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex overflow-x-auto scrollbar-hide gap-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  isActive
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {tab.id === 'realtime' && (
                  <span className="live-dot ml-1" />
                )}
                {tab.id === 'daily' && (
                  <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold bg-orange-500 text-white rounded ml-1" style={{fontSize:'10px'}}>HOT</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
