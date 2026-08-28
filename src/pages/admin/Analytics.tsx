import { motion } from 'motion/react';
import { BarChart3, Eye, Clock, TrendingUp, Users, ArrowUpRight, Calendar } from 'lucide-react';
import { useArticleAnalytics, type ArticleStats } from '../../contexts/ArticleAnalyticsContext';
import { getAllArticles } from '../../lib/articleStore';

export default function AdminAnalytics() {
  const { getAllStats, getMostViewed, getRecentViews } = useArticleAnalytics();
  
  const allStats = getAllStats();
  const mostViewed = getMostViewed(5);
  const recentViews = getRecentViews(10);

  // Calculate totals
  const totalViews = allStats.reduce((sum, s) => sum + s.totalViews, 0);
  const totalUniqueViews = allStats.reduce((sum, s) => sum + s.uniqueViews, 0);
  const avgReadTime = allStats.length > 0
    ? Math.round(allStats.reduce((sum, s) => sum + s.avgReadTime, 0) / allStats.length)
    : 0;
  const avgCompletionRate = allStats.length > 0
    ? Math.round(allStats.reduce((sum, s) => sum + s.completionRate, 0) / allStats.length)
    : 0;

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getArticleTitle = (articleId: string) => {
    const article = getAllArticles().find(a => a.id === articleId);
    return article ? article.title_en : 'Unknown Article';
  };

  return (
    <div className="min-h-screen bg-[#0a0e14] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Article Analytics</h1>
          <p className="text-gray-400">Track article performance and reader engagement</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-500/20 rounded-xl">
                <Eye className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-gray-400 text-sm">Total Views</span>
            </div>
            <p className="text-3xl font-bold text-white">{totalViews}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-500/20 rounded-xl">
                <Users className="w-5 h-5 text-green-400" />
              </div>
              <span className="text-gray-400 text-sm">Unique Readers</span>
            </div>
            <p className="text-3xl font-bold text-white">{totalUniqueViews}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-500/20 rounded-xl">
                <Clock className="w-5 h-5 text-purple-400" />
              </div>
              <span className="text-gray-400 text-sm">Avg. Read Time</span>
            </div>
            <p className="text-3xl font-bold text-white">{formatDuration(avgReadTime)}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-yellow-500/20 rounded-xl">
                <TrendingUp className="w-5 h-5 text-yellow-400" />
              </div>
              <span className="text-gray-400 text-sm">Completion Rate</span>
            </div>
            <p className="text-3xl font-bold text-white">{avgCompletionRate}%</p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Most Viewed Articles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl font-bold text-white">Most Viewed Articles</h2>
            </div>

            {mostViewed.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No data yet</p>
            ) : (
              <div className="space-y-4">
                {mostViewed.map((stat, index) => {
                  const article = articles.find(a => a.id === stat.articleId);
                  const maxViews = mostViewed[0]?.totalViews || 1;
                  const percentage = (stat.totalViews / maxViews) * 100;

                  return (
                    <div key={stat.articleId} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-gray-500 text-sm font-mono w-6">#{index + 1}</span>
                          <span className="text-white text-sm truncate max-w-[200px]">
                            {article ? (article.title_en.length > 40 ? article.title_en.substring(0, 40) + '...' : article.title_en) : 'Unknown'}
                          </span>
                        </div>
                        <span className="text-gray-400 text-sm">{stat.totalViews} views</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.5, delay: 0.1 * index }}
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="w-5 h-5 text-green-400" />
              <h2 className="text-xl font-bold text-white">Recent Activity</h2>
            </div>

            {recentViews.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No activity yet</p>
            ) : (
              <div className="space-y-3">
                {recentViews.map((view, index) => (
                  <div
                    key={`${view.articleId}-${view.timestamp}-${index}`}
                    className="flex items-center gap-3 p-3 bg-white/5 rounded-xl"
                  >
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <Eye className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm truncate">
                        {getArticleTitle(view.articleId)}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {formatDate(view.timestamp)} · {formatDuration(view.duration)}
                        {view.completed && <span className="text-green-400 ml-2">✓ Completed</span>}
                      </p>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-gray-500" />
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Article Stats Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6"
        >
          <h2 className="text-xl font-bold text-white mb-6">All Articles Performance</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-gray-400 text-sm font-medium pb-4">Article</th>
                  <th className="text-left text-gray-400 text-sm font-medium pb-4">Views</th>
                  <th className="text-left text-gray-400 text-sm font-medium pb-4">Unique</th>
                  <th className="text-left text-gray-400 text-sm font-medium pb-4">Avg. Time</th>
                  <th className="text-left text-gray-400 text-sm font-medium pb-4">Completion</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article) => {
                  const stats = allStats.find(s => s.articleId === article.id);
                  return (
                    <tr key={article.id} className="border-b border-white/5">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
                            <img src={article.image} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="text-white text-sm font-medium truncate max-w-[300px]">
                              {article.title_en}
                            </p>
                            <p className="text-gray-500 text-xs">{article.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-white text-sm">{stats?.totalViews || 0}</td>
                      <td className="py-4 text-white text-sm">{stats?.uniqueViews || 0}</td>
                      <td className="py-4 text-white text-sm">{stats ? formatDuration(stats.avgReadTime) : '-'}</td>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-green-500 rounded-full"
                              style={{ width: `${stats?.completionRate || 0}%` }}
                            />
                          </div>
                          <span className="text-white text-sm">{stats?.completionRate || 0}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
