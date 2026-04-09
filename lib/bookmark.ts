import { BookmarkedNews, ProcessedNewsItem } from './types';

const BOOKMARK_KEY = 'news-ai-bookmarks';

export function getBookmarks(): BookmarkedNews[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(BOOKMARK_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function addBookmark(news: ProcessedNewsItem): BookmarkedNews {
  const bookmarks = getBookmarks();
  const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const newBookmark: BookmarkedNews = {
    ...news,
    id,
    savedAt: new Date().toISOString(),
  };
  const updated = [newBookmark, ...bookmarks].slice(0, 100);
  localStorage.setItem(BOOKMARK_KEY, JSON.stringify(updated));
  return newBookmark;
}

export function removeBookmark(id: string): void {
  const bookmarks = getBookmarks();
  const updated = bookmarks.filter((b) => b.id !== id);
  localStorage.setItem(BOOKMARK_KEY, JSON.stringify(updated));
}

export function isBookmarked(link: string): boolean {
  const bookmarks = getBookmarks();
  return bookmarks.some((b) => b.link === link);
}
