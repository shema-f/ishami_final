import Fuse from "fuse.js";
import definitionsData from "../definations.js";
import roadSignsData from "../roadsigns.js";
import speedLimitsData from "../speedlimits.js";
import evaluationQuestionsData from "../evaluation_questions.js";
import * as quizSource from "../data.js";
import { classifyIntent } from "./intentClassifier.js";
import { detectLanguage } from "./languageDetector.js";

let pdfContext = "";
let isPdfLoaded = false;

export const KNOWLEDGE_STATS = {
  definitions: 0,
  road_signs: 0,
  speed_limits: 0,
  quiz_questions: 0,
  pdf_chunks: 0,
  sources: ["definitions.js", "roadsigns.js", "speedlimits.js", "data.js", "PDF uploads/"]
};

function collectAllQuizQuestions() {
  const out = [];
  for (const [k, v] of Object.entries(quizSource)) {
    if (k.startsWith("__")) continue;
    let arr = [];
    if (Array.isArray(v)) arr = v;
    else if (v && Array.isArray(v.questions)) arr = v.questions;
    if (Array.isArray(arr)) {
      for (const q of arr) {
        if (q && q.question) {
          // Include both Kinyarwanda and English versions
          out.push({
            bundle: k,
            question: q.question,
            questionEn: q.questionEn || '',
            options: Array.isArray(q.options) ? q.options : [],
            optionsEn: Array.isArray(q.optionsEn) ? q.optionsEn : [],
            correctAnswer: q.correctAnswer || null,
            correctAnswerEn: q.correctAnswerEn || null,
            image: q.imagePlaceholder || q.imageUrl || null,
            lang: 'rw'
          });
          // Add English version as separate entry for search
          if (q.questionEn) {
            out.push({
              bundle: k,
              question: q.questionEn,
              options: Array.isArray(q.optionsEn) && q.optionsEn.length > 0 ? q.optionsEn.map(o => typeof o === 'string' ? o : o.text) : (Array.isArray(q.options) ? q.options : []),
              correctAnswer: q.correctAnswerEn || q.correctAnswer || null,
              image: q.imagePlaceholder || q.imageUrl || null,
              lang: 'en'
            });
          }
        }
      }
    }
  }
  return out;
}

const DEFINITIONS = Array.isArray(definitionsData?.ibisobanuro) ? definitionsData.ibisobanuro : [];
const ROAD_SIGNS = Array.isArray(roadSignsData?.ibyapa) ? roadSignsData.ibyapa : [];
const SPEED_LIMITS = speedLimitsData?.umuvuduko_ntarengwa || { mu_nsisiro: [], ahataratuye: [], amategeko_yinyongera: [] };
const QUIZ_QUESTIONS = collectAllQuizQuestions();

KNOWLEDGE_STATS.definitions = DEFINITIONS.length;
KNOWLEDGE_STATS.road_signs = ROAD_SIGNS.length;
KNOWLEDGE_STATS.speed_limits =
  (SPEED_LIMITS.mu_nsisiro?.length || 0) +
  (SPEED_LIMITS.ahataratuye?.length || 0) +
  (SPEED_LIMITS.amategeko_yinyongera?.length || 0);
KNOWLEDGE_STATS.quiz_questions = QUIZ_QUESTIONS.length;

const SEARCH_STOPWORDS = new Set([
  // English function words
  "what", "does", "do", "the", "a", "an", "and", "of", "to", "in", "for", "is", "are", "am", "be",
  "me", "my", "i", "you", "your", "how", "why", "when", "where", "which", "who", "whom", "whose",
  "this", "that", "these", "those", "it", "its", "on", "at", "with", "from", "by", "or", "not",
  "no", "as", "if", "can", "could", "should", "would", "will", "shall", "may", "might", "must",
  "please", "about", "explain", "tell", "meaning", "rules", "rule", "means", "have", "has", "had",
  "there", "here", "than", "then", "them", "they", "was", "were", "been", "being", "into", "onto",
  "out", "up", "down", "over", "under", "again", "further", "once", "only", "own", "same", "so",
  "some", "such", "too", "very", "just", "also", "etc", "question", "questions", "please", "well",
  "know", "want", "need", "like", "make", "get", "go", "come", "see", "look", "way", "case",
  // Kinyarwanda function words
  "ni", "na", "ya", "ku", "mu", "cya", "cyo", "bya", "byo", "no", "nko", "nk", "kuri", "iyo",
  "uwo", "uyu", "iki", "ibi", "aho", "hari", "niba", "uretse", "kandi", "cyangwa", "bose", "zose",
  "kugira", "kuko", "ngo", "uko", "gusa", "cyane", "neza", "nyuma", "mbere", "imbere", "inyuma",
  "umwe", "bamwe", "umuntu", "abantu", "iyi", "iri", "ari", "ariyo", "niyo", "iryo", "urwo", "ubwo",
  "muri", "kuri", "kuma", "gusa", "kubw", "kubwa", "kubwo", "nka", "nko", "cyose", "byose",
  "gutwara", "twara", "gutwara", "kwiga", "kugenda", "gukora", "gusobanura", "sobanura", "sobanurira"
]);

