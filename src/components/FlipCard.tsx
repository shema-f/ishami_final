import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Trophy, Zap, Lightbulb, ChevronRight, CheckCircle2, XCircle, Sparkles, Shuffle } from 'lucide-react';
import { flipCardQuestions } from '../data/flipcardQuestions';
import { useTranslation } from '../contexts/I18nContext';

interface FlipCardItem {
  id: number;
  question_en: string;
  question_kiny: string;
  answer_en: string;
  answer_kiny: string;
}

const ACCENTS = [
  'from-rose-500 to-red-600',
  'from-amber-500 to-orange-600',
  'from-sky-500 to-blue-600',
  'from-emerald-500 to-teal-600',
  'from-violet-500 to-purple-600',
  'from-cyan-500 to-sky-600',
  'from-pink-500 to-rose-600',
  'from-indigo-500 to-blue-600',
  'from-teal-500 to-emerald-600',
  'from-orange-500 to-amber-600',
  'from-fuchsia-500 to-pink-600',
  'from-lime-500 to-green-600',
];

const EMOJIS = ['🛑', '⚡', '⚠️', '🚗', '🛡️', '💡', '🚦', '🚶', '🛣️', '🔄', '📋', '🏁'];

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const CARDS_PER_LOAD = 8;
const ROTATION_INTERVAL = 20000;

