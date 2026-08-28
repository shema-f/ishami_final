// ============================================================
// ISHAMI — 3D Driving Simulation Page (Enhanced)
// Full-featured orchestrator with audio, collisions, scoring,
// particles, mobile controls, and dynamic instructor
// ============================================================

import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Loader2, AlertTriangle, FastForward } from 'lucide-react';
import { useTranslation } from '../contexts/I18nContext';
import useDeviceCapability from '../hooks/useDeviceCapability';
import {
  createInitialState,
  type SimulationPhase,
  type InstructorStage,
  type GearState,
  type SimulationState,
} from '../simulation/core/SimulationState';
import { GUIDED_START_WAYPOINTS, GUIDED_START_CONFIG } from '../simulation/scenarios/GuidedStartConfig';
import { getScenarioConfig, ALL_SCENARIO_CONFIGS, type ScenarioConfig } from '../simulation/scenarios/AllScenarios';
import SimulationCanvas from '../simulation/ui/SimulationCanvas';
import MissionBriefing from '../simulation/ui/MissionBriefing';
import SimulationHUD from '../simulation/ui/SimulationHUD';
import InstructorPanel from '../simulation/ui/InstructorPanel';
import PreparationPanel from '../simulation/ui/PreparationPanel';
import ResultsScreen from '../simulation/ui/ResultsScreen';
import MobileControls from '../simulation/ui/MobileControls';
import CockpitDashboard from '../simulation/ui/CockpitDashboard';
import ScorePopup from '../simulation/ui/ScorePopup';
import MiniMap from '../simulation/ui/MiniMap';

// ─── New Systems ──────────────────────────────────────────
import { getAudioEngine } from '../simulation/audio/AudioEngine';
import { ScoringSystem } from '../simulation/core/ScoringSystem';
import { DynamicInstructor } from '../simulation/ai/DynamicInstructor';
import { ReplayRecorder, saveGhostReplay } from '../simulation/core/ReplaySystem';
import {
  loadProfile,
  recordScenarioCompletion,
  checkAchievements,
  unlockAchievement,
  type UserProfile,
} from '../simulation/core/ScenarioManager';

// ─── Stage progression order ──────────────────────────────

const STAGE_PROGRESS: InstructorStage[] = [
  'SEAT_ADJUSTMENT',
  'MIRROR_CHECK',
  'SEATBELT',
  'HANDBRAKE',
  'GEAR_CHECK',
  'ENGINE_START',
  'FIRST_GEAR',
  'MOVEMENT',
  'STEERING',
  'STOP',
  'COMPLETION',
];

function getNextStage(current: InstructorStage): InstructorStage {
  const idx = STAGE_PROGRESS.indexOf(current);
  if (idx < 0 || idx >= STAGE_PROGRESS.length - 1) return 'COMPLETION';
  return STAGE_PROGRESS[idx + 1];
}

// ─── Aerial Flyover Overlay ──────────────────────────────

const FLYOVER_LABELS = [
  { text: 'KIGALI', sub: 'Driving Training Area', delay: 0.5 },
  { text: 'CONVENTION CENTRE', sub: 'Training District', delay: 2.5 },
  { text: 'TRAINING ROUTE', sub: 'Follow the highlighted path', delay: 5.0 },
  { text: 'YOUR VEHICLE', sub: 'Starting Position', delay: 7.5 },
];

// ─── Route Preview Overlay ────────────────────────────
// Shows the route path, criteria, and step-by-step instructions

