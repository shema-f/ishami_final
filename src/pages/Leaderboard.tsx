import { motion } from 'motion/react';
import { Trophy, Medal, TrendingUp, Crown, Zap, Share2, Copy, Facebook, ArrowRight, Award, Shield, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { leaderboardAPI, flushPendingQuizSubmissions } from '../services/api';
import { Link } from 'react-router';
import { useTranslation } from '../contexts/I18nContext';
import { useAuth } from '../contexts/AuthContext';

type LeaderboardEntry = {
  rank: number;
  userId: string;
  username: string;
  score?: number;
  bestScore: number;
  quizCount: number;
  totalMarks: number;
  totalQuestions: number;
  isPro?: boolean;
  medal?: string | null;
  loginStreak?: number;
};

export default function Leaderboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [myEntry, setMyEntry] = useState<LeaderboardEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const formatName = (name: string) => name || t('lb.unknown', 'Unknown');
  const isCurrentUser = (entry: LeaderboardEntry) => !!user && !!myEntry && entry.userId === myEntry.userId;

  // Load the leaderboard once; flush any quiz marks that failed to upload earlier first,
  // so scores that were recorded offline still show up here.
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await flushPendingQuizSubmissions();
        const res = await leaderboardAPI.getLeaderboard(100);
        if (!mounted) return;
        setEntries(res.leaderboard || []);
        setMyEntry(res.myEntry || null);
      } catch {
        if (mounted) setError(t('lb.error', 'Failed to load the leaderboard'));
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const retry = async () => {
    setLoading(true);
    setError(null);
    try {
      await flushPendingQuizSubmissions();
      const res = await leaderboardAPI.getLeaderboard(100);
      setEntries(res.leaderboard || []);
      setMyEntry(res.myEntry || null);
    } catch {
      setError(t('lb.error', 'Failed to load the leaderboard'));
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShareUrl(`${window.location.origin}/leaderboard`);
    }
  }, []);
  
  const doCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const top3 = entries.slice(0, 3);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">{t('lb.loading', 'Loading leaderboard...')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      {/* Background glow */}
      <div className="fixed top-1/3 left-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto pt-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex p-4 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-3xl mb-6 shadow-lg shadow-yellow-500/30">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 font-[family-name:var(--font-heading)]">
            {t('lb.title', 'Leaderboard')}
          </h1>
          <p className="text-gray-400 text-lg">
            {t('lb.subtitle', 'Top performers in Rwanda Traffic Rules mastery')}
          </p>
        </motion.div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-between gap-4 flex-wrap">
            <p className="text-red-400 text-sm">{error}</p>
            <button
              onClick={retry}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 text-red-300 text-xs font-semibold hover:bg-red-500/30 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              {t('lb.retry', 'Retry')}
            </button>
          </div>
        )}

        {/* Motivational Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 mb-8 text-white"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <Zap className="w-8 h-8" />
              <div>
                <h3 className="font-semibold mb-1">{t('lb.motivation.title', 'Climb the Rankings!')}</h3>
                <p className="text-blue-100 text-sm">
                  {t('lb.motivation.description', 'Complete quizzes daily to maintain your streak and earn badges')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-blue-100">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm">{t('lb.motivation.real_time', 'Updated in real-time')}</span>
            </div>
          </div>
        </motion.div>

        {/* Your Rank */}
        {user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white/5 backdrop-blur-xl rounded-2xl p-5 border border-white/10 mb-8"
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-amber-500/15">
                  <Crown className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">{t('lb.my_rank.title', 'Your Rank')}</h3>
                  {myEntry ? (
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className="text-2xl font-bold text-amber-400 font-[family-name:var(--font-mono)]">#{myEntry.rank}</span>
                      <span className="text-xs text-gray-400">
                        {myEntry.totalMarks} {t('lb.marks', 'marks')} · {myEntry.quizCount} {t('lb.table.quizzes', 'quizzes')} · {t('lb.table.best_score', 'Best Score')} {myEntry.bestScore}
                      </span>
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm mt-1">{t('lb.my_rank.not_ranked', "You haven't taken a quiz yet")}</p>
                  )}
                </div>
              </div>
              {!myEntry && (
                <Link
                  to="/quiz"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold hover:shadow-lg hover:shadow-amber-500/25 transition-all duration-300"
                >
                  <Trophy className="w-4 h-4" />
                  {t('lb.my_rank.take_quiz', 'Take a Quiz')}
                </Link>
              )}
            </div>
          </motion.div>
        )}

        {/* Share Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10 mb-8"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Share2 className="w-5 h-5 text-blue-400" />
              <span className="text-white text-sm">{t('lb.share.title', 'Share this leaderboard')}</span>
            </div>
            <div className="flex items-center flex-wrap gap-2">
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(t('lb.share.share_text', 'ISHAMI App Leaderboard — Can you beat me?'))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 text-white text-xs hover:bg-blue-500 transition-colors"
              >
                <Facebook className="w-4 h-4" />
                {t('lb.share.facebook', 'Facebook')}
              </a>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(t('lb.share.share_text', 'ISHAMI App Leaderboard — Can you beat me?') + ' ' + shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-green-600 text-white text-xs hover:bg-green-500 transition-colors"
              >
                {t('lb.share.whatsapp', 'WhatsApp')}
              </a>
              <button
                onClick={doCopy}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 text-white text-xs hover:bg-white/20 transition-colors"
              >
                <Copy className="w-4 h-4" />
                {copied ? t('lb.share.copied', 'Copied!') : t('lb.share.copy_link', 'Copy Link')}
              </button>
            </div>
          </div>
        </motion.div>

        {entries.length > 0 ? (
        <>
        {/* Top 3 Podium */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-3 gap-4 mb-12"
        >
          {/* 2nd Place */}
          <div className="order-1 pt-12">
            <motion.div
              whileHover={{ y: -8 }}
              className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 text-center"
            >
              <div className="w-12 h-12 mx-auto mb-3 bg-gray-500/20 rounded-full flex items-center justify-center">
                <Medal className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-white font-semibold mb-1">
                {formatName(top3[1]?.username || '')}
              </h3>
              <p className="text-2xl font-bold text-blue-400 font-[family-name:var(--font-mono)]">{top3[1]?.totalMarks ?? '-'}</p>
              <p className="text-xs text-gray-500">{t('lb.marks', 'marks')}</p>
            </motion.div>
          </div>

          {/* 1st Place */}
          <div className="order-2">
            <motion.div
              whileHover={{ y: -8 }}
              className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl p-6 text-center relative shadow-lg shadow-yellow-500/30"
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#111827] rounded-full p-2">
                <Crown className="w-6 h-6 text-yellow-400" />
              </div>
              <h3 className="text-white font-bold mb-1 mt-2">
                {formatName(top3[0]?.username || '')}
              </h3>
              <p className="text-3xl font-bold text-white font-[family-name:var(--font-mono)]">{top3[0]?.totalMarks ?? '-'}</p>
              <p className="text-sm text-yellow-100">{t('lb.marks', 'marks')}</p>
            </motion.div>
          </div>

          {/* 3rd Place */}
          <div className="order-3 pt-12">
            <motion.div
              whileHover={{ y: -8 }}
              className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 text-center"
            >
              <div className="w-12 h-12 mx-auto mb-3 bg-orange-500/20 rounded-full flex items-center justify-center">
                <Medal className="w-6 h-6 text-orange-400" />
              </div>
              <h3 className="text-white font-semibold mb-1">
                {formatName(top3[2]?.username || '')}
              </h3>
              <p className="text-2xl font-bold text-orange-400 font-[family-name:var(--font-mono)]">{top3[2]?.totalMarks ?? '-'}</p>
              <p className="text-xs text-gray-500">{t('lb.marks', 'marks')}</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Full Leaderboard — Cards on mobile, Table on desktop */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden"
        >
          {/* ── Mobile: Card layout ── */}
          <div className="sm:hidden divide-y divide-white/5">
            {entries.map((entry, index) => (
              <motion.div
                key={entry.userId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.02 }}
                className={`px-4 py-3 flex items-center gap-3 ${index < 3 ? 'bg-white/5' : ''}`}
              >
                <div className="shrink-0 w-8 text-center">
                  {index === 0 && <Crown className="w-5 h-5 text-yellow-400 mx-auto" />}
                  {index === 1 && <Medal className="w-5 h-5 text-gray-400 mx-auto" />}
                  {index === 2 && <Medal className="w-5 h-5 text-orange-400 mx-auto" />}
                  {index > 2 && <span className="text-gray-500 text-sm font-medium">#{index + 1}</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <span className={`font-medium text-sm ${index < 3 ? 'text-white' : 'text-gray-300'} truncate block`}>
                    {formatName(entry.username)}
                    {isCurrentUser(entry) && <span className="ml-2 px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold align-middle">{t('lb.you', 'You')}</span>}
                  </span>
                  <span className="text-xs text-gray-500">
                    {entry.totalMarks} {t('lb.marks', 'marks')} · {entry.quizCount} {t('lb.table.quizzes', 'quizzes')}
                  </span>
                </div>
                <span className={`text-lg font-bold font-[family-name:var(--font-mono)] shrink-0 ${
                  isCurrentUser(entry) ? 'text-amber-300' :
                  index === 0 ? 'text-yellow-400' :
                  index === 1 ? 'text-gray-300' :
                  index === 2 ? 'text-orange-400' : 'text-blue-400'
                }`}>
                  {entry.totalMarks}
                </span>
              </motion.div>
            ))}
          </div>

          {/* ── Desktop: Table layout ── */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">{t('lb.table.rank', 'Rank')}</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">{t('lb.table.user', 'User')}</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-amber-400">{t('lb.table.total_marks', 'Total Marks')}</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-400 hidden md:table-cell">{t('lb.table.best_score', 'Best Score')}</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-400 hidden lg:table-cell">{t('lb.table.quizzes', 'Quizzes')}</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-400 hidden xl:table-cell">{t('lb.table.average', 'Average')}</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, index) => (
                  <motion.tr
                    key={entry.userId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.03 }}
                    className={`border-b border-white/5 hover:bg-white/5 transition-colors ${
                      isCurrentUser(entry) ? 'bg-amber-500/10' : index < 3 ? 'bg-white/5' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {index === 0 && <Crown className="w-5 h-5 text-yellow-400" />}
                        {index === 1 && <Medal className="w-5 h-5 text-gray-400" />}
                        {index === 2 && <Medal className="w-5 h-5 text-orange-400" />}
                        {index > 2 && <span className="text-gray-500 text-sm font-medium ml-1">#{index + 1}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-medium ${index < 3 ? 'text-white' : 'text-gray-300'}`}>
                          {formatName(entry.username)}
                        </span>
                        {isCurrentUser(entry) && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                            {t('lb.you', 'You')}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`text-lg font-bold font-[family-name:var(--font-mono)] ${
                        isCurrentUser(entry) ? 'text-amber-300' :
                        index === 0 ? 'text-yellow-400' :
                        index === 1 ? 'text-gray-300' :
                        index === 2 ? 'text-orange-400' : 'text-white'
                      }`}>
                        {entry.totalMarks}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center hidden md:table-cell">
                      <span className={`font-semibold ${index === 0 ? 'text-yellow-400' : 'text-blue-400'}`}>{entry.bestScore}</span>
                    </td>
                    <td className="px-6 py-4 text-center hidden lg:table-cell">
                      <span className="text-gray-400">{entry.quizCount}</span>
                    </td>
                    <td className="px-6 py-4 text-center hidden xl:table-cell">
                      <span className="text-gray-400">
                        {Math.round((entry.totalMarks / Math.max(1, entry.totalQuestions)) * 100)}%
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
        </>) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-12 text-center"
          >
            <div className="inline-flex p-4 bg-amber-500/10 rounded-3xl mb-4">
              <Trophy className="w-10 h-10 text-amber-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 font-[family-name:var(--font-heading)]">
              {t('lb.empty.title', 'No scores yet')}
            </h3>
            <p className="text-gray-400 max-w-md mx-auto mb-6">
              {t('lb.empty.description', 'Take a quiz to earn marks and claim your spot on the leaderboard!')}
            </p>
            <Link
              to="/quiz"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300"
            >
              <Trophy className="w-5 h-5" />
              {t('lb.my_rank.take_quiz', 'Take a Quiz')}
            </Link>
          </motion.div>
        )}

        {/* Certification CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12"
        >
          <div
            className="relative overflow-hidden rounded-3xl p-8 sm:p-10"
            style={{
              background: 'linear-gradient(135deg, #0a1628 0%, #0d1f3c 40%, #0f2340 70%, #0a1628 100%)',
            }}
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-600" />
            <div className="absolute inset-0 opacity-5">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="cert-lb-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M20 0L40 20L20 40L0 20Z" fill="none" stroke="#c9a84c" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#cert-lb-pattern)" />
              </svg>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-[100px]" />

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 mb-4">
                  <Award className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-yellow-400 font-medium">{t('lb.certification_cta.badge', 'Earn Your Certificate')}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 font-[family-name:var(--font-heading)]">
                  {t('lb.certification_cta.title', 'Ready to Get Certified?')}
                </h3>
                <p className="text-slate-400 max-w-lg">
                  {t('lb.certification_cta.description', 'Top the leaderboard and earn your official ISHAMI Certificate of Completion. Share it with employers or verify it online.')}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/quiz"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-slate-900 rounded-xl font-bold hover:shadow-lg hover:shadow-yellow-500/25 transition-all duration-300"
                >
                  <Trophy className="w-5 h-5" />
                  <span>{t('lb.certification_cta.take_quiz', 'Take a Quiz')}</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/certificate"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/15 text-white rounded-xl font-semibold hover:bg-white/10 transition-all duration-300"
                >
                  <Shield className="w-5 h-5 text-yellow-400" />
                  <span>{t('lb.certification_cta.view_certificate', 'View Certificate')}</span>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 text-center"
        >
          <p className="text-gray-400 mb-4">
            {t('lb.cta.description', 'Think you can make it to the top?')}
          </p>
          <Link
            to="/quiz"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300"
          >
            <Trophy className="w-5 h-5" />
            <span>{t('lb.cta.button', 'Start Climbing')}</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
