import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import {
  User, Mail, Lock, Save, Eye, EyeOff, Trophy, Target, BookOpen, Clock,
  ArrowRight, Shield, CheckCircle2, Edit3, X, Award, TrendingUp, Flame
} from 'lucide-react';
import { authAPI } from '../services/api';
import { toast } from 'sonner';

interface QuizHistory {
  id: string;
  quizTitle: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  completedAt: string;
  passed: boolean;
}

export default function Profile() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  const [editingField, setEditingField] = useState<string | null>(null);
  const [newUsername, setNewUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [saving, setSaving] = useState(false);
  const [quizHistory, setQuizHistory] = useState<QuizHistory[]>([]);

  useEffect(() => {
    // Load quiz history from localStorage
    const stored = localStorage.getItem('quizHistory');
    if (stored) {
      try {
        setQuizHistory(JSON.parse(stored));
      } catch {}
    }
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Please log in to view your profile.</p>
          <button onClick={() => navigate('/auth')} className="px-6 py-3 bg-blue-500 text-white rounded-xl">
            Log In
          </button>
        </div>
      </div>
    );
  }

  const totalQuizzes = quizHistory.length;
  const avgScore = totalQuizzes > 0
    ? Math.round(quizHistory.reduce((acc, q) => acc + q.percentage, 0) / totalQuizzes)
    : 0;
  const bestScore = totalQuizzes > 0
    ? Math.max(...quizHistory.map(q => q.percentage))
    : 0;
  const passedQuizzes = quizHistory.filter(q => q.passed).length;

  const stats = [
    { icon: <Trophy className="w-5 h-5" />, label: 'Quizzes Taken', value: totalQuizzes, color: 'from-yellow-500 to-orange-500' },
    { icon: <Target className="w-5 h-5" />, label: 'Best Score', value: `${bestScore}%`, color: 'from-blue-500 to-cyan-500' },
    { icon: <TrendingUp className="w-5 h-5" />, label: 'Average Score', value: `${avgScore}%`, color: 'from-emerald-500 to-teal-500' },
    { icon: <CheckCircle2 className="w-5 h-5" />, label: 'Quizzes Passed', value: passedQuizzes, color: 'from-purple-500 to-pink-500' },
  ];

  const handleUpdateUsername = async () => {
    if (!newUsername.trim()) {
      toast.error('Username cannot be empty');
      return;
    }
    if (newUsername.trim() === user.username) {
      setEditingField(null);
      return;
    }
    try {
      setSaving(true);
      await authAPI.updateProfile({ username: newUsername.trim() });
      updateUser({ username: newUsername.trim() });
      toast.success('Username updated successfully!');
      setEditingField(null);
    } catch (e: any) {
      toast.error(e?.message || 'Failed to update username');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill in all password fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    try {
      setSaving(true);
      await authAPI.updateProfile({ currentPassword, newPassword });
      toast.success('Password updated successfully!');
      setEditingField(null);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (e: any) {
      toast.error(e?.message || 'Failed to update password');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto pt-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          {/* Avatar */}
          <div className="relative inline-block mb-4">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-blue-500/30">
              {user.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            {user.isPro && (
              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center shadow-lg">
                <Shield className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
          <h1 className="text-3xl font-bold text-white mb-1 font-[family-name:var(--font-heading)]">
            {user.username}
          </h1>
          <p className="text-gray-400">{user.email}</p>
          {user.isPro && (
            <span className="inline-flex items-center gap-1 mt-2 px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-yellow-400 text-xs font-semibold">
              <Shield className="w-3 h-3" /> Pro Member
            </span>
          )}
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
        >
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white/5 backdrop-blur-xl rounded-2xl p-5 border border-white/10 text-center hover:bg-white/10 transition-all"
            >
              <div className={`inline-flex p-2.5 rounded-xl bg-gradient-to-br ${stat.color} text-white mb-3`}>
                {stat.icon}
              </div>
              <p className="text-2xl font-bold text-white mb-1 font-[family-name:var(--font-mono)]">{stat.value}</p>
              <p className="text-xs text-gray-400">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Profile Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 sm:p-8 mb-8"
        >
          <h2 className="text-xl font-bold text-white mb-6 font-[family-name:var(--font-heading)] flex items-center gap-2">
            <User className="w-5 h-5 text-blue-400" />
            Profile Settings
          </h2>

          <div className="space-y-6">
            {/* Username */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Username</label>
              {editingField === 'username' ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="flex-1 px-4 py-3 bg-white/5 border border-white/15 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter new username"
                  />
                  <button
                    onClick={handleUpdateUsername}
                    disabled={saving}
                    className="px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50"
                  >
                    <Save className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => { setEditingField(null); setNewUsername(''); }}
                    className="px-4 py-3 bg-white/10 text-white rounded-xl hover:bg-white/15 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between px-4 py-3 bg-white/5 border border-white/10 rounded-xl">
                  <span className="text-white">{user.username}</span>
                  <button
                    onClick={() => { setEditingField('username'); setNewUsername(user.username); }}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Email (read-only) */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Email</label>
              <div className="flex items-center px-4 py-3 bg-white/5 border border-white/10 rounded-xl">
                <Mail className="w-4 h-4 text-gray-500 mr-3" />
                <span className="text-gray-300">{user.email}</span>
              </div>
            </div>

            {/* Change Password */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Change Password</label>
              {editingField === 'password' ? (
                <div className="space-y-3">
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type={showCurrentPw ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full pl-11 pr-12 py-3 bg-white/5 border border-white/15 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPw(!showCurrentPw)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                    >
                      {showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type={showNewPw ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full pl-11 pr-12 py-3 bg-white/5 border border-white/15 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="New password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPw(!showNewPw)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                    >
                      {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Confirm new password"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleUpdatePassword}
                      disabled={saving}
                      className="px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      {saving ? 'Saving...' : 'Update Password'}
                    </button>
                    <button
                      onClick={() => { setEditingField(null); setCurrentPassword(''); setNewPassword(''); setConfirmPassword(''); }}
                      className="px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/15 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setEditingField('password')}
                  className="w-full flex items-center justify-between px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-300 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Lock className="w-4 h-4 text-gray-500" />
                    <span>••••••••</span>
                  </div>
                  <Edit3 className="w-4 h-4 text-gray-500" />
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Quiz History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 sm:p-8 mb-8"
        >
          <h2 className="text-xl font-bold text-white mb-6 font-[family-name:var(--font-heading)] flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-400" />
            Quiz History
          </h2>

          {quizHistory.length === 0 ? (
            <div className="text-center py-10">
              <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">No quizzes taken yet</p>
              <button
                onClick={() => navigate('/quiz')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors"
              >
                Start a Quiz <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {quizHistory.slice(0, 10).map((quiz, idx) => (
                <div
                  key={quiz.id || idx}
                  className="flex items-center justify-between px-4 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${quiz.passed ? 'bg-green-500/20' : 'bg-orange-500/20'}`}>
                      {quiz.passed ? (
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                      ) : (
                        <Clock className="w-5 h-5 text-orange-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">{quiz.quizTitle || 'Quiz'}</p>
                      <p className="text-gray-500 text-xs">{new Date(quiz.completedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold font-[family-name:var(--font-mono)] ${quiz.passed ? 'text-green-400' : 'text-orange-400'}`}>
                      {quiz.percentage}%
                    </p>
                    <p className="text-gray-500 text-xs">{quiz.score}/{quiz.totalQuestions}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Achievements / Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 sm:p-8 mb-8"
        >
          <h2 className="text-xl font-bold text-white mb-6 font-[family-name:var(--font-heading)] flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-400" />
            Achievements
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { icon: '🎯', title: 'First Quiz', desc: 'Complete your first quiz', unlocked: totalQuizzes >= 1 },
              { icon: '🔥', title: 'Hot Streak', desc: 'Pass 3 quizzes in a row', unlocked: passedQuizzes >= 3 },
              { icon: '💯', title: 'Perfect Score', desc: 'Score 100% on a quiz', unlocked: bestScore === 100 },
              { icon: '🏆', title: 'Champion', desc: 'Score above 90%', unlocked: bestScore >= 90 },
              { icon: '📚', title: 'Scholar', desc: 'Take 10 quizzes', unlocked: totalQuizzes >= 10 },
              { icon: '🛡️', title: 'Pro Member', desc: 'Upgrade to Pro', unlocked: !!user.isPro },
            ].map((badge, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border text-center transition-all ${
                  badge.unlocked
                    ? 'bg-white/10 border-white/20 hover:bg-white/15'
                    : 'bg-white/[0.02] border-white/5 opacity-40'
                }`}
              >
                <span className="text-3xl mb-2 block">{badge.icon}</span>
                <p className="text-white text-sm font-semibold">{badge.title}</p>
                <p className="text-gray-500 text-[10px] mt-1">{badge.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Logout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mb-8"
        >
          <button
            onClick={() => { logout(); navigate('/'); }}
            className="px-8 py-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl font-semibold hover:bg-red-500/20 transition-all duration-300"
          >
            Log Out
          </button>
        </motion.div>
      </div>
    </div>
  );
}
