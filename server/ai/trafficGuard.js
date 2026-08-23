const TRAFFIC_KEYWORDS_RW = new Set([
  "umuhanda", "imihanda", "gutwara", "ikinyabiziga", "ibinyabiziga",
  "icyapa", "ibyapa", "ikimenyetso", "ibimenyetso", "umuvuduko",
  "guhagarara", "gupaka", "gusubiza", "gusubiza inyuma",
  "kwanyuranaho", "gusonga", "kureka", "uburenganzira",
  "isangano", "inkomane", "rond-point", "abanyamaguru",
  "amatara", "feri", "akayira", "umusatsi", "igitiri",
  "umurobe", "ikizamini", "kwiga", "permi", "igenzo",
  "umuco", "umutekano", "kwirinda impanuka", "impanuka",
  "umuyobozi", "polisi", "gari ya moshi", "velomoteri",
  "ipikipiki", "igare", "amapikipiki", "tagisi", "avatiri",
  "imbuga", "nsisiro", "ahataratuye", "gushigikiriza",
  "umweru", "ukwezi", "imvura", "amagara", "ijuru",
  "igipimo", "ivugapfe", "embrayage", "mote", "kit",
  "umutekano", "ikinyabiziga", "indwara", "ambulansi",
  "umuriro", "impuruza", "agakiza", "umuriro", "gakiza",
  "kugeza", "kwambuka", "kugaruka", "iburyo", "ibumoso",
  "indirimbo", "umurongo", "ibisate", "ahantu", "akarusho",
  "kugena", "kwerekeza", "kugira icyerekezo", "ikikezo",
  "ibara ry'umweru", "ibara ry'itsinze", "ibara ry'amber",
  "ikozwe n'ubwenge", "ibinywaji", "cyamunara", "kamera",
  "ubwato", "akabare", "vitesse", "gakuru", "inama",
  "irembo", "gukorera provisoire", "umunyamwuga",
  "sinumva", "ntabwo", "mbega", "nk'ubwo", "uri aha",
  "ni iki", "ntegisi", "imishinga", "umwana", "umugambi",
  "gutwara ububasha", "kugaragaza umutekano",
  "kugaragaza umutekano", "kubera ikibazo"
]);

const TRAFFIC_KEYWORDS_EN = new Set([
  "road", "roads", "street", "streets", "highway", "motorway",
  "drive", "driving", "driver", "drivers", "vehicle", "vehicles",
  "car", "cars", "truck", "trucks", "bus", "buses", "motorcycle",
  "bike", "bicycle", "van", "lorry", "trailer", "tractor",
  "sign", "signs", "road sign", "traffic sign", "signal", "signals",
  "traffic", "speed", "limit", "slow", "fast", "accelerate", "brake",
  "park", "parking", "stop", "stopping", "turn", "turning", "left",
  "right", "lane", "lanes", "overtake", "overtaking", "pass", "passing",
  "yield", "give way", "priority", "right of way", "pedestrian",
  "crossing", "zebra", "crosswalk", "seatbelt", "seat belt",
  "mirror", "horn", "indicator", "hazard", "lights", "headlight",
  "taillight", "brakelight", "reverse", "reverse parking",
  "parallel", "hill", "uphill", "downhill", "clutch", "gear",
  "intersection", "junction", "roundabout", "traffic light",
  "red light", "green light", "amber", "yellow light",
  "railway", "railroad", "train", "crossing",
  "police", "cop", "ticket", "fine", "penalty", "law", "rule",
  "rules", "regulation", "exam", "test", "quiz", "question",
  "learn", "learner", "permit", "license", "licence", "theory",
  "practical", "safety", "safe", "danger", "accident", "crash",
  "collision", "defensive", "reckless", "drunk", "alcohol",
  "speeding", "camera", "bump", "hump", "pothole", "shoulder",
  "weather", "rain", "fog", "night", "dark", "glare",
  "emergency", "ambulance", "firetruck", "fire truck", "siren",
  "simulator", "simulation", "scenario", "mistake", "error",
  "motosensei", "moto-sensei", "moto sensei", "sensei",
  "ishami", "rwanda", "kigali", "nyarwanda", "kinyarwanda",
  "beginner", "teach me", "explain", "how do i", "what does",
  "when should", "can i", "must i", "is it allowed", "provisional"
]);

const OFF_TOPIC_RESPONSES = {
  en: "I am specialized in Rwanda traffic rules and driving education. Ask me about road signs, driving rules, road safety, driving exams, or practice scenarios. #GerayoAmahoro",
  rw: "Nkoreshejwe muri cyigisha cy'amategeko y'umuhanda n'uburyo bwo gutwara mu Rwanda. Kumbabare inkuzaze ku byapa, amategeko y'umuhanda, umutekano, amahugurwa y'ikizamini cyangwa ibitekerezo byo guhiga. #GerayoAmahoro"
};