function RoutePreviewOverlay({
  waypoints,
  scenarioConfig,
  lang,
}: {
  waypoints: Waypoint[];
  scenarioConfig: any;
  lang: string;
}) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [showRoute, setShowRoute] = useState(false);
  const [showCriteria, setShowCriteria] = useState(false);

  // Cycle through waypoints as preview plays
  useEffect(() => {
    if (activeIdx >= waypoints.length - 1) return;
    const timer = setTimeout(() => setActiveIdx((i) => Math.min(i + 1, waypoints.length - 1)), 2500);
    return () => clearTimeout(timer);
  }, [activeIdx, waypoints.length]);

  useEffect(() => {
    const t1 = setTimeout(() => setShowRoute(true), 800);
    const t2 = setTimeout(() => setShowCriteria(true), 2000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const startWp = waypoints[0];
  const endWp = waypoints[waypoints.length - 1];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="absolute inset-0 z-30 pointer-events-none"
    >
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-black/80 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black/80 to-transparent" />

      {/* ═══ Title + Mission Info ═══ */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="absolute top-4 left-0 right-0 text-center"
      >
        <div className="text-[10px] text-blue-300 uppercase tracking-[0.35em] font-semibold mb-1">
          {t('sim.route_preview.title', 'ROUTE PREVIEW')}
        </div>
        <h2
          className="text-2xl md:text-3xl font-black text-white drop-shadow-2xl"
          style={{ fontFamily: 'var(--font-heading)', textShadow: '0 0 30px rgba(59,130,246,0.4)' }}
        >
          {lang === 'rw' ? scenarioConfig.titleRW : scenarioConfig.title}
        </h2>
        <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent mx-auto mt-1" />
      </motion.div>

      {/* ═══ START → DESTINATION Banner ═══ */}
      <AnimatePresence>
        {showRoute && (
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4"
          >
            <div className="bg-[#111827]/95 backdrop-blur-xl rounded-2xl border border-white/10 p-4 shadow-2xl">
              <div className="flex items-center justify-between gap-3">
                {/* START */}
                <div className="flex items-center gap-2 flex-1">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center">
                    <span className="text-green-400 text-sm font-bold">A</span>
                  </div>
                  <div>
                    <div className="text-[9px] text-green-400 uppercase font-bold tracking-wider">                       {t('sim.route_preview.start', 'START')}
                    </div>
                    <div className="text-xs text-white font-semibold">
                      {startWp.objective}
                    </div>
                  </div>
                </div>

                {/* Arrow + Road */}
                <div className="flex flex-col items-center gap-0.5 px-2">
                  <div className="text-[9px] text-slate-500 font-bold">ROAD</div>
                  <div className="flex items-center gap-1">
                    <div className="w-6 h-0.5 bg-blue-400" />
                    <div className="text-blue-400 text-lg">→</div>
                    <div className="w-6 h-0.5 bg-blue-400" />
                  </div>
                  <div className="text-[8px] text-slate-500">{waypoints.length} steps</div>
                </div>

                {/* DESTINATION */}
                <div className="flex items-center gap-2 flex-1 justify-end text-right">
                  <div>
                    <div className="text-[9px] text-red-400 uppercase font-bold tracking-wider">                       {t('sim.route_preview.destination', 'DESTINATION')}
                    </div>
                    <div className="text-xs text-white font-semibold">
                      {endWp.objective}
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center">
                    <span className="text-red-400 text-sm font-bold">B</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ Route Steps — Left Side ═══ */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-1">
        {waypoints.map((wp, i) => (
          <motion.div
            key={wp.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 + i * 0.12 }}
            className="flex items-center gap-1.5"
          >
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold border-2 transition-all duration-500 ${
                i < activeIdx ? 'bg-green-500/20 border-green-500 text-green-400'
                : i === activeIdx ? 'bg-blue-500/20 border-blue-400 text-blue-300 scale-125'
                : 'bg-white/5 border-white/20 text-slate-600'
              }`}
            >
              {i < activeIdx ? '✓' : i + 1}
            </div>
            <div className={`text-[9px] transition-all duration-300 ${
              i === activeIdx ? 'text-white font-semibold' : i < activeIdx ? 'text-green-400/60' : 'text-slate-600'
            }`}> 
              {i === activeIdx ? wp.objective : ''}
            </div>
          </motion.div>
        ))}
      </div>

      {/* ═══ Current Step Instruction ═══ */}
      <motion.div
        key={activeIdx}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="absolute bottom-32 left-1/2 -translate-x-1/2 text-center max-w-md"
      >
        <div className="bg-[#111827]/95 backdrop-blur-xl rounded-2xl border border-white/10 px-5 py-3 shadow-xl">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold border-2 ${
              activeIdx === 0 ? 'bg-green-500/20 border-green-500 text-green-400'
              : activeIdx === waypoints.length - 1 ? 'bg-red-500/20 border-red-500 text-red-400'
              : 'bg-blue-500/20 border-blue-400 text-blue-300'
            }`}>
              {activeIdx === 0 ? 'A' : activeIdx === waypoints.length - 1 ? 'B' : activeIdx + 1}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              {activeIdx === 0 ? t('sim.route_preview.starting_point', 'Starting point')
              : activeIdx === waypoints.length - 1 ? t('sim.route_preview.final_destination', 'Final destination')
              : t('sim.route_preview.step', 'Step {number}').replace('{number}', String(activeIdx + 1))}
            </span>
          </div>
          <p className="text-white text-sm font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
            {waypoints[activeIdx].objective}
          </p>
          <p className="text-slate-400 text-[11px] mt-0.5">
            {waypoints[activeIdx].instruction}
          </p>
        </div>
      </motion.div>

      {/* ═══ Criteria Panel — Right Side ═══ */}
      <AnimatePresence>
        {showCriteria && (
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ delay: 0.3 }}
            className="absolute right-4 top-36 max-w-[220px]"
          >
            <div className="bg-[#111827]/95 backdrop-blur-xl rounded-2xl border border-white/10 p-3 shadow-xl">
              <div className="text-[9px] text-amber-400 uppercase tracking-wider font-bold mb-2">
                {t('sim.mission_criteria.title', 'Mission Criteria')}
              </div>

              {/* Speed limit */}
              <div className="flex items-center gap-2 mb-1.5 px-2 py-1 rounded-lg bg-white/5">
                <span className="text-sm">⚡</span>
                <div>
                  <div className="text-[8px] text-slate-500">{t('sim.mission_criteria.speed_limit', 'Speed Limit')}</div>
                  <div className="text-[11px] text-white font-bold">{scenarioConfig.speedLimit || 30} km/h</div>
                </div>
              </div>

              {/* Time */}
              <div className="flex items-center gap-2 mb-1.5 px-2 py-1 rounded-lg bg-white/5">
                <span className="text-sm">⏱️</span>
                <div>
                  <div className="text-[8px] text-slate-500">{t('sim.mission_criteria.time', 'Time')}</div>
                  <div className="text-[11px] text-white font-bold">{scenarioConfig.estimatedTime}</div>
                </div>
              </div>

              {/* XP */}
              <div className="flex items-center gap-2 mb-2 px-2 py-1 rounded-lg bg-white/5">
                <span className="text-sm">🏆</span>
                <div>
                  <div className="text-[8px] text-slate-500">XP</div>
                  <div className="text-[11px] text-blue-400 font-bold">+{scenarioConfig.xpReward}</div>
                </div>
              </div>

              {/* Rules */}
              <div className="text-[9px] text-slate-400 space-y-1 border-t border-white/5 pt-2">
                <div className="flex items-center gap-1">
                  <span className="text-green-400">✓</span>
                  <span>{t('sim.mission_criteria.follow_route', 'Follow the highlighted route')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-green-400">✓</span>
                  <span>{t('sim.mission_criteria.signal_turns', 'Signal at every turn')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-green-400">✓</span>
                  <span>{`Max ${scenarioConfig.speedLimit || 30} km/h`}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-red-400">✗</span>
                  <span>{t('sim.mission_criteria.no_collisions', 'No building collisions')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-red-400">✗</span>
                  <span>{t('sim.mission_criteria.no_speeding', 'No speeding')}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ Progress Dots ═══ */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
        {waypoints.map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0.5, opacity: 0.3 }}
            animate={{
              scale: i === activeIdx ? 1.4 : 0.7,
              opacity: i <= activeIdx ? 1 : 0.25,
              backgroundColor: i < activeIdx ? '#22c55e' : i === activeIdx ? '#3b82f6' : '#475569',
            }}
            transition={{ duration: 0.3 }}
            className="w-2 h-2 rounded-full"
          />
        ))}
      </div>

      {/* Skip hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black/50 backdrop-blur-sm border border-white/10">
          <span className="text-xs text-white/60">Press</span>
          <kbd className="px-2 py-0.5 bg-white/10 rounded text-xs text-white font-bold">ENTER</kbd>
          <span className="text-xs text-white/60">to skip</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

function AerialOverlay() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="absolute inset-0 z-30 pointer-events-none"
    >
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/60 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/70 to-transparent" />

      {FLYOVER_LABELS.map((label, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{
            delay: label.delay,
            duration: 2.5,
            times: [0, 0.15, 0.7, 1],
          }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center"
        >
          <div className="text-xs text-blue-300 uppercase tracking-[0.35em] font-semibold mb-1">
            {label.sub}
          </div>
          <h2
            className="text-4xl md:text-5xl font-black text-white drop-shadow-2xl"
            style={{ fontFamily: 'var(--font-heading)', textShadow: '0 0 40px rgba(59,130,246,0.4)' }}
          >
            {label.text}
          </h2>
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent mx-auto mt-3" />
        </motion.div>
      ))}

      <div className="absolute bottom-8 left-0 right-0 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <div className="text-xs text-amber-400 uppercase tracking-[0.25em] font-bold mb-1">
            Guided Start
          </div>
          <div className="text-sm text-slate-300" style={{ fontFamily: 'var(--font-heading)' }}>
            Gutangira Gutwara
          </div>
        </motion.div>

        <div className="flex items-center justify-center gap-2 mt-4">
          {FLYOVER_LABELS.map((_, idx) => (
            <motion.div
              key={idx}
              initial={{ scale: 0.5, opacity: 0.3 }}
              animate={{ scale: [0.5, 1.2, 0.8], opacity: [0.3, 1, 0.5] }}
              transition={{
                delay: FLYOVER_LABELS[idx].delay + 0.5,
                duration: 2,
                repeat: 0,
              }}
              className="w-2 h-2 rounded-full bg-blue-400"
            />
          ))}
        </div>
      </div>

      <div className="absolute top-6 right-6 flex items-center gap-2">
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-sm border border-white/10"
        >
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs text-white/70 font-medium">AERIAL VIEW</span>
        </motion.div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 pointer-events-auto">
        <div className="flex flex-col items-center gap-3">
          <kbd className="px-4 py-2 bg-blue-500/20 rounded-lg border-2 border-blue-400 text-white font-bold text-lg animate-pulse">↵ ENTER</kbd>
          <span className="text-xs text-blue-300 font-medium tracking-[0.2em] uppercase">Press to continue to game</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function Simulation() {
  const { t, lang } = useTranslation();
  const navigate = useNavigate();
  const { scenarioId } = useParams();
  const { is3DCapable, isMobile, isLoading: deviceLoading } = useDeviceCapability();

  // ─── Resolve which scenario to play ─────────────────
  const activeScenario: ScenarioConfig | null = scenarioId
    ? (getScenarioConfig(scenarioId) || null)
    : null;
  const scenarioConfig = activeScenario || {
    id: 'guided_start',
    title: 'Guided Start',
    titleRW: 'Gutangira Gutwara',
    maxSpeed: 40,
    speedLimit: 30,
    xpReward: 250,
    waypoints: GUIDED_START_WAYPOINTS,
  };
  const scenarioWaypoints = activeScenario?.waypoints || GUIDED_START_WAYPOINTS;
  const carStartPos: [number, number, number] = scenarioWaypoints[0]?.position || [68, 0, -126];

  // ─── Core State ─────────────────────────────────────
  const [simState, setSimState] = useState<SimulationState>(createInitialState);
  const stateRef = useRef(simState);
  const [phase, setPhase] = useState<SimulationPhase>('loading');
  const [loadingProgress, setLoadingProgress] = useState(0);

  // ─── Instructor ─────────────────────────────────────
  const [instructorTrigger, setInstructorTrigger] = useState('stage_enter');
  const [dynamicMessage, setDynamicMessage] = useState<{ text: string; type: string } | null>(null);

  // ─── Vehicle ────────────────────────────────────────
  const [speed, setSpeed] = useState(0);
  const [rpm, setRpm] = useState(900);
  const [cameraMode, setCameraMode] = useState<'thirdPerson' | 'cockpit'>('thirdPerson');
  const [isMuted, setIsMuted] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1); // 0=close, 1=normal, 2=far, 3=aerial

  // ─── New Systems ────────────────────────────────────
  const audioRef = useRef(getAudioEngine());
  const scoringRef = useRef(new ScoringSystem());
  const dynamicInstructorRef = useRef(new DynamicInstructor());
  const replayRecorderRef = useRef(new ReplayRecorder());
  const profileRef = useRef<UserProfile>(loadProfile());
  const gameTimeRef = useRef(0);
  const prevBrakeRef = useRef(false);
  const prevSpeedRef = useRef(0);

  // ─── Input Refs ─────────────────────────────────────
  const keysRef = useRef<Set<string>>(new Set());
  const gearRef = useRef<GearState>('N');
  const clutchRef = useRef(false);
  const handbrakeRef = useRef(true);
  const engineRunningRef = useRef(false);
  const engineStalledRef = useRef(false);

  // ─── Touch State (for mobile) ───────────────────────
  const touchAccelRef = useRef(false);
  const touchBrakeRef = useRef(false);
  const touchClutchRef = useRef(false);
  const touchSteerRef = useRef(0);

  // ─── Waypoints ──────────────────────────────────────
  const [waypoints, setWaypoints] = useState(
    scenarioWaypoints.map((wp) => ({ ...wp, completed: false }))
  );
  const currentWpRef = useRef(0);

  // ─── Sync state to ref and global ───────────────────
  useEffect(() => {
    stateRef.current = simState;
    (window as any).__ishami_state = simState;
    (window as any).__ishami_currentWp = currentWpRef.current;
  }, [simState]);

  // ─── Initialize Audio on first interaction ──────────
  useEffect(() => {
    const initAudio = async () => {
      try { await audioRef.current.init(); } catch {}
    };
    const handler = () => {
      initAudio();
      window.removeEventListener('click', handler);
      window.removeEventListener('keydown', handler);
      window.removeEventListener('touchstart', handler);
    };
    window.addEventListener('click', handler, { once: true });
    window.addEventListener('keydown', handler, { once: true });
    window.addEventListener('touchstart', handler, { once: true });
    return () => {
      window.removeEventListener('click', handler);
      window.removeEventListener('keydown', handler);
      window.removeEventListener('touchstart', handler);
    };
  }, []);

  // ─── Skip Preparation Helper ────────────────────────
  const skipToDriving = useCallback(() => {
    // Auto-complete all preparation steps
    engineRunningRef.current = true;
    engineStalledRef.current = false;
    gearRef.current = '1';
    clutchRef.current = false;
    handbrakeRef.current = false;

    setSimState((prev) => ({
      ...prev,
      seatAdjusted: true,
      mirrorsChecked: { left: true, right: true, rear: true },
      seatbeltFastened: true,
      handbrakeOn: false,
      engineRunning: true,
      engineStalled: false,
      gear: '1',
      clutchPressed: false,
      instructorStage: 'MOVEMENT',
    }));

    (window as any).__ishami_state = {
      ...(window as any).__ishami_state,
      seatAdjusted: true,
      mirrorsChecked: { left: true, right: true, rear: true },
      seatbeltFastened: true,
      handbrakeOn: false,
      engineRunning: true,
      engineStalled: false,
      gear: '1',
      clutchPressed: false,
    };

    audioRef.current.playSuccess();
    setPhase('driving');
    setInstructorTrigger('stage_enter');
  }, []);

  // ─── Audio Updates ──────────────────────────────────
  useEffect(() => {
    if (phase !== 'driving') return;
    audioRef.current.updateEngine(
      rpm,
      touchAccelRef.current || keysRef.current.has('KeyW') || keysRef.current.has('ArrowUp'),
      gearRef.current
    );
    audioRef.current.updateWind(speed);
  }, [speed, rpm, phase]);

  // ─── Scoring Updates ────────────────────────────────
  useEffect(() => {
    if (phase !== 'driving') return;
    const interval = setInterval(() => {
      const s = stateRef.current;
      const scoring = scoringRef.current;

      scoring.scoreSmoothDriving(speed, s.steeringAngle);
      scoring.scoreSafeSpeed(speed, 30);

      if (s.brakePressed && !prevBrakeRef.current && prevSpeedRef.current > 10) {
        scoring.penaltyHardBraking();
      }
      prevBrakeRef.current = s.brakePressed;
      prevSpeedRef.current = speed;

      if (Math.abs(s.steeringAngle) > 0.6 && speed > 15) {
        scoring.penaltyAggressiveSteering();
      }

      if (speed > 35) {
        scoring.penaltySpeedViolation(speed, 30);
        audioRef.current.playWarning();
      }

      scoring.updateCombo(100);

      const dynMsg = dynamicInstructorRef.current.getAdaptiveMessage(
        {
          speed,
          gear: s.gear,
          rpm,
          engineRunning: s.engineRunning,
          engineStalled: s.engineStalled,
          clutchPressed: s.clutchPressed,
          handbrakeOn: s.handbrakeOn,
          brakePressed: s.brakePressed,
          acceleratorPressed: s.acceleratorPressed,
          steeringAngle: s.steeringAngle,
          mistakeCount: s.mistakes.length,
          comboStreak: scoring.getCombo().streak,
          score: scoring.getScore(),
          elapsedTime: gameTimeRef.current,
          currentWaypoint: currentWpRef.current,
          totalWaypoints: waypoints.length,
          stage: s.instructorStage,
        },
        lang
      );

      if (dynMsg) {
        setDynamicMessage({ text: dynMsg.text, type: dynMsg.type });
      }

      gameTimeRef.current += 0.1;
    }, 100);

    return () => clearInterval(interval);
  }, [phase, speed, rpm, lang, waypoints.length]);

  // ─── Keyboard Input ─────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.code);
      (window as any).__ishami_keys = keysRef.current;

      // ─── ENTER = Step through phases sequentially ───
      if (e.code === 'Enter' || e.code === 'NumpadEnter') {
        if (phase === 'cinematic') {
          setPhase('aerial');
          return;
        } else if (phase === 'aerial') {
          setPhase('route_preview');
          return;
        } else if (phase === 'route_preview') {
          setPhase('briefing');
          return;
        }
      }

      // Camera toggle
      if (e.code === 'KeyC' && (phase === 'driving' || phase === 'preparation')) {
        setCameraMode((prev) => (prev === 'thirdPerson' ? 'cockpit' : 'thirdPerson'));
      }

      // Mute toggle
      if (e.code === 'KeyM') {
        setIsMuted(audioRef.current.toggleMute());
      }

      // ─── TAB = Skip preparation and start driving ───
      if (e.code === 'Tab' && phase === 'preparation') {
        e.preventDefault();
        skipToDriving();
        return;
      }

      // ─── PREPARATION KEYBOARD SHORTCUTS ───
      if (phase === 'preparation') {
        const stage = stateRef.current.instructorStage;

        if (e.code === 'Enter' || e.code === 'NumpadEnter') {
          if (stage === 'SEAT_ADJUSTMENT') handleSeatAdjust();
          else if (stage === 'SEATBELT') handleSeatbeltFasten();
          else if (stage === 'ENGINE_START') handleEngineStart();
        }

        if (e.code === 'Space' && stage === 'HANDBRAKE') {
          e.preventDefault();
          handleHandbrakeToggle();
        }

        if ((e.code === 'ShiftLeft' || e.code === 'ShiftRight') && stage === 'ENGINE_START') {
          handleClutchToggle(true);
        }

        // Gear selection during preparation
        if (stage === 'GEAR_CHECK') {
          if (e.code === 'Digit1') { gearRef.current = '1'; handleGearSelect('1'); }
          if (e.code === 'Digit2') { gearRef.current = '2'; handleGearSelect('2'); }
          if (e.code === 'KeyN') { gearRef.current = 'N'; handleGearSelect('N'); }
          if (e.code === 'KeyR') { gearRef.current = 'R'; handleGearSelect('R'); }
        }
        if (stage === 'FIRST_GEAR') {
          if (e.code === 'Digit1') { gearRef.current = '1'; handleGearSelect('1'); }
          if (e.code === 'KeyN') { gearRef.current = 'N'; handleGearSelect('N'); }
          if (e.code === 'KeyR') { gearRef.current = 'R'; handleGearSelect('R'); }
        }
      }

      // Gear selection during driving
      if (phase === 'driving') {
        if (e.code === 'Digit1') { gearRef.current = '1'; handleGearSelect('1'); }
        if (e.code === 'Digit2') { gearRef.current = '2'; handleGearSelect('2'); }
        if (e.code === 'Digit3') { gearRef.current = '3'; handleGearSelect('3'); }
        if (e.code === 'KeyN') { gearRef.current = 'N'; handleGearSelect('N'); }
        if (e.code === 'KeyR') { gearRef.current = 'R'; handleGearSelect('R'); }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.code);
      (window as any).__ishami_keys = keysRef.current;

      if ((e.code === 'ShiftLeft' || e.code === 'ShiftRight') && phase === 'preparation') {
        handleClutchToggle(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [phase, skipToDriving]);

  // ─── Scroll Wheel Zoom ──────────────────────────────
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (phase !== 'driving' && phase !== 'preparation') return;
      e.preventDefault();
      setZoomLevel((prev) => {
        if (e.deltaY < 0) {
          // Scroll up = zoom in
          return Math.max(0, prev - 1);
        } else {
          // Scroll down = zoom out
          return Math.min(3, prev + 1);
        }
      });
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [phase]);

  // ─── Pinch-to-Zoom for Mobile ───────────────────────
  useEffect(() => {
    let lastDist = 0;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        lastDist = Math.sqrt(dx * dx + dy * dy);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && lastDist > 0) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const delta = dist - lastDist;
        lastDist = dist;

        if (Math.abs(delta) > 15) {
          setZoomLevel((prev) => {
            if (delta > 0) return Math.min(3, prev + 1);
            return Math.max(0, prev - 1);
          });
        }
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  // ─── Game Loop (input polling) ──────────────────────
  // Runs during both preparation and driving so the car is always responsive
  useEffect(() => {
    if (phase !== 'driving' && phase !== 'preparation') return;

    // Start recording
    if (phase === 'driving') {
      replayRecorderRef.current.start();
    }

    const interval = setInterval(() => {
      const keys = keysRef.current;

      // Read keyboard input
      const kbdAccel = keys.has('KeyW') || keys.has('ArrowUp');
      const kbdBrake = keys.has('KeyS') || keys.has('ArrowDown');
      const kbdClutch = keys.has('ShiftLeft') || keys.has('ShiftRight');
      const kbdHandbrake = keys.has('Space');

      // Merge with touch input
      const accel = kbdAccel || touchAccelRef.current;
      const brake = kbdBrake || touchBrakeRef.current;
      const clutch = kbdClutch || touchClutchRef.current;
      const handbrake = kbdHandbrake;

      // Steering from keyboard or touch
      let steerAngle = 0;
      if (keys.has('KeyA') || keys.has('ArrowLeft')) steerAngle -= 1;
      if (keys.has('KeyD') || keys.has('ArrowRight')) steerAngle += 1;
      if (touchSteerRef.current !== 0) steerAngle = touchSteerRef.current;
      steerAngle = Math.max(-1, Math.min(1, steerAngle));

      clutchRef.current = clutch;
      handbrakeRef.current = handbrake;

      // Update global state for physics
      (window as any).__ishami_state = {
        ...(window as any).__ishami_state,
        acceleratorPressed: accel,
        brakePressed: brake && !accel,
        clutchPressed: clutch,
        handbrakeOn: handbrake,
        steeringAngle: steerAngle,
        gear: gearRef.current,
        engineRunning: engineRunningRef.current,
        engineStalled: engineStalledRef.current,
      };

      // Update React state
      setSimState((prev) => ({
        ...prev,
        acceleratorPressed: accel,
        brakePressed: brake && !accel,
        clutchPressed: clutch,
        handbrakeOn: handbrake,
        steeringAngle: steerAngle,
        gear: gearRef.current,
        engineRunning: engineRunningRef.current,
        engineStalled: engineStalledRef.current,
      }));

      // Tire screech on hard braking at speed
      if (brake && speed > 20) {
        audioRef.current.playTireScreech(Math.min((speed - 20) / 30, 1));
      } else {
        audioRef.current.stopTireScreech();
      }
    }, 33);

    return () => {
      clearInterval(interval);
      audioRef.current.stopTireScreech();
    };
  }, [phase, speed]);

  // ─── Speed Update Callback ──────────────────────────
  const handleSpeedUpdate = useCallback((newSpeed: number, newRpm: number) => {
    setSpeed(newSpeed);
    setRpm(newRpm);

    if (phase === 'driving') {
      replayRecorderRef.current.recordFrame(
        (window as any).__ishami_carPosition || { x: 0, y: 0, z: 0 },
        (window as any).__ishami_carRotation || 0,
        newSpeed,
        gearRef.current
      );
    }
  }, [phase]);

  // ─── Building Collision Handler ─────────────────────
  const handleBuildingCollision = useCallback((severity: 'MINOR' | 'WARNING' | 'MAJOR', point: THREE.Vector3) => {
    if (phase !== 'driving') return;

    // Play collision sound
    audioRef.current.playWarning();

    // Track as a mistake
    const messages: Record<string, string> = {
      MINOR: 'You bumped into an obstacle. Drive more carefully!',
      WARNING: 'Careful! You hit a building. Slow down near structures.',
      MAJOR: 'Dangerous collision! You must avoid buildings entirely.',
    };
    const message = messages[severity];

    // Add penalty to scoring
    scoringRef.current.penaltyHardBraking(); // reuse penalty scoring

    // Track mistake in state
    setSimState((prev) => ({
      ...prev,
      mistakes: [...prev.mistakes, {
        type: 'COLLISION',
        message,
        timestamp: Date.now(),
      }],
    }));

    // Show dynamic instructor correction
    setDynamicMessage({ text: `⚠️ ${message}`, type: 'correction' });
  }, [phase]);

  // ─── Touch Handlers ─────────────────────────────────
  const handleTouchAccel = useCallback((pressed: boolean) => { touchAccelRef.current = pressed; }, []);
  const handleTouchBrake = useCallback((pressed: boolean) => { touchBrakeRef.current = pressed; }, []);
  const handleTouchClutch = useCallback((pressed: boolean) => { touchClutchRef.current = pressed; }, []);
  const handleTouchSteer = useCallback((angle: number) => { touchSteerRef.current = angle; }, []);

  // ─── Loading Progress & Phase Transition ────────────
  useEffect(() => {
    if (phase !== 'loading') return;
    const progressSteps = [
      { pct: 20, delay: 500 },
      { pct: 45, delay: 1500 },
      { pct: 70, delay: 3000 },
      { pct: 90, delay: 5000 },
      { pct: 100, delay: 7000 },
    ];
    const timers: ReturnType<typeof setTimeout>[] = [];
    progressSteps.forEach(({ pct, delay }) => {
      timers.push(setTimeout(() => setLoadingProgress(pct), delay));
    });
    timers.push(setTimeout(() => setPhase('cinematic'), 7500));
    return () => timers.forEach(clearTimeout);
  }, [phase]);

  // ─── Cinematic → Aerial ────────────────────────────
  useEffect(() => {
    if (phase === 'cinematic') {
      const timer = setTimeout(() => setPhase('aerial'), 8000);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  // ─── Aerial Complete → Route Preview ───────────────
  const handleAerialComplete = useCallback(() => {
  }, []);

  // ─── Route Preview Complete → Briefing ─────────────
  const handleRoutePreviewComplete = useCallback(() => {
  }, []);

  // ─── Canvas Ready ──────────────────────────────────
  const handleSceneReady = useCallback(() => {
    setLoadingProgress((prev) => Math.max(prev, 100));
  }, []);

  // ─── Stage Advancement ──────────────────────────────
  const advanceStage = useCallback((currentStage: InstructorStage) => {
    setInstructorTrigger('step_complete');
    setTimeout(() => {
      const next = getNextStage(currentStage);
      setSimState((prev) => ({ ...prev, instructorStage: next }));
      setInstructorTrigger('stage_enter');

      if (next === 'MOVEMENT') {
        setPhase('driving');
      }
    }, 1500);
  }, []);

  // ─── Preparation Actions ────────────────────────────
  const handleSeatAdjust = useCallback(() => {
    audioRef.current.playUIClick();
    scoringRef.current.addScore(5, 'Seat adjusted', 'SAFETY');
    setSimState((prev) => ({ ...prev, seatAdjusted: true }));
    advanceStage('SEAT_ADJUSTMENT');
  }, [advanceStage]);

  const handleMirrorCheck = useCallback((mirror: 'left' | 'right' | 'rear') => {
    audioRef.current.playUIClick();
    scoringRef.current.addScore(3, `Mirror check: ${mirror}`, 'SAFETY');
    setSimState((prev) => ({
      ...prev,
      mirrorsChecked: { ...prev.mirrorsChecked, [mirror]: true },
    }));

    const checked = stateRef.current.mirrorsChecked;
    const allDone =
      (mirror === 'left' && checked.right && checked.rear) ||
      (mirror === 'right' && checked.left && checked.rear) ||
      (mirror === 'rear' && checked.left && checked.right);

    if (allDone) {
      setTimeout(() => advanceStage('MIRROR_CHECK'), 500);
    } else {
      setInstructorTrigger('partial_complete');
    }
  }, [advanceStage]);

  const handleSeatbeltFasten = useCallback(() => {
    audioRef.current.playUIClick();
    scoringRef.current.addScore(5, 'Seatbelt fastened', 'SAFETY');
    setSimState((prev) => ({ ...prev, seatbeltFastened: true }));
    advanceStage('SEATBELT');
  }, [advanceStage]);

  const handleClutchToggle = useCallback((pressed: boolean) => {
    clutchRef.current = pressed;
    setSimState((prev) => ({ ...prev, clutchPressed: pressed }));
    (window as any).__ishami_state = {
      ...(window as any).__ishami_state,
      clutchPressed: pressed,
    };
  }, []);

  const handleHandbrakeToggle = useCallback(() => {
    audioRef.current.playUIClick();
    scoringRef.current.addScore(5, 'Handbrake released', 'VEHICLE_CONTROL');
    handbrakeRef.current = false;
    setSimState((prev) => ({ ...prev, handbrakeOn: false }));
    (window as any).__ishami_state = {
      ...(window as any).__ishami_state,
      handbrakeOn: false,
    };
    advanceStage('HANDBRAKE');
  }, [advanceStage]);

  const handleGearSelect = useCallback((gear: GearState) => {
    audioRef.current.playUIClick();
    gearRef.current = gear;
    setSimState((prev) => ({ ...prev, gear }));
    (window as any).__ishami_state = {
      ...(window as any).__ishami_state,
      gear,
    };

    const currentStage = stateRef.current.instructorStage;
    if (currentStage === 'GEAR_CHECK' && gear === 'N') {
      scoringRef.current.addScore(5, 'Neutral gear', 'VEHICLE_CONTROL');
      advanceStage('GEAR_CHECK');
    } else if (currentStage === 'FIRST_GEAR' && gear === '1') {
      scoringRef.current.addScore(10, 'First gear engaged', 'VEHICLE_CONTROL');
      advanceStage('FIRST_GEAR');
    } else if (currentStage === 'FIRST_GEAR' && gear !== '1') {
      scoringRef.current.penaltyWrongGear();
      setInstructorTrigger('wrong_action');
    }
  }, [advanceStage]);

  const handleEngineStart = useCallback(() => {
    const s = stateRef.current;
    if (s.clutchPressed && s.gear === 'N' && s.handbrakeOn) {
      audioRef.current.playSuccess();
      scoringRef.current.addScore(10, 'Engine started', 'VEHICLE_CONTROL');
      engineRunningRef.current = true;
      engineStalledRef.current = false;
      setSimState((prev) => ({ ...prev, engineRunning: true, engineStalled: false }));
      (window as any).__ishami_state = {
        ...(window as any).__ishami_state,
        engineRunning: true,
        engineStalled: false,
      };
      advanceStage('ENGINE_START');
    }
  }, [advanceStage]);

  // ─── Phase Transitions ──────────────────────────────
  const handleBriefingStart = useCallback(() => {
    setPhase('preparation');
    scoringRef.current.reset();
    dynamicInstructorRef.current.reset();
    gameTimeRef.current = 0;
    setSimState((prev) => ({
      ...prev,
      phase: 'preparation',
      instructorStage: 'SEAT_ADJUSTMENT',
      startTime: Date.now(),
      waypoints: waypoints,
    }));
  }, [waypoints]);

  const handleRetry = useCallback(() => {
    const newState = createInitialState();
    newState.waypoints = scenarioWaypoints.map((wp) => ({ ...wp, completed: false }));
    setSimState(newState);
    setWaypoints(scenarioWaypoints.map((wp) => ({ ...wp, completed: false })));
    engineRunningRef.current = false;
    engineStalledRef.current = false;
    gearRef.current = 'N';
    clutchRef.current = false;
    handbrakeRef.current = true;
    currentWpRef.current = 0;
    scoringRef.current.reset();
    dynamicInstructorRef.current.reset();
    replayRecorderRef.current = new ReplayRecorder();
    gameTimeRef.current = 0;
    setPhase('cinematic');
  }, [scenarioWaypoints]);

  // ─── Mission Complete ───────────────────────────────
  const handleMissionComplete = useCallback(() => {
    const finalScore = scoringRef.current.calculateFinalScore(stateRef.current);
    const replay = replayRecorderRef.current.stop();

    if (replay) {
      replay.score = finalScore;
      saveGhostReplay(scenarioConfig.id, replay);
    }

    profileRef.current = recordScenarioCompletion(
      profileRef.current,
      scenarioConfig.id,
      finalScore,
      scenarioConfig.xpReward,
      0,
      gameTimeRef.current
    );

    const newAchievements = checkAchievements(profileRef.current);
    newAchievements.forEach(a => {
      profileRef.current = unlockAchievement(profileRef.current, a);
    });

    setSimState(prev => ({
      ...prev,
      totalScore: finalScore,
      scoreCategories: scoringRef.current.getCategoryScores(),
      phase: 'results',
    }));

    setPhase('results');
  }, []);

  // ─── Device Check ───────────────────────────────────
  if (deviceLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!is3DCapable) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
            {t('sim.not_available.title', '3D Simulation Not Available')}
          </h2>
          <p className="text-slate-400 mb-4">
            {t('sim.not_available.description', 'The driving simulation requires a device with 3D graphics support. Please use a desktop computer or laptop.')}
          </p>
          <button
            onClick={() => navigate('/simulation')}
            className="px-6 py-3 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors"
          >
            {t('sim.not_available.return_home', 'Return Home')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#0d1117] overflow-hidden">
      {/* Back Button */}
      <div className="absolute top-4 left-4 z-50">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#111827]/80 backdrop-blur-lg border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">{t('sim.back_button', 'Back')}</span>
        </button>
      </div>

      {/* 3D Canvas — visible from aerial phase onward */}
      <div style={{ position: 'absolute', inset: 0, opacity: (phase === 'loading' || phase === 'cinematic') ? 0 : 1, transition: 'opacity 1.5s' }}>
        <SimulationCanvas
          onSpeedUpdate={handleSpeedUpdate}
          waypoints={waypoints}
          cameraMode={cameraMode}
          phase={phase}
          onReady={handleSceneReady}
          onAerialComplete={handleAerialComplete}
          onRoutePreviewComplete={handleRoutePreviewComplete}
          onCollision={handleBuildingCollision}
          startPos={carStartPos}
          zoomLevel={zoomLevel}
          speedLimit={scenarioConfig.speedLimit}
          objectives={scenarioConfig.objectives}
        />
      </div>

      {/* Loading Screen */}
      <AnimatePresence>
        {phase === 'loading' && (
          <motion.div
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#0d1117]"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                <span className="text-2xl">🚗</span>
              </div>
              <h2 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                {t('sim.loading.title', 'Loading ISHAMI Simulator')}
              </h2>
              <p className="text-sm text-slate-400 mb-6">{t('sim.loading.subtitle', 'Preparing Kigali environment...')}</p>
              <div className="w-64 mx-auto">
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                    animate={{ width: `${loadingProgress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cinematic Intro */}
      <AnimatePresence>
        {phase === 'cinematic' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none"
          >
            {/* Skip hint */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2"
            >
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black/50 backdrop-blur-sm border border-white/10">
                <span className="text-xs text-white/60">{t('sim.skip_hint.press', 'Press')}</span>
                <kbd className="px-2 py-0.5 bg-white/10 rounded text-xs text-white font-bold">{t('sim.skip_hint.enter', 'ENTER')}</kbd>
                <span className="text-xs text-white/60">{t('sim.skip_hint.to_skip', 'to skip')}</span>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 1 }}
              className="text-center"
            >
              <div className="text-xs text-blue-400 uppercase tracking-[0.3em] font-bold mb-2">
                {t('sim.cinematic.driving_area', 'Driving Training Area')}
              </div>
              <h1 className="text-5xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                KIGALI
              </h1>
              <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent mx-auto mb-3" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3, duration: 1 }}
              className="text-center mt-4"
            >
              <div className="text-xs text-amber-400 uppercase tracking-[0.2em] font-bold mb-1">
                {t('sim.guided_start', 'Guided Start')}
              </div>
              <div className="text-lg text-slate-400" style={{ fontFamily: 'var(--font-heading)' }}>
                {t('scen.1.title', 'Gutangira Gutwara')}
              </div>
            </motion.div>
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0d1117] to-transparent" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Aerial Flyover Overlay */}
      <AnimatePresence>
        {phase === 'aerial' && <AerialOverlay />}
      </AnimatePresence>

      {/* Route Preview Overlay */}
      <AnimatePresence>
        {phase === 'route_preview' && (
          <RoutePreviewOverlay
            waypoints={waypoints}
            scenarioConfig={scenarioConfig}
            lang={lang}
          />
        )}
      </AnimatePresence>

      {/* Mission Briefing */}
      <AnimatePresence>
        {phase === 'briefing' && <MissionBriefing onStart={handleBriefingStart} />}
      </AnimatePresence>

      {/* Preparation & Driving UI */}
      {(phase === 'preparation' || phase === 'driving') && (
        <>
          <PreparationPanel
            stage={simState.instructorStage}
            state={simState}
            onSeatAdjust={handleSeatAdjust}
            onMirrorCheck={handleMirrorCheck}
            onSeatbeltFasten={handleSeatbeltFasten}
            onClutchToggle={handleClutchToggle}
            onHandbrakeToggle={handleHandbrakeToggle}
            onGearSelect={handleGearSelect}
            onEngineStart={handleEngineStart}
          />

          <InstructorPanel
            stage={simState.instructorStage}
            trigger={instructorTrigger}
          />

          {/* Dynamic AI Instructor Message */}
          <AnimatePresence>
            {dynamicMessage && (
              <motion.div
                key={dynamicMessage.text}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute bottom-24 left-4 z-20 max-w-xs"
              >
                <div className={`px-3 py-2 rounded-xl backdrop-blur-lg border text-xs ${
                  dynamicMessage.type === 'warning'
                    ? 'bg-amber-500/15 border-amber-500/25 text-amber-300'
                    : dynamicMessage.type === 'celebration'
                    ? 'bg-blue-500/15 border-blue-500/25 text-blue-300'
                    : dynamicMessage.type === 'correction'
                    ? 'bg-red-500/15 border-red-500/25 text-red-300'
                    : 'bg-white/5 border-white/10 text-slate-300'
                }`}>
                  {dynamicMessage.text}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <SimulationHUD
            state={simState}
            speed={speed}
            rpm={rpm}
            onCameraChange={() => setCameraMode((prev) => prev === 'thirdPerson' ? 'cockpit' : 'thirdPerson')}
            onPause={() => setIsMuted(audioRef.current.toggleMute())}
          />

          {/* Score Popups & Combo Display */}
          <ScorePopup
            updates={scoringRef.current.getRecentUpdates(5)}
            combo={scoringRef.current.getCombo()}
          />

          {/* Cockpit Dashboard */}
          <CockpitDashboard
            speed={speed}
            rpm={rpm}
            state={simState}
            visible={cameraMode === 'cockpit' && phase === 'driving'}
          />

          {/* ═══ SKIP PREPARATION BUTTON ═══ */}
          {phase === 'preparation' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2 }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40"
            >
              <button
                onClick={skipToDriving}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 text-slate-400 hover:text-white hover:border-white/20 hover:bg-white/10 transition-all text-sm font-medium"
              >
                <FastForward className="w-4 h-4" />
                {t('sim.guided_start', 'Skip to Driving')}
                <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px] text-slate-500 ml-1">TAB</kbd>
              </button>
            </motion.div>
          )}

          {/* ═══ CONTROLS HINT (shown when driving starts) ═══ */}
          {phase === 'driving' && speed < 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-none"
            >
              <div className="bg-[#111827]/90 backdrop-blur-lg rounded-2xl border border-white/10 px-6 py-3 text-center">
                <div className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                  ⌨️ {lang === 'rw' ? 'Ubuyobozi' : 'Controls'}
                </div>
                <div className="grid grid-cols-3 gap-x-6 gap-y-1 text-[11px] text-slate-400">
                  <span><kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white text-[10px]">W/S</kbd> Gas / Brake</span>
                  <span><kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white text-[10px]">A/D</kbd> Steer</span>
                  <span><kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white text-[10px]">1/2/R</kbd> Gears</span>
                </div>
                <div className="mt-2 text-[10px] text-slate-500">
                  <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white text-[9px]">Scroll</kbd> Zoom in/out &nbsp;·&nbsp; <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white text-[9px]">C</kbd> Camera &nbsp;·&nbsp; <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white text-[9px]">M</kbd> Mute
                </div>
              </div>
            </motion.div>
          )}

          {/* Mini Map */}
          <MiniMap waypoints={waypoints} visible={phase === 'driving' || phase === 'preparation'} />

          {/* ═══ ZOOM CONTROLS ═══ */}
          {(phase === 'driving' || phase === 'preparation') && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-2">
              <button
                onClick={() => setZoomLevel((z) => Math.max(0, z - 1))}
                className="w-10 h-10 rounded-xl bg-[#111827]/80 backdrop-blur-lg border border-white/10 text-white text-lg font-bold hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center active:scale-90"
                title="Zoom In"
              >
                +
              </button>
              <div className="w-10 py-1 rounded-xl bg-[#111827]/80 backdrop-blur-lg border border-white/10 text-center">
                <div className="text-[9px] text-slate-500 uppercase tracking-wider mb-0.5">Zoom</div>
                <div className="text-[10px] text-white font-bold">
                  {zoomLevel === 0 ? '🔍 Close' : zoomLevel === 1 ? '🚗 Normal' : zoomLevel === 2 ? '🏙️ Far' : '🗺️ Aerial'}
                </div>
              </div>
              <button
                onClick={() => setZoomLevel((z) => Math.min(3, z + 1))}
                className="w-10 h-10 rounded-xl bg-[#111827]/80 backdrop-blur-lg border border-white/10 text-white text-lg font-bold hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center active:scale-90"
                title="Zoom Out"
              >
                −
              </button>
            </div>
          )}

          {/* Mobile Touch Controls — always shown on mobile */}
          {isMobile && (
            <MobileControls
              onAccelerate={handleTouchAccel}
              onBrake={handleTouchBrake}
              onClutch={handleTouchClutch}
              onSteer={handleTouchSteer}
              onHandbrake={handleHandbrakeToggle}
              onGearSelect={(g) => handleGearSelect(g as GearState)}
              onCameraToggle={() => setCameraMode((prev) => prev === 'thirdPerson' ? 'cockpit' : 'thirdPerson')}
              currentGear={gearRef.current}
              engineRunning={engineRunningRef.current}
            />
          )}

          {/* Mobile: Tap Skip button during preparation */}
          {isMobile && phase === 'preparation' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-44 left-1/2 -translate-x-1/2 z-40"
            >
              <button
                onClick={skipToDriving}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-500/30 backdrop-blur-lg border border-blue-500/40 text-white font-bold text-sm active:scale-95 transition-transform"
              >
                ⏩ {t('sim.guided_start', 'Skip to Driving')}
              </button>
            </motion.div>
          )}
        </>
      )}

      {/* Results Screen */}
      <AnimatePresence>
        {phase === 'results' && (
          <ResultsScreen
            state={simState}
            onRetry={handleRetry}
            onReturn={() => navigate('/simulation')}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
