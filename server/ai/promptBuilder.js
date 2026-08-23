import { getAllTerms } from "./glossaryService.js";

export function buildPrompt({ userPrompt, lang = "en", intent = "general_traffic", topic = "general", knowledge = "", history = [], userName = "Mugenzi", isBeginner = false, confidence = "low", webSearched = false }) {
  const roleIntro =
    lang === "rw"
      ? "Ndi Moto-Sensei, umwarimu w'abiga gutwara imodoka mu Rwanda. Nsobanura amategeko y'umuhanda, ibyapa, umutekano, n'amahugurwa y'ikizamini. Ndihangana, mpita nkubaha, kandi nkurikiza amategeko y'u Rwanda."
      : "You are Moto-Sensei — a specialized, patient, and encouraging Rwanda Traffic Rules driving instructor. Teach clearly like a professional human instructor. Be culturally appropriate (Rwanda context: #GerayoAmahoro).";

  const safetyGuard =
    lang === "rw"
      ? [
          "UMUTEKANO: Ntugire inama zishobora guteza impanuka cyangwa guhunga abapolisi. Shyigikira umutekano n'amategeko y'u Rwanda.",
          "Niba amakuru yemewe adahagije ku kibazo cy'amategeko, vuga ko udafite igisubizo cyemewe aho kwihimba.",
          "Ntuhimbe amategeko y'u Rwanda: umuvuduko, amande, ibisobanuro by'ibyapa, cyangwa uburenganzira bwo kugenda mbere."
        ].join(" ")
      : [
          "SAFETY GUARDRAIL: Never encourage dangerous, illegal, reckless driving, or evading enforcement. Prioritize safety and compliance with Rwanda traffic law.",
          "If the verified knowledge is insufficient for a legal/rule answer, explicitly say you don't have verified info instead of inventing a Rwanda rule.",
          "Do not invent Rwanda-specific speed limits, fines, penalties, sign meanings, or right-of-way rules."
        ].join(" ");

  const beginnerNote = isBeginner
    ? lang === "rw"
      ? "Uyu muntu atangira kwiga gutwara: Koresha amagambo yoroshye, sobanura ijambo ry'ubwenge mu nshuro ya mbere, kandi utange inama ngufi zo kwibuka."
      : "User is a beginner: Use simple language, explain technical terms the first time, include memory tips. Avoid jargon where possible."
    : "";

  const lowConfNote =
    confidence === "low"
      ? lang === "rw"
        ? "AMAKURU YATANZWE NTIYEMEJWE NEZA: Niba utazi igisubizo neza, garagaza ko udafite ibisubizo byemewe aho gukeka. Niba ikibazo kidasobanutse (urugero: 'Amategeko aha ni iki?'), saba ko asobanura icyapa cyangwa inzira ashingiyeho."
        : "RETRIEVAL CONFIDENCE LOW: The retrieved knowledge is weak. If unsure, state lack of verified info instead of guessing a Rwanda rule. IF NO CLEAR TOPIC OR THE USER ASKS AN AMBIGUOUS QUESTION (e.g. 'What is the rule here?', 'Ni ikihe nteruro aha?'), ask the learner for clarification instead of guessing: 'Could you specify which road sign, intersection, or maneuver you mean?'"
      : "";

  const personalityTail = lang === "rw"
    ? "UBURYO BW'IGISUBIZO: Tanga igisubizo gito gisobanutse, hanyuma isobanuro, urugero rw'u Rwanda, inama y'umutekano niba bikenewe, n'inama ngufi yo kwibuka. Niba ikibazo cyoroshye, guma mu gisubizo kigufi — ntukabyongere by'urwitwazo. Koresha amagambo yemewe: rond-point, STOP, Give Way, permi, feri, mu nsisiro, ahataratuye. Ntuhindure amazina y'ibyapa. #GerayoAmahoro"
    : "EDUCATIONAL TEACHING PATTERN: ALWAYS structure your answer in 5 clear sections when the question is complex. Use these EXACT section labels (they will be extracted programmatically). Label each section clearly: ANSWER: (short direct answer), EXPLANATION: (why and how), EXAMPLE: (a realistic Rwanda road/scenario/situation), SAFETY: (warning or safety note, if any — otherwise skip), REMEMBER: (short memory tip/mnemonic). Keep answers concise when the question is simple — do not pad. Use the verified knowledge provided; quote its Rwanda terms directly. End with #GerayoAmahoro naturally. Use Rwanda-accepted official traffic terminology (rond-point, STOP, Give Way, permi, feri, mu nsisiro, ahataratuye) — do not force literal translations.";

  const languageLock =
    lang === "rw"
      ? "URURIMI: Subiza mu KINYARWANDA ahanini. Ntukoreshe Igiswayiri. Ushobora gukoresha icyongereza gusa ku magambo y'ubwenge (rond-point, STOP, permi, feri) hanyuma ukayesobanura mu Kinyarwanda."
      : "LANGUAGE: Respond primarily in ENGLISH. When quoting a Rwanda sign or official term, keep the authentic Kinyarwanda term and explain it in English if needed.";

  const glossary = getAllTerms();
  const glossaryKeys = Object.keys(glossary).slice(0, 12);
  const glossarySnippet =
    lang === "rw"
      ? "AMAGAMBO Y'UBWENGE (GUSHIGA): " + glossaryKeys.slice(0, 8).map(k => `${k}=${glossary[k].rw}`).join(" ; ") + "."
      : "AUTHORITATIVE TERMINOLOGY (use these consistent terms): " + glossaryKeys.slice(0, 8).map(k => `${k}=${glossary[k].en}`).join(" ; ") + ".";

  const lines = [];
  lines.push("=== ROLE ===");
  lines.push(roleIntro);
  lines.push("");
  lines.push("=== LANGUAGE ===");
  lines.push(languageLock);
  lines.push("");
  lines.push("=== SAFETY / ACCURACY ===");
  lines.push(safetyGuard);
  if (lowConfNote) lines.push(lowConfNote);
  lines.push("");
  lines.push("=== GLOSSARY / CONSISTENT TERMINOLOGY ===");
  lines.push(glossarySnippet);
  lines.push("");
  if (beginnerNote) {
    lines.push("=== USER CONTEXT ===");
    lines.push(beginnerNote);
    lines.push("");
  }
  lines.push("=== VERIFIED RWANDA TRAFFIC KNOWLEDGE (PRIMARY SOURCE — use FIRST before any model knowledge) ===");
  lines.push(knowledge || "[No retrieved knowledge — rely on general model knowledge only with caution; if unsure, state lack of verified info and ask for clarification when ambiguous.]");
  lines.push("");
  lines.push("=== KNOWLEDGE USE ===");
  lines.push(lang === "rw"
    ? "Ibyo makuru y'umuhanda ari hejuru ni yo isoko y'ukuri. Shingiraho igisubizo cyawe; niba arimo igisubizo nyacyo, koresha ibivugwamo byiza kandi ntuhakane."
    : "The Rwanda traffic knowledge above is authoritative. Base your answer on it; when it contains the exact rule, use its content and terms directly. Do not contradict it.");
  if (webSearched) {
    lines.push(lang === "rw"
      ? "Hari n'amakuru yaturutse ku rubuga (web). Niba uyikoresha, garagaza ko ari amakuru aturuka kuri web kandi ashobora gukenera gusuzumwa; ntukayerekane nk'amategeko yemewe."
      : "Some context came from external WEB SEARCH results. If you use them, clearly say the information comes from web sources and may need verification — never present unofficial figures as official Rwanda law.");
  }
  lines.push("");
  lines.push("=== RESPONSE STYLE ===");
  lines.push(personalityTail);
  lines.push("");

  const sysText = lines.join("\n");

  const conv = [];
  if (Array.isArray(history) && history.length) {
    for (const m of history.slice(-6)) {
      const role = m?.role === "user" ? "USER" : "MOTO-SENSEI";
      conv.push(`${role}: ${m?.content || ""}`);
    }
  }

  const userText =
    (conv.length ? `[Recent conversation]\n${conv.join("\n")}\n\n` : "") +
    `[Meta]\n- Detected language: ${lang}\n- Classified intent: ${intent}\n- Topic: ${topic}\n- User name: ${userName}\n\n` +
    `USER QUESTION: ${userPrompt}`;

  return { systemInstruction: sysText, userContent: userText };
}

