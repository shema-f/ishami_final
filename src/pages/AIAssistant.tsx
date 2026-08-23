import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Sparkles, MessageCircle, Bot, User, ArrowUp, Shield, BookOpen, AlertTriangle, Languages, CheckCircle2, HelpCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { aiAPI } from '../services/api';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
  image?: string | null;
  structured?: any;
}

interface AIStructured {
  language?: 'en' | 'rw' | 'mixed';
  intent?: string;
  topic?: string;
  confidence?: 'high' | 'medium' | 'low';
  sources?: Array<{ type: string; id: string; confidence: string }>;
  explanation?: string | null;
  example?: string | null;
  safety_note?: string | null;
  warnings?: string[];
  retrievedCount?: number;
  topScore?: number;
}

const TOPIC_LABELS: Record<string, { en: string; rw: string; icon: string }> = {
  road_signs: { en: 'Road Signs', rw: 'Ibyapa by\'Umuhanda', icon: '🚦' },
  speed_limits: { en: 'Speed Limits', rw: 'Umuvuduko Ntarengwa', icon: '⚡' },
  right_of_way: { en: 'Right of Way', rw: 'Uburenganzira bwo Kugenda Mbere', icon: '🔀' },
  overtaking: { en: 'Overtaking', rw: 'Kwanyuranaho', icon: '➡️' },
  parking_stopping: { en: 'Parking & Stopping', rw: 'Gupaka no Guhagarara', icon: '🅿️' },
  turning_signals: { en: 'Turning / Signals', rw: 'Kugena no Kumenyesha', icon: '↪️' },
  traffic_lights: { en: 'Traffic Lights', rw: 'Amatara y\'Umuhanda', icon: '🚥' },
  pedestrians: { en: 'Pedestrians', rw: 'Abanyamaguru', icon: '🚶' },
  emergency_vehicles: { en: 'Emergency Vehicles', rw: 'Ibigoryo c\'Agakiza', icon: '🚑' },
  vehicle_controls: { en: 'Vehicle Controls', rw: 'Ibizice by\'Ikinyabiziga', icon: '🚗' },
  road_safety: { en: 'Road Safety', rw: 'Umutekano w\'Umuhanda', icon: '🛡️' },
  exam_mode: { en: 'Exam Practice', rw: 'Amahugurwa y\'Ikizamini', icon: '📝' },
  scenario_mode: { en: 'Driving Scenario', rw: 'Imishinga yo Gutwara', icon: '🎬' },
  road_markings: { en: 'Road Markings', rw: 'Imirongo y\'Umuhanda', icon: '➖' },
  definitions: { en: 'Definitions', rw: 'Amagambo y\'Ubwenge', icon: '📖' },
  conversation: { en: 'General', rw: 'Amakuru', icon: '💬' },
  general: { en: 'Traffic', rw: 'Amategeko y\'Umuhanda', icon: '🚧' },
};

const suggestedPromptsEN = [
  'What does a STOP sign mean?',
  'Explain right-of-way rules',
  'What are the speed limits in Rwanda?',
  'Teach me how to park on a hill',
  'Give me 5 exam questions about signs',
  'I am approaching a roundabout, what do I do?',
];

const suggestedPromptsRW = [
  'Ni iki icyapa cya STOP gisobanura?',
  'Nsobanurira uburyo bwo kureka abandi bakabanza',
  'Amategeko y\'umuvuduko ntarengwa m\'u Rwanda ni iki?',
  'Niga nte gupaka ahantu hasa?',
  'Mpa ibibazo 5 by\'ikizamini ku byapa',
  'Ngeze kuri rond-point, bikwiye gukorwa iki?',
];

const mixedPrompts = [
  'Ni nde ufite priority kuri roundabout?',
  'Sinumva right of way, nsobanurire',
  'Uko ugeze kuri stop sign, ufite iki kugira?',
];

