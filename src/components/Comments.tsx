import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, Heart, Reply, Trash2, User, ChevronDown, ChevronUp, Mail } from 'lucide-react';
import { useComments, type Comment } from '../contexts/CommentsContext';
import { useNotifications } from '../contexts/NotificationsContext';
import { useTranslation } from '../contexts/I18nContext';
import { useAuth } from '../contexts/AuthContext';
import { getAllArticles } from '../lib/articleStore';

interface CommentsProps {
  articleId: string;
}

export default function Comments({ articleId }: CommentsProps) {
  const { lang, t } = useTranslation();
  const { user } = useAuth();
  const { getArticleComments, addComment } = useComments();
  const { addNotification } = useNotifications();
  
  const [authorName, setAuthorName] = useState(user?.username || '');
  const [authorEmail, setAuthorEmail] = useState('');
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const comments = getArticleComments(articleId);
  const displayComments = showAll ? comments : comments.slice(0, 5);
  const article = getAllArticles().find(a => a.id === articleId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsSubmitting(true);
    
    // Simulate a small delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    addComment(articleId, authorName || 'Anonymous', commentText);
    setCommentText('');
    setIsSubmitting(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="mt-12"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-500/20 rounded-xl">
          <MessageSquare className="w-5 h-5 text-blue-400" />
        </div>
        <h2 className="text-2xl font-bold text-white font-[family-name:var(--font-heading)]">
          {t('comments.discussion', 'Discussion')}
        </h2>
        <span className="px-2 py-0.5 bg-white/10 rounded-full text-sm text-gray-400">
          {comments.length}
        </span>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4">
          <div className="flex flex-col sm:flex-row gap-3 mb-3">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
                <User className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder={t('comments.name', 'Your name (optional)')}
                className="flex-1 bg-transparent border-b border-white/10 text-white placeholder-gray-500 py-2 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div className="flex items-center gap-3 flex-1">
              <Mail className="w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={authorEmail}
                onChange={(e) => setAuthorEmail(e.target.value)}
                placeholder={t('comments.email_notifications', 'Email (to get notifications)')}
                className="flex-1 bg-transparent border-b border-white/10 text-white placeholder-gray-500 py-2 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder={t('comments.write', 'Write your comment...')}
            rows={3}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-3">
            <p className="text-xs text-gray-500">
              {t('comments.email_hint', 'Enter your email to get notified when others reply.')}
            </p>
            <button
              type="submit"
              disabled={!commentText.trim() || isSubmitting}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              {t('comments.post', 'Post')}
            </button>
          </div>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        <AnimatePresence>
          {displayComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              articleId={articleId}
              depth={0}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Show More/Less */}
      {comments.length > 5 && (
        <motion.button
          onClick={() => setShowAll(!showAll)}
          className="w-full mt-4 py-3 text-center text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all flex items-center justify-center gap-2"
        >
          {showAll ? (
            <>
              <ChevronUp className="w-4 h-4" />
              {t('comments.show_less', 'Show less')}
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              {t('comments.show_all', `Show all (${comments.length})`).replace('{n}', String(comments.length))}
            </>
          )}
        </motion.button>
      )}

      {/* Empty State */}
      {comments.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-600" />
          <p className="text-gray-400">
            {t('comments.none', 'No comments yet. Be the first to share your thoughts!')}
          </p>
        </div>
      )}
    </motion.div>
  );
}

function CommentItem({ comment, articleId, depth }: { comment: Comment; articleId: string; depth: number }) {
  const { lang, t } = useTranslation();
  const { user } = useAuth();
  const { deleteComment, likeComment, addComment } = useComments();
  const { addNotification } = useNotifications();
  
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replyEmail, setReplyEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const article = getAllArticles().find(a => a.id === articleId);

  const formatTime = (timestamp: number) => {
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

  const handleReply = async () => {
    if (!replyText.trim()) return;
    
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const replyAuthorName = user?.username || 'Anonymous';
    addComment(articleId, replyAuthorName, replyText, comment.id);
    
    // Send notification to the original commenter
    addNotification({
      type: 'reply',
      articleId,
      articleTitle: article ? (lang === 'rw' ? article.title_rw : article.title_en) : 'Article',
      articleSlug: article?.slug || '',
      commentId: comment.id,
      fromUser: replyAuthorName,
      message: `${replyAuthorName} replied to your comment: "${replyText.substring(0, 50)}${replyText.length > 50 ? '...' : ''}"`,
      email: replyEmail || undefined,
    });
    
    setReplyText('');
    setReplyEmail('');
    setShowReplyForm(false);
    setIsSubmitting(false);
  };

  const handleDelete = () => {
    if (confirm(t('comments.delete_confirm', 'Are you sure you want to delete?'))) {
      deleteComment(articleId, comment.id);
    }
  };

  const isOwner = user?.username === comment.authorName;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`${depth > 0 ? 'ml-8 md:ml-12' : ''}`}
    >
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4">
        {/* Author Info */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/50 to-purple-600/50 flex items-center justify-center text-white text-xs font-bold">
              {comment.authorName.charAt(0).toUpperCase()}
            </div>
            <div>
              <span className="text-white font-medium text-sm">{comment.authorName}</span>
              <span className="text-gray-500 text-xs ml-2">{formatTime(comment.timestamp)}</span>
            </div>
          </div>
          {isOwner && (
            <button
              onClick={handleDelete}
              className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Content */}
        <p className="text-gray-300 text-sm leading-relaxed mb-3">{comment.content}</p>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => likeComment(articleId, comment.id)}
            className="flex items-center gap-1.5 text-gray-400 hover:text-red-400 transition-colors text-xs"
          >
            <Heart className="w-3.5 h-3.5" />
            <span>{comment.likes > 0 ? comment.likes : ''} {t('comments.like', 'Like')}</span>
          </button>
          {depth < 2 && (
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="flex items-center gap-1.5 text-gray-400 hover:text-blue-400 transition-colors text-xs"
            >
              <Reply className="w-3.5 h-3.5" />
              <span>{t('comments.reply', 'Reply')}</span>
            </button>
          )}
        </div>

        {/* Reply Form */}
        <AnimatePresence>
          {showReplyForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 overflow-hidden"
            >
              <div className="space-y-2">
                <input
                  type="email"
                  value={replyEmail}
                  onChange={(e) => setReplyEmail(e.target.value)}
                  placeholder={t('comments.email_notified', 'Email (to get notified)')}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={t('comments.write_reply', 'Write a reply...')}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleReply();
                      }
                    }}
                  />
                  <button
                    onClick={handleReply}
                    disabled={!replyText.trim() || isSubmitting}
                    className="px-3 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Replies */}
      {comment.replies.length > 0 && (
        <div className="mt-3 space-y-3">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              articleId={articleId}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}
