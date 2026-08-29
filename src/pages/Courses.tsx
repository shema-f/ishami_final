import { motion } from 'motion/react';
import { Link } from 'react-router';
import { Clock, BookOpen, User, ChevronRight, Filter, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { courses, type Course } from '../data/courses';
import { useTranslation } from '../contexts/I18nContext';
import { useAuth } from '../contexts/AuthContext';
import { getCourseProgress } from '../lib/courseProgress';

const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'] as const;

export default function Courses() {
  const { lang } = useTranslation();
  const { user } = useAuth();
  const userId = user?.id || user?.uid || 'guest';
  const [filter, setFilter] = useState<'All' | 'Beginner' | 'Intermediate' | 'Advanced'>('All');

  const filtered = filter === 'All' ? courses : courses.filter(c => c.level === filter);

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl mb-6 shadow-lg shadow-blue-500/30">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-[family-name:var(--font-heading)]">
            {lang === 'rw' ? 'Amasomero' : 'Courses'}
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            {lang === 'rw'
              ? 'Menya ubushobozi bwo kubaga mu Rwanda mu buryo bw\'isoro. Amasomero yakozwe n\'Moto Sensei.'
              : 'Master Rwanda road rules with structured courses designed by Moto Sensei. From beginner to advanced.'}
          </p>
        </motion.div>

        {/* Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {levels.map((level) => (
            <motion.button
              key={level}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(level)}
              className={`px-6 py-3 rounded-xl transition-all duration-300 font-medium flex items-center gap-2 ${
                filter === level
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-white/5 backdrop-blur-xl text-gray-300 border border-white/10 hover:border-blue-500/30 hover:text-white hover:bg-white/10'
              }`}
            >
              <Filter className="w-4 h-4" />
              {level === 'All' ? (lang === 'rw' ? 'Byose' : 'All') : level}
            </motion.button>
          ))}
        </motion.div>

        {/* Course Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((course, index) => (
            <CourseCard key={course.id} course={course} index={index} lang={lang} userId={userId} />
          ))}
        </div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <p className="text-gray-400">No courses found for this filter.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function CourseCard({ course, index, lang, userId }: { course: Course; index: number; lang: string; userId: string }) {
  const cp = getCourseProgress(userId, course.id);
  const pct = cp?.percentage || 0;
  const completed = cp?.completedLessons.length || 0;
  const isComplete = completed >= course.totalLessons;
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <Link to={`/courses/${course.id}`} className="block group h-full">
        <div className="relative bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-3xl overflow-hidden hover:bg-white/[0.08] hover:border-white/[0.15] transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl hover:shadow-blue-500/10 h-full flex flex-col">
          {/* Course Image Area */}
          <div className={`relative h-48 bg-gradient-to-br ${course.gradient} flex items-center justify-center overflow-hidden`}>
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 right-4 text-8xl">{course.icon}</div>
              <div className="absolute bottom-4 left-4 text-6xl opacity-50">{course.icon}</div>
            </div>

            {/* Level Badge */}
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 bg-black/30 backdrop-blur-md text-white text-xs rounded-full font-semibold uppercase tracking-wider">
                {lang === 'rw' ? course.levelKiny : course.level}
              </span>
            </div>

            {/* Badge */}
            {course.badge && (
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 ${course.badgeColor} text-white text-xs rounded-full font-semibold`}>
                  {course.badge}
                </span>
              </div>
            )}

            {/* Large Icon */}
            <div className="text-7xl group-hover:scale-110 transition-transform duration-500">
              {course.icon}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 flex-1 flex flex-col">
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-300 transition-colors font-[family-name:var(--font-heading)]">
              {lang === 'rw' ? course.titleKiny : course.title}
            </h3>
            <p className="text-gray-400 text-sm mb-4 flex-1 line-clamp-2">
              {lang === 'rw' ? course.descriptionKiny : course.description}
            </p>

            {/* Meta */}
            <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
              <div className="flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                <span>{course.instructor}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" />
                <span>{course.totalLessons} lessons</span>
              </div>
            </div>

            {/* Progress */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-gray-500">Progress</span>
                <span className={`font-medium ${isComplete ? 'text-emerald-400' : pct > 0 ? 'text-blue-400' : 'text-gray-400'}`}>
                  {isComplete ? '✓ Complete' : `${pct}%`}
                </span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all ${isComplete ? 'bg-emerald-500' : 'bg-gradient-to-r from-blue-500 to-blue-600'}`} style={{ width: `${pct}%` }} />
              </div>
            </div>

            {/* Start / Continue Button */}
            <div className={`w-full py-3 rounded-xl bg-gradient-to-r ${course.gradient} text-white text-center font-semibold flex items-center justify-center gap-2 opacity-90 group-hover:opacity-100 group-hover:shadow-lg transition-all duration-300`}>
              {isComplete ? (
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Completed</span>
              ) : completed > 0 ? (
                <span>{lang === 'rw' ? 'Komeza' : 'Continue'}</span>
              ) : (
                <span>{lang === 'rw' ? 'Tangira Isomoro' : 'Start Course'}</span>
              )}
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
