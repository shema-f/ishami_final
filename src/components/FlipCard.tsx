import { useEffect, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, CheckCircle2, XCircle, ArrowRight, Lightbulb, ShieldCheck, Car, Gauge, TriangleAlert, OctagonX, RotateCcw, Sparkles, Trophy, Zap } from 'lucide-react';
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
}

const allAccents = [
  'from-rose-500 to-red-600',
  'from-amber-500 to-orange-600',
  'from-sky-500 to-blue-600',
  'from-emerald-500 to-teal-600',
  'from-violet-500 to-purple-600',
  'from-cyan-500 to-sky-600',
];

const allIcons = [
  <OctagonX key="stop" className="w-full h-full" />,
  <Gauge key="speed" className="w-full h-full" />,
  <TriangleAlert key="warn" className="w-full h-full" />,
  <Car key="car" className="w-full h-full" />,
  <ShieldCheck key="shield" className="w-full h-full" />,
  <Lightbulb key="bulb" className="w-full h-full" />,
];

// Generate distractor options for a question
function generateQuizOptions(question: typeof flipCardQuestions[0], allQs: typeof flipCardQuestions): QuizQuestion {
  // Create multiple choice options from the answer
  const answerText = question.answer_en;
  const allAnswers = allQs.map(q => q.answer_en).filter(a => a !== answerText && a.length > 10);

  // Pick 3 random distractors
  const shuffled = [...allAnswers].sort(() => Math.random() - 0.5);
  const distractors = shuffled.slice(0, 3).map(a => {
    // Truncate long answers for option display
    const truncated = a.length > 80 ? a.slice(0, 77) + '...' : a;
    return truncated;
  });

  const correctTruncated = answerText.length > 80 ? answerText.slice(0, 77) + '...' : answerText;

  // Create options array and shuffle
  const options = [correctTruncated, ...distractors].sort(() => Math.random() - 0.5);
  const correctIndex = options.indexOf(correctTruncated);

  return {
    id: question.id,
    question_en: question.question_en,
    question_kiny: question.question_kiny,
    answer_en: question.answer_en,
    answer_kiny: question.answer_kiny,
    options,
    correctIndex,
  };
}

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
const ROTATION_INTERVAL = 15000; // 15 seconds

