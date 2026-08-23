import dotenv from "dotenv";
import fs from "fs";
import path from "path";
try {
  const ep = path.resolve(process.cwd(), "server", ".env");
  if (fs.existsSync(ep)) dotenv.config({ path: ep });
  else dotenv.config();
} catch {}

const EXA_KEY = process.env.EXA_API_KEY || "";
const BRAVE_KEY = process.env.BRAVE_API_KEY || "";
const SERPER_KEY = process.env.SERPER_API_KEY || "";
const SEARCH_PROVIDER = (process.env.SEARCH_PROVIDER || "serper").toLowerCase();

export function isWebSearchConfigured() {
  return !!(EXA_KEY || BRAVE_KEY || SERPER_KEY);
}

export function getSearchInfo() {
  return {
    provider: SEARCH_PROVIDER,
    available: isWebSearchConfigured(),
    exa: { available: !!EXA_KEY },
    brave: { available: !!BRAVE_KEY },
    serper: { available: !!SERPER_KEY }
  };
}

/**
 * Search the web for current information (e.g. fines, penalties, recent rules)
 * that the offline knowledge base cannot answer. Returns a normalized list of
 * { title, url, snippet }. Returns [] gracefully when no API key is set.
 */
export async function webSearch(query, { maxResults = 5, timeoutMs = 15000 } = {}) {
  const q = String(query || "").trim();
  if (!q || !isWebSearchConfigured()) return [];
  if (SEARCH_PROVIDER === "serper" && SERPER_KEY) return searchSerper(q, maxResults, timeoutMs);
  if (SEARCH_PROVIDER === "exa" && EXA_KEY) return searchExa(q, maxResults, timeoutMs);
  if (SEARCH_PROVIDER === "brave" && BRAVE_KEY) return searchBrave(q, maxResults, timeoutMs);
  if (SERPER_KEY) return searchSerper(q, maxResults, timeoutMs);
  if (EXA_KEY) return searchExa(q, maxResults, timeoutMs);
  if (BRAVE_KEY) return searchBrave(q, maxResults, timeoutMs);
  return [];
}

async function searchSerper(query, maxResults, timeoutMs) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const r = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-API-KEY": SERPER_KEY },
      body: JSON.stringify({ q: query, num: maxResults }),
      signal: ctrl.signal
    });
    if (!r.ok) throw new Error(`Serper HTTP ${r.status}`);
    const j = await r.json();
    return (j.organic || [])
      .map(x => ({ title: x.title || "", url: x.link || "", snippet: x.snippet || "" }))
      .filter(x => x.title || x.snippet);
  } finally {
    clearTimeout(timer);
  }
}

async function searchExa(query, maxResults, timeoutMs) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const r = await fetch("https://api.exa.ai/search", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${EXA_KEY}` },
      body: JSON.stringify({ query, type: "auto", numResults: maxResults, contents: { highlights: true } }),
      signal: ctrl.signal
    });
    if (!r.ok) throw new Error(`Exa HTTP ${r.status}`);
    const j = await r.json();
    return (j.results || [])
      .map(x => ({
        title: x.title || "",
        url: x.url || "",
        snippet: Array.isArray(x.highlights) ? x.highlights.slice(0, 3).join(" ") : (x.text || "")
      }))
      .filter(x => x.title || x.snippet);
  } finally {
    clearTimeout(timer);
  }
}

async function searchBrave(query, maxResults, timeoutMs) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const r = await fetch(`https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=${maxResults}`, {
      headers: { "Accept": "application/json", "X-Subscription-Token": BRAVE_KEY },
      signal: ctrl.signal
    });
    if (!r.ok) throw new Error(`Brave HTTP ${r.status}`);
    const j = await r.json();
    return (j.web?.results || [])
      .map(x => ({ title: x.title || "", url: x.url || "", snippet: x.description || "" }))
      .filter(x => x.title || x.snippet);
  } finally {
    clearTimeout(timer);
  }
}
