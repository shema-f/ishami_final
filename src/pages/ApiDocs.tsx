import { useState } from 'react';
import { motion } from 'motion/react';
import {
  BookOpen, Key, Code, Zap, Globe, Copy, Check, ExternalLink,
  ArrowRight, Shield, Clock, AlertCircle, ChevronDown, ChevronRight,
  Terminal, FileJson, Layers, MessageCircle
} from 'lucide-react';

const POWERED_BY = 'Powered by Ferrivox Ltd';

const API_ENDPOINTS = [
  {
    method: 'GET',
    path: '/api/public/quiz',
    title: 'Get Quiz Questions',
    title_rw: 'Kubona Ibibazo by\'Ikizamini',
    description: 'Retrieve Rwanda traffic rules quiz questions with multiple choice options.',
    params: [
      { name: 'limit', type: 'number', default: '50', desc: 'Number of questions per page (max 100)' },
      { name: 'page', type: 'number', default: '1', desc: 'Page number for pagination' },
      { name: 'category', type: 'string', default: '', desc: 'Filter by category: speed_limits, road_signs, right_of_way, general' },
      { name: 'q', type: 'string', default: '', desc: 'Search questions by text' },
      { name: 'random', type: 'boolean', default: 'false', desc: 'Return random questions' },
      { name: 'count', type: 'number', default: '10', desc: 'Number of random questions (when random=true)' },
      { name: 'lang', type: 'string', default: 'en', desc: 'Language: en or rw' },
    ],
    example: `curl -H "X-API-Key: ishami_pub_your_key_here" \\
  "https://ishami-final.onrender.com/api/public/quiz?limit=5&category=road_signs"`,
    exampleResponse: `{
  "success": true,
  "data": [
    {
      "id": "quiz_1",
      "question": "What is the speed limit in urban & built-up areas in Rwanda?",
      "options": [
        "40 km/h — reduced near school zones",
        "60 km/h on all urban roads",
        "80 km/h in city centers",
        "No speed limit in cities"
      ],
      "correctIndex": 0,
      "explanation": "40 km/h — reduced near school zones...",
      "category": "speed_limits",
      "difficulty": "easy",
      "_poweredBy": "Powered by Ferrivox Ltd — https://ferrivox.com"
    }
  ],
  "meta": {
    "total": 25,
    "page": 1,
    "limit": 5,
    "poweredBy": "Powered by Ferrivox Ltd — https://ferrivox.com",
    "apiVersion": "1.0.0"
  },
  "_poweredBy": "Powered by Ferrivox Ltd — https://ferrivox.com"
}`,
  },
  {
    method: 'GET',
    path: '/api/public/road-signs',
    title: 'Get Road Signs',
    title_rw: 'Kubona Ibyapa by\'Umuhanda',
    description: 'Retrieve Rwanda road sign information with bilingual details.',
    params: [
      { name: 'limit', type: 'number', default: '50', desc: 'Number of signs per page' },
      { name: 'page', type: 'number', default: '1', desc: 'Page number' },
      { name: 'type', type: 'string', default: '', desc: 'Filter: mandatory, prohibition, warning, information' },
      { name: 'q', type: 'string', default: '', desc: 'Search by name or meaning' },
      { name: 'random', type: 'boolean', default: 'false', desc: 'Return random signs' },
      { name: 'count', type: 'number', default: '10', desc: 'Number of random results' },
    ],
    example: `curl -H "X-API-Key: ishami_pub_your_key_here" \\
  "https://ishami-final.onrender.com/api/public/road-signs?type=warning&limit=10"`,
    exampleResponse: `{
  "success": true,
  "data": [
    {
      "id": "rs_008",
      "name": "Pedestrian Crossing",
      "name_rw": "Kwambuka Abanyamaguru",
      "type": "warning",
      "meaning": "Pedestrian crossing ahead. Slow down and yield.",
      "meaning_rw": "Ahantu h'abanyamaguru bambuka.",
      "shape": "triangle",
      "color": "red-white",
      "_poweredBy": "Powered by Ferrivox Ltd — https://ferrivox.com"
    }
  ],
  "_poweredBy": "Powered by Ferrivox Ltd — https://ferrivox.com"
}`,
  },
  {
    method: 'GET',
    path: '/api/public/flipcards',
    title: 'Get Flip Cards',
    title_rw: 'Kubona Amakhadi',
    description: 'Retrieve bilingual flip card Q&A about Rwanda driving rules.',
    params: [
      { name: 'limit', type: 'number', default: '50', desc: 'Number of cards per page' },
      { name: 'random', type: 'boolean', default: 'false', desc: 'Return random cards' },
      { name: 'count', type: 'number', default: '10', desc: 'Number of random cards' },
    ],
    example: `curl -H "X-API-Key: ishami_pub_your_key_here" \\
  "https://ishami-final.onrender.com/api/public/flipcards?random=true&count=5"`,
    exampleResponse: `{
  "success": true,
  "data": [
    {
      "id": 1,
      "question": "What is the speed limit in urban areas?",
      "question_rw": "Umuvuduko ntarengwa mu mijyi ni uwuhe?",
      "answer": "40 km/h",
      "answer_rw": "40 km/h",
      "_poweredBy": "Powered by Ferrivox Ltd — https://ferrivox.com"
    }
  ],
  "_poweredBy": "Powered by Ferrivox Ltd — https://ferrivox.com"
}`,
  },
  {
    method: 'GET',
    path: '/api/public/status',
    title: 'API Status',
    title_rw: 'Imimerere ya API',
    description: 'Check API status and available endpoints.',
    params: [],
    example: `curl -H "X-API-Key: ishami_pub_your_key_here" \\
  "https://ishami-final.onrender.com/api/public/status"`,
    exampleResponse: `{
  "success": true,
  "data": {
    "status": "operational",
    "apiVersion": "1.0.0",
    "endpoints": ["/api/public/quiz", "/api/public/road-signs", "..."],
    "totalQuizQuestions": 25,
    "totalRoadSigns": 30,
    "totalFlipCards": 25
  },
  "_poweredBy": "Powered by Ferrivox Ltd — https://ferrivox.com"
}`,
  },
];