export default function FlipCard() {
  const { lang } = useTranslation();
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [answeredCards, setAnsweredCards] = useState<Map<number, { selected: number; correct: boolean }>>(new Map());
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState<Set<number>>(new Set());
  const [rotationCount, setRotationCount] = useState(0);

  // Generate quiz questions
  useEffect(() => {
    const shuffled = shuffleArray(flipCardQuestions);
    const picked = shuffled.slice(0, CARDS_PER_LOAD);
    const quizItems = picked.map(q => generateQuizOptions(q, flipCardQuestions));
    setQuizQuestions(quizItems);
  }, [rotationCount]);

  // Auto-rotate questions
  useEffect(() => {
    const interval = setInterval(() => {
      setRotationCount(prev => prev + 1);
      setScore(0);
      setAnsweredCards(new Map());
      setShowAnswer(new Set());
    }, ROTATION_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  const handleAnswer = useCallback((questionId: number, optionIndex: number) => {
    if (answeredCards.has(questionId)) return;
    const q = quizQuestions.find(qq => qq.id === questionId);
    if (!q) return;

    const isCorrect = optionIndex === q.correctIndex;
    setAnsweredCards(prev => new Map(prev).set(questionId, { selected: optionIndex, correct: isCorrect }));
    if (isCorrect) setScore(prev => prev + 1);
  }, [answeredCards, quizQuestions]);

  const handleShowExplanation = useCallback((questionId: number) => {
    setShowAnswer(prev => {
      const next = new Set(prev);
      if (next.has(questionId)) next.delete(questionId);
      else next.add(questionId);
      return next;
    });
  }, []);

  const handleRefresh = useCallback(() => {
    setRotationCount(prev => prev + 1);
    setScore(0);
    setAnsweredCards(new Map());
    setShowAnswer(new Set());
  }, []);

  const answeredCount = answeredCards.size;
  const allAnswered = answeredCount === quizQuestions.length;

  if (!quizQuestions.length) {
    return (
      <div className="text-center py-10">
        <div className="w-10 h-10 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400 text-sm">Loading quiz...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Score Bar */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6 px-4 py-3 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <span className="text-sm font-bold text-white">{score}/{answeredCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span className="text-xs text-gray-400">
              {lang === 'rw' ? 'Igiciro:' : 'Score:'} {answeredCount > 0 ? Math.round((score / answeredCount) * 100) : 0}%
            </span>
          </div>
        </div>
        <button onClick={handleRefresh} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/15 text-white text-xs font-medium rounded-lg transition-all">
          <RotateCcw className="w-3.5 h-3.5" />
          {lang === 'rw' ? 'Hindura' : 'New Questions'}
        </button>
      </motion.div>

      {/* Mobile: Vertical scroll */}
      <div className="md:hidden space-y-4">
        {quizQuestions.map((q, idx) => {
          const accent = allAccents[idx % allAccents.length];
          const qIcon = allIcons[idx % allIcons.length];
          const answered = answeredCards.get(q.id);
          const showExpl = showAnswer.has(q.id);

          return (
            <motion.div
              key={`${rotationCount}-${q.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden"
            >
              {/* Card Header */}
              <div className={`p-4 bg-gradient-to-r ${accent}`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white shrink-0">
                    {qIcon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] uppercase tracking-wider text-white/70 font-bold">
                      {lang === 'rw' ? 'Ibibazo' : 'Question'} #{idx + 1}
                    </span>
                    <h3 className="text-white text-sm font-bold leading-snug mt-0.5 font-[family-name:var(--font-heading)]">
                      {lang === 'rw' ? q.question_kiny : q.question_en}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Options */}
              <div className="p-3 space-y-2">
                {q.options.map((option, optIdx) => {
                  const isSelected = answered?.selected === optIdx;
                  const isCorrect = optIdx === q.correctIndex;
                  const hasAnswered = !!answered;

                  let optStyle = 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 text-white/80';
                  if (hasAnswered && isCorrect) optStyle = 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300';
                  else if (hasAnswered && isSelected && !isCorrect) optStyle = 'bg-rose-500/20 border-rose-500/40 text-rose-300';

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleAnswer(q.id, optIdx)}
                      disabled={hasAnswered}
                      className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${optStyle} ${!hasAnswered ? 'cursor-pointer' : 'cursor-default'}`}
                    >
                      <div className="flex items-start gap-2">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                          hasAnswered && isCorrect ? 'border-emerald-400 bg-emerald-400' :
                          hasAnswered && isSelected && !isCorrect ? 'border-rose-400 bg-rose-400' :
                          'border-white/30'
                        }`}>
                          {hasAnswered && isCorrect && <CheckCircle2 className="w-3 h-3 text-white" />}
                          {hasAnswered && isSelected && !isCorrect && <XCircle className="w-3 h-3 text-white" />}
                        </div>
                        <span className="leading-relaxed">{option}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Explanation Toggle */}
              {answered && (
                <div className="px-3 pb-3">
                  <button
                    onClick={() => handleShowExplanation(q.id)}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-white/5 hover:bg-white/10 text-blue-400 text-xs font-medium rounded-lg transition-all"
                  >
                    <Lightbulb className="w-3.5 h-3.5" />
                    {showExpl ? (lang === 'rw' ? 'Hisha' : 'Hide') : (lang === 'rw' ? 'Reba igisubizo' : 'Show Explanation')}
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showExpl ? 'rotate-90' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {showExpl && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="mt-2 p-3 bg-white/5 rounded-xl border border-white/8 space-y-2">
                          <div className="text-xs text-gray-300">
                            <span className="text-[10px] uppercase tracking-wider text-blue-400 font-bold block mb-1">English</span>
                            {q.answer_en}
                          </div>
                          <div className="text-xs text-gray-400">
                            <span className="text-[10px] uppercase tracking-wider text-cyan-400 font-bold block mb-1">Ikinyarwanda</span>
                            {q.answer_kiny}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Desktop: Grid layout */}
      <div className="hidden md:grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {quizQuestions.map((q, idx) => {
          const accent = allAccents[idx % allAccents.length];
          const qIcon = allIcons[idx % allIcons.length];
          const answered = answeredCards.get(q.id);
          const showExpl = showAnswer.has(q.id);

          return (
            <motion.div
              key={`${rotationCount}-${q.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={!answered ? { y: -4 } : {}}
              className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden hover:bg-white/8 hover:border-white/15 transition-all duration-300"
            >
              {/* Card Header */}
              <div className={`p-4 bg-gradient-to-r ${accent} relative overflow-hidden`}>
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full bg-white blur-2xl" />
                </div>
                <div className="relative flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white shrink-0">
                    {qIcon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] uppercase tracking-wider text-white/70 font-bold">
                      {lang === 'rw' ? 'Ibibazo' : 'Question'} #{idx + 1}
                    </span>
                    <h3 className="text-white text-sm font-bold leading-snug mt-0.5 font-[family-name:var(--font-heading)]">
                      {lang === 'rw' ? q.question_kiny : q.question_en}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Options */}
              <div className="p-3 space-y-2">
                {q.options.map((option, optIdx) => {
                  const isSelected = answered?.selected === optIdx;
                  const isCorrect = optIdx === q.correctIndex;
                  const hasAnswered = !!answered;

                  let optStyle = 'bg-white/5 border-white/8 hover:bg-white/10 hover:border-white/15 text-white/80';
                  if (hasAnswered && isCorrect) optStyle = 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300';
                  else if (hasAnswered && isSelected && !isCorrect) optStyle = 'bg-rose-500/15 border-rose-500/30 text-rose-300';

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleAnswer(q.id, optIdx)}
                      disabled={hasAnswered}
                      className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all duration-200 ${optStyle} ${!hasAnswered ? 'cursor-pointer active:scale-[0.98]' : 'cursor-default'}`}
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
              </div>

              {/* Explanation */}
              {answered && (
                <div className="px-3 pb-3">
                  <button
                    onClick={() => handleShowExplanation(q.id)}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-white/5 hover:bg-white/10 text-blue-400 text-xs font-medium rounded-lg transition-all"
                  >
                    <Lightbulb className="w-3.5 h-3.5" />
                    {showExpl ? (lang === 'rw' ? 'Hisha' : 'Hide') : (lang === 'rw' ? 'Reba igisubizo' : 'Show Explanation')}
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showExpl ? 'rotate-90' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {showExpl && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="mt-2 p-3 bg-white/5 rounded-xl border border-white/8 space-y-2">
                          <div className="text-xs text-gray-300">
                            <span className="text-[10px] uppercase tracking-wider text-blue-400 font-bold block mb-1">English</span>
                            {q.answer_en}
                          </div>
                          <div className="text-xs text-gray-400">
                            <span className="text-[10px] uppercase tracking-wider text-cyan-400 font-bold block mb-1">Ikinyarwanda</span>
                            {q.answer_kiny}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* All Answered Summary */}
      <AnimatePresence>
        {allAnswered && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8 text-center p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
            <div className="inline-flex p-4 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-3xl mb-4 shadow-lg shadow-yellow-500/20">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-1 font-[family-name:var(--font-heading)]">
              {lang === 'rw' ? 'Urakoze!' : 'Great Job!'}
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              {lang === 'rw'
                ? `Wujeje ${score}/${quizQuestions.length} ibibazo neza! (${Math.round((score / quizQuestions.length) * 100)}%)`
                : `You got ${score}/${quizQuestions.length} correct! (${Math.round((score / quizQuestions.length) * 100)}%)`}
            </p>
            <button onClick={handleRefresh} className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all">
              <RotateCcw className="w-4 h-4" />
              {lang === 'rw' ? 'Ibibazo Bishya' : 'New Questions'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
