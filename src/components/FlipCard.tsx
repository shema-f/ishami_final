import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Trophy, Zap, Lightbulb, CheckCircle2, XCircle, Shuffle, Sparkles } from 'lucide-react';
import { flipCardQuestions } from '../data/flipcardQuestions';
import { useTranslation } from '../contexts/I18nContext';

interface QuizQuestion {
  id: number;
  question_en: string;
  question_kiny: string;
  answer_en: string;
  answer_kiny: string;
  options: string[];
  correctIndex: number;
  category: string;
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
];

const EMOJIS = ['🛑', '⚡', '⚠️', '🚗', '🛡️', '💡', '🚦', '🚶', '🛣️', '🔄', '📋', '🏁', '🌧️', '🅿️', '🔑'];

const CATEGORIES = [
  { id: 'all', label_en: 'All Topics', label_rw: 'Ibintu byose', emoji: '📚' },
  { id: 'speed', label_en: 'Speed Limits', label_rw: 'Umuvuduko', emoji: '⚡' },
  { id: 'signs', label_en: 'Road Signs', label_rw: 'Ibyapa', emoji: '🛑' },
  { id: 'rules', label_en: 'Traffic Rules', label_rw: 'Amategeko', emoji: '📋' },
  { id: 'license', label_en: 'Licensing', label_rw: 'Uruhushya', emoji: '🔑' },
  { id: 'safety', label_en: 'Safety', label_rw: 'Umutekano', emoji: '🛡️' },
];

