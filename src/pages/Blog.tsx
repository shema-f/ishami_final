import { motion } from 'motion/react';
import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { Clock, ArrowLeft, BookOpen, Share2, ExternalLink } from 'lucide-react';
import { articles, type Article } from '../data/articles';
import { useTranslation } from '../contexts/I18nContext';

function ArticleCard({ article }: { article: Article }) {
  const { lang } = useTranslation();

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

function ArticleDetail({ article }: { article: Article }) {
  const { lang } = useTranslation();

  const content = lang === 'rw' ? article.content_rw : article.content_en;
  const title = lang === 'rw' ? article.title_rw : article.title_en;

  return (
    <div className="min-h-screen py-8 px-4">
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
          <div className="flex items-center gap-3 text-gray-500 text-sm mb-4">
            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-semibold">
              {lang === 'rw' ? article.category_rw : article.category}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {article.readTime}
            </span>
            <span>{new Date(article.date).toLocaleDateString()}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-[family-name:var(--font-heading)]">
            {title}
          </h1>

          <p className="text-gray-400 text-lg mb-6">
            {lang === 'rw' ? article.excerpt_rw : article.excerpt_en}
          </p>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                I
              </div>
              <span className="text-gray-400 text-sm">{article.author}</span>
            </div>
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

        {/* Ferrivox Ltd Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/20 rounded-2xl p-6 mb-12 text-center"
        >
          <p className="text-sm text-gray-400 mb-1">{lang === 'rw' ? 'Ibikorwa by\' Ishirahamwe' : 'In partnership with'}</p>
          <h3 className="text-lg font-bold text-white font-[family-name:var(--font-heading)]">Ferrivox Ltd</h3>
          <p className="text-gray-400 text-sm">{lang === 'rw' ? 'Ishirahamwe ry\'Ikoranabuhanga n\'Ubufasha bw\'Amakuru' : 'Software Development & Data Engineering Company'}</p>
        </motion.div>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ArticleCard article={article} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