export default function FlipCard() {
  const { lang } = useTranslation();
  const [cards, setCards] = useState<FlipCardItem[]>([]);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [correctCards, setCorrectCards] = useState<Set<number>>(new Set());
  const [wrongCards, setWrongCards] = useState<Set<number>>(new Set());
  const [rotationCount, setRotationCount] = useState(0);
  const [score, setScore] = useState(0);

  // Generate random cards
  useEffect(() => {
    const shuffled = shuffleArray(flipCardQuestions);
    const picked = shuffled.slice(0, CARDS_PER_LOAD);
    setCards(picked);
  }, [rotationCount]);

  // Auto-rotate
  useEffect(() => {
    const interval = setInterval(() => {
      setRotationCount(prev => prev + 1);
      setFlippedCards(new Set());
      setCorrectCards(new Set());
      setWrongCards(new Set());
      setScore(0);
    }, ROTATION_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  const handleFlip = useCallback((id: number) => {
    setFlippedCards(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleKnow = useCallback((id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!flippedCards.has(id)) return;
    setCorrectCards(prev => new Set(prev).add(id));
    setWrongCards(prev => { const n = new Set(prev); n.delete(id); return n; });
    setScore(prev => prev + 1);
  }, [flippedCards]);

  const handleDontKnow = useCallback((id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!flippedCards.has(id)) return;
    setWrongCards(prev => new Set(prev).add(id));
    setCorrectCards(prev => { const n = new Set(prev); n.delete(id); return n; });
  }, [flippedCards]);

  const handleRefresh = useCallback(() => {
    setRotationCount(prev => prev + 1);
    setFlippedCards(new Set());
    setCorrectCards(new Set());
    setWrongCards(new Set());
    setScore(0);
  }, []);

  const totalAnswered = correctCards.size + wrongCards.size;

  return (
    <div>
      {/* Score Bar */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6 px-4 py-3 bg-white/[0.04] backdrop-blur-xl rounded-2xl border border-white/[0.08]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <span className="text-sm font-bold text-white">{score}/{totalAnswered}</span>
          </div>
          {totalAnswered > 0 && (
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span className="text-xs text-gray-400">
                {Math.round((score / totalAnswered) * 100)}%
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 hidden sm:inline">
            {lang === 'rw' ? 'Kuri card igihe icyo' : 'Click card to flip'}
          </span>
          <button onClick={handleRefresh} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.06] hover:bg-white/[0.1] text-white text-xs font-medium rounded-lg transition-all">
            <Shuffle className="w-3.5 h-3.5" />
            {lang === 'rw' ? 'Hindura' : 'Shuffle'}
          </button>
        </div>
      </motion.div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, idx) => {
          const isFlipped = flippedCards.has(card.id);
          const isCorrect = correctCards.has(card.id);
          const isWrong = wrongCards.has(card.id);
          const accent = ACCENTS[idx % ACCENTS.length];
          const emoji = EMOJIS[idx % EMOJIS.length];

          return (
            <motion.div
              key={`${rotationCount}-${card.id}`}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: idx * 0.06, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="h-[220px] perspective-[1000px] cursor-pointer"
              onClick={() => handleFlip(card.id)}
            >
              <motion.div
                className="relative w-full h-full"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, type: 'spring', stiffness: 100, damping: 15 }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Front Face — Question */}
                <div
                  className="absolute inset-0 rounded-2xl overflow-hidden border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  {/* Gradient Header */}
                  <div className={`h-16 bg-gradient-to-r ${accent} relative overflow-hidden`}>
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute -top-8 -left-8 w-24 h-24 rounded-full bg-white blur-2xl" />
                      <div className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full bg-white blur-xl" />
                    </div>
                    <div className="relative flex items-center justify-between px-4 pt-3">
                      <span className="text-2xl">{emoji}</span>
                      <span className="text-[10px] font-bold text-white/70 uppercase tracking-wider">
                        #{idx + 1}
                      </span>
                    </div>
                    <div className="relative px-4 pt-1">
                      <span className="text-[9px] font-bold text-white/60 uppercase tracking-widest">
                        {lang === 'rw' ? 'Icumuro' : 'Question'}
                      </span>
                    </div>
                  </div>

                  {/* Question Content */}
                  <div className="p-4 flex flex-col justify-between h-[calc(100%-4rem)]">
                    <p className="text-sm font-semibold text-white leading-relaxed line-clamp-4">
                      {lang === 'rw' ? card.question_kiny : card.question_en}
                    </p>
                    <div className="flex items-center justify-center gap-1.5 text-[10px] text-blue-400 font-medium">
                      <RotateCcw className="w-3 h-3" />
                      {lang === 'rw' ? 'Kanda kugira ngo urabe igisubizo' : 'Click to reveal answer'}
                    </div>
                  </div>
                </div>

                {/* Back Face — Answer */}
                <div
                  className="absolute inset-0 rounded-2xl overflow-hidden border border-white/[0.08] bg-[#0d1225] backdrop-blur-xl"
                  style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                  {/* Answer Header */}
                  <div className={`h-14 bg-gradient-to-r ${accent} relative overflow-hidden`}>
                    <div className="relative flex items-center gap-2 px-4 pt-3">
                      <Lightbulb className="w-4 h-4 text-white/80" />
                      <span className="text-[10px] font-bold text-white uppercase tracking-widest">
                        {lang === 'rw' ? 'Igisubizo' : 'Answer'}
                      </span>
                    </div>
                  </div>

                  {/* Answer Content */}
                  <div className="p-4 flex flex-col justify-between h-[calc(100%-3.5rem)]">
                    <div className="space-y-2 overflow-y-auto max-h-[100px]">
                      <div>
                        <span className="text-[9px] font-bold text-blue-400 uppercase tracking-widest block mb-0.5">
                          English
                        </span>
                        <p className="text-xs text-gray-300 leading-relaxed">{card.answer_en}</p>
                      </div>
                      <div className="border-t border-white/5 pt-2">
                        <span className="text-[9px] font-bold text-cyan-400 uppercase tracking-widest block mb-0.5">
                          Ikinyarwanda
                        </span>
                        <p className="text-xs text-gray-400 leading-relaxed">{card.answer_kiny}</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-2">
                      {isCorrect ? (
                        <div className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-emerald-500/20 rounded-lg border border-emerald-500/30">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span className="text-xs font-semibold text-emerald-400">
                            {lang === 'rw' ? 'Byagenze neza!' : 'Got it!'}
                          </span>
                        </div>
                      ) : isWrong ? (
                        <div className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-rose-500/20 rounded-lg border border-rose-500/30">
                          <XCircle className="w-4 h-4 text-rose-400" />
                          <span className="text-xs font-semibold text-rose-400">
                            {lang === 'rw' ? 'Ntago nabyemeje' : "Didn't get it"}
                          </span>
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={(e) => handleKnow(card.id, e)}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-emerald-500/15 hover:bg-emerald-500/25 rounded-lg border border-emerald-500/20 transition-all text-emerald-400"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span className="text-xs font-semibold">{lang === 'rw' ? 'Nabyize' : 'Got it'}</span>
                          </button>
                          <button
                            onClick={(e) => handleDontKnow(card.id, e)}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-rose-500/15 hover:bg-rose-500/25 rounded-lg border border-rose-500/20 transition-all text-rose-400"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span className="text-xs font-semibold">{lang === 'rw' ? 'Sindi byo' : 'Again'}</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* All Answered Summary */}
      <AnimatePresence>
        {totalAnswered === CARDS_PER_LOAD && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8 text-center p-6 bg-white/[0.04] backdrop-blur-xl rounded-2xl border border-white/[0.08]">
            <div className="inline-flex p-4 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-3xl mb-4 shadow-lg shadow-yellow-500/20">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-1 font-[family-name:var(--font-heading)]">
              {lang === 'rw' ? 'Urakoze!' : 'Great Job!'}
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              {lang === 'rw'
                ? `Wujeje ${score}/${CARDS_PER_LOAD} ibibazo neza!`
                : `You got ${score}/${CARDS_PER_LOAD} correct!`}
            </p>
            <button onClick={handleRefresh} className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all">
              <Shuffle className="w-4 h-4" />
              {lang === 'rw' ? 'Ibibazo Bishya' : 'New Questions'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
