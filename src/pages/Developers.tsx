import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Key, Code, Zap, Globe, Copy, Check, ExternalLink, ArrowRight,
  Shield, Clock, AlertCircle, ChevronDown, ChevronRight, Terminal,
  FileJson, Layers, MessageCircle, Download, BookOpen, CreditCard,
  Rocket, Star, Users, BarChart3, Plus, Trash2, Eye, EyeOff,
  Wifi, Database, HelpCircle, Sparkles, FileText, ArrowUpRight
} from 'lucide-react';
import { getAllKeys, createApiKey, getKeysForUser, revokeApiKey, reactivateApiKey, deleteApiKey, fetchServerKeyUsage, type ApiKey } from '../lib/apiKeyStore';
import PaypackPayment from '../components/PaypackPayment';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../contexts/I18nContext';

const POWERED_BY = 'Powered by Ferrivox Ltd';

const API_PLAN_META: Record<string, { label: string; cls: string }> = {
  free: { label: 'Free', cls: 'bg-slate-500/15 text-slate-400 border border-slate-500/20' },
  pro: { label: 'Pro', cls: 'bg-violet-500/15 text-violet-400 border border-violet-500/25' },
  enterprise: { label: 'Enterprise', cls: 'bg-amber-500/15 text-amber-400 border border-amber-500/25' },
};

// API access plans.
// Pro costs 10,000 RWF/month and unlocks every endpoint incl. Courses &
// Moto Sensei AI. Enterprise is for large organisations — contact customer care.
const CUSTOMER_CARE_EMAIL = 'support@ishami.rw';
const CUSTOMER_CARE_WHATSAPP = 'https://wa.me/250798603694';
const PRO_PRICE = '10,000 RWF/mo';
const PRO_PRICE_RW = 'RWF 10,000/ukwezi';

const PRICING_TIERS = [
  {
    name: 'Pro',
    name_rw: 'Pro',
    price: PRO_PRICE,
    price_rw: PRO_PRICE_RW,
    requests: '50,000 requests/month',
    requests_rw: 'Ibisabwa 50,000 mu kwezi',
    features: ['Quiz Questions', 'Road Signs', 'Flip Cards', 'Courses (amasomo)', 'Moto Sensei AI', 'Priority customer care'],
    features_rw: ['Ibibazo', 'Ibyapa', 'Amakhadi', 'Amasomo', 'Moto Sensei AI', 'Ubufasha bwihutirwa'],
    color: 'violet',
    popular: true,
    cta_en: 'Get Pro',
    cta_rw: 'Bona Pro',
  },
  {
    name: 'Enterprise',
    name_rw: 'Ikimina',
    price: 'Custom',
    price_rw: 'Bihariwe',
    requests: 'Unlimited requests',
    requests_rw: 'Ibisabwa bitagira ingano',
    features: ['Everything in Pro', 'Unlimited requests', 'Dedicated support', 'SLA guarantee', 'Custom integration'],
    features_rw: ['Ibintu byose bya Pro', 'Ibisabwa bitagira ingano', 'Ubufasha bwihariye', 'Urwego rwa serivisi (SLA)', 'Uhuza no gukemura'],
    color: 'amber',
    popular: false,
    cta_en: 'Contact Customer Care',
    cta_rw: 'Vugana Customer Care',
  },
];

const API_ENDPOINTS = [
  {
    method: 'GET',
    path: '/api/public/quiz',
    title: 'Quiz Questions',
    title_rw: 'Ibibazo by\'Ikizamini',
    desc: 'Rwanda traffic quiz with multiple choice',
    desc_rw: 'Ikizamini cy\'umuhanda mu Rwanda',
    plan: 'free',
  },
  {
    method: 'GET',
    path: '/api/public/quiz/categories',
    title: 'Quiz Categories',
    title_rw: 'Ibice by\'Ikizamini',
    desc: 'List of quiz categories',
    desc_rw: 'Urutonde rw\'ibice by\'ikizamini',
    plan: 'free',
  },
  {
    method: 'GET',
    path: '/api/public/road-signs',
    title: 'Road Signs',
    title_rw: 'Ibyapa by\'Umuhanda',
    desc: 'Rwanda road signs (bilingual)',
    desc_rw: 'Ibyapa by\'umuhanda mu Rwanda',
    plan: 'free',
  },
  {
    method: 'GET',
    path: '/api/public/road-signs/types',
    title: 'Sign Types',
    title_rw: 'Ubwoko bw\'Ibyapa',
    desc: 'Road sign type categories',
    desc_rw: 'Ibice by\'ibyapa',
    plan: 'free',
  },
  {
    method: 'GET',
    path: '/api/public/flipcards',
    title: 'Flip Cards',
    title_rw: 'Amakhadi',
    desc: 'Bilingual Q&A flip cards',
    desc_rw: 'Amakhadi y\'ibibazo n\'ibisubizo',
    plan: 'free',
  },
  {
    method: 'GET',
    path: '/api/public/flipcards/random',
    title: 'Random Cards',
    title_rw: 'Amakhadi Yerekeranyijwe',
    desc: 'Random flip card selection',
    desc_rw: 'Urwitondero rw\'amakarita',
    plan: 'free',
  },
  {
    method: 'GET',
    path: '/api/public/courses',
    title: 'Courses',
    title_rw: 'Amasomo',
    desc: 'All ISHAMI driving courses (bilingual, no curriculum)',
    desc_rw: 'Amasomo yose ya ISHAMI (mu ndimi ebyiri)',
    plan: 'pro',
  },
  {
    method: 'GET',
    path: '/api/public/courses/:courseId',
    title: 'Course Details',
    title_rw: 'Ibisobanuro by\'Isomo',
    desc: 'A single course incl. its full curriculum & lessons',
    desc_rw: 'Isomo rimwe hamwe n\'ibikubiyemo',
    plan: 'pro',
  },
  {
    method: 'POST',
    path: '/api/public/moto-sensei/ask',
    title: 'Moto Sensei AI',
    title_rw: 'Moto Sensei AI',
    desc: 'Ask Moto Sensei AI (Kinyarwanda & English) traffic questions',
    desc_rw: 'Baza Moto Sensei AI ibibazo by\'umuhanda (mu Kinyarwanda n\'Icyongereza)',
    plan: 'pro',
  },
  {
    method: 'GET',
    path: '/api/public/status',
    title: 'API Status',
    title_rw: 'Imimerere ya API',
    desc: 'Health check endpoint',
    desc_rw: 'Iparameta y\'ubuzima',
    plan: 'free',
  },
];

