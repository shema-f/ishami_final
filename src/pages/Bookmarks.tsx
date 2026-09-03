import { motion } from 'motion/react';
import { useState } from 'react';
import { Link } from 'react-router';
import { Bookmark, Clock, Trash2, ArrowRight, BookOpen, History } from 'lucide-react';
import { type Article } from '../data/articles';
import { getAllArticles } from '../lib/articleStore';
import { useTranslation } from '../contexts/I18nContext';
import { useBookmarks } from '../contexts/BookmarksContext';

export default function Bookmarks() {
  const { lang, t } = useTranslation();
  const { bookmarks, readingHistory, removeBookmark, clearHistory, removeFromHistory } = useBookmarks();
  const [activeTab, setActiveTab] = useState<'bookmarks' | 'history'>('bookmarks');

  const allArticles = getAllArticles();
  const bookmarkedArticles = allArticles.filter(a => bookmarks.includes(a.id));
  
  const historyWithArticles = readingHistory.map(item => ({
    ...item,
    article: allArticles.find(a => a.id === item.articleId),
  })).filter(item => item.article);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(lang === 'rw' ? 'rw-RW' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto pt-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex p-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-3xl mb-6 shadow-lg shadow-blue-500/30">
            <Bookmark className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-[family-name:var(--font-heading)]">
            {t('bookmarks.title', "Bookmarks & History")}
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            {t('bookmarks.description', 'View your saved articles and reading history.')}
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center gap-4 mb-8"
        >
          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'bookmarks'
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                : 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            {t('bookmarks.bookmarks_tab', 'Bookmarks')}
            <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">{bookmarks.length}</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'history'
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                : 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10'
            }`}
          >
            <History className="w-4 h-4" />
            {t('bookmarks.history_tab', 'History')}
            <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">{readingHistory.length}</span>
          </button>
        </motion.div>

        {/* Bookmarks Tab */}
        {activeTab === 'bookmarks' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {bookmarkedArticles.length === 0 ? (
              <div className="text-center py-20">
                <Bookmark className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                <h3 className="text-xl font-bold text-white mb-2">
                  {t('bookmarks.no_bookmarks', 'No bookmarks yet')}
                </h3>
                <p className="text-gray-400 mb-6">
                  {t('bookmarks.no_bookmarks_desc', 'Save articles you love to find them easily later.')}
                </p>
                <Link
                  to="/blog"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-all"
                >
                  <BookOpen className="w-4 h-4" />
                  {t('bookmarks.browse_articles', 'Browse Articles')}
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {bookmarkedArticles.map((article, index) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ArticleBookmarkCard article={article} onRemove={() => removeBookmark(article.id)} />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {historyWithArticles.length === 0 ? (
              <div className="text-center py-20">
                <History className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                <h3 className="text-xl font-bold text-white mb-2">
                  {t('bookmarks.no_history', 'No reading history')}
                </h3>
                <p className="text-gray-400 mb-6">
                  {t('bookmarks.no_history_desc', 'Read articles to build your reading history.')}
                </p>
                <Link
                  to="/blog"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-all"
                >
                  <BookOpen className="w-4 h-4" />
                  {t('bookmarks.browse_articles', 'Browse Articles')}
                </Link>
              </div>
            ) : (
              <>
                <div className="flex justify-end mb-4">
                  <button
                    onClick={clearHistory}
                    className="flex items-center gap-2 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    {t('bookmarks.clear_all_history', 'Clear All History')}
                  </button>
                </div>
                <div className="space-y-4">
                  {historyWithArticles.map((item, index) => (
                    <motion.div
                      key={`${item.articleId}-${item.timestamp}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <HistoryCard 
                        item={item} 
                        article={item.article!} 
                        formatDate={formatDate}
                        onRemove={() => removeFromHistory(item.articleId)} 
                      />
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

function ArticleBookmarkCard({ article, onRemove }: { article: Article; onRemove: () => void }) {
  const { lang } = useTranslation();

  return (
    <Link to={`/blog/${article.slug}`}>
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-300 group">
        <div className="flex">
          <div className="w-32 h-32 shrink-0 overflow-hidden">
            <img
              src={article.image}
              alt={lang === 'rw' ? article.title_rw : article.title_en}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="flex-1 p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <span className="text-xs text-blue-400 uppercase tracking-wide font-medium">
                  {lang === 'rw' ? article.category_rw : article.category}
                </span>
                <h3 className="text-white font-bold mt-1 line-clamp-2 group-hover:text-blue-400 transition-colors font-[family-name:var(--font-heading)]">
                  {lang === 'rw' ? article.title_rw : article.title_en}
                </h3>
                <div className="flex items-center gap-2 mt-2 text-gray-500 text-xs">
                  <Clock className="w-3 h-3" />
                  <span>{article.readTime}</span>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onRemove();
                }}
                className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function HistoryCard({ item, article, formatDate, onRemove }: { 
  item: { articleId: string; articleSlug: string; timestamp: number; readPercentage: number }; 
  article: Article; 
  formatDate: (timestamp: number) => string;
  onRemove: () => void;
}) {
  const { lang, t } = useTranslation();

  return (
    <Link to={`/blog/${article.slug}`}>
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 shrink-0 rounded-xl overflow-hidden">
            <img
              src={article.image}
              alt={lang === 'rw' ? article.title_rw : article.title_en}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-bold line-clamp-1 group-hover:text-blue-400 transition-colors">
              {lang === 'rw' ? article.title_rw : article.title_en}
            </h3>
            <div className="flex items-center gap-3 mt-1 text-gray-500 text-xs">
              <span>{formatDate(item.timestamp)}</span>
              <span>·</span>
              <span>{item.readPercentage}% {t('bookmarks.read', 'read')}</span>
            </div>
            <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                style={{ width: `${item.readPercentage}%` }}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onRemove();
              }}
              className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </div>
    </Link>
  );
}