function tokenizeForSearch(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^\w\s'-]/g, " ")
    .split(/\s+/)
    .filter(t => t.length >= 3 && !SEARCH_STOPWORDS.has(t))
    .slice(0, 14);
}

// Fuse treats the whole query as ONE fuzzy pattern, so long multi-word queries
// (e.g. the expanded RAG query) score below threshold and return zero hits.
// Search token-by-token, keep the best (lowest) Fuse score per item and count
// how many distinct tokens matched that item.
function multiTokenSearch(fuse, text, limit) {
  const tokens = tokenizeForSearch(text);
  if (!tokens.length) return [];
  const best = new Map(); // item -> { score, count }
  for (const t of tokens) {
    const hits = fuse.search(t);
    for (const h of hits) {
      const prev = best.get(h.item);
      if (!prev) best.set(h.item, { score: h.score, count: 1 });
      else if (h.score < prev.score) prev.score = h.score;
      else prev.count += 1; // matched by a different token
    }
  }
  // Precision guard: a source must be supported by at least 2 distinct query
  // tokens that both match reasonably well, OR one very strong match
  // (sim >= 0.75). This stops obscure hallucination-bait questions from
  // latching onto a single lucky token (or two coincidental weak ones).
  return Array.from(best.entries())
    .filter(([, v]) => (v.count >= 2 && v.score <= 0.45) || v.score <= 0.25)
    .sort((a, b) => a[1].score - b[1].score)
    .slice(0, limit)
    .map(([item, v]) => ({ item, score: v.score }));
}

let fuseDef, fuseSigns, fuseQuiz;

function initFuse() {
  if (fuseDef && fuseSigns && fuseQuiz) return;
  fuseDef = new Fuse(DEFINITIONS, {
    keys: [{ name: "ijambo", weight: 0.6 }, { name: "ibisobanuro", weight: 0.4 }],
    threshold: 0.4,
    includeScore: true
  });
  fuseSigns = new Fuse(ROAD_SIGNS, {
    keys: [{ name: "izina", weight: 0.4 }, { name: "code", weight: 0.3 }, { name: "icyo_gisobanura", weight: 0.3 }],
    threshold: 0.4,
    includeScore: true
  });
  fuseQuiz = new Fuse(QUIZ_QUESTIONS, {
    keys: [{ name: "question", weight: 0.7 }, { name: "correctAnswer", weight: 0.3 }],
    threshold: 0.45,
    includeScore: true
  });
}