const detectSentiment = (text: string): string => {
  const lower = text.toLowerCase();
  if (lower.match(/\b(stupid|hate|bad|useless|angry|ibi byawe|ntabwo|fuck|shit)\b/)) return 'angry';
  if (lower.match(/\b(thanks|thank|great|good|awesome|wow|neza|cyane|murakoze)\b/)) return 'happy';
  if (lower.match(/\b(hello|hi|hey|mwaramutse|mwiriwe|salut|boss|afande|muraho|bonjour)\b/)) return 'saluting';
  if (lower.match(/\b(sad|sorry|cry|hurt|scared|afraid|impanuka|umubabaro|mbabara|ntabwo vyose)\b/)) return 'sad';
  return 'neutral';
};

const detectUiLangHint = (text: string) => {
  const s = text.toLowerCase();
  const rwHits = ['ni ', ' na ', ' ya ', ' ku ', ' mu ', ' icyapa', ' ibyapa', ' umuvuduko', ' gupaka', ' guhagarara', ' kwanyuranaho', ' isangano', ' inkomane', ' rond', ' abanyamaguru', ' amatara', ' feri', ' igitiri', ' umurobe', ' ikizamini', ' permi', ' gutwara', ' kwiga', ' neza', ' cyane', ' sinumva', ' murakoze', ' mwaramutse', ' mwiriwe', ' muraho'].filter(k => s.includes(k)).length;
  const enHits = [' stop', ' sign', ' road', ' traffic', ' drive', ' car', ' park', ' turn', ' speed', ' limit', ' lane', ' overtake', ' roundabout', ' intersection', ' pedestrian', ' crossing', ' seatbelt', ' brake', ' light', ' exam', ' test', ' quiz', ' license', ' safety', ' beginner', ' explain'].filter(k => s.includes(k)).length;
  return rwHits > enHits ? 'rw' : enHits > rwHits ? 'en' : 'mixed';
};

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Muraho! 👋 Ndi Moto-Sensei — umunyamwuga w'uburyo bwo gutwara mu Rwanda. Kumbabare inkuzaze ku byapa, amategeko y'umuhanda, umutekano, amahugurwa y'ikizamini cyangwa ibitekerezo byo guhiga.\n\nHi there! I'm Moto-Sensei — your Rwanda traffic rules AI instructor. Ask me anything about signs, rules, safety, exams, or driving scenarios.\n\n#GerayoAmahoro 🇷🇼🚦",
      isUser: false,
      timestamp: new Date(),
      structured: { language: 'mixed', intent: 'greeting', topic: 'conversation', confidence: 'high' },
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);
  const [uiLang, setUiLang] = useState<'en' | 'rw' | 'mixed'>('mixed');
  const [aiStatus, setAiStatus] = useState<any>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  // While streaming, only auto-scroll if the user is already near the bottom.
  // This keeps the page steady and scrollable — reading is never interrupted,
  // and the view never jumps to the footer mid-stream.
  const stickToBottomRef = useRef(true);
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  // Monotonic message ids: `prev.length + 1` collided after the error path
  // removed a message ("Encountered two children with the same key").
  const nextMsgIdRef = useRef(2);
  const nextMsgId = () => nextMsgIdRef.current++;

  const handleChatScroll = () => {
    const el = chatRef.current;
    if (!el) return;
    stickToBottomRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
  };

  useEffect(() => {
    const el = chatRef.current;
    if (el && stickToBottomRef.current) el.scrollTop = el.scrollHeight;
  }, [messages]);

  useEffect(() => {
    return () => { abortControllerRef.current?.abort(); };
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const s = await aiAPI.getStatus();
        setAiStatus(s);
      } catch {}
    })();
  }, []);

  const simulateTyping = async (response: { text: string; structured?: any }) => {
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 900));
    setIsTyping(false);
    const newMessage: Message = {
      id: nextMsgId(),
      text: response.text,
      isUser: false,
      timestamp: new Date(),
      structured: response.structured || null,
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const streamTyping = async (
    prompt: string,
    sentiment: string,
    history: Array<{ role: string; content: string }>,
    controller: AbortController
  ) => {
    let accText = '';
    let finalStructured: any = null;
    const msgId = nextMsgId();
    setMessages(prev => [
      ...prev,
      { id: msgId, text: '', isUser: false, timestamp: new Date(), structured: null }
    ]);
    try {
      const final = await aiAPI.askAssistantStream(
        prompt,
        {
          onStart: () => { setIsTyping(true); },
          onToken: (chunk) => {
            if (!chunk) return;
            accText += chunk;
            setMessages(prev => prev.map(m => m.id === msgId ? { ...m, text: accText } : m));
          },
          onDone: (f) => {
            setIsTyping(false);
            finalStructured = f.structured || null;
            setMessages(prev => prev.map(m => m.id === msgId ? { ...m, text: f.text || accText, structured: f.structured || m.structured } : m));
          },
          onError: () => { setIsTyping(false); }
        },
        sentiment,
        history,
        controller.signal
      );
      if (final && final.text && final.text !== accText) {
        setMessages(prev => prev.map(m => m.id === msgId ? { ...m, text: final.text, structured: final.structured || m.structured } : m));
      }
      return { text: final?.text || accText, structured: final?.structured || finalStructured };
    } catch (streamErr: any) {
      setMessages(prev => prev.filter(m => m.id !== msgId));
      setIsTyping(false);
      if (streamErr?.name === 'AbortError') throw streamErr;
      return null;
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    if (!user?.isPro && questionCount >= 5) {
      setShowPaywall(true);
      return;
    }
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;
    const sentiment = detectSentiment(input);
    const detected = detectUiLangHint(input);
    if (detected !== 'mixed') setUiLang(detected);
    const now = new Date();
    const userText = input;
    setMessages(prev => [...prev, { id: nextMsgId(), text: userText, isUser: true, timestamp: now }]);
    setInput('');
    setQuestionCount(prev => prev + 1);
    setIsLoading(true);
    const startIndex = Math.max(1, messages.length - 10);
    const history = messages.slice(startIndex).map(msg => ({
      role: msg.isUser ? 'user' : 'model',
      content: msg.text,
    }));
    try {
      let streamed = null;
      try {
        streamed = await streamTyping(userText, sentiment, history, controller);
      } catch (e: any) {
        if (e?.name === 'AbortError') { setIsLoading(false); return; }
        streamed = null;
      }
      if (!streamed) {
        const res = await aiAPI.askAssistant(userText, sentiment, history, controller.signal);
        await simulateTyping({ text: res.text, structured: res.structured });
      }
    } catch (e: any) {
      if (e?.name === 'AbortError') return;
      const m = String(e?.message || '');
      const rateLimited = /429/.test(m) || /rate limit/i.test(m);
      const lang = uiLang;
      const text = rateLimited
        ? (lang === 'rw' ? "Wasabye byinshi icyarimwe. Ongeza gutegereza hanyuma wongere. #GerayoAmahoro" : "Too many requests right now. Please wait a moment and try again. #GerayoAmahoro")
        : (lang === 'rw' ? "Seriveri ifite ikibazo. Ongera ugerageze nyuma y'akanya. #GerayoAmahoro" : "The AI engine ran into a temporary issue. Please try again shortly. #GerayoAmahoro");
      await simulateTyping({ text, structured: { language: lang, intent: 'error', topic: 'general', confidence: 'medium', warnings: ['server_error'] } });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
  };

  const shareToWhatsApp = (messageText: string) => {
    const appLink = "https://ishami.rw";
    const fullText = `🧑🏿‍🏫 *Inama ya Moto-Sensei (Ishami.rw):*\n\n${messageText}\n\n--- \n📍 *Koresha Ishami App nawe utsinde ikizamini:* ${appLink}`;
    const encodedMessage = encodeURIComponent(fullText);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const ConfidenceBadge = ({ c }: { c?: 'high' | 'medium' | 'low' }) => {
    if (!c) return null;
    const map = {
      high: { color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', label: uiLang === 'rw' ? 'Kumenya neza' : 'High confidence' },
      medium: { color: 'bg-amber-500/20 text-amber-300 border-amber-500/30', label: uiLang === 'rw' ? 'Guteranya' : 'Medium confidence' },
      low: { color: 'bg-rose-500/20 text-rose-300 border-rose-500/30', label: uiLang === 'rw' ? 'Nta mpuhwe' : 'Low confidence' },
    };
    const { color, label } = map[c] || map.medium;
    return (
      <span className={`inline-flex items-center gap-1 text-[11px] border rounded-full px-2 py-0.5 ${color}`}>
        {c === 'high' ? <CheckCircle2 className="w-3 h-3" /> : c === 'low' ? <AlertTriangle className="w-3 h-3" /> : <HelpCircle className="w-3 h-3" />}
        {label}
      </span>
    );
  };

  const TopicBadge = ({ s }: { s?: AIStructured }) => {
    if (!s?.topic) return null;
    const t = TOPIC_LABELS[s.topic] || TOPIC_LABELS.general;
    const label = s.language === 'rw' ? t.rw : s.language === 'en' ? t.en : `${t.icon} ${t.en} / ${t.rw}`;
    return (
      <span className="inline-flex items-center gap-1 text-[11px] rounded-full px-2 py-0.5 bg-sky-500/15 text-sky-300 border border-sky-500/25">
        <span>{t.icon}</span>
        <span className="truncate max-w-[180px]">{label}</span>
      </span>
    );
  };

  const promptsToShow =
    uiLang === 'rw' ? suggestedPromptsRW : uiLang === 'en' ? suggestedPromptsEN : [...suggestedPromptsEN.slice(0, 2), ...mixedPrompts, ...suggestedPromptsRW.slice(0, 2)];

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="fixed top-20 right-10 w-72 h-72 bg-green-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed bottom-10 left-10 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto pt-16">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-green-500 rounded-2xl blur-xl opacity-30" />
              <div className="relative w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/30">
                <Bot className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 font-[family-name:var(--font-heading)]">Moto-Sensei</h1>
          <p className="text-gray-400">
            {uiLang === 'rw' ? "Umunyamwuga w'Amategeko y'Umuhanda — Rwanda" : "Rwanda Traffic Rules AI Instructor"}
          </p>
          <div className="flex flex-wrap justify-center items-center gap-2 mt-3 text-[11px] text-gray-400">
            <span className="inline-flex items-center gap-1 bg-white/5 border border-white/10 rounded-full px-2 py-0.5">
              <Languages className="w-3 h-3" /> Kinyarwanda + English
            </span>
            <span className="inline-flex items-center gap-1 bg-white/5 border border-white/10 rounded-full px-2 py-0.5">
              <Shield className="w-3 h-3" /> {uiLang === 'rw' ? "Kubera umutekano" : "Safety validated"}
            </span>
            <span className="inline-flex items-center gap-1 bg-white/5 border border-white/10 rounded-full px-2 py-0.5">
              <BookOpen className="w-3 h-3" /> {uiLang === 'rw' ? "Imyandiko isigaye" : "Verified knowledge"}
            </span>
            {aiStatus && (
              <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 rounded-full px-2 py-0.5">
                Engine: {aiStatus.engine}
              </span>
            )}
          </div>
          {!user?.isPro && (
            <p className="text-sm text-yellow-400 mt-2 font-medium">
              {5 - questionCount} {uiLang === 'rw' ? "ibibazo bisigaye (bisanze)" : "free questions remaining"}
            </p>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-6">
          <div className="flex flex-wrap gap-2 justify-center">
            {promptsToShow.map((prompt, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                onClick={() => handlePromptClick(prompt)}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-gray-300 hover:bg-white/10 hover:border-white/20 hover:text-white hover:shadow-lg hover:shadow-white/5 transition-all duration-300 max-w-[280px] truncate"
              >
                {prompt}
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
          <div ref={chatRef} onScroll={handleChatScroll} className="h-[520px] overflow-y-auto p-6 space-y-4 custom-scrollbar">
            {messages.map((message) => (
              <motion.div key={message.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[82%] ${message.isUser ? 'order-2' : 'order-1'}`}>
                  {!message.isUser && (
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-lg bg-green-500/20 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-green-400" />
                      </div>
                      <span className="text-sm text-gray-500">Moto-Sensei</span>
                      <TopicBadge s={message.structured} />
                      <ConfidenceBadge c={message.structured?.confidence} />
                    </div>
                  )}
                  {message.isUser && (
                    <div className="flex items-center gap-2 mb-2 justify-end">
                      <span className="text-sm text-gray-500">You</span>
                      <div className="w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center">
                        <User className="w-4 h-4 text-blue-400" />
                      </div>
                    </div>
                  )}
                  <div className={`p-4 rounded-2xl leading-relaxed whitespace-pre-wrap ${message.isUser ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-tr-sm' : 'bg-white/10 text-white rounded-tl-sm border border-white/5'}`}>
                    <p className="whitespace-pre-wrap">{message.text}</p>
                    {message.structured?.safety_note && message.structured.safety_note.trim() && !message.text.includes(message.structured.safety_note.slice(0, 20)) && (
                      <div className="mt-3 p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-200 text-xs">
                        ⚠️ {message.structured.safety_note}
                      </div>
                    )}
                    {message.structured?.sources && message.structured.sources.length > 0 && !message.isUser && (
                      <div className="mt-2 flex flex-wrap gap-1 text-[10px] text-gray-400">
                        <span className="opacity-70">{uiLang === 'rw' ? "Inyandiko zibonetswe:" : "Sources:"}</span>
                        {message.structured.sources.slice(0, 4).map((s: any, i: number) => (
                          <span key={i} className="bg-white/5 border border-white/5 rounded px-1.5 py-0.5">
                            {s.type.replace(/_/g, ' ')} · {String(s.id || '').slice(0, 18)}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  {!message.isUser && (
                    <button onClick={() => shareToWhatsApp(message.text)} className="flex items-center gap-2 text-green-400 hover:text-green-300 text-sm mt-2 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      {uiLang === 'rw' ? "Tungura WhatsApp" : "Share on WhatsApp"}
                    </button>
                  )}
                </div>
              </motion.div>
            ))}

            <AnimatePresence>
              {isTyping && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex justify-start">
                  <div className="max-w-[82%]">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-lg bg-green-500/20 flex items-center justify-center"><Bot className="w-4 h-4 text-green-400" /></div>
                      <span className="text-sm text-gray-500">Moto-Sensei {uiLang === 'rw' ? "yandika..." : "is thinking..."}</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/10 border border-white/5 rounded-tl-sm">
                      <div className="flex gap-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          <div className="border-t border-white/10 p-4 bg-white/5">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => { setInput(e.target.value); const d = detectUiLangHint(e.target.value); if (d !== 'mixed') setUiLang(d); }}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder={uiLang === 'rw' ? "Kubaza icyo ukeneye ku mategeko y'umuhanda..." : uiLang === 'en' ? "Ask about traffic rules, signs, exams, safety..." : "Kubaza / Ask: amategeko, ibyapa, ikizamini..."}
                className="flex-1 px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500 transition-all"
                disabled={isTyping || isLoading}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSend}
                disabled={isTyping || !input.trim() || isLoading}
                className="px-5 py-4 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-2xl hover:shadow-lg hover:shadow-green-500/30 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-1"
              >
                {isLoading ? <Sparkles className="w-5 h-5 animate-pulse" /> : <ArrowUp className="w-5 h-5" />}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {showPaywall && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowPaywall(false)}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} onClick={(e) => e.stopPropagation()} className="bg-[#111827] rounded-3xl p-8 max-w-md w-full border border-white/10 shadow-2xl">
            <div className="text-center">
              <div className="inline-flex p-4 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-3xl mb-6 shadow-lg shadow-yellow-500/30">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2 font-[family-name:var(--font-heading)]">{uiLang === 'rw' ? "Hinduriza Pro" : "Upgrade to Pro"}</h2>
              <p className="text-gray-400 mb-6">
                {uiLang === 'rw'
                  ? "Ukoresheje ibibazo 5 bisanzwe! Vugura Pro ugire ibibazo byose bidakemera Moto-Sensei — 1,000 RWF gusa."
                  : "You've used your 5 free questions! Unlock unlimited Moto-Sensei AI assistance for only 1,000 RWF."}
              </p>
              <div className="space-y-3">
                <button className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-green-500/30 transition-all duration-300">
                  {uiLang === 'rw' ? "Guhinduriza Pro — 1,000 RWF" : "Upgrade Now — 1,000 RWF"}
                </button>
                <button onClick={() => setShowPaywall(false)} className="w-full px-6 py-3 text-gray-400 hover:text-white transition-colors">
                  {uiLang === 'rw' ? "Nyuma yo" : "Maybe Later"}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
