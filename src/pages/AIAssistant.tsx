import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Send, Bot, User, ArrowUp, Shield, BookOpen, AlertTriangle, Languages,
  CheckCircle2, HelpCircle, Plus, Trash2, Menu, X, Download, Upload, Search,
  Pencil, Share2, Link, MessageCircle, Sparkles, Mic, MicOff, Target,
  GraduationCap, Compass, FileText, CircleDot, Car, ChevronRight, ChevronLeft,
  Zap, Clock, Award, TrendingUp, Eye, BarChart3, Settings, Hash
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useChat } from '../contexts/ChatContext';
import { aiAPI, conversationAPI } from '../services/api';
import { useTranslation } from '../contexts/I18nContext';

/* ─── Types ───────────────────────────────────────────── */

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

type LearningMode = 'ask' | 'learn' | 'practice' | 'exam';

/* ─── Constants ───────────────────────────────────────── */

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

const LEARNING_TOPICS = [
  { id: 'traffic_signs', icon: '🚦', label_en: 'Traffic Signs', label_rw: 'Ibyapa by\'Umuhanda' },
  { id: 'roundabouts', icon: '🔄', label_en: 'Roundabouts', label_rw: 'Rond-point' },
  { id: 'right_of_way', icon: '🔀', label_en: 'Right of Way', label_rw: 'Uburenganzira' },
  { id: 'parking', icon: '🅿️', label_en: 'Parking', label_rw: 'Gupaka' },
  { id: 'highway', icon: '🛣️', label_en: 'Highway Driving', label_rw: 'Gutwara ku Gariyandiko' },
  { id: 'traffic_rules', icon: '📋', label_en: 'Traffic Rules', label_rw: 'Amategeko' },
];

const LEARNING_MODES: { id: LearningMode; icon: any; label_en: string; label_rw: string; desc_en: string; desc_rw: string }[] = [
  { id: 'ask', icon: MessageCircle, label_en: 'Ask', label_rw: 'Baza', desc_en: 'Ask anything', desc_rw: 'Baza ibyo ushaka' },
  { id: 'learn', icon: GraduationCap, label_en: 'Learn', label_rw: 'Wige', desc_en: 'Structured lessons', desc_rw: 'Amasomo yagenzuwe' },
  { id: 'practice', icon: Target, label_en: 'Practice', label_rw: 'Sanzwa', desc_en: 'Practice scenarios', desc_rw: 'Imishinga yo gujya inama' },
  { id: 'exam', icon: FileText, label_en: 'Exam', label_rw: 'Ikizamini', desc_en: 'Exam simulation', desc_rw: "Igeragezo ry'ikizamini" },
];

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

/* ─── Helpers ─────────────────────────────────────────── */

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

/* ─── Learning Progress Tracking ──────────────────────── */

interface TopicProgress {
  topicId: string;
  questionsAsked: number;
  completed: boolean;
}

function loadProgress(): TopicProgress[] {
  try {
    const data = localStorage.getItem('ishami_learning_progress');
    return data ? JSON.parse(data) : LEARNING_TOPICS.map(t => ({ topicId: t.id, questionsAsked: 0, completed: false }));
  } catch {
    return LEARNING_TOPICS.map(t => ({ topicId: t.id, questionsAsked: 0, completed: false }));
  }
}

function saveProgress(progress: TopicProgress[]) {
  localStorage.setItem('ishami_learning_progress', JSON.stringify(progress));
}

/* ─── Main Component ──────────────────────────────────── */

