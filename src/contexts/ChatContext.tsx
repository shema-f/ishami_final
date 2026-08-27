import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import { conversationAPI } from '../services/api';

export interface ChatMessage {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
  image?: string | null;
  structured?: any;
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

interface ChatContextType {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  setActiveConversation: (conv: Conversation | null) => void;
  createNewConversation: () => Conversation;
  deleteConversation: (id: string) => void;
  addMessage: (conversationId: string, message: ChatMessage) => void;
  updateMessage: (conversationId: string, messageId: number, updates: Partial<ChatMessage>) => void;
  removeMessage: (conversationId: string, messageId: number) => void;
  updateConversationTitle: (id: string, title: string) => void;
  exportConversations: () => void;
  importConversations: (file: File) => Promise<number>;
  isLoading: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const STORAGE_KEY = 'ishami_conversations';

// ─── Local Storage Helpers ────────────────────────────────

function loadLocal(): Conversation[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    return parsed.map((conv: any) => ({
      ...conv,
      id: conv.id || conv._id || `chat_${Date.now()}`,
      createdAt: new Date(conv.createdAt),
      updatedAt: new Date(conv.updatedAt),
      messages: (conv.messages || []).map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      })),
    }));
  } catch {
    return [];
  }
}

function saveLocal(conversations: Conversation[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  } catch {}
}

