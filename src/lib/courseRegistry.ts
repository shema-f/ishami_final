/**
 * Course Registry
 *
 * The site ships a set of static courses (src/data/courses.ts) and lets admins
 * create additional "dynamic" courses that are stored in the database. This
 * module is the single source of truth that merges both lists so pages can
 * simply call getAllCourses() / getCourseByIdentifier().
 *
 * Dynamic courses from the API already expose `id` = their slug, so they are
 * drop-in compatible with the static Course shape.
 */
import { courses as staticCourses, type Course, type CourseLesson } from '../data/courses';
import { coursesAPI } from '../services/api';

export type { Course, CourseLesson };

/** Extra fields a lesson of a dynamic course may carry. */
export interface DynamicCourseLesson extends CourseLesson {
  body?: string;     // free-form lesson text content
  videoUrl?: string; // embed/watch URL for video lessons
}

export interface CourseRecord extends Omit<Course, 'curriculum'> {
  curriculum: {
    title: string;
    titleKiny: string;
    lessons: DynamicCourseLesson[];
  };
  isActive?: boolean;
  slug?: string;
  createdAt?: string;
}

const REMOTE_CACHE_KEY = 'ishami_remote_courses_v1';

let remoteCourses: CourseRecord[] = [];
let loaded = false;

function normalizeRemote(raw: any): CourseRecord[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((c: any) => {
      if (!c || typeof c !== 'object') return null;
      const lessons = Array.isArray(c.curriculum?.lessons) ? c.curriculum.lessons : [];
      const level = ['Beginner', 'Intermediate', 'Advanced'].includes(c.level) ? c.level : 'Beginner';
      return {
        id: String(c.id || c.slug || ''),
        slug: String(c.slug || c.id || ''),
        title: String(c.title || 'Untitled Course'),
        titleKiny: String(c.titleKiny || ''),
        description: String(c.description || ''),
        descriptionKiny: String(c.descriptionKiny || ''),
        level,
        levelKiny: String(c.levelKiny || ''),
        instructor: String(c.instructor || 'Moto Sensei'),
        instructorTitle: String(c.instructorTitle || 'Driving Expert & Instructor'),
        duration: String(c.duration || '2 hours'),
        totalLessons: Number(c.totalLessons) || lessons.length || 0,
        gradient: String(c.gradient || 'from-blue-500 via-indigo-500 to-violet-500'),
        icon: String(c.icon || '🚗'),
        badge: String(c.badge || ''),
        badgeColor: String(c.badgeColor || 'bg-blue-500'),
        curriculum: {
          title: String(c.curriculum?.title || 'Course Curriculum'),
          titleKiny: String(c.curriculum?.titleKiny || "Ibikubiyemo by'Isomo"),
          lessons: lessons.map((l: any, i: number) => ({
            id: Number(l.id) || i + 1,
            title: String(l.title || `Lesson ${i + 1}`),
            titleKiny: String(l.titleKiny || ''),
            type: String(l.type || 'text'),
            duration: String(l.duration || '15 min'),
            description: String(l.description || ''),
            body: String(l.body || ''),
            videoUrl: String(l.videoUrl || ''),
          })),
        },
        isActive: c.isActive !== false,
        createdAt: c.createdAt,
      };
    })
    .filter((c: any) => c && c.id);
}

function loadCache(): CourseRecord[] {
  try {
    const raw = localStorage.getItem(REMOTE_CACHE_KEY);
    if (!raw) return [];
    return normalizeRemote(JSON.parse(raw));
  } catch {
    return [];
  }
}

function persist(list: CourseRecord[]): void {
  try {
    localStorage.setItem(REMOTE_CACHE_KEY, JSON.stringify(list));
  } catch { /* storage may be unavailable — fine */ }
}

/** Static courses first, then dynamic DB courses (never duplicated by id). */
export function getAllCourses(): CourseRecord[] {
  const staticIds = new Set(staticCourses.map((c) => c.id));
  return [
    ...staticCourses.map((c) => c as CourseRecord),
    ...remoteCourses.filter((c) => !staticIds.has(c.id)),
  ];
}

/** Find a course by id OR slug across static + dynamic courses. */
export function getCourseByIdentifier(identifier?: string | null): CourseRecord | undefined {
  if (!identifier) return undefined;
  const id = String(identifier).trim();
  if (!id) return undefined;
  return getAllCourses().find((c) => c.id === id || c.slug === id);
}

/**
 * Make sure dynamic courses have been fetched (cache-first so a reload shows
 * content instantly, then refresh from the API in the background).
 */
export async function ensureCoursesLoaded(): Promise<CourseRecord[]> {
  if (loaded) return getAllCourses();
  if (remoteCourses.length === 0) {
    remoteCourses = loadCache();
    if (remoteCourses.length > 0) loaded = true;
  }
  try {
    const list = await coursesAPI.list();
    remoteCourses = normalizeRemote(list);
    persist(remoteCourses);
    loaded = true;
  } catch {
    loaded = true; // offline / server down — fall back to what we have
  }
  return getAllCourses();
}

/** Merge a single course back into the registry (used after admin saves). */
export function upsertRemoteCourse(course: CourseRecord): void {
  remoteCourses = [...remoteCourses.filter((c) => c.id !== course.id), course];
  persist(remoteCourses);
  loaded = true;
}

/** Remove a course from the registry (used after admin deletes). */
export function removeRemoteCourse(id: string): void {
  remoteCourses = remoteCourses.filter((c) => c.id !== id);
  persist(remoteCourses);
}

/** Forget all dynamic courses (cache invalidation after big changes). */
export function resetRemoteCourses(): void {
  remoteCourses = [];
  loaded = false;
  try {
    localStorage.removeItem(REMOTE_CACHE_KEY);
  } catch { /* ignore */ }
}
