/**
 * ISHAMI Public API — Key Management & Usage Tracking Store
 * localStorage-backed for lightweight persistence.
 * Ferrivox Ltd © 2025
 */

import { flipCardQuestions } from '../data/flipcardQuestions';
import { articles } from '../data/articles';

// ─── Types ─────────────────────────────────────────────────

export interface ApiKey {
  id: string;
  key: string;           // The public API key (ishami_pub_xxxx)
  name: string;          // Friendly name e.g. "My Website"
  website?: string;      // Originating website URL
  createdAt: string;
  lastUsedAt?: string;
  isActive: boolean;
  rateLimit: number;     // requests per minute
  totalRequests: number;
}

export interface ApiUsageRecord {
  id: string;
  apiKeyId: string;
  endpoint: string;
  timestamp: string;
  origin?: string;       // HTTP Origin header
  ip?: string;           // simulated
  responseTime: number;  // ms
  success: boolean;
  httpStatus: number;
}

export interface ApiUsageSummary {
  totalRequests: number;
  todayRequests: number;
  topEndpoints: { endpoint: string; count: number }[];
  topKeys: { keyId: string; keyName: string; count: number }[];
  requestsOverTime: { date: string; count: number }[];
  errorRate: number;
}

// ─── Constants ─────────────────────────────────────────────

const KEYS_STORAGE_KEY = 'ishami_api_keys';
const USAGE_STORAGE_KEY = 'ishami_api_usage';
const RATE_LIMIT_WINDOW = 60_000; // 1 minute

// ─── Key Management ────────────────────────────────────────

