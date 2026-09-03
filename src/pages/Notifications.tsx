import { motion } from 'motion/react';
import { Bell, MessageSquare, Heart, AtSign, Trash2, CheckCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { useTranslation } from '../contexts/I18nContext';
import { useNotifications, type Notification } from '../contexts/NotificationsContext';

export default function Notifications() {
  const { t } = useTranslation();
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, clearAll } = useNotifications();

  const formatDate = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return t('common.just_now', 'Just now');
    if (minutes < 60) return t('common.minutes_ago', `${minutes}m ago`).replace('{n}', String(minutes));
    if (hours < 24) return t('common.hours_ago', `${hours}h ago`).replace('{n}', String(hours));
    return t('common.days_ago', `${days}d ago`).replace('{n}', String(days));
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'reply':
        return <MessageSquare className="w-4 h-4" />;
      case 'like':
        return <Heart className="w-4 h-4" />;
      case 'mention':
        return <AtSign className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'reply':
        return 'bg-blue-500/20 text-blue-400';
      case 'like':
        return 'bg-red-500/20 text-red-400';
      case 'mention':
        return 'bg-purple-500/20 text-purple-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto pt-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex p-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-3xl mb-6 shadow-lg shadow-blue-500/30">
            <Bell className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-[family-name:var(--font-heading)]">
            {t('notifications.title', 'Notifications')}
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            {t('notifications.description', 'Stay updated with replies and activity on your comments.')}
          </p>
        </motion.div>

        {/* Actions Bar */}
        {notifications.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap items-center justify-between gap-4 mb-6"
          >
            <div className="flex items-center gap-3">
              {unreadCount > 0 && (
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium">
                  {unreadCount} {t('notifications.unread', 'unread')}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all text-sm"
                >
                  <CheckCheck className="w-4 h-4" />
                  {t('notifications.mark_all_read', 'Mark all read')}
                </button>
              )}
              <button
                onClick={clearAll}
                className="flex items-center gap-2 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all text-sm"
              >
                <Trash2 className="w-4 h-4" />
                {t('notifications.clear_all', 'Clear all')}
              </button>
            </div>
          </motion.div>
        )}

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <Bell className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <h3 className="text-xl font-bold text-white mb-2">
              {t('notifications.no_notifications', 'No notifications yet')}
            </h3>
            <p className="text-gray-400 mb-6">
              {t('notifications.no_notifications_desc', 'You\'ll receive notifications when others reply to your comments.')}
            </p>
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              {t('notifications.browse_articles', 'Browse Articles')}
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className={`bg-white/5 backdrop-blur-xl rounded-2xl border p-4 transition-all hover:bg-white/10 ${
                  notification.read ? 'border-white/5' : 'border-blue-500/30'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`p-2 rounded-xl ${getNotificationColor(notification.type)}`}>
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${notification.read ? 'text-gray-400' : 'text-white'}`}>
                      {notification.message}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      <span>{formatDate(notification.timestamp)}</span>
                      {notification.articleSlug && (
                        <>
                          <span>·</span>
                          <Link 
                            to={`/blog/${notification.articleSlug}`}
                            className="text-blue-400 hover:text-blue-300"
                          >
                            {t('notifications.view_article', 'View article')}
                          </Link>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
                        title={t('notifications.mark_as_read', 'Mark as read')}
                      >
                        <CheckCheck className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                      title={t('notifications.delete', 'Delete')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    {notification.articleSlug && (
                      <Link
                        to={`/blog/${notification.articleSlug}`}
                        className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                </div>

                {/* Unread indicator */}
                {!notification.read && (
                  <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full" />
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
