/**
 * Article Store — localStorage-backed persistence
 *
 * Seed articles come from the static data/articles.ts file.
 * Admin-managed articles are persisted in localStorage under the key
 * "ishami_user_articles". The public API merges both lists so the Blog
 * page always sees every published article, and the Admin page can
 * manage the full set.
 */

import { articles as seedArticles, type Article } from '../data/articles';

const STORAGE_KEY = 'ishami_user_articles';

// ---------- internal helpers ----------

function readStored(): Article[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Article[];
  } catch {
    return [];
  }
}

function writeStored(list: Article[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

// ---------- public API ----------

/**
 * Return every article the platform knows about — seed + user-created.
 * This is what the Blog page should consume.
 */
export function getAllArticles(): Article[] {
  const userArticles = readStored();
  // De-duplicate by id (user articles win over seed if ids collide)
  const userMap = new Map(userArticles.map((a) => [a.id, a]));
  const merged = seedArticles.map((a) => (userMap.get(a.id) ?? a));
  // Append any user articles whose id is not in seed
  for (const a of userArticles) {
    if (!merged.find((m) => m.id === a.id)) {
      merged.push(a);
    }
  }
  return merged;
}

/**
 * Return only user-managed articles (for the admin panel).
 * Includes both seed articles (so admin can edit/delete them)
 * and any articles the admin has created.
 */
export function getAdminArticles(): Article[] {
  const userArticles = readStored();
  // Build a map of overrides / new articles
  const userMap = new Map(userArticles.map((a) => [a.id, a]));
  // Start from seed, apply any overrides, then append truly-new articles
  const list = seedArticles.map((a) => (userMap.get(a.id) ?? a));
  for (const a of userArticles) {
    if (!list.find((m) => m.id === a.id)) {
      list.push(a);
    }
  }
  return list;
}

/**
 * Save a single article (create or update).
 * If an article with the same id exists it is replaced; otherwise it is prepended.
 */
export function saveArticle(article: Article): void {
  const list = readStored();
  const idx = list.findIndex((a) => a.id === article.id);
  if (idx >= 0) {
    list[idx] = article;
  } else {
    list.unshift(article);
  }
  writeStored(list);
}

/**
 * Delete an article by id. Only removes user-created articles;
 * seed articles cannot be deleted this way (they can be set to draft).
 */
export function deleteArticle(id: string): void {
  const list = readStored().filter((a) => a.id !== id);
  writeStored(list);
}

/**
 * Replace the entire article list (used by bulk operations).
 */
export function replaceAllArticles(list: Article[]): void {
  writeStored(list);
}
