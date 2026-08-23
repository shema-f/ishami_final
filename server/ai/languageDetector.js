const KINYARWANDA_STOPWORDS = new Set([
  "ni", "na", "n'", "ya", "wa", "ba", "ka", "ke", "ki", "cy", "ry",
  "mu", "ku", "ku", "ya", "za", "bo", "be", "bi", "by", "ry",
  "nk'", "nd", "mb", "nt", "nz", "mp", "mf", "ng", "ny",
  "ubwo", "kugira", "kugira", "igo", "igice", "icyo", "ubwo",
  "umuntu", "umuhanda", "abantu", "ibintu", "imihanda",
  "aho", "ubu", "uryo", "uku", "ubu", "uko", "ngo", "gukoresha",
  "gufasha", "kubona", "gusobanukirwa", "gushigikiriza", "kumenya",
  "mwaramutse", "mwiriwe", "muraho", "murakaza", "neza", "cyane",
  "mbega", "rero", "nanone", "kandi", "ababyeyi", "umwana",
  "inkomane", "isangano", "icyapa", "ibyapa", "umuvuduko",
  "ikizamini", "kwiga", "permi", "gutwara", "imbaraga",
  "nk'umuntu", "nk'ibyo", "ubwoko", "intambwe", "akarusho",
  "gupaka", "guhagarara", "kugenda", "kugera", "kwambuka",
  "hantu", "ahantu", "uryo", "nk", "mb", "mf", "mp", "nt",
  "sinumva", "ntabwo", "hari", "nta", "ntacyo", "ndi", "niye",
  "ndetse", "ukoresheje", "ibyo", "byose", "ose", "bose",
  "nziza", "iza", "mbi", "byiza", "neza", "kiza",
  "gushika", "gukurikira", "kwibanda", "gusubiza", "gusubiza inyuma"
]);

const ENGLISH_STOPWORDS = new Set([
  "the", "a", "an", "is", "are", "was", "were", "be", "been", "being",
  "have", "has", "had", "do", "does", "did", "will", "would", "could",
  "should", "may", "might", "can", "shall", "must", "ought", "i", "you",
  "he", "she", "it", "we", "they", "them", "their", "our", "your", "my",
  "his", "her", "its", "this", "that", "these", "those", "here", "there",
  "where", "when", "why", "how", "what", "which", "who", "whom", "and",
  "or", "but", "if", "then", "else", "so", "because", "of", "in", "on",
  "at", "to", "for", "with", "from", "by", "about", "as", "into",
  "through", "during", "before", "after", "above", "below", "between",
  "under", "over", "again", "further", "once", "more", "most", "other",
  "some", "such", "no", "nor", "not", "only", "own", "same", "than",
  "too", "very", "just", "hello", "hi", "hey", "please", "help",
  "explain", "tell", "teach", "show", "know", "learn", "understand",
  "stop", "sign", "road", "traffic", "drive", "car", "vehicle",
  "parking", "turn", "left", "right", "speed", "limit", "intersection",
  "roundabout", "give", "way", "yield", "pedestrian", "crossing",
  "seatbelt", "brake", "light", "red", "green", "amber", "yellow",
  "motorway", "highway", "lane", "overtake", "horn", "mirror",
  "license", "permit", "exam", "test", "question", "answer", "quiz",
  "driving", "drive", "driver", "learner", "beginner", "practice"
]);

const KINY_CHAR_NGRAMS = new Set([
  "ny", "mb", "mp", "mf", "nt", "nd", "nz", "ng", "nk", "nkw",
  "cy", "gy", "jy", "my", "py", "ry", "sy", "ty", "vy", "zy",
  "aa", "ee", "ii", "oo", "uu", "ia", "io", "ua", "uo", "ea", "oe",
  "um", "im", "ik", "ib", "uwo", "uyu", "ubw", "ub", "ig", "icy",
  "aha", "umu", "iba", "ibi", "ama", "aka", "ata", "ity", "izi",
  "ku", "mu", "ya", "wa", "ba", "za", "ra", "ka", "ta", "na",
  "gu", "ku", "bi", "bo", "be", "bu", "rw", "du", "tu", "zu"
]);

function tokenize(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^\w\s'-]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function charNgrams(text, n = 2) {
  const s = String(text || "").toLowerCase().replace(/\s+/g, " ");
  const grams = new Set();
  for (let i = 0; i <= s.length - n; i++) {
    grams.add(s.slice(i, i + n));
  }
  return grams;
}

