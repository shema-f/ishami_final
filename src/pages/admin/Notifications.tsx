import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Bell, Send, Clock, Users, Trash2 } from 'lucide-react';
import { adminAPI } from '../../services/api';
import { toast } from 'sonner';

interface Notification {
  id: string;
  title: string;
  body: string;
  segment: string;
  status: 'PENDING' | 'SENT' | 'FAILED';
  scheduledAt?: string;
  sentAt?: string;
  createdAt?: string;
}

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newNotification, setNewNotification] = useState({
    title: '',
    body: '',
    segment: 'all',
    scheduledAt: ''
  });

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      // Use the send endpoint to get notifications history
      // For now, we'll use a placeholder since there's no list endpoint
      setNotifications([]);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendNotification = async () => {
    if (!newNotification.title || !newNotification.body) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await adminAPI.sendNotification({
        title: newNotification.title,
        body: newNotification.body,
        segment: newNotification.segment,
        scheduledAt: newNotification.scheduledAt || undefined
      });
      
      toast.success('Notification sent successfully');
      setShowCreateModal(false);
      setNewNotification({ title: '', body: '', segment: 'all', scheduledAt: '' });
      loadNotifications();
    } catch (error) {
      console.error('Failed to send notification:', error);
      toast.error('Failed to send notification');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00A3AD] mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading notifications...</p>
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
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <h1 className="text-gray-900 dark:text-white mb-2">Push Notifications</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Send push notifications to users
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#00A3AD] to-[#008891] text-white rounded-xl hover:shadow-xl transition-all duration-300"
          >
            <Bell className="w-5 h-5" />
            <span>New Notification</span>
          </button>
        </motion.div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30">
                <Bell className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Sent</p>
                <p className="text-2xl text-gray-900 dark:text-white">{notifications.length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-green-100 dark:bg-green-900/30">
                <Send className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Delivered</p>
                <p className="text-2xl text-gray-900 dark:text-white">
                  {notifications.filter(n => n.status === 'SENT').length}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-orange-100 dark:bg-orange-900/30">
                <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Scheduled</p>
                <p className="text-2xl text-gray-900 dark:text-white">
                  {notifications.filter(n => n.status === 'PENDING').length}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Notifications List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-gray-900 dark:text-white">Notification History</h3>
          </div>
          
          {notifications.length === 0 ? (
            <div className="p-12 text-center">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No notifications sent yet</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                Click "New Notification" to send your first push notification
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-400">Title</th>
                    <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-400">Segment</th>
                    <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-400">Status</th>
                    <th className="text-left py-4 px-6 text-gray-600 dark:text-gray-400">Sent</th>
                  </tr>
                </thead>
                <tbody>
                  {notifications.map((notification) => (
                    <tr key={notification.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="py-4 px-6">
                        <p className="text-gray-900 dark:text-white">{notification.title}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-xs">{notification.body}</p>
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-3 py-1 bg-[#00A3AD]/10 text-[#00A3AD] rounded-full text-sm">
                          {notification.segment}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          notification.status === 'SENT' 
                            ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                            : notification.status === 'PENDING'
                            ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
                            : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          {notification.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-600 dark:text-gray-400 text-sm">
                        {notification.sentAt ? new Date(notification.sentAt).toLocaleString() : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Create Notification Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full"
            >
              <h2 className="text-gray-900 dark:text-white mb-6">Send Push Notification</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">Title</label>
                  <input
                    type="text"
                    value={newNotification.title}
                    onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
                    placeholder="Notification title"
                    className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A3AD] text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">Message</label>
                  <textarea
                    value={newNotification.body}
                    onChange={(e) => setNewNotification({ ...newNotification, body: e.target.value })}
                    rows={4}
                    placeholder="Notification message..."
                    className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A3AD] text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">Target Audience</label>
                  <select
                    value={newNotification.segment}
                    onChange={(e) => setNewNotification({ ...newNotification, segment: e.target.value })}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A3AD] text-gray-900 dark:text-white"
                  >
                    <option value="all">All Users</option>
                    <option value="free">Free Users Only</option>
                    <option value="pro">Pro Users Only</option>
                    <option value="new">New Users (Last 7 days)</option>
                    <option value="inactive">Inactive Users (30+ days)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">Schedule (Optional)</label>
                  <input
                    type="datetime-local"
                    value={newNotification.scheduledAt}
                    onChange={(e) => setNewNotification({ ...newNotification, scheduledAt: e.target.value })}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A3AD] text-gray-900 dark:text-white"
                  />
                  <p className="text-xs text-gray-500 mt-1">Leave empty to send immediately</p>
                </div>
              </div>

              <div className="flex space-x-4 mt-6">
                <button
                  onClick={handleSendNotification}
                  className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#00A3AD] to-[#008891] text-white rounded-xl hover:shadow-xl transition-all duration-300"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Now</span>
                </button>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewNotification({ title: '', body: '', segment: 'all', scheduledAt: '' });
                  }}
                  className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
