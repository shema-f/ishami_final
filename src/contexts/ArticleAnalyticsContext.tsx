import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

export interface ArticleView {
  articleId: string;
  timestamp: number;
  duration: number; // time spent in seconds
  completed: boolean; // read more than 80%
}

export interface ArticleStats {
  articleId: string;
  totalViews: number;
  uniqueViews: number;
  avgReadTime: number; // seconds
  completionRate: number; // percentage
  lastViewed: number;
}

interface ArticleAnalyticsContextType {
  views: ArticleView[];
  trackView: (articleId: string) => void;
  updateViewDuration: (articleId: string, duration: number) => void;
  markCompleted: (articleId: string) => void;
  getArticleStats: (articleId: string) => ArticleStats;
  getAllStats: () => ArticleStats[];
  getMostViewed: (limit?: number) => ArticleStats[];
  getRecentViews: (limit?: number) => ArticleView[];
}

const ArticleAnalyticsContext = createContext<ArticleAnalyticsContextType | undefined>(undefined);

export function ArticleAnalyticsProvider({ children }: { children: ReactNode }) {
  const [views, setViews] = useState<ArticleView[]>(() => {
    try {
      const saved = localStorage.getItem('article_analytics');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('article_analytics', JSON.stringify(views));
    } catch {}
  }, [views]);

  const trackView = useCallback((articleId: string) => {
    const newView: ArticleView = {
      articleId,
      timestamp: Date.now(),
      duration: 0,
      completed: false,
    };
    setViews(prev => [newView, ...prev].slice(0, 1000)); // Keep last 1000 views
  }, []);

  const updateViewDuration = useCallback((articleId: string, duration: number) => {
    setViews(prev => {
      const latestViewIndex = prev.findIndex(v => v.articleId === articleId);
      if (latestViewIndex === -1) return prev;
      
      const updated = [...prev];
      updated[latestViewIndex] = {
        ...updated[latestViewIndex],
        duration: Math.max(updated[latestViewIndex].duration, duration),
      };
      return updated;
    });
  }, []);

  const markCompleted = useCallback((articleId: string) => {
    setViews(prev => {
      const latestViewIndex = prev.findIndex(v => v.articleId === articleId);
      if (latestViewIndex === -1) return prev;
      
      const updated = [...prev];
      updated[latestViewIndex] = {
        ...updated[latestViewIndex],
        completed: true,
      };
      return updated;
    });
  }, []);

  const getArticleStats = useCallback((articleId: string): ArticleStats => {
    const articleViews = views.filter(v => v.articleId === articleId);
    const totalViews = articleViews.length;
    
    // Unique views (by day)
    const uniqueDays = new Set(
      articleViews.map(v => new Date(v.timestamp).toDateString())
    );
    const uniqueViews = uniqueDays.size;
    
    // Average read time
    const viewsWithDuration = articleViews.filter(v => v.duration > 0);
    const avgReadTime = viewsWithDuration.length > 0
      ? Math.round(viewsWithDuration.reduce((sum, v) => sum + v.duration, 0) / viewsWithDuration.length)
      : 0;
    
    // Completion rate
    const completedViews = articleViews.filter(v => v.completed).length;
    const completionRate = totalViews > 0 ? Math.round((completedViews / totalViews) * 100) : 0;
    
    // Last viewed
    const lastViewed = articleViews.length > 0 ? articleViews[0].timestamp : 0;

    return {
      articleId,
      totalViews,
      uniqueViews,
      avgReadTime,
      completionRate,
      lastViewed,
    };
  }, [views]);

  const getAllStats = useCallback((): ArticleStats[] => {
    const articleIds = new Set(views.map(v => v.articleId));
    return Array.from(articleIds).map(id => getArticleStats(id));
  }, [views, getArticleStats]);

  const getMostViewed = useCallback((limit = 10): ArticleStats[] => {
    return getAllStats()
      .sort((a, b) => b.totalViews - a.totalViews)
      .slice(0, limit);
  }, [getAllStats]);

  const getRecentViews = useCallback((limit = 20): ArticleView[] => {
    return views.slice(0, limit);
  }, [views]);

  return (
    <ArticleAnalyticsContext.Provider
      value={{
        views,
        trackView,
        updateViewDuration,
        markCompleted,
        getArticleStats,
        getAllStats,
        getMostViewed,
        getRecentViews,
      }}
    >
      {children}
    </ArticleAnalyticsContext.Provider>
  );
}

export function useArticleAnalytics() {
  const context = useContext(ArticleAnalyticsContext);
  if (!context) {
    throw new Error('useArticleAnalytics must be used within an ArticleAnalyticsProvider');
  }
  return context;
}