function scoreKinyarwanda(text) {
  let score = 0;
  const tokens = tokenize(text);
  for (const t of tokens) {
    if (KINYARWANDA_STOPWORDS.has(t)) score += 2;
    if (/^[a-z]+[aeiou]$/.test(t) && t.length >= 2) score += 0.2;
    if (/^(um|im|ik|ib|uwo|uyu|ubw|ub|ig|icy|aha|iba|ibi|ama|aka|ata|ity|izi|mu|ku|ya|wa|ba|za|ra|ka|ta|na|gu|bi|bo|be|bu|rw|du|tu|zu)/.test(t)) score += 0.5;
    if (/^(n'|nk'|mb|mp|mf|nt|nd|nz|ng|ny|cy|gy|jy|my|py|ry|sy|ty|vy|zy)/.test(t)) score += 0.8;
  }
  const bigrams = charNgrams(text, 2);
  for (const g of bigrams) {
    if (KINY_CHAR_NGRAMS.has(g)) score += 0.15;
  }
  if (/[aeiouAEIOU]{2,}/.test(text)) score += 0.3;
  if (/\b(ni|na|ya|wa|ba|mu|ku|ka|ke|za|bi|bo|be|ry|cy|igi|icy|umu|iba|ibi|ama|aka|ata|ity|izi|aha|nk'|n'|mb|mp|mf|nt|nd|nz|ng|ny|mwaramutse|mwiriwe|muraho|neza|cyane|sinumva|ntabwo|nkomane|isangano|icyapa|ibyapa|umuvuduko|ikizamini|permi|gutwara|gupaka|guhagarara|kugenda|rond-point|gusonga|kwanyuranaho|umubare|amatara|feri|akayira|umusatsi)\b/i.test(text)) {
    score += 3;
  }
  return score;
}

function scoreEnglish(text) {
  let score = 0;
  const tokens = tokenize(text);
  for (const t of tokens) {
    if (ENGLISH_STOPWORDS.has(t)) score += 2;
    if (/\b(ing|ed|ly|tion|sion|ment|ness|able|ible|ful|less|ous|ive|al|er|or|ist|ism|ity|ty|ship|hood|dom|ure|ance|ence|ant|ent|ary|ery|ory|ify|ize|ise)\b/.test(t)) score += 0.6;
    if (/^(th|ch|sh|wh|ph|kn|wr|qu|gh|bl|br|cl|cr|dr|fl|fr|gl|gr|pl|pr|sc|sk|sl|sm|sn|sp|st|sw|tr|tw)/.test(t)) score += 0.25;
  }
  if (/\b(stop|sign|road|traffic|drive|car|vehicle|park|turn|left|right|speed|limit|intersection|roundabout|give|way|yield|pedestrian|cross|crossing|seat|belt|seatbelt|brake|light|red|green|amber|yellow|motor|motorway|highway|lane|overtake|horn|mirror|license|permit|exam|test|question|answer|quiz|driving|driver|learner|beginner|practice|police|safety|hazard|danger|caution|pedestrian|walker)\b/i.test(text)) {
    score += 3;
  }
  if (/\b(a|an|the|is|are|was|were|be|have|has|had|do|does|did|will|would|could|should|can|shall|must|i|you|he|she|it|we|they|this|that|these|those|and|or|but|if|because|of|in|on|at|to|for|with|from|by|about|as|into|through|before|after|above|below|what|which|who|where|when|why|how)\b/i.test(text)) {
    score += 1;
  }
  return score;
}

export function detectLanguage(text) {
  const raw = String(text || "").trim();
  if (!raw) return { language: "en", confidence: "low", enScore: 0, rwScore: 0, mixed: false };

  const rw = scoreKinyarwanda(raw);
  const en = scoreEnglish(raw);

  let language = "en";
  let confidence = "low";
  let mixed = false;

  const threshold = 1.5;
  const diff = Math.abs(rw - en);
  const maxScore = Math.max(rw, en);

  if (rw > en && rw - en > threshold) {
    language = "rw";
    confidence = diff > 5 ? "high" : (diff > 2 ? "medium" : "low");
  } else if (en > rw && en - rw > threshold) {
    language = "en";
    confidence = diff > 5 ? "high" : (diff > 2 ? "medium" : "low");
  } else {
    mixed = true;
    language = rw >= en ? "rw" : "en";
    confidence = maxScore > threshold ? "medium" : "low";
  }

  if (maxScore < threshold) {
    confidence = "low";
  }

  return { language, confidence, enScore: +en.toFixed(2), rwScore: +rw.toFixed(2), mixed };
}

export function dominantLanguage(text) {
  const d = detectLanguage(text);
  return d.language;
}
