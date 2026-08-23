import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  Users, DollarSign, BookOpen, TrendingUp, Award, 
  AlertTriangle, CheckCircle, Clock, FileCheck 
} from 'lucide-react';
import { adminAPI, leaderboardAPI } from '../../services/api';
import { useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';

interface AnalyticsData {
  totalUsers: number;
  proUsers: number;
  totalRevenue: number;
  todaySignups: number;
  todayQuizAttempts: number;
  conversionRate: number;
  paymentSuccessRate: number;
  topQuestions: Array<{
    id: string;
    question: string;
    failRate: number;
  }>;
  recentPayments: Array<{
    id: string;
    username: string;
    amount: number;
    status: string;
    date: string;
  }>;
  irembo?: {
    total: number;
    pending: number;
    processing: number;
    submitted: number;
    completed: number;
  };
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [newsletterSubscribers, setNewsletterSubscribers] = useState<number>(0);
  const [newsletterSubject, setNewsletterSubject] = useState('');
  const [newsletterBody, setNewsletterBody] = useState('');
  const [recentCampaigns, setRecentCampaigns] = useState<Array<{ id: string; subject: string; status: string; recipientsCount: number; deliveredCount: number; failedCount: number; sentAt?: string }>>([]);
  const [leaderboard, setLeaderboard] = useState<Array<{ userId: string; username: string; bestScore: number }>>([]);

  useEffect(() => {
    // Check if user is admin
    if (user?.role !== 'admin') {
      navigate('/');
      return;
    }

    loadAnalytics();
    loadNewsletterData();
    loadLeaderboard();
  }, [user, navigate]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadNewsletterData = async () => {
    try {
      const subs = await adminAPI.getNewsletterSubscribers(1, 1);
      setNewsletterSubscribers(subs.total || 0);
      const camps = await adminAPI.getNewsletterCampaigns(1, 5);
      setRecentCampaigns(camps.campaigns || []);
    } catch {}
  };

  const loadLeaderboard = async () => {
    try {
      const lb = await leaderboardAPI.getLeaderboard(10);
      setLeaderboard(lb.leaderboard || []);
    } catch {}
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00A3AD] mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  const statCards = [
    {
      title: 'Total Users',
      value: analytics.totalUsers.toLocaleString(),
      change: `+${analytics.todaySignups} today`,
      icon: <Users className="w-6 h-6" />,
      color: 'from-blue-500 to-blue-700'
    },
    {
      title: 'Pro Users',
      value: analytics.proUsers.toLocaleString(),
      change: `${analytics.conversionRate}% conversion`,
      icon: <Award className="w-6 h-6" />,
      color: 'from-purple-500 to-purple-700'
    },
    {
      title: 'Total Revenue',
      value: `${(analytics.totalRevenue / 1000).toFixed(1)}K RWF`,
      change: 'All time',
      icon: <DollarSign className="w-6 h-6" />,
      color: 'from-green-500 to-green-700'
    },
    {
      title: 'Quiz Attempts',
      value: analytics.todayQuizAttempts.toLocaleString(),
      change: 'Today',
      icon: <BookOpen className="w-6 h-6" />,
      color: 'from-orange-500 to-orange-700'
    }
  ];

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-gray-900 dark:text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Overview of ISHAMI platform performance
          </p>
        </motion.div>

        {/* Stat Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${card.color} text-white`}>
                  {card.icon}
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <h3 className="text-gray-600 dark:text-gray-400 text-sm mb-1">
                {card.title}
              </h3>
              <p className="text-2xl text-gray-900 dark:text-white mb-1">
                {card.value}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                {card.change}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Payment Success Rate */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-gray-900 dark:text-white mb-4">
              Payment Success Rate
            </h3>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${analytics.paymentSuccessRate}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-gradient-to-r from-green-500 to-green-700"
                  />
                </div>
              </div>
              <span className="text-2xl text-gray-900 dark:text-white">
                {analytics.paymentSuccessRate}%
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Excellent! Most payments are processing successfully.
            </p>
          </motion.div>

          {/* Conversion Rate */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-gray-900 dark:text-white mb-4">
              Free to Pro Conversion
            </h3>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${analytics.conversionRate}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-gradient-to-r from-purple-500 to-purple-700"
                  />
                </div>
              </div>
              <span className="text-2xl text-gray-900 dark:text-white">
                {analytics.conversionRate}%
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {analytics.conversionRate > 10 ? 'Great conversion rate!' : 'Room for improvement'}
            </p>
          </motion.div>
        </div>

        {/* Top Failed Questions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-gray-900 dark:text-white">
              Most Failed Questions
            </h3>
            <AlertTriangle className="w-5 h-5 text-orange-500" />
          </div>
          
          <div className="space-y-4">
            {(analytics.topQuestions || []).map((question, index) => (
              <div key={question.id} className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 dark:text-orange-400 text-sm">
                    #{index + 1}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 dark:text-white mb-1">
                    {question.question}
                  </p>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-red-500"
                      style={{ width: `${question.failRate}%` }}
                    />
                  </div>
                </div>
                <span className="text-red-500">{question.failRate}%</span>
              </div>
            ))}
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
            💡 Consider reviewing these questions or adding more explanation.
          </p>
        </motion.div>

        {/* Recent Payments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-gray-900 dark:text-white mb-6">
            Recent Payments
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400">User</th>
                  <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400">Amount</th>
                  <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400">Status</th>
                  <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400">Time</th>
                </tr>
              </thead>
              <tbody>
                {(analytics.recentPayments || []).map((payment) => (
                  <tr key={payment.id} className="border-b border-gray-100 dark:border-gray-700">
                    <td className="py-3 px-4 text-gray-900 dark:text-white">
                      {payment.username}
                    </td>
                    <td className="py-3 px-4 text-gray-900 dark:text-white">
                      {payment.amount} RWF
                    </td>
                    <td className="py-3 px-4">
                      {payment.status === 'SUCCESS' ? (
                        <span className="inline-flex items-center space-x-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full text-sm">
                          <CheckCircle className="w-4 h-4" />
                          <span>Success</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full text-sm">
                          <Clock className="w-4 h-4" />
                          <span>Pending</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400 text-sm">
                      {new Date(payment.date).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Irembo Applications Summary */}
        {analytics.irembo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 mt-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <FileCheck className="w-6 h-6 text-[#00A3AD]" />
                <h3 className="text-gray-900 dark:text-white">Irembo Applications</h3>
              </div>
              <a
                href="/admin/irembo"
                className="text-sm text-[#00A3AD] hover:underline"
              >
                View All →
              </a>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <p className="text-2xl text-gray-900 dark:text-white">{analytics.irembo.total}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Total</p>
              </div>
              <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
                <p className="text-2xl text-orange-600 dark:text-orange-400">{analytics.irembo.pending}</p>
                <p className="text-xs text-orange-600 dark:text-orange-400">Pending</p>
              </div>
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <p className="text-2xl text-blue-600 dark:text-blue-400">{analytics.irembo.processing}</p>
                <p className="text-xs text-blue-600 dark:text-blue-400">Processing</p>
              </div>
              <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                <p className="text-2xl text-purple-600 dark:text-purple-400">{analytics.irembo.submitted}</p>
                <p className="text-xs text-purple-600 dark:text-purple-400">Submitted</p>
              </div>
              <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                <p className="text-2xl text-green-600 dark:text-green-400">{analytics.irembo.completed}</p>
                <p className="text-xs text-green-600 dark:text-green-400">Completed</p>
              </div>
            </div>
            {analytics.irembo.pending > 0 && (
              <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-orange-500" />
                <span className="text-sm text-orange-700 dark:text-orange-300">
                  {analytics.irembo.pending} application{analytics.irembo.pending !== 1 ? 's' : ''} need{analytics.irembo.pending === 1 ? 's' : ''} review
                </span>
              </div>
            )}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 mt-8"
        >
          <h3 className="text-gray-900 dark:text-white mb-4">Newsletter</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Subscribers: {newsletterSubscribers}</p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <input
                type="text"
                value={newsletterSubject}
                onChange={(e) => setNewsletterSubject(e.target.value)}
                placeholder="Subject"
                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl"
              />
              <textarea
                value={newsletterBody}
                onChange={(e) => setNewsletterBody(e.target.value)}
                placeholder="Message"
                rows={5}
                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl"
              />
              <button
                onClick={async () => {
                  if (!newsletterSubject || !newsletterBody) return;
                  const r = await adminAPI.sendNewsletter(newsletterSubject, newsletterBody);
                  setNewsletterSubject('');
                  setNewsletterBody('');
                  await loadNewsletterData();
                }}
                className="px-6 py-3 bg-gradient-to-r from-[#00A3AD] to-[#008891] text-white rounded-xl"
              >
                Send Newsletter
              </button>
            </div>
            <div>
              <h4 className="text-gray-900 dark:text-white mb-2">Recent Campaigns</h4>
              <div className="space-y-3">
                {recentCampaigns.map(c => (
                  <div key={c.id} className="border rounded-xl p-4 bg-white dark:bg-gray-700">
                    <p className="text-gray-900 dark:text-white">{c.subject}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{c.status} • {c.recipientsCount} recipients • {c.deliveredCount} delivered</p>
                  </div>
                ))}
                {recentCampaigns.length === 0 && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">No campaigns yet</p>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 mt-8"
        >
          <h3 className="text-gray-900 dark:text-white mb-4">Top Learners</h3>
          <div className="space-y-3">
            {leaderboard.map((e, i) => (
              <div key={e.userId} className="flex items-center justify-between border rounded-xl p-4 bg-white dark:bg-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-[#00A3AD]/10 text-[#00A3AD] flex items-center justify-center">{i+1}</div>
                  <p className="text-gray-900 dark:text-white">{e.username}</p>
                </div>
                <span className="text-gray-600 dark:text-gray-400">Best Score: {e.bestScore}</span>
              </div>
            ))}
            {leaderboard.length === 0 && (
              <p className="text-sm text-gray-600 dark:text-gray-400">No leaderboard entries yet</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
