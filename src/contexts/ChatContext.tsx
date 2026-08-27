import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

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
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const STORAGE_KEY = 'ishami_conversations';

function getStorageKey(userId: string): string {
  return `${STORAGE_KEY}_${userId}`;
}

function loadConversations(userId: string): Conversation[] {
  try {
    const data = localStorage.getItem(getStorageKey(userId));
    if (!data) return [];
    const parsed = JSON.parse(data);
    return parsed.map((conv: any) => ({
      ...conv,
      createdAt: new Date(conv.createdAt),
      updatedAt: new Date(conv.updatedAt),
      messages: conv.messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      })),
    }));
  } catch {
    return [];
  }
}

function saveConversations(userId: string, conversations: Conversation[]): void {
  try {
    localStorage.setItem(getStorageKey(userId), JSON.stringify(conversations));
  } catch {}
}

function generateId(): string {
  return `chat_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

const GREETING_MESSAGE: ChatMessage = {
  id: 1,
  text: "Muraho! 👋 Ndi Moto-Sensei — umunyamwuga w'uburyo bwo gutwara mu Rwanda. Kumbabare inkuzaze ku byapa, amategeko y'umuhanda, umutekano, amahugurwa y'ikizamini cyangwa ibitekerezo byo guhiga.\n\nHi there! I'm Moto-Sensei — your Rwanda traffic rules AI instructor. Ask me anything about signs, rules, safety, exams, or driving scenarios.\n\n#GerayoAmahoro 🇷🇼🚦",
  isUser: false,
  timestamp: new Date(),
  structured: { language: 'mixed', intent: 'greeting', topic: 'conversation', confidence: 'high' },
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);

  // Load conversations when user changes
  useEffect(() => {
    if (!user) {
      setConversations([]);
      setActiveConversation(null);
      return;
    }
    const loaded = loadConversations(user.id);
    setConversations(loaded);
    // Auto-select most recent conversation
    if (loaded.length > 0 && !activeConversation) {
      setActiveConversation(loaded[0]);
    }
  }, [user]);

  // Save conversations whenever they change
  useEffect(() => {
    if (!user) return;
    saveConversations(user.id, conversations);
  }, [conversations, user]);

  const createNewConversation = useCallback((): Conversation => {
    const newConv: Conversation = {
      id: generateId(),
      title: 'New Chat',
      messages: [GREETING_MESSAGE],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setConversations(prev => [newConv, ...prev]);
    setActiveConversation(newConv);
    return newConv;
  }, []);

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
  }, []);

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
  }, []);

  const updateMessage = useCallback((conversationId: string, messageId: number, updates: Partial<ChatMessage>) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id !== conversationId) return conv;
      return {
        ...conv,
        messages: conv.messages.map(msg =>
          msg.id === messageId ? { ...msg, ...updates } : msg
        ),
        updatedAt: new Date(),
      };
    }));
  }, []);

  const removeMessage = useCallback((conversationId: string, messageId: number) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id !== conversationId) return conv;
      return {
        ...conv,
        messages: conv.messages.filter(msg => msg.id !== messageId),
        updatedAt: new Date(),
      };
    }));
  }, []);

  const updateConversationTitle = useCallback((id: string, title: string) => {
    setConversations(prev => prev.map(conv =>
      conv.id === id ? { ...conv, title } : conv
    ));
  }, []);

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
