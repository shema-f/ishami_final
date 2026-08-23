import mongoose from "mongoose";
import { detectLanguage, dominantLanguage } from "../ai/languageDetector.js";
import { classifyIntent } from "../ai/intentClassifier.js";
import { isTrafficRelated, isBeginner, isUnsafeRequest, isEmergencyBrake, getOffTopicResponse } from "../ai/trafficGuard.js";
import { retrieveKnowledge, ensurePdfLoaded, getKnowledgeStats, simulatorEventToKnowledge } from "../ai/knowledgeRetriever.js";
import { buildPrompt, buildFallbackResponse, buildExamPrompt, buildSimulatorPrompt } from "../ai/promptBuilder.js";
import { validateResponse } from "../ai/responseValidator.js";
import { generateResponse, getProviderInfo, getOllamaModels } from "../ai/ollamaClient.js";
import { webSearch, isWebSearchConfigured, getSearchInfo } from "../ai/webSearch.js";
import { conversationMemory } from "../ai/conversationMemory.js";
import { AIInteraction } from "../models/AIInteraction.js";

const EXACT_CACHE = new Map();
const SEMANTIC_CACHE = [];
const MAX_SEMANTIC = 200;

// Greetings/thanks must NEVER be redirected as off-topic. Covers both languages.
const GREETING_GUARD_RE = /^(hello|hi|hey|mwaramutse|mwiriwe|muraho|murakaza|murabeho|murakoze|urakoze|ndagushima|how are you|bite|salut|bonjour|yo|sup|thank|thanks|thx|ty|good (morning|afternoon|evening)|umuntu|ubwenge|uname|your name|who are you|ni nde|ni iki)\b/i;

const GREETING_WORDS = new Set([
  "hello", "hi", "hey", "yo", "sup", "howdy", "muraho", "mwaramutse", "mwiriwe", "murakaza",
  "murabeho", "salut", "bonjour", "good", "morning", "afternoon", "evening", "how", "are", "you",
  "murakoze", "urakoze", "ndagushima", "thank", "thanks", "thx", "ty", "cyane", "neza", "bite",
  "merci", "moto", "sensei"
]);

function isPureGreeting(query) {
  const words = String(query || "").toLowerCase().replace(/[^a-zà-ÿ\s]/gi, " ").split(/\s+/).filter(Boolean);
  if (!words.length || words.length > 6) return false;
  if (!GREETING_WORDS.has(words[0])) return false;
  return words.every(w => GREETING_WORDS.has(w));
}

