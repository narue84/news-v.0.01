'use client';

import { useState, useEffect } from 'react';
import { BookmarkedNews } from '@/lib/types';
import { getBookmarks, removeBookmark } from '@/lib/bookmark';
import { Bookmark, Trash2, ExternalLink, Clock, BookmarkX } from 'lucide-react';

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('ko-KR', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function BookmarkTab() {
  const [bookmarks, setBookmarks] = useState<BookmarkedNews[]>([]);

  useEffect(() => {
    setBookmarks(getBookmarks());
  }, []);

  function handleRemove(id: string) {
    removeBookmark(id);
    setBookmarks(getBookmarks());
  }

  function handleClearAll() {
    if (confirm('모든 북마크를 삭제하시겠습니까?')) {
      bookmarks.forEach((b) => removeBookmark(b.id));
      setBookmarks([]);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bookmark className="w-5 h-5 text-blue-600" />
          <h2 className="font-semibold text-gray-900">저장된 뉴스</h2>
          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
            {bookmarks.length}개
          </span>
        </div>
        {bookmarks.length > 0 && (
          <button
            onClick={handleClearAll}
            className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            전체 삭제
          </button>
        )}
      </div>

      {bookmarks.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookmarkX className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500">저장된 뉴스가 없습니다</p>
          <p className="text-sm text-gray-400 mt-1">뉴스 카드의 북마크 버튼을 눌러 저장하세요</p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookmarks.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-gray-200 p-4 flex items-start gap-3 hover:border-blue-200 transition-colors"
            >
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Bookmark className="w-4 h-4 text-blue-600 fill-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 text-sm leading-snug line-clamp-2">
                  {item.cleanTitle}
                </h3>
                {item.cleanDescription && (
                  <p className="mt-1 text-xs text-gray-500 line-clamp-2">{item.cleanDescription}</p>
                )}
                <div className="flex items-center gap-3 mt-2">
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock className="w-3 h-3" />
                    {formatDate(item.savedAt)} 저장
                  </span>
                </div>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  title="원문 보기"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  onClick={() => handleRemove(item.id)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  title="북마크 삭제"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
