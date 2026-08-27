import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

export interface ReadingHistoryItem {
  articleId: string;
  articleSlug: string;
  timestamp: number;
  readPercentage: number;
}

interface BookmarksContextType {
  bookmarks: string[];
  readingHistory: ReadingHistoryItem[];
  addBookmark: (articleId: string) => void;
  removeBookmark: (articleId: string) => void;
  isBookmarked: (articleId: string) => boolean;
  addToHistory: (articleId: string, articleSlug: string, readPercentage: number) => void;
  removeFromHistory: (articleId: string) => void;
  clearHistory: () => void;
  getHistory: () => ReadingHistoryItem[];
}

const BookmarksContext = createContext<BookmarksContextType | undefined>(undefined);

export function BookmarksProvider({ children }: { children: ReactNode }) {
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('article_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [readingHistory, setReadingHistory] = useState<ReadingHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('reading_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persist bookmarks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('article_bookmarks', JSON.stringify(bookmarks));
    } catch {
      // localStorage not available
    }
  }, [bookmarks]);

  // Persist reading history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('reading_history', JSON.stringify(readingHistory));
    } catch {
      // localStorage not available
    }
  }, [readingHistory]);

  const addBookmark = useCallback((articleId: string) => {
    setBookmarks(prev => {
      if (prev.includes(articleId)) return prev;
      return [...prev, articleId];
    });
  }, []);

  const removeBookmark = useCallback((articleId: string) => {
    setBookmarks(prev => prev.filter(id => id !== articleId));
  }, []);

  const isBookmarked = useCallback((articleId: string) => {
    return bookmarks.includes(articleId);
  }, [bookmarks]);

  const addToHistory = useCallback((articleId: string, articleSlug: string, readPercentage: number) => {
    setReadingHistory(prev => {
      // Remove existing entry for this article
      const filtered = prev.filter(item => item.articleId !== articleId);
      // Add new entry at the beginning
      return [
        {
          articleId,
          articleSlug,
          timestamp: Date.now(),
          readPercentage,
        },
        ...filtered,
      ].slice(0, 50); // Keep only last 50 items
    });
  }, []);

  const removeFromHistory = useCallback((articleId: string) => {
    setReadingHistory(prev => prev.filter(item => item.articleId !== articleId));
  }, []);

  const clearHistory = useCallback(() => {
    setReadingHistory([]);
  }, []);

  const getHistory = useCallback(() => {
    return readingHistory;
  }, [readingHistory]);

  return (
    <BookmarksContext.Provider
      value={{
        bookmarks,
        readingHistory,
        addBookmark,
        removeBookmark,
        isBookmarked,
        addToHistory,
        removeFromHistory,
        clearHistory,
        getHistory,
      }}
    >
      {children}
    </BookmarksContext.Provider>
  );
}

export function useBookmarks() {
  const context = useContext(BookmarksContext);
  if (!context) {
    throw new Error('useBookmarks must be used within a BookmarksProvider');
  }
  return context;
}