export async function ensurePdfLoaded(forceReload = false) {
  if (isPdfLoaded && !forceReload) return true;
  try {
    const fs = await import("fs");
    const path = await import("path");
    const pdfMod = await import("pdf-parse");
    const { createRequire } = await import("module");
    const require = createRequire(import.meta.url);
    const { PDFParse } = require("pdf-parse");
    const uploadsDir = path.resolve(process.cwd(), "server", "uploads");
    if (!fs.existsSync(uploadsDir)) return false;
    const files = fs.readdirSync(uploadsDir).filter(f => f.toLowerCase().endsWith(".pdf"));
    let combined = "";
    for (const file of files) {
      const fp = path.join(uploadsDir, file);
      try {
        const buf = fs.readFileSync(fp);
        const parser = new PDFParse({ data: buf, verbosity: -1 });
        const result = await parser.getText();
        let txt = result.text || "";
        txt = txt
          .replace(/\u00A0/g, " ")
          .replace(/\u00AD/g, "")
          .replace(/[^\S\r\n]+/g, " ")
          .replace(/[\u0000-\u001F\u007F]/g, c => (c === "\n" || c === "\t" ? c : " "))
          .replace(/-\s*\n\s*/g, "")
          .replace(/\n{3,}/g, "\n\n");
        const clean = txt.substring(0, 60000);
        combined += `\n\n[SOURCE:PDF:${file}]\n${clean}`;
        console.log(`[Knowledge] PDF loaded: ${file}`);
      } catch (err) {
        console.error(`[Knowledge] PDF fail ${file}:`, err?.message);
      }
    }
    pdfContext = combined;
    KNOWLEDGE_STATS.pdf_chunks = combined ? 1 : 0;
    isPdfLoaded = true;
    return true;
  } catch (err) {
    console.error("[Knowledge] PDF load error:", err?.message);
    return false;
  }
}

function searchPdf(query, limitChars = 3000) {
  if (!pdfContext) return [];
  const q = String(query).toLowerCase();
  const tokens = q.split(/\s+/).filter(w => w.length > 2);
  if (!tokens.length) return [];
  const paragraphs = pdfContext.split(/\n+/).filter(p => p.length > 30 && p.length < 3000);
  const scored = paragraphs.map(p => {
    const pl = p.toLowerCase();
    let s = 0;
    for (const t of tokens) {
      if (pl.includes(t)) s += 2;
      else if (t.length > 4 && pl.includes(t.slice(0, Math.floor(t.length * 0.7)))) s += 0.5;
    }
    return { text: p, score: s };
  }).filter(x => x.score > 0).sort((a, b) => b.score - a.score);
  const out = [];
  let len = 0;
  for (const p of scored) {
    if (len + p.text.length > limitChars) break;
    out.push(p);
    len += p.text.length;
  }
  return out;
}

function expandQuery(query) {
  const lower = String(query).toLowerCase();
  const out = new Set([lower]);
  const SYNS = {
    guhagarara: ["hagarara", "stop", "icyapa cyo guhagarara", "guhagarika"],
    umuvuduko: ["vitesse", "speed", "kirometero", "km/h"],
    anyuranaho: ["gusonga", "gucaho", "gusiganwa", "overtake", "nyuranaho"],
    icyapa: ["ibyapa", "ikimenyetso", "sign", "road sign", "ikimenyetso cy'umuhanda"],
    gari: ["modoka", "kinyabiziga", "car", "vehicle"],
    rond: ["rond-point", "roundabout", "akaronda karimba"],
    feri: ["brake", "guhagarika umwanya"],
    ivugapfe: ["gear", "engrenage"],
    embrayage: ["clutch"],
    permi: ["license", "licence", "igenzo"],
    ikizamini: ["exam", "test", "provisoire", "amahugurwa"],
    impanuka: ["accident", "collision", "crash"],
    umutekano: ["safety", "secure"],
    give: ["give way", "yield", "kureka", "tanga inzira", "gutambuka mbere"],
    yield: ["give way", "kureka abandi", "tanga inzira", "gutambuka mbere"],
    right: ["right of way", "uburenganzira", "kugenda mbere", "gutambuka mbere", "tanga inzira", "priority", "kureka abandi bakabanza"],
    priority: ["right of way", "uburenganzira", "kugenda mbere", "gutambuka mbere", "tanga inzira", "kureka abandi bakabanza"],
    overtak: ["overtake", "overtaking", "kunyuranaho", "kwanyuranaho", "gusonga", "gucaho"],
    pedestrian: ["pedestrians", "abanyamaguru", "zebra crossing", "inyambukiro"]
  };
  for (const [k, arr] of Object.entries(SYNS)) {
    if (lower.includes(k)) {
      out.add(k);
      for (const s of arr) out.add(s);
    }
    for (const s of arr) {
      if (lower.includes(s)) {
        out.add(k);
        for (const ss of arr) out.add(ss);
      }
    }
  }
  return Array.from(out);
}

