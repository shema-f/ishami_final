import { motion, AnimatePresence } from 'motion/react';
import { useState, useMemo, useEffect } from 'react';
import { Link, useParams } from 'react-router';
import { Clock, ArrowLeft, BookOpen, Share2, ExternalLink, Copy, Check, Search, Filter, X, Bookmark, BookmarkCheck } from 'lucide-react';
import { articles, type Article } from '../data/articles';
import { useTranslation } from '../contexts/I18nContext';
import { useBookmarks } from '../contexts/BookmarksContext';
import Comments from '../components/Comments';

function ArticleCard({ article }: { article: Article }) {
  const { lang } = useTranslation();
  const { isBookmarked, addBookmark, removeBookmark } = useBookmarks();
  const bookmarked = isBookmarked(article.id);

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (bookmarked) {
      removeBookmark(article.id);
    } else {
      addBookmark(article.id);
    }
  };

  return (
    <Link to={`/blog/${article.slug}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -6 }}
        className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
      >
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={article.image}
            alt={lang === 'rw' ? article.title_rw : article.title_en}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-blue-500/90 backdrop-blur-sm text-white text-xs rounded-full font-semibold">
              {lang === 'rw' ? article.category_rw : article.category}
            </span>
          </div>
          {/* Bookmark Button */}
          <button
            onClick={handleBookmarkClick}
            className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-sm transition-all ${
              bookmarked 
                ? 'bg-blue-500/90 text-white' 
                : 'bg-black/30 text-white hover:bg-black/50'
            }`}
          >
            {bookmarked ? (
              <BookmarkCheck className="w-4 h-4" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center gap-3 text-gray-500 text-xs mb-3">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {article.readTime}
            </span>
            <span>·</span>
            <span>{new Date(article.date).toLocaleDateString()}</span>
          </div>

          <h3 className="text-white text-lg font-bold mb-2 font-[family-name:var(--font-heading)] group-hover:text-blue-400 transition-colors line-clamp-2">
            {lang === 'rw' ? article.title_rw : article.title_en}
          </h3>

          <p className="text-gray-400 text-sm line-clamp-3">
            {lang === 'rw' ? article.excerpt_rw : article.excerpt_en}
          </p>

          <div className="mt-4 flex items-center text-blue-400 text-sm font-medium">
            <span>{lang === 'rw' ? 'Soma byinshi' : 'Read more'}</span>
            <ExternalLink className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

function ShareButtons({ title, slug }: { title: string; slug: string }) {
  const { lang } = useTranslation();
  const [copied, setCopied] = useState(false);
  const url = typeof window !== 'undefined' ? `${window.location.origin}/blog/${slug}` : '';
  const shareText = `${title} — ISHAMI`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-sm text-gray-400 font-medium">{lang === 'rw' ? 'Sangiza:' : 'Share:'}</span>
      
      {/* Facebook */}
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1877F2]/10 border border-[#1877F2]/20 text-[#1877F2] hover:bg-[#1877F2]/20 transition-all text-sm font-medium"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
        Facebook
      </a>

      {/* WhatsApp */}
      <a
        href={`https://wa.me/?text=${encodeURIComponent(`${shareText}\n${url}`)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#25D366]/10 border border-[#25D366]/20 text-[#25D366] hover:bg-[#25D366]/20 transition-all text-sm font-medium"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        WhatsApp
      </a>

      {/* Twitter/X */}
      <a
        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(shareText)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#000000]/10 border border-[#000000]/20 text-white hover:bg-[#000000]/20 transition-all text-sm font-medium"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
        X
      </a>

      {/* LinkedIn */}
      <a
        href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(shareText)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0A66C2]/10 border border-[#0A66C2]/20 text-[#0A66C2] hover:bg-[#0A66C2]/20 transition-all text-sm font-medium"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
        LinkedIn
      </a>

      {/* Copy Link */}
      <button
        onClick={handleCopy}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white transition-all text-sm font-medium"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-green-400" />
            <span className="text-green-400">{lang === 'rw' ? 'Byakoporowe!' : 'Copied!'}</span>
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" />
            {lang === 'rw' ? 'Koporora ihuza' : 'Copy link'}
          </>
        )}
      </button>
    </div>
  );
}

function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        setProgress(Math.min((scrollTop / docHeight) * 100, 100));
      }
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-50 h-1 bg-white/10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
        style={{ width: `${progress}%` }}
        transition={{ duration: 0.1 }}
      />
    </motion.div>
  );
}

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

function RelatedArticles({ currentArticle }: { currentArticle: Article }) {
  const { lang } = useTranslation();

  const relatedArticles = useMemo(() => {
    const category = lang === 'rw' ? currentArticle.category_rw : currentArticle.category;
    return articles
      .filter(a => 
        a.id !== currentArticle.id && 
        (lang === 'rw' ? a.category_rw : a.category) === category
      )
      .slice(0, 2);
  }, [currentArticle, lang]);

  // If no same-category articles, get 2 random articles
  const displayArticles = useMemo(() => {
    if (relatedArticles.length >= 2) return relatedArticles;
    return articles
      .filter(a => a.id !== currentArticle.id && !relatedArticles.find(r => r.id === a.id))
      .slice(0, 2 - relatedArticles.length)
      .concat(relatedArticles);
  }, [relatedArticles, currentArticle]);

  if (displayArticles.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mt-12 mb-8"
    >
      <h2 className="text-2xl font-bold text-white mb-6 font-[family-name:var(--font-heading)]">
        {lang === 'rw' ? 'Inyandiko Zikurikira' : 'Related Articles'}
      </h2>
      <div className="grid md:grid-cols-2 gap-6">
        {displayArticles.map((related) => (
          <Link key={related.id} to={`/blog/${related.slug}`}>
            <motion.div
              whileHover={{ y: -4 }}
              className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
            >
              <div className="relative h-40 overflow-hidden">
                <img
                  src={related.image}
                  alt={lang === 'rw' ? related.title_rw : related.title_en}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className="px-2 py-1 bg-blue-500/90 backdrop-blur-sm text-white text-xs rounded-full font-semibold">
                    {lang === 'rw' ? related.category_rw : related.category}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-white font-bold mb-2 group-hover:text-blue-400 transition-colors line-clamp-2 font-[family-name:var(--font-heading)]">
                  {lang === 'rw' ? related.title_rw : related.title_en}
                </h3>
                <p className="text-gray-400 text-sm line-clamp-2">
                  {lang === 'rw' ? related.excerpt_rw : related.excerpt_en}
                </p>
                <div className="mt-3 flex items-center gap-2 text-gray-500 text-xs">
                  <Clock className="w-3 h-3" />
                  <span>{related.readTime}</span>
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}

function ArticleDetail({ article }: { article: Article }) {
  const { lang } = useTranslation();
  const { isBookmarked, addBookmark, removeBookmark, addToHistory } = useBookmarks();
  const bookmarked = isBookmarked(article.id);

  const content = lang === 'rw' ? article.content_rw : article.content_en;
  const title = lang === 'rw' ? article.title_rw : article.title_en;
  const readTime = calculateReadingTime(content);

  // Track reading progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const percentage = Math.min(Math.round((scrollTop / docHeight) * 100), 100);
        addToHistory(article.id, article.slug, percentage);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [article.id, article.slug, addToHistory]);

  const handleBookmarkClick = () => {
    if (bookmarked) {
      removeBookmark(article.id);
    } else {
      addBookmark(article.id);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <ReadingProgress />
      <div className="max-w-4xl mx-auto pt-16">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link
            to="/blog"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">{lang === 'rw' ? 'Subira inyuma' : 'Back to Articles'}</span>
          </Link>
        </motion.div>

        {/* Article Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-wrap items-center gap-3 text-gray-500 text-sm mb-4">
            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-semibold">
              {lang === 'rw' ? article.category_rw : article.category}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {lang === 'rw' ? `${readTime} min isoma` : `${readTime} min read`}
            </span>
            <span>{new Date(article.date).toLocaleDateString()}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-[family-name:var(--font-heading)]">
            {title}
          </h1>

          <p className="text-gray-400 text-lg mb-6">
            {lang === 'rw' ? article.excerpt_rw : article.excerpt_en}
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                I
              </div>
              <span className="text-gray-400 text-sm">{article.author}</span>
            </div>
          </div>

          {/* Bookmark and Share Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Bookmark Button */}
            <button
              onClick={handleBookmarkClick}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl transition-all text-sm font-medium ${
                bookmarked 
                  ? 'bg-blue-500/20 border border-blue-500/30 text-blue-400' 
                  : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              {bookmarked ? (
                <>
                  <BookmarkCheck className="w-4 h-4" />
                  {lang === 'rw' ? 'Byabitswe' : 'Bookmarked'}
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4" />
                  {lang === 'rw' ? 'Bika' : 'Bookmark'}
                </>
              )}
            </button>
          </div>

          {/* Social Share Buttons */}
          <div className="mt-4">
            <ShareButtons title={title} slug={article.slug} />
          </div>
        </motion.div>

        {/* Featured Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <img
            src={article.image}
            alt={title}
            className="w-full h-64 sm:h-80 object-cover rounded-3xl border border-white/10"
          />
        </motion.div>

        {/* Article Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 sm:p-12 mb-12"
        >
          <div className="prose prose-invert prose-blue max-w-none">
            {content.split('\n').map((line, i) => {
              if (line.startsWith('## ')) {
                return <h2 key={i} className="text-2xl font-bold text-white mt-8 mb-4 font-[family-name:var(--font-heading)]">{line.replace('## ', '')}</h2>;
              }
              if (line.startsWith('### ')) {
                return <h3 key={i} className="text-xl font-bold text-white mt-6 mb-3 font-[family-name:var(--font-heading)]">{line.replace('### ', '')}</h3>;
              }
              if (line.startsWith('- **')) {
                const parts = line.replace('- **', '').split('**');
                return (
                  <div key={i} className="flex items-start gap-3 mb-2 ml-4">
                    <span className="text-blue-400 mt-1">•</span>
                    <p className="text-gray-300">
                      <strong className="text-white">{parts[0]}</strong>
                      {parts[1] || ''}
                    </p>
                  </div>
                );
              }
              if (line.startsWith('- ')) {
                return (
                  <div key={i} className="flex items-start gap-3 mb-2 ml-4">
                    <span className="text-blue-400 mt-1">•</span>
                    <p className="text-gray-300">{line.replace('- ', '')}</p>
                  </div>
                );
              }
              if (line.match(/^\d+\. /)) {
                return (
                  <div key={i} className="flex items-start gap-3 mb-2 ml-4">
                    <span className="text-blue-400 font-bold mt-0.5">{line.match(/^(\d+)\./)?.[1]}.</span>
                    <p className="text-gray-300">{line.replace(/^\d+\. /, '')}</p>
                  </div>
                );
              }
              if (line.startsWith('|')) {
                return null; // Skip table rows for simplicity
              }
              if (line.trim() === '') {
                return <div key={i} className="h-2" />;
              }
              return <p key={i} className="text-gray-300 mb-2 leading-relaxed">{line}</p>;
            })}
          </div>
        </motion.div>

        {/* Comments Section */}
        <Comments articleId={article.id} />

        {/* Related Articles */}
        <RelatedArticles currentArticle={article} />

        {/* Ferrivox Ltd Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-[#111827] to-[#030712] rounded-3xl p-8 border border-white/10 mb-8"
        >
          <div className="text-center">
            <p className="text-sm text-gray-400 mb-2">{lang === 'rw' ? 'Ibikorwa by\' Ishirahamwe' : 'Powered by'}</p>
            <h3 className="text-2xl font-bold text-white mb-2 font-[family-name:var(--font-heading)]">Ferrivox Ltd</h3>
            <p className="text-gray-400 text-sm mb-4">
              {lang === 'rw' ? 'Ishirahamwe ry\'Ikoranabuhanga n\'Ubufasha bw\'Amakuru' : 'Software Development & Data Engineering Company'}
            </p>
            <a
              href="https://ferrivox.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-sm font-medium hover:bg-white/20 transition-all"
            >
              {lang === 'rw' ? 'Visit Ferrivox' : 'Visit Ferrivox'}
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function Blog() {
  const { slug } = useParams();
  const { lang, t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(articles.map(a => lang === 'rw' ? a.category_rw : a.category));
    return Array.from(cats);
  }, [lang]);

  // Filter articles
  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      const title = lang === 'rw' ? article.title_rw : article.title_en;
      const excerpt = lang === 'rw' ? article.excerpt_rw : article.excerpt_en;
      const category = lang === 'rw' ? article.category_rw : article.category;
      
      const matchesSearch = !searchQuery || 
        title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = !selectedCategory || category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, lang]);

  // If slug is provided, show article detail
  if (slug) {
    const article = articles.find(a => a.slug === slug);
    if (!article) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">{lang === 'rw' ? 'Inyandiko ntibonetse' : 'Article not found'}</h2>
            <Link to="/blog" className="text-blue-400 hover:text-blue-300">{lang === 'rw' ? 'Subira ku nyandiko' : 'Back to articles'}</Link>
          </div>
        </div>
      );
    }
    return <ArticleDetail article={article} />;
  }

  // Article listing
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto pt-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex p-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-3xl mb-6 shadow-lg shadow-blue-500/30">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-[family-name:var(--font-heading)]">
            {lang === 'rw' ? "Inyandiko n'Amateka" : 'Articles & Blog'}
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            {lang === 'rw'
              ? 'Soma amategeko y\'umuhanda, amabwiriza yo gutwara, n\'inkuru zingenzi ziri mu Kinyarwanda n\'Icyongereza.'
              : 'Read traffic rules, driving guides, and important articles in both English and Kinyarwanda.'}
          </p>
        </motion.div>

        {/* Search and Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          {/* Search Bar */}
          <div className="relative mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === 'rw' ? 'Shakisha inyandiko...' : 'Search articles...'}
                className="w-full pl-12 pr-12 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 text-gray-400 mr-2">
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">{lang === 'rw' ? 'Gushungura:' : 'Filter:'}</span>
            </div>
            
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                !selectedCategory
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                  : 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10 hover:text-white'
              }`}
            >
              {lang === 'rw' ? 'Byose' : 'All'}
            </button>
            
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category === selectedCategory ? null : category)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Ferrivox Ltd Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/20 rounded-2xl p-6 mb-12 text-center"
        >
          <p className="text-sm text-gray-400 mb-1">{lang === 'rw' ? 'Ibikorwa by\' Ishirahamwe' : 'In partnership with'}</p>
          <h3 className="text-lg font-bold text-white font-[family-name:var(--font-heading)]">Ferrivox Ltd</h3>
          <p className="text-gray-400 text-sm">{lang === 'rw' ? 'Ishirahamwe ry\'Ikoranabuhanga n\'Ubufasha bw\'Amakuru' : 'Software Development & Data Engineering Company'}</p>
        </motion.div>

        {/* Articles Count */}
        <div className="mb-6 text-gray-400 text-sm">
          {filteredArticles.length === articles.length 
            ? (lang === 'rw' ? `Inyandiko ${articles.length}` : `${articles.length} articles`)
            : (lang === 'rw' ? `Inyandiko ${filteredArticles.length} kuri ${articles.length}` : `${filteredArticles.length} of ${articles.length} articles`)
          }
        </div>

        {/* Articles Grid */}
        <AnimatePresence mode="wait">
          {filteredArticles.length > 0 ? (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredArticles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ArticleCard article={article} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-20"
            >
              <Search className="w-16 h-16 mx-auto mb-4 text-gray-600" />
              <h3 className="text-xl font-bold text-white mb-2">{lang === 'rw' ? 'Nta nyandiko zibonetse' : 'No articles found'}</h3>
              <p className="text-gray-400 mb-6">
                {lang === 'rw' 
                  ? 'Kurikira inama cyangwa uzure amagambo yindi' 
                  : 'Try adjusting your search or filter criteria'}
              </p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory(null); }}
                className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 transition-all"
              >
                {lang === 'rw' ? 'Siba Gushungura' : 'Clear Filters'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
