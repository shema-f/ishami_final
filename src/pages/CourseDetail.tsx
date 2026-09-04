import { useParams, Link } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, Clock, BookOpen, User, CheckCircle2, Play, FileText, Video, Zap, ClipboardCheck, Star, Lock, Download } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTranslation } from '../contexts/I18nContext';
import { useAuth } from '../contexts/AuthContext';
import { getCourseProgress, isLessonCompleted, getNextLesson } from '../lib/courseProgress';
import { useCourse } from '../hooks/useCourses';
import { CourseResourcesContent } from './CourseResources';
import AccessGate from '../components/AccessGate';

const lessonTypeIcons: Record<string, { icon: typeof FileText; color: string; label: string }> = {
  text: { icon: FileText, color: 'text-blue-400 bg-blue-500/10', label: 'Reading' },
  video: { icon: Video, color: 'text-purple-400 bg-purple-500/10', label: 'Video' },
  interactive: { icon: Zap, color: 'text-amber-400 bg-amber-500/10', label: 'Interactive' },
  quiz: { icon: ClipboardCheck, color: 'text-green-400 bg-green-500/10', label: 'Quiz' },
  assessment: { icon: Star, color: 'text-pink-400 bg-pink-500/10', label: 'Assessment' },
};

export default function CourseDetail() {
  const { courseId } = useParams();
  const { lang, t } = useTranslation();
  const { user } = useAuth();
  const { course, loading } = useCourse(courseId);
  const userId = user?.id || user?.uid || 'guest';
  const courseProgress = getCourseProgress(userId, courseId || '');
  const nextLesson = getNextLesson(userId, courseId || '');
  const [activeTab, setActiveTab] = useState<'curriculum' | 'resources'>('curriculum');

  // When navigating from one course straight to another, start on the overview tab.
  useEffect(() => {
    setActiveTab('curriculum');
  }, [courseId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-600" />
          <h2 className="text-2xl font-bold text-white mb-2">{t('course_detail.not_found_title', 'Course Not Found')}</h2>
          <p className="text-gray-400 mb-6">{t('course_detail.not_found_desc', "The course you're looking for doesn't exist.")}</p>
          <Link to="/courses" className="px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors">
            {t('course_detail.back_button', 'Back to Courses')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <AccessGate
      requiredTier="quiz"
      title={t('courses.require_quiz_access', 'Courses Require Quiz Access')}
      description={t('courses.require_quiz_access_desc', 'Upgrade to Quiz Access (1,000 RWF) to unlock all courses and lessons.')}
    >
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">{t('course_detail.back_to_courses', 'All Courses')}</span>
          </Link>
        </motion.div>

        {/* Course Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`relative rounded-3xl bg-gradient-to-br ${course.gradient} p-8 sm:p-12 mb-8 overflow-hidden`}
        >
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-6 right-6 text-[120px]">{course.icon}</div>
          </div>

          <div className="relative z-10">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-black/20 backdrop-blur-md text-white text-xs rounded-full font-semibold uppercase tracking-wider">
                {lang === 'rw' ? course.levelKiny : course.level}
              </span>
              {course.badge && (
                <span className="px-3 py-1 bg-white/20 text-white text-xs rounded-full font-semibold">
                  {course.badge}
                </span>
              )}
            </div>

            <div className="text-6xl mb-6">{course.icon}</div>

            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-[family-name:var(--font-heading)]">
              {lang === 'rw' ? course.titleKiny : course.title}
            </h1>

            <p className="text-white/80 text-lg mb-6 max-w-2xl">
              {lang === 'rw' ? course.descriptionKiny : course.description}
            </p>

            <div className="flex flex-wrap items-center gap-6 text-white/70 text-sm">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span><strong className="text-white">{course.instructor}</strong> — {course.instructorTitle}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>{course.totalLessons} lessons</span>
              </div>
            </div>

            {/* Progress */}
            <div className="mt-6 max-w-md">
              <div className="flex items-center justify-between text-xs mb-2 text-white/60">
                <span>Progress</span>
                <span className="font-medium text-white/80">{courseProgress ? `${courseProgress.percentage}%` : '0%'}</span>
              </div>
              <div className="h-2 bg-black/20 rounded-full overflow-hidden">
                <div className="h-full bg-white/80 rounded-full transition-all" style={{ width: `${courseProgress?.percentage || 0}%` }} />
              </div>
              {courseProgress && (
                <p className="text-white/50 text-xs mt-1">{courseProgress.completedLessons.length} of {course.totalLessons} lessons completed</p>
              )}
            </div>

            {/* Start / Continue Button */}
            <Link to={`/courses/${courseId}/lessons/${nextLesson}`}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-8 px-8 py-4 bg-white text-gray-900 rounded-2xl font-bold text-lg flex items-center gap-3 hover:shadow-xl transition-all duration-300 cursor-pointer inline-flex"
              >
                <Play className="w-5 h-5" />
                {courseProgress && courseProgress.completedLessons.length > 0 && courseProgress.completedLessons.length < course.totalLessons
                  ? t('course_detail.continue_course', 'Continue Course')
                  : t('course_detail.start_course', 'Start Course')
                }
              </motion.div>
            </Link>
          </div>
        </motion.div>

        {/* Tabs: Overview / Curriculum vs Resources & Downloads */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex items-center gap-1 sm:gap-2 mb-8 border-b border-white/10 overflow-x-auto"
        >
          <button
            onClick={() => setActiveTab('curriculum')}
            className={`flex items-center gap-2 px-5 sm:px-6 py-3 rounded-t-xl text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
              activeTab === 'curriculum'
                ? 'text-blue-400 border-b-2 border-blue-500 bg-blue-500/5'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            {lang === 'rw' ? 'Ibigize Isomo' : 'Curriculum'}
          </button>
          <button
            onClick={() => setActiveTab('resources')}
            className={`flex items-center gap-2 px-5 sm:px-6 py-3 rounded-t-xl text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
              activeTab === 'resources'
                ? 'text-amber-400 border-b-2 border-amber-500 bg-amber-500/5'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Download className="w-4 h-4" />
            {lang === 'rw' ? 'Ibikoresho byo Kwiga' : 'Resources & Downloads'}
          </button>
        </motion.div>

        {activeTab === 'resources' ? (
          <CourseResourcesContent courseId={course.id} embedded />
        ) : (
        <>
        {/* Curriculum */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-white mb-6 font-[family-name:var(--font-heading)]">
            {lang === 'rw' ? course.curriculum.titleKiny : course.curriculum.title}
          </h2>

          <div className="space-y-3">
            {course.curriculum.lessons.map((lesson, index) => {
              const typeInfo = lessonTypeIcons[lesson.type] || lessonTypeIcons.text;
              const TypeIcon = typeInfo.icon;

              return (
                <motion.div
                  key={lesson.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className="group"
                >
                  <Link to={`/courses/${courseId}/lessons/${lesson.id}`} className="flex items-center gap-4 p-4 sm:p-5 bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-2xl hover:bg-white/[0.08] hover:border-white/[0.15] transition-all duration-300 cursor-pointer">
                    {/* Lesson Number / Completion */}
                    <div className={`flex-shrink-0 w-10 h-10 rounded-xl border flex items-center justify-center font-bold text-sm transition-all ${
                      isLessonCompleted(userId, courseId || '', lesson.id)
                        ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
                        : 'bg-white/5 border-white/10 text-gray-500 group-hover:bg-blue-500/10 group-hover:text-blue-400 group-hover:border-blue-500/20'
                    }`}>
                      {isLessonCompleted(userId, courseId || '', lesson.id)
                        ? <CheckCircle2 className="w-5 h-5" />
                        : String(lesson.id).padStart(2, '0')
                      }
                    </div>

                    {/* Lesson Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold text-sm sm:text-base group-hover:text-blue-300 transition-colors">
                        {lang === 'rw' ? lesson.titleKiny : lesson.title}
                      </h3>
                      <p className="text-gray-500 text-xs sm:text-sm mt-0.5 line-clamp-1">
                        {lesson.description}
                      </p>
                    </div>

                    {/* Type Badge */}
                    <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${typeInfo.color}`}>
                      <TypeIcon className="w-3.5 h-3.5" />
                      <span>{typeInfo.label}</span>
                    </div>

                    {/* Duration */}
                    <div className="flex-shrink-0 text-gray-500 text-xs font-medium">
                      {lesson.duration}
                    </div>

                    {/* Status */}
                    <div className="flex-shrink-0">
                      {isLessonCompleted(userId, courseId || '', lesson.id) ? (
                        <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-white/10 flex items-center justify-center group-hover:border-blue-500/30 transition-all">
                          <Lock className="w-3 h-3 text-gray-600 group-hover:text-blue-400/50 transition-colors" />
                        </div>
                      )}
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Instructor */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 p-6 sm:p-8 bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-3xl"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-3xl">
              🏍️
            </div>
            <div>
              <h3 className="text-white font-bold text-lg font-[family-name:var(--font-heading)]">
                {course.instructor}
              </h3>
              <p className="text-gray-400 text-sm">{course.instructorTitle}</p>
              <p className="text-gray-500 text-xs mt-1">Expert in Rwanda traffic rules and road safety education</p>
            </div>
          </div>
        </motion.div>
        </>
        )}
      </div>
    </div>
    </AccessGate>
  );
}