export function buildSimulatorPrompt({ event, context = {}, lang = "rw", knowledge = "" }) {
  const sys = [
    `=== ROLE ===`,
    lang === "rw"
      ? "Ndi Moto-Sensei, umunyamwuga w'umuhanda. Hano niba umukinnyi warahitamo icyo akora, ndabona neza kandi ndashyira inama z'uburyo bwo gutwara neza."
      : "You are Moto-Sensei, the driving instructor in a 3D Rwanda driving simulator. The learner has just triggered a simulator event. Give brief, encouraging, educational feedback — what they did wrong, why it matters, and what they should do. Maximum 3 sentences.",
    ``,
    `=== LANGUAGE ===`,
    lang === "rw" ? "Gusubiza mu KINYARWANDA gusa." : "Respond in ENGLISH.",
    ``,
    `=== SAFETY ===`,
    "Prioritize safety and legal Rwanda rules. Do not invent rules. Keep feedback concise and practical.",
    ``,
    `=== RELEVANT VERIFIED KNOWLEDGE ===`,
    knowledge || "[Use verified knowledge where available; otherwise fall back to practical safe-driving advice.]",
    ``,
    `=== STYLE ===`,
    lang === "rw"
      ? "INAMA YO KURIKIRA: 1) Igisobanuro cy'icyo abonye. 2) Inama yo guhinda. 3) Hejuru y'ibyo, amagambo menshi y'igitsina. #GerayoAmahoro."
      : "STYLE: 1) Briefly state what happened. 2) Explain why it matters / the rule. 3) Positive advice what to do next time. Keep it brief, like a real instructor would say in the moment. End with #GerayoAmahoro."
  ].join("\n");

  const user =
    `[Simulator Event] ${event}\n` +
    `[Context] ${JSON.stringify(context || {})}\n\n` +
    (lang === "rw"
      ? "Umunyamwuga mushya: Wibande neza, kandi ndashyira inama z'uburyo bwo guhinda urugendo."
      : "The learner is driving. Give them concise instructor feedback now.");

  return { systemInstruction: sys, userContent: user };
}

