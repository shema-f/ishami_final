import { detectLanguage } from "./languageDetector.js";

const INTENT_PATTERNS = {
  road_sign_explain: {
    rw: [/(icyapa|ibyapa|ikimenyetso|ibimenyetso).*(cya|ya|byo|bya|kuri|ni).*/i, /ni.*(iki|inde).*(icyapa|ibyapa)/i, /isobanura.*icyapa/i],
    en: [/what.*(does|is).*(sign|road sign|traffic sign)/i, /explain.*sign/i, /meaning.*sign/i, /sign.*(mean|stands for)/i]
  },
  road_sign_list: {
    rw: [/(andika|tanga|mpa).*(ibyapa|ibimenyetso|byapa)/i, /amahitamo.*icyapa/i],
    en: [/(list|types|kinds|categories).*(sign|road sign)/i, /what.*signs.*(exist|are there)/i]
  },
  speed_limit: {
    rw: [/(umuvuduko|vitesse).*(ntarengwa|ni|bikwiye|ninde)/i, /ni.*bigihe.*umuvuduko/i, /bikwiye.*kugenda.*(km|kirometero)/i],
    en: [/(speed|limit|maximum speed).*(is|are|what|how)/i, /how fast|what speed/i, /km\/h.*(allowed|permitted)/i]
  },
  right_of_way: {
    rw: [/(uburenganzira|kureka|priority).*(mbere|kugenda|ni nde|ni iki)/i, /ni nde.*(bakabanza|kugenda mbere)/i, /isangano.*ni nde/i, /inkomane.*ni nde/i, /rond.point.*ni nde/i],
    en: [/right.*(of|on)?.*way/i, /who.*(goes|has).*priority/i, /priority.*(at|on|who)/i, /who.*(yield|give way|go first)/i, /roundabout.*(who|priority|right of way)/i, /intersection.*(who|right|priority)/i]
  },
  overtaking: {
    rw: [/(kwanyuranaho|gusonga|gucaho|nyuranaho).*/i, /bikwiye.*kunyuranaho/i, /ntegisi.*kunyuranaho/i],
    en: [/(overtake|overtaking|pass|passing).*/i, /when.*(overtake|pass)/i, /how.*(overtake|pass)/i]
  },
  parking: {
    rw: [/(gupaka|gupika).*(ni |ntegisi|bikwiye|aha|ni iki|inga)/i, /guhagarara.*(bikwiye|ni |aha|inga)/i, /(kugenzura|kumenya).*(gupaka)/i],
    en: [/(park|parking|stop|stopping).*(how|where|when|what|can|allowed|rules)/i, /how.*park/i, /where.*park/i]
  },
  turning: {
    rw: [/(kugena|kwerekeza|guhindura icyerekezo).*(iburyo|ibumoso|bikwiye|ni|inga)/i],
    en: [/(turn|turning).*(left|right|how|when|signal|indicator)/i, /how.*turn/i, /when.*signal/i]
  },
  traffic_light: {
    rw: [/amatara.*(umweru|itsinze|amber|ni ute|bikwiye|isobanura)/i, /(umweru|itsinze|amber).*(amatara|bikwiye|ni ute)/i],
    en: [/(traffic light|light).*(red|green|yellow|amber|mean|do|rules)/i, /red light|green light/i]
  },
  pedestrian: {
    rw: [/abanyamaguru.*(banyura|kureka|uburenganzira|bikwiye)/i, /(ahantu|icyapa).*(banyura|abanyamaguru|zebra)/i, /akayira.*abanyamaguru/i],
    en: [/(pedestrian|walker|zebra|crossing|cross walk).*/i, /people.*cross.*road/i]
  },
  emergency_vehicle: {
    rw: [/(ambulansi|polisi|gari ry'umuriro|umuriro|agakiza|gari ya gakiza).*(bikwiye|ni ute|kureka)/i, /impuruza.*(amatara|bikwiye)/i],
    en: [/(ambulance|police|fire.*(truck|engine)|emergency|siren).*/i, /what to do.*siren/i]
  },
  driving_procedure: {
    rw: [/(kutangira|gupanga|gukora).*(modoka|igire|kinyabiziga|gutwara)/i, /(feri|ivugapfe|embrayage|clutch|kit|mote|accélérateur).*(bikwiye|ni ute)/i, /(kugenda|kugaruka|guhiga).*(mu nsisiro|ahataratuye)/i],
    en: [/(start|starting|check|prepare).*(car|vehicle|engine)/i, /(clutch|brake|gear|accelerator|handbrake|reverse).*(how|use|when)/i, /(hill|uphill|downhill).*(start|drive|park)/i]
  },
  safety: {
    rw: [/(umutekano|kwirinda impanuka|impanuka|ububasha|gutwara ububasha).*/i, /umurobe.*igitiri/i, /seat.*belt/i, /(imvura|amagara|ijuru|ijoro|ubugari).*(gutwara|bikwiye)/i],
    en: [/(safety|safe|defensive|reckless|accident|crash|collision|danger).*/i, /(seat.?belt|helmet|airbag).*/i, /(rain|night|weather|fog|snow|ice).*(drive|driving)/i]
  },
  exam_question: {
    rw: [/(ikizamini|amahugurwa|ibibazo|isuzume|gukorera provisoire).*/i, /(mpa|tanga|kora).*(ibibazo|amahugurwa|ikizamini)/i, /ibibazo.*by.*ikizamini/i],
    en: [/(exam|test|quiz|question|practice|mock|provisional).*/i, /(give|ask|generate|make).*(question|quiz|test|exam)/i, /(practice|prepare).*(driving|test|exam)/i]
  },
  scenario: {
    rw: [/(ngeze|ari|ndiye|hari|uba).*(mu muhanda|isangano|inkomane|rond.point|icyapa|abanyamaguru|umuvuduko|amatara|feri|imodoka|gari|moshi)/i, /nkaba.*(gutwara|kugenda)/i, /iba.*kuri.*(aha|ahantu)/i],
    en: [/(i'm|i am|im|approaching|at|near|there is|there's|there are|when|while).*(driving|drive|approaching|roundabout|intersection|sign|light|crossing|road|car|vehicle|pedestrian)/i, /what.*(if|should|do).*(i|when|there|i'm|i am)/i]
  },
  road_markings: {
    rw: [/(umurongo|ibirango|ibara).*(umweru|umukara|uce|gutwara|bikwiye|isobanura)/i, /umurongo.*(ukomeje|uduce|ukabije|ubiri|tatu)/i],
    en: [/(road marking|line|marking|lane|curb|kerb).*/i, /(solid|dashed|white|yellow|double).*(line|marking)/i]
  },
  definition: {
    rw: [/(ni iki|ni inde|kandi ni|isobanura).*(ijambo|igice|umuntu|akintu|umuhanda|gutwara)/i, /define|definition/i],
    en: [/(what is|define|definition|meaning of|who is).*/i]
  },
  // NOTE: thanks must be evaluated BEFORE greeting so "murakoze cyane" is
  // classified as thanks, not greeting (equal scores -> first wins).
  thanks: {
    rw: [/(^|[\s.,!?])(murakoze|urakoze|ndagushima|shukran)([\s.,!?]|$)/i],
    en: [/\b(thank|thanks|thx|ty|appreciate|cheers|great|awesome|amazing|cool|nice|perfect|brilliant)\b/i]
  },
  greeting: {
    rw: [/^(mwaramutse|mwiriwe|muraho|murakaza|bitekerezo|bonjour|salut|boss|afande|moto|sensei|neza|cyane|murakoze)/i],
    en: [/^(hello|hi|hey|good (morning|afternoon|evening)|greetings|yo|sup|moto|sensei|howdy)/i]
  }
};

const TOPIC_LABELS = {
  road_sign_explain: "road_signs",
  road_sign_list: "road_signs",
  speed_limit: "speed_limits",
  right_of_way: "right_of_way",
  overtaking: "overtaking",
  parking: "parking_stopping",
  turning: "turning_signals",
  traffic_light: "traffic_lights",
  pedestrian: "pedestrians",
  emergency_vehicle: "emergency_vehicles",
  driving_procedure: "vehicle_controls",
  safety: "road_safety",
  exam_question: "exam_mode",
  scenario: "scenario_mode",
  road_markings: "road_markings",
  definition: "definitions",
  greeting: "conversation",
  thanks: "conversation"
};

export function classifyIntent(text, detectedLang = null) {
  const raw = String(text || "").trim();
  if (!raw) return { intent: "unknown", topic: "unknown", confidence: "low", score: 0 };

  const lang = detectedLang || detectLanguage(raw).language;
  const scores = [];

  for (const [intent, patterns] of Object.entries(INTENT_PATTERNS)) {
    let score = 0;
    const set = patterns[lang] || [];
    const other = patterns[lang === "rw" ? "en" : "rw"] || [];
    for (const re of set) {
      if (re.test(raw)) score += 1;
    }
    for (const re of other) {
      if (re.test(raw)) score += 0.5;
    }
    if (score > 0) scores.push({ intent, score });
  }

  scores.sort((a, b) => b.score - a.score);
  const best = scores[0];

  if (!best || best.score < 0.3) {
    return { intent: "general_traffic", topic: "general", confidence: "low", score: 0, candidates: scores };
  }

  const confidence = best.score >= 1.5 ? "high" : (best.score >= 0.7 ? "medium" : "low");

  return {
    intent: best.intent,
    topic: TOPIC_LABELS[best.intent] || "general",
    confidence,
    score: +best.score.toFixed(2),
    candidates: scores.slice(0, 3)
  };
}