export function retrieveKnowledge({ text, intentResult = null, langResult = null, topK = 5, maxChars = 6000 }) {
  initFuse();
  const lang = langResult?.language || detectLanguage(text).language;
  const intent = intentResult || classifyIntent(text, lang);
  const topic = intent.topic || "general";
  const queryText = text;
  const expanded = expandQuery(queryText).join(" ");
  const queryFinal = expanded.length > queryText.length ? expanded : queryText;

  const sources = [];
  const defHits = multiTokenSearch(fuseDef, queryFinal, topK).map(r => ({
    type: "definition",
    id: r.item.ingingo || r.item.ijambo,
    score: +(1 - r.score).toFixed(2),
    title: r.item.ijambo,
    content: `[${r.item.ingingo || ""}] ${r.item.ijambo}: ${r.item.ibisobanuro}`,
    page: r.item.urupapuro || null
  }));
  for (const d of defHits) sources.push(d);

  const signHits = multiTokenSearch(fuseSigns, queryFinal, topK).map(r => ({
    type: "road_sign",
    id: r.item.code || r.item.izina,
    score: +(1 - r.score).toFixed(2),
    title: `${r.item.izina} (${r.item.code})`,
    content: `[Road Sign ${r.item.code || ""}] ${r.item.izina}: ${r.item.icyo_gisobanura}. Ubwoko: ${r.item.uburyo || ""}. Isusho: ${r.item.ishusho || ""}`,
    page: r.item.urupapuro || null
  }));
  for (const s of signHits) sources.push(s);

  if (topic === "speed_limits" || /speed|umuvuduko|vitesse|km\/h|km\/isaha|kirometero/i.test(queryFinal)) {
    for (const item of SPEED_LIMITS.mu_nsisiro || []) {
      sources.push({
        type: "speed_limit",
        id: "speed_builtup_" + (item.ingingo || Math.random()),
        score: 1,
        title: `Mu nsisiro: ${item.umuvuduko}`,
        content: `[${item.ingingo || ""}] Mu nsisiro (built-up area): ${item.ubwoko_bwikinyabiziga} → ${item.umuvuduko}.`,
        page: item.urupapuro || null
      });
    }
    for (const item of SPEED_LIMITS.ahataratuye || []) {
      sources.push({
        type: "speed_limit",
        id: "speed_rural_" + (item.ingingo || Math.random()),
        score: 1,
        title: `Ahataratuye: ${item.umuvuduko}`,
        content: `[${item.ingingo || ""}] Ahataratuye (rural/open road): ${item.ubwoko_bwikinyabiziga} → ${item.umuvuduko}.`,
        page: item.urupapuro || null
      });
    }
    for (const item of SPEED_LIMITS.amategeko_yinyongera || []) {
      sources.push({
        type: "speed_limit",
        id: "speed_extra_" + (item.ingingo || Math.random()),
        score: 0.9,
        title: "Amategeko y'inyongera",
        content: `[${item.ingingo || ""}] ${item.amategeko}`,
        page: item.urupapuro || null
      });
    }
  }

  const quizHits = multiTokenSearch(fuseQuiz, queryFinal, 3).map(r => ({
    type: "exam_question",
    id: r.item.bundle + ":" + (r.item.question?.slice(0, 40) || ""),
    score: +(1 - r.score).toFixed(2),
    title: "Ibibazo by'ikizamini",
    content: `[Quiz Q] ${r.item.question} Amahitamo: ${Array.isArray(r.item.options) ? r.item.options.join(" | ") : ""}. Igisubizo cy'ukuri: ${r.item.correctAnswer || ""}`,
    image: r.item.image || null
  }));
  for (const q of quizHits) sources.push(q);

  if (isPdfLoaded) {
    const pdfHits = searchPdf(queryFinal, 2500).map((p, i) => ({
      type: "pdf_document",
      id: "pdf_" + i,
      score: +Math.min(1, p.score / 4).toFixed(2),
      title: "PDF Amategeko y'Umuhanda",
      content: p.text
    }));
    for (const p of pdfHits) sources.push(p);
  }

  sources.sort((a, b) => b.score - a.score);

  let contextBuild = [];
  let chars = 0;
  const used = [];
  for (const s of sources) {
    if (chars + (s.content?.length || 0) > maxChars) break;
    contextBuild.push(s.content);
    used.push({ type: s.type, id: s.id, confidence: s.score >= 0.7 ? "high" : s.score >= 0.4 ? "medium" : "low" });
    chars += s.content?.length || 0;
  }

  const bestScore = sources[0]?.score || 0;
  const overallConfidence = bestScore >= 0.7 ? "high" : bestScore >= 0.3 ? "medium" : "low";

  return {
    context: contextBuild.join("\n\n"),
    sources: used,
    topScore: +bestScore.toFixed(2),
    retrievedCount: used.length,
    confidence: overallConfidence,
    topic,
    lang,
    intent: intent.intent
  };
}

