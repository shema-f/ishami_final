import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router';
import { motion } from 'motion/react';
import { Bot, User, MessageCircle, Languages, Shield, BookOpen, AlertTriangle, CheckCircle2, HelpCircle } from 'lucide-react';
import { conversationAPI } from '../services/api';

interface SharedMessage {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: string;
  structured?: any;
}

interface SharedConversation {
  title: string;
  messages: SharedMessage[];
  createdAt: string;
  updatedAt: string;
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
  conversation: { en: 'General', rw: 'Amakuru', icon: '💬' },
  general: { en: 'Traffic', rw: "Amategeko y'Umuhanda", icon: '🚧' },
};

const TopicBadge = ({ s }: { s?: any }) => {
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

const ConfidenceBadge = ({ c }: { c?: 'high' | 'medium' | 'low' }) => {
  if (!c) return null;
  const map = {
    high: { color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', label: 'High confidence' },
    medium: { color: 'bg-amber-500/20 text-amber-300 border-amber-500/30', label: 'Medium confidence' },
    low: { color: 'bg-rose-500/20 text-rose-300 border-rose-500/30', label: 'Low confidence' },
  };
  const { color, label } = map[c] || map.medium;
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] border rounded-full px-2 py-0.5 ${color}`}>
      {c === 'high' ? <CheckCircle2 className="w-3 h-3" /> : c === 'low' ? <AlertTriangle className="w-3 h-3" /> : <HelpCircle className="w-3 h-3" />}
      {label}
    </span>
  );
};

export default function SharedChat() {
  const { token } = useParams<{ token: string }>();
  const [conversation, setConversation] = useState<SharedConversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!token) {
      setError('No share link provided');
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const conv = await conversationAPI.getShared(token);
        if (!conv) {
          setError('Conversation not found or has been unshared');
        } else {
          setConversation(conv);
        }
      } catch {
        setError('Conversation not found or has been unshared');
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [conversation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center py-8 px-4">
        <div className="flex flex-col items-center gap-3">
          <div className="flex gap-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-3 h-3 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-3 h-3 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <p className="text-sm text-gray-400">Loading shared conversation...</p>
        </div>
      </div>
    );
  }

  if (error || !conversation) {
    return (
      <div className="min-h-screen flex items-center justify-center py-8 px-4">
        <div className="text-center">
          <div className="inline-flex p-4 bg-rose-500/20 rounded-3xl mb-6">
            <MessageCircle className="w-10 h-10 text-rose-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Shared Conversation</h1>
          <p className="text-gray-400 mb-6">{error || 'Conversation not found'}</p>
          <a href="/ai-assistant" className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-green-500/30 transition-all duration-300 inline-block">
            Open Moto-Sensei
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="fixed top-20 right-10 w-72 h-72 bg-green-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed bottom-10 left-10 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-3xl mx-auto pt-16">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-green-500 rounded-2xl blur-xl opacity-30" />
              <div className="relative w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/30">
                <Bot className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 font-[family-name:var(--font-heading)]">{conversation.title}</h1>
          <div className="flex flex-wrap justify-center items-center gap-2 mt-3 text-[11px] text-gray-400">
            <span className="inline-flex items-center gap-1 bg-white/5 border border-white/10 rounded-full px-2 py-0.5">
              <Languages className="w-3 h-3" /> Shared Conversation
            </span>
            <span className="inline-flex items-center gap-1 bg-white/5 border border-white/10 rounded-full px-2 py-0.5">
              {new Date(conversation.createdAt).toLocaleDateString()} · {conversation.messages.length} messages
            </span>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
          <div ref={chatRef} className="max-h-[600px] overflow-y-auto p-6 space-y-4 custom-scrollbar">
            {conversation.messages.map((message) => (
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
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="text-center mt-6">
          <a href="/ai-assistant" className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-green-500/30 transition-all duration-300 inline-flex items-center gap-2">
            <Bot className="w-5 h-5" />
            Try Moto-Sensei yourself
          </a>
        </div>
      </div>
    </div>
  );
}
