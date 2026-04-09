'use client';

import { useState, useEffect } from 'react';
import { ProcessedNewsItem } from '@/lib/types';
import { ExternalLink, Bookmark, BookmarkCheck, Clock, Image as ImageIcon } from 'lucide-react';
import { addBookmark, removeBookmark, isBookmarked, getBookmarks } from '@/lib/bookmark';

interface HeadlineCardProps {
  news: ProcessedNewsItem;
  rank: 1 | 2 | 3;
  isSelected?: boolean;
  onSelect?: () => void;
}

const rankConfig = {
  1: {
    badge: 'bg-gradient-to-r from-red-500 to-orange-500 text-white',
    label: '1위',
    size: 'lg:col-span-2',
    imgHeight: 'h-52',
    titleSize: 'text-lg',
  },
  2: {
    badge: 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white',
    label: '2위',
    size: '',
    imgHeight: 'h-40',
    titleSize: 'text-base',
  },
  3: {
    badge: 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white',
    label: '3위',
    size: '',
    imgHeight: 'h-40',
    titleSize: 'text-base',
  },
};

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
    return '';
  }
}

export default function HeadlineCard({ news, rank, isSelected, onSelect }: HeadlineCardProps) {
  const [ogImage, setOgImage] = useState<string | null>(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const config = rankConfig[rank];

  useEffect(() => {
    setBookmarked(isBookmarked(news.link));
  }, [news.link]);

  useEffect(() => {
    let cancelled = false;
    async function fetchOg() {
      try {
        const res = await fetch(`/api/og-image?url=${encodeURIComponent(news.link)}`);
        const data = await res.json();
        if (!cancelled && data.image) setOgImage(data.image);
      } catch {}
    }
    fetchOg();
    return () => { cancelled = true; };
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
      className={`group relative bg-white rounded-2xl border-2 overflow-hidden cursor-pointer transition-all duration-200 news-card-hover ${
        isSelected ? 'border-blue-500 ring-2 ring-blue-100 shadow-lg' : 'border-gray-100 hover:border-blue-300 hover:shadow-md'
      } ${config.size}`}
    >
      {/* Image area */}
      <div className={`relative w-full ${config.imgHeight} bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden`}>
        {ogImage && !imgError ? (
          <>
            {!imgLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-gray-300 border-t-blue-500 animate-spin" />
              </div>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={ogImage}
              alt={news.cleanTitle}
              className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
            />
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <ImageIcon className="w-8 h-8 text-gray-300" />
            <span className="text-xs text-gray-400">이미지 없음</span>
          </div>
        )}
        {/* Rank badge */}
        <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-black shadow-md ${config.badge}`}>
          {config.label}
        </div>
        {/* Bookmark button */}
        <button
          onClick={handleBookmark}
          className={`absolute top-3 right-3 p-2 rounded-lg backdrop-blur-sm transition-colors shadow ${
            bookmarked ? 'bg-blue-600 text-white' : 'bg-white/80 text-gray-600 hover:bg-white hover:text-blue-600'
          }`}
        >
          {bookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
        </button>
        {/* Gradient overlay */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className={`font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-blue-700 transition-colors ${config.titleSize}`}>
          {news.cleanTitle}
        </h3>
        {rank === 1 && news.cleanDescription && (
          <p className="mt-2 text-sm text-gray-500 line-clamp-2 leading-relaxed">
            {news.cleanDescription}
          </p>
        )}
        <div className="flex items-center justify-between mt-3">
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <Clock className="w-3 h-3" />
            {formatDate(news.pubDate)}
          </span>
          <a
            href={news.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            원문 <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {isSelected && (
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500" />
      )}
    </div>
  );
}