const LEARNER_CONTEXT_KEYWORDS = new Set([
  "explain like", "beginner", "i'm new", "i am new", "don't understand",
  "do not understand", "simple", "easy", "for dummies", "step by step",
  "sinumva", "sinumva neza", "ntabwo", "mbere", "mpande",
  "shya", "nshya", "kwiga", "kugira icyo ndigire"
]);

export function isTrafficRelated(text) {
  if (!text || !String(text).trim()) return { isTraffic: false, score: 0, reason: "empty" };

  const s = String(text).toLowerCase();
  const tokens = s.replace(/[^\w\s'-]/g, " ").split(/\s+/).filter(Boolean);

  let rwHits = 0;
  let enHits = 0;

  for (const t of tokens) {
    if (TRAFFIC_KEYWORDS_RW.has(t)) rwHits++;
    if (TRAFFIC_KEYWORDS_EN.has(t)) enHits++;
  }

  const raw = s;
  for (const kw of TRAFFIC_KEYWORDS_RW) {
    if (raw.includes(kw)) rwHits += 0.3;
  }
  for (const kw of TRAFFIC_KEYWORDS_EN) {
    if (raw.includes(kw)) enHits += 0.3;
  }

  const score = rwHits + enHits;
  const threshold = 0.6;
  const isTeaching = isTeachingContext(text);
  const beginner = isBeginner(text);
  const greetings = /^(mwaramutse|mwiriwe|muraho|bonjour|hello|hi|hey|good (morning|afternoon|evening)|salut|boss|afande)\b/i.test(s.trim());
  let isTraffic = score >= threshold;
  if (greetings) isTraffic = true;
  if (isTeaching && beginner) isTraffic = true;
  if (isTeaching && !beginner && score >= 0.5) isTraffic = true;

  let reason = "score_below_threshold";
  if (isTraffic) {
    reason = rwHits > enHits ? "rw_keywords" : (enHits >= rwHits ? "en_keywords" : "mixed_keywords");
    if (greetings) reason = "greeting";
    else if (isTeaching && score < threshold) reason = "teaching_context";
  }

  return {
    isTraffic,
    score: +score.toFixed(2),
    rwScore: +rwHits.toFixed(2),
    enScore: +enHits.toFixed(2),
    reason,
    threshold
  };
}

export function isTeachingContext(text) {
  if (!text) return false;
  const s = String(text).toLowerCase();
  for (const kw of LEARNER_CONTEXT_KEYWORDS) {
    if (s.includes(kw)) return true;
  }
  if (/^(explain|teach|tell|show|help|what|how|when|why|where|can|should|must|is it|are we|do i|does a)\b/i.test(s.trim())) {
    if (s.length < 120) return true;
  }
  if (/^(sobanura|nsobanurira|tuma|ndigire|nkume|nkume nini|ni iki|ntegisi|mwaramutse|mwiriwe|muraho|ubwenge)\b/i.test(s.trim())) {
    return true;
  }
  return false;
}

export function isBeginner(text) {
  if (!text) return false;
  const s = String(text).toLowerCase();
  for (const kw of LEARNER_CONTEXT_KEYWORDS) {
    if (s.includes(kw)) return true;
  }
  return false;
}

export function getOffTopicResponse(language = "en") {
  return OFF_TOPIC_RESPONSES[language] || OFF_TOPIC_RESPONSES.en;
}

export function isUnsafeRequest(text) {
  if (!text) return false;
  const s = String(text).toLowerCase();
  const unsafePatterns = [
    /speed.*(without|avoid|evade|hide|not get).*(catch|police|caught|seen|ticket|camera)/,
    /(evade|avoid|escape|bypass).*(police|ticket|fine|checkpoint|roadblock)/,
    /(drink|drunk|alcohol|beer|wine|whiskey|vodka|amata|inturire).*(drive|driving|car|vehicle|modoka|gutwara)/,
    /(drive|driving|gutwara|kinyabiziga).*(drink|drunk|alcohol|beer|wine|whiskey|amata|inturire)/,
    /(how to|way to).*(cheat|bypass|break|ignore).*(rule|law|stop|sign|light)/,
    /(race|racing|drift|drifting|stunt|donut).*(public|road|street)/,
    /(without seatbelt|no seatbelt|skip.*belt|remove.*belt).*(drive|driving)/,
    /brakes?.*(not working|broken|fail|failed).*(how to|what should|what to do)/
  ];
  return unsafePatterns.some(p => p.test(s));
}

export function isEmergencyBrake(text) {
  if (!text) return false;
  const s = String(text).toLowerCase();
  return /brakes?.*(not working|broken|fail|failed|stuck|won.?t work|no brake)/i.test(s);
}