const CODE_EXAMPLES = [
  {
    title: 'JavaScript / Fetch',
    code: `const response = await fetch('https://ishami-final.onrender.com/api/public/quiz?limit=5', {
  headers: {
    'X-API-Key': 'ishami_pub_your_key_here'
  }
});
const data = await response.json();
console.log(data.data); // Array of quiz questions`,
  },
  {
    title: 'Python / requests',
    code: `import requests

response = requests.get(
    'https://ishami-final.onrender.com/api/public/road-signs',
    headers={'X-API-Key': 'ishami_pub_your_key_here'},
    params={'type': 'warning', 'limit': 10}
)
data = response.json()
print(data['data'])  # List of road signs`,
  },
  {
    title: 'cURL',
    code: `curl -X GET "https://ishami-final.onrender.com/api/public/quiz?limit=5&category=road_signs" \\
  -H "X-API-Key: ishami_pub_your_key_here" \\
  -H "Content-Type: application/json"`,
  },
  {
    title: 'React / useEffect',
    code: `import { useState, useEffect } from 'react';

function TrafficQuiz() {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetch('https://ishami-final.onrender.com/api/public/quiz?random=true&count=5', {
      headers: { 'X-API-Key': 'ishami_pub_your_key_here' }
    })
      .then(res => res.json())
      .then(data => setQuestions(data.data));
  }, []);

  return (
    <div>
      {questions.map(q => (
        <div key={q.id}>
          <h3>{q.question}</h3>
          {q.options.map((opt, i) => (
            <button key={i}>{opt}</button>
          ))}
        </div>
      ))}
      <footer>Powered by Ferrivox Ltd</footer>
    </div>
  );
}`,
  },
];

