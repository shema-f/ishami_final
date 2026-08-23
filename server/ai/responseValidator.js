const HALLUCINATION_FLAGS = [
  /as far as i know/i,
  /i (believe|think|guess|suppose|imagine)/i,
  /this might? be/i,
  /probably|possibly|maybe|perhaps/i,
  /it is (said|believed|thought)/i,
  /rumor|rumour/i,
  /i('m| am) not sure/i,
  /i don't have (the |verified |official )?(information|data|knowledge|details)/i,
  /(cannot|can't|unable to) (verify|confirm)/i,
  /without (official|verified|authoritative)/i
];

const UNSAFE_FLAGS = [
  /(drive|go|speed).*(200|180|160|150|140).*km/i,
  /avoid (police|camera|ticket|catch)/i,
  /evade (police|detection|roadblock|checkpoint)/i,
  /bypass (speed|limit|camera|police)/i,
  /cheat (on|the) (test|exam|quiz)/i,
  /run (a|the|red) light/i,
  /don.?t (stop|yield|give way)/i,
  /ignore (sign|light|rule)/i,
  /(drink|drunk|alcohol|beer|wine).*(drive|driving|car|vehicle)/i,
  /without seat.?belt/i,
  /race (on|the|public|street|road)/i,
  /(drift|stunt|donut|burnout).*(road|street|public)/i
];

const SAFE_REPLACEMENTS = {
  en: {
    unsafe_prefix:
      "I can't help with that — that would be dangerous, illegal, or against Rwanda traffic rules. Here's the safe and correct guidance instead:\n\n",
    brake_fail:
      "⚠️ SAFETY FIRST — If your brakes aren't working properly:\n1. Ease off the accelerator immediately\n2. Pump the brake pedal firmly and rapidly (builds residual pressure)\n3. Apply the handbrake / emergency brake gradually (not abruptly)\n4. Engine-brake by downshifting (manual)\n5. Steer calmly toward a safe, clear area away from pedestrians and traffic\n6. Activate your hazard warning lights (hazard/impuruza)\n7. Honk and flash lights to alert others\n8. Once stopped safely, call for professional mechanical assistance\n\nNever abandon a moving vehicle. Safety > speed. #GerayoAmahoro"
  },
  rw: {
    unsafe_prefix:
      "Ntuzabona ibisubizo byo gutwara ububasha, no guhinda amategeko, cyangwa gutsinda umutekano. Hejuru y'ibyo hari ibyo bikwiye gukorwa hamwe n'umutekano:\n\n",
    brake_fail:
      "⚠️ UMUTEKANO NI INGAMBE — Niba feri zidakora neza:\n1. Vuka incuti muri kit cyose (mote)\n2. Tanga amabara kuri feri umva agaju n'akagali (builds pressure)\n3. Hagarara feri y'ubushisho buteranye (ntubwire bukomeye)\n4. Koresha ivugapfe no gushigikiriza ivugapfe ikomeye (manual)\n5. Kora ibitekerezo bifite ibitekerezo byiza — hagarara ku nzira sanzwe, uhreke abanyamaguru n'ibindi\n6. Tanga amatara agashya (hazard / impuruza)\n7. Tumba igikoresho cya klakisoni kandi utumye amatara kumena abandi\n8. Igihe wahagarara neza, hamagara umuhanuzi w'umugambi w'ibinyabiziga\n\nNtuhagarike ikinyabiziga gikomeye kigenda. Umutekano ni ugutanya kugenda. #GerayoAmahoro"
  }
};

export function validateResponse({ rawResponse, lang = "en", intent = "general_traffic", topic = "general", knowledgeConfidence = "low", sources = [], userPrompt = "" }) {
  const text = String(rawResponse || "").trim();
  const warnings = [];
  let safeResponse = text;
  let effectiveConfidence = knowledgeConfidence;

  const hallucinationMatches = HALLUCINATION_FLAGS.filter(r => r.test(text));
  if (hallucinationMatches.length > 0) {
    warnings.push("hallucination_language");
    if (knowledgeConfidence === "low") effectiveConfidence = "low";
  }

  const unsafeMatches = UNSAFE_FLAGS.filter(r => r.test(text));
  if (unsafeMatches.length > 0) {
    warnings.push("unsafe_patterns");
    const safe = lang === "rw"
      ? (SAFE_REPLACEMENTS.rw.unsafe_prefix + "Koresha ibitekerezo bifite ibitekerezo byiza, ubwenge n'umutekano. Genda ku isura y'umukoresha, ongera umushinga w'umutekano ufite guhiga n'abandi. #GerayoAmahoro")
      : (SAFE_REPLACEMENTS.en.unsafe_prefix + "Always drive responsibly, within Rwanda speed limits, wearing your seatbelt, and respecting all road signs and other road users. Safety is everyone's responsibility. #GerayoAmahoro");
    safeResponse = safe;
  }

  if (isBrakeFailurePrompt(userPrompt)) {
    safeResponse = SAFE_REPLACEMENTS[lang]?.brake_fail || SAFE_REPLACEMENTS.en.brake_fail;
    warnings.push("emergency_brake_failure_overridden");
    effectiveConfidence = "high";
  }

  if (!text || text.length < 20) {
    warnings.push("too_short_or_empty");
    effectiveConfidence = "low";
  }

  if (sources.length === 0 && knowledgeConfidence !== "high") {
    if (
      intent !== "greeting" &&
      intent !== "thanks" &&
      intent !== "conversation"
    ) {
      warnings.push("no_knowledge_sources");
      if (effectiveConfidence === "high") effectiveConfidence = "medium";
    }
  }

  const langMismatch = guessLang(text) !== lang;
  if (langMismatch && text.length > 40) {
    warnings.push("possible_language_mismatch");
  }

  const validated = {
    answer: safeResponse,
    warnings,
    confidence: effectiveConfidence,
    needsDisclaimer: effectiveConfidence === "low" && intent !== "greeting" && intent !== "thanks" && intent !== "conversation"
  };

  if (validated.needsDisclaimer && !/don't have enough verified/i.test(safeResponse)) {
    const disc =
      lang === "rw"
        ? "\n\n(Disclaimer: Iyi bisubizo nta mpuhwe kumenya neza mu ngiro z'umwihariko z'amategeko y'umuhanda y'u Rwanda. Ushobora kumenya neza kuri Polisi y'u Rwanda cyangwa mu bigo by'ubuhanga.)"
        : "\n\n(Note: I don't have high-confidence verified project knowledge for this exact Rwanda rule. For definitive answers, consult official Rwanda traffic authority materials.)";
    validated.answer = validated.answer + disc;
  }

  return validated;
}

function isBrakeFailurePrompt(text) {
  if (!text) return false;
  const s = String(text).toLowerCase();
  return /brakes?.*(not working|broken|fail|failed|stuck|won.?t work|no brake|dysfunction|malfunction)/i.test(s) || /feri.*(dakora|nindutse|intambwe|sinda|idasanzwe)/i.test(s);
}

function guessLang(text) {
  const s = String(text || "").toLowerCase();
  const rwHits = [" ni ", " na ", " ya ", " wa ", " ku ", " mu ", " har", " iby", " icy", " umu", " aba", " nta", " sin", " ntab", " neza", " cyane", " umuhanda", " gutwara", " murakoze"].filter(k => s.includes(k)).length;
  const enHits = [" the ", " is ", " a ", " an ", " to ", " of ", " and ", " you ", " are ", " in ", " on ", " for ", " with ", " that ", " this ", " it ", " your ", " have ", " will ", " would ", " should ", " traffic ", " road ", " drive ", " sign ", " speed "].filter(k => s.includes(k)).length;
  return rwHits > enHits ? "rw" : "en";
}

export function detectAnswerHallucination(rawResponse) {
  return HALLUCINATION_FLAGS.some(r => r.test(String(rawResponse || "")));
}
