'use client';

import { useState } from 'react';
import { TabType } from '@/lib/types';
import Header from '@/components/Header';
import TabNav from '@/components/TabNav';
import NewsFeed from '@/components/NewsFeed';
import CategoryTab from '@/components/CategoryTab';
import DigestTab from '@/components/DigestTab';
import SearchTab from '@/components/SearchTab';
import BookmarkTab from '@/components/BookmarkTab';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<TabType>('daily');

  function renderTabContent() {
    switch (activeTab) {
      case 'realtime':
        return (
          <NewsFeed
            query="오늘 뉴스 이슈 속보"
            autoRefresh
            refreshInterval={60000}
            title="실시간 핫이슈"
          />
        );
      case 'daily':
        return (
          <NewsFeed
            query="오늘 뉴스 주요 이슈"
            sort="sim"
            title="일간 핫이슈"
          />
        );
      case 'weekly':
        return (
          <NewsFeed
            query="이번주 주요 이슈 화제"
            sort="sim"
            title="주간 핫이슈"
          />
        );
      case 'category':
        return <CategoryTab />;
      case 'digest':
        return <DigestTab />;
      case 'search':
        return <SearchTab />;
      case 'bookmark':
        return <BookmarkTab />;
      default:
        return null;
    }
  }

  return (
    <>
      <Header />
      <TabNav activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {renderTabContent()}
      </main>
    </>
  );
}
