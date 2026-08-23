import dotenv from "dotenv";
import fs from "fs";
import path from "path";
try {
  const ep = path.resolve(process.cwd(), "server", ".env");
  if (fs.existsSync(ep)) dotenv.config({ path: ep });
  else dotenv.config();
} catch {}

const OLLAMA_BASE = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "deepseek-r1:7b";
const AI_PROVIDER = (process.env.AI_PROVIDER || "auto").toLowerCase();
const GEMINI_KEY = process.env.GEMINI_API_KEY || "";
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash";
const GROQ_KEY = process.env.GROQ_API_KEY || "";
const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
const REQUEST_TIMEOUT_MS = Number(process.env.AI_TIMEOUT_MS || 120000);

let providerInUse = "unknown";
let concurrency = 0;
const MAX_CONCURRENCY = 2;
const queue = [];

function nextQueue() {
  if (queue.length && concurrency < MAX_CONCURRENCY) {
    const item = queue.shift();
    concurrency++;
    Promise.resolve(item.fn())
      .then(r => { concurrency--; item.resolve(r); nextQueue(); })
      .catch(e => { concurrency--; item.reject(e); nextQueue(); });
  }
}

function enqueue(fn) {
  return new Promise((resolve, reject) => {
    queue.push({ fn, resolve, reject });
    nextQueue();
  });
}

export function getProviderInfo() {
  return {
    providerInUse,
    configured: AI_PROVIDER,
    ollama: {
      base: OLLAMA_BASE,
      model: effectiveOllamaModel(ollamaModelList || []),
      available: Array.isArray(ollamaModelList) && ollamaModelList.length > 0,
      models: ollamaModelList || []
    },
    gemini: { available: !!GEMINI_KEY, model: GEMINI_MODEL },
    groq: { available: !!GROQ_KEY, model: GROQ_MODEL },
    maxConcurrency: MAX_CONCURRENCY
  };
}

let ollamaModelList = null;

// Cache the list of models actually pulled into Ollama so we never call a
// model that isn't installed (e.g. config says deepseek-r1:7b but only 8b
// is pulled -> HTTP 404 on every request).
export async function getOllamaModels() {
  if (ollamaModelList) return ollamaModelList;
  try {
    const ctrl = new AbortController();
    setTimeout(() => ctrl.abort(), 5000);
    const r = await fetch(`${OLLAMA_BASE}/api/tags`, { signal: ctrl.signal });
    if (!r.ok) return [];
    const j = await r.json();
    ollamaModelList = (j.models || []).map(m => m.name);
    return ollamaModelList;
  } catch {
    return [];
  }
}

function effectiveOllamaModel(models) {
  if (!Array.isArray(models) || !models.length) return OLLAMA_MODEL;
  if (models.includes(OLLAMA_MODEL)) return OLLAMA_MODEL;
  const preferred = models.find(m => /deepseek/i.test(m)) || models[0];
  if (preferred && preferred !== OLLAMA_MODEL) {
    console.warn(`[AI] Ollama model "${OLLAMA_MODEL}" not pulled locally; falling back to "${preferred}"`);
  }
  return preferred || OLLAMA_MODEL;
}

async function ollamaAvailable() {
  return (await getOllamaModels()).length > 0;
}

