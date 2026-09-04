import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, Award, Zap, CheckCircle, XCircle, Sparkles, ArrowRight, ArrowLeft, Trophy, Languages } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router';
import { quizAPI, paymentAPI, pdfQuizAPI, usageAPI, certificatesAPI, flushPendingQuizSubmissions } from '../services/api';
import { useTranslation } from '../contexts/I18nContext';
const quizImages: Record<string, any> = import.meta.glob('../assets/*.webp', { eager: true });
const resolveQuizImage = (idx: number) => {
  const n = Math.min(idx + 1, 20);
  const key1 = `../assets/quiz${n}.webp`;
  const key2 = `../assets/quiz ${n}.webp`;
  const mod = (quizImages[key1] as any) || (quizImages[key2] as any);
  return typeof mod === 'string' ? mod : mod?.default || '';
};

interface QuizQuestion {
  id: string;
  category: string;
  question: string;
  options: Array<{ text: string; isCorrect: boolean }>;
  image?: string | null;
}

interface QuizCard {
  id: string;
  title: string;
  category: string;
  image: string | null;
  questionCount: number;
}

export default function Quiz() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const { t, lang } = useTranslation();
  const [quizzes, setQuizzes] = useState<QuizCard[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<QuizCard | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [paywallAfter, setPaywallAfter] = useState<number>(6);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(1200);
  const [showPaywall, setShowPaywall] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [answers, setAnswers] = useState<Array<{ questionId: string; selectedOption: number; isCorrect: boolean }>>([]);
  const [payPhone, setPayPhone] = useState('');
  const [paying, setPaying] = useState(false);
  const [txnId, setTxnId] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'PENDING' | 'SUCCESS' | 'FAILED' | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [payPhoneError, setPayPhoneError] = useState<string | null>(null);
  const [countedQuestions, setCountedQuestions] = useState<Set<string>>(new Set());
  const [quizLang, setQuizLang] = useState<'rw' | 'en'>(lang === 'en' ? 'en' : 'rw');
  const [quizFreeUsed, setQuizFreeUsed] = useState<number>(0);
  const FREE_QUIZ_LIMIT = 5;

  // Load quiz free usage from backend database
  useEffect(() => {
    (async () => {
      try {
        if (user?.id) {
          const usage = await usageAPI.getUsage();
          setQuizFreeUsed(usage.quizFreeQuestionsUsed || 0);
        } else {
          // Guest fallback: localStorage
          const saved = localStorage.getItem('ishami_quiz_free_used');
          if (saved) setQuizFreeUsed(parseInt(saved, 10) || 0);
        }
      } catch {
        try {
          const saved = localStorage.getItem('ishami_quiz_free_used');
          if (saved) setQuizFreeUsed(parseInt(saved, 10) || 0);
        } catch {}
      }
    })();
  }, [user?.id]);

  // Retry any quiz marks that failed to upload on a previous session
  useEffect(() => {
    flushPendingQuizSubmissions().catch(() => {});
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && !quizCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setQuizCompleted(true);
    }
  }, [timeLeft, quizCompleted]);

  useEffect(() => {
    (async () => {
      try {
        const [quizRes, pdfRes] = await Promise.allSettled([
          quizAPI.listQuizzes(),
          pdfQuizAPI.listBundles(quizLang)
        ]);
        let allQuizzes: QuizCard[] = [];
        if (quizRes.status === 'fulfilled') allQuizzes = quizRes.value.quizzes || [];
        // Add PDF quiz bundles as selectable quiz cards
        if (pdfRes.status === 'fulfilled') {
          const pdfBundles = (pdfRes.value.bundles || []).map((b: any) => ({
            id: b.id,
            title: b.title,
            category: b.category,
            image: null,
            questionCount: b.questionCount
          }));
          allQuizzes = [...pdfBundles, ...allQuizzes];
        }
        setQuizzes(allQuizzes);
      } catch (error) {
        console.error('Failed to load quizzes:', error);
      }
    })();
  }, []);

  const toggleQuizLang = async () => {
    const newLang = quizLang === 'rw' ? 'en' : 'rw';
    setQuizLang(newLang);
    if (selectedQuiz) {
      try {
        const res = await quizAPI.getQuiz(selectedQuiz.id, newLang);
        setQuestions(res.questions);
        setCurrentQuestion(0);
        setSelectedAnswer(null);
        setAnswered(false);
      } catch (error) {
        console.error('Failed to reload quiz:', error);
      }
    }
  };

  const startQuiz = async (quiz: QuizCard) => {
    // Guests must sign in before starting a quiz
    if (!user) {
      setShowPaywall(true);
      return;
    }
    try {
      // Check if this is a PDF quiz bundle
      const isPdfQuiz = quiz.id && quiz.id.startsWith('pdf_quiz_');
      let res: any;
      if (isPdfQuiz) {
        res = await pdfQuizAPI.getBundle(quiz.id, quizLang);
      } else {
        res = await quizAPI.getQuiz(quiz.id, quizLang);
      }
      setSelectedQuiz(quiz);
      setQuestions(res.questions);
      setPaywallAfter(isPdfQuiz ? 999 : (res.paywallAfter || 6)); // PDF quizzes are free (no paywall)
      setCurrentQuestion(0);
      setSelectedAnswer(null);
      setAnswered(false);
      setScore(0);
      setQuizCompleted(false);
      setShowPaywall(false);
      setTimeLeft(1200);
      setAnswers([]);
    } catch (error) {
      console.error('Failed to start quiz:', error);
    }
  };

  const handleAnswerSelect = (optionIndex: number) => {
    if (answered) return;

    const canContinue = user?.isPro || (user?.accessTier === 'quiz' || user?.accessTier === 'full');
    if (!canContinue && quizFreeUsed >= FREE_QUIZ_LIMIT) {
      setShowPaywall(true);
      return;
    }

    setSelectedAnswer(optionIndex);
    setAnswered(true);

    // Track free quiz usage (only for non-paying users answering free questions)
    if (!canContinue && quizFreeUsed < FREE_QUIZ_LIMIT) {
      const newUsed = quizFreeUsed + 1;
      setQuizFreeUsed(newUsed);
      if (user?.id) {
        usageAPI.increment('quiz').catch(() => {});
      } else {
        try { localStorage.setItem('ishami_quiz_free_used', String(newUsed)); } catch {}
      }
    }

    if (questions[currentQuestion].options[optionIndex].isCorrect) {
      const qid = questions[currentQuestion].id;
      if (!countedQuestions.has(qid)) {
        setScore(prev => prev + 1);
        setCountedQuestions(prev => {
          const next = new Set(prev);
          next.add(qid);
          return next;
        });
      }
    }

    const q = questions[currentQuestion];
    const entry = { questionId: q.id, selectedOption: optionIndex, isCorrect: q.options[optionIndex].isCorrect };
    setAnswers(prev => {
      const idx = prev.findIndex(a => a.questionId === q.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = entry;
        return next;
      }
      return [...prev, entry];
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setAnswered(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(null);
      setAnswered(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isTimeRunningOut = timeLeft <= 60;
  const progressPercentage = questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0;

  useEffect(() => {
    (async () => {
      if (quizCompleted && user && selectedQuiz) {
        try {
          await quizAPI.submitQuiz({
            userId: user.id,
            answers,
            score,
            totalQuestions: questions.length,
            timeTakenSeconds: 1200 - timeLeft,
          });
        } catch (e) {
          // Keep the marks safe: queue them locally and retry on the next visit
          // to the quiz or leaderboard pages.
          console.error('Failed to submit quiz:', e);
          try {
            const payload = {
              userId: user.id,
              answers,
              score,
              totalQuestions: questions.length,
              timeTakenSeconds: 1200 - timeLeft,
            };
            const pending = JSON.parse(localStorage.getItem('ishami_pending_quiz_submissions') || '[]');
            pending.push(payload);
            localStorage.setItem('ishami_pending_quiz_submissions', JSON.stringify(pending.slice(-10)));
          } catch {}
        }
        const percentage = Math.round((score / questions.length) * 100);
        const passed = percentage >= 70;
        const historyEntry = {
          id: `${Date.now()}-${selectedQuiz.id}`,
          quizTitle: selectedQuiz.title || `Quiz ${selectedQuiz.id}`,
          score,
          totalQuestions: questions.length,
          percentage,
          completedAt: new Date().toISOString(),
          passed,
        };
        const existing = localStorage.getItem('quizHistory');
        const history = existing ? JSON.parse(existing) : [];
        history.unshift(historyEntry);
        localStorage.setItem('quizHistory', JSON.stringify(history.slice(0, 50)));
        if (passed) {
          // Persist the certificate on the server so it can be publicly verified
          // at /verify/:certificateNo. The server issues the official number.
          let certNo = `ISH-TRU-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}`;
          let issuedISO = new Date().toISOString();
          try {
            const res = await certificatesAPI.generate({
              score,
              totalQuestions: questions.length,
              quizTitle: selectedQuiz.title || 'Traffic Rules & Road Safety Understanding',
            });
            if (res?.certificate?.certificateNo) {
              certNo = res.certificate.certificateNo;
              issuedISO = res.certificate.issuedAt || issuedISO;
            }
          } catch { /* offline — keep local certificate */ }
          const expiryDate = new Date(new Date(issuedISO).getTime());
          expiryDate.setFullYear(expiryDate.getFullYear() + 1);
          localStorage.setItem('latestCertificate', JSON.stringify({
            userId: user.id,
            username: user.username,
            score,
            totalQuestions: questions.length,
            quizTitle: selectedQuiz.title || 'Traffic Rules & Road Safety Understanding',
            issuedAt: new Date(issuedISO).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
            expiresAt: expiryDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
            certificateNo: certNo,
            passed: true,
          }));
        }
      }
    })();
  }, [quizCompleted]);

  const Confetti = () => {
    const colors = ['#2563EB', '#16A34A', '#FACC15', '#DC2626', '#8B5CF6'];
    return (
      <div className="fixed inset-0 pointer-events-none z-50">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="confetti-piece"
            style={{
              left: `${Math.random() * 100}%`,
              backgroundColor: colors[Math.floor(Math.random() * colors.length)],
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
    );
  };

  if (selectedQuiz && quizCompleted) {
    const percentage = Math.round((score / questions.length) * 100);
    const passed = percentage >= 70;

    return (
      <div className="min-h-screen py-12 px-4 flex items-center justify-center">
        {passed && <Confetti />}
        
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full bg-white/5 backdrop-blur-xl rounded-3xl p-8 text-center border border-white/10 shadow-2xl"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
            className={`inline-flex p-6 rounded-3xl mb-6 ${passed ? 'bg-green-500/20' : 'bg-orange-500/20'}`}
          >
            {passed ? (
              <Trophy className="w-16 h-16 text-green-400" />
            ) : (
              <Clock className="w-16 h-16 text-orange-400" />
            )}
          </motion.div>
          
          <h1 className="text-3xl font-bold text-white mb-2 font-[family-name:var(--font-heading)]">
            {passed ? t('quiz.results.congratulations', 'Congratulations! 🎉') : t('quiz.results.keep_practicing', 'Keep Practicing! 💪')}
          </h1>
          
          <p className="text-gray-400 mb-6">
            {t('quiz.results.your_score', 'Your Score:')} <span className={`text-4xl font-bold ${passed ? 'text-green-400' : 'text-orange-400'}`}>{score}/{questions.length}</span>
            <span className="block mt-2 text-lg">({percentage}%)</span>
          </p>

          {passed ? (
            <p className="text-gray-300 mb-8">
              {t('quiz.results.excellent_work', "Excellent work! You're ready for the real driving test. Keep up the great work!")}
            </p>
          ) : (
            <p className="text-gray-300 mb-8">
              {t('quiz.results.need_70_percent', 'You need 70% to pass. Review the materials and try again. You got this!')}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {passed ? (
              <button
                onClick={() => navigate('/certificate')}
                className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-slate-900 rounded-xl font-semibold hover:shadow-lg hover:shadow-yellow-500/30 transition-all duration-300 flex items-center justify-center gap-2"
              >
                {t('quiz.results.get_certificate', '🎓 Get Your Certificate')}
              </button>
            ) : (
              <button
                onClick={() => {
                  setCurrentQuestion(0);
                  setScore(0);
                  setTimeLeft(1200);
                  setQuizCompleted(false);
                  setAnswered(false);
                  setSelectedAnswer(null);
                  setSelectedQuiz(null);
                }}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 flex items-center justify-center gap-2"
              >
                {t('quiz.results.try_again', 'Try Again')}
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={() => navigate('/leaderboard')}
              className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl font-medium hover:bg-white/10 transition-all duration-300"
            >
              {t('quiz.results.view_leaderboard', 'View Leaderboard')}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!selectedQuiz) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-7xl mx-auto pt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 font-[family-name:var(--font-heading)]">
                  {t('quiz.title', 'Choose a Quiz')}
                </h1>
                <p className="text-gray-400">{t('quiz.subtitle', 'Each quiz contains 20 questions. Test your knowledge!')}</p>
              </div>
              <button
                onClick={toggleQuizLang}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all"
              >
                <Languages className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-medium text-white">{quizLang === 'en' ? 'EN' : 'RW'}</span>
              </button>
            </div>
          </motion.div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((q, idx) => (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 group">
                  <div className="h-32 overflow-hidden">
                    <img
                      src={resolveQuizImage(idx)}
                      alt="Quiz"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-5">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 rounded-full text-blue-400 text-xs mb-3">
                      <Sparkles className="w-3 h-3" />
                      <span>{q.category}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-1">{quizLang === 'en' ? 'Quiz' : 'Ikizamini'} {idx + 1}</h3>
                    <p className="text-sm text-gray-400 mb-4">{q.questionCount} {quizLang === 'en' ? 'questions' : 'ibibazo'}</p>
                    <button 
                      onClick={() => startQuiz(q)} 
                      className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      {quizLang === 'en' ? t('quiz.start', 'Start Quiz') : t('quiz.start', 'Tangira')}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto pt-20">
        {/* Header with Timer and Progress */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
            <div className="flex items-center justify-between gap-4">
              {/* Timer */}
              <div className={`flex items-center gap-3 ${isTimeRunningOut ? 'animate-pulse' : ''}`}>
                <div className={`p-2 rounded-xl ${isTimeRunningOut ? 'bg-red-500/20' : 'bg-blue-500/20'}`}>
                  <Clock className={`w-5 h-5 ${isTimeRunningOut ? 'text-red-400' : 'text-blue-400'}`} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">{t('quiz.quiz_list.time_left', 'Time Left')}</p>
                  <p className={`text-xl font-bold font-[family-name:var(--font-mono)] ${isTimeRunningOut ? 'text-red-400' : 'text-white'}`}>
                    {formatTime(timeLeft)}
                  </p>
                </div>
              </div>

              {/* Progress */}
              <div className="flex-1 max-w-xs">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-xs text-gray-500">{t('quiz.quiz_list.progress', 'Progress')}</p>
                  <p className="text-xs text-white font-medium">
                    {currentQuestion + 1}/{questions.length}
                  </p>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                  />
                </div>
              </div>

              {/* Score */}
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-green-500/20">
                  <Award className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">{t('quiz.quiz_list.score', 'Score')}</p>
                  <p className="text-xl font-bold text-white font-[family-name:var(--font-mono)]">{score}</p>
                </div>
              </div>

              {/* Language Toggle */}
              <button
                onClick={toggleQuizLang}
                className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all"
                title={quizLang === 'en' ? 'Switch to Kinyarwanda' : 'Switch to English'}
              >
                <Languages className="w-5 h-5 text-blue-400" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-2xl"
          >
            {/* Category Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-4">
              <span className="text-sm text-blue-400 font-medium">{selectedQuiz.category}</span>
            </div>

            {/* Image */}
            {question.image && (
              <div className="mb-6">
                <img src={question.image as any} alt="Question" className="w-full max-h-48 object-contain rounded-xl border border-white/10 bg-white/5" />
              </div>
            )}

            {/* Question */}
            <div className="mb-6">
              <p className="text-white text-lg leading-relaxed">
                {question.question}
              </p>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {question.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrect = option.isCorrect;
                const showResult = answered && isSelected;
                const showCorrect = answered && isCorrect;

                return (
                  <motion.button
                    key={index}
                    whileHover={{ scale: answered ? 1 : 1.02 }}
                    whileTap={{ scale: answered ? 1 : 0.98 }}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={answered}
                    className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                      showResult
                        ? isCorrect
                          ? 'bg-green-500/20 border-green-500/50 shadow-lg shadow-green-500/20'
                          : 'bg-red-500/20 border-red-500/50 shadow-lg shadow-red-500/20'
                        : showCorrect
                          ? 'bg-green-500/10 border-green-500/30'
                          : 'bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10'
                    } ${answered && !showResult && !showCorrect ? 'opacity-50' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium ${
                          showResult
                            ? isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                            : showCorrect
                              ? 'bg-green-500/30 text-green-400'
                              : 'bg-white/10 text-gray-400'
                        }`}>
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span className={`text-sm ${
                          showResult
                            ? isCorrect ? 'text-green-400' : 'text-red-400'
                            : showCorrect
                              ? 'text-green-400'
                              : 'text-white'
                        }`}>
                          {option.text}
                        </span>
                      </div>
                      {showResult && (
                        <div className="ml-4">
                          {isCorrect ? (
                            <CheckCircle className="w-6 h-6 text-green-400" />
                          ) : (
                            <XCircle className="w-6 h-6 text-red-400" />
                          )}
                        </div>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Navigation Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 flex items-center gap-3"
            >
              <button
                onClick={handlePrev}
                disabled={currentQuestion === 0}
                className={`px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white transition-all flex items-center gap-2 ${
                  currentQuestion === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/10'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">{t('quiz.quiz_list.previous', 'Previous')}</span>
              </button>
              <button
                onClick={handleNext}
                disabled={!answered}
                className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                  !answered 
                    ? 'opacity-30 cursor-not-allowed bg-white/10 text-gray-400' 
                    : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-lg hover:shadow-blue-500/30'
                }`}
              >
                {currentQuestion < questions.length - 1 ? t('quiz.quiz_list.next_question', 'Next Question') : t('quiz.quiz_list.finish_quiz', 'Finish Quiz')}
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Paywall Modal */}
      {showPaywall && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => !paying && setShowPaywall(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#111827] rounded-3xl p-8 max-w-lg w-full border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="text-center">
              {!user ? (
                /* ── Guest: Sign In Required ── */
                <>
                  <div className="inline-flex p-4 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-3xl mb-6 shadow-lg shadow-blue-500/30">
                    <Award className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2 font-[family-name:var(--font-heading)]">{t('quizpage.signin_title', 'Sign In to Start Quiz')}</h2>
                  <p className="text-gray-400 mb-6 text-sm">
                    {t('quizpage.signin_desc', 'You need an account to take a quiz. Sign in or create a free account to get started.')}
                  </p>
                  <div className="space-y-3">
                    <a href="/auth" className="block w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 text-center">
                      {t('common.join', 'Sign In / Sign Up')}
                    </a>
                    <button onClick={() => setShowPaywall(false)} className="w-full px-6 py-3 text-gray-400 hover:text-white transition-colors text-sm">
                      {t('common.go_back', 'Go Back')}
                    </button>
                  </div>
                </>
              ) : (
                /* ── Logged-in user: Upgrade prompt ── */
                <>
                  <div className="inline-flex p-4 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-3xl mb-6 shadow-lg shadow-yellow-500/30">
                    <Zap className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2 font-[family-name:var(--font-heading)]">{t('quiz.paywall.title', 'Unlock More Questions')}</h2>
                  <p className="text-gray-400 mb-6">
                    {t('quizpage.upgrade_desc', "You've used your 5 free quiz questions! Choose a plan to continue:")}
                  </p>

              {paymentStatus === 'SUCCESS' ? (
                <div className="space-y-4">
                  <div className="inline-flex p-4 bg-green-500/20 rounded-3xl">
                    <CheckCircle className="w-10 h-10 text-green-400" />
                  </div>
                  <p className="text-green-400 font-semibold">Payment Successful! 🎉</p>
                  <p className="text-gray-400 text-sm">Your access has been upgraded.</p>
                  <button
                    onClick={() => { setShowPaywall(false); setPaymentStatus(null); }}
                    className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                  >
                    Continue Quiz
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* ── Quiz Access Tier ── */}
                  <div className="bg-white/5 rounded-2xl p-5 border border-white/10 text-left">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-bold text-blue-400">{t('quizpage.tier_access', 'Quiz Access')}</h3>
                      <span className="text-2xl font-bold text-blue-400">100 RWF</span>
                    </div>
                    <p className="text-sm text-gray-400 mb-3">{t('quizpage.tier_unlock', 'Unlock all quiz questions beyond the free ones')}</p>
                    <div className="space-y-2">
                      {[t('quizpage.unlimited', 'Unlimited quiz questions'), t('quizpage.certificates', 'Earn certificates')].map((label, i) => (
                        <div key={i} className="flex items-center gap-2 text-left">
                          <CheckCircle className="w-4 h-4 text-blue-400 shrink-0" />
                          <span className="text-sm text-gray-300">{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ── VIP Premium Tier ── */}
                  <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-2xl p-5 border border-yellow-500/30 text-left relative">
                    <div className="absolute -top-3 right-4 px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full text-xs font-bold text-white shadow-lg">{t('quizpage.best_value', 'BEST VALUE')}</div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-bold text-yellow-400">{t('quizpage.vip', 'VIP Premium')}</h3>
                      <span className="text-2xl font-bold text-yellow-400">3,000 RWF</span>
                    </div>
                    <p className="text-sm text-gray-400 mb-3">{t('quizpage.vip_desc', 'Unlock everything: quizzes, courses, AI assistant, and 3D simulation')}</p>
                    <div className="space-y-2">
                      {[t('quizpage.unlimited', 'Unlimited quiz questions'), t('quizpage.all_courses', 'All courses & resources'), t('quizpage.ai_access', 'AI assistant access'), t('quizpage.sim3d', '3D driving simulation'), t('quizpage.certificate', 'Certificate of completion')].map((label, i) => (
                        <div key={i} className="flex items-center gap-2 text-left">
                          <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                          <span className="text-sm text-gray-300">{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ── Phone Input ── */}
                  {!paying && paymentStatus !== 'PENDING' && (
                    <>
                      <div className="relative">
                        <input
                          type="tel"
                          value={payPhone}
                          onChange={(e) => {
                            const val = e.target.value;
                            setPayPhone(val);
                            if (val && !/^(\+250|0)(78|79|72|73)\d{7}$/.test(val)) {
                              setPayPhoneError(t('quiz.paywall.phone_invalid', 'Please enter a valid Rwandan phone number (078X/079X/072X/073X)'));
                            } else {
                              setPayPhoneError(null);
                            }
                          }}
                          placeholder={t('quiz.paywall.phone_placeholder', 'Phone number (e.g. 0788xxxxxx)')}
                          className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 ${
                            payPhoneError ? 'border-red-500/50 focus:ring-red-500' : 'border-white/10 focus:ring-blue-500'
                          }`}
                        />
                      </div>
                      {payPhoneError && (
                        <p className="text-red-400 text-sm mt-1">{payPhoneError}</p>
                      )}

                      {/* Quiz Access Button */}
                      <button
                        disabled={!payPhone || !!payPhoneError || paymentStatus === 'PENDING'}
                        onClick={async () => {
                          if (!payPhone || !/^(\+250|0)(78|79|72|73)\d{7}$/.test(payPhone)) {
                            setPayPhoneError(t('quiz.paywall.phone_invalid', 'Please enter a valid Rwandan phone number'));
                            return;
                          }
                          setPaying(true);
                          setPaymentError(null);
                          try {
                            const res = await paymentAPI.paypackCashin({
                              amount: 100,
                              phone: payPhone,
                              product: 'quiz',
                            });
                            setTxnId(res.transactionId);
                            setPaymentStatus('PENDING');
                            setPaying(false);
                            let tries = 0;
                            const iv = setInterval(async () => {
                              tries++;
                              try {
                                const st = await paymentAPI.paypackStatus(res.transactionId);
                                if (st.status === 'SUCCESS' || st.status === 'FAILED') {
                                  setPaymentStatus(st.status);
                                  clearInterval(iv);
                                  if (st.status === 'SUCCESS' && updateUser) {
                                    updateUser({ isPro: true, accessTier: 'quiz' });
                                  }
                                }
                                if (tries > 40) {
                                  clearInterval(iv);
                                  setPaymentStatus('FAILED');
                                  setPaymentError('Payment timed out');
                                }
                              } catch {
                                clearInterval(iv);
                                setPaymentStatus('FAILED');
                                setPaymentError('Could not check payment status');
                              }
                            }, 3000);
                          } catch (e: any) {
                            setPaying(false);
                            setPaymentError(e?.message || 'Payment failed');
                          }
                        }}
                        className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {paying ? t('quiz.paywall.processing', 'Processing...') : t('quizpage.access_btn', 'Quiz Access — 100 RWF')}
                      </button>

                      {/* VIP Premium Button */}
                      <button
                        disabled={!payPhone || !!payPhoneError || paymentStatus === 'PENDING'}
                        onClick={async () => {
                          if (!payPhone || !/^(\+250|0)(78|79|72|73)\d{7}$/.test(payPhone)) {
                            setPayPhoneError(t('quiz.paywall.phone_invalid', 'Please enter a valid Rwandan phone number'));
                            return;
                          }
                          setPaying(true);
                          setPaymentError(null);
                          try {
                            const res = await paymentAPI.paypackCashin({
                              amount: 3000,
                              phone: payPhone,
                              product: 'full',
                            });
                            setTxnId(res.transactionId);
                            setPaymentStatus('PENDING');
                            setPaying(false);
                            let tries = 0;
                            const iv = setInterval(async () => {
                              tries++;
                              try {
                                const st = await paymentAPI.paypackStatus(res.transactionId);
                                if (st.status === 'SUCCESS' || st.status === 'FAILED') {
                                  setPaymentStatus(st.status);
                                  clearInterval(iv);
                                  if (st.status === 'SUCCESS' && updateUser) {
                                    updateUser({ isPro: true, accessTier: 'full' });
                                  }
                                }
                                if (tries > 40) {
                                  clearInterval(iv);
                                  setPaymentStatus('FAILED');
                                  setPaymentError('Payment timed out');
                                }
                              } catch {
                                clearInterval(iv);
                                setPaymentStatus('FAILED');
                                setPaymentError('Could not check payment status');
                              }
                            }, 3000);
                          } catch (e: any) {
                            setPaying(false);
                            setPaymentError(e?.message || 'Payment failed');
                          }
                        }}
                        className="w-full px-6 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-yellow-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                      >
                        {paying ? t('quiz.paywall.processing', 'Processing...') : t('quizpage.vip_btn', 'VIP Premium — 3,000 RWF')}
                      </button>
                    </>
                  )}

                  {paymentStatus === 'PENDING' && (
                    <div className="py-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-3"></div>
                      <p className="text-gray-300">📱 Check your phone for USSD prompt...</p>
                      <p className="text-xs text-gray-500 mt-1">Confirm the payment on your phone</p>
                    </div>
                  )}

                  {paymentError && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                      <p className="text-red-400 text-sm">{paymentError}</p>
                    </div>
                  )}

                  <button
                    onClick={() => { setShowPaywall(false); setPaymentStatus(null); setPaymentError(null); setPaying(false); }}
                    className="w-full px-6 py-3 text-gray-400 hover:text-white transition-colors"
                  >
                    {t('quiz.paywall.maybe_later', 'Maybe Later')}
                  </button>
                </div>
              )}
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