function generateClientId(): string {
  return `chat_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

const GREETING_MESSAGE: ChatMessage = {
  id: 1,
  text: "Muraho! 👋 Ndi Moto-Sensei — umunyamwuga w'uburyo bwo gutwara mu Rwanda. Kumbabare inkuzaze ku byapa, amategeko y'umuhanda, umutekano, amahugurwa y'ikizamini cyangwa ibitekerezo byo guhiga.\n\nHi there! I'm Moto-Sensei — your Rwanda traffic rules AI instructor. Ask me anything about signs, rules, safety, exams, or driving scenarios.\n\n#GerayoAmahoro 🇷🇼🚦",
  isUser: false,
  timestamp: new Date(),
  structured: { language: 'mixed', intent: 'greeting', topic: 'conversation', confidence: 'high' },
};

// ─── Provider ─────────────────────────────────────────────

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const hasSyncedRef = useRef(false);
  const activeConvRef = useRef(activeConversation);
  activeConvRef.current = activeConversation;

  // ── Load conversations on auth change ──
  useEffect(() => {
    if (!user) {
      setConversations([]);
      setActiveConversation(null);
      setIsLoading(false);
      hasSyncedRef.current = false;
      return;
    }

    let cancelled = false;

    (async () => {
      setIsLoading(true);
      try {
        // Try loading from backend
        const serverConvs = await conversationAPI.list();
        if (cancelled) return;

        if (serverConvs.length > 0) {
          // Backend has data — use it
          const formatted = serverConvs.map((c: any) => ({
            ...c,
            id: c._id || c.id,
            createdAt: new Date(c.createdAt),
            updatedAt: new Date(c.updatedAt),
            messages: (c.messages || []).map((m: any) => ({
              ...m,
              timestamp: new Date(m.timestamp),
            })),
          }));
          setConversations(formatted);
          setActiveConversation(formatted[0] || null);
          saveLocal(formatted); // Update localStorage cache
        } else {
          // Backend is empty — check localStorage for migration
          const localConvs = loadLocal();
          if (localConvs.length > 0) {
            // Migrate localStorage conversations to backend
            try {
              const synced = await conversationAPI.sync(localConvs.map(c => ({
                id: c.id,
                title: c.title,
                messages: c.messages.map(m => ({
                  ...m,
                  timestamp: m.timestamp instanceof Date ? m.timestamp.toISOString() : m.timestamp,
                })),
                createdAt: c.createdAt instanceof Date ? c.createdAt.toISOString() : c.createdAt,
                updatedAt: c.updatedAt instanceof Date ? c.updatedAt.toISOString() : c.updatedAt,
              })));
              const formatted = synced.map((c: any) => ({
                ...c,
                id: c._id || c.id,
                createdAt: new Date(c.createdAt),
                updatedAt: new Date(c.updatedAt),
                messages: (c.messages || []).map((m: any) => ({
                  ...m,
                  timestamp: new Date(m.timestamp),
                })),
              }));
              setConversations(formatted);
              setActiveConversation(formatted[0] || null);
              saveLocal(formatted);
            } catch {
              // Sync failed — use localStorage
              setConversations(localConvs);
              setActiveConversation(localConvs[0] || null);
            }
          } else {
            // Fresh user — create first conversation
            const greeting: Conversation = {
              id: generateClientId(),
              title: 'New Chat',
              messages: [GREETING_MESSAGE],
              createdAt: new Date(),
              updatedAt: new Date(),
            };
            // Save to backend
            try {
              const created = await conversationAPI.create({
                title: greeting.title,
                messages: greeting.messages.map(m => ({
                  ...m,
                  timestamp: m.timestamp instanceof Date ? m.timestamp.toISOString() : m.timestamp,
                })),
              });
              greeting.id = created._id || created.id || greeting.id;
            } catch {}
            setConversations([greeting]);
            setActiveConversation(greeting);
            saveLocal([greeting]);
          }
        }
        hasSyncedRef.current = true;
      } catch {
        // Backend failed — fall back to localStorage
        const localConvs = loadLocal();
        setConversations(localConvs);
        if (localConvs.length > 0) {
          setActiveConversation(localConvs[0]);
        } else {
          const greeting: Conversation = {
            id: generateClientId(),
            title: 'New Chat',
            messages: [GREETING_MESSAGE],
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          setConversations([greeting]);
          setActiveConversation(greeting);
          saveLocal([greeting]);
        }
        hasSyncedRef.current = true;
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [user]);

  // ── Sync activeConversation changes back to list and localStorage ──
  useEffect(() => {
    if (!activeConversation) return;
    setConversations(prev => {
      const idx = prev.findIndex(c => c.id === activeConversation.id);
      if (idx === -1) return prev;
      if (prev[idx] === activeConversation) return prev;
      const updated = [...prev];
      updated[idx] = activeConversation;
      return updated;
    });
  }, [activeConversation]);

  // ── Persist to localStorage whenever conversations change ──
  useEffect(() => {
    if (conversations.length > 0) {
      saveLocal(conversations);
    }
  }, [conversations]);

  // ── Backend sync helpers (fire-and-forget) ──
  const syncToBackend = useCallback(async (conv: Conversation) => {
    if (!user) return;
    try {
      // If ID looks like a local ID (not a MongoDB ObjectId), create on backend first
      if (conv.id.startsWith('chat_') && conv.id.length < 30) {
        const created = await conversationAPI.create({
          title: conv.title,
          messages: conv.messages.map(m => ({
            ...m,
            timestamp: m.timestamp instanceof Date ? m.timestamp.toISOString() : m.timestamp,
          })),
        });
        if (created?._id || created?.id) {
          const serverId = created._id || created.id;
          // Update local state with the server ID
          setConversations(prev => prev.map(c =>
            c.id === conv.id ? { ...c, id: serverId } : c
          ));
          if (activeConvRef.current?.id === conv.id) {
            setActiveConversation(prev => prev ? { ...prev, id: serverId } : null);
          }
          return;
        }
      }
      // Regular update
      await conversationAPI.update(conv.id, {
        title: conv.title,
        messages: conv.messages.map(m => ({
          ...m,
          timestamp: m.timestamp instanceof Date ? m.timestamp.toISOString() : m.timestamp,
        })),
      });
    } catch {
      // Silently fail — localStorage is already updated
    }
  }, [user]);

  // ── CRUD operations ──

  const createNewConversation = useCallback((): Conversation => {
    const newConv: Conversation = {
      id: generateClientId(),
      title: 'New Chat',
      messages: [GREETING_MESSAGE],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setConversations(prev => [newConv, ...prev]);
    setActiveConversation(newConv);
    // Save to backend
    syncToBackend(newConv);
    return newConv;
  }, [syncToBackend]);

  const deleteConversation = useCallback((id: string) => {
    setConversations(prev => {
      const filtered = prev.filter(c => c.id !== id);
      setActiveConversation(prevActive => {
        if (prevActive?.id === id) {
          return filtered.length > 0 ? filtered[0] : null;
        }
        return prevActive;
      });
      return filtered;
    });
    // Delete from backend (fire-and-forget)
    if (user && !id.startsWith('chat_')) {
      conversationAPI.delete(id).catch(() => {});
    }
  }, [user]);

  const addMessage = useCallback((conversationId: string, message: ChatMessage) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id !== conversationId) return conv;
      const updated = {
        ...conv,
        messages: [...conv.messages, message],
        updatedAt: new Date(),
      };
      // Auto-generate title from first user message if still "New Chat"
      if (conv.title === 'New Chat' && message.isUser) {
        updated.title = message.text.slice(0, 50) + (message.text.length > 50 ? '...' : '');
      }
      return updated;
    }));
    // Update active conversation if it matches
    setActiveConversation(prev => {
      if (!prev || prev.id !== conversationId) return prev;
      const updated = {
        ...prev,
        messages: [...prev.messages, message],
        updatedAt: new Date(),
      };
      if (prev.title === 'New Chat' && message.isUser) {
        updated.title = message.text.slice(0, 50) + (message.text.length > 50 ? '...' : '');
      }
      return updated;
    });
  }, []);

  const updateMessage = useCallback((conversationId: string, messageId: number, updates: Partial<ChatMessage>) => {
    const updater = (conv: Conversation): Conversation => {
      if (conv.id !== conversationId) return conv;
      return {
        ...conv,
        messages: conv.messages.map(msg =>
          msg.id === messageId ? { ...msg, ...updates } : msg
        ),
        updatedAt: new Date(),
      };
    };
    setConversations(prev => prev.map(updater));
    setActiveConversation(prev => prev ? updater(prev) : null);
  }, []);

  const removeMessage = useCallback((conversationId: string, messageId: number) => {
    const updater = (conv: Conversation): Conversation => {
      if (conv.id !== conversationId) return conv;
      return {
        ...conv,
        messages: conv.messages.filter(msg => msg.id !== messageId),
        updatedAt: new Date(),
      };
    };
    setConversations(prev => prev.map(updater));
    setActiveConversation(prev => prev ? updater(prev) : null);
  }, []);

  const updateConversationTitle = useCallback((id: string, title: string) => {
    setConversations(prev => prev.map(conv =>
      conv.id === id ? { ...conv, title } : conv
    ));
    setActiveConversation(prev =>
      prev?.id === id ? { ...prev, title } : prev
    );
  }, []);

  // ── Export conversations as JSON file ──
  const exportConversations = useCallback(() => {
    const data = conversations.map(conv => ({
      id: conv.id,
      title: conv.title,
      messages: conv.messages.map(m => ({
        ...m,
        timestamp: m.timestamp instanceof Date ? m.timestamp.toISOString() : m.timestamp,
      })),
      createdAt: conv.createdAt instanceof Date ? conv.createdAt.toISOString() : conv.createdAt,
      updatedAt: conv.updatedAt instanceof Date ? conv.updatedAt.toISOString() : conv.updatedAt,
    }));
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ishami-chats-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [conversations]);

  // ── Import conversations from JSON file ──
  const importConversations = useCallback(async (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const raw = JSON.parse(e.target?.result as string);
          if (!Array.isArray(raw)) {
            reject(new Error('Invalid file format'));
            return;
          }
          const imported: Conversation[] = raw.map((conv: any) => ({
            id: conv.id || generateClientId(),
            title: conv.title || 'Imported Chat',
            messages: (conv.messages || []).map((m: any) => ({
              id: m.id || Date.now() + Math.random(),
              text: m.text || '',
              isUser: !!m.isUser,
              timestamp: new Date(m.timestamp || Date.now()),
              image: m.image || null,
              structured: m.structured || null,
            })),
            createdAt: new Date(conv.createdAt || Date.now()),
            updatedAt: new Date(conv.updatedAt || Date.now()),
          }));
          // Merge with existing — skip duplicates by title + message count
          const existingKeys = new Set(
            conversations.map(c => `${c.title}|${c.messages.length}`)
          );
          const newConvs = imported.filter(c => !existingKeys.has(`${c.title}|${c.messages.length}`));
          const merged = [...newConvs, ...conversations];
          setConversations(merged);
          saveLocal(merged);
          // Sync new ones to backend
          for (const conv of newConvs) {
            syncToBackend(conv);
          }
          resolve(newConvs.length);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }, [conversations, syncToBackend]);

  // ── Auto-sync to backend on mutations (debounced) ──
  const syncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!user || !hasSyncedRef.current || conversations.length === 0) return;
    if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    syncTimerRef.current = setTimeout(() => {
      // Sync the most recently updated conversation
      const mostRecent = conversations.reduce((a, b) =>
        new Date(a.updatedAt) > new Date(b.updatedAt) ? a : b
      );
      syncToBackend(mostRecent);
    }, 2000);
    return () => { if (syncTimerRef.current) clearTimeout(syncTimerRef.current); };
  }, [conversations, user, syncToBackend]);

  return (
    <ChatContext.Provider value={{
      conversations,
      activeConversation,
      setActiveConversation,
      createNewConversation,
      deleteConversation,
      addMessage,
      updateMessage,
      removeMessage,
      updateConversationTitle,
      exportConversations,
      importConversations,
      isLoading,
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be used within ChatProvider');
  return context;
};
