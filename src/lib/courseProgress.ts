/**
 * ISHAMI Course Progress Store
 * Tracks lesson completion and course progress per user via localStorage.
 */

import { getAllCourses, getCourseByIdentifier } from './courseRegistry';

// ─── Types ─────────────────────────────────────────────────

export interface LessonProgress {
  courseId: string;
  lessonId: number;
  completed: boolean;
  completedAt?: string; // ISO date
  quizScore?: number;   // 0-100 for quiz/assessment lessons
  quizPassed?: boolean;
}

export interface CourseProgress {
  courseId: string;
  completedLessons: number[];
  totalLessons: number;
  percentage: number;
  startedAt?: string;
  lastAccessedAt?: string;
  certificateEarned?: boolean;
}

export interface UserCourseData {
  userId: string;
  courses: Record<string, CourseProgress>;
  updatedAt: string;
}

// ─── Storage ───────────────────────────────────────────────

const STORAGE_KEY = 'ishami_course_progress';

function getStorageKey(userId: string): string {
  return `${STORAGE_KEY}_${userId}`;
}

// ─── Read/Write ────────────────────────────────────────────

function loadUserProgress(userId: string): UserCourseData {
  try {
    const raw = localStorage.getItem(getStorageKey(userId));
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {}
  return {
    userId,
    courses: {},
    updatedAt: new Date().toISOString(),
  };
}

function saveUserProgress(data: UserCourseData): void {
  data.updatedAt = new Date().toISOString();
  localStorage.setItem(getStorageKey(data.userId), JSON.stringify(data));
}

// ─── Public API ────────────────────────────────────────────

/** Mark a lesson as completed */
export function completeLesson(
  userId: string,
  courseId: string,
  lessonId: number,
  quizScore?: number
): CourseProgress {
  const data = loadUserProgress(userId);
  const course = getCourseByIdentifier(courseId);

  if (!data.courses[courseId]) {
    data.courses[courseId] = {
      courseId,
      completedLessons: [],
      totalLessons: course?.totalLessons || 8,
      percentage: 0,
      startedAt: new Date().toISOString(),
      lastAccessedAt: new Date().toISOString(),
    };
  }

  const cp = data.courses[courseId];
  if (!cp.completedLessons.includes(lessonId)) {
    cp.completedLessons.push(lessonId);
  }
  cp.lastAccessedAt = new Date().toISOString();
  cp.percentage = Math.round((cp.completedLessons.length / cp.totalLessons) * 100);

  // Check if course is fully completed
  if (cp.completedLessons.length >= cp.totalLessons) {
    cp.certificateEarned = true;
  }

  saveUserProgress(data);
  return cp;
}

/** Get progress for a specific course */
export function getCourseProgress(userId: string, courseId: string): CourseProgress | null {
  const data = loadUserProgress(userId);
  return data.courses[courseId] || null;
}

/** Get all course progress for a user */
export function getAllCourseProgress(userId: string): Record<string, CourseProgress> {
  const data = loadUserProgress(userId);
  return data.courses;
}

/** Check if a lesson is completed */
export function isLessonCompleted(userId: string, courseId: string, lessonId: number): boolean {
  const cp = getCourseProgress(userId, courseId);
  return cp ? cp.completedLessons.includes(lessonId) : false;
}

/** Get the next incomplete lesson for a course (for "Continue" button) */
export function getNextLesson(userId: string, courseId: string): number {
  const cp = getCourseProgress(userId, courseId);
  const course = getCourseByIdentifier(courseId);
  if (!course) return 1;

  if (!cp || cp.completedLessons.length === 0) return 1;

  for (let i = 1; i <= course.totalLessons; i++) {
    if (!cp.completedLessons.includes(i)) return i;
  }
  return 1; // All done, start from beginning
}

/** Get summary stats for all courses */
export function getProgressSummary(userId: string): {
  totalCourses: number;
  startedCourses: number;
  completedCourses: number;
  totalLessonsCompleted: number;
  overallPercentage: number;
  inProgressCourses: { courseId: string; title: string; icon: string; percentage: number; nextLesson: number; gradient: string }[];
} {
  const allProgress = getAllCourseProgress(userId);
  let totalLessonsCompleted = 0;
  let totalLessons = 0;
  let startedCourses = 0;
  let completedCourses = 0;
  const inProgressCourses: any[] = [];

  getAllCourses().forEach(course => {
    const cp = allProgress[course.id];
    totalLessons += course.totalLessons;
    if (cp) {
      totalLessonsCompleted += cp.completedLessons.length;
      if (cp.completedLessons.length > 0) startedCourses++;
      if (cp.completedLessons.length >= course.totalLessons) {
        completedCourses++;
      } else {
        inProgressCourses.push({
          courseId: course.id,
          title: course.title,
          icon: course.icon,
          percentage: cp.percentage,
          nextLesson: getNextLesson(userId, course.id),
          gradient: course.gradient,
        });
      }
    }
  });

  return {
    totalCourses: getAllCourses().length,
    startedCourses,
    completedCourses,
    totalLessonsCompleted,
    overallPercentage: totalLessons > 0 ? Math.round((totalLessonsCompleted / totalLessons) * 100) : 0,
    inProgressCourses: inProgressCourses.sort((a, b) => b.percentage - a.percentage),
  };
}

/** Reset progress for a course */
export function resetCourseProgress(userId: string, courseId: string): void {
  const data = loadUserProgress(userId);
  delete data.courses[courseId];
  saveUserProgress(data);
}

/** Reset all progress */
export function resetAllProgress(userId: string): void {
  const data = loadUserProgress(userId);
  data.courses = {};
  saveUserProgress(data);
}
