import { useEffect, useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { flipcardsAPI } from '../services/api';
import { HelpCircle, CheckCircle2, ArrowRight, Lightbulb, ShieldCheck, Car, Gauge, TriangleAlert, OctagonX } from 'lucide-react';

interface Question {
  id: number;
  question_kiny: string;
  question_en: string;
  options: string[];
  correctAnswer: number;
  icon?: JSX.Element;
  accent?: string;
}

const allIcons = [
  <OctagonX key="stop" className="w-full h-full" />,
  <Gauge key="speed" className="w-full h-full" />,
  <TriangleAlert key="warn" className="w-full h-full" />,
  <Car key="car" className="w-full h-full" />,
  <ShieldCheck key="shield" className="w-full h-full" />,
  <Lightbulb key="bulb" className="w-full h-full" />,
];

const allAccents = [
  'from-rose-500 to-red-600',
  'from-amber-500 to-orange-600',
  'from-sky-500 to-blue-600',
  'from-emerald-500 to-teal-600',
  'from-violet-500 to-purple-600',
  'from-cyan-500 to-sky-600',
];

const sampleQuestions: Question[] = [
  {
    id: 1,
    question_kiny: "Icyapa cy'umutuku gikurikira hamwe n'umweru biduteye?",
    question_en: "What does a red traffic light mean?",
    options: ["Stop fully", "Slow down", "Yield", "Speed up"],
    correctAnswer: 0,
    accent: 'from-rose-500 to-red-600',
    icon: <OctagonX className="w-full h-full" />,
  },
  {
    id: 2,
    question_kiny: "Umuvuduko urengwa ku mujyi ni uwuhe?",
    question_en: "City speed limit?",
    options: ["30 km/h", "50 km/h", "70 km/h", "90 km/h"],
    correctAnswer: 1,
    accent: 'from-amber-500 to-orange-600',
    icon: <Gauge className="w-full h-full" />,
  },
  {
    id: 3,
    question_kiny: "Wahagarara he ku cyapa cy'umutuku?",
    question_en: "Stop at red light where?",
    options: ["After line", "Before stop line", "At crosswalk", "Any spot"],
    correctAnswer: 1,
    accent: 'from-sky-500 to-blue-600',
    icon: <OctagonX className="w-full h-full" />,
  },
  {
    id: 4,
    question_kiny: "Ibara ry'icyapa ryera n'umweru ridufasha ute?",
    question_en: "Red + white sign type?",
    options: ["Warning", "Prohibition", "Info", "Mandatory"],
    correctAnswer: 1,
    accent: 'from-violet-500 to-purple-600',
    icon: <ShieldCheck className="w-full h-full" />,
  },
  {
    id: 5,
    question_kiny: "Icyapa cy'umuhondo gihera amategeko y'umuhanda?",
    question_en: "Yield sign tells you to?",
    options: ["Stop always", "Slow & yield", "Keep going", "Honk horn"],
    correctAnswer: 1,
    accent: 'from-emerald-500 to-teal-600',
    icon: <TriangleAlert className="w-full h-full" />,
  },
  {
    id: 6,
    question_kiny: "Ushyize inde nyuma yo kugenda kurugero?",
    question_en: "Put on what before driving?",
    options: ["Radio", "Seatbelt", "Phone", "Sunglasses"],
    correctAnswer: 1,
    accent: 'from-cyan-500 to-sky-600',
    icon: <Car className="w-full h-full" />,
  },
  {
    id: 7,
    question_kiny: "Icyapa gihambaye ngo umuhanda ukurikire iki?",
    question_en: "Roundabout sign means?",
    options: ["Go straight", "Turn around roundabout", "Stop", "Merge"],
    correctAnswer: 1,
    accent: 'from-orange-500 to-amber-600',
    icon: <Gauge className="w-full h-full" />,
  },
  {
    id: 8,
    question_kiny: "Ibara ry'icyapa cyera ryibutsa iki?",
    question_en: "Yellow warning sign alerts you to?",
    options: ["Speed limit", "Upcoming danger", "Parking zone", "Gas station"],
    correctAnswer: 1,
    accent: 'from-yellow-500 to-amber-600',
    icon: <TriangleAlert className="w-full h-full" />,
  },
  {
    id: 9,
    question_kiny: "Kuburyo bukwiye gusonganiramo umuhanda ni ute?",
    question_en: "How should you merge onto a highway?",
    options: ["Stop first", "Match speed and merge", "Cross all lanes", "Reverse"],
    correctAnswer: 1,
    accent: 'from-teal-500 to-emerald-600',
    icon: <Car className="w-full h-full" />,
  },
];

// Fisher-Yates shuffle
function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const CARDS_PER_LOAD = 6;

export default function FlipCard() {
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    let active = true;
    (async () => {
      let cards: Question[] = [];
      try {
        const res = await flipcardsAPI.getDaily();
        const apiCards = Array.isArray(res?.cards) ? res.cards : [];
        if (apiCards.length) {
          cards = apiCards.map((c: any, idx: number) => ({
            id: idx + 1,
            question_en: c.question_en || '',
            question_kiny: c.question_kiny || '',
            options: Array.isArray(c.options) ? c.options : [],
            correctAnswer: typeof c.correctAnswer === 'number' ? c.correctAnswer : 0,
          }));
        }
      } catch {}

      // Fallback to sample if API returned nothing
      if (!cards.length) {
        cards = sampleQuestions.map((q, idx) => ({ ...q, id: idx + 1 }));
      }

      // Shuffle and pick random subset
      const shuffled = shuffleArray(cards);
      const picked = shuffled.slice(0, CARDS_PER_LOAD);

      // Assign random accents and icons
      if (active) {
        setQuestions(picked.map((q, idx) => ({
          ...q,
          id: idx + 1,
          accent: allAccents[idx % allAccents.length],
          icon: allIcons[idx % allIcons.length],
        })));
      }
    })();
    return () => { active = false; };
  }, []);

  const toggleFlip = useCallback((id: number) => {
    setFlippedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  if (!questions.length) {
    return (
      <div className="text-center py-10">
        <div className="w-10 h-10 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400 text-sm">Loading cards...</p>
      </div>
    );
  }

  return (
    <>
      {/* Mobile: vertical scroll with cards */}
      <div className="md:hidden -mx-4 px-4 overflow-y-auto snap-y snap-mandatory flex flex-col gap-6 pb-4 scrollbar-hide" style={{ maxHeight: '85vh' }}>
        {questions.map((question) => {
          const isFlipped = flippedCards.has(question.id);
          const accent = question.accent || allAccents[question.id % allAccents.length];
          const qIcon = question.icon || allIcons[question.id % allIcons.length];

          return (
            <div key={question.id} style={{ perspective: '1600px' }} className="snap-center shrink-0 w-full">
              <motion.div
                className="relative w-full cursor-pointer group"
                onClick={() => toggleFlip(question.id)}
                style={{ transformStyle: 'preserve-3d', height: '500px' }}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.7, type: 'spring', stiffness: 60, damping: 15 }}
              >
                {/* Glow aura */}
                <div className={`absolute -inset-1 rounded-[2rem] bg-gradient-to-br ${accent} opacity-0 blur-2xl group-hover:opacity-40 transition-opacity duration-500`} />

                {/* Front of Card */}
                <div className="absolute inset-0 w-full rounded-[2rem] border-2 border-white/20 overflow-y-auto" style={{ backfaceVisibility: 'hidden' }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-800/98 via-slate-900/98 to-slate-800/98 backdrop-blur-2xl" />
                  <svg className="absolute inset-0 w-full h-full opacity-[0.07] dark:opacity-[0.05]" xmlns="http://www.w3.org/2000/svg">
                    <defs><pattern id={`dots-m-${question.id}`} x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="2" fill="currentColor" /></pattern></defs>
                    <rect width="100%" height="100%" fill={`url(#dots-m-${question.id})`} className="text-white" />
                  </svg>
                  <div className={`h-28 w-full bg-gradient-to-br ${accent} relative overflow-hidden`}>
                    <div className="absolute inset-0 opacity-25"><div className="absolute -top-8 -left-8 w-40 h-40 rounded-full bg-white blur-2xl" /><div className="absolute -bottom-10 -right-6 w-32 h-32 rounded-full bg-black/40 blur-2xl" /></div>
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-1/2">
                      <div className="w-24 h-24 rounded-3xl bg-white dark:bg-[#16171C] shadow-2xl shadow-black/30 flex items-center justify-center border-4 border-white dark:border-slate-700/60 overflow-hidden">
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${accent} text-white flex items-center justify-center shadow-lg`}>{qIcon}</div>
                      </div>
                    </div>
                    <div className="absolute top-4 left-5 flex items-center gap-2 text-white"><HelpCircle className="w-5 h-5" /><span className="text-xs font-bold uppercase tracking-[0.2em]">Question #{question.id}</span></div>
                  </div>
                  <div className="pt-20 pb-8 px-8 flex flex-col items-center justify-between" style={{ minHeight: '300px' }}>
                    <div className="flex-1 w-full flex flex-col items-center justify-start gap-5">
                      <h3 className="text-white text-center text-xl font-bold leading-snug font-[family-name:var(--font-heading)]" style={{ color: '#ffffff', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>{question.question_en}</h3>
                      <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r ${accent} text-white text-xs font-semibold shadow-md shadow-black/10`}><Lightbulb className="w-3.5 h-3.5" /><span className="tracking-wide uppercase text-[10px]">Ikinyarwanda</span></div>
                      <p className="text-center text-white text-base leading-relaxed font-semibold" style={{ color: '#ffffff', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>{question.question_kiny}</p>
                    </div>
                    <motion.div className="mt-6 flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/10 border border-white/20 text-white" whileHover={{ scale: 1.03 }}><span className="text-sm font-bold">Tap to reveal answer</span><ArrowRight className="w-4 h-4 animate-pulse" /></motion.div>
                  </div>
                </div>

                {/* Back of Card */}
                <div className="absolute inset-0 w-full rounded-[2rem] overflow-y-auto shadow-2xl border-2 border-white/20" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${accent}`} />
                  <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-white/15 blur-3xl -translate-x-1/3 -translate-y-1/3" /><div className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-black/20 blur-3xl translate-x-1/3 translate-y-1/3" />
                  <svg className="absolute inset-0 w-full h-full opacity-[0.08]" xmlns="http://www.w3.org/2000/svg"><defs><pattern id={`stripes-m-${question.id}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="4" height="20" fill="white" /></pattern></defs><rect width="100%" height="100%" fill={`url(#stripes-m-${question.id})`} /></svg>
                  <div className="relative z-10 pt-8 pb-8 px-7 flex flex-col items-center justify-between" style={{ minHeight: '400px' }}>
                    <div className="w-full flex flex-col items-center gap-5">
                      <motion.div initial={{ scale: 0 }} animate={{ scale: isFlipped ? 1 : 0 }} transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 14 }} className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center ring-4 ring-white/30 shadow-2xl"><CheckCircle2 className="w-11 h-11 text-white drop-shadow-lg" /></motion.div>
                      <h3 className="text-white text-center text-2xl font-bold font-[family-name:var(--font-heading)] drop-shadow-md">Correct Answer</h3>
                      <div className="w-full space-y-3">
                        {question.options.map((option, idx) => {
                          const isCorrect = idx === question.correctAnswer;
                          return (
                            <motion.div key={idx} initial={{ x: 40, opacity: 0 }} animate={{ x: isFlipped ? 0 : 40, opacity: isFlipped ? 1 : 0 }} transition={{ delay: 0.15 + idx * 0.08, type: 'spring', stiffness: 180, damping: 16 }} className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl border text-center transition-all ${isCorrect ? 'bg-white text-slate-900 border-white shadow-xl shadow-black/20 scale-[1.02]' : 'bg-white/20 text-white border-white/20 backdrop-blur-sm'}`}>
                              <span className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${isCorrect ? `bg-gradient-to-br ${accent} text-white shadow-md` : 'bg-white/30 text-white'}`}>{String.fromCharCode(65 + idx)}</span>
                              <span className={`text-left flex-1 font-semibold ${isCorrect ? 'text-slate-900' : 'text-white'}`}>{option}</span>
                              {isCorrect && <CheckCircle2 className="w-6 h-6 text-emerald-500" />}
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: isFlipped ? 1 : 0, y: isFlipped ? 0 : 10 }} transition={{ delay: 0.6 }} className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/20 border border-white/30 backdrop-blur-md text-white"><ArrowRight className="w-4 h-4 -rotate-180" /><span className="text-sm font-bold">Tap card to flip back</span></motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Desktop: grid layout with scrollable cards */}
      <div className="hidden md:grid md:grid-cols-2 xl:grid-cols-3 gap-8">
        {questions.map((question) => {
          const isFlipped = flippedCards.has(question.id);
          const accent = question.accent || allAccents[question.id % allAccents.length];
          const qIcon = question.icon || allIcons[question.id % allIcons.length];

          return (
            <div key={question.id} style={{ perspective: '1600px' }}>
              <motion.div
                className="relative w-full cursor-pointer group"
                onClick={() => toggleFlip(question.id)}
                style={{ transformStyle: 'preserve-3d', height: '520px' }}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.7, type: 'spring', stiffness: 60, damping: 15 }}
                whileHover={{ y: -6 }}
              >
                {/* Glow aura */}
                <div className={`absolute -inset-1 rounded-[2rem] bg-gradient-to-br ${accent} opacity-0 blur-2xl group-hover:opacity-40 transition-opacity duration-500`} />

                {/* Front of Card */}
                <div className="absolute inset-0 w-full rounded-[2rem] border-2 border-white/20 overflow-y-auto" style={{ backfaceVisibility: 'hidden' }}>
                  {/* Decorative background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-800/95 via-slate-900/95 to-slate-800/95 backdrop-blur-2xl" />

                  {/* Pattern overlay */}
                  <svg className="absolute inset-0 w-full h-full opacity-[0.07] dark:opacity-[0.05]" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id={`dots-${question.id}`} x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
                        <circle cx="2" cy="2" r="2" fill="currentColor" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill={`url(#dots-${question.id})`} className="text-white" />
                  </svg>

                  {/* Top accent ribbon */}
                  <div className={`h-28 w-full bg-gradient-to-br ${accent} relative overflow-hidden`}>
                    <div className="absolute inset-0 opacity-25">
                      <div className="absolute -top-8 -left-8 w-40 h-40 rounded-full bg-white blur-2xl" />
                      <div className="absolute -bottom-10 -right-6 w-32 h-32 rounded-full bg-black/40 blur-2xl" />
                    </div>

                    {/* Icon badge */}
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-1/2">
                      <motion.div
                        whileHover={{ rotate: -8, scale: 1.08 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                        className="w-24 h-24 rounded-3xl bg-white dark:bg-[#16171C] shadow-2xl shadow-black/30 flex items-center justify-center border-4 border-white dark:border-slate-700/60 overflow-hidden"
                      >
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${accent} text-white flex items-center justify-center shadow-lg`}>
                          {qIcon}
                        </div>
                      </motion.div>
                    </div>

                    <div className="absolute top-4 left-5 flex items-center gap-2 text-white">
                      <HelpCircle className="w-5 h-5" />
                      <span className="text-xs font-bold uppercase tracking-[0.2em]">Question #{question.id}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="pt-20 pb-8 px-8 flex flex-col items-center justify-between" style={{ minHeight: '320px' }}>
                    <div className="flex-1 w-full flex flex-col items-center justify-start gap-5">
                      <h3 className="text-white text-center text-xl font-bold leading-snug font-[family-name:var(--font-heading)]" style={{ color: '#ffffff', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
                        {question.question_en}
                      </h3>

                      <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r ${accent} text-white text-xs font-semibold shadow-md shadow-black/10`}>
                        <Lightbulb className="w-3.5 h-3.5" />
                        <span className="tracking-wide uppercase text-[10px] text-white font-bold">Ikinyarwanda</span>
                      </div>

                      <p className="text-center text-white text-base leading-relaxed font-semibold" style={{ color: '#ffffff', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
                        {question.question_kiny}
                      </p>
                    </div>

                    {/* Reveal hint */}
                    <motion.div
                      className="mt-6 flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/10 border border-white/20 text-white"
                      whileHover={{ scale: 1.03 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                    >
                      <span className="text-sm font-bold">Tap to reveal answer</span>
                      <ArrowRight className="w-4 h-4 animate-pulse" />
                    </motion.div>
                  </div>
                </div>

                {/* Back of Card */}
                <div
                  className="absolute inset-0 w-full rounded-[2rem] overflow-y-auto shadow-2xl border-2 border-white/20"
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                  }}
                >
                  {/* Gradient background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${accent}`} />

                  {/* Decorative glow orbs */}
                  <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-white/15 blur-3xl -translate-x-1/3 -translate-y-1/3" />
                  <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-black/20 blur-3xl translate-x-1/3 translate-y-1/3" />

                  {/* Shimmer overlay */}
                  <svg className="absolute inset-0 w-full h-full opacity-[0.08]" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id={`stripes-${question.id}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                        <rect width="4" height="20" fill="white" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill={`url(#stripes-${question.id})`} />
                  </svg>

                  {/* Content */}
                  <div className="relative z-10 px-7 pb-8 pt-6 flex flex-col items-center justify-between" style={{ minHeight: '420px' }}>
                    <div className="w-full flex flex-col items-center gap-5">
                      <motion.div initial={{ scale: 0 }} animate={{ scale: isFlipped ? 1 : 0 }} transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 14 }} className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center ring-4 ring-white/30 shadow-2xl">
                        <CheckCircle2 className="w-11 h-11 text-white drop-shadow-lg" />
                      </motion.div>
                    <h3 className="text-white text-center text-2xl font-bold font-[family-name:var(--font-heading)] drop-shadow-md">
                      Correct Answer
                    </h3>

                      <div className="w-full space-y-3">
                        {question.options.map((option, idx) => {
                          const isCorrect = idx === question.correctAnswer;
                          return (
                            <motion.div
                              key={idx}
                              initial={{ x: 40, opacity: 0 }}
                              animate={{
                                x: isFlipped ? 0 : 40,
                                opacity: isFlipped ? 1 : 0,
                              }}
                              transition={{ delay: 0.15 + idx * 0.08, type: 'spring', stiffness: 180, damping: 16 }}
                            className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl border text-center transition-all ${
                              isCorrect
                                ? 'bg-white text-slate-900 border-white shadow-xl shadow-black/20 scale-[1.02]'
                                : 'bg-white/20 text-white border-white/20 backdrop-blur-sm'
                            }`}
                            >
                            <span className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                              isCorrect
                                ? `bg-gradient-to-br ${accent} text-white shadow-md`
                                : 'bg-white/30 text-white'
                            }`}>
                              {String.fromCharCode(65 + idx)}
                            </span>
                            <span className={`text-left flex-1 font-semibold ${isCorrect ? 'text-slate-900' : 'text-white'}`}>
                                {option}
                              </span>
                              {isCorrect && (
                                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                              )}
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Flip back hint */}                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: isFlipped ? 1 : 0, y: isFlipped ? 0 : 10 }} transition={{ delay: 0.6 }} className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/20 border border-white/30 backdrop-blur-md text-white">
                      <ArrowRight className="w-4 h-4 -rotate-180" />
                      <span className="text-sm font-bold">Tap card to flip back</span>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </>
  );
}
