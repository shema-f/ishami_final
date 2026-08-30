import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { DollarSign, CheckCircle, Clock, XCircle, Search, Filter } from 'lucide-react';
import { adminAPI } from '../../services/api';

interface Payment {
  id: string;
  userId: string;
  amount: number;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  provider: 'MTN' | 'airtel' | string;
  product?: string;
  accessTierGranted?: string;
  userAccessTier?: string;
  createdAt?: string;
  transactionId?: string;
  username?: string;
  email?: string;
}

export default function AdminPayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'SUCCESS' | 'FAILED'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getPayments(1, 50);
      const items: Payment[] = (data.payments || []).map((p: any) => ({
        id: p.id,
        userId: p.userId,
        amount: Number(p.amount || 0),
        status: p.status,
        provider: String(p.provider || '').toLowerCase(),
        product: p.product || 'pro',
        accessTierGranted: p.accessTierGranted || 'quiz',
        userAccessTier: p.userAccessTier || 'free',
        createdAt: p.createdAt,
        transactionId: p.id,
        username: p.username || 'Unknown',
        email: p.email || '',
      }));
      setPayments(items);
    } catch (error) {
      console.error('Failed to load payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = payments
    .filter(p => filter === 'ALL' || p.status === filter)
    .filter(p => {
      const term = searchTerm.toLowerCase();
      return (
        (p.username || '').toLowerCase().includes(term) ||
        (p.email || '').toLowerCase().includes(term) ||
        (p.transactionId || '').toLowerCase().includes(term) ||
        (p.userId || '').toLowerCase().includes(term)
      );
    });

  const stats = {
    total: payments.length,
    success: payments.filter(p => p.status === 'SUCCESS').length,
    pending: payments.filter(p => p.status === 'PENDING').length,
    failed: payments.filter(p => p.status === 'FAILED').length,
    revenue: payments.filter(p => p.status === 'SUCCESS').reduce((sum, p) => sum + p.amount, 0),
    quizTier: payments.filter(p => p.status === 'SUCCESS' && p.accessTierGranted === 'quiz').length,
    fullTier: payments.filter(p => p.status === 'SUCCESS' && p.accessTierGranted === 'full').length,
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'PENDING':
        return <Clock className="w-5 h-5 text-orange-500" />;
      case 'FAILED':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      SUCCESS: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
      PENDING: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
      FAILED: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
    };
    
    return (
      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm ${styles[status as keyof typeof styles]}`}>
        {getStatusIcon(status)}
        <span>{status}</span>
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00A3AD] mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading payments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-gray-900 dark:text-white mb-2">Payment Management</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track all transactions and revenue
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-5 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
          >
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total</p>
            <p className="text-2xl text-gray-900 dark:text-white">{stats.total}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800"
          >
            <p className="text-sm text-green-600 dark:text-green-400 mb-1">Success</p>
            <p className="text-2xl text-green-700 dark:text-green-300">{stats.success}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4 border border-orange-200 dark:border-orange-800"
          >
            <p className="text-sm text-orange-600 dark:text-orange-400 mb-1">Pending</p>
            <p className="text-2xl text-orange-700 dark:text-orange-300">{stats.pending}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 border border-red-200 dark:border-red-800"
          >
            <p className="text-sm text-red-600 dark:text-red-400 mb-1">Failed</p>
            <p className="text-2xl text-red-700 dark:text-red-300">{stats.failed}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-[#00A3AD] to-[#008891] rounded-xl p-4 text-white"
          >
            <p className="text-sm text-white/80 mb-1">Revenue</p>
            <p className="text-2xl">{(stats.revenue / 1000).toFixed(1)}K RWF</p>
          </motion.div>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-6 flex flex-col sm:flex-row gap-4"
        >
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by user, email, or transaction ID..."
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A3AD] text-gray-900 dark:text-white"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as typeof filter)}
              className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A3AD] text-gray-900 dark:text-white"
            >
              <option value="ALL">All Status</option>
              <option value="SUCCESS">Success</option>
              <option value="PENDING">Pending</option>
              <option value="FAILED">Failed</option>
            </select>
          </div>
        </motion.div>

        {/* Payments Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-400">Transaction ID</th>
                  <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-400">User</th>
                  <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-400">Amount</th>
                  <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-400">Tier</th>
                  <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-400">User Access</th>
                  <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-400">Status</th>
                  <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-400">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="py-4 px-6">
                      <code className="text-sm text-gray-900 dark:text-white font-mono">
                        {payment.transactionId}
                      </code>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="text-gray-900 dark:text-white">{payment.username}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">ID: <code className="font-mono text-xs">{payment.userId}</code></p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-gray-900 dark:text-white">{payment.amount} RWF</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        payment.accessTierGranted === 'full'
                          ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                          : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      }`}>
                        {payment.accessTierGranted === 'full' ? 'Full (3K)' : 'Quiz (1K)'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        payment.userAccessTier === 'full'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                          : payment.userAccessTier === 'quiz'
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                            : 'bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400'
                      }`}>
                        {payment.userAccessTier === 'full' ? 'Full' : payment.userAccessTier === 'quiz' ? 'Quiz' : 'Free'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {getStatusBadge(payment.status)}
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-gray-600 dark:text-gray-400 text-sm">
                        {payment.createdAt ? new Date(payment.createdAt).toLocaleString() : '—'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