export function getKnowledgeStats() {
  return { ...KNOWLEDGE_STATS, isPdfLoaded };
}

const SIMULATOR_EVENT_MAP = {
  PLAYER_APPROACHED_STOP_SIGN: {
    topic: "road_signs",
    query: "STOP sign guhagarara isaniya",
    signCode: "B.20",
    fallback_en: "You must come to a complete STOP. Check all directions, then proceed only when it is safe and clear.",
    fallback_rw: "Ushobora guhagarara neza cyose. Guteza ibyo bigenda ku buryo bwose, nanone ugenda gusa igiho biri kiza."
  },
  PLAYER_FAILED_TO_SIGNAL: {
    topic: "vehicle_controls",
    query: "indicator guhindura icyerekezo ikimenyetso",
    fallback_en: "Use your indicator / turn signal BEFORE changing direction or lane so other road users can anticipate your move.",
    fallback_rw: "Koresha ikimenyetso cyo guhindura icyerekezo MBERE yo guhindura icyerekezo cyangwa umurongo, kugira ngo abandi bakoresha umuhanda bamenye icyo uguje kugira."
  },
  PLAYER_EXCEEDED_SPEED: {
    topic: "speed_limits",
    query: "speed limit umuvuduko ntarengwa mu nsisiro ahataratuye",
    fallback_en: "Respect speed limits. Built-up area (mu nsisiro): usually 50 km/h for light vehicles. Rural road (ahataratuye): up to 80 km/h. Reduce speed in rain, schools, and villages.",
    fallback_rw: "Kurikira imvuduko ntarengwa. Mu nsisiro: 50 km/h. Ahataratuye: 80 km/h. Hejuru imvuduko mu mvura, amashuri, n'imisozi."
  },
  PLAYER_PARKED_INCORRECTLY: {
    topic: "parking_stopping",
    query: "parking gupaka no stopping nta gupaka",
    fallback_en: "Check for no-stopping and no-parking signs. Do not park on junctions, pedestrian crossings, curves, or in the middle of the road. Use parallel/reverse parking where appropriate.",
    fallback_rw: "Reba ibyapa bidatuma guhagarara cyangwa gupaka. Ntugupake ku nsangano n'inkomane, aho abanyamaguru banyurwamo, ku ngiro, cyangwa hagati y'umuhanda. Koresha gupaka kumurongo (parallel) cyangwa inyuma (reverse) aho byiye."
  },
  PLAYER_FORGOT_SEATBELT: {
    topic: "road_safety",
    query: "seatbelt umurobe wigitiri",
    fallback_en: "Always fasten your seat belt before starting the engine. Passengers also must wear seat belts. It saves lives.",
    fallback_rw: "Buri gihe tanga umurobe wigitiri MBERE yo gutangira injini. Abagenda bakoresha imirobe yigitiri ntabwo bikenewe. Bituma abantu bazera."
  },
  PLAYER_ENTERED_ROUNDABOUT: {
    topic: "intersections",
    query: "rond-point roundabout priority kureka abandi bakabanza",
    fallback_en: "At a roundabout (rond-point) you must YIELD to traffic already in the roundabout coming from your left. Enter only when there is a safe gap.",
    fallback_rw: "Ku rond-point, OYA KUREKA abandi bakoresha rond-point bavuye ibumoso. Injiza gusa igiho hari icyo cyarwayo."
  },
  PLAYER_FAILED_TO_YIELD: {
    topic: "right_of_way",
    query: "give way kureka abandi priority uburenganzira bwo kugenda mbere",
    fallback_en: "Give way to vehicles already on the main road, to vehicles approaching from your right at an uncontrolled T-junction, and to pedestrians at designated crossings.",
    fallback_rw: "Kureka abanyabiziga bari kuri umuhanda munini, abavuye iburyo ku nsangano itagira akimenyetso, n'abanyamaguru ku mpande zanyurwamo."
  },
  PLAYER_RAN_RED_LIGHT: {
    topic: "traffic_lights",
    query: "red light traffic light stop amatara y'umuhanda",
    fallback_en: "RED light means STOP. Do not cross the stop line. Wait for GREEN. YELLOW/AMBER means stop if it is safe to do so.",
    fallback_rw: "Amatara YEKERA bisobanura GUHAGARARA. Ntuguteze murongo wo guhagarara. Tegereza YASINE. AMBER/UMUKARUCA: hagarara niba biri kiza."
  },
  PLAYER_OVERTOKING_WRONG: {
    topic: "overtaking",
    query: "overtaking kwanyuranaho gusonga",
    fallback_en: "Overtake only on the right side. Never overtake on curves, hills, junctions, pedestrian crossings, or where a solid white line prohibits overtaking.",
    fallback_rw: "Gusonga gusa ku buryo bwa kugo. Ntugusonge ku ngiro, hejuru isura, ku nsangano, ku mpande z'abanyamaguru, cyangwa aho umurongo w'umukara utazwi akomeye adakwiye gusonga."
  },
  PLAYER_NOT_WEARING_HELMET: {
    topic: "road_safety",
    query: "helmet moto bicycle safety",
    fallback_en: "Always wear a correctly fastened helmet on a motorcycle (moto) or bicycle. It protects your brain and can save your life in a crash.",
    fallback_rw: "Buri gihe fata agakiro k'amatwe (helmet) neza igihe uri kuri moto cyangwa bisikilete. Zirinda ubwenge n'izera kuzirinda amazima."
  },
  PLAYER_AMBULANCE_APPROACH: {
    topic: "emergency_vehicles",
    query: "ambulance emergency police fire truck yield pull over",
    fallback_en: "When an ambulance, police, or fire truck approaches with lights and siren, PULL OVER safely to the left and stop to let it pass.",
    fallback_rw: "Igihe ambulanesi, polisi, cyangwa gari ry'umuriro rifuza ikoresha amatara n'impuruza, HAGARARA ku ibumoso kugira ngo ridunguwe."
  },
  PLAYER_PEDESTRIAN_CROSSING: {
    topic: "pedestrians",
    query: "pedestrian crossing zebra stop abanyamaguru",
    fallback_en: "At a zebra crossing, STOP and give priority to pedestrians already on the crossing and those waiting to cross.",
    fallback_rw: "Ku mpande z'abanyamaguru (zebra), HAGARARA kandi USHYIREHO abanyamaguru bari ku mpande n'abashaka kubanyuramo."
  }
};

