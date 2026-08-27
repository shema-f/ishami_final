import { useEffect, useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { HelpCircle, CheckCircle2, ArrowRight, Lightbulb, ShieldCheck, Car, Gauge, TriangleAlert, OctagonX } from 'lucide-react';
import { flipCardQuestions } from '../data/flipcardQuestions';
import { useTranslation } from '../contexts/I18nContext';

interface CardQuestion {
  id: number;
  question_en: string;
  question_kiny: string;
  answer_en: string;
  answer_kiny: string;
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
  const { lang } = useTranslation();
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [questions, setQuestions] = useState<CardQuestion[]>([]);

  useEffect(() => {
    // Shuffle and pick random subset
    const shuffled = shuffleArray(flipCardQuestions);
    const picked = shuffled.slice(0, CARDS_PER_LOAD);

    setQuestions(picked.map((q, idx) => ({
      ...q,
      id: idx + 1,
      accent: allAccents[idx % allAccents.length],
      icon: allIcons[idx % allIcons.length],
    })));
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
                    <motion.div className="mt-6 flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/10 border border-white/20 text-white" whileHover={{ scale: 1.03 }}><span className="text-sm font-bold">{lang === 'rw' ? "Kanda kugira ngo urebe ibisubizo" : "Tap to reveal answer"}</span><ArrowRight className="w-4 h-4 animate-pulse" /></motion.div>
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
                      <h3 className="text-white text-center text-2xl font-bold font-[family-name:var(--font-heading)] drop-shadow-md">{lang === 'rw' ? "Ibisubizo" : "Answer"}</h3>
                      <div className="w-full space-y-3">
                        {/* English answer */}
                        <div className="w-full px-5 py-4 rounded-2xl bg-white text-slate-900 border border-white shadow-xl shadow-black/20">
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 block">English</span>
                          <p className="text-sm font-semibold leading-relaxed">{question.answer_en}</p>
                        </div>
                        {/* Kinyarwanda answer */}
                        <div className="w-full px-5 py-4 rounded-2xl bg-white/20 text-white border border-white/20 backdrop-blur-sm">
                          <span className="text-xs font-bold uppercase tracking-wider text-white/70 mb-1 block">Ikinyarwanda</span>
                          <p className="text-sm font-semibold leading-relaxed">{question.answer_kiny}</p>
                        </div>
                      </div>
                    </div>
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: isFlipped ? 1 : 0, y: isFlipped ? 0 : 10 }} transition={{ delay: 0.6 }} className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/20 border border-white/30 backdrop-blur-md text-white"><ArrowRight className="w-4 h-4 -rotate-180" /><span className="text-sm font-bold">{lang === 'rw' ? "Kanda kugira ngo subire inyuma" : "Tap card to flip back"}</span></motion.div>
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
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-800/95 via-slate-900/95 to-slate-800/95 backdrop-blur-2xl" />
                  <svg className="absolute inset-0 w-full h-full opacity-[0.07] dark:opacity-[0.05]" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id={`dots-${question.id}`} x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
                        <circle cx="2" cy="2" r="2" fill="currentColor" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill={`url(#dots-${question.id})`} className="text-white" />
                  </svg>
                  <div className={`h-28 w-full bg-gradient-to-br ${accent} relative overflow-hidden`}>
                    <div className="absolute inset-0 opacity-25">
                      <div className="absolute -top-8 -left-8 w-40 h-40 rounded-full bg-white blur-2xl" />
                      <div className="absolute -bottom-10 -right-6 w-32 h-32 rounded-full bg-black/40 blur-2xl" />
                    </div>
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
                    <motion.div
                      className="mt-6 flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/10 border border-white/20 text-white"
                      whileHover={{ scale: 1.03 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                    >
                      <span className="text-sm font-bold">{lang === 'rw' ? "Kanda kugira ngo urebe ibisubizo" : "Tap to reveal answer"}</span>
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
                  <div className={`absolute inset-0 bg-gradient-to-br ${accent}`} />
                  <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-white/15 blur-3xl -translate-x-1/3 -translate-y-1/3" />
                  <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-black/20 blur-3xl translate-x-1/3 translate-y-1/3" />
                  <svg className="absolute inset-0 w-full h-full opacity-[0.08]" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id={`stripes-${question.id}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                        <rect width="4" height="20" fill="white" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill={`url(#stripes-${question.id})`} />
                  </svg>
                  <div className="relative z-10 px-7 pb-8 pt-6 flex flex-col items-center justify-between" style={{ minHeight: '420px' }}>
                    <div className="w-full flex flex-col items-center gap-5">
                      <motion.div initial={{ scale: 0 }} animate={{ scale: isFlipped ? 1 : 0 }} transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 14 }} className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center ring-4 ring-white/30 shadow-2xl">
                        <CheckCircle2 className="w-11 h-11 text-white drop-shadow-lg" />
                      </motion.div>
                      <h3 className="text-white text-center text-2xl font-bold font-[family-name:var(--font-heading)] drop-shadow-md">
                        {lang === 'rw' ? "Ibisubizo" : "Answer"}
                      </h3>
                      <div className="w-full space-y-3">
                        {/* English answer */}
                        <div className="w-full px-5 py-4 rounded-2xl bg-white text-slate-900 border border-white shadow-xl shadow-black/20">
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 block">English</span>
                          <p className="text-sm font-semibold leading-relaxed">{question.answer_en}</p>
                        </div>
                        {/* Kinyarwanda answer */}
                        <div className="w-full px-5 py-4 rounded-2xl bg-white/20 text-white border border-white/20 backdrop-blur-sm">
                          <span className="text-xs font-bold uppercase tracking-wider text-white/70 mb-1 block">Ikinyarwanda</span>
                          <p className="text-sm font-semibold leading-relaxed">{question.answer_kiny}</p>
                        </div>
                      </div>
                    </div>
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: isFlipped ? 1 : 0, y: isFlipped ? 0 : 10 }} transition={{ delay: 0.6 }} className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/20 border border-white/30 backdrop-blur-md text-white">
                      <ArrowRight className="w-4 h-4 -rotate-180" />
                      <span className="text-sm font-bold">{lang === 'rw' ? "Kanda kugira ngo subire inyuma" : "Tap card to flip back"}</span>
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