// Questions about fines/penalties/amounts are NOT covered by the offline
// knowledge base (accuracy rule: never invent fines). These trigger a web search.
const WEB_TRIGGER_RE = /\b(fine|fines|amande|amandes|penalty|penalties|punish|punishment|sanction|fee|fees|rwf|franc|francs|how much|igiciro|ibarura|ibarurwa|guhanwa|icyubahiro cy'amafaranga)\b/i;

async function runWebAugmentation({ queryRaw, retrieved, isAmbiguousQuestion }) {
  const finesLike = WEB_TRIGGER_RE.test(queryRaw);
  // Fines/penalty questions ALWAYS deserve a web search (the offline KB has no
  // fine amounts) — even when retrieval looks ambiguous. Ambiguity only blocks
  // searching for genuinely vague questions.
  const shouldSearch = (finesLike || retrieved.confidence !== "high") && !(isAmbiguousQuestion && !finesLike);
  if (!shouldSearch || !isWebSearchConfigured()) {
    return { knowledge: retrieved.context, webSources: [], webResults: [], webSearched: false };
  }
  const rwHint = /(rwanda|kigali|mu rwanda)/i.test(queryRaw) ? "" : " Rwanda";
  const topicHint = finesLike ? " traffic fines penalties" : " traffic law rules";
  let results = [];
  try {
    results = await webSearch(`${queryRaw}${rwHint}${topicHint}`, { maxResults: 5 });
  } catch (e) {
    console.warn("[AI] Web search failed:", e?.message);
  }
  if (!results.length) return { knowledge: retrieved.context, webSources: [], webResults: [], webSearched: false };
  const webContext = results.map((r, i) => `[WEB ${i + 1}] ${r.title} — ${r.url}\n${r.snippet}`).join("\n\n");
  const knowledge = retrieved.context + `\n\n=== WEB SEARCH RESULTS (external sources — verify before quoting as law) ===\n${webContext}`;
  const webSources = results.map(r => ({ type: "web", id: r.url || r.title, title: r.title, confidence: "medium" }));
  console.log(`[AI] Web search: ${results.length} results`);
  return { knowledge, webSources, webResults: results, webSearched: true };
}

// Style raw web results as a readable answer — used when every AI model is
// unreachable but the search still returned results.
function buildWebFallbackAnswer(results, lang, queryRaw) {
  const items = results.slice(0, 5).map((r, i) =>
    `${i + 1}. ${r.title || "Web result"}\n   ${(r.snippet || "").slice(0, 220)}\n   ${r.url || ""}`
  ).join("\n\n");
  const intro = lang === "rw"
    ? `Nta moteri ya AI yabonetse ubu, ariko nabonye ibisubizo kuri interineti. Dore ibyo nabonye ku kibazo cyawe: "${String(queryRaw).slice(0, 120)}":`
    : `I couldn't reach the AI engine right now, but I found these answers online for "${String(queryRaw).slice(0, 120)}":`;
  const footer = lang === "rw"
    ? "\n\nIbyandikishijwe bituruka kuri interineti — bishobora gukenera gusuzumwa n'umuyobozi w'umuhanda w'u Rwanda. #GerayoAmahoro"
    : "\n\nThese come from web sources — please verify them with an official Rwanda traffic authority. #GerayoAmahoro";
  return intro + "\n\n" + items + footer;
}

// When every model provider failed, still try to answer from web search results
// (searching now if we didn't already), then fall back to the static message.
async function buildFallbackValidated({ queryRaw, lang, retrieved, priorWebResults, priorWebSources }) {
  if (priorWebResults.length) {
    return {
      validated: { answer: buildWebFallbackAnswer(priorWebResults, lang, queryRaw), warnings: ["provider_fallback", "web_fallback_answer"], confidence: "medium" },
      webSources: priorWebSources,
      usedWeb: true
    };
  }
  if (isWebSearchConfigured()) {
    let lazy = [];
    try {
      lazy = await webSearch(`${queryRaw} Rwanda traffic`, { maxResults: 5 });
    } catch (e) {
      console.warn("[AI] Lazy web search failed:", e?.message);
    }
    if (lazy.length) {
      const webSources = lazy.map(r => ({ type: "web", id: r.url || r.title, title: r.title, confidence: "medium" }));
      return {
        validated: { answer: buildWebFallbackAnswer(lazy, lang, queryRaw), warnings: ["provider_fallback", "web_fallback_answer"], confidence: "medium" },
        webSources,
        usedWeb: true
      };
    }
  }
  const reason = retrieved.confidence === "high" ? "model_unavailable" : "no_knowledge";
  return {
    validated: { answer: buildFallbackResponse({ lang, reason }), warnings: ["provider_fallback"], confidence: retrieved.confidence === "high" ? "medium" : "low" },
    webSources: [],
    usedWeb: false
  };
}

function buildGreetingResponse(queryRaw, lang, intent, sentiment) {
  const isThanks = intent === "thanks" || /(murakoze|urakoze|ndagushima|thank|thanks|thx|merci)/i.test(queryRaw);
  const text = isThanks
    ? (lang === "rw"
        ? "Urakoze cyane! Ndi hano igihe cyose ukeneye ubufasha ku mategeko y'umuhanda, ibyapa, cyangwa amahugurwa y'ikizamini. #GerayoAmahoro"
        : "You're welcome! I'm here whenever you need help with Rwanda traffic rules, road signs, or exam practice. #GerayoAmahoro")
    : (lang === "rw"
        ? "Muraho! Ndi Moto-Sensei, umwarimu wawe w'amategeko y'umuhanda mu Rwanda. Nshobora kugusobanurira ibyapa, amategeko, umutekano, cyangwa guhugura ikizamini. Mbaze iki? #GerayoAmahoro"
        : "Hello! I'm Moto-Sensei, your Rwanda traffic rules instructor. I can explain road signs, rules, safety, or run exam practice. What would you like to learn? #GerayoAmahoro");
  return {
    text: applySentimentNudge(text, sentiment, lang),
    structured: {
      language: lang, intent: isThanks ? "thanks" : "greeting", topic: "conversation",
      answer: text, confidence: "high", sources: [], warnings: [], retrievedCount: 0, topScore: 1
    }
  };
}

// Bump when the prompt/persona/knowledge pipeline changes so stale cached
// answers (generated with an older system prompt) are never served again.
const CACHE_VERSION = "v7"; // v7: don't discard real answers on low KB confidence; fines always search web
const cacheKey = q => `${CACHE_VERSION}:${String(q || "").toLowerCase().trim()}`;

function tokenize(s) {
  return String(s || "").toLowerCase().replace(/[^\w\s'-]/g, " ").split(/\s+/).filter(Boolean);
}

function jaccard(a, b) {
  const sa = new Set(a);
  const sb = new Set(b);
  let inter = 0;
  for (const t of sa) if (sb.has(t)) inter++;
  const uni = sa.size + sb.size - inter;
  return uni === 0 ? 0 : inter / uni;
}

function checkCache(query) {
  const key = cacheKey(query);
  if (EXACT_CACHE.has(key)) {
    return { hit: true, mode: "exact_memory", item: EXACT_CACHE.get(key) };
  }
  const tokens = tokenize(query);
  for (const s of SEMANTIC_CACHE) {
    if (jaccard(tokens, s.tokens) >= 0.85 && s.intent && s.language) {
      return { hit: true, mode: "semantic_memory", item: s.response };
    }
  }
  return { hit: false };
}

function writeCache(query, response, meta) {
  const key = cacheKey(query);
  if (key.length >= 4 && key.length < 200) {
    EXACT_CACHE.set(key, response);
    if (EXACT_CACHE.size > 500) {
      const k = EXACT_CACHE.keys().next().value;
      EXACT_CACHE.delete(k);
    }
    SEMANTIC_CACHE.unshift({ tokens: tokenize(query), response, intent: meta?.intent, language: meta?.language });
    if (SEMANTIC_CACHE.length > MAX_SEMANTIC) SEMANTIC_CACHE.pop();
  }
}

async function checkMongoCache(query) {
  try {
    if (mongoose.connection.readyState !== 1) return null;
    const cached = await AIInteraction.findOne({
      prompt: cacheKey(query),
      structured: { $exists: true }
    }).lean();
    // Never serve a cached fallback ("AI engine unavailable") answer: a
    // failed model call previously saved its fallback text to the cache and
    // poisoned every later request for the same question.
    if (cached && cached.structured?.answer && !(cached.structured.warnings || []).includes("provider_fallback")) {
      return { hit: true, mode: "mongo_exact", structured: cached.structured, raw: cached.response };
    }
  } catch {}
  return null;
}

async function mongoCacheSave(query, response, structured, userId, sentiment, isPro) {
  try {
    if (mongoose.connection.readyState !== 1) return;
    await AIInteraction.create({
      userId: userId || undefined,
      prompt: cacheKey(query),
      promptRaw: query,
      response,
      sentiment,
      isPro: !!isPro,
      structured
    });
  } catch (e) {
    console.warn("[Cache] mongo save failed:", e?.message);
  }
}

function applySentimentNudge(text, sentiment, lang) {
  if (!sentiment || sentiment === "neutral") return text;
  if (lang === "rw") {
    if (sentiment === "angry") return "Wihangane, mwene wacu. Ndumva ko bibabaje. " + text;
    if (sentiment === "happy") return "Nibyo rwose! Ishami rishimiye intambwe uteye. " + text;
    if (sentiment === "sad") return "Humura, turi kumwe ku rugendo rwo kwiga. " + text;
    if (sentiment === "saluting") return "Ndi neza kugushira urugendo rwanyu! " + text;
  } else {
    if (sentiment === "angry") return "No worries — let me help calmly. " + text;
    if (sentiment === "happy") return "Great energy! Here's what you need to know. " + text;
    if (sentiment === "sad") return "Take your time — I'll explain it simply. " + text;
    if (sentiment === "saluting") return "Hi there! Let's get you on the road to mastering Rwanda traffic rules. " + text;
  }
  return text;
}

function extractSection(text, label) {
  if (!text) return null;
  const patterns = [
    new RegExp(`(?:^|\\n)\\s*${label}\\s*[:：]?\\s*([\\s\\S]*?)(?=(?:\\n\\s*(?:ANSWER|EXPLANATION|EXAMPLE|SAFETY|REMEMBER)\\s*[:：])|$)`, "i"),
    new RegExp(`(?:^|\\n)\\s*${label}\\s*[:：]\\s*([^\\n]*(?:\\n(?![A-Z]{2,}\\s*[:：])[^\\n]*)*)`, "i")
  ];
  for (const re of patterns) {
    const m = text.match(re);
    if (m && m[1]) return m[1].trim().replace(/^\s+|\s+$/g, "");
  }
  return null;
}

function makeStructuredAnswer(validated, meta) {
  const rawAnswer = String(validated.answer || "");
  const base = {
    language: meta.language,
    intent: meta.intent,
    topic: meta.topic,
    answer: rawAnswer,
    explanation: null,
    example: null,
    safety_note: null,
    confidence: validated.confidence,
    sources: meta.sources || [],
    warnings: validated.warnings || [],
    retrievedCount: meta.retrievedCount || 0,
    topScore: meta.topScore || 0
  };
  const sections = {
    explanation: extractSection(rawAnswer, "EXPLANATION"),
    example: extractSection(rawAnswer, "EXAMPLE"),
    safety_note: extractSection(rawAnswer, "SAFETY")
  };
  const directAnswer = extractSection(rawAnswer, "ANSWER");
  const remember = extractSection(rawAnswer, "REMEMBER");
  if (sections.explanation) base.explanation = sections.explanation;
  if (sections.example) base.example = sections.example;
  if (sections.safety_note) base.safety_note = sections.safety_note;
  if (directAnswer) base.direct = directAnswer;
  if (remember) base.memory_tip = remember;
  if (!base.explanation || !base.example || !base.safety_note) {
    const lines = rawAnswer.split(/\n{2,}/).map(s => s.trim()).filter(Boolean);
    if (!base.explanation && lines.length >= 2) base.explanation = lines.slice(1, 3).join("\n\n");
    for (const line of lines) {
      const l = line.toLowerCase();
      if (!base.example && (l.startsWith("exampl") || l.startsWith("uruger") || l.includes("for example") || l.includes("nk'urugero"))) base.example = line;
      if (!base.safety_note && (l.includes("warning") || l.includes("⚠") || l.includes("safety") || l.includes("umutekano") || l.startsWith("note") || l.startsWith("n.b") || l.includes("#gerayo"))) base.safety_note = line;
    }
  }
  return base;
}

export { getKnowledgeStats, getProviderInfo, getOllamaModels, getSearchInfo };

export async function askAssistant(prompt, userName = "Mugenzi", sentiment = "neutral", history = [], userId = null, isPro = false) {
  const queryRaw = String(prompt || "").trim();
  const query = queryRaw.toLowerCase();

  if (!query) {
    return { text: "Murakaza neza! Hamanage icyo ukeneye kubaza ku mategeko y'umuhanda, ibyapa, cyangwa uburyo bwo gutwara. #GerayoAmahoro", structured: null };
  }

  const mongoCache = await checkMongoCache(query);
  if (mongoCache?.hit) {
    console.log(`[AI] Cache HIT ${mongoCache.mode}`);
    return { text: mongoCache.raw || mongoCache.structured.answer, structured: mongoCache.structured };
  }
  const memCache = checkCache(query);
  if (memCache.hit) {
    console.log(`[AI] Cache HIT ${memCache.mode}`);
    return { text: memCache.item, structured: null };
  }

  const langResult = detectLanguage(queryRaw);
  const lang = langResult.language;
  console.log(`[AI] Language: ${lang} (rw=${langResult.rwScore} en=${langResult.enScore} mixed=${langResult.mixed} conf=${langResult.confidence})`);

  const guard = isTrafficRelated(queryRaw);
  if (!guard.isTraffic && !isBeginner(queryRaw) && guard.score < 0.2 && !GREETING_GUARD_RE.test(queryRaw)) {
    console.log(`[AI] Guard OFF-TOPIC score=${guard.score}`);
    const off = getOffTopicResponse(lang);
    return { text: applySentimentNudge(off, sentiment, lang), structured: { language: lang, intent: "off_topic", topic: "conversation", answer: off, confidence: "high", sources: [], warnings: ["off_topic_redirect"] } };
  }
  console.log(`[AI] Guard PASS score=${guard.score} reason=${guard.reason}`);

  const unsafe = isUnsafeRequest(queryRaw);
  const brakeEm = isEmergencyBrake(queryRaw);
  if (brakeEm) {
    const out = buildFallbackResponse({ lang, reason: "unsafe" });
    const s = makeStructuredAnswer({ answer: out, warnings: ["emergency_brake_failure"], confidence: "high" }, { language: lang, intent: "safety_emergency", topic: "road_safety", sources: [], topScore: 1, retrievedCount: 0 });
    return { text: applySentimentNudge(out, sentiment, lang), structured: s };
  }

  const intentResult = classifyIntent(queryRaw, lang);
  console.log(`[AI] Intent: ${intentResult.intent} topic=${intentResult.topic} conf=${intentResult.confidence} score=${intentResult.score}`);

  // Instant greeting/thanks — no model call, no tokens, always answered even
  // if every provider is down. Only fires for actual greeting phrases (never
  // for real questions that merely contain a word like "great" in "greater").
  if (isPureGreeting(queryRaw) || intentResult.intent === "greeting") {
    console.log(`[AI] Greeting short-circuit lang=${lang} intent=${intentResult.intent}`);
    return buildGreetingResponse(queryRaw, lang, intentResult.intent, sentiment);
  }

  await ensurePdfLoaded();
  const mem = userId ? conversationMemory.getState(userId) : null;
  const beginner = isBeginner(queryRaw) || !!mem?.userAppearsBeginner;
  const retrieved = retrieveKnowledge({ text: queryRaw, intentResult, langResult, topK: 6, maxChars: 5500 });
  console.log(`[AI] Retrieved: ${retrieved.retrievedCount} docs. Top score=${retrieved.topScore} KBconf=${retrieved.confidence}`);

  const isAmbiguousQuestion =
    retrieved.confidence === "low" &&
    (retrieved.topic === "general" || retrieved.retrievedCount === 0 || retrieved.topScore < 0.2) &&
    !GREETING_GUARD_RE.test(queryRaw) &&
    intentResult.intent !== "thanks" && intentResult.intent !== "greeting";

  // Web augmentation: search the web for things the offline KB can't answer
  // (fines/penalties/amounts) or when retrieval confidence is low.
  const webAug = await runWebAugmentation({ queryRaw, retrieved, isAmbiguousQuestion });

  const { systemInstruction, userContent } = buildPrompt({
    userPrompt: queryRaw + (isAmbiguousQuestion && !webAug.webSearched ? " [NOTE TO ASSISTANT: retrieval confidence is LOW and topic is ambiguous. If you cannot be confident, ask the learner for clarification about which road sign/intersection/maneuver they mean instead of guessing.]" : ""),
    lang,
    intent: intentResult.intent,
    topic: retrieved.topic,
    knowledge: webAug.knowledge,
    history,
    userName,
    isBeginner: beginner,
    confidence: retrieved.confidence,
    webSearched: webAug.webSearched
  });

  let rawResponse = "";
  let providerFellBack = false;
  try {
    rawResponse = await generateResponse(systemInstruction, userContent);
    console.log("[AI] Response generated, len=", rawResponse.length);
  } catch (e) {
    console.error("[AI] Model call FAILED:", e?.message || e);
    providerFellBack = true;
  }

  let validated;
  if (!providerFellBack && rawResponse && rawResponse.trim().length > 10) {
    validated = validateResponse({
      rawResponse,
      lang,
      intent: intentResult.intent,
      topic: retrieved.topic,
      knowledgeConfidence: retrieved.confidence,
      sources: retrieved.sources,
      userPrompt: queryRaw
    });
  } else {
    const fb = await buildFallbackValidated({ queryRaw, lang, retrieved, priorWebResults: webAug.webResults, priorWebSources: webAug.webSources });
    validated = fb.validated;
    if (fb.usedWeb) {
      webAug.webSources = [...webAug.webSources, ...fb.webSources];
      webAug.webSearched = true;
    }
  }

  // Only replace with "please clarify" when the model produced NO usable
  // answer. Never discard a real model answer just because the offline KB was
  // thin — validateResponse already adds the honest "not verified" disclaimer.
  const modelProducedNothing = providerFellBack || !rawResponse || rawResponse.trim().length < 40;
  if (isAmbiguousQuestion && validated.confidence === "low" && modelProducedNothing) {
    validated.answer = buildFallbackResponse({ lang, reason: "ambiguous_clarify" });
    validated.confidence = "medium";
    validated.warnings = [...(validated.warnings || []), "ambiguous_clarification_requested"];
  }

  // Web results ground the answer — don't call it low-confidence.
  if (webAug.webSearched && validated.confidence === "low") validated.confidence = "medium";

  if (unsafe) {
    validated.answer = buildFallbackResponse({ lang, reason: "unsafe" });
    validated.confidence = "high";
    validated.warnings = validated.warnings || [];
    validated.warnings.push("unsafe_request_sanitized");
  }

  validated.answer = applySentimentNudge(validated.answer, sentiment, lang);

  const structured = makeStructuredAnswer(validated, {
    language: lang,
    intent: intentResult.intent,
    topic: retrieved.topic,
    sources: [...retrieved.sources, ...webAug.webSources],
    retrievedCount: retrieved.retrievedCount + webAug.webSources.length,
    topScore: retrieved.topScore
  });
  if (webAug.webSearched) {
    structured.warnings = structured.warnings || [];
    if (!structured.warnings.includes("web_search_used")) structured.warnings.push("web_search_used");
  }

  console.log(`[AI] Final: confidence=${structured.confidence} sources=${structured.sources.length} warnings=${structured.warnings?.length || 0}`);

  // Don't cache fallback responses: if the model was unavailable, the next
  // request must retry the model instead of replaying the "engine unavailable"
  // message. Also don't cache web-augmented answers — live web content goes stale.
  const cacheable = !(structured.warnings || []).includes("provider_fallback") && !webAug.webSearched;
  if (cacheable) {
    writeCache(query, structured.answer, { intent: intentResult.intent, language: lang });
    await mongoCacheSave(queryRaw, structured.answer, structured, userId, sentiment, isPro);
  }

  if (userId) {
    conversationMemory.push(userId, { role: "user", content: queryRaw });
    conversationMemory.push(userId, { role: "model", content: structured.answer });
  }

  return {
    text: structured.answer,
    structured
  };
}

export async function askAssistantStream(prompt, userName = "Mugenzi", sentiment = "neutral", history = [], userId = null, isPro = false, { onChunk, signal } = {}) {
  const queryRaw = String(prompt || "").trim();
  const query = queryRaw.toLowerCase();

  if (!query) {
    const t = "Murakaza neza! Hamanage icyo ukeneye kubaza ku mategeko y'umuhanda, ibyapa, cyangwa uburyo bwo gutwara. #GerayoAmahoro";
    if (typeof onChunk === "function") onChunk(t, { meta: { phase: "done" } });
    return { text: t, structured: null };
  }

  const mongoCache = await checkMongoCache(query);
  if (mongoCache?.hit) {
    console.log(`[AI] Stream Cache HIT ${mongoCache.mode}`);
    const t = mongoCache.raw || mongoCache.structured.answer;
    if (typeof onChunk === "function") onChunk(t, { meta: { phase: "cached" } });
    return { text: t, structured: mongoCache.structured };
  }
  const memCache = checkCache(query);
  if (memCache.hit) {
    console.log(`[AI] Stream Cache HIT ${memCache.mode}`);
    const t = memCache.item;
    if (typeof onChunk === "function") onChunk(t, { meta: { phase: "cached" } });
    return { text: t, structured: null };
  }

  const langResult = detectLanguage(queryRaw);
  const lang = langResult.language;
  console.log(`[AI] Stream Language: ${lang} (rw=${langResult.rwScore} en=${langResult.enScore} mixed=${langResult.mixed})`);

  const guard = isTrafficRelated(queryRaw);
  if (!guard.isTraffic && !isBeginner(queryRaw) && guard.score < 0.2 && !GREETING_GUARD_RE.test(queryRaw)) {
    const off = getOffTopicResponse(lang);
    if (typeof onChunk === "function") onChunk(off, { meta: { phase: "done" } });
    return {
      text: applySentimentNudge(off, sentiment, lang),
      structured: { language: lang, intent: "off_topic", topic: "conversation", answer: off, confidence: "high", sources: [], warnings: ["off_topic_redirect"] }
    };
  }

  const unsafe = isUnsafeRequest(queryRaw);
  const brakeEm = isEmergencyBrake(queryRaw);
  if (brakeEm) {
    const out = buildFallbackResponse({ lang, reason: "unsafe" });
    if (typeof onChunk === "function") onChunk(out, { meta: { phase: "done" } });
    const s = makeStructuredAnswer({ answer: out, warnings: ["emergency_brake_failure"], confidence: "high" }, { language: lang, intent: "safety_emergency", topic: "road_safety", sources: [], topScore: 1, retrievedCount: 0 });
    return { text: applySentimentNudge(out, sentiment, lang), structured: s };
  }

  const intentResult = classifyIntent(queryRaw, lang);
  console.log(`[AI] Stream Intent: ${intentResult.intent} topic=${intentResult.topic}`);

  // Instant greeting/thanks — no model call, always answered. Only fires for
  // actual greeting phrases, never for real questions.
  if (isPureGreeting(queryRaw) || intentResult.intent === "greeting") {
    const g = buildGreetingResponse(queryRaw, lang, intentResult.intent, sentiment);
    if (typeof onChunk === "function") onChunk(g.text, { meta: { phase: "done", structured: g.structured } });
    console.log(`[AI] Stream Greeting short-circuit lang=${lang} intent=${intentResult.intent}`);
    return g;
  }

  await ensurePdfLoaded();
  const mem = userId ? conversationMemory.getState(userId) : null;
  const beginner = isBeginner(queryRaw) || !!mem?.userAppearsBeginner;
  const retrieved = retrieveKnowledge({ text: queryRaw, intentResult, langResult, topK: 6, maxChars: 5500 });
  console.log(`[AI] Stream Retrieved: ${retrieved.retrievedCount} docs. Top score=${retrieved.topScore} KBconf=${retrieved.confidence}`);

  const isAmbiguousQuestion =
    retrieved.confidence === "low" &&
    (retrieved.topic === "general" || retrieved.retrievedCount === 0 || retrieved.topScore < 0.2) &&
    !GREETING_GUARD_RE.test(queryRaw) &&
    intentResult.intent !== "thanks" && intentResult.intent !== "greeting";

  // Web augmentation: search the web for things the offline KB can't answer
  // (fines/penalties/amounts) or when retrieval confidence is low.
  const webAug = await runWebAugmentation({ queryRaw, retrieved, isAmbiguousQuestion });

  const { systemInstruction, userContent } = buildPrompt({
    userPrompt: queryRaw + (isAmbiguousQuestion && !webAug.webSearched ? " [NOTE TO ASSISTANT: retrieval confidence is LOW and topic is ambiguous. If you cannot be confident, ask the learner for clarification about which road sign/intersection/maneuver they mean instead of guessing.]" : ""),
    lang,
    intent: intentResult.intent,
    topic: retrieved.topic,
    knowledge: webAug.knowledge,
    history,
    userName,
    isBeginner: beginner,
    confidence: retrieved.confidence,
    webSearched: webAug.webSearched
  });

  let rawResponse = "";
  let providerFellBack = false;
  try {
    rawResponse = await generateResponse(systemInstruction, userContent, {
      stream: true,
      onChunk: (chunk, meta) => { if (typeof onChunk === "function") onChunk(chunk, { meta: { phase: "token", ...(meta || {}) } }); },
      signal
    });
    console.log("[AI] Stream Response generated, len=", rawResponse.length);
  } catch (e) {
    console.error("[AI] Stream Model call FAILED:", e?.message || e);
    providerFellBack = true;
  }

  let validated;
  if (!providerFellBack && rawResponse && rawResponse.trim().length > 10) {
    validated = validateResponse({
      rawResponse,
      lang,
      intent: intentResult.intent,
      topic: retrieved.topic,
      knowledgeConfidence: retrieved.confidence,
      sources: retrieved.sources,
      userPrompt: queryRaw
    });
  } else {
    const fb = await buildFallbackValidated({ queryRaw, lang, retrieved, priorWebResults: webAug.webResults, priorWebSources: webAug.webSources });
    validated = fb.validated;
    if (fb.usedWeb) {
      webAug.webSources = [...webAug.webSources, ...fb.webSources];
      webAug.webSearched = true;
    }
  }

  // Only replace with "please clarify" when the model produced NO usable
  // answer. Never discard a real model answer just because the offline KB was
  // thin — validateResponse already adds the honest "not verified" disclaimer.
  const modelProducedNothing = providerFellBack || !rawResponse || rawResponse.trim().length < 40;
  if (isAmbiguousQuestion && validated.confidence === "low" && modelProducedNothing) {
    validated.answer = buildFallbackResponse({ lang, reason: "ambiguous_clarify" });
    validated.confidence = "medium";
    validated.warnings = [...(validated.warnings || []), "ambiguous_clarification_requested"];
  }

  // Web results ground the answer — don't call it low-confidence.
  if (webAug.webSearched && validated.confidence === "low") validated.confidence = "medium";

  if (unsafe) {
    validated.answer = buildFallbackResponse({ lang, reason: "unsafe" });
    validated.confidence = "high";
    validated.warnings = validated.warnings || [];
    validated.warnings.push("unsafe_request_sanitized");
  }

  validated.answer = applySentimentNudge(validated.answer, sentiment, lang);

  const structured = makeStructuredAnswer(validated, {
    language: lang,
    intent: intentResult.intent,
    topic: retrieved.topic,
    sources: [...retrieved.sources, ...webAug.webSources],
    retrievedCount: retrieved.retrievedCount + webAug.webSources.length,
    topScore: retrieved.topScore
  });
  if (webAug.webSearched) {
    structured.warnings = structured.warnings || [];
    if (!structured.warnings.includes("web_search_used")) structured.warnings.push("web_search_used");
  }

  console.log(`[AI] Stream Final: confidence=${structured.confidence} sources=${structured.sources.length} warnings=${structured.warnings?.length || 0}`);

  if (providerFellBack && typeof onChunk === "function") {
    onChunk(validated.answer, { meta: { phase: "fallback" } });
  }
  if (typeof onChunk === "function") onChunk("", { meta: { phase: "done", structured } });

  // Don't cache fallback responses: if the model was unavailable, the next
  // request must retry the model instead of replaying the "engine unavailable"
  // message. Also don't cache web-augmented answers — live web content goes stale.
  const cacheable = !(structured.warnings || []).includes("provider_fallback") && !webAug.webSearched;
  if (cacheable) {
    writeCache(query, structured.answer, { intent: intentResult.intent, language: lang });
    await mongoCacheSave(queryRaw, structured.answer, structured, userId, sentiment, isPro);
  }

  if (userId) {
    conversationMemory.push(userId, { role: "user", content: queryRaw });
    conversationMemory.push(userId, { role: "model", content: structured.answer });
  }

  return { text: structured.answer, structured };
}

export async function handleSimulatorEvent({ event, context = {}, userId = null, userName = "Mugenzi" }) {
  if (!event) throw new Error("simulator event required");
  const lang = context.language || "rw";
  const ev = String(event).toUpperCase().trim();
  console.log(`[AI] Simulator event: ${ev} lang=${lang}`);

  const retrieved = simulatorEventToKnowledge(ev, context);
  const { systemInstruction, userContent } = buildSimulatorPrompt({ event: ev, context, lang, knowledge: retrieved.context });

  let rawResponse = "";
  try {
    rawResponse = await generateResponse(systemInstruction, userContent);
  } catch (e) {
    console.warn("[AI] Simulator model failed, fallback", e?.message);
    rawResponse = retrieved.fallback;
  }
  const validated = validateResponse({
    rawResponse: rawResponse || retrieved.fallback,
    lang,
    intent: "scenario",
    topic: retrieved.topic,
    knowledgeConfidence: retrieved.confidence,
    sources: retrieved.sources,
    userPrompt: `SIMULATOR_EVENT:${ev}`
  });
  const structured = makeStructuredAnswer(validated, {
    language: lang,
    intent: "scenario",
    topic: retrieved.topic,
    sources: retrieved.sources,
    retrievedCount: retrieved.retrievedCount,
    topScore: retrieved.topScore
  });
  structured.simulatorEvent = ev;
  if (userId) {
    conversationMemory.push(userId, { role: "system", content: `[SIMULATOR] ${ev} ${JSON.stringify(context || {})}` });
    conversationMemory.push(userId, { role: "model", content: structured.answer });
  }
  return { text: structured.answer, structured, event: ev };
}

export async function buildExamQuiz({ topic = null, count = 5, lang = "en", difficulty = "intermediate" } = {}) {
  const n = Math.max(1, Math.min(30, Number(count) || 5));
  // Note: data files export objects ({ ibisobanuro: [...], ibyapa: [...] }), not raw arrays.
  const DEFS = ((await import("../definations.js").catch(() => ({ default: {} }))).default || {}).ibisobanuro || [];
  const SIGNS = ((await import("../roadsigns.js").catch(() => ({ default: {} }))).default || {}).ibyapa || [];
  const SPEEDS = (await import("../speedlimits.js").catch(() => ({ default: [] }))).default || [];
  const Q = (await import("../evaluation_questions.js").catch(() => ({ default: [] }))).default || [];
  const questions = [];
  for (const def of DEFS) {
    if (questions.length >= n) break;
    if (!def.ijambo || !def.ibisobanuro) continue;
    const term = String(def.ijambo);
    const text = lang === "rw"
      ? `Ni iyihe ivyerekeza neza ku "` + term + `"?`
      : `Which of the following best matches the term "${term}" in Rwanda traffic?`;
    const correct = String(def.ibisobanuro || "").slice(0, 200);
    const wrongs = DEFS.filter(d => d !== def && d.ibisobanuro).slice(0, 3).map(d => String(d.ibisobanuro || "").slice(0, 200)).filter(Boolean);
    if (!correct || wrongs.length < 2) continue;
    const opts = [correct, ...wrongs].sort(() => Math.random() - 0.5);
    const correctIdx = opts.indexOf(correct);
    questions.push({
      id: "def_" + term.replace(/\W+/g, "_").slice(0, 40),
      type: "mcq",
      topic: "definitions",
      difficulty: difficulty,
      language: lang,
      question: text,
      options: opts,
      correctIndex: correctIdx,
      explanation: correct,
      source: { type: "definition", id: term, confidence: "high" }
    });
  }
  for (const sign of SIGNS) {
    if (questions.length >= n) break;
    if (!sign.code || !sign.icyo_gisobanura) continue;
    const text = lang === "rw"
      ? `Ni iki icyapa cya ${sign.code || sign.izina} gisobanura?`
      : `What does road sign ${sign.code || sign.izina} mean?`;
    const correct = String(sign.icyo_gisobanura || "");
    const wrongs = SIGNS.filter(s => s !== sign && s.icyo_gisobanura).slice(0, 3).map(s => String(s.icyo_gisobanura || "")).filter(Boolean);
    if (correct.length < 10 || wrongs.length < 2) continue;
    const opts = [correct, ...wrongs].sort(() => Math.random() - 0.5);
    questions.push({
      id: "sign_" + sign.code.replace(/\W+/g, "_"),
      type: "mcq",
      topic: "road_signs",
      difficulty: difficulty,
      language: lang,
      question: text,
      options: opts,
      correctIndex: opts.indexOf(correct),
      explanation: correct,
      source: { type: "road_sign", id: sign.code, confidence: "high" }
    });
  }
  const result = {
    language: lang,
    topic: topic || "mixed",
    count: questions.length,
    countRequested: n,
    difficulty,
    questions,
    summary: {
      definitions: questions.filter(q => q.topic === "definitions").length,
      roadSigns: questions.filter(q => q.topic === "road_signs").length
    }
  };
  return result;
}

export function scoreExamSubmission(quiz, submissions) {
  const out = { correct: 0, incorrect: 0, total: quiz.questions.length, scorePct: 0, weakTopics: {}, explanations: [] };
  for (let i = 0; i < quiz.questions.length; i++) {
    const q = quiz.questions[i];
    const userAns = submissions?.[i]?.selectedIndex;
    const isCorrect = Number(userAns) === Number(q.correctIndex);
    if (isCorrect) out.correct++;
    else {
      out.incorrect++;
      out.weakTopics[q.topic] = (out.weakTopics[q.topic] || 0) + 1;
    }
    out.explanations.push({
      id: q.id,
      correct: isCorrect,
      userAnswer: userAns,
      correctAnswer: q.correctIndex,
      explanation: q.explanation,
      question: q.question
    });
  }
  out.scorePct = out.total ? Math.round((out.correct / out.total) * 100) : 0;
  const weakList = Object.entries(out.weakTopics).sort((a, b) => b[1] - a[1]);
  out.recommendNextTopics = weakList.slice(0, 3).map(([t]) => t);
  return out;
}
