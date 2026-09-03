// ============================================================
// ISHAMI SIMULATION — Scenario Selection Screen
// Choose missions with unlock progression and stats
// ============================================================

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import {
  ArrowLeft, Lock, Star, Trophy, Clock, MapPin, Zap,
  ChevronRight, Award, Target, Shield,
} from 'lucide-react';
import { useTranslation } from '../../contexts/I18nContext';
import { useAuth } from '../../contexts/AuthContext';
import PaypackPayment from '../../components/PaypackPayment';
import {
  ALL_SCENARIOS,
  ALL_ACHIEVEMENTS,
  loadProfile,
  isScenarioUnlocked,
  type UserProfile,
  type ScenarioDefinition,
} from '../core/ScenarioManager';

export default function ScenarioSelect() {
  const { t, lang } = useTranslation();
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const hasFullAccess = user?.isPro || user?.accessTier === 'full';
  const [showPaywall, setShowPaywall] = useState(false);
  const [profile, setProfile] = useState<UserProfile>(loadProfile());
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ALL');
  const [showAchievements, setShowAchievements] = useState(false);

  useEffect(() => {
    setProfile(loadProfile());
  }, []);

  const filteredScenarios = ALL_SCENARIOS.filter(s =>
    (selectedDifficulty === 'ALL' || s.difficulty === selectedDifficulty)
  );

  const difficulties = ['ALL', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED'];

  const getStars = (scenarioId: string): number => {
    return profile.scenarios[scenarioId]?.stars || 0;
  };

  const getBestScore = (scenarioId: string): number => {
    return profile.scenarios[scenarioId]?.bestScore || 0;
  };

  return (
    <div className="min-h-screen bg-[#0d1117]">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent" />
        <div className="relative max-w-6xl mx-auto px-4 pt-8 pb-6">
          {/* Back Button */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#111827]/80 backdrop-blur-lg border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-all mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back</span>
          </button>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-black text-white mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
              {t('sim.scenario_select_title', 'Driving Scenarios')}
            </h1>
            <p className="text-slate-400">
              {t('sim.scenario_select_subtitle', 'Choose a scenario to test your driving skills')}
            </p>
          </motion.div>

          {/* Profile Stats */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center justify-center gap-6 mb-6"
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#111827]/80 border border-white/10">
              <Zap className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-white font-bold">{profile.totalXP} XP</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#111827]/80 border border-white/10">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-white font-bold">Level {profile.level}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#111827]/80 border border-white/10">
              <Target className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-white font-bold">{profile.totalSimulations} runs</span>
            </div>
            <button
              onClick={() => setShowAchievements(!showAchievements)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#111827]/80 border border-white/10 hover:border-amber-500/30 transition-all"
            >
              <Award className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-white font-bold">{profile.achievements.length}/{ALL_ACHIEVEMENTS.length}</span>
            </button>
          </motion.div>

          {/* Difficulty Filter */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 md:gap-2">
            {difficulties.map(d => (
              <button
                key={d}
                onClick={() => setSelectedDifficulty(d)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  selectedDifficulty === d
                    ? d === 'BEGINNER' ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400'
                    : d === 'INTERMEDIATE' ? 'bg-amber-500/20 border border-amber-500/30 text-amber-400'
                    : d === 'ADVANCED' ? 'bg-red-500/20 border border-red-500/30 text-red-400'
                    : 'bg-blue-500/20 border border-blue-500/30 text-blue-400'
                    : 'bg-white/5 border border-white/10 text-slate-500 hover:text-white'
                }`}
              >
                {d === 'ALL' ? 'All' : d}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Achievements Panel */}
      <AnimatePresence>
        {showAchievements && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="max-w-6xl mx-auto px-4 mb-6"
          >
            <div className="bg-[#111827]/90 rounded-2xl border border-white/10 p-6">
              <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-4">Achievements</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {ALL_ACHIEVEMENTS.map(a => {
                  const unlocked = profile.achievements.includes(a.id);
                  return (
                    <div
                      key={a.id}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        unlocked
                          ? 'bg-amber-500/10 border-amber-500/20'
                          : 'bg-white/3 border-white/5 opacity-50'
                      }`}
                    >
                      <div className="text-2xl mb-1">{a.icon}</div>
                      <div className="text-[10px] font-bold text-white">{a.title}</div>
                      <div className="text-[9px] text-slate-500 mt-0.5">+{a.xp} XP</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scenario Grid */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredScenarios.map((scenario, i) => (
            <ScenarioCard
              key={scenario.id}
              scenario={scenario}
              index={i}
              profile={profile}
              onPlay={() => {
                // Guests and free users see paywall; quiz/full users can play
                if (!user || (!user.isPro && user.accessTier !== 'full')) {
                  setShowPaywall(true);
                  return;
                }
                navigate(`/simulation/${scenario.id}`);
              }}
              lang={lang}
            />
          ))}
        </div>
      </div>

      {/* Paywall Overlay */}
      {showPaywall && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowPaywall(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#111827] rounded-3xl p-8 max-w-md w-full border border-white/10 shadow-2xl"
          >
            <div className="text-center">
              <div className="inline-flex p-4 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-3xl mb-6 shadow-lg shadow-yellow-500/30">
                <Lock className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Full Access Required</h2>
              <p className="text-gray-400 mb-4">3D Driving Simulation requires Full Access — <span className="text-yellow-400 font-semibold">3,000 RWF</span></p>

              {/* Sign In prompt for guests */}
              {!user && (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-4">
                  <p className="text-blue-300 text-sm mb-3">Have an account? Sign in to save your progress and access paid features.</p>
                  <a href="/auth" className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors text-sm">
                    Sign In / Sign Up
                  </a>
                </div>
              )}

              <PaypackPayment
                amount={3000}
                product="full"
                onSuccess={() => {
                  if (updateUser) updateUser({ isPro: true, accessTier: 'full' });
                  setShowPaywall(false);
                }}
                onCancel={() => setShowPaywall(false)}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

// ─── Scenario Card ────────────────────────────────────────

function ScenarioCard({
  scenario,
  index,
  profile,
  onPlay,
  lang,
}: {
  scenario: ScenarioDefinition;
  index: number;
  profile: UserProfile;
  onPlay: () => void;
  lang: string;
}) {
  const unlocked = isScenarioUnlocked(scenario.id, profile);
  const progress = profile.scenarios[scenario.id];
  const stars = progress?.stars || 0;
  const bestScore = progress?.bestScore || 0;

  const difficultyColor = {
    BEGINNER: 'emerald',
    INTERMEDIATE: 'amber',
    ADVANCED: 'red',
  }[scenario.difficulty];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`relative group ${!unlocked ? 'opacity-60' : ''}`}
    >
      <div
        className={`relative overflow-hidden rounded-2xl border transition-all duration-300 ${
          unlocked
            ? 'bg-[#111827]/90 border-white/10 hover:border-white/20 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1'
            : 'bg-[#0d1117]/80 border-white/5'
        }`}
      >
        {/* Top accent bar */}
        <div className={`h-1 bg-gradient-to-r ${
          scenario.difficulty === 'BEGINNER' ? 'from-emerald-500 to-emerald-400'
          : scenario.difficulty === 'INTERMEDIATE' ? 'from-amber-500 to-amber-400'
          : 'from-red-500 to-red-400'
        }`} />

        <div className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{scenario.icon}</span>
              <div>
                <h3 className="text-sm font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                  {lang === 'rw' ? scenario.titleRW : scenario.title}
                </h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-${difficultyColor}-500/20 text-${difficultyColor}-400`}>
                    {scenario.difficulty}
                  </span>
                  <span className="text-[10px] text-slate-500">Mission {scenario.order}</span>
                </div>
              </div>
            </div>

            {!unlocked && (
              <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                <Lock className="w-4 h-4 text-slate-500" />
              </div>
            )}
          </div>

          {/* Description */}
          <p className="text-xs text-slate-400 leading-relaxed mb-3">
            {lang === 'rw' ? scenario.descriptionRW : scenario.description}
          </p>

          {/* Meta */}
          <div className="flex items-center gap-3 text-[10px] text-slate-500 mb-3">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{scenario.estimatedTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>{lang === 'rw' ? scenario.locationRW : scenario.location}</span>
            </div>
          </div>

          {/* Stars & Score */}
          {progress?.completed && (
            <div className="flex items-center gap-2 mb-3">
              <div className="flex gap-0.5">
                {[1, 2, 3].map(s => (
                  <Star
                    key={s}
                    className={`w-4 h-4 ${s <= stars ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`}
                  />
                ))}
              </div>
              <span className="text-xs text-slate-400 font-mono">Best: {Math.round(bestScore)}%</span>
            </div>
          )}

          {/* XP Reward */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-xs text-blue-400 font-bold">+{scenario.xpReward} XP</span>
            </div>

            {unlocked ? (
              <button
                onClick={onPlay}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-400 text-xs font-bold hover:bg-blue-500/30 hover:border-blue-500/50 transition-all group-active:scale-95"
              >
                {progress?.completed ? 'Replay' : 'Play'}
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            ) : (
              <span className="text-[10px] text-slate-500">
                Complete {scenario.unlockRequirement?.scenarioId?.replace(/_/g, ' ')} first
              </span>
            )}
          </div>
        </div>

        {/* Decorative glow */}
        {unlocked && (
          <div className="absolute -top-10 -right-10 w-20 h-20 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
        )}
      </div>
    </motion.div>
  );
}