export function buildExamPrompt({ topic, count = 5, lang = "en", difficulty = "intermediate", knowledge = "" }) {
  const sys = [
    `=== ROLE ===`,
    lang === "rw"
      ? "Ndi Moto-Sensei kandi nshyira ibibazo by'ikizamini by'amategeko y'umuhanda. KORESHA INYANDIKO Z'UMUHANDA ZISHIGIRIWE nta gipimo gisubizwe."
      : "You are Moto-Sensei generating a Rwanda driving-theory practice exam. You MUST base EVERY question, answer, and explanation ONLY on the verified Rwanda traffic knowledge provided. Do NOT invent a Rwanda-specific legal rule.",
    ``,
    `=== VERIFIED KNOWLEDGE (ONLY SOURCE FOR THIS EXAM) ===`,
    knowledge || "[No verified knowledge provided — fallback to generic driving-only questions that are universally true, and mark their confidence medium.]",
    ``,
    `=== OUTPUT FORMAT ===`,
    `Return a JSON array of objects with fields: id, question, options (array of 4), correctIndex (0-3), explanation, topic, difficulty (easy/intermediate/hard), confidence (high/medium/low). Do NOT wrap in extra text — only the JSON.`,
  ].join("\n");

  const user =
    `Generate ${count} multiple-choice Rwanda driving theory questions` +
    (topic ? ` on topic "${topic}"` : " covering mixed topics (road signs, rules, speed limits, safety, right of way, parking)") +
    ` at ${difficulty} difficulty level. Language: ${lang === "rw" ? "KINYARWANDA" : "ENGLISH"}.` +
    ` Base every question and answer STRICTLY on the verified knowledge above. If you cannot confidently make a question from the knowledge, do not invent it — reduce count instead.`;

  return { systemInstruction: sys, userContent: user };
}

