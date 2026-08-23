import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Shield, AlertTriangle, Search, Filter, Eye, Ban, CheckCircle } from 'lucide-react';
import { adminAPI } from '../../services/api';

interface FraudLog {
  id: string;
  userId: string;
  username: string;
  email: string;
  type: 'SUSPICIOUS_LOGIN' | 'MULTIPLE_ACCOUNTS' | 'PAYMENT_FRAUD' | 'CHEATING' | 'OTHER';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  status: 'PENDING' | 'INVESTIGATING' | 'RESOLVED' | 'FALSE_POSITIVE';
  createdAt?: string;
  resolvedAt?: string;
}

export default function AdminFraudLogs() {
  const [logs, setLogs] = useState<FraudLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'INVESTIGATING' | 'RESOLVED' | 'FALSE_POSITIVE'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLog, setSelectedLog] = useState<FraudLog | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    loadFraudLogs();
  }, []);

  const loadFraudLogs = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getFraudLogs(1, 100);
      const items: FraudLog[] = (data.logs || []).map((log: any) => ({
        id: log.id,
        userId: log.userId,
        username: log.username || 'Unknown',
        email: log.email || '',
        type: log.type || 'OTHER',
        severity: log.severity || 'LOW',
        description: log.description || '',
        status: log.status || 'PENDING',
        createdAt: log.createdAt,
        resolvedAt: log.resolvedAt,
      }));
      setLogs(items);
    } catch (error) {
      console.error('Failed to load fraud logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (logId: string, newStatus: string) => {
    try {
      // Update the log status
      setLogs(logs.map(log => 
        log.id === logId ? { ...log, status: newStatus as any } : log
      ));
      setShowDetailModal(false);
      setSelectedLog(null);
    } catch (error) {
      console.error('Failed to update fraud log:', error);
    }
  };

  const filteredLogs = logs
    .filter(log => filter === 'ALL' || log.status === filter)
    .filter(log => {
      const term = searchTerm.toLowerCase();
      return (
        (log.username || '').toLowerCase().includes(term) ||
        (log.email || '').toLowerCase().includes(term) ||
        (log.description || '').toLowerCase().includes(term)
      );
    });

  const stats = {
    total: logs.length,
    pending: logs.filter(l => l.status === 'PENDING').length,
    investigating: logs.filter(l => l.status === 'INVESTIGATING').length,
    resolved: logs.filter(l => l.status === 'RESOLVED').length,
    critical: logs.filter(l => l.severity === 'CRITICAL').length,
  };

  const getSeverityBadge = (severity: string) => {
    const styles = {
      LOW: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
      MEDIUM: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
      HIGH: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
      CRITICAL: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
    };
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${styles[severity as keyof typeof styles]}`}>
        {severity}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      PENDING: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
      INVESTIGATING: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
      RESOLVED: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
      FALSE_POSITIVE: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
    };
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${styles[status as keyof typeof styles]}`}>
        {status.replace(/_/g, ' ')}
      </span>
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'SUSPICIOUS_LOGIN':
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'MULTIPLE_ACCOUNTS':
        return <Ban className="w-5 h-5 text-red-500" />;
      case 'PAYMENT_FRAUD':
        return <Shield className="w-5 h-5 text-purple-500" />;
      case 'CHEATING':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Shield className="w-5 h-5 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00A3AD] mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading fraud logs...</p>
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
          <h1 className="text-gray-900 dark:text-white mb-2">Fraud Detection Logs</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor and investigate suspicious activities
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid md:grid-cols-5 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
          >
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Alerts</p>
            <p className="text-2xl text-gray-900 dark:text-white">{stats.total}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4 border border-orange-200 dark:border-orange-800"
          >
            <p className="text-sm text-orange-600 dark:text-orange-400 mb-1">Pending Review</p>
            <p className="text-2xl text-orange-700 dark:text-orange-300">{stats.pending}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800"
          >
            <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">Investigating</p>
            <p className="text-2xl text-blue-700 dark:text-blue-300">{stats.investigating}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800"
          >
            <p className="text-sm text-green-600 dark:text-green-400 mb-1">Resolved</p>
            <p className="text-2xl text-green-700 dark:text-green-300">{stats.resolved}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 border border-red-200 dark:border-red-800"
          >
            <p className="text-sm text-red-600 dark:text-red-400 mb-1">Critical</p>
            <p className="text-2xl text-red-700 dark:text-red-300">{stats.critical}</p>
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
              placeholder="Search by user, email, or description..."
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
              <option value="PENDING">Pending</option>
              <option value="INVESTIGATING">Investigating</option>
              <option value="RESOLVED">Resolved</option>
              <option value="FALSE_POSITIVE">False Positive</option>
            </select>
          </div>
        </motion.div>

        {/* Fraud Logs Table */}
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
                  <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-400">Type</th>
                  <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-400">User</th>
                  <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-400">Description</th>
                  <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-400">Severity</th>
                  <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-400">Status</th>
                  <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-400">Date</th>
                  <th className="text-right py-4 px-6 text-gray-600 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(log.type)}
                        <span className="text-gray-900 dark:text-white text-sm">{log.type.replace(/_/g, ' ')}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="text-gray-900 dark:text-white">{log.username}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{log.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-gray-900 dark:text-white text-sm truncate max-w-xs">{log.description}</p>
                    </td>
                    <td className="py-4 px-6">
                      {getSeverityBadge(log.severity)}
                    </td>
                    <td className="py-4 px-6">
                      {getStatusBadge(log.status)}
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-gray-600 dark:text-gray-400 text-sm">
                        {log.createdAt ? new Date(log.createdAt).toLocaleString() : '—'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => {
                            setSelectedLog(log);
                            setShowDetailModal(true);
                          }}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          title="View details"
                        >
                          <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredLogs.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center">
                      <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">No fraud logs found</p>
                      <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                        All clear! No suspicious activities detected.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Detail Modal */}
        {showDetailModal && selectedLog && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-gray-900 dark:text-white mb-6">Fraud Alert Details</h2>
              
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400">Alert Type</label>
                    <div className="flex items-center space-x-2 mt-1">
                      {getTypeIcon(selectedLog.type)}
                      <p className="text-gray-900 dark:text-white">{selectedLog.type.replace(/_/g, ' ')}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400">Severity</label>
                    <div className="mt-1">{getSeverityBadge(selectedLog.severity)}</div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400">User</label>
                    <p className="text-gray-900 dark:text-white">{selectedLog.username}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{selectedLog.email}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400">User ID</label>
                    <p className="text-gray-900 dark:text-white font-mono text-sm">{selectedLog.userId}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400">Detected</label>
                    <p className="text-gray-900 dark:text-white">
                      {selectedLog.createdAt ? new Date(selectedLog.createdAt).toLocaleString() : '—'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400">Current Status</label>
                    <div className="mt-1">{getStatusBadge(selectedLog.status)}</div>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">Description</label>
                  <p className="text-gray-900 dark:text-white mt-1">{selectedLog.description}</p>
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">Update Status</label>
                  <select
                    value={selectedLog.status}
                    onChange={(e) => setSelectedLog({ ...selectedLog, status: e.target.value as any })}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A3AD] text-gray-900 dark:text-white"
                  >
                    <option value="PENDING">Pending Review</option>
                    <option value="INVESTIGATING">Investigating</option>
                    <option value="RESOLVED">Resolved</option>
                    <option value="FALSE_POSITIVE">False Positive</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => handleUpdateStatus(selectedLog.id, selectedLog.status)}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-[#00A3AD] to-[#008891] text-white rounded-xl hover:shadow-xl transition-all duration-300"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setSelectedLog(null);
                  }}
                  className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