export function simulatorEventToKnowledge(event, context = {}) {
  const ev = String(event || "").toUpperCase().trim();
  const mapping = SIMULATOR_EVENT_MAP[ev] || null;
  const lang = (context.language || "rw") === "en" ? "en" : "rw";
  if (!mapping) {
    return {
      context: "",
      sources: [],
      topScore: 0,
      retrievedCount: 0,
      confidence: "low",
      topic: "general",
      lang,
      intent: "scenario",
      fallback: lang === "en"
        ? "Moto-Sensei is reviewing this driving situation. Drive carefully, obey all signs, signals, and Rwanda traffic rules. When in doubt, slow down and yield."
        : "Moto-Sensei asobanura urugendo rwo gutwara. Gutwara neza, kurikira ibyapa n'amatara n'amategeko y'umuhanda u Rwanda. Igiho ntushobora, hejuru umuvuduko kandi kureka abandi."
    };
  }
  const r = retrieveKnowledge({
    text: mapping.query,
    intentResult: { intent: "scenario", topic: mapping.topic, confidence: "high", score: 1 },
    langResult: { language: lang, confidence: 0.9, rwScore: lang === "rw" ? 2 : 0, enScore: lang === "en" ? 2 : 0 },
    topK: 4,
    maxChars: 3500
  });
  r.topic = mapping.topic;
  r.fallback = lang === "en" ? mapping.fallback_en : mapping.fallback_rw;
  return r;
}
