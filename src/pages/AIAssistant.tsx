import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Sparkles, MessageCircle, Bot, User, ArrowUp, Shield, BookOpen, AlertTriangle, Languages, CheckCircle2, HelpCircle, Plus, Trash2, Menu, X, Download, Upload } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useChat } from '../contexts/ChatContext';
import { aiAPI } from '../services/api';

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
  road_signs: { en: 'Road Signs', rw: "Ibyapa by'Umuhanda", icon: '🚦' },
  speed_limits: { en: 'Speed Limits', rw: 'Umuvuduko Ntarengwa', icon: '⚡' },
  right_of_way: { en: 'Right of Way', rw: 'Uburenganzira bwo Kugenda Mbere', icon: '🔀' },
  overtaking: { en: 'Overtaking', rw: 'Kwanyuranaho', icon: '➡️' },
  parking_stopping: { en: 'Parking & Stopping', rw: 'Gupaka no Guhagarara', icon: '🅿️' },
  turning_signals: { en: 'Turning / Signals', rw: 'Kugena no Kumenyesha', icon: '↪️' },
  traffic_lights: { en: 'Traffic Lights', rw: "Amatara y'Umuhanda", icon: '🚥' },
  pedestrians: { en: 'Pedestrians', rw: 'Abanyamaguru', icon: '🚶' },
  emergency_vehicles: { en: 'Emergency Vehicles', rw: "Ibigoryo c'Agakiza", icon: '🚑' },
  vehicle_controls: { en: 'Vehicle Controls', rw: "Ibizice by'Ikinyabiziga", icon: '🚗' },
  road_safety: { en: 'Road Safety', rw: "Umutekano w'Umuhanda", icon: '🛡️' },
  exam_mode: { en: 'Exam Practice', rw: "Amahugurwa y'Ikizamini", icon: '📝' },
  scenario_mode: { en: 'Driving Scenario', rw: 'Imishinga yo Gutwara', icon: '🎬' },
  road_markings: { en: 'Road Markings', rw: "Imirongo y'Umuhanda", icon: '➖' },
  definitions: { en: 'Definitions', rw: "Amagambo y'Ubwenge", icon: '📖' },
  conversation: { en: 'General', rw: 'Amakuru', icon: '💬' },
  general: { en: 'Traffic', rw: "Amategeko y'Umuhanda", icon: '🚧' },
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
  "Ni iki icyapa cya STOP gisobanura?",
  "Nsobanurira uburyo bwo kureka abandi bakabanza",
  "Amategeko y'umuvuduko ntarengwa m'u Rwanda ni iki?",
  'Niga nte gupaka ahantu hasa?',
  "Mpa ibibazo 5 by'ikizamini ku byapa",
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
  const { user } = useAuth();
  const {
    conversations,
    activeConversation,
    setActiveConversation,
    createNewConversation,
    deleteConversation,
    addMessage,
    updateMessage,
    removeMessage,
    exportConversations,
    importConversations,
    isLoading: isChatLoading,
  } = useChat();

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);
  const [uiLang, setUiLang] = useState<'en' | 'rw' | 'mixed'>('mixed');
  const [aiStatus, setAiStatus] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const stickToBottomRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);
  const nextMsgIdRef = useRef(2);

  // Auto-create first conversation if none exists
  useEffect(() => {
    if (conversations.length === 0 && user) {
      createNewConversation();
    }
  }, [conversations.length, user]);

  // Scroll to bottom when messages change
  useEffect(() => {
    const el = chatRef.current;
    if (el && stickToBottomRef.current) el.scrollTop = el.scrollHeight;
  }, [activeConversation?.messages]);

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

  const handleChatScroll = () => {
    const el = chatRef.current;
    if (!el) return;
    stickToBottomRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
  };

  const streamTyping = async (
    prompt: string,
    sentiment: string,
    history: Array<{ role: string; content: string }>,
    controller: AbortController,
    conversationId: string
  ) => {
    let accText = '';
    let finalStructured: any = null;
    const msgId = nextMsgIdRef.current++;
    // Add placeholder message
    addMessage(conversationId, { id: msgId, text: '', isUser: false, timestamp: new Date(), structured: null });
    try {
      const final = await aiAPI.askAssistantStream(
        prompt,
        {
          onStart: () => { setIsTyping(true); },
          onToken: (chunk) => {
            if (!chunk) return;
            accText += chunk;
            updateMessage(conversationId, msgId, { text: accText });
          },
          onDone: (f) => {
            setIsTyping(false);
            finalStructured = f.structured || null;
            updateMessage(conversationId, msgId, { text: f.text || accText, structured: f.structured || null });
          },
          onError: () => {
            setIsTyping(false);
            removeMessage(conversationId, msgId);
          }
        },
        sentiment,
        history,
        controller.signal
      );
      return { text: final?.text || accText, structured: final?.structured || finalStructured };
    } catch (streamErr: any) {
      setIsTyping(false);
      removeMessage(conversationId, msgId);
      if (streamErr?.name === 'AbortError') throw streamErr;
      return null;
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    try {
      const count = await importConversations(file);
      // Brief success feedback via console — could add toast later
      console.log(`Imported ${count} new conversation(s)`);
    } catch (err) {
      console.error('Import failed:', err);
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    if (!user?.isPro && questionCount >= 5) {
      setShowPaywall(true);
      return;
    }
    if (!activeConversation) {
      createNewConversation();
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
    const convId = activeConversation.id;

    // Add user message
    addMessage(convId, { id: nextMsgIdRef.current++, text: userText, isUser: true, timestamp: now });
    setInput('');
    setQuestionCount(prev => prev + 1);
    setIsLoading(true);

    const startIndex = Math.max(1, activeConversation.messages.length - 10);
    const history = activeConversation.messages.slice(startIndex).map(msg => ({
      role: msg.isUser ? 'user' : 'model',
      content: msg.text,
    }));

    try {
      let streamed = null;
      try {
        streamed = await streamTyping(userText, sentiment, history, controller, convId);
      } catch (e: any) {
        if (e?.name === 'AbortError') { setIsLoading(false); return; }
        streamed = null;
      }
      if (!streamed) {
        const res = await aiAPI.askAssistant(userText, sentiment, history, controller.signal);
        addMessage(convId, { id: nextMsgIdRef.current++, text: res.text, isUser: false, timestamp: new Date(), structured: res.structured });
      }
    } catch (e: any) {
      if (e?.name === 'AbortError') return;
      const m = String(e?.message || '');
      const rateLimited = /429/.test(m) || /rate limit/i.test(m);
      const lang = uiLang;
      const text = rateLimited
        ? (lang === 'rw' ? "Wasabye byinshi icyarimwe. Ongeza gutegereza hanyuma wongere. #GerayoAmahoro" : "Too many requests right now. Please wait a moment and try again. #GerayoAmahoro")
        : (lang === 'rw' ? "Seriveri ifite ikibazo. Ongera ugerageze nyuma y'akanya. #GerayoAmahoro" : "The AI engine ran into a temporary issue. Please try again shortly. #GerayoAmahoro");
      addMessage(convId, { id: nextMsgIdRef.current++, text, isUser: false, timestamp: new Date(), structured: { language: lang, intent: 'error', topic: 'general', confidence: 'medium', warnings: ['server_error'] } });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    createNewConversation();
    setSidebarOpen(false);
  };

  const handleSelectChat = (conv: typeof conversations[0]) => {
    setActiveConversation(conv);
    setSidebarOpen(false);
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
      low: { color: 'bg-rose-500/20 text-rose-300 border border-rose-500/30', label: uiLang === 'rw' ? 'Nta mpuhwe' : 'Low confidence' },
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

  const messages = activeConversation?.messages || [];

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="fixed top-20 right-10 w-72 h-72 bg-green-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed bottom-10 left-10 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-24 left-4 z-50 md:hidden bg-white/10 border border-white/10 rounded-xl p-2 text-white hover:bg-white/20 transition-colors"
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      <div className="max-w-6xl mx-auto pt-16 flex gap-4">
        {/* Sidebar - Conversation History */}
        <div className={`
          fixed md:static inset-y-0 left-0 z-40
          w-72 bg-[#0f172a]/95 backdrop-blur-xl border-r border-white/10
          flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          <div className="p-4 border-b border-white/10">
            <button
              onClick={handleNewChat}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-green-500/30 transition-all duration-300"
            >
              <Plus className="w-5 h-5" />
              {uiLang === 'rw' ? "Igifunguro gishya" : "New Chat"}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {conversations.map((conv) => (
              <motion.div
                key={conv.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`group relative p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                  activeConversation?.id === conv.id
                    ? 'bg-white/10 border border-white/20'
                    : 'bg-white/5 border border-transparent hover:bg-white/8 hover:border-white/10'
                }`}
                onClick={() => handleSelectChat(conv)}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MessageCircle className="w-4 h-4 text-green-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium truncate">{conv.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(conv.updatedAt).toLocaleDateString()} · {conv.messages.length} {uiLang === 'rw' ? "ubusobanuro" : "messages"}
                    </p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteConversation(conv.id); }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-500 hover:text-red-400 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="p-4 border-t border-white/10 space-y-3">
            <div className="flex gap-2">
              <button
                onClick={exportConversations}
                disabled={conversations.length === 0}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-300 hover:bg-white/10 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Download className="w-3.5 h-3.5" />
                {uiLang === 'rw' ? "Kurura" : "Export"}
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={importing}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-300 hover:bg-white/10 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Upload className="w-3.5 h-3.5" />
                {importing
                  ? (uiLang === 'rw' ? 'Birimo...' : 'Importing...')
                  : (uiLang === 'rw' ? 'Shyira' : 'Import')}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </div>
            <div className="text-xs text-gray-500 text-center">
              {conversations.length} {uiLang === 'rw' ? "imitindire y'ubusobanuro" : `conversation${conversations.length !== 1 ? 's' : ''}`}
            </div>
          </div>
        </div>

        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Chat Area */}
        <div className="flex-1 min-w-0">
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

          {/* Suggested Prompts - show only if few messages */}
          {messages.length <= 1 && (
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
          )}

          {/* Chat Container */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
            {isChatLoading ? (
              <div className="h-[520px] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <p className="text-sm text-gray-400">{uiLang === 'rw' ? "Gutangira amajambo..." : "Loading conversations..."}</p>
                </div>
              </div>
            ) : (
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
            )}

            {/* Input Area */}
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
      </div>

      {/* Paywall Modal */}
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
