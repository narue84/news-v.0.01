'use client';

import { useState, useEffect } from 'react';
import { ProcessedNewsItem } from '@/lib/types';
import { ExternalLink, Bookmark, BookmarkCheck, Clock } from 'lucide-react';
import { addBookmark, removeBookmark, isBookmarked, getBookmarks } from '@/lib/bookmark';

interface NewsCardProps {
  news: ProcessedNewsItem;
  index: number;
  isSelected?: boolean;
  onSelect?: () => void;
}

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
  } catch {
    return dateString;
  }
}

export default function NewsCard({ news, index, isSelected, onSelect }: NewsCardProps) {
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    setBookmarked(isBookmarked(news.link));
  }, [news.link]);

  function handleBookmark(e: React.MouseEvent) {
    e.stopPropagation();
    if (bookmarked) {
      const bookmarks = getBookmarks();
      const found = bookmarks.find((b) => b.link === news.link);
      if (found) removeBookmark(found.id);
      setBookmarked(false);
    } else {
      addBookmark(news);
      setBookmarked(true);
    }
  }

  return (
    <div
      onClick={onSelect}
      className={`group relative bg-white rounded-xl border transition-all duration-200 cursor-pointer news-card-hover ${
        isSelected
          ? 'border-blue-500 ring-2 ring-blue-100 shadow-md'
          : 'border-gray-200 hover:border-blue-300'
      }`}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Index badge */}
          <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
            index === 0 ? 'bg-red-500 text-white' :
            index === 1 ? 'bg-orange-500 text-white' :
            index === 2 ? 'bg-yellow-500 text-white' :
            'bg-gray-100 text-gray-500'
          }`}>
            {index + 1}
          </span>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 group-hover:text-blue-700 transition-colors">
              {news.cleanTitle}
            </h3>
            {news.cleanDescription && (
              <p className="mt-1.5 text-xs text-gray-500 line-clamp-2 leading-relaxed">
                {news.cleanDescription}
              </p>
            )}
            <div className="flex items-center gap-3 mt-2">
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Clock className="w-3 h-3" />
                {formatDate(news.pubDate)}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2 flex-shrink-0">
            <button
              onClick={handleBookmark}
              className={`p-1.5 rounded-lg transition-colors ${
                bookmarked
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
              }`}
              title={bookmarked ? '북마크 해제' : '북마크 저장'}
            >
              {bookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            </button>
            <a
              href={news.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              title="원문 보기"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {isSelected && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-l-xl" />
      )}
    </div>
  );
}