export default function AIAssistant() {
  const { user } = useAuth();
  const { t, lang } = useTranslation();
  const {
    conversations, activeConversation, setActiveConversation,
    createNewConversation, deleteConversation, addMessage,
    updateMessage, removeMessage, exportConversations,
    importConversations, isLoading: isChatLoading,
  } = useChat();

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  // Sync question count from localStorage once user is available
  const questionCountSynced = useRef(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [uiLang, setUiLang] = useState<'en' | 'rw' | 'mixed'>('mixed');
  const [aiStatus, setAiStatus] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');
  const [shareStatus, setShareStatus] = useState<Record<string, string>>({});
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [learningMode, setLearningMode] = useState<LearningMode>('ask');
  const [showModeSelector, setShowModeSelector] = useState(false);
  const [learningProgress, setLearningProgress] = useState<TopicProgress[]>(loadProgress);
  const [completedLessons, setCompletedLessons] = useState(0);
  const [learningStreak, setLearningStreak] = useState(0);
  const [showMobileTopicCards, setShowMobileTopicCards] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const stickToBottomRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);
  const nextMsgIdRef = useRef(2);

  // Load question count from localStorage when user becomes available
  useEffect(() => {
    if (questionCountSynced.current) return;
    try {
      const key = user?.id ? `ishami_ai_question_count_${user.id}` : 'ishami_ai_question_count_guest';
      const saved = localStorage.getItem(key);
      if (saved) {
        const n = parseInt(saved, 10) || 0;
        setQuestionCount(n);
      }
      questionCountSynced.current = true;
    } catch {}
  }, [user?.id]);

  // Persist question count to localStorage
  useEffect(() => {
    try {
      const key = user?.id ? `ishami_ai_question_count_${user.id}` : 'ishami_ai_question_count_guest';
      localStorage.setItem(key, String(questionCount));
    } catch {}
  }, [questionCount, user?.id]);

  // Auto-create first conversation
  useEffect(() => {
    if (conversations.length === 0 && user) createNewConversation();
  }, [conversations.length, user]);

  // Scroll to bottom
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

  // Load streak
  useEffect(() => {
    try {
      const streakData = localStorage.getItem('ishami_learning_streak');
      if (streakData) {
        const { count, lastDate } = JSON.parse(streakData);
        const today = new Date().toDateString();
        const last = new Date(lastDate).toDateString();
        if (today === last) setLearningStreak(count);
        else if (new Date(today).getTime() - new Date(last).getTime() <= 86400000) setLearningStreak(count);
        else setLearningStreak(0);
      }
    } catch {}
  }, []);

  const handleChatScroll = () => {
    const el = chatRef.current;
    if (!el) return;
    stickToBottomRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
  };

  const streamTyping = async (
    prompt: string, sentiment: string,
    history: Array<{ role: string; content: string }>,
    controller: AbortController, conversationId: string
  ) => {
    let accText = '';
    let finalStructured: any = null;
    const msgId = nextMsgIdRef.current++;
    addMessage(conversationId, { id: msgId, text: '', isUser: false, timestamp: new Date(), structured: null });
    try {
      const final = await aiAPI.askAssistantStream(prompt, {
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
      }, sentiment, history, controller.signal);
      return { text: final?.text || accText, structured: final?.structured || finalStructured };
    } catch (streamErr: any) {
      setIsTyping(false);
      removeMessage(conversationId, msgId);
      if (streamErr?.name === 'AbortError') throw streamErr;
      return null;
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    if (!(user?.isPro || user?.accessTier === 'full') && questionCount >= 5) { setShowPaywall(true); return; }
    if (!activeConversation) { createNewConversation(); return; }

    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;
    const sentiment = detectSentiment(input);
    const detected = detectUiLangHint(input);
    if (detected !== 'mixed') setUiLang(detected);

    const userText = input;
    const convId = activeConversation.id;
    addMessage(convId, { id: nextMsgIdRef.current++, text: userText, isUser: true, timestamp: new Date() });
    setInput('');
    setQuestionCount(prev => prev + 1);
    setIsLoading(true);
    setShowMobileTopicCards(false);

    // Update learning progress
    setLearningProgress(prev => {
      const updated = prev.map(p => ({ ...p, questionsAsked: p.questionsAsked + 1 }));
      saveProgress(updated);
      return updated;
    });

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
      const text = rateLimited
        ? t('ai.errors.rate_limited', 'Too many requests right now. Please wait a moment and try again. #GerayoAmahoro')
        : t('ai.errors.server_error', 'The AI engine ran into a temporary issue. Please try again shortly. #GerayoAmahoro');
      addMessage(convId, { id: nextMsgIdRef.current++, text, isUser: false, timestamp: new Date(), structured: { language: uiLang, intent: 'error', topic: 'general', confidence: 'medium', warnings: ['server_error'] } });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTopicClick = (topicId: string) => {
    const topic = LEARNING_TOPICS.find(t => t.id === topicId);
    if (!topic) return;
    const prompt = lang === 'rw'
      ? `Njya kwiga iberekeye: ${topic.label_rw}. Mbwireho amategeko y'ibanze.`
      : `I want to learn about: ${topic.label_en}. Give me the basics.`;
    setInput(prompt);
    setShowMobileTopicCards(false);
  };

  const handleNewChat = () => {
    createNewConversation();
    setSidebarOpen(false);
  };

  const handleSelectChat = (conv: typeof conversations[0]) => {
    setActiveConversation(conv);
    setSidebarOpen(false);
  };

  const handleShare = async (e: React.MouseEvent, convId: string) => {
    e.stopPropagation();
    try {
      if (shareStatus[convId]) {
        const url = `${window.location.origin}/shared/${shareStatus[convId]}`;
        await navigator.clipboard.writeText(url);
        setCopiedToken(shareStatus[convId]);
        setTimeout(() => setCopiedToken(null), 2000);
      } else {
        const token = await conversationAPI.share(convId);
        setShareStatus(prev => ({ ...prev, [convId]: token }));
        const url = `${window.location.origin}/shared/${token}`;
        await navigator.clipboard.writeText(url);
        setCopiedToken(token);
        setTimeout(() => setCopiedToken(null), 2000);
      }
    } catch (err) { console.error('Share failed:', err); }
  };

  const confirmDelete = () => {
    if (deleteTarget) { deleteConversation(deleteTarget.id); setDeleteTarget(null); }
  };

  const startEditing = (msg: { id: number; text: string }) => {
    setEditingMessageId(msg.id);
    setEditingText(msg.text);
  };

  const cancelEditing = () => { setEditingMessageId(null); setEditingText(''); };

  const saveEdit = async (messageId: number) => {
    if (!activeConversation || !editingText.trim()) return;
    const convId = activeConversation.id;
    updateMessage(convId, messageId, { text: editingText.trim() });
    setEditingMessageId(null);
    setEditingText('');
    const msgIndex = activeConversation.messages.findIndex(m => m.id === messageId);
    if (msgIndex >= 0) {
      const msgsToRemove = activeConversation.messages.slice(msgIndex + 1);
      for (const m of msgsToRemove) removeMessage(convId, m.id);
    }
    if (!(user?.isPro || user?.accessTier === 'full') && questionCount >= 5) { setShowPaywall(true); return; }
    const sentiment = detectSentiment(editingText.trim());
    const controller = new AbortController();
    abortControllerRef.current = controller;
    setIsLoading(true);
    const updatedConv = { ...activeConversation, messages: [...activeConversation.messages] };
    const history = updatedConv.messages.slice(0, msgIndex + 1).map(m => ({
      role: m.isUser ? 'user' : 'model',
      content: m.id === messageId ? editingText.trim() : m.text,
    }));
    try {
      const res = await aiAPI.askAssistant(editingText.trim(), sentiment, history, controller.signal);
      addMessage(convId, { id: nextMsgIdRef.current++, text: res.text, isUser: false, timestamp: new Date(), structured: res.structured });
    } catch (e: any) {
      if (e?.name === 'AbortError') return;
      addMessage(convId, { id: nextMsgIdRef.current++, text: "The AI engine ran into a temporary issue. Please try again shortly. #GerayoAmahoro", isUser: false, timestamp: new Date(), structured: { intent: 'error', topic: 'general' } });
    } finally { setIsLoading(false); }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    try { await importConversations(file); } catch (err) { console.error('Import failed:', err); }
    finally { setImporting(false); if (fileInputRef.current) fileInputRef.current.value = ''; }
  };

  const shareToWhatsApp = (messageText: string) => {
    const fullText = `🧑🏿‍🏫 *Inama ya Moto-Sensei (Ishami.rw):*\n\n${messageText}\n\n--- \n📍 *Koresha Ishami App nawe utsinde ikizamini:* https://ishami.rw`;
    window.open(`https://wa.me/?text=${encodeURIComponent(fullText)}`, '_blank');
  };

  const handleVoiceToggle = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) return;
    if (isRecording) { setIsRecording(false); return; }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = uiLang === 'rw' ? 'rw-RW' : 'en-US';
    recognition.interimResults = false;
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(prev => prev + (prev ? ' ' : '') + transcript);
      setIsRecording(false);
    };
    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);
    recognition.start();
    setIsRecording(true);
  };

  const promptsToShow = uiLang === 'rw' ? suggestedPromptsRW : uiLang === 'en' ? suggestedPromptsEN : [...suggestedPromptsEN.slice(0, 2), ...mixedPrompts, ...suggestedPromptsRW.slice(0, 2)];
  const messages = activeConversation?.messages || [];
  const filteredConversations = searchQuery.trim()
    ? conversations.filter(conv => {
        const q = searchQuery.toLowerCase();
        return conv.title.toLowerCase().includes(q) || conv.messages.some(m => m.text.toLowerCase().includes(q));
      })
    : conversations;

  const totalProgress = learningProgress.reduce((acc, p) => acc + p.questionsAsked, 0);
  const topicsExplored = learningProgress.filter(p => p.questionsAsked > 0).length;

  const ConfidenceBadge = ({ c }: { c?: 'high' | 'medium' | 'low' }) => {
    if (!c) return null;
    const map = {
      high: { color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', label: t('ai.confidence.high', 'High confidence') },
      medium: { color: 'bg-amber-500/20 text-amber-300 border-amber-500/30', label: t('ai.confidence.medium', 'Medium confidence') },
      low: { color: 'bg-rose-500/20 text-rose-300 border-rose-500/30', label: t('ai.confidence.low', 'Low confidence') },
    };
    const { color, label } = map[c] || map.medium;
    return (
      <span className={`inline-flex items-center gap-1 text-[10px] md:text-[11px] border rounded-full px-1.5 py-0.5 ${color}`}>
        {c === 'high' ? <CheckCircle2 className="w-2.5 h-2.5" /> : c === 'low' ? <AlertTriangle className="w-2.5 h-2.5" /> : <HelpCircle className="w-2.5 h-2.5" />}
        <span className="hidden sm:inline">{label}</span>
      </span>
    );
  };

  const TopicBadge = ({ s }: { s?: AIStructured }) => {
    if (!s?.topic) return null;
    const t = TOPIC_LABELS[s.topic] || TOPIC_LABELS.general;
    const label = s.language === 'rw' ? t.rw : s.language === 'en' ? t.en : `${t.icon} ${t.en}`;
    return (
      <span className="inline-flex items-center gap-1 text-[10px] md:text-[11px] rounded-full px-1.5 py-0.5 bg-sky-500/15 text-sky-300 border border-sky-500/25">
        <span>{t.icon}</span>
        <span className="truncate max-w-[120px] md:max-w-[180px]">{label}</span>
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#080c18] pt-16">
      {/* ─── Desktop Layout ─────────────────────────── */}
      <div className="hidden md:flex h-[calc(100vh-4rem)]">
        {/* Left Sidebar */}
        <aside className="w-72 lg:w-80 bg-[#0d1225]/95 backdrop-blur-xl border-r border-white/5 flex flex-col shrink-0">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-white/5">
            <button
              onClick={handleNewChat}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 text-sm"
            >
              <Plus className="w-4 h-4" />
              {t('ai.new_chat', 'New Chat')}
            </button>
            <div className="relative mt-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('ai.search_chats_placeholder', 'Search chats...')}
                className="w-full pl-9 pr-3 py-2.5 bg-white/5 border border-white/8 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-gray-500 hover:text-white transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-1.5 custom-scrollbar">
            {filteredConversations.length === 0 && searchQuery && (
              <div className="text-center py-8">
                <Search className="w-8 h-8 text-gray-700 mx-auto mb-2" />
                <p className="text-sm text-gray-500">{t('ai.no_conversations', 'No conversations found')}</p>
              </div>
            )}
            {filteredConversations.map((conv) => (
              <div
                key={conv.id}
                className={`group relative p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                  activeConversation?.id === conv.id
                    ? 'bg-white/10 border border-white/15'
                    : 'bg-transparent border border-transparent hover:bg-white/5 hover:border-white/8'
                }`}
                onClick={() => handleSelectChat(conv)}
              >
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center shrink-0 mt-0.5">
                    <MessageCircle className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/90 font-medium truncate">{conv.title}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      {new Date(conv.updatedAt).toLocaleDateString()} · {conv.messages.length} {t('ai.messages', 'messages')}
                    </p>
                  </div>
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-all">
                    <button onClick={(e) => handleShare(e, conv.id)} className={`p-1 rounded transition-all ${shareStatus[conv.id] ? 'text-blue-400' : 'text-gray-600 hover:text-blue-400'}`}>
                      {shareStatus[conv.id] ? <Link className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); setDeleteTarget({ id: conv.id, title: conv.title }); }} className="p-1 text-gray-600 hover:text-red-400 rounded transition-all">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-white/5 space-y-3">
            <div className="flex gap-2">
              <button onClick={exportConversations} disabled={conversations.length === 0} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-white/5 border border-white/8 rounded-lg text-xs text-gray-400 hover:bg-white/10 hover:text-white transition-all disabled:opacity-30">
                <Download className="w-3 h-3" /> {t('ai.export', 'Export')}
              </button>
              <button onClick={() => fileInputRef.current?.click()} disabled={importing} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-white/5 border border-white/8 rounded-lg text-xs text-gray-400 hover:bg-white/10 hover:text-white transition-all disabled:opacity-30">
                <Upload className="w-3 h-3" /> {importing ? '...' : t('ai.import', 'Import')}
              </button>
              <input ref={fileInputRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
            </div>
          </div>
        </aside>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Bar */}
          <header className="h-14 border-b border-white/5 bg-[#080c18]/80 backdrop-blur-xl flex items-center justify-between px-4 shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#080c18]" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white font-[family-name:var(--font-heading)]">Moto-Sensei</h2>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] text-emerald-400 font-medium">
                    {lang === 'rw' ? '✓ Ubumenyi bwemejwe' : '✓ Rwanda Traffic Knowledge Verified'}
                  </span>
                </div>
              </div>
            </div>


          </header>

          {/* Chat + Right Panel */}
          <div className="flex-1 flex overflow-hidden">
            {/* Chat Messages */}
            <div className="flex-1 flex flex-col min-w-0">
              {isChatLoading ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <p className="text-sm text-gray-500">{lang === 'rw' ? "Gutangira amajambo..." : "Loading conversations..."}</p>
                  </div>
                </div>
              ) : (
                <div ref={chatRef} onScroll={handleChatScroll} className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-5 custom-scrollbar">
                  {/* Welcome screen when no messages */}
                  {messages.length <= 1 && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center min-h-[60vh]">
                      <div className="relative mb-6">
                        <div className="absolute inset-0 bg-blue-500 rounded-3xl blur-2xl opacity-20" />
                        <div className="relative w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/30">
                          <Bot className="w-10 h-10 text-white" />
                        </div>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 font-[family-name:var(--font-heading)]">
                        {lang === 'rw' ? 'Muraho!' : 'Welcome back!'} 👋
                      </h2>
                      <p className="text-gray-400 text-center max-w-md mb-8">
                        {lang === 'rw'
                          ? "Ndi Moto-Sensei — umwarimu wawe wa AI ku mategeko y'umuhanda mu Rwanda. Nshobora kukwigisha, kukugisha inama no kukugerageza."
                          : "I'm Moto-Sensei — your Rwanda AI Driving Instructor. I can teach, guide, and test your traffic knowledge."}
                      </p>

                      {/* Quick Topic Cards */}
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full max-w-lg mb-8">
                        {LEARNING_TOPICS.map((topic, i) => (
                          <motion.button
                            key={topic.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + i * 0.05 }}
                            onClick={() => handleTopicClick(topic.id)}
                            className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-blue-500/30 transition-all text-left group"
                          >
                            <span className="text-xl mb-1 block">{topic.icon}</span>
                            <span className="text-xs font-medium text-white/80 group-hover:text-blue-400 transition-colors block">
                              {lang === 'rw' ? topic.label_rw : topic.label_en}
                            </span>
                          </motion.button>
                        ))}
                      </div>

                      {/* Suggested Prompts */}
                      <div className="flex flex-wrap gap-2 justify-center max-w-lg">
                        {promptsToShow.map((prompt, index) => (
                          <motion.button
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 + index * 0.05 }}
                            onClick={() => { setInput(prompt); setShowMobileTopicCards(false); }}
                            className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-gray-400 hover:bg-white/10 hover:border-white/20 hover:text-white transition-all duration-300 max-w-[200px] truncate"
                          >
                            {prompt}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Messages */}
                  {messages.map((message) => (
                    <motion.div key={message.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] ${message.isUser ? 'order-2' : 'order-1'}`}>
                        {!message.isUser && (
                          <div className="flex items-center gap-2 mb-1.5">
                            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                              <Bot className="w-3.5 h-3.5 text-white" />
                            </div>
                            <span className="text-xs text-gray-500 font-medium">Moto-Sensei</span>
                            <TopicBadge s={message.structured} />
                            <ConfidenceBadge c={message.structured?.confidence} />
                          </div>
                        )}
                        {message.isUser && (
                          <div className="flex items-center gap-2 mb-1.5 justify-end">
                            <span className="text-xs text-gray-500 font-medium">{lang === 'rw' ? 'Wowe' : 'You'}</span>
                            <div className="w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center">
                              <User className="w-3.5 h-3.5 text-blue-400" />
                            </div>
                          </div>
                        )}
                        <div className={`group/msg relative px-4 py-3 rounded-2xl leading-relaxed whitespace-pre-wrap text-[13px] md:text-sm ${
                          message.isUser
                            ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-tr-sm shadow-lg shadow-blue-500/10'
                            : 'bg-[#111a2e] text-white/90 rounded-tl-sm border border-white/5'
                        }`}>
                          {message.isUser && editingMessageId !== message.id && (
                            <button onClick={() => startEditing(message)} className="absolute -top-2 -left-2 opacity-0 group-hover/msg:opacity-100 p-1 bg-white/10 hover:bg-white/20 rounded-lg transition-all" title="Edit">
                              <Pencil className="w-3 h-3 text-white" />
                            </button>
                          )}
                          {editingMessageId === message.id ? (
                            <div className="space-y-2">
                              <textarea value={editingText} onChange={(e) => setEditingText(e.target.value)} className="w-full bg-white/10 border border-white/20 rounded-lg p-2 text-white text-sm resize-none focus:outline-none focus:ring-1 focus:ring-blue-400" rows={3} autoFocus />
                              <div className="flex gap-2 justify-end">
                                <button onClick={cancelEditing} className="px-3 py-1 text-xs text-gray-300 hover:text-white transition-colors">{lang === 'rw' ? 'Hagarika' : 'Cancel'}</button>
                                <button onClick={() => saveEdit(message.id)} disabled={!editingText.trim()} className="px-3 py-1 text-xs bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors disabled:opacity-30">{lang === 'rw' ? 'Bika & Ongera' : 'Save & Resend'}</button>
                              </div>
                            </div>
                          ) : (
                            <p className="whitespace-pre-wrap">{message.text}</p>
                          )}
                          {message.structured?.safety_note && message.structured.safety_note.trim() && !message.text.includes(message.structured.safety_note.slice(0, 20)) && (
                            <div className="mt-3 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-200 text-xs">
                              ⚠️ {message.structured.safety_note}
                            </div>
                          )}
                          {!message.isUser && (
                            <div className="flex items-center gap-3 mt-2 pt-2 border-t border-white/5">
                              <button onClick={() => shareToWhatsApp(message.text)} className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 text-[11px] transition-colors">
                                <MessageCircle className="w-3 h-3" /> {lang === 'rw' ? "Tungura" : "Share"}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* Typing indicator */}
                  <AnimatePresence>
                    {isTyping && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="flex justify-start">
                        <div className="max-w-[75%]">
                          <div className="flex items-center gap-2 mb-1.5">
                            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center"><Bot className="w-3.5 h-3.5 text-white" /></div>
                            <span className="text-xs text-gray-500 font-medium">Moto-Sensei {lang === 'rw' ? "yandika..." : "is thinking..."}</span>
                          </div>
                          <div className="px-4 py-3 rounded-2xl bg-[#111a2e] border border-white/5 rounded-tl-sm">
                            <div className="flex gap-1.5">
                              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Input Area */}
              <div className="border-t border-white/5 bg-[#080c18]/80 backdrop-blur-xl p-3 md:p-4 shrink-0">
                <div className="max-w-4xl mx-auto flex gap-2 items-end">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => { setInput(e.target.value); const d = detectUiLangHint(e.target.value); if (d !== 'mixed') setUiLang(d); }}
                      onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                      placeholder={
                        learningMode === 'exam' ? (lang === 'rw' ? 'Igeragezo ry\'ikizamini...  (e.g. Niba umwana yambaye mu muhanda, ugomba gukora iki?)' : 'Exam question... (e.g. What should you do if a child runs onto the road?)')
                          : learningMode === 'learn' ? (lang === 'rw' ? 'Saba amasomo... (e.g. Njya kwiga iberekeye rond-point)' : 'Request a lesson... (e.g. Teach me about roundabouts)')
                          : learningMode === 'practice' ? (lang === 'rw' ? 'Igeragezo ry\'imyitatingo... (e.g. Niri mu musizi, njya kubona icyapa cy\'umuhanda, nakora iki?)' : 'Practice scenario... (e.g. I\'m approaching a stop sign in the rain, what should I do?)')
                          : (lang === 'rw' ? "Baza icyo ukeneye ku mategeko y'umuhanda..." : "Ask about traffic rules, signs, exams, safety...")
                      }
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent text-white placeholder-gray-500 transition-all text-sm"
                      disabled={isTyping || isLoading}
                    />
                  </div>
                  <button onClick={handleVoiceToggle} className={`p-3 rounded-xl border transition-all ${isRecording ? 'bg-red-500/20 border-red-500/30 text-red-400 animate-pulse' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'}`}>
                    {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={handleSend}
                    disabled={isTyping || !input.trim() || isLoading}
                    className="p-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {isLoading ? <Sparkles className="w-4 h-4 animate-pulse" /> : <ArrowUp className="w-4 h-4" />}
                  </button>
                </div>
                {!(user?.isPro || user?.accessTier === 'full') && (
                  <p className="text-center text-[11px] text-gray-500 mt-2">
                    {5 - questionCount} {lang === 'rw' ? 'ibibazo by\'ubuntu byasigaye' : 'free questions remaining'}
                  </p>
                )}
              </div>
            </div>


          </div>
        </div>
      </div>

      {/* ─── Mobile Layout ──────────────────────────── */}
      <div className="md:hidden flex flex-col h-[calc(100vh-4rem)]">
        {/* Mobile Header */}
        <header className="h-14 bg-[#0d1225]/95 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-3 shrink-0 z-20">
          <div className="flex items-center gap-2">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-all">
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white font-[family-name:var(--font-heading)]">Moto-Sensei</h2>
            </div>
          </div>
        </header>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-30" onClick={() => setSidebarOpen(false)} />
              <motion.div initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }} transition={{ type: 'spring', damping: 25 }} className="fixed inset-y-0 left-0 w-72 bg-[#0d1225] z-40 flex flex-col border-r border-white/5">
                <div className="p-4 border-b border-white/5">
                  <button onClick={handleNewChat} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-semibold text-sm">
                    <Plus className="w-4 h-4" /> {t('ai.new_chat', 'New Chat')}
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
                  {conversations.map((conv) => (
                    <div key={conv.id} onClick={() => handleSelectChat(conv)} className={`p-3 rounded-xl cursor-pointer transition-all ${activeConversation?.id === conv.id ? 'bg-white/10 border border-white/15' : 'hover:bg-white/5 border border-transparent'}`}>
                      <div className="flex items-center gap-2.5">
                        <MessageCircle className="w-4 h-4 text-blue-400 shrink-0" />
                        <p className="text-sm text-white/90 font-medium truncate flex-1">{conv.title}</p>
                      </div>
                      <p className="text-[10px] text-gray-500 mt-1 ml-6">{conv.messages.length} messages</p>
                    </div>
                  ))}
                </div>

              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Mobile Chat Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {showMobileTopicCards && messages.length <= 1 ? (
            <div className="flex-1 overflow-y-auto px-3 py-4">
              {/* Welcome */}
              <div className="text-center mb-6">
                <div className="relative inline-block mb-4">
                  <div className="absolute inset-0 bg-blue-500 rounded-2xl blur-xl opacity-20" />
                  <div className="relative w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/30 mx-auto">
                    <Bot className="w-7 h-7 text-white" />
                  </div>
                </div>
                <h2 className="text-xl font-bold text-white mb-1 font-[family-name:var(--font-heading)]">{lang === 'rw' ? 'Muraho!' : 'Welcome!'} 👋</h2>
                <p className="text-gray-400 text-xs max-w-xs mx-auto">
                  {lang === 'rw' ? "Ndi Moto-Sensei. Hitamwo inkingo ushaka kwiga:" : "Choose a topic to start learning:"}
                </p>
              </div>

              {/* Mobile Topic Cards - 2 columns */}
              <div className="grid grid-cols-2 gap-2.5 mb-6">
                {LEARNING_TOPICS.map((topic, i) => (
                  <motion.button
                    key={topic.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => handleTopicClick(topic.id)}
                    className="p-3 bg-white/5 border border-white/10 rounded-xl text-left hover:bg-white/10 hover:border-blue-500/30 transition-all"
                  >
                    <span className="text-lg block mb-1">{topic.icon}</span>
                    <span className="text-[11px] font-medium text-white/80 block leading-tight">
                      {lang === 'rw' ? topic.label_rw : topic.label_en}
                    </span>
                  </motion.button>
                ))}
              </div>

              {/* Suggested prompts */}
              <div className="space-y-2">
                {promptsToShow.slice(0, 4).map((prompt, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    onClick={() => { setInput(prompt); setShowMobileTopicCards(false); }}
                    className="w-full text-left px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-gray-400 hover:bg-white/10 hover:text-white transition-all"
                  >
                    {prompt}
                  </motion.button>
                ))}
              </div>
            </div>
          ) : (
            /* Mobile Messages */
            <div ref={chatRef} onScroll={handleChatScroll} className="flex-1 overflow-y-auto px-3 py-4 space-y-4 custom-scrollbar">
              {messages.map((message) => (
                <motion.div key={message.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] ${message.isUser ? 'order-2' : 'order-1'}`}>
                    {!message.isUser && (
                      <div className="flex items-center gap-1.5 mb-1">
                        <div className="w-5 h-5 rounded-md bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center"><Bot className="w-3 h-3 text-white" /></div>
                        <span className="text-[10px] text-gray-500">Moto-Sensei</span>
                        <TopicBadge s={message.structured} />
                      </div>
                    )}
                    <div className={`px-3 py-2.5 rounded-2xl text-[13px] leading-relaxed ${
                      message.isUser ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-tr-sm' : 'bg-[#111a2e] text-white/90 rounded-tl-sm border border-white/5'
                    }`}>
                      {editingMessageId === message.id ? (
                        <div className="space-y-2">
                          <textarea value={editingText} onChange={(e) => setEditingText(e.target.value)} className="w-full bg-white/10 border border-white/20 rounded-lg p-2 text-white text-sm resize-none" rows={3} />
                          <div className="flex gap-2 justify-end">
                            <button onClick={cancelEditing} className="px-3 py-1 text-xs text-gray-300">Cancel</button>
                            <button onClick={() => saveEdit(message.id)} className="px-3 py-1 text-xs bg-white/20 text-white rounded-lg">Save</button>
                          </div>
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap">{message.text}</p>
                      )}
                      {!message.isUser && (
                        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/5">
                          <button onClick={() => shareToWhatsApp(message.text)} className="flex items-center gap-1 text-emerald-400 text-[10px]">
                            <MessageCircle className="w-3 h-3" /> {lang === 'rw' ? 'Tungura' : 'Share'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="px-3 py-2.5 rounded-2xl bg-[#111a2e] border border-white/5 rounded-tl-sm">
                    <div className="flex gap-1.5">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* Mobile Input - Fixed at bottom */}
          <div className="border-t border-white/5 bg-[#0d1225]/95 backdrop-blur-xl p-3 shrink-0 safe-area-bottom">
            <div className="flex gap-2 items-end">
              <button onClick={handleVoiceToggle} className={`p-2.5 rounded-xl border shrink-0 transition-all ${isRecording ? 'bg-red-500/20 border-red-500/30 text-red-400' : 'bg-white/5 border-white/10 text-gray-400'}`}>
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => { setInput(e.target.value); const d = detectUiLangHint(e.target.value); if (d !== 'mixed') setUiLang(d); }}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  placeholder={lang === 'rw' ? "Andika ubutumwa bwawe..." : "Type your message..."}
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 text-sm"
                  disabled={isTyping || isLoading}
                />
              </div>
              <button
                onClick={handleSend}
                disabled={isTyping || !input.trim() || isLoading}
                className="p-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl disabled:opacity-30 shrink-0"
              >
                {isLoading ? <Sparkles className="w-4 h-4 animate-pulse" /> : <ArrowUp className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Paywall Modal ──────────────────────────── */}
      {showPaywall && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowPaywall(false)}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} onClick={(e) => e.stopPropagation()} className="bg-[#111827] rounded-3xl p-8 max-w-md w-full border border-white/10 shadow-2xl">
            <div className="text-center">
              <div className="inline-flex p-4 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-3xl mb-6 shadow-lg shadow-blue-500/30">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2 font-[family-name:var(--font-heading)]">{t('quiz.paywall.title', 'Upgrade to Pro')}</h2>
              <p className="text-gray-400 mb-6 text-sm">
                {lang === 'rw'
                  ? "Ukoresheje ibibazo 5 bisanzwe! Vugura Pro ugire ibibazo byose bidakemera Moto-Sensei — 1,000 RWF gusa."
                  : "You've used your 5 free questions! Unlock unlimited Moto-Sensei AI assistance for only 1,000 RWF."}
              </p>
              <div className="space-y-3">
                <button className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300">
                  {lang === 'rw' ? "Guhinduriza Pro — 1,000 RWF" : "Upgrade Now — 1,000 RWF"}
                </button>
                <button onClick={() => setShowPaywall(false)} className="w-full px-6 py-3 text-gray-400 hover:text-white transition-colors text-sm">
                  {t('quiz.paywall.maybe_later', 'Maybe Later')}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* ─── Delete Confirmation Modal ────────────────── */}
      {deleteTarget && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setDeleteTarget(null)}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} onClick={(e) => e.stopPropagation()} className="bg-[#111827] rounded-3xl p-8 max-w-sm w-full border border-white/10 shadow-2xl">
            <div className="text-center">
              <div className="inline-flex p-4 bg-rose-500/20 rounded-3xl mb-6"><Trash2 className="w-10 h-10 text-rose-400" /></div>
              <h2 className="text-xl font-bold text-white mb-2">{lang === 'rw' ? 'Siba Intindiro?' : 'Delete Conversation?'}</h2>
              <p className="text-gray-400 mb-6 text-sm">
                {lang === 'rw' ? `"${deleteTarget.title}" irasibwa.` : `"${deleteTarget.title}" will be permanently deleted.`}
              </p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteTarget(null)} className="flex-1 px-4 py-3 bg-white/5 border border-white/10 text-gray-300 rounded-xl hover:bg-white/10 transition-colors text-sm">{t('irembo.payment_dialog.cancel', 'Cancel')}</button>
                <button onClick={confirmDelete} className="flex-1 px-4 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-semibold transition-colors text-sm">{lang === 'rw' ? 'Siba' : 'Delete'}</button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