async function callOllama(systemPrompt, userPrompt, { stream = false, onChunk, signal } = {}) {
  providerInUse = "ollama";
  const model = effectiveOllamaModel(await getOllamaModels());
  console.log(`[AI] Ollama model=${model} base=${OLLAMA_BASE} stream=${stream}`);
  const body = {
    model,
    prompt: `${systemPrompt}\n\n==========\n${userPrompt}`,
    stream: !!stream,
    options: { temperature: 0.3, top_p: 0.9, num_ctx: 8192, top_k: 40, num_predict: 700 }
  };
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), REQUEST_TIMEOUT_MS);
  if (signal) {
    try { signal.addEventListener("abort", () => ctrl.abort()); } catch {}
  }
  try {
    const resp = await fetch(`${OLLAMA_BASE}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: ctrl.signal
    });
    clearTimeout(timer);
    if (!resp.ok) throw new Error(`Ollama HTTP ${resp.status}`);
    if (!stream) {
      const j = await resp.json();
      return String(j.response || "");
    }
    let full = "";
    if (resp.body && typeof resp.body.getReader === "function") {
      const reader = resp.body.getReader();
      const dec = new TextDecoder("utf-8");
      let buf = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        const lines = buf.split(/\r?\n/);
        buf = lines.pop() || "";
        for (const line of lines) {
          const l = line.trim();
          if (!l) continue;
          try {
            const obj = JSON.parse(l);
            if (obj && typeof obj.response === "string") {
              full += obj.response;
              if (typeof onChunk === "function") onChunk(obj.response, obj);
            }
            if (obj && obj.done) break;
          } catch {}
        }
      }
    }
    return full;
  } catch (e) {
    clearTimeout(timer);
    throw e;
  }
}

async function callGroqStream(systemPrompt, userPrompt, onChunk) {
  providerInUse = "groq";
  console.log(`[AI] Groq stream model=${GROQ_MODEL}`);
  const G = await import("groq-sdk");
  const Groq = G.default || G.Groq || G;
  const groq = new Groq({ apiKey: GROQ_KEY });
  const r = await groq.chat.completions.create({
    model: GROQ_MODEL,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    temperature: 0.3,
    max_tokens: 1024,
    stream: true
  });
  let full = "";
  for await (const c of r) {
    const t = c?.choices?.[0]?.delta?.content || "";
    if (t) {
      full += t;
      if (typeof onChunk === "function") onChunk(t, c);
    }
  }
  return full;
}

async function callGemini(systemPrompt, userPrompt, { stream = false, onChunk } = {}) {
  providerInUse = "gemini";
  console.log(`[AI] Gemini model=${GEMINI_MODEL} stream=${stream}`);
  const { GoogleGenerativeAI } = await import("@google/generative-ai");
  const genAI = new GoogleGenerativeAI(GEMINI_KEY);
  const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
  const parts = [{ text: systemPrompt }, { text: userPrompt }];
  const withTimeout = p => Promise.race([
    p,
    new Promise((_, rej) => setTimeout(() => rej(new Error(`Gemini timeout after ${REQUEST_TIMEOUT_MS}ms`)), REQUEST_TIMEOUT_MS))
  ]);
  if (stream && typeof onChunk === "function") {
    const result = await withTimeout(model.generateContentStream({ contents: [{ role: "user", parts }] }));
    let full = "";
    for await (const chunk of result.stream) {
      const t = chunk?.text?.() || "";
      if (t) {
        full += t;
        onChunk(t, chunk);
      }
    }
    return full;
  }
  const result = await withTimeout(model.generateContent({ contents: [{ role: "user", parts }] }));
  return String(result?.response?.text?.() || "");
}

async function callGroq(systemPrompt, userPrompt) {
  providerInUse = "groq";
  console.log(`[AI] Groq model=${GROQ_MODEL}`);
  const G = await import("groq-sdk");
  const Groq = G.default || G.Groq || G;
  const groq = new Groq({ apiKey: GROQ_KEY });
  const r = await groq.chat.completions.create({
    model: GROQ_MODEL,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    temperature: 0.3,
    max_tokens: 1024
  });
  return String(r?.choices?.[0]?.message?.content || "");
}

// Provider cascade: try the preferred provider first, then fall back so the
// app NEVER goes down when a provider fails (e.g. Gemini free quota exhausted).
// Order honors AI_PROVIDER when explicitly set; otherwise gemini -> ollama -> groq.
export async function generateResponse(systemPrompt, userPrompt, { stream = false, onChunk, signal } = {}) {
  return enqueue(async () => {
    const ollamaUp = await ollamaAvailable();
    const order = [];
    const add = p => { if (!order.includes(p)) order.push(p); };

    if (AI_PROVIDER === "ollama") add("ollama");
    else if (AI_PROVIDER === "gemini") add("gemini");
    else if (AI_PROVIDER === "groq") add("groq");

    if (AI_PROVIDER === "auto") {
      if (GEMINI_KEY) add("gemini");
      if (ollamaUp) add("ollama");
      if (GROQ_KEY) add("groq");
    } else {
      // Fallbacks after the explicitly preferred provider
      if (GEMINI_KEY) add("gemini");
      if (ollamaUp) add("ollama");
      if (GROQ_KEY) add("groq");
    }

    let lastErr = null;
    for (const p of order) {
      try {
        console.log(`[AI] Provider attempt: ${p} stream=${!!stream}`);
        switch (p) {
          case "ollama":
            return await callOllama(systemPrompt, userPrompt, { stream, onChunk, signal });
          case "gemini":
            return await callGemini(systemPrompt, userPrompt, { stream, onChunk });
          case "groq":
            if (stream && typeof onChunk === "function") return await callGroqStream(systemPrompt, userPrompt, onChunk);
            return await callGroq(systemPrompt, userPrompt);
        }
      } catch (e) {
        lastErr = e;
        console.warn(`[AI] Provider ${p} FAILED: ${e?.message || e} — trying next provider`);
      }
    }
    throw lastErr || new Error("No AI provider available. Set AI_PROVIDER and keys, or start Ollama.");
  });
}
