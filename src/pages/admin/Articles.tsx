import { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Edit2, Trash2, Save, X, FileText, Eye, Clock, Send, FileEdit, Search } from 'lucide-react';
import { articles, type Article, type ArticleStatus, type ArticleSEO } from '../../data/articles';
import ImageUpload from '../../components/ImageUpload';

interface ArticleFormData {
  title_en: string;
  title_rw: string;
  excerpt_en: string;
  excerpt_rw: string;
  content_en: string;
  content_rw: string;
  category: string;
  category_rw: string;
  image: string;
  readTime: string;
  status: ArticleStatus;
  publishDate: string;
  seo: ArticleSEO;
}

const emptyForm: ArticleFormData = {
  title_en: '',
  title_rw: '',
  excerpt_en: '',
  excerpt_rw: '',
  content_en: '',
  content_rw: '',
  category: '',
  category_rw: '',
  image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=400&fit=crop',
  readTime: '5 min read',
  status: 'draft',
  publishDate: '',
  seo: {
    metaTitle: '',
    metaTitleRw: '',
    metaDescription: '',
    metaDescriptionRw: '',
    keywords: [],
  },
};

export default function AdminArticles() {
  const [articleList, setArticleList] = useState<Article[]>(articles);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ArticleFormData>(emptyForm);
  const [activeTab, setActiveTab] = useState<'articles' | 'add'>('articles');
  const [statusFilter, setStatusFilter] = useState<'all' | ArticleStatus>('all');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      // Update existing article
      setArticleList(prev => prev.map(a => 
        a.id === editingId 
          ? { ...a, ...formData, slug: formData.title_en.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') }
          : a
      ));
    } else {
      // Add new article
      const newArticle: Article = {
        id: String(Date.now()),
        slug: formData.title_en.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        ...formData,
        date: new Date().toISOString().split('T')[0],
        author: 'ISHAMI Team',
      };
      setArticleList(prev => [newArticle, ...prev]);
    }
    
    setFormData(emptyForm);
    setEditingId(null);
    setShowForm(false);
    setActiveTab('articles');
  };

  const handleEdit = (article: Article) => {
    setFormData({
      title_en: article.title_en,
      title_rw: article.title_rw,
      excerpt_en: article.excerpt_en,
      excerpt_rw: article.excerpt_rw,
      content_en: article.content_en,
      content_rw: article.content_rw,
      category: article.category,
      category_rw: article.category_rw,
      image: article.image,
      readTime: article.readTime,
      status: article.status,
      publishDate: article.publishDate || '',
      seo: article.seo || {
        metaTitle: '',
        metaTitleRw: '',
        metaDescription: '',
        metaDescriptionRw: '',
        keywords: [],
      },
    });
    setEditingId(article.id);
    setShowForm(true);
    setActiveTab('add');
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this article?')) {
      setArticleList(prev => prev.filter(a => a.id !== id));
    }
  };

  const handleCancel = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setShowForm(false);
    setActiveTab('articles');
  };

  return (
    <div className="min-h-screen bg-[#0a0e14] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Article Management</h1>
          <p className="text-gray-400">Create, edit, and manage blog articles</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={() => { setActiveTab('articles'); setShowForm(false); setEditingId(null); }}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'articles'
                ? 'bg-blue-500 text-white'
                : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            <FileText className="w-4 h-4 inline mr-2" />
            Articles ({articleList.length})
          </button>
          <button
            onClick={() => { setActiveTab('add'); setShowForm(true); setEditingId(null); setFormData(emptyForm); }}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'add'
                ? 'bg-blue-500 text-white'
                : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            <Plus className="w-4 h-4 inline mr-2" />
            {editingId ? 'Edit Article' : 'Add Article'}
          </button>
        </div>

        {/* Status Filter */}
        {activeTab === 'articles' && (
          <div className="flex flex-wrap gap-2 mb-6">
            {(['all', 'published', 'draft', 'scheduled'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  statusFilter === status
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                {status !== 'all' && (
                  <span className="ml-2 px-1.5 py-0.5 bg-white/20 rounded text-xs">
                    {articleList.filter(a => a.status === status).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Articles List */}
        {activeTab === 'articles' && (
          <div className="space-y-4">
            {articleList
              .filter(a => statusFilter === 'all' || a.status === statusFilter)
              .map((article) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                    <img src={article.image} alt={article.title_en} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-bold truncate">{article.title_en}</h3>
                    <p className="text-gray-400 text-sm truncate">{article.title_rw}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded">{article.category}</span>
                      <span>{article.readTime}</span>
                      <span>{article.date}</span>
                      <span className={`px-2 py-0.5 rounded flex items-center gap-1 ${
                        article.status === 'published' ? 'bg-green-500/20 text-green-400' :
                        article.status === 'draft' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-purple-500/20 text-purple-400'
                      }`}>
                        {article.status === 'published' && <Send className="w-3 h-3" />}
                        {article.status === 'draft' && <FileEdit className="w-3 h-3" />}
                        {article.status === 'scheduled' && <Clock className="w-3 h-3" />}
                        {article.status.charAt(0).toUpperCase() + article.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={`/blog/${article.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-400 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-all"
                      title="Preview"
                    >
                      <Eye className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => handleEdit(article)}
                      className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(article.id)}
                      className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Article Form */}
        {activeTab === 'add' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6"
          >
            <h2 className="text-xl font-bold text-white mb-6">
              {editingId ? 'Edit Article' : 'Add New Article'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title Section */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Title (English)</label>
                  <input
                    type="text"
                    value={formData.title_en}
                    onChange={(e) => setFormData(prev => ({ ...prev, title_en: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Article title in English"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Title (Kinyarwanda)</label>
                  <input
                    type="text"
                    value={formData.title_rw}
                    onChange={(e) => setFormData(prev => ({ ...prev, title_rw: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ishi ry'inyandiko mu Kinyarwanda"
                    required
                  />
                </div>
              </div>

              {/* Excerpt Section */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Excerpt (English)</label>
                  <textarea
                    value={formData.excerpt_en}
                    onChange={(e) => setFormData(prev => ({ ...prev, excerpt_en: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={3}
                    placeholder="Brief summary in English"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Excerpt (Kinyarwanda)</label>
                  <textarea
                    value={formData.excerpt_rw}
                    onChange={(e) => setFormData(prev => ({ ...prev, excerpt_rw: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={3}
                    placeholder="Ibisobanuro mu Kinyarwanda"
                    required
                  />
                </div>
              </div>

              {/* Content Section */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Content (English)</label>
                  <textarea
                    value={formData.content_en}
                    onChange={(e) => setFormData(prev => ({ ...prev, content_en: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm"
                    rows={12}
                    placeholder="Full article content in English (supports Markdown)"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Content (Kinyarwanda)</label>
                  <textarea
                    value={formData.content_rw}
                    onChange={(e) => setFormData(prev => ({ ...prev, content_rw: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm"
                    rows={12}
                    placeholder="Ibikubiyemo mu Kinyarwanda"
                    required
                  />
                </div>
              </div>

              {/* Category and Meta */}
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Category (English)</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Driving Guide"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Category (Kinyarwanda)</label>
                  <input
                    type="text"
                    value={formData.category_rw}
                    onChange={(e) => setFormData(prev => ({ ...prev, category_rw: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Amabwiriza yo Gutwara"
                    required
                  />
                </div>
              </div>

              {/* Read Time */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Read Time</label>
                <input
                  type="text"
                  value={formData.readTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, readTime: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 5 min read"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Article Image</label>
                <ImageUpload
                  value={formData.image}
                  onChange={(url) => setFormData(prev => ({ ...prev, image: url }))}
                />
              </div>

              {/* SEO Section */}
              <div className="border-t border-white/10 pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Search className="w-5 h-5 text-green-400" />
                  <h3 className="text-lg font-bold text-white">SEO Settings</h3>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Meta Title (English)</label>
                    <input
                      type="text"
                      value={formData.seo.metaTitle || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, seo: { ...prev.seo, metaTitle: e.target.value } }))}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="SEO title (defaults to article title)"
                    />
                    <p className="text-xs text-gray-500 mt-1">{(formData.seo.metaTitle || formData.title_en).length}/60 characters</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Meta Title (Kinyarwanda)</label>
                    <input
                      type="text"
                      value={formData.seo.metaTitleRw || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, seo: { ...prev.seo, metaTitleRw: e.target.value } }))}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ishi ry'SEO (defaults to article title)"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Meta Description (English)</label>
                    <textarea
                      value={formData.seo.metaDescription || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, seo: { ...prev.seo, metaDescription: e.target.value } }))}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows={3}
                      placeholder="SEO description (defaults to excerpt)"
                    />
                    <p className="text-xs text-gray-500 mt-1">{(formData.seo.metaDescription || formData.excerpt_en).length}/160 characters</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Meta Description (Kinyarwanda)</label>
                    <textarea
                      value={formData.seo.metaDescriptionRw || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, seo: { ...prev.seo, metaDescriptionRw: e.target.value } }))}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows={3}
                      placeholder="Ibisobanuro by'SEO (defaults to excerpt)"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Keywords (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.seo.keywords?.join(', ') || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, seo: { ...prev.seo, keywords: e.target.value.split(',').map(k => k.trim()).filter(Boolean) } }))}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="driving, Rwanda, traffic rules, safety"
                  />
                </div>

                {/* Social Preview */}
                <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/10">
                  <p className="text-xs text-gray-400 mb-3 uppercase tracking-wider font-semibold">Social Preview</p>
                  <div className="bg-white rounded-lg overflow-hidden max-w-md">
                    <div className="h-32 bg-gray-200">
                      <img 
                        src={formData.image || 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=400&fit=crop'} 
                        alt="" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="p-3">
                      <p className="text-xs text-gray-500 uppercase">ishami.rw</p>
                      <p className="text-sm font-bold text-gray-900 line-clamp-1">
                        {formData.seo.metaTitle || formData.title_en || 'Article Title'}
                      </p>
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {formData.seo.metaDescription || formData.excerpt_en || 'Article description...'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status and Scheduling */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as ArticleStatus }))}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="draft" className="bg-gray-800">Draft</option>
                    <option value="published" className="bg-gray-800">Published</option>
                    <option value="scheduled" className="bg-gray-800">Scheduled</option>
                  </select>
                </div>
                {formData.status === 'scheduled' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Publish Date</label>
                    <input
                      type="datetime-local"
                      value={formData.publishDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, publishDate: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-3 bg-white/5 border border-white/10 text-gray-300 rounded-xl hover:bg-white/10 transition-all flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {editingId ? 'Update Article' : 
                    formData.status === 'draft' ? 'Save as Draft' :
                    formData.status === 'scheduled' ? 'Schedule Article' : 'Publish Article'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
}