export default function ApiDocs() {
  const [expandedEndpoint, setExpandedEndpoint] = useState<number | null>(0);
  const [activeCodeTab, setActiveCodeTab] = useState(0);
  const [copiedCode, setCopiedCode] = useState<number | null>(null);

  const handleCopyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(index);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#080c18] pt-20">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-500/10 via-transparent to-transparent" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/10 border border-violet-500/20 rounded-full text-violet-400 text-sm font-medium mb-6">
              <Terminal className="w-4 h-4" />
              Public API v1.0.0
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-[family-name:var(--font-heading)]">
              ISHAMI Public API
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-3">
              Integrate Rwanda traffic rules, quiz questions, road signs, and flip cards into your web or mobile app.
            </p>
            <p className="text-sm text-gray-500 mb-8">
              {POWERED_BY} · All responses include Ferrivox Ltd branding
            </p>

            <div className="flex items-center justify-center gap-3">
              <a href="#endpoints" className="px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-violet-500/25 transition-all flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                View Endpoints
              </a>
              <a href="#quickstart" className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl font-semibold hover:bg-white/10 transition-all flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Quick Start
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-20">
        {/* Quick Start */}
        <section id="quickstart" className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Zap className="w-6 h-6 text-amber-400" />
            Quick Start
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { step: 1, icon: Key, title: 'Get API Key', desc: 'Request an API key from the ISHAMI admin dashboard or contact support@ishami.rw', color: 'violet' },
              { step: 2, icon: Code, title: 'Make Request', desc: 'Add your API key in the X-API-Key header and call any endpoint', color: 'blue' },
              { step: 3, icon: Layers, title: 'Build & Ship', desc: 'Use the JSON response in your app. All responses include Ferrivox Ltd branding.', color: 'emerald' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6"
              >
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

        {/* Authentication */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Shield className="w-6 h-6 text-emerald-400" />
            Authentication
          </h2>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <p className="text-sm text-gray-300 mb-4">
              All API requests require an API key passed via the <code className="px-1.5 py-0.5 bg-white/10 rounded text-violet-400 text-xs">X-API-Key</code> header.
              API keys are rate-limited (default: 60 requests/minute).
            </p>
            <div className="bg-[#0d1225] rounded-xl p-4 font-mono text-sm">
              <span className="text-gray-500"># Include your API key in the request header</span>
              <br />
              <span className="text-emerald-400">curl</span>
              <span className="text-white"> -H </span>
              <span className="text-amber-400">"X-API-Key: ishami_pub_your_key_here"</span>
              <span className="text-white"> \</span>
              <br />
              <span className="text-white ml-4">"https://ishami-final.onrender.com/api/public/quiz"</span>
            </div>

            <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-400">
              <div className="flex items-center gap-1"><Clock className="w-3 h-3" /> Rate Limit: 60 req/min</div>
              <div className="flex items-center gap-1"><Globe className="w-3 h-3" /> CORS: Enabled for all origins</div>
              <div className="flex items-center gap-1"><FileJson className="w-3 h-3" /> Format: JSON</div>
            </div>
          </div>
        </section>

        {/* Endpoints */}
        <section id="endpoints" className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Layers className="w-6 h-6 text-blue-400" />
            API Endpoints
          </h2>
          <div className="space-y-3">
            {API_ENDPOINTS.map((ep, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setExpandedEndpoint(expandedEndpoint === i ? null : i)}
                  className="w-full flex items-center gap-3 p-5 text-left hover:bg-white/5 transition-colors"
                >
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                    ep.method === 'GET' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {ep.method}
                  </span>
                  <code className="text-sm text-white font-mono flex-1">{ep.path}</code>
                  <span className="text-xs text-gray-400 hidden sm:inline">{ep.title}</span>
                  {expandedEndpoint === i ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
                </button>

                {expandedEndpoint === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="border-t border-white/5 p-5"
                  >
                    <p className="text-sm text-gray-300 mb-4">{ep.description}</p>

                    {ep.params.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Parameters</h4>
                        <div className="bg-[#0d1225] rounded-xl overflow-hidden">
                          {ep.params.map((param, pi) => (
                            <div key={pi} className={`flex items-start gap-4 px-4 py-3 ${pi > 0 ? 'border-t border-white/5' : ''}`}>
                              <code className="text-xs font-mono text-violet-400 shrink-0">{param.name}</code>
                              <span className="text-[10px] text-gray-500 shrink-0">{param.type}</span>
                              <span className="text-[10px] text-gray-500 flex-1">{param.desc}</span>
                              {param.default && <span className="text-[10px] text-gray-600">Default: {param.default}</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mb-4">
                      <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Example Request</h4>
                      <div className="bg-[#0d1225] rounded-xl p-4 font-mono text-xs text-gray-300 overflow-x-auto">
                        <pre>{ep.example}</pre>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Example Response</h4>
                      <div className="bg-[#0d1225] rounded-xl p-4 font-mono text-xs text-gray-300 overflow-x-auto max-h-64 overflow-y-auto">
                        <pre>{ep.exampleResponse}</pre>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </section>

        {/* Code Examples */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Terminal className="w-6 h-6 text-amber-400" />
            Code Examples
          </h2>
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="flex gap-1 p-2 border-b border-white/5 overflow-x-auto">
              {CODE_EXAMPLES.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => setActiveCodeTab(i)}
                  className={`px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    activeCodeTab === i
                      ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {ex.title}
                </button>
              ))}
            </div>
            <div className="relative">
              <pre className="p-5 font-mono text-xs text-gray-300 overflow-x-auto">
                {CODE_EXAMPLES[activeCodeTab].code}
              </pre>
              <button
                onClick={() => handleCopyCode(CODE_EXAMPLES[activeCodeTab].code, activeCodeTab)}
                className="absolute top-3 right-3 p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
              >
                {copiedCode === activeCodeTab ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
              </button>
            </div>
          </div>
        </section>

        {/* Rate Limits */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-amber-400" />
            Rate Limits & Errors
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-white mb-3">Rate Limits</h3>
              <div className="space-y-2 text-xs text-gray-300">
                <p>• Default: <span className="text-white font-semibold">60 requests/minute</span> per API key</p>
                <p>• Custom limits available upon request</p>
                <p>• Rate limit headers included in response</p>
                <p>• Exceeding limit returns HTTP 429</p>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-white mb-3">Error Codes</h3>
              <div className="space-y-2 font-mono text-xs">
                <div className="flex items-center gap-3">
                  <span className="text-emerald-400 w-8">200</span>
                  <span className="text-gray-400">Success</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-amber-400 w-8">401</span>
                  <span className="text-gray-400">Invalid or missing API key</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-amber-400 w-8">429</span>
                  <span className="text-gray-400">Rate limit exceeded</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-red-400 w-8">500</span>
                  <span className="text-gray-400">Internal server error</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Branding Requirement */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-violet-400" />
              Branding Requirement
            </h2>
            <p className="text-sm text-gray-300 mb-3">
              All API responses include a <code className="px-1.5 py-0.5 bg-white/10 rounded text-violet-400 text-xs">_poweredBy</code> field.
              When displaying ISHAMI API data on external websites or apps, you must include:
            </p>
            <div className="bg-[#0d1225] rounded-xl p-4 font-mono text-sm text-violet-400">
              Powered by Ferrivox Ltd — https://ferrivox.com
            </div>
            <p className="text-xs text-gray-500 mt-3">
              This can be displayed as a small footer, attribution text, or credit line on the page using the API data.
            </p>
          </div>
        </section>

        {/* Footer */}
        <div className="text-center py-8 border-t border-white/5">
          <p className="text-sm text-gray-500">
            {POWERED_BY} · ISHAMI Rwanda Driving Education Platform
          </p>
          <p className="text-xs text-gray-600 mt-2">
            For API key requests, contact <a href="mailto:support@ishami.rw" className="text-violet-400 hover:text-violet-300">support@ishami.rw</a>
          </p>
        </div>
      </div>
    </div>
  );
}
