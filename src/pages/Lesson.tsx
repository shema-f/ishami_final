import { useParams, Link, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, CheckCircle2, XCircle, FileText, Video, Zap, ClipboardCheck, Star, AlertTriangle, Lightbulb, Info, Play, RotateCcw } from 'lucide-react';
import { useState, useMemo } from 'react';
import { getCourseById, type Course, type CourseLesson } from '../data/courses';
import { getLessonContent, type LessonContent, type QuizQuestion } from '../data/lessonContent';
import { useTranslation } from '../contexts/I18nContext';

const lessonTypeConfig: Record<string, { icon: typeof FileText; color: string; bgGradient: string; label: string }> = {
  text: { icon: FileText, color: 'text-blue-400', bgGradient: 'from-blue-500 to-indigo-600', label: 'Reading' },
  video: { icon: Video, color: 'text-purple-400', bgGradient: 'from-purple-500 to-violet-600', label: 'Video Lesson' },
  interactive: { icon: Zap, color: 'text-amber-400', bgGradient: 'from-amber-500 to-orange-600', label: 'Interactive' },
  quiz: { icon: ClipboardCheck, color: 'text-green-400', bgGradient: 'from-green-500 to-emerald-600', label: 'Quiz' },
  assessment: { icon: Star, color: 'text-pink-400', bgGradient: 'from-pink-500 to-rose-600', label: 'Assessment' },
};

export default function Lesson() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const { lang } = useTranslation();

  const course = getCourseById(courseId || '');
  const lessonNum = parseInt(lessonId || '1', 10);
  const lessonData = getLessonContent(courseId || '', lessonNum);
  const lessonMeta = course?.curriculum.lessons.find((l: CourseLesson) => l.id === lessonNum);

  const [quizState, setQuizState] = useState<{
    answers: number[];
    submitted: boolean;
    currentQuestion: number;
  }>({ answers: [], submitted: false, currentQuestion: 0 });

  if (!course || !lessonMeta || !lessonData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-600" />
          <h2 className="text-2xl font-bold text-white mb-2">Lesson Not Found</h2>
          <p className="text-gray-400 mb-6">This lesson doesn't exist yet.</p>
          <Link to={courseId ? `/courses/${courseId}` : '/courses'} className="px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors">
            Back to Course
          </Link>
        </div>
      </div>
    );
  }

  const config = lessonTypeConfig[lessonData.type] || lessonTypeConfig.text;
  const TypeIcon = config.icon;
  const prevLesson = lessonNum > 1 ? lessonNum - 1 : null;
  const nextLesson = lessonNum < course.totalLessons ? lessonNum + 1 : null;

  const quiz = lessonData.quiz;
  const totalQuestions = quiz?.questions.length || 0;
  const score = useMemo(() => {
    if (!quiz || !quizState.submitted) return 0;
    let correct = 0;
    quiz.questions.forEach((q: QuizQuestion, i: number) => {
      if (quizState.answers[i] === q.correctIndex) correct++;
    });
    return Math.round((correct / totalQuestions) * 100);
  }, [quiz, quizState.submitted, quizState.answers, totalQuestions]);

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-6 flex items-center gap-2 text-sm">
          <Link to="/courses" className="text-gray-400 hover:text-white transition-colors">Courses</Link>
          <span className="text-gray-600">/</span>
          <Link to={`/courses/${courseId}`} className="text-gray-400 hover:text-white transition-colors truncate">{course.title}</Link>
          <span className="text-gray-600">/</span>
          <span className="text-gray-300 truncate">{lessonMeta.title}</span>
        </motion.div>

        {/* Lesson Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`relative rounded-3xl bg-gradient-to-br ${config.bgGradient} p-8 sm:p-10 mb-8 overflow-hidden`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <TypeIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-white/70 text-sm font-medium">{config.label}</span>
              <span className="text-white/40">•</span>
              <span className="text-white/70 text-sm">{lessonMeta.duration}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 font-[family-name:var(--font-heading)]">
              {lang === 'rw' ? lessonMeta.titleKiny : lessonMeta.title}
            </h1>
            <p className="text-white/70 text-sm">Lesson {lessonMeta.id} of {course.totalLessons}</p>
          </div>
        </motion.div>

        {/* Video Embed */}
        {lessonData.type === 'video' && lessonData.videoUrl && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
            <div className="relative rounded-2xl overflow-hidden bg-black border border-white/10" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src={lessonData.videoUrl}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={lessonMeta.title}
              />
            </div>
          </motion.div>
        )}

        {/* Lesson Content */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-6 mb-12">
          {lessonData.content.map((section, idx) => (
            <ContentSection key={idx} section={section} lang={lang} />
          ))}
        </motion.div>

        {/* Quiz / Assessment */}
        {quiz && (lessonData.type === 'quiz' || lessonData.type === 'assessment') && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-12">
            {lessonData.type === 'assessment' && (
              <div className="flex items-center gap-3 p-4 bg-pink-500/10 border border-pink-500/20 rounded-2xl mb-6">
                <Star className="w-5 h-5 text-pink-400 flex-shrink-0" />
                <p className="text-pink-300 text-sm">
                  This is the final assessment. You need <strong>70%</strong> or higher to earn your course certificate.
                </p>
              </div>
            )}

            {quizState.submitted ? (
              <QuizResults score={score} total={totalQuestions} quiz={quiz} answers={quizState.answers} lang={lang} onRetry={() => setQuizState({ answers: [], submitted: false, currentQuestion: 0 })} />
            ) : (
              <QuizInterface
                quiz={quiz}
                state={quizState}
                setState={setQuizState}
                lang={lang}
                isAssessment={lessonData.type === 'assessment'}
              />
            )}
          </motion.div>
        )}

        {/* Interactive placeholder */}
        {lessonData.type === 'interactive' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-12 p-8 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-center">
            <Zap className="w-12 h-12 mx-auto mb-4 text-amber-400" />
            <h3 className="text-lg font-bold text-white mb-2">Interactive Mode</h3>
            <p className="text-gray-400 text-sm mb-4">This lesson includes interactive exercises. Practice the concepts above, then proceed to the next lesson.</p>
            <Link to={`/courses/${courseId}/lessons/${lessonNum + 1}`} className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 transition-colors">
              Next Lesson <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        )}

        {/* Navigation */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="flex items-center justify-between gap-4 pt-8 border-t border-white/10">
          {prevLesson ? (
            <Link to={`/courses/${courseId}/lessons/${prevLesson}`} className="flex items-center gap-2 px-5 py-3 bg-white/5 border border-white/10 text-gray-300 rounded-xl hover:bg-white/10 hover:text-white transition-all">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Previous</span>
            </Link>
          ) : <div />}
          {nextLesson ? (
            <Link to={`/courses/${courseId}/lessons/${nextLesson}`} className="flex items-center gap-2 px-5 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-all hover:shadow-lg hover:shadow-blue-500/25">
              <span className="text-sm">Next Lesson</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <Link to={`/courses/${courseId}`} className="flex items-center gap-2 px-5 py-3 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 transition-all">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-sm">Complete Course</span>
            </Link>
          )}
        </motion.div>
      </div>
    </div>
  );
}