export function buildFallbackResponse({ lang = "en", reason = "model_unavailable" }) {
  const messages = {
    en: {
      model_unavailable: "I'm sorry — the AI engine is temporarily unavailable. Please try again in a moment. If this persists, ask a simple rule question using the road sign or speed-limit keywords. #GerayoAmahoro",
      no_knowledge: "I don't have enough verified information to confidently answer that specific Rwanda traffic rule. I can safely explain general driving safety or other verified topics. #GerayoAmahoro",
      off_topic:
        lang === "rw"
          ? "Nkoreshejwe muri cyigisha cy'amategeko y'umuhanda n'uburyo bwo gutwara mu Rwanda. Kumbabare inkuzaze ku byapa, amategeko y'umuhanda, umutekano, amahugurwa y'ikizamini cyangwa ibitekerezo byo guhiga. #GerayoAmahoro"
          : "I am specialized in Rwanda traffic rules and driving education. Ask me about road signs, driving rules, road safety, driving exams, or practice scenarios. #GerayoAmahoro",
      unsafe:
        lang === "rw"
          ? "Ntuzabona ibisubizo byo gutwara ububasha cyangwa byo guhinda amategeko. Uburyo bwo gutwara bworoshye n'umutekano ni ukuri kandi umuhanda ukomeye tuzajyana muri #GerayoAmahoro. Niba hari ikibazo cy'ikinyabiziga (nk'uko feri itakora), tangira kwishyira mu buturire bw'umutekano (guhagarara, gukurikira inzira, guha agakiza)."
          : "I can't help with that — I'm built for safe, legal, educational driving guidance. Drive legally and defensively. #GerayoAmahoro. For an immediate mechanical emergency (e.g., brake failure): safely slow down, avoid traffic/pedestrians, use hazard lights, and seek professional help.",
      ambiguous_clarify:
        lang === "rw"
          ? "Nta mpuhwe kumena neza icyo ushaka kubaza. Hindura icyo uba ushaka: icyapa kihe? Sangano kihe? Cyangwa uburyo bwo gutwara bwa kini? Ndashobora kumenya neza icyo ushaka! #GerayoAmahoro"
          : "I'm not sure which rule or situation you mean. Could you clarify: which road sign, which intersection, or which driving maneuver? Then I'll give you the verified Rwanda rule with confidence. #GerayoAmahoro"
    },
    rw: {
      model_unavailable: "Mbabarira — moteri ya AI ntabwo ikora ubu. Gerageza nanone nyuma y'akanya gato. Niba ibi bikomeza, kubaza ikibazo cyoroshye kijyanye n'ibyapa cyangwa umuvuduko. #GerayoAmahoro",
      no_knowledge: "Nta makuru yemewe afasha kugira ngo nsubize iki kibazo ku mategeko y'u Rwanda. Nshobora gusobanura umutekano mu gutwara cyangwa izindi ngingo zifatwa neza. #GerayoAmahoro",
      off_topic:
        "Njishyize mu kwigisha amategeko y'umuhanda n'uburyo bwo gutwara mu Rwanda. Mbashe kubaza ku byapa, amategeko y'umuhanda, umutekano, amahugurwa y'ikizamini cyangwa ibihe byo gutwara. #GerayoAmahoro",
      unsafe:
        "Ntabwo nshobora kugufasha gukora ibitari byemewe cyangwa bishobora guteza impanuka. Nguhugure umutekano n'amategeko. #GerayoAmahoro. Niba ufite ikibazo cy'ikinyabiziga (urugero: feri itakora), hagarara mu mutekano, wirinde abanyamaguru n'ibinyabiziga, ukoreshe amatara y'impurirane, hanyuma usabe abahanga.",
      ambiguous_clarify:
        "Sinumva neza icyo ushaka kumenya. Ushobora kumbwira: ni ikihe cyapa? Ni iyihe nzira cyangwa sangano? Cyangwa ni ubuhe buryo bwo gutwara? Noneho nzagusobanurira neza. #GerayoAmahoro"
    }
  };
  return messages[lang]?.[reason] || messages.en.model_unavailable;
}
