/**
 * Certificate Gate
 *
 * A certificate may only be viewed / downloaded once the learner has finished
 * EVERY quiz available on the platform and their average (best attempt per
 * quiz) is at least 60%. Everything else shows "first finish all quizzes".
 *
 * Quiz completion history is tracked client-side in localStorage under
 * 'quizHistory' (see pages/Quiz.tsx). The set of "all quizzes" mirrors the
 * /quiz listing: PDF quiz bundles plus DB quizzes, de-duplicated by title.
 */
import { quizAPI, pdfQuizAPI, certificatesAPI } from '../services/api';

export const PROGRAM_QUIZ_TITLE = 'Traffic Rules & Road Safety';

export interface QuizHistoryEntry {
  id: string;
  quizTitle: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  completedAt: string;
  passed: boolean;
}

export const CERT_MIN_AVERAGE = 60;
const TITLES_CACHE_KEY = 'ishami_certificate_quiz_titles';

/** Read the quiz attempt history from localStorage (may be empty). */
export function loadQuizHistory(): QuizHistoryEntry[] {
  try {
    const raw = localStorage.getItem('quizHistory');
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** Fetch the exact quiz set shown on the /quiz page (PDF bundles + DB quizzes, de-duped by title). */
export async function fetchRequiredQuizTitles(): Promise<string[]> {
  const fallback = getCachedQuizTitles();
  try {
    const [quizRes, pdfRes] = await Promise.allSettled([
      quizAPI.listQuizzes(),
      pdfQuizAPI.listBundles('rw'),
    ]);
    const dbTitles: string[] = quizRes.status === 'fulfilled' && Array.isArray(quizRes.value.quizzes)
      ? quizRes.value.quizzes.map((q: any) => String(q.title || '').trim()).filter(Boolean)
      : [];
    const pdfTitles: string[] = pdfRes.status === 'fulfilled' && Array.isArray(pdfRes.value.bundles)
      ? pdfRes.value.bundles.map((b: any) => String(b.title || '').trim()).filter(Boolean)
      : [];
    const titles = [...new Set([...pdfTitles, ...dbTitles])];
    if (titles.length > 0) {
      try { localStorage.setItem(TITLES_CACHE_KEY, JSON.stringify(titles)); } catch {}
      return titles;
    }
    return fallback;
  } catch {
    return fallback;
  }
}

/** Cache used by the certificate page when the API is unreachable. */
export function cacheQuizTitles(titles: string[]): void {
  if (!titles || titles.length === 0) return;
  try { localStorage.setItem(TITLES_CACHE_KEY, JSON.stringify([...new Set(titles)])); } catch {}
}

function getCachedQuizTitles(): string[] {
  try {
    const raw = localStorage.getItem(TITLES_CACHE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map((t: any) => String(t)) : [];
  } catch {
    return [];
  }
}

export interface CertificateEligibility {
  total: number;          // number of quizzes required
  finished: number;       // quizzes with at least one completed attempt
  average: number;        // average of best-per-quiz percentages (0 if none)
  missing: string[];      // quizzes that have not been finished yet
  finishedAll: boolean;   // every required quiz has an attempt
  eligible: boolean;      // finishedAll && average >= 60
}

/**
 * Compute certificate eligibility from the required quiz titles + attempt
 * history. Uses the BEST percentage per quiz title for the average.
 */
export function computeEligibility(requiredTitles: string[], history: QuizHistoryEntry[]): CertificateEligibility {
  const bestByTitle: Record<string, number> = {};
  for (const entry of history) {
    const title = String(entry.quizTitle || '').trim();
    if (!title) continue;
    const pct = typeof entry.percentage === 'number' ? entry.percentage
      : (entry.score && entry.totalQuestions ? Math.round((entry.score / entry.totalQuestions) * 100) : 0);
    if (bestByTitle[title] === undefined || pct > bestByTitle[title]) {
      bestByTitle[title] = pct;
    }
  }

  const missing = requiredTitles.filter((title) => bestByTitle[title] === undefined);
  const finished = requiredTitles.length - missing.length;
  const scores = requiredTitles
    .filter((title) => bestByTitle[title] !== undefined)
    .map((title) => bestByTitle[title]);
  const average = scores.length > 0
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : 0;
  const finishedAll = requiredTitles.length > 0 && missing.length === 0;
  const eligible = finishedAll && average >= CERT_MIN_AVERAGE;

  return { total: requiredTitles.length, finished, average, missing, finishedAll, eligible };
}

/** Async wrapper: fetch required quizzes, then evaluate eligibility. */
export async function evaluateCertificateEligibility(): Promise<CertificateEligibility> {
  const titles = await fetchRequiredQuizTitles();
  return computeEligibility(titles, loadQuizHistory());
}

/**
 * Issue the program certificate (all quizzes finished, avg ≥60%). Stores it in
 * localStorage under 'latestCertificate' (same key the /certificate page reads)
 * and, when online, persists it on the server so it can be publicly verified.
 *
 * The certificate represents the whole quiz program, so its score is the
 * learner's average across every quiz (score out of 100).
 */
export async function issueProgramCertificate(opts: {
  userId: string;
  username?: string;
  average: number;
  quizTitle?: string;
}): Promise<void> {
  const average = Math.max(0, Math.min(100, Math.round(opts.average)));
  const quizTitle = opts.quizTitle || PROGRAM_QUIZ_TITLE;
  let certNo = `ISH-TRU-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}`;
  let issuedISO = new Date().toISOString();
  try {
    const res = await certificatesAPI.generate({
      score: average,
      totalQuestions: 100,
      quizTitle,
    });
    if (res?.certificate?.certificateNo) {
      certNo = res.certificate.certificateNo;
      issuedISO = res.certificate.issuedAt || issuedISO;
    }
  } catch { /* offline — keep the local certificate */ }
  const expiryDate = new Date(new Date(issuedISO).getTime());
  expiryDate.setFullYear(expiryDate.getFullYear() + 1);
  try {
    localStorage.setItem('latestCertificate', JSON.stringify({
      userId: opts.userId,
      username: opts.username || 'ISHAMI Learner',
      score: average,
      totalQuestions: 100,
      quizTitle,
      issuedAt: new Date(issuedISO).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      expiresAt: expiryDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      certificateNo: certNo,
      passed: true,
      programAverage: average,
    }));
  } catch {}
}
