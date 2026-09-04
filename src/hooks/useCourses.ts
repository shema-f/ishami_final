import { useEffect, useState, useCallback } from 'react';
import {
  ensureCoursesLoaded,
  getAllCourses,
  getCourseByIdentifier,
  type CourseRecord,
} from '../lib/courseRegistry';

export interface UseCoursesResult {
  courses: CourseRecord[];
  loading: boolean;
  refresh: () => Promise<void>;
}

/**
 * Loads the merged course list (static + dynamic DB courses) once and exposes
 * it as state so the registry stays in sync with React renders.
 */
export function useCourses(): UseCoursesResult {
  const [loading, setLoading] = useState(true);
  const [, setTick] = useState(0);

  const refresh = useCallback(async () => {
    setLoading(true);
    await ensureCoursesLoaded();
    setLoading(false);
    setTick((t) => t + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;
    ensureCoursesLoaded().then(() => {
      if (cancelled) return;
      setLoading(false);
      setTick((t) => t + 1);
    });
    return () => { cancelled = true; };
  }, []);

  return { courses: getAllCourses(), loading, refresh };
}

export interface UseCourseResult {
  course: CourseRecord | undefined;
  loading: boolean;
  notFound: boolean;
}

/** Look up one course (static or dynamic); resolves once the registry loads. */
export function useCourse(identifier?: string): UseCourseResult {
  const { courses, loading } = useCourses();
  const id = identifier || '';
  const course = courses.find((c) => c.id === id || c.slug === id);
  return { course, loading, notFound: !loading && !course };
}