// ============================================================
// Content Section Renderer
// ============================================================

function ContentSection({ section, lang }: { section: any; lang: string }) {
  const text = lang === 'rw' && section.textKiny ? section.textKiny : section.text;
  const heading = lang === 'rw' && section.headingKiny ? section.headingKiny : section.heading;
  const items = lang === 'rw' && section.itemsKiny ? section.itemsKiny : section.items;

  switch (section.type) {
    case 'paragraph':
      return (
        <div className="bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 sm:p-8">
          <p className="text-gray-300 leading-relaxed text-base sm:text-lg">{text}</p>
        </div>
      );

    case 'list':
      return (
        <div className="bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 sm:p-8">
          {heading && (
            <h3 className="text-white font-bold text-lg mb-4 font-[family-name:var(--font-heading)]">{heading}</h3>
          )}
          <ul className="space-y-3">
            {items?.map((item: string, i: number) => (
              <li key={i} className="flex items-start gap-3 text-gray-300 text-sm sm:text-base">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      );

    case 'tip':
      return (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
            <Lightbulb className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-emerald-200 text-sm leading-relaxed">{text}</p>
        </div>
      );

    case 'warning':
      return (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <p className="text-red-200 text-sm leading-relaxed">{text}</p>
        </div>
      );

    case 'highlight':
      return (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
            <Info className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-blue-200 text-sm leading-relaxed">{text}</p>
        </div>
      );

    default:
      return null;
  }
}

// ============================================================
// Quiz Interface
// ============================================================

function QuizInterface({
  quiz, state, setState, lang, isAssessment
}: {
  quiz: any; state: any; setState: any; lang: string; isAssessment: boolean;
}) {
  const currentQ = quiz.questions[state.currentQuestion];
  const total = quiz.questions.length;
  const progress = ((state.currentQuestion + 1) / total) * 100;

  const selectAnswer = (optionIndex: number) => {
    const newAnswers = [...state.answers];
    newAnswers[state.currentQuestion] = optionIndex;
    setState({ ...state, answers: newAnswers });
  };

  const nextQuestion = () => {
    if (state.currentQuestion < total - 1) {
      setState({ ...state, currentQuestion: state.currentQuestion + 1 });
    } else {
      setState({ ...state, submitted: true });
    }
  };

  return (
    <div className="bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-3xl p-6 sm:p-8">
      {/* Progress */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm text-gray-400">
          Question {state.currentQuestion + 1} of {total}
        </span>
        <span className="text-sm text-gray-500">{Math.round(progress)}% complete</span>
      </div>
      <div className="h-1.5 bg-white/5 rounded-full mb-8 overflow-hidden">
        <motion.div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" animate={{ width: `${progress}%` }} />
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={state.currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <h3 className="text-white font-bold text-lg mb-6">
            {lang === 'rw' && currentQ.questionKiny ? currentQ.questionKiny : currentQ.question}
          </h3>

          <div className="space-y-3">
            {currentQ.options.map((option: string, i: number) => (
              <button
                key={i}
                onClick={() => selectAnswer(i)}
                className={`w-full text-left px-5 py-4 rounded-xl border transition-all duration-200 font-medium ${
                  state.answers[state.currentQuestion] === i
                    ? 'bg-blue-500/20 border-blue-500/40 text-white'
                    : 'bg-white/[0.03] border-white/[0.08] text-gray-300 hover:bg-white/[0.06] hover:border-white/[0.15]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                    state.answers[state.currentQuestion] === i
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/5 text-gray-500'
                  }`}>
                    {String.fromCharCode(65 + i)}
                  </div>
                  <span>{option}</span>
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Next Button */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={nextQuestion}
          disabled={state.answers[state.currentQuestion] === undefined}
          className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all ${
            state.answers[state.currentQuestion] !== undefined
              ? 'bg-blue-500 text-white hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/25'
              : 'bg-white/5 text-gray-500 cursor-not-allowed'
          }`}
        >
          {state.currentQuestion < total - 1 ? 'Next Question' : (isAssessment ? 'Submit Assessment' : 'Submit Quiz')}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ============================================================
// Quiz Results
// ============================================================

function QuizResults({
  score, total, quiz, answers, lang, onRetry
}: {
  score: number; total: number; quiz: any; answers: number[]; lang: string; onRetry: () => void;
}) {
  const passed = score >= 70;

  return (
    <div className="space-y-6">
      {/* Score Card */}
      <div className={`rounded-3xl p-8 text-center ${passed ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
        <div className={`w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center ${passed ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
          {passed ? <CheckCircle2 className="w-10 h-10 text-emerald-400" /> : <XCircle className="w-10 h-10 text-red-400" />}
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">{score}%</h3>
        <p className={`text-lg font-medium mb-1 ${passed ? 'text-emerald-300' : 'text-red-300'}`}>
          {passed ? 'Congratulations! You passed!' : 'Not quite there yet'}
        </p>
        <p className="text-gray-400 text-sm">
          {passed
            ? `You got ${Math.round(score / 100 * total)} out of ${total} questions correct.`
            : `You got ${Math.round(score / 100 * total)} out of ${total} correct. You need 70% to pass.`}
        </p>
        {!passed && (
          <button onClick={onRetry} className="mt-4 px-6 py-3 bg-red-500 text-white rounded-xl font-semibold flex items-center gap-2 mx-auto hover:bg-red-600 transition-colors">
            <RotateCcw className="w-4 h-4" /> Try Again
          </button>
        )}
      </div>

      {/* Answer Review */}
      <div className="space-y-4">
        <h4 className="text-white font-bold text-lg">Review Answers</h4>
        {quiz.questions.map((q: QuizQuestion, i: number) => {
          const isCorrect = answers[i] === q.correctIndex;
          return (
            <div key={q.id} className={`p-5 rounded-2xl border ${isCorrect ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
              <div className="flex items-start gap-3 mb-3">
                {isCorrect ? <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" /> : <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />}
                <p className="text-white font-medium text-sm">{q.question}</p>
              </div>
              <div className="ml-8 space-y-2">
                <p className="text-gray-400 text-xs">
                  Your answer: <span className={isCorrect ? 'text-emerald-400' : 'text-red-400'}>{q.options[answers[i]]}</span>
                </p>
                {!isCorrect && (
                  <p className="text-gray-400 text-xs">
                    Correct: <span className="text-emerald-400">{q.options[q.correctIndex]}</span>
                  </p>
                )}
                <p className="text-gray-500 text-xs italic">{q.explanation}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