function generateKeyId(): string {
  return 'key_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function generateApiKey(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = 'ishami_pub_';
  for (let i = 0; i < 32; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export function getAllKeys(): ApiKey[] {
  try {
    const data = localStorage.getItem(KEYS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveKeys(keys: ApiKey[]): void {
  localStorage.setItem(KEYS_STORAGE_KEY, JSON.stringify(keys));
}

export function createApiKey(name: string, website?: string, rateLimit: number = 60): ApiKey {
  const keys = getAllKeys();
  const newKey: ApiKey = {
    id: generateKeyId(),
    key: generateApiKey(),
    name,
    website,
    createdAt: new Date().toISOString(),
    isActive: true,
    rateLimit,
    totalRequests: 0,
  };
  keys.push(newKey);
  saveKeys(keys);
  return newKey;
}

export function revokeApiKey(keyId: string): void {
  const keys = getAllKeys();
  const key = keys.find(k => k.id === keyId);
  if (key) {
    key.isActive = false;
    saveKeys(keys);
  }
}

export function reactivateApiKey(keyId: string): void {
  const keys = getAllKeys();
  const key = keys.find(k => k.id === keyId);
  if (key) {
    key.isActive = true;
    saveKeys(keys);
  }
}

export function deleteApiKey(keyId: string): void {
  const keys = getAllKeys().filter(k => k.id !== keyId);
  saveKeys(keys);
  // Also clean up usage records
  const usage = getAllUsage().filter(u => u.apiKeyId !== keyId);
  saveUsage(usage);
}

export function validateApiKey(key: string): ApiKey | null {
  const keys = getAllKeys();
  const found = keys.find(k => k.key === key && k.isActive);
  if (!found) return null;

  // Check rate limit
  const usage = getAllUsage();
  const now = Date.now();
  const recentRequests = usage.filter(
    u => u.apiKeyId === found.id && new Date(u.timestamp).getTime() > now - RATE_LIMIT_WINDOW
  );
  if (recentRequests.length >= found.rateLimit) {
    return null; // Rate limited
  }

  return found;
}

export function recordUsage(
  apiKeyId: string,
  endpoint: string,
  origin: string | undefined,
  responseTime: number,
  success: boolean,
  httpStatus: number
): void {
  const usage = getAllUsage();
  const record: ApiUsageRecord = {
    id: 'use_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    apiKeyId,
    endpoint,
    timestamp: new Date().toISOString(),
    origin,
    responseTime,
    success,
    httpStatus,
  };
  usage.push(record);

  // Keep only last 10,000 records
  if (usage.length > 10000) {
    usage.splice(0, usage.length - 10000);
  }

  saveUsage(usage);

  // Update key's total requests and lastUsedAt
  const keys = getAllKeys();
  const key = keys.find(k => k.id === apiKeyId);
  if (key) {
    key.totalRequests++;
    key.lastUsedAt = new Date().toISOString();
    saveKeys(keys);
  }
}

// ─── Usage Tracking ────────────────────────────────────────

export function getAllUsage(): ApiUsageRecord[] {
  try {
    const data = localStorage.getItem(USAGE_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveUsage(usage: ApiUsageRecord[]): void {
  localStorage.setItem(USAGE_STORAGE_KEY, JSON.stringify(usage));
}

export function getUsageSummary(): ApiUsageSummary {
  const usage = getAllUsage();
  const keys = getAllKeys();
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  const todayRecords = usage.filter(u => u.timestamp.startsWith(todayStr));

  // Top endpoints
  const endpointCounts: Record<string, number> = {};
  usage.forEach(u => {
    endpointCounts[u.endpoint] = (endpointCounts[u.endpoint] || 0) + 1;
  });
  const topEndpoints = Object.entries(endpointCounts)
    .map(([endpoint, count]) => ({ endpoint, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Top keys
  const keyCounts: Record<string, number> = {};
  usage.forEach(u => {
    keyCounts[u.apiKeyId] = (keyCounts[u.apiKeyId] || 0) + 1;
  });
  const topKeys = Object.entries(keyCounts)
    .map(([keyId, count]) => {
      const key = keys.find(k => k.id === keyId);
      return { keyId, keyName: key?.name || 'Unknown', count };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Requests over time (last 7 days)
  const requestsOverTime: { date: string; count: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const count = usage.filter(u => u.timestamp.startsWith(dateStr)).length;
    requestsOverTime.push({ date: dateStr, count });
  }

  // Error rate
  const errors = usage.filter(u => !u.success).length;
  const errorRate = usage.length > 0 ? (errors / usage.length) * 100 : 0;

  return {
    totalRequests: usage.length,
    todayRequests: todayRecords.length,
    topEndpoints,
    topKeys,
    requestsOverTime,
    errorRate: Math.round(errorRate * 100) / 100,
  };
}

export function getUsageForKey(keyId: string): ApiUsageRecord[] {
  return getAllUsage().filter(u => u.apiKeyId === keyId);
}

// ─── Public API Data ───────────────────────────────────────

export interface PublicQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  explanation_rw: string;
  category: string;
  difficulty: string;
  _poweredBy: string;
}

export interface PublicRoadSign {
  id: string;
  name: string;
  name_rw: string;
  type: string;
  meaning: string;
  meaning_rw: string;
  shape: string;
  color: string;
  image_url: string;
  _poweredBy: string;
}

export interface PublicFlipCard {
  id: number;
  question: string;
  question_rw: string;
  answer: string;
  answer_rw: string;
  _poweredBy: string;
}

const POWERED_BY = 'Powered by Ferrivox Ltd — https://ferrivox.com';

// Road signs dataset for the public API
const ROAD_SIGNS_DATA: Omit<PublicRoadSign, '_poweredBy'>[] = [
  { id: 'rs_001', name: 'Stop Sign', name_rw: 'Icyapa cya STOP', type: 'mandatory', meaning: 'You must come to a complete stop before the stop line or intersection.', meaning_rw: 'Ugomba guhagarara neza mbere yo ku murongo wo guhagarara cyangwa isangano.', shape: 'octagon', color: 'red', image_url: '' },
  { id: 'rs_002', name: 'Speed Limit 40', name_rw: 'Umuvuduko Ntarengwa 40', type: 'prohibition', meaning: 'Maximum speed is 40 km/h. Common in urban and built-up areas.', meaning_rw: 'Umuvuduko ntarengwa ni 40 km/h. Bisanzwe mu mijyi no mu nsisiro.', shape: 'circle', color: 'red-white', image_url: '' },
  { id: 'rs_003', name: 'Speed Limit 60', name_rw: 'Umuvuduko Ntarengwa 60', type: 'prohibition', meaning: 'Maximum speed is 60 km/h. Common on rural roads.', meaning_rw: 'Umuvuduko ntarengwa ni 60 km/h. Bisanzwe ku mihanda yo hanze y\'umujyi.', shape: 'circle', color: 'red-white', image_url: '' },
  { id: 'rs_004', name: 'Speed Limit 80', name_rw: 'Umuvuduko Ntarengwa 80', type: 'prohibition', meaning: 'Maximum speed is 80 km/h. Found on major highways.', meaning_rw: 'Umuvuduko ntarengwa ni 80 km/h. Buboneka ku gariyandiko.', shape: 'circle', color: 'red-white', image_url: '' },
  { id: 'rs_005', name: 'No Overtaking', name_rw: 'Ntukinyuranaho', type: 'prohibition', meaning: 'Overtaking is strictly prohibited in this zone.', meaning_rw: 'Kunyuranaho birabujijwe mu gice ici.', shape: 'circle', color: 'red-white', image_url: '' },
  { id: 'rs_006', name: 'No Entry', name_rw: 'Ntwinjire', type: 'prohibition', meaning: 'Entry is prohibited. Do not enter this road.', meaning_rw: 'Kwinjira birabujijwe. Ntujye mu muhanda ubu.', shape: 'circle', color: 'red-white', image_url: '' },
  { id: 'rs_007', name: 'No Parking', name_rw: 'Ntuhagare', type: 'prohibition', meaning: 'Parking is prohibited at any time in this area.', meaning_rw: 'Guhagarika birabujijwe mu gihe cose mu gice ici.', shape: 'circle', color: 'blue-red', image_url: '' },
  { id: 'rs_008', name: 'Pedestrian Crossing', name_rw: 'Kwambuka Abanyamaguru', type: 'warning', meaning: 'Pedestrian crossing ahead. Slow down and yield to pedestrians.', meaning_rw: 'Ahantu h\'abanyamaguru bambuka. Gabanya umuvuduko kandi utegereze.', shape: 'triangle', color: 'red-white', image_url: '' },
  { id: 'rs_009', name: 'School Zone', name_rw: 'Ahantu h\'Ashuri', type: 'warning', meaning: 'School zone ahead. Reduce speed and watch for children.', meaning_rw: 'Ashuri ari imbere. Gabanya umuvuduko ukagire abana.', shape: 'triangle', color: 'red-white', image_url: '' },
  { id: 'rs_010', name: 'Hospital Zone', name_rw: 'Ahantu h\'Ibitaro', type: 'warning', meaning: 'Hospital ahead. Reduce speed and be prepared to stop.', meaning_rw: 'Ibitaro ari imbere. Gabanya umuvuduko kandi utegereze guhagarara.', shape: 'triangle', color: 'red-white', image_url: '' },
  { id: 'rs_011', name: 'Roundabout Ahead', name_rw: 'Rond-Point Imbere', type: 'warning', meaning: 'Roundabout ahead. Yield to vehicles already in the roundabout.', meaning_rw: 'Rond-point ari imbere. Tegereza ibinyabiziga biri muri yo.', shape: 'triangle', color: 'red-white', image_url: '' },
  { id: 'rs_012', name: 'Yield', name_rw: 'Tegereza', type: 'mandatory', meaning: 'Slow down and prepare to stop if necessary. Give way to traffic on the main road.', meaning_rw: 'Gabanya umuvuduko utegereze guhagarara niba birakenewe. Tegera abandi bakabanza.', shape: 'triangle', color: 'red-white', image_url: '' },
  { id: 'rs_013', name: 'One Way', name_rw: 'Inzira Imwe', type: 'mandatory', meaning: 'Traffic flows only in the direction of the arrow.', meaning_rw: 'Ibinyabiziga bigendera mu direction y\'akamere gusa.', shape: 'rectangle', color: 'blue', image_url: '' },
  { id: 'rs_014', name: 'Traffic Light Ahead', name_rw: 'Amatara y\'Umuhanda Imbere', type: 'warning', meaning: 'Traffic lights ahead. Be prepared to stop at the red light.', meaning_rw: 'Amatara y\'umuhanda ari imbere. Tegereze guhagarara iyo yataye ituku.', shape: 'triangle', color: 'red-white', image_url: '' },
  { id: 'rs_015', name: 'Roundabout', name_rw: 'Rond-Point', type: 'mandatory', meaning: 'Navigate around the central island. Vehicles inside have right of way.', meaning_rw: 'Kuzenguruka akarere. Ibyabiziga biri mubwo bifite uburenganzira.', shape: 'circle', color: 'blue', image_url: '' },
  { id: 'rs_016', name: 'Steep Hill Down', name_rw: 'Musozi Muremure Hasi', type: 'warning', meaning: 'Steep descent ahead. Use engine braking and lower gears.', meaning_rw: 'Musozi muremure hasi. Koresha feri ya moteri na vitesi ntoya.', shape: 'triangle', color: 'red-white', image_url: '' },
  { id: 'rs_017', name: 'Sharp Curve', name_rw: 'Imfuruka Itsekura', type: 'warning', meaning: 'Sharp curve ahead. Reduce speed before entering the curve.', meaning_rw: 'Imfuruka itsekura imbere. Gabanya umuvuduko mbere yo kwinjira.', shape: 'triangle', color: 'red-white', image_url: '' },
  { id: 'rs_018', name: 'Narrow Road', name_rw: 'Umuhanda Muto', type: 'warning', meaning: 'Road narrows ahead from both sides.', meaning_rw: 'Umuhanda ugabanuka imbere ku buryo bubiri.', shape: 'triangle', color: 'red-white', image_url: '' },
  { id: 'rs_019', name: 'Slippery Road', name_rw: 'Umuhanda Uhonya', type: 'warning', meaning: 'Road surface may be slippery. Reduce speed and avoid sudden braking.', meaning_rw: 'Umuhanda bushobora kuba uhonya. Gabanya umuvuduko kandi wirinde feri y\'umwimerere.', shape: 'triangle', color: 'red-white', image_url: '' },
  { id: 'rs_020', name: 'Tunnel Ahead', name_rw: 'Tunnel Imbere', type: 'warning', meaning: 'Tunnel ahead. Turn on headlights and maintain safe distance.', meaning_rw: 'Tunnel ari imbere. Tegura amatara kandi ubane n\'intera y\'umutekano.', shape: 'triangle', color: 'red-white', image_url: '' },
  { id: 'rs_021', name: 'Bridge', name_rw: 'I Bridge', type: 'warning', meaning: 'Bridge ahead. Slow down and stay in your lane.', meaning_rw: 'I bridge ari imbere. Gabanya umuvuduko kandi ugume mu rukendero rwawe.', shape: 'triangle', color: 'red-white', image_url: '' },
  { id: 'rs_022', name: 'Traffic Signals', name_rw: 'Ibimenyetso by\'Umuhanda', type: 'warning', meaning: 'Traffic signals ahead. Prepare to stop if light is red.', meaning_rw: 'Ibimenyetso by\'umuhanda biri imbere. Tegereze guhagarara iyo itaye ituku.', shape: 'triangle', color: 'red-white', image_url: '' },
  { id: 'rs_023', name: 'Minimum Speed', name_rw: 'Umuvuduko Muto', type: 'mandatory', meaning: 'Minimum speed is 30 km/h. Do not drive slower than indicated.', meaning_rw: 'Umuvuduko muto ni 30 km/h. Ntugende hasi y\'ibyerekanwa.', shape: 'circle', color: 'blue', image_url: '' },
  { id: 'rs_024', name: 'Direction Right', name_rw: 'Iburyo', type: 'mandatory', meaning: 'You must turn right or keep right.', meaning_rw: 'Ugomba guhindura iburyo cyangwa kuguma iburyo.', shape: 'circle', color: 'blue', image_url: '' },
  { id: 'rs_025', name: 'Direction Left', name_rw: 'Ibumoso', type: 'mandatory', meaning: 'You must turn left or keep left.', meaning_rw: 'Ugomba guhindura ibumoso cyangwa kuguma ibumoso.', shape: 'circle', color: 'blue', image_url: '' },
  { id: 'rs_026', name: 'Go Straight', name_rw: 'Kugenda Imbere', type: 'mandatory', meaning: 'Proceed straight ahead only.', meaning_rw: 'Komeza imbere gusa.', shape: 'circle', color: 'blue', image_url: '' },
  { id: 'rs_027', name: 'Pedestrian Path', name_rw: 'Inzira y\'Abanyamaguru', type: 'information', meaning: 'Designated pedestrian path. Drivers must not enter.', meaning_rw: 'Inzira yagenewe abanyamaguru. Abagenzi ntibagombwe kwinjira.', shape: 'rectangle', color: 'blue', image_url: '' },
  { id: 'rs_028', name: 'Bus Stop', name_rw: 'Ahantu ho Gufatiramo', type: 'information', meaning: 'Bus stop ahead. Do not park within 10 meters.', meaning_rw: 'Ahantu ho gufatiramo imodoka zitwara abagenzi. Ntuhagare hasi y\'ametero 10.', shape: 'rectangle', color: 'blue', image_url: '' },
  { id: 'rs_029', name: 'Hospital', name_rw: 'Ibitaro', type: 'information', meaning: 'Hospital nearby. Drive carefully and quietly.', meaning_rw: 'Ibitaro biri hafi. Twara neza kandi utararimbe.', shape: 'rectangle', color: 'blue', image_url: '' },
  { id: 'rs_030', name: 'No Stopping', name_rw: 'Ntuhagare Na Gato', type: 'prohibition', meaning: 'Stopping is prohibited at any time, even to drop off passengers.', meaning_rw: 'Guhagarika birabujijwe mu gihe cose, n\'igihe ugushakisha abagenzi.', shape: 'circle', color: 'blue-red', image_url: '' },
];

function buildQuizQuestions(): PublicQuizQuestion[] {
  const allQuestions: PublicQuizQuestion[] = [];

  // Use flipcard questions as quiz questions
  flipCardQuestions.forEach((fc, idx) => {
    // Generate plausible distractors
    const distractors = [
      'Follow the traffic officer\'s hand signals',
      'Maintain your current speed and proceed',
      'Sound your horn to warn others',
      'Turn on your hazard lights immediately',
      'Increase your speed to pass quickly',
      'Park on the nearest available spot',
    ];
    const shuffled = distractors.sort(() => Math.random() - 0.5).slice(0, 3);
    const correctAnswer = fc.answer_en;
    const options = [correctAnswer, ...shuffled].sort(() => Math.random() - 0.5);
    const correctIndex = options.indexOf(correctAnswer);

    allQuestions.push({
      id: `quiz_${fc.id}`,
      question: fc.question_en,
      options,
      correctIndex,
      explanation: fc.answer_en,
      explanation_rw: fc.answer_kiny,
      category: idx < 6 ? 'speed_limits' : idx < 12 ? 'road_signs' : idx < 18 ? 'right_of_way' : 'general',
      difficulty: idx < 8 ? 'easy' : idx < 16 ? 'medium' : 'hard',
      _poweredBy: POWERED_BY,
    });
  });

  return allQuestions;
}

function buildRoadSigns(): PublicRoadSign[] {
  return ROAD_SIGNS_DATA.map(s => ({ ...s, _poweredBy: POWERED_BY }));
}

function buildFlipCards(): PublicFlipCard[] {
  return flipCardQuestions.map(fc => ({
    id: fc.id,
    question: fc.question_en,
    question_rw: fc.question_kiny,
    answer: fc.answer_en,
    answer_rw: fc.answer_kiny,
    _poweredBy: POWERED_BY,
  }));
}

// ─── API Endpoint Handlers ─────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: {
    total: number;
    page: number;
    limit: number;
    poweredBy: string;
    apiVersion: string;
  };
  _poweredBy: string;
}

const API_VERSION = '1.0.0';

export function handlePublicApiRequest(
  endpoint: string,
  params: URLSearchParams,
  apiKey: ApiKey
): ApiResponse<any> {
  const limit = Math.min(parseInt(params.get('limit') || '50'), 100);
  const page = Math.max(parseInt(params.get('page') || '1'), 1);
  const lang = params.get('lang') || 'en';
  const category = params.get('category') || null;
  const search = params.get('q')?.toLowerCase() || null;
  const random = params.get('random') === 'true';
  const count = Math.min(parseInt(params.get('count') || '10'), 50);

  const baseMeta = {
    poweredBy: POWERED_BY,
    apiVersion: API_VERSION,
  };

  switch (endpoint) {
    case '/api/public/quiz': {
      let questions = buildQuizQuestions();
      if (category) questions = questions.filter(q => q.category === category);
      if (search) questions = questions.filter(q => q.question.toLowerCase().includes(search));
      if (random) {
        questions = questions.sort(() => Math.random() - 0.5).slice(0, count);
      } else {
        const start = (page - 1) * limit;
        questions = questions.slice(start, start + limit);
      }
      return {
        success: true,
        data: questions,
        meta: { total: questions.length, page, limit, ...baseMeta },
        _poweredBy: POWERED_BY,
      };
    }

    case '/api/public/quiz/categories': {
      const cats = [...new Set(buildQuizQuestions().map(q => q.category))];
      return {
        success: true,
        data: cats.map(c => ({ id: c, name: c.replace(/_/g, ' '), _poweredBy: POWERED_BY })),
        meta: { total: cats.length, page: 1, limit: cats.length, ...baseMeta },
        _poweredBy: POWERED_BY,
      };
    }

    case '/api/public/road-signs': {
      let signs = buildRoadSigns();
      if (category) signs = signs.filter(s => s.type === category);
      if (search) {
        signs = signs.filter(s =>
          s.name.toLowerCase().includes(search) ||
          s.meaning.toLowerCase().includes(search) ||
          s.name_rw.includes(search)
        );
      }
      if (random) {
        signs = signs.sort(() => Math.random() - 0.5).slice(0, count);
      } else {
        const start = (page - 1) * limit;
        signs = signs.slice(start, start + limit);
      }
      return {
        success: true,
        data: signs,
        meta: { total: signs.length, page, limit, ...baseMeta },
        _poweredBy: POWERED_BY,
      };
    }

    case '/api/public/road-signs/types': {
      const types = [...new Set(buildRoadSigns().map(s => s.type))];
      return {
        success: true,
        data: types.map(t => ({ id: t, name: t, _poweredBy: POWERED_BY })),
        meta: { total: types.length, page: 1, limit: types.length, ...baseMeta },
        _poweredBy: POWERED_BY,
      };
    }

    case '/api/public/flipcards': {
      let cards = buildFlipCards();
      if (random) {
        cards = cards.sort(() => Math.random() - 0.5).slice(0, count);
      } else {
        const start = (page - 1) * limit;
        cards = cards.slice(start, start + limit);
      }
      return {
        success: true,
        data: cards,
        meta: { total: cards.length, page, limit, ...baseMeta },
        _poweredBy: POWERED_BY,
      };
    }

    case '/api/public/flipcards/random': {
      const cards = buildFlipCards();
      const shuffled = cards.sort(() => Math.random() - 0.5).slice(0, count);
      return {
        success: true,
        data: shuffled,
        meta: { total: shuffled.length, page: 1, limit: count, ...baseMeta },
        _poweredBy: POWERED_BY,
      };
    }

    case '/api/public/status': {
      return {
        success: true,
        data: {
          status: 'operational',
          apiVersion: API_VERSION,
          endpoints: [
            '/api/public/quiz',
            '/api/public/quiz/categories',
            '/api/public/road-signs',
            '/api/public/road-signs/types',
            '/api/public/flipcards',
            '/api/public/flipcards/random',
          ],
          totalQuizQuestions: buildQuizQuestions().length,
          totalRoadSigns: buildRoadSigns().length,
          totalFlipCards: buildFlipCards().length,
        },
        meta: { total: 1, page: 1, limit: 1, ...baseMeta },
        _poweredBy: POWERED_BY,
      };
    }

    default:
      return {
        success: false,
        error: `Unknown endpoint: ${endpoint}. See https://ishami.rw/api-docs for available endpoints.`,
        _poweredBy: POWERED_BY,
      };
  }
}

// ─── Seed demo data for analytics ──────────────────────────

export function seedDemoApiData(): void {
  const keys = getAllKeys();
  if (keys.length > 0) return; // Already seeded

  // Create demo API keys
  const demoKeys = [
    createApiKey('ISHAMI Main Website', 'https://ishami.rw', 120),
    createApiKey('Rwanda Driving School App', 'https://rwanda-driving.rw', 60),
    createApiKey('Traffic Quiz Mobile App', 'https://traffic-quiz.com', 30),
  ];

  // Generate some demo usage
  const usage = getAllUsage();
  const endpoints = ['/api/public/quiz', '/api/public/road-signs', '/api/public/flipcards', '/api/public/status'];
  const now = Date.now();

  for (let day = 6; day >= 0; day--) {
    const dayDate = new Date(now - day * 86400000);
    const numRequests = Math.floor(Math.random() * 50) + 10;
    for (let i = 0; i < numRequests; i++) {
      const keyIdx = Math.floor(Math.random() * demoKeys.length);
      const epIdx = Math.floor(Math.random() * endpoints.length);
      const hour = Math.floor(Math.random() * 24);
      const minute = Math.floor(Math.random() * 60);
      const ts = new Date(dayDate);
      ts.setHours(hour, minute, Math.floor(Math.random() * 60));

      usage.push({
        id: `use_demo_${day}_${i}`,
        apiKeyId: demoKeys[keyIdx].id,
        endpoint: endpoints[epIdx],
        timestamp: ts.toISOString(),
        origin: demoKeys[keyIdx].website,
        responseTime: Math.floor(Math.random() * 200) + 20,
        success: Math.random() > 0.05,
        httpStatus: Math.random() > 0.05 ? 200 : (Math.random() > 0.5 ? 429 : 500),
      });
    }
  }

  saveUsage(usage);
}
