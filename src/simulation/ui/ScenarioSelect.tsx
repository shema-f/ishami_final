// ============================================================
// ISHAMI SIMULATION — Scenario Selection Screen
// Arcade "level select" UI over a live aerial view of the
// ISHAMI 3D city (ISHAMI_CITY1.glb). Choose missions with
// unlock progression and stats.
// ============================================================

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import {
  ArrowLeft, Lock, Star, Trophy, Zap, Target, Award, Plus,
} from 'lucide-react';
import { useTranslation } from '../../contexts/I18nContext';
import { useAuth } from '../../contexts/AuthContext';
import PaypackPayment from '../../components/PaypackPayment';
import AerialCityBackground from './AerialCityBackground';
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

  const getStars = (scenarioId: string): number => profile.scenarios[scenarioId]?.stars || 0;
  const getBestScore = (scenarioId: string): number => profile.scenarios[scenarioId]?.bestScore || 0;

  return (
    <div className="relative min-h-screen text-white">
      {/* Live aerial view of the ISHAMI 3D city */}
      <AerialCityBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-20">
        {/* ── Top bar: back + arcade HUD ── */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <button
            onClick={() => navigate('/')}
            aria-label="Back"
            className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-white bg-gradient-to-b from-red-500 to-red-600 text-white shadow-[0_6px_16px_rgba(0,0,0,0.45)] transition-transform hover:scale-105 active:scale-95"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={3} />
          </button>

          {/* XP coin counter + upgrade */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-full border-2 border-yellow-400/70 bg-gradient-to-b from-yellow-500/25 to-amber-600/15 px-3 py-1.5 shadow-lg shadow-black/30">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-gradient-to-b from-yellow-300 to-yellow-500 text-yellow-900">
                <Trophy className="h-3.5 w-3.5" strokeWidth={2.5} />
              </span>
              <span className="text-sm font-black tabular-nums">{profile.totalXP}</span>
              <span className="text-[9px] font-bold uppercase tracking-wider text-yellow-200/80">XP</span>
              {!hasFullAccess && (
                <button
                  onClick={() => setShowPaywall(true)}
                  aria-label="Get Full Access"
                  className="ml-1 grid h-6 w-6 place-items-center rounded-lg bg-gradient-to-b from-sky-400 to-blue-600 text-white shadow shadow-blue-900/50 transition-transform hover:scale-110 active:scale-95"
                >
                  <Plus className="h-4 w-4" strokeWidth={3} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── LEVELS SELECTION banner ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-5"
        >
          <h1
            className="text-3xl sm:text-5xl font-black uppercase tracking-[0.12em] text-white"
            style={{
              fontFamily: 'var(--font-heading)',
              textShadow: '0 2px 0 #0891b2, 0 5px 0 rgba(0,0,0,0.35), 0 12px 30px rgba(8,145,178,0.45)',
            }}
          >
            {t('sim.scenario_select_title', 'Driving Scenarios')}
          </h1>
          <div className="mx-auto mt-3 h-1 w-40 rounded-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
        </motion.div>

        {/* ── - SELECT YOUR BEST LEVEL - ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-7 flex items-center justify-center gap-4"
        >
          <span className="h-px w-10 sm:w-24 bg-white/50" />
          <p className="text-center text-[11px] sm:text-xs font-black uppercase tracking-[0.35em] text-white/90">
            {t('sim.scenario_select_subtitle', 'Choose a scenario to test your driving skills')}
          </p>
          <span className="h-px w-10 sm:w-24 bg-white/50" />
        </motion.div>

        {/* ── Player stats chips ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-6 flex flex-wrap items-center justify-center gap-2"
        >
          <Chip icon={<Target className="h-3.5 w-3.5 text-emerald-300" />} text={`Level ${profile.level}`} />
          <Chip icon={<Zap className="h-3.5 w-3.5 text-sky-300" />} text={`${profile.totalSimulations} runs`} />
          <button
            onClick={() => setShowAchievements(!showAchievements)}
            className={`flex items-center gap-2 rounded-full border-2 px-4 py-1.5 text-xs font-bold transition-all ${
              showAchievements
                ? 'border-purple-400 bg-purple-500/25 text-purple-100'
                : 'border-white/25 bg-white/10 text-white/85 hover:border-white/50'
            }`}
          >
            <Award className="h-3.5 w-3.5 text-purple-300" />
            {profile.achievements.length}/{ALL_ACHIEVEMENTS.length}
            <span className="uppercase text-[9px] tracking-wider opacity-80">achievements</span>
          </button>
        </motion.div>

        {/* ── Difficulty filter ── */}
        <div className="mb-10 flex flex-wrap items-center justify-center gap-1.5 md:gap-2">
          {difficulties.map(d => (
            <button
              key={d}
              onClick={() => setSelectedDifficulty(d)}
              className={`px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-widest border-2 transition-all ${
                selectedDifficulty === d
                  ? d === 'BEGINNER'
                    ? 'border-emerald-400 bg-emerald-500/25 text-emerald-200 shadow-lg shadow-emerald-900/40'
                    : d === 'INTERMEDIATE'
                      ? 'border-amber-400 bg-amber-500/25 text-amber-200 shadow-lg shadow-amber-900/40'
                      : d === 'ADVANCED'
                        ? 'border-red-400 bg-red-500/25 text-red-200 shadow-lg shadow-red-900/40'
                        : 'border-sky-400 bg-sky-500/25 text-sky-100 shadow-lg shadow-sky-900/40'
                  : 'border-white/15 bg-white/5 text-white/60 hover:border-white/40 hover:text-white'
              }`}
            >
              {d === 'ALL' ? 'All' : d}
            </button>
          ))}
        </div>

        {/* ── Achievements panel ── */}
        <AnimatePresence>
          {showAchievements && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8"
            >
              <div className="rounded-2xl border-2 border-white/15 bg-black/55 p-5 backdrop-blur-md">
                <h3 className="mb-4 text-xs font-black uppercase tracking-[0.3em] text-purple-300">
                  {lang === 'rw' ? 'Ibyagezweho' : 'Achievements'}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {ALL_ACHIEVEMENTS.map(a => {
                    const unlocked = profile.achievements.includes(a.id);
                    return (
                      <div
                        key={a.id}
                        className={`p-3 rounded-xl border-2 text-center transition-all ${
                          unlocked
                            ? 'border-amber-400/40 bg-amber-500/10'
                            : 'border-white/10 bg-white/[0.03] opacity-50 grayscale'
                        }`}
                      >
                        <div className="text-2xl mb-1">{a.icon}</div>
                        <div className="text-[10px] font-bold text-white">{a.title}</div>
                        <div className="text-[9px] text-slate-400 mt-0.5">+{a.xp} XP</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Scenario "level" cards ── */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-3 md:gap-x-6 lg:grid-cols-5">
          {filteredScenarios.map((scenario, i) => (
            <LevelCard
              key={scenario.id}
              scenario={scenario}
              index={i}
              profile={profile}
              stars={getStars(scenario.id)}
              bestScore={getBestScore(scenario.id)}
              onPlay={() => {
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

        {filteredScenarios.length === 0 && (
          <p className="py-16 text-center text-sm text-white/50">No scenarios in this category.</p>
        )}
      </div>

      {/* ── Paywall overlay ── */}
      {showPaywall && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowPaywall(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0b1220] rounded-3xl p-8 max-w-md w-full border-2 border-white/15 shadow-2xl"
          >
            <div className="text-center">
              <div className="inline-flex p-4 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-3xl mb-6 shadow-lg shadow-yellow-500/30">
                <Lock className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-wide">
                {t('sim.paywall_title', 'Full Access Required')}
              </h2>
              <p className="text-gray-400 mb-4">
                3D Driving Simulation requires Full Access — <span className="text-yellow-400 font-bold">3,000 RWF</span>
              </p>

              {!user && (
                <div className="bg-blue-500/10 border border-blue-500/25 rounded-xl p-4 mb-4">
                  <p className="text-blue-300 text-sm mb-3">
                    {lang === 'rw'
                      ? 'Ufite konti? Injira kugirango ubike ibyo wagezeho.'
                      : 'Have an account? Sign in to save your progress and access paid features.'}
                  </p>
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

// ─── Small HUD chip ────────────────────────────────────────

function Chip({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 rounded-full border-2 border-white/25 bg-white/10 px-4 py-1.5 text-xs font-bold text-white/90">
      {icon}
      {text}
    </div>
  );
}

// ─── Difficulty accent helpers ─────────────────────────────

function difficultyTheme(difficulty: string) {
  switch (difficulty) {
    case 'BEGINNER':
      return { label: 'text-emerald-200', chip: 'border-emerald-400/60 bg-emerald-500/25 text-emerald-100', gradient: 'from-emerald-500/30' };
    case 'INTERMEDIATE':
      return { label: 'text-amber-200', chip: 'border-amber-400/60 bg-amber-500/25 text-amber-100', gradient: 'from-amber-500/30' };
    case 'ADVANCED':
      return { label: 'text-red-200', chip: 'border-red-400/60 bg-red-500/25 text-red-100', gradient: 'from-red-500/30' };
    default:
      return { label: 'text-white', chip: 'border-white/40 bg-white/15 text-white', gradient: 'from-sky-500/30' };
  }
}

// ─── Arcade level card ─────────────────────────────────────

function LevelCard({
  scenario,
  index,
  profile,
  stars,
  bestScore,
  onPlay,
  lang,
}: {
  scenario: ScenarioDefinition;
  index: number;
  profile: UserProfile;
  stars: number;
  bestScore: number;
  onPlay: () => void;
  lang: string;
}) {
  const unlocked = isScenarioUnlocked(scenario.id, profile);
  const completed = !!profile.scenarios[scenario.id]?.completed;
  const theme = difficultyTheme(scenario.difficulty);

  // Human-readable unlock requirement
  let unlockLabel = '';
  const reqId = scenario.unlockRequirement?.scenarioId;
  if (!unlocked && reqId) {
    const req = ALL_SCENARIOS.find(s => s.id === reqId);
    unlockLabel = req ? (lang === 'rw' ? req.titleRW : req.title) : reqId.replace(/_/g, ' ');
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.06, type: 'spring', stiffness: 260, damping: 22 }}
      className={`relative ${unlocked ? '' : 'opacity-90'}`}
    >
      {/* Top pin */}
      <span className="absolute -top-2 left-1/2 z-20 h-3.5 w-3.5 -translate-x-1/2 rounded-full border-2 border-slate-900/50 bg-white shadow-[0_2px_5px_rgba(0,0,0,0.6)]" />
      {/* Bottom pin */}
      <span className="absolute -bottom-2 left-1/2 z-20 h-3.5 w-3.5 -translate-x-1/2 rounded-full border-2 border-slate-900/50 bg-white shadow-[0_2px_5px_rgba(0,0,0,0.6)]" />

      <button
        onClick={() => unlocked && onPlay()}
        className={`group relative block w-full ${unlocked ? 'cursor-pointer' : 'cursor-not-allowed'}`}
        title={lang === 'rw' ? scenario.titleRW : scenario.title}
      >
        {/* LEVEL vertical tab */}
        <span
          className="absolute top-8 z-30 hidden h-20 items-center justify-center rounded-sm border border-white/80 bg-gradient-to-b from-blue-600 to-blue-800 py-1 text-[7px] font-black uppercase tracking-[0.3em] text-white shadow-lg md:flex"
          style={{ writingMode: 'vertical-rl', width: '18px', right: '-9px' }}
        >
          Level
        </span>

        {/* Card body */}
        <div
          className={`relative overflow-hidden rounded-[16px] border-[3px] transition-all duration-300 ${
            unlocked
              ? 'border-white/90 shadow-[0_14px_30px_-8px_rgba(0,0,0,0.7)] group-hover:-translate-y-1.5 group-hover:shadow-[0_20px_40px_-8px_rgba(34,211,238,0.35)]'
              : 'border-white/40'
          } ${unlocked ? '' : 'grayscale-[0.7]'}`}
          style={{
            background: 'linear-gradient(160deg, #155e75 0%, #0e7490 30%, #1d4ed8 75%, #172554 100%)',
          }}
        >
          {/* Dot pattern overlay */}
          <div
            className="pointer-events-none absolute inset-0 opacity-25"
            style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.85) 1.2px, transparent 1.6px)',
              backgroundSize: '13px 13px',
            }}
          />

          {/* Top badges */}
          <div className="relative z-10 flex items-center justify-between px-2 pt-2">
            <span className={`rounded-full border px-2 py-0.5 text-[7px] font-black uppercase tracking-[0.2em] ${theme.chip}`}>
              {scenario.difficulty}
            </span>
            <span className="rounded-full border border-white/40 bg-black/40 px-2 py-0.5 text-[7px] font-black uppercase tracking-widest text-white/85">
              #{scenario.order}
            </span>
          </div>

          {/* Sign medallion */}
          <div className="relative z-10 flex flex-col items-center px-2 pt-3 pb-2">
            <div
              className={`grid h-20 w-20 place-items-center rounded-full border-[3px] bg-white/10 text-4xl shadow-[inset_0_0_12px_rgba(0,0,0,0.35),0_4px_10px_rgba(0,0,0,0.35)] ${
                unlocked ? 'border-white/95' : 'border-white/40'
              }`}
            >
              {unlocked ? scenario.icon : <Lock className="h-7 w-7 text-white/80" />}
            </div>

            {/* Stars */}
            <div className="mt-1.5 flex h-3.5 items-center gap-0.5">
              {[1, 2, 3].map(s => (
                <Star
                  key={s}
                  className={`h-3 w-3 ${completed && s <= stars ? 'fill-amber-300 text-amber-300' : 'text-white/30'}`}
                />
              ))}
            </div>
            {completed && (
              <span className="mt-0.5 text-[9px] font-bold text-emerald-200">
                Best {Math.round(bestScore)}%
              </span>
            )}
          </div>

          {/* Bottom label banner */}
          <div className="relative z-10 border-t-2 border-white/50 bg-black/70 px-2 py-2 text-center">
            <p className="truncate text-[10px] font-black uppercase tracking-[0.12em] text-white">
              {lang === 'rw' ? scenario.titleRW : scenario.title}
            </p>
            <p className="mt-0.5 text-[8px] font-bold uppercase tracking-widest text-cyan-300/90">
              +{scenario.xpReward} XP
            </p>
          </div>

          {/* Inner corner glint */}
          <div className="pointer-events-none absolute inset-0 rounded-[13px] ring-1 ring-inset ring-white/15" />
        </div>
      </button>

      {/* Locked caption */}
      {!unlocked && (
        <p className="mt-3 text-center text-[9px] font-semibold uppercase tracking-wider text-white/55 leading-snug">
          {lang === 'rw'
            ? `Soreza: ${unlockLabel || scenario.difficulty}`
            : unlockLabel
              ? `Complete: ${unlockLabel}`
              : scenario.difficulty}
        </p>
      )}
    </motion.div>
  );
}