export default function Developers() {
  const { t, lang } = useTranslation();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [showKeyForm, setShowKeyForm] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyWebsite, setNewKeyWebsite] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});
  const [activeSection, setActiveSection] = useState<'overview' | 'docs' | 'pricing'>('overview');
  const [expandedEndpoint, setExpandedEndpoint] = useState<number | null>(null);
  const [pdfGenerating, setPdfGenerating] = useState(false);
  // Live usage + plan for each of the user's keys (from the backend when reachable)
  const [usageByKey, setUsageByKey] = useState<Record<string, { totalRequests: number; todayRequests: number; plan: string; isActive: boolean } | null>>({});
  // Key currently being upgraded to Pro (10,000 RWF) via mobile money
  const [upgradeKey, setUpgradeKey] = useState<ApiKey | null>(null);
  const [usageRefresh, setUsageRefresh] = useState(0);

  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      setApiKeys(getKeysForUser(user.id));
    }
  }, [user]);

  // Refresh each key's real usage + plan from the server
  useEffect(() => {
    const keysNow = getKeysForUser(user?.id || '');
    if (keysNow.length === 0) return;
    let cancelled = false;
    (async () => {
      for (const k of keysNow) {
        const live = await fetchServerKeyUsage(k.key);
        if (cancelled) return;
        // Trust the server plan (it is the source of truth after an upgrade)
        setUsageByKey(prev => ({ ...prev, [k.id]: live }));
      }
    })();
    return () => { cancelled = true; };
  }, [user?.id, usageRefresh]);

  const handleCreateKey = async () => {
    if (!newKeyName.trim() || !user?.id) return;
    const key = await createApiKey(newKeyName.trim(), newKeyWebsite.trim() || undefined, 60, user.id);
    setApiKeys(getKeysForUser(user.id));
    setNewKeyName('');
    setNewKeyWebsite('');
    setShowKeyForm(false);
    // Auto-show the new key
    setVisibleKeys(prev => ({ ...prev, [key.id]: true }));
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleToggleVisibility = (id: string) => {
    setVisibleKeys(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleRevoke = (id: string) => {
    revokeApiKey(id);
    if (user?.id) setApiKeys(getKeysForUser(user.id));
  };

  const handleActivate = (id: string) => {
    reactivateApiKey(id);
    if (user?.id) setApiKeys(getKeysForUser(user.id));
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this API key permanently?')) {
      deleteApiKey(id);
      if (user?.id) setApiKeys(getKeysForUser(user.id));
    }
  };

  // After a successful 10,000 RWF payment the backend upgrades the key to Pro.
  const handleUpgradeSuccess = (key: ApiKey) => {
    // Reflect the new plan locally so the UI updates instantly
    const localKeys = getAllKeys().map(k => (k.id === key.id ? { ...k, plan: 'pro' as const } : k));
    localStorage.setItem('ishami_api_keys', JSON.stringify(localKeys));
    setApiKeys(getKeysForUser(user?.id || ''));
    setUsageRefresh(v => v + 1);
    setUpgradeKey(null);
  };

  const generatePdf = async () => {
    setPdfGenerating(true);
    // Dynamic import jsPDF for code splitting
    const { default: jsPDF } = await import('jspdf');
    const doc = new jsPDF();

    // Title page
    doc.setFontSize(28);
    doc.setTextColor(0, 163, 173);
    doc.text('ISHAMI Public API', 105, 40, { align: 'center' });
    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    doc.text('Integration Guide & Documentation', 105, 52, { align: 'center' });
    doc.setFontSize(10);
    doc.text('Version 1.0.0', 105, 62, { align: 'center' });
    doc.text(`${POWERED_BY} — ISHAMI Rwanda Driving Education Platform`, 105, 72, { align: 'center' });
    doc.setDrawColor(0, 163, 173);
    doc.line(40, 78, 170, 78);

    // Getting Started
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('1. Getting Started', 20, 95);
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    const intro = [
      'The ISHAMI Public API provides access to Rwanda traffic rules data including',
      'quiz questions, road signs, and bilingual flip cards for driving education.',
      '',
      'Base URL: https://ishami-final.onrender.com/api/public',
      'Authentication: API Key via X-API-Key header',
      'Format: JSON responses',
      'Rate Limit: 60 requests/minute (default)',
    ];
    let y = 105;
    intro.forEach(line => {
      doc.text(line, 20, y);
      y += 6;
    });

    // Authentication
    y += 10;
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('2. Authentication', 20, y);
    y += 10;
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text('All requests require an API key in the X-API-Key header:', 20, y);
    y += 10;
    doc.setFont('courier', 'normal');
    doc.setFontSize(9);
    doc.text('curl -H "X-API-Key: ishami_pub_your_key_here" \\', 25, y);
    y += 6;
    doc.text('  "https://ishami-final.onrender.com/api/public/quiz"', 25, y);
    doc.setFont('helvetica', 'normal');

    // Endpoints
    y += 15;
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('3. API Endpoints', 20, y);
    y += 10;
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    API_ENDPOINTS.forEach(ep => {
      const label = `${ep.method} ${ep.path}${ep.plan === 'pro' ? '  (PRO)' : ''}`;
      doc.setFont('courier', 'bold');
      doc.setFontSize(9);
      doc.text(label, 25, y);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(`— ${ep.desc}`, 25 + doc.getTextWidth(label) + 2, y);
      y += 7;
    });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(139, 92, 246);
    doc.text('Courses & Moto Sensei AI endpoints require a Pro (10,000 RWF/month) or Enterprise API key.', 25, y + 4);

    // Page 2 - Examples
    doc.addPage();
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('4. Code Examples', 20, 25);

    doc.setFontSize(11);
    doc.text('JavaScript / Fetch', 20, 35);
    doc.setFont('courier', 'normal');
    doc.setFontSize(8);
    const jsCode = [
      "const response = await fetch('https://ishami-final.onrender.com/api/public/quiz?limit=5', {",
      "  headers: { 'X-API-Key': 'ishami_pub_your_key_here' }",
      "});",
      "const data = await response.json();",
      "console.log(data.data);",
    ];
    let codeY = 42;
    jsCode.forEach(line => { doc.text(line, 25, codeY); codeY += 5; });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text('Python / requests', 20, codeY + 8);
    doc.setFont('courier', 'normal');
    doc.setFontSize(8);
    const pyCode = [
      "import requests",
      "response = requests.get(",
      "    'https://ishami-final.onrender.com/api/public/road-signs',",
      "    headers={'X-API-Key': 'ishami_pub_your_key_here'},",
      "    params={'type': 'warning', 'limit': 10}",
      ")",
      "data = response.json()",
      "print(data['data'])",
    ];
    codeY += 15;
    pyCode.forEach(line => { doc.text(line, 25, codeY); codeY += 5; });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text('cURL', 20, codeY + 8);
    doc.setFont('courier', 'normal');
    doc.setFontSize(8);
    codeY += 15;
    doc.text('curl -X GET "https://ishami-final.onrender.com/api/public/quiz?limit=5" \\', 25, codeY);
    codeY += 5;
    doc.text('  -H "X-API-Key: ishami_pub_your_key_here" \\', 25, codeY);
    codeY += 5;
    doc.text('  -H "Content-Type: application/json"', 25, codeY);

    // Page 3 - Pricing & Branding
    doc.addPage();
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('5. Pricing Plans', 20, 25);
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    let priceY = 35;
    PRICING_TIERS.forEach(tier => {
      doc.setFont('helvetica', 'bold');
      doc.text(`${tier.name} — ${tier.price}`, 25, priceY);
      doc.setFont('helvetica', 'normal');
      doc.text(`  ${tier.requests}`, 25, priceY + 7);
      priceY += 18;
    });

    priceY += 10;
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('6. Branding Requirement', 20, priceY);
    priceY += 10;
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text('All API responses include a _poweredBy field:', 20, priceY);
    priceY += 8;
    doc.setFont('courier', 'normal');
    doc.text('"_poweredBy": "Powered by Ferrivox Ltd"', 25, priceY);
    doc.setFont('helvetica', 'normal');
    priceY += 10;
    doc.text('When displaying ISHAMI API data on external websites or apps,', 20, priceY);
    priceY += 6;
    doc.text('you must include "Powered by Ferrivox Ltd" attribution.', 20, priceY);

    priceY += 15;
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('7. Support', 20, priceY);
    priceY += 10;
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text('Email: support@ishami.rw', 20, priceY);
    priceY += 6;
    doc.text('WhatsApp Customer Care: wa.me/250798603694', 20, priceY);
    priceY += 6;
    doc.text('Website: https://ishami-final.vercel.app/api-docs', 20, priceY);
    priceY += 6;
    doc.text(`${POWERED_BY} — https://ferrivox.com`, 20, priceY);

    // Footer on every page
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(`${POWERED_BY} · ISHAMI API v1.0.0 · Page ${i}/${pageCount}`, 105, 290, { align: 'center' });
    }

    doc.save('ISHAMI-API-Integration-Guide.pdf');
    setPdfGenerating(false);
  };

  return (
    <div className="min-h-screen bg-[#080c18] pt-20">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-500/8 via-transparent to-transparent" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16 relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/10 border border-violet-500/20 rounded-full text-violet-400 text-sm font-medium mb-6">
              <Rocket className="w-4 h-4" />
              ISHAMI for Developers
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 font-[family-name:var(--font-heading)]">
              Build with{' '}
              <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                ISHAMI API
              </span>
            </h1>
            <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto mb-3">
              {t('dev.hero_sub', 'Integrate Rwanda traffic rules, quizzes, road signs, and flip cards into your app.')}
            </p>
            <p className="text-xs text-gray-500 mb-8">{POWERED_BY}</p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => setActiveSection('overview')}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-violet-500/25 transition-all flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4" />
                {t('dev.get_started_free', 'Get Started')}
              </button>
              <button
                onClick={generatePdf}
                disabled={pdfGenerating}
                className="w-full sm:w-auto px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl font-semibold hover:bg-white/10 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                {pdfGenerating ? 'Generating...' : 'Download PDF Guide'}
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        {/* Section Tabs */}
        <div className="flex gap-2 mb-10 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          {[
            { id: 'overview' as const, icon: Rocket, label: t('dev.tab_overview', 'Overview') },
            { id: 'docs' as const, icon: BookOpen, label: t('dev.tab_docs', 'Documentation') },
            { id: 'pricing' as const, icon: CreditCard, label: t('dev.tab_pricing', 'Pricing') },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
                activeSection === tab.id
                  ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* ═══ OVERVIEW SECTION ═══ */}
        {activeSection === 'overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
            {/* How it Works */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
                {t('dev.how_title', 'How It Works')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { step: 1, icon: Key, title: t('dev.step1_title', 'Generate API Key'), desc: t('dev.step1_desc', 'Create your API key below. Free keys unlock quizzes, signs & cards; Pro (10,000 RWF/mo) adds Courses & Moto Sensei AI.'), color: 'violet' },
                  { step: 2, icon: Code, title: t('dev.step2_title', 'Make Requests'), desc: t('dev.step2_desc', 'Add X-API-Key header and call any endpoint. Courses & AI need a Pro/Enterprise key.'), color: 'blue' },
                  { step: 3, icon: Layers, title: t('dev.step3_title', 'Build & Ship'), desc: t('dev.step3_desc', 'Use JSON in your app. All responses include Ferrivox Ltd branding.'), color: 'emerald' },
                ].map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6">
                    <div className={`w-10 h-10 rounded-xl bg-${item.color}-500/15 flex items-center justify-center mb-4`}>
                      <item.icon className={`w-5 h-5 text-${item.color}-400`} />
                    </div>
                    <div className="text-xs text-gray-500 mb-1">Step {item.step}</div>
                    <h3 className="text-sm font-semibold text-white mb-1">{item.title}</h3>
                    <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Quick Stats */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Database, value: '25+', label: t('dev.stat_questions', 'Quiz Questions'), color: 'blue' },
                { icon: Wifi, value: '30+', label: t('dev.stat_signs', 'Road Signs'), color: 'emerald' },
                { icon: FileJson, value: '25+', label: t('dev.stat_cards', 'Flip Cards'), color: 'violet' },
                { icon: Globe, value: '2', label: t('dev.stat_langs', 'Languages'), color: 'amber' },
              ].map((stat, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                  <stat.icon className={`w-5 h-5 text-${stat.color}-400 mx-auto mb-2`} />
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-gray-400">{stat.label}</div>
                </div>
              ))}
            </section>

            {/* API Key Generator */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Key className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
                {t('dev.keys_title', 'Generate Your API Key')}
              </h2>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6">
                {!user ? (
                  <div className="text-center py-6">
                    <Key className="w-10 h-10 text-gray-500 mx-auto mb-3" />
                    <p className="text-sm text-gray-400 mb-4">
                      {t('dev.keys_signin', 'Sign in to create and manage your API keys.')}
                    </p>
                    <a href="/auth" className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl font-semibold text-sm hover:shadow-lg transition-all">
                      {t('dev.sign_in', 'Sign In')}
                    </a>
                  </div>
                ) : (
                <>
                {apiKeys.length > 0 && (
                  <div className="mb-6 space-y-3">
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                      {t('dev.your_keys', 'Your Keys')} ({apiKeys.length})
                    </h3>
                    {apiKeys.map(key => (
                      <div key={key.id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 bg-[#0d1225] rounded-xl border border-white/5">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="text-sm font-semibold text-white">{key.name}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${key.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                              {key.isActive ? 'Active' : 'Revoked'}
                            </span>
                            {(() => {
                              const plan = usageByKey[key.id]?.plan || key.plan || 'free';
                              const meta = API_PLAN_META[plan] || API_PLAN_META.free;
                              return (
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${meta.cls}`}>
                                  {meta.label}
                                </span>
                              );
                            })()}
                          </div>
                          <div className="flex items-center gap-2">
                            <code className="text-xs text-gray-400 font-mono truncate">
                              {visibleKeys[key.id] ? key.key : key.key.slice(0, 16) + '••••••••••••'}
                            </code>
                            <button onClick={() => handleToggleVisibility(key.id)} className="p-1 text-gray-500 hover:text-white transition-colors shrink-0">
                              {visibleKeys[key.id] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                            </button>
                            <button onClick={() => handleCopyKey(key.key)} className="p-1 text-gray-500 hover:text-white transition-colors shrink-0">
                              {copiedKey === key.key ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            </button>
                          </div>
                          <div className="text-[10px] text-gray-600 mt-1">
                            {usageByKey[key.id]
                              ? `${usageByKey[key.id]!.totalRequests} requests · ${usageByKey[key.id]!.todayRequests} today`
                              : `${key.totalRequests} requests`} · {key.rateLimit}/min · Created {new Date(key.createdAt).toLocaleDateString()}
                          </div>
                          {(usageByKey[key.id]?.plan || key.plan) !== 'pro' && (usageByKey[key.id]?.plan || key.plan) !== 'enterprise' && (
                            <div className="mt-1.5 flex flex-wrap items-center gap-2">
                              <button
                                onClick={() => setUpgradeKey(key)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 hover:bg-emerald-500/20 transition-all"
                              >
                                <CreditCard className="w-3 h-3" />
                                Upgrade to Pro — 10,000 RWF (pay online)
                              </button>
                              <a href="mailto:support@ishami.rw?subject=ISHAMI API Pro upgrade request" className="text-[10px] text-violet-300 underline underline-offset-2">
                                or contact customer care
                              </a>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {key.isActive ? (
                            <button onClick={() => handleRevoke(key.id)} className="px-3 py-1.5 text-xs text-amber-400 hover:bg-amber-500/10 rounded-lg border border-amber-500/20 transition-all">
                              Revoke
                            </button>
                          ) : (
                            <button onClick={() => handleActivate(key.id)} className="px-3 py-1.5 text-xs text-emerald-400 hover:bg-emerald-500/10 rounded-lg border border-emerald-500/20 transition-all">
                              Activate
                            </button>
                          )}
                          <button onClick={() => handleDelete(key.id)} className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <AnimatePresence>
                  {showKeyForm ? (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="bg-[#0d1225] rounded-xl p-5 border border-white/5 space-y-4">
                        <h3 className="text-sm font-semibold text-white">
                          {t('dev.new_key_title', 'Create New API Key')}
                        </h3>
                        <div>
                          <label className="text-xs text-gray-400 mb-1 block">{t('dev.key_name', 'Key Name')} *</label>
                          <input
                            type="text"
                            value={newKeyName}
                            onChange={(e) => setNewKeyName(e.target.value)}
                            placeholder="e.g. My Driving School Website"
                            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-400 mb-1 block">{t('dev.website', 'Website (OPTIONAL)')}</label>
                          <input
                            type="text"
                            value={newKeyWebsite}
                            onChange={(e) => setNewKeyWebsite(e.target.value)}
                            placeholder="https://my-school.rw"
                            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                          />
                        </div>
                        <div className="flex gap-3">
                          <button onClick={handleCreateKey} disabled={!newKeyName.trim()} className="px-5 py-2.5 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl font-semibold text-sm hover:shadow-lg transition-all disabled:opacity-40">
                            {t('dev.generate_key', 'Generate Key')}
                          </button>
                          <button onClick={() => setShowKeyForm(false)} className="px-5 py-2.5 text-gray-400 hover:text-white text-sm transition-colors">
                            {t('dev.cancel', 'Cancel')}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <button onClick={() => setShowKeyForm(true)} className="w-full flex items-center justify-center gap-2 px-5 py-4 border-2 border-dashed border-white/10 rounded-xl text-gray-400 hover:text-violet-400 hover:border-violet-500/30 transition-all">
                      <Plus className="w-5 h-5" />
                      <span className="text-sm font-medium">{t('dev.new_key_btn', 'Generate New API Key')}</span>
                    </button>
                  )}
                </AnimatePresence>
                </>
                )}
              </div>
            </section>

            {/* Endpoints Quick View */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Layers className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                {t('dev.endpoints', 'Available Endpoints')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {API_ENDPOINTS.map((ep, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/8 transition-colors">
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-emerald-500/20 text-emerald-400 shrink-0">
                      {ep.method}
                    </span>
                    {ep.plan === 'pro' && (
                      <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-violet-500/15 text-violet-400 border border-violet-500/25 shrink-0">PRO</span>
                    )}
                    <div className="flex-1 min-w-0">
                      <code className="text-xs text-white font-mono truncate block">{ep.path}</code>
                      <span className="text-[10px] text-gray-500">{lang === 'rw' ? ep.title_rw : ep.title}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Branding Notice */}
            <section>
              <div className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20 rounded-2xl p-5 sm:p-6">
                <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-violet-400" />
                  {t('dev.branding', 'Branding Requirement')}
                </h3>
                <p className="text-sm text-gray-300 mb-3">
                  {t('dev.branding_desc', 'All responses include a _poweredBy field. When displaying ISHAMI API data, you must credit Ferrivox Ltd.')}
                </p>
                <div className="bg-[#0d1225] rounded-xl p-4 font-mono text-sm text-violet-400">
                  {POWERED_BY} — https://ferrivox.com
                </div>
              </div>
            </section>
          </motion.div>
        )}

        {/* ═══ DOCUMENTATION SECTION ═══ */}
        {activeSection === 'docs' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
            {/* Authentication */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
                {t('dev.auth', 'Authentication')}
              </h2>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6">
                <p className="text-sm text-gray-300 mb-4">
                  {t('dev.auth_desc', 'All API requests require an API key passed via the X-API-Key header. Rate limit: 60 requests/minute.')}
                </p>
                <p className="text-xs text-gray-400 mb-4">
                  Quizzes, road signs, flip cards & status are open to every key. <b className="text-violet-300">Courses</b> and{' '}
                  <b className="text-violet-300">Moto Sensei AI</b> need a <b className="text-violet-300">Pro</b> (10,000 RWF/month) or{' '}
                  <b className="text-amber-300">Enterprise</b> key. Ask an ISHAMI admin to set your key to Pro/Enterprise after subscribing.
                </p>
                <div className="bg-[#0d1225] rounded-xl p-4 font-mono text-sm overflow-x-auto">
                  <span className="text-gray-500"># Include your API key</span><br />
                  <span className="text-emerald-400">curl</span><span className="text-white"> -H </span><span className="text-amber-400">"X-API-Key: ishami_pub_your_key_here"</span><span className="text-white"> \</span><br />
                  <span className="text-white ml-4">"https://ishami-final.onrender.com/api/public/quiz"</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-400">
                  <div className="flex items-center gap-1"><Clock className="w-3 h-3" /> Rate Limit: 60 req/min</div>
                  <div className="flex items-center gap-1"><Globe className="w-3 h-3" /> CORS: All origins</div>
                  <div className="flex items-center gap-1"><FileJson className="w-3 h-3" /> Format: JSON</div>
                </div>
              </div>
            </section>

            {/* Endpoint Details */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Terminal className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
                {t('dev.all_endpoints', 'All Endpoints')}
              </h2>
              <div className="space-y-3">
                {API_ENDPOINTS.map((ep, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                    <button onClick={() => setExpandedEndpoint(expandedEndpoint === i ? null : i)} className="w-full flex items-center gap-3 p-4 sm:p-5 text-left hover:bg-white/5 transition-colors">
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-500/20 text-emerald-400 shrink-0">{ep.method}</span>
                      {ep.plan === 'pro' && (
                        <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-violet-500/15 text-violet-400 border border-violet-500/25 shrink-0">PRO</span>
                      )}
                      <code className="text-sm text-white font-mono flex-1 truncate">{ep.path}</code>
                      <span className="text-xs text-gray-400 hidden sm:inline">{lang === 'rw' ? ep.title_rw : ep.title}</span>
                      {expandedEndpoint === i ? <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" /> : <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />}
                    </button>
                    {expandedEndpoint === i && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="border-t border-white/5 p-4 sm:p-5">
                        <p className="text-sm text-gray-300 mb-3">{lang === 'rw' ? ep.title_rw : ep.desc}</p>
                        {ep.plan === 'pro' && (
                          <p className="text-xs text-violet-300 mb-3">
                            🔒 Requires a <b>Pro</b> or <b>Enterprise</b> key — Pro is 10,000 RWF/month. Free keys receive 403 for this endpoint.
                          </p>
                        )}
                        <div className="bg-[#0d1225] rounded-xl p-4 font-mono text-xs text-gray-300 overflow-x-auto">
                          <pre>{`curl -H "X-API-Key: your_key" "https://ishami-final.onrender.com${ep.path}"`}</pre>
                        </div>
                        <div className="mt-3 bg-[#0d1225] rounded-xl p-4 font-mono text-xs text-gray-300 overflow-x-auto max-h-40 overflow-y-auto">
                          <pre>{`{
  "success": true,
  "data": [ ... ],
  "_poweredBy": "Powered by Ferrivox Ltd — https://ferrivox.com"
}`}</pre>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Code Examples */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Code className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
                {t('dev.code_examples', 'Code Examples')}
              </h2>
              <div className="space-y-4">
                {[
                  {
                    title: 'JavaScript / Fetch',
                    code: `const response = await fetch('https://ishami-final.onrender.com/api/public/quiz?limit=5', {\n  headers: {\n    'X-API-Key': 'ishami_pub_your_key_here'\n  }\n});\nconst data = await response.json();\nconsole.log(data.data);`,
                  },
                  {
                    title: 'Python / requests',
                    code: `import requests\n\nresponse = requests.get(\n    'https://ishami-final.onrender.com/api/public/road-signs',\n    headers={'X-API-Key': 'ishami_pub_your_key_here'},\n    params={'type': 'warning', 'limit': 10}\n)\ndata = response.json()\nprint(data['data'])`,
                  },
                  {
                    title: 'React / useEffect',
                    code: `import { useState, useEffect } from 'react';\n\nfunction TrafficQuiz() {\n  const [questions, setQuestions] = useState([]);\n\n  useEffect(() => {\n    fetch('https://ishami-final.onrender.com/api/public/quiz?random=true&count=5', {\n      headers: { 'X-API-Key': 'ishami_pub_your_key_here' }\n    })\n      .then(res => res.json())\n      .then(data => setQuestions(data.data));\n  }, []);\n\n  return (\n    <div>\n      {questions.map(q => (\n        <div key={q.id}>\n          <h3>{q.question}</h3>\n          {q.options.map((opt, i) => (\n            <button key={i}>{opt}</button>\n          ))}\n        </div>\n      ))}\n      <footer>Powered by Ferrivox Ltd</footer>\n    </div>\n  );\n}`,
                  },
                  {
                    title: 'cURL',
                    code: `curl -X GET "https://ishami-final.onrender.com/api/public/quiz?limit=5&category=road_signs" \\\n  -H "X-API-Key: ishami_pub_your_key_here" \\\n  -H "Content-Type: application/json"`,
                  },
                  {
                    title: 'Courses (fetch)',
                    code: `fetch('https://ishami-final.onrender.com/api/public/courses?level=Beginner', {
  headers: { 'X-API-Key': 'ishami_pub_your_key_here' }
})
  .then(res => res.json())
  .then(data => console.log(data.data)); // Requires Pro/Enterprise key`,
                  },
                  {
                    title: 'Moto Sensei AI (fetch)',
                    code: `// Ask Moto Sensei AI a traffic question in Kinyarwanda or English
const res = await fetch('https://ishami-final.onrender.com/api/public/moto-sensei/ask', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'ishami_pub_your_key_here'
  },
  body: JSON.stringify({
    message: "Ni iki icyapa cya STOP gisobanura?",
    history: []
  })
});
const data = await res.json();
console.log(data.data.response); // Requires Pro/Enterprise key`,
                  },
                  {
                    title: 'cURL — Moto Sensei AI',
                    code: `curl -X POST "https://ishami-final.onrender.com/api/public/moto-sensei/ask" \
  -H "X-API-Key: ishami_pub_your_key_here" \
  -H "Content-Type: application/json" \
  -d '{"message": "What does a STOP sign mean?"}'`,
                  },
                ].map((example, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
                      <span className="text-sm font-semibold text-white">{example.title}</span>
                      <button
                        onClick={() => { navigator.clipboard.writeText(example.code); }}
                        className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
                      >
                        <Copy className="w-3 h-3" /> Copy
                      </button>
                    </div>
                    <pre className="p-5 font-mono text-xs text-gray-300 overflow-x-auto whitespace-pre-wrap">{example.code}</pre>
                  </div>
                ))}
              </div>
            </section>

            {/* Errors */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
                {t('dev.errors', 'Error Codes')}
              </h2>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6">
                <div className="space-y-3 font-mono text-sm">
                  {[
                    { code: '200', label: 'Success', color: 'emerald' },
                    { code: '400', label: 'Bad request — missing/invalid parameters (e.g. no question for Moto Sensei AI)', color: 'amber' },
                    { code: '401', label: 'Invalid or missing API key', color: 'amber' },
                    { code: '403', label: 'Plan required — Courses & Moto Sensei AI need a Pro (10,000 RWF/mo) or Enterprise key', color: 'violet' },
                    { code: '404', label: 'Not found (e.g. unknown course id)', color: 'amber' },
                    { code: '429', label: 'Rate limit exceeded', color: 'amber' },
                    { code: '500', label: 'Internal server error', color: 'red' },
                  ].map((err, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <span className={`text-${err.color}-400 w-10 font-bold`}>{err.code}</span>
                      <span className="text-gray-400">{err.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </motion.div>
        )}

        {/* ═══ PRICING SECTION ═══ */}
        {activeSection === 'pricing' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
            <section className="text-center mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 flex items-center justify-center gap-2">
                <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-violet-400" />
                {t('dev.pricing', 'API Pricing')}
              </h2>
              <p className="text-sm text-gray-400 max-w-xl mx-auto">
                {lang === 'rw'
                  ? 'Hitamo umugambi ukugendera. Pro ni 10,000 RWF ku kwezi kandi ufungura Amasomo na Moto Sensei AI; kuri Enterprise, vugana customer care yacu.'
                  : 'Choose the plan that fits your needs. Pro is 10,000 RWF/month and unlocks Courses & Moto Sensei AI; for Enterprise contact our customer care.'}
              </p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PRICING_TIERS.map((tier, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`relative bg-white/5 border rounded-2xl p-6 sm:p-8 ${
                    tier.popular ? 'border-violet-500/40 shadow-lg shadow-violet-500/10' : 'border-white/10'
                  }`}
                >
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-violet-500 to-purple-600 text-white text-xs font-bold rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3" /> Most Popular
                    </div>
                  )}
                  <div className={`w-12 h-12 rounded-xl bg-${tier.color}-500/15 flex items-center justify-center mb-4`}>
                    {i === 0 ? <Zap className={`w-6 h-6 text-${tier.color}-400`} /> : i === 1 ? <Rocket className={`w-6 h-6 text-${tier.color}-400`} /> : <Shield className={`w-6 h-6 text-${tier.color}-400`} />}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">{lang === 'rw' ? tier.name_rw : tier.name}</h3>
                  <div className="text-2xl font-bold text-white mb-1">{lang === 'rw' ? tier.price_rw : tier.price}</div>
                  <p className="text-xs text-gray-500 mb-6">{lang === 'rw' ? tier.requests_rw : tier.requests}</p>
                  <ul className="space-y-3 mb-8">
                    {(lang === 'rw' ? tier.features_rw : tier.features).map((f, fi) => (
                      <li key={fi} className="flex items-center gap-2 text-sm text-gray-300">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a
                    href={`mailto:${CUSTOMER_CARE_EMAIL}?subject=${encodeURIComponent('ISHAMI API — ' + (lang === 'rw' ? tier.name_rw : tier.name) + ' subscription request')}`}
                    className={`w-full py-3 rounded-xl font-semibold text-sm transition-all text-center block ${
                      tier.popular
                        ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:shadow-lg hover:shadow-violet-500/25'
                        : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                    }`}
                  >
                    {lang === 'rw' ? tier.cta_rw : tier.cta_en}
                  </a>
                </motion.div>
              ))}
            </div>

            {/* Support */}
            <section className="text-center">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 inline-block">
                <HelpCircle className="w-8 h-8 text-violet-400 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white mb-2">
                  {t('dev.custom_title', 'Need custom pricing?')}
                </h3>
                <p className="text-sm text-gray-400 mb-4">
                  {t('dev.custom_desc', 'Contact our team for enterprise solutions and custom pricing.')}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a href="mailto:support@ishami.rw" className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-500/20 text-violet-400 rounded-xl font-semibold text-sm hover:bg-violet-500/30 transition-all">
                    <MessageCircle className="w-4 h-4" />
                    {CUSTOMER_CARE_EMAIL}
                  </a>
                  <a href={CUSTOMER_CARE_WHATSAPP} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 rounded-xl font-semibold text-sm hover:bg-emerald-500/25 transition-all">
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp Customer Care
                  </a>
                </div>
              </div>
            </section>
          </motion.div>
        )}

        {/* Footer */}
        <div className="text-center py-8 mt-12 border-t border-white/5">
          <p className="text-sm text-gray-500">{POWERED_BY} · ISHAMI Rwanda Driving Education Platform</p>
          <p className="text-xs text-gray-600 mt-2">
            {t('dev.footer_key', 'For API key requests, contact')}{' '}
            <a href="mailto:support@ishami.rw" className="text-violet-400 hover:text-violet-300">support@ishami.rw</a>
          </p>
          {user?.role === 'admin' && (
            <p className="text-xs text-gray-600 mt-2">
              <a href="/admin/api-keys" className="text-violet-400 hover:text-violet-300">
                {t('dev.admin', 'API Key Management (Admin)')}
              </a>
            </p>
          )}
        </div>
      </div>

      {/* Upgrade-to-Pro payment modal (Paypack mobile money) */}
      <AnimatePresence>
        {upgradeKey && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto py-10"
            onClick={() => setUpgradeKey(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 16 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md"
            >
              <div className="mb-3 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/10 border border-violet-500/25 rounded-full text-violet-300 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  Pro — 10,000 RWF/mo · Courses & Moto Sensei AI
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Upgrading: <code className="font-mono text-white">{upgradeKey.name}</code>
                </p>
              </div>
              <PaypackPayment
                key={upgradeKey.id}
                amount={10000}
                product="api_pro"
                apiKeyId={upgradeKey.id}
                onSuccess={() => handleUpgradeSuccess(upgradeKey)}
                onCancel={() => setUpgradeKey(null)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