// Generate multiple choice options from the data
function generateQuizOptions(q: typeof flipCardQuestions[0], allQs: typeof flipCardQuestions): QuizQuestion {
  const correctAnswer = q.answer_en;
  // Get other answers as distractors
  const otherAnswers = allQs
    .filter(a => a.id !== q.id && a.answer_en !== correctAnswer && a.answer_en.length > 5)
    .map(a => a.answer_en);

  // Pick 3 random distractors
  const shuffled = [...otherAnswers].sort(() => Math.random() - 0.5);
  const distractors = shuffled.slice(0, 3);

  // Truncate long options
  const truncate = (s: string) => s.length > 80 ? s.slice(0, 77) + '...' : s;
  const options = [truncate(correctAnswer), ...distractors.map(truncate)].sort(() => Math.random() - 0.5);
  const correctIndex = options.indexOf(truncate(correctAnswer));

  // Determine category
  let category = 'all';
  const qLower = q.question_en.toLowerCase();
  if (qLower.includes('speed') || qLower.includes('km/h') || qLower.includes('limit')) category = 'speed';
  else if (qLower.includes('sign') || qLower.includes('triangle') || qLower.includes('light') || qLower.includes('roundabout') || qLower.includes('zebra')) category = 'signs';
  else if (qLower.includes('license') || qLower.includes('irembo') || qLower.includes('fine') || qLower.includes('penalty') || qLower.includes('demerit')) category = 'license';
  else if (qLower.includes('rain') || qLower.includes('night') || qLower.includes('downhill') || qLower.includes('following') || qLower.includes('park')) category = 'safety';
  else category = 'rules';

  return {
    id: q.id,
    question_en: q.question_en,
    question_kiny: q.question_kiny,
    answer_en: q.answer_en,
    answer_kiny: q.answer_kiny,
    options,
    correctIndex,
    category,
  };
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const CARDS_PER_LOAD = 6;
const ROTATION_INTERVAL = 25000;

export default function FlipCard() {
  const { lang, t } = useTranslation();
  const [cards, setCards] = useState<QuizQuestion[]>([]);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [answeredCards, setAnsweredCards] = useState<Map<number, { selected: number; correct: boolean }>>(new Map());
  const [rotationCount, setRotationCount] = useState(0);
  const [score, setScore] = useState(0);
  const [activeCategory, setActiveCategory] = useState('all');

  // Generate quiz questions
  useEffect(() => {
    const filtered = activeCategory === 'all'
      ? flipCardQuestions
      : flipCardQuestions.filter((_, i) => {
          const q = flipCardQuestions[i];
          const qLower = q.question_en.toLowerCase();
          if (activeCategory === 'speed') return qLower.includes('speed') || qLower.includes('km/h') || qLower.includes('limit');
          if (activeCategory === 'signs') return qLower.includes('sign') || qLower.includes('triangle') || qLower.includes('light') || qLower.includes('roundabout') || qLower.includes('zebra');
          if (activeCategory === 'license') return qLower.includes('license') || qLower.includes('irembo') || qLower.includes('fine') || qLower.includes('penalty') || qLower.includes('demerit');
          if (activeCategory === 'safety') return qLower.includes('rain') || qLower.includes('night') || qLower.includes('downhill') || qLower.includes('following') || qLower.includes('park');
          return qLower.includes('rule') || qLower.includes('driving') || qLower.includes('road');
        });

    const shuffled = shuffleArray(filtered);
    const picked = shuffled.slice(0, CARDS_PER_LOAD);
    const quizItems = picked.map(q => generateQuizOptions(q, flipCardQuestions));
    setCards(quizItems);
  }, [rotationCount, activeCategory]);

  // Auto-rotate
  useEffect(() => {
    const interval = setInterval(() => {
      setRotationCount(prev => prev + 1);
      setFlippedCards(new Set());
      setAnsweredCards(new Map());
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

  const handleAnswer = useCallback((id: number, optionIndex: number) => {
    if (answeredCards.has(id)) return;
    const q = cards.find(qq => qq.id === id);
    if (!q) return;
    const isCorrect = optionIndex === q.correctIndex;
    setAnsweredCards(prev => new Map(prev).set(id, { selected: optionIndex, correct: isCorrect }));
    if (isCorrect) setScore(prev => prev + 1);
    // Auto flip to show answer
    setFlippedCards(prev => new Set(prev).add(id));
  }, [answeredCards, cards]);

  const handleRefresh = useCallback(() => {
    setRotationCount(prev => prev + 1);
    setFlippedCards(new Set());
    setAnsweredCards(new Map());
    setScore(0);
  }, []);

  const totalAnswered = answeredCards.size;
  const totalCorrect = [...answeredCards.values()].filter(a => a.correct).length;

  return (
    <div>
      {/* Category Filter */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-2 -mx-2 px-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => { setActiveCategory(cat.id); handleRefresh(); }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeCategory === cat.id
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/20'
                : 'bg-white/[0.04] text-gray-400 border border-white/[0.08] hover:bg-white/[0.08] hover:text-white'
            }`}
          >
            <span>{cat.emoji}</span>
            <span>{lang === 'rw' ? cat.label_rw : cat.label_en}</span>
          </button>
        ))}
      </div>

      {/* Score Bar */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-5 px-4 py-3 bg-white/[0.04] backdrop-blur-xl rounded-2xl border border-white/[0.08]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <span className="text-sm font-bold text-white">{totalCorrect}/{totalAnswered}</span>
          </div>
          {totalAnswered > 0 && (
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span className="text-xs text-gray-400">{Math.round((totalCorrect / totalAnswered) * 100)}%</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-gray-500 hidden sm:inline">
            {t('flip.click', 'Click card to flip')}
          </span>
          <button onClick={handleRefresh} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.06] hover:bg-white/[0.1] text-white text-xs font-medium rounded-lg transition-all">
            <Shuffle className="w-3.5 h-3.5" />
            {t('flip.new_set', 'New Set')}
          </button>
        </div>
      </motion.div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((q, idx) => {
          const isFlipped = flippedCards.has(q.id);
          const answered = answeredCards.get(q.id);
          const accent = ACCENTS[idx % ACCENTS.length];
          const emoji = EMOJIS[idx % EMOJIS.length];

          return (
            <motion.div
              key={`${rotationCount}-${q.id}`}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: idx * 0.06, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="h-[320px] perspective-[1000px] cursor-pointer"
              onClick={() => !answered && handleFlip(q.id)}
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
                  <div className={`h-20 bg-gradient-to-r ${accent} relative overflow-hidden`}>
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute -top-8 -left-8 w-24 h-24 rounded-full bg-white blur-2xl" />
                      <div className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full bg-white blur-xl" />
                    </div>
                    <div className="relative flex items-center justify-between px-4 pt-3">
                      <span className="text-2xl">{emoji}</span>
                      <span className="text-[10px] font-bold text-white/70 uppercase tracking-wider">#{idx + 1}</span>
                    </div>
                    <div className="relative px-4">
                      <span className="text-[9px] font-bold text-white/60 uppercase tracking-widest">
                        {t('flip.question', 'Question')}
                      </span>
                    </div>
                  </div>

                  {/* Question */}
                  <div className="p-4 flex flex-col justify-between h-[calc(100%-5rem)]">
                    <p className="text-sm font-semibold text-white leading-relaxed line-clamp-4">
                      {lang === 'rw' ? q.question_kiny : q.question_en}
                    </p>
                    <div className="flex items-center justify-center gap-1.5 text-[10px] text-blue-400 font-medium mt-2">
                      <RotateCcw className="w-3 h-3" />
                      {t('flip.reveal', 'Click to reveal answer')}
                    </div>
                  </div>
                </div>

                {/* Back Face — Answer + Options */}
                <div
                  className="absolute inset-0 rounded-2xl overflow-hidden border border-white/[0.08] bg-[#0d1225] backdrop-blur-xl"
                  style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                  {/* Answer Header */}
                  <div className={`h-14 bg-gradient-to-r ${accent} relative overflow-hidden`}>
                    <div className="relative flex items-center gap-2 px-4 pt-3">
                      <Lightbulb className="w-4 h-4 text-white/80" />
                      <span className="text-[10px] font-bold text-white uppercase tracking-widest">
                        {t('flip.answer_options', 'Answer Options')}
                      </span>
                    </div>
                  </div>

                  {/* Multiple Choice Options */}
                  <div className="p-3 space-y-1.5 overflow-y-auto h-[calc(100%-3.5rem)]">
                    {q.options.map((option, optIdx) => {
                      const isSelected = answered?.selected === optIdx;
                      const isCorrect = optIdx === q.correctIndex;
                      const hasAnswered = !!answered;

                      let optStyle = 'bg-white/[0.04] border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.15] text-white/80';
                      if (hasAnswered && isCorrect) optStyle = 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300';
                      else if (hasAnswered && isSelected && !isCorrect) optStyle = 'bg-rose-500/15 border-rose-500/30 text-rose-300';

                      return (
                        <button
                          key={optIdx}
                          onClick={(e) => { e.stopPropagation(); handleAnswer(q.id, optIdx); }}
                          disabled={hasAnswered}
                          className={`w-full text-left p-2 rounded-xl border text-[11px] transition-all duration-200 ${optStyle} ${!hasAnswered ? 'cursor-pointer active:scale-[0.98]' : 'cursor-default'}`}
                        >
                          <div className="flex items-start gap-2">
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                              hasAnswered && isCorrect ? 'border-emerald-400 bg-emerald-400' :
                              hasAnswered && isSelected && !isCorrect ? 'border-rose-400 bg-rose-400' :
                              'border-white/25'
                            }`}>
                              {hasAnswered && isCorrect && <CheckCircle2 className="w-2.5 h-2.5 text-white" />}
                              {hasAnswered && isSelected && !isCorrect && <XCircle className="w-2.5 h-2.5 text-white" />}
                            </div>
                            <span className="leading-relaxed">{option}</span>
                          </div>
                        </button>
                      );
                    })}

                    {/* Bilingual Answer */}
                    {answered && (
                      <div className="mt-2 p-2.5 bg-white/[0.03] rounded-xl border border-white/[0.05] space-y-1.5">
                        <div className="text-[10px] text-gray-400">
                          <span className="text-[9px] uppercase tracking-wider text-blue-400 font-bold block mb-0.5">English</span>
                          {q.answer_en}
                        </div>
                        <div className="text-[10px] text-gray-500 border-t border-white/5 pt-1.5">
                          <span className="text-[9px] uppercase tracking-wider text-cyan-400 font-bold block mb-0.5">Ikinyarwanda</span>
                          {q.answer_kiny}
                        </div>
                      </div>
                    )}
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
              {t('flip.great_job', 'Great Job!')}
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              {t('flip.score', `You got ${totalCorrect}/${CARDS_PER_LOAD} correct!`).replace('{correct}', String(totalCorrect)).replace('{total}', String(CARDS_PER_LOAD))}
            </p>
            <button onClick={handleRefresh} className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all">
              <Shuffle className="w-4 h-4" />
              {t('flip.new_questions', 'New Questions')}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
