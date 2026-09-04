/**
 * API Service Layer
 * 
 * Reads VITE_API_URL from the environment (set at build time by Vite).
 * Falls back to the deployed backend URL when the env var is missing.
 */

const PRIMARY_API_BASE = (import.meta as any).env?.VITE_API_URL || 'https://ishami-final.onrender.com';

// Helper function for API calls
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('authToken');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${PRIMARY_API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      try { localStorage.removeItem('authToken'); localStorage.removeItem('user'); } catch {}
      if (typeof window !== 'undefined') window.location.href = '/auth';
    }
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

// ============================================
// AUTHENTICATION APIs
// ============================================

export const authAPI = {
  /**
   * Sign up new user
   * Backend endpoint: POST /api/auth/signup
   */
  signup: async (username: string, email: string, password: string, phone?: string) => {
    return apiCall('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ username, email, password, phone }),
    });
  },

  /**
   * Sign in existing user
   * Backend endpoint: POST /api/auth/signin
   */
  signin: async (email: string, password: string) => {
    return apiCall('/api/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },
  signinPhone: async (phone: string, password: string) => {
    return apiCall('/api/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ phone, password }),
    });
  },

  /**
   * Verify JWT token
   * Backend endpoint: GET /api/auth/verify
   */
  verifyToken: async () => {
    return apiCall('/api/auth/verify');
  },
  socialSignin: async (provider: 'google' | 'facebook') => {
    return apiCall('/api/auth/social', {
      method: 'POST',
      body: JSON.stringify({ provider }),
    });
  },
  googleVerifyIdToken: async (idToken: string) => {
    return apiCall('/api/auth/google/verify-id-token', {
      method: 'POST',
      body: JSON.stringify({ idToken }),
    });
  },
  updateProfile: async (updates: { username?: string; currentPassword?: string; newPassword?: string }) => {
    return apiCall('/api/auth/update-profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },
  forgotPassword: async (identifier: string) => {
    return apiCall('/api/auth/forgot', {
      method: 'POST',
      body: JSON.stringify({ identifier }),
    });
  },
  resetPassword: async (token: string, password: string) => {
    return apiCall('/api/auth/reset', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    });
  },
  checkIdentifier: async (identifier: string) => {
    return apiCall('/api/auth/check', {
      method: 'POST',
      body: JSON.stringify({ identifier }),
    });
  },
  firebaseExchange: async (idToken: string) => {
    return apiCall('/api/auth/firebase', {
      method: 'POST',
      body: JSON.stringify({ idToken }),
    });
  },
};

// ============================================
// QUIZ APIs
// ============================================

export const quizAPI = {
  /**
   * Get quiz questions
   * Backend endpoint: GET /api/quiz/get_latest?lang=en
   */
  getQuestions: async (lang: string = 'en') => {
    return apiCall(`/api/quiz/get_latest?lang=${lang}`);
  },

  /**
   * List quizzes for cards
   * Backend endpoint: GET /api/quizzes
   */
  listQuizzes: async () => {
    return apiCall('/api/quizzes');
  },

  /**
   * Get quiz by ID (supports 'en' or 'rw' language)
   * Backend endpoint: GET /api/quiz/:quizId?lang=en|rw
   */
  getQuiz: async (quizId: string, lang: string = 'rw') => {
    return apiCall(`/api/quiz/${quizId}?lang=${encodeURIComponent(lang)}`);
  },

  /**
   * Submit quiz answers
   * Backend endpoint: POST /api/quiz/submit
   */
  submitQuiz: async (data: {
    userId: string;
    answers: Array<{ questionId: string; selectedOption: number; isCorrect: boolean }>;
    score: number;
    totalQuestions: number;
    timeTakenSeconds: number;
  }) => {
    return apiCall('/api/quiz/submit', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

/**
 * Retry quiz submissions that failed to reach the backend (offline / network hiccup).
 * Marks are queued in localStorage by Quiz.tsx when submitQuiz fails, then flushed
 * here so scores still land on the leaderboard. Safe to call on any page load.
 */
export async function flushPendingQuizSubmissions(): Promise<void> {
  if (typeof localStorage === 'undefined') return;
  let pending: any[] = [];
  try {
    pending = JSON.parse(localStorage.getItem('ishami_pending_quiz_submissions') || '[]');
  } catch {}
  if (!Array.isArray(pending) || pending.length === 0) return;
  const remaining: any[] = [];
  for (const submission of pending) {
    try {
      await quizAPI.submitQuiz(submission);
    } catch {
      remaining.push(submission);
    }
  }
  try {
    localStorage.setItem('ishami_pending_quiz_submissions', JSON.stringify(remaining));
  } catch {}
}

export const newsletterAPI = {
  subscribe: async (email: string) => {
    return apiCall('/api/newsletter/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },
};

// ============================================
// AI ASSISTANT APIs
// ============================================

export const aiAPI = {
  /**
   * Ask AI assistant a question
   * Backend endpoint: POST /api/ai/ask
   */
  askAssistant: async (prompt: string, sentiment: string = 'neutral', history: Array<{ role: string, content: string }> = [], signal?: AbortSignal) => {
    const response = await apiCall('/api/ai/ask', {
      method: 'POST',
      body: JSON.stringify({ prompt, sentiment, history }),
      signal,
    });
    return {
      text: response.response,
      isPro: response.isPro,
      structured: response.structured || null,
    };
  },
  askAssistantStream: async (
    prompt: string,
    callbacks: {
      onStart?: () => void;
      onToken?: (chunk: string, meta?: any) => void;
      onDone?: (final: { text: string; isPro: boolean; structured: any }) => void;
      onError?: (err: Error) => void;
    },
    sentiment: string = 'neutral',
    history: Array<{ role: string, content: string }> = [],
    signal?: AbortSignal
  ) => {
    try {
      const token = localStorage.getItem('authToken');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream',
      };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const resp = await fetch(`${PRIMARY_API_BASE}/api/ai/stream`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ prompt, sentiment, history }),
        signal,
      });
      if (!resp.ok || !resp.body) {
        if (!resp.ok && resp.headers.get('content-type')?.includes('application/json')) {
          const j = await resp.json();
          throw new Error(j.message || `HTTP ${resp.status}`);
        }
        throw new Error(`Stream failed HTTP ${resp.status}`);
      }
      if (callbacks.onStart) callbacks.onStart();
      const reader = resp.body.getReader();
      const dec = new TextDecoder('utf-8');
      let buffer = '';
      let lastFinal: any = null;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += dec.decode(value, { stream: true });
        const parts = buffer.split(/\n\n/);
        buffer = parts.pop() || '';
        for (const raw of parts) {
          const block = raw.replace(/^data:\s*/gm, '').trim();
          if (!block) continue;
          try {
            const obj = JSON.parse(block);
            if (obj.event === 'token' && callbacks.onToken) {
              callbacks.onToken(obj.chunk || '', obj.meta || obj);
            } else if (obj.event === 'done') {
              lastFinal = { text: obj.response, isPro: obj.isPro, structured: obj.structured || null };
            } else if (obj.event === 'error') {
              if (callbacks.onError) callbacks.onError(new Error(obj.message || 'Stream error'));
            }
          } catch {}
        }
      }
      if (lastFinal && callbacks.onDone) callbacks.onDone(lastFinal);
      if (!lastFinal && callbacks.onError) callbacks.onError(new Error('Stream completed without done event'));
      return lastFinal;
    } catch (e) {
      if (callbacks.onError) callbacks.onError(e as Error);
      throw e;
    }
  },
  getStatus: async () => {
    return apiCall('/api/ai/status');
  },
  simulatorEvent: async (event: string, context: any = {}) => {
    return apiCall('/api/ai/simulator-event', {
      method: 'POST',
      body: JSON.stringify({ event, context })
    });
  },
  examGenerate: async (params: { topic?: string | null; count?: number; language?: string; difficulty?: string } = {}) => {
    return apiCall('/api/ai/exam/generate', {
      method: 'POST',
      body: JSON.stringify(params)
    });
  },
  examSubmit: async (quiz: any, submissions: Array<{ selectedIndex: number | null }>) => {
    return apiCall('/api/ai/exam/submit', {
      method: 'POST',
      body: JSON.stringify({ quiz, submissions })
    });
  }
};

// ============================================
// PAYMENT APIs
// ============================================

export const paymentAPI = {
  /**
   * Initiate payment (legacy MTN MoMo)
   * Backend endpoint: POST /api/payment/initiate
   */
  initiatePayment: async (data: {
    userId: string;
    amount: number;
    phone: string;
    provider: 'mtn';
    product: 'pro' | 'irembo';
  }) => {
    return apiCall('/api/payment/initiate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Check payment status (legacy)
   * Backend endpoint: GET /api/payment/status/:transactionId
   */
  checkStatus: async (transactionId: string) => {
    return apiCall(`/api/payment/status/${transactionId}`);
  },

  // ── Paypack Integration ──────────────────────────────────

  /**
   * Initiate Paypack Cashin — sends USSD push to phone.
   * Backend endpoint: POST /api/paypack/cashin
   * product 'api_pro' = Public API key Pro upgrade (10,000 RWF); pass apiKeyId.
   */
  paypackCashin: async (data: {
    amount: number;
    phone: string;
    product?: 'pro' | 'irembo' | 'api_pro';
    apiKeyId?: string;
    iremboData?: {
      fullName: string;
      nationalId: string;
      email: string;
      language: string;
      testMode: string;
      licenseType: string;
      district: string;
      testDate: string;
    };
  }) => {
    return apiCall('/api/paypack/cashin', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Check Paypack payment status.
   * Backend endpoint: GET /api/paypack/status/:transactionId
   */
  paypackStatus: async (transactionId: string) => {
    return apiCall(`/api/paypack/status/${transactionId}`);
  },

  /**
   * Test Paypack connection.
   * Backend endpoint: GET /api/paypack/test
   */
  paypackTest: async () => {
    return apiCall('/api/paypack/test');
  },
};

// ============================================
// RESOURCES APIs
// ============================================

export const resourcesAPI = {
  /**
   * Get all resources
   * Backend endpoint: GET /api/resources
   */
  getResources: async () => {
    return apiCall('/api/resources');
  },

  /**
   * Download resource
   * Backend endpoint: GET /api/resources/download/:id
   */
  downloadResource: async (resourceId: string) => {
    const token = localStorage.getItem('authToken');
    window.open(`${PRIMARY_API_BASE}/api/resources/download/${resourceId}?token=${token}`, '_blank');
  },
};

// ============================================
// FLIPCARD APIs
// ============================================

export const flipcardsAPI = {
  /**
   * Get daily flip cards
   * Backend endpoint: GET /api/flipcards/daily
   */
  getDaily: async () => {
    return apiCall('/api/flipcards/daily');
  },
};

// ============================================
// CERTIFICATE APIs
// ============================================

export const certificatesAPI = {
  /**
   * Persist a newly earned certificate on the server (signed-in users) so it
   * can be publicly verified at /verify/:certificateNo.
   * Backend endpoint: POST /api/certificates/generate
   */
  generate: async (data: { score: number; totalQuestions: number; quizTitle: string }) => {
    return apiCall('/api/certificates/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

/**
 * Public certificate verification lookup (no auth needed — used by the QR code
 * and the /verify page). Backend endpoint: GET /api/certificates/verify/:certNo
 */
export async function verifyCertificate(certificateNo: string): Promise<any> {
  try {
    const response = await fetch(`${PRIMARY_API_BASE}/api/certificates/verify/${encodeURIComponent(certificateNo)}`, {
      headers: { 'Accept': 'application/json' },
    });
    return await response.json();
  } catch {
    return { valid: false, message: 'Verification service unavailable' };
  }
}

// ============================================
// PDF QUIZ APIs (from extracted PDF document)
// ============================================

export const pdfQuizAPI = {
  /**
   * List all PDF quiz bundles
   * Backend endpoint: GET /api/pdf-quizzes?lang=rw|en
   */
  listBundles: async (lang: string = 'rw') => {
    return apiCall(`/api/pdf-quizzes?lang=${lang}`);
  },

  /**
   * Get a specific PDF quiz bundle's questions (20 questions)
   * Backend endpoint: GET /api/pdf-quizzes/:bundleId?lang=rw|en
   */
  getBundle: async (bundleId: string, lang: string = 'rw') => {
    return apiCall(`/api/pdf-quizzes/${encodeURIComponent(bundleId)}?lang=${lang}`);
  },
};

// ============================================
// PDF FLIP CARD APIs (from extracted PDF document)
// ============================================

export const pdfFlipcardAPI = {
  /**
   * Get all PDF flip cards
   * Backend endpoint: GET /api/pdf-flipcards
   */
  getAll: async () => {
    return apiCall('/api/pdf-flipcards');
  },

  /**
   * Get random PDF flip cards
   * Backend endpoint: GET /api/pdf-flipcards/random?count=6
   */
  getRandom: async (count: number = 6) => {
    return apiCall(`/api/pdf-flipcards/random?count=${count}`);
  },

  /**
   * Get a single PDF flip card by ID
   * Backend endpoint: GET /api/pdf-flipcards/:id
   */
  getById: async (id: number) => {
    return apiCall(`/api/pdf-flipcards/${id}`);
  },
};

// ============================================
// LEADERBOARD APIs
// ============================================

export const leaderboardAPI = {
  /**
   * Get leaderboard
   * Backend endpoint: GET /api/leaderboard?limit=100
   */
  getLeaderboard: async (limit: number = 100) => {
    return apiCall(`/api/leaderboard?limit=${limit}`);
  },
};

// ============================================
// IREMBO APIs
// ============================================

export const iremboAPI = {
  /**
   * Submit Irembo registration
   * Backend endpoint: POST /api/irembo/register
   */
  register: async (data: {
    userId: string;
    fullName: string;
    nationalId: string;
    phone: string;
    email: string;
    language: string;
    testMode: string;
    district: string;
    testDate: string;
    transactionId: string;
  }) => {
    return apiCall('/api/irembo/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// ============================================
// SIMULATION APIs
// ============================================

export const simulationAPI = {
  /**
   * Submit simulation results
   * Backend endpoint: POST /api/simulation/submit
   */
  submitResults: async (data: {
    userId: string;
    scenarioId: string;
    score: number;
    mistakes: number;
    timeTaken: number;
    metadata: any;
  }) => {
    return apiCall('/api/simulation/submit', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// ============================================
// USAGE TRACKING APIs
// ============================================

export const usageAPI = {
  /**
   * Get free question usage counts for the current user.
   * Backend endpoint: GET /api/usage
   */
  getUsage: async () => {
    return apiCall('/api/usage');
  },

  /**
   * Increment free question usage count.
   * @param type - 'ai' or 'quiz'
   * Backend endpoint: POST /api/usage/increment
   */
  increment: async (type: 'ai' | 'quiz') => {
    return apiCall('/api/usage/increment', {
      method: 'POST',
      body: JSON.stringify({ type }),
    });
  },
};

// ============================================
// CONVERSATION (CHAT HISTORY) APIs
// ============================================

export const conversationAPI = {
  /**
   * Get all conversations for the current user
   * Backend endpoint: GET /api/conversations
   */
  list: async () => {
    const res = await apiCall('/api/conversations');
    return res.conversations || [];
  },

  /**
   * Get a single conversation by ID
   * Backend endpoint: GET /api/conversations/:id
   */
  get: async (conversationId: string) => {
    const res = await apiCall(`/api/conversations/${conversationId}`);
    return res.conversation;
  },

  /**
   * Create a new conversation
   * Backend endpoint: POST /api/conversations
   */
  create: async (data: { title?: string; messages?: any[] }) => {
    const res = await apiCall('/api/conversations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.conversation;
  },

  /**
   * Update a conversation (title, messages)
   * Backend endpoint: PUT /api/conversations/:id
   */
  update: async (conversationId: string, data: { title?: string; messages?: any[] }) => {
    const res = await apiCall(`/api/conversations/${conversationId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return res.conversation;
  },

  /**
   * Delete a conversation
   * Backend endpoint: DELETE /api/conversations/:id
   */
  delete: async (conversationId: string) => {
    return apiCall(`/api/conversations/${conversationId}`, {
      method: 'DELETE',
    });
  },

  /**
   * Batch sync multiple conversations from localStorage
   * Backend endpoint: POST /api/conversations/sync
   */
  sync: async (conversations: any[]) => {
    const res = await apiCall('/api/conversations/sync', {
      method: 'POST',
      body: JSON.stringify({ conversations }),
    });
    return res.conversations || [];
  },

  /**
   * Generate a shareable link for a conversation
   * Backend endpoint: POST /api/conversations/:id/share
   */
  share: async (conversationId: string) => {
    const res = await apiCall(`/api/conversations/${conversationId}/share`, {
      method: 'POST',
    });
    return res.shareToken;
  },

  /**
   * Stop sharing a conversation
   * Backend endpoint: DELETE /api/conversations/:id/share
   */
  unshare: async (conversationId: string) => {
    return apiCall(`/api/conversations/${conversationId}/share`, {
      method: 'DELETE',
    });
  },

  /**
   * Get a shared conversation by token (public, no auth required)
   * Backend endpoint: GET /api/shared/:token
   */
  getShared: async (token: string) => {
    const res = await apiCall(`/api/shared/${token}`);
    return res.conversation;
  },
};

// ============================================
// ADMIN APIs
// ============================================

export const adminAPI = {
  /**
   * Get dashboard analytics
   * Backend endpoint: GET /api/admin/analytics
   */
  getAnalytics: async () => {
    return apiCall('/api/admin/analytics');
  },

  /**
   * Get all users
   * Backend endpoint: GET /api/admin/users?page=1&limit=50
   */
  getUsers: async (page: number = 1, limit: number = 50) => {
    return apiCall(`/api/admin/users?page=${page}&limit=${limit}`);
  },

  /**
   * Update user
   * Backend endpoint: PUT /api/admin/users/:userId
   */
  updateUser: async (userId: string, updates: any) => {
    return apiCall(`/api/admin/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  /**
   * Delete user
   * Backend endpoint: DELETE /api/admin/users/:userId
   */
  deleteUser: async (userId: string) => {
    return apiCall(`/api/admin/users/${userId}`, {
      method: 'DELETE',
    });
  },

  /**
   * Get all quizzes
   * Backend endpoint: GET /api/admin/quizzes?page=1&limit=50
   */
  getQuizzes: async (page: number = 1, limit: number = 50) => {
    return apiCall(`/api/admin/quizzes?page=${page}&limit=${limit}`);
  },

  /**
   * Create quiz
   * Backend endpoint: POST /api/admin/quizzes
   */
  createQuiz: async (quiz: { title: string; category: string; image?: string | null }) => {
    return apiCall('/api/admin/quizzes', {
      method: 'POST',
      body: JSON.stringify(quiz),
    });
  },

  /**
   * Update quiz
   * Backend endpoint: PUT /api/admin/quizzes/:quizId
   */
  updateQuiz: async (quizId: string, updates: { title?: string; category?: string; image?: string | null }) => {
    return apiCall(`/api/admin/quizzes/${quizId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  /**
   * Delete quiz
   * Backend endpoint: DELETE /api/admin/quizzes/:quizId
   */
  deleteQuiz: async (quizId: string) => {
    return apiCall(`/api/admin/quizzes/${quizId}`, {
      method: 'DELETE',
    });
  },

  /**
   * Get all quiz questions
   * Backend endpoint: GET /api/admin/questions?page=1&limit=50
   */
  getQuestions: async (page: number = 1, limit: number = 50) => {
    return apiCall(`/api/admin/questions?page=${page}&limit=${limit}`);
  },

  /**
   * Create quiz question
   * Backend endpoint: POST /api/admin/questions
   */
  createQuestion: async (question: any) => {
    return apiCall('/api/admin/questions', {
      method: 'POST',
      body: JSON.stringify(question),
    });
  },

  /**
   * Update quiz question
   * Backend endpoint: PUT /api/admin/questions/:questionId
   */
  updateQuestion: async (questionId: string, updates: any) => {
    return apiCall(`/api/admin/questions/${questionId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  /**
   * Delete quiz question
   * Backend endpoint: DELETE /api/admin/questions/:questionId
   */
  deleteQuestion: async (questionId: string) => {
    return apiCall(`/api/admin/questions/${questionId}`, {
      method: 'DELETE',
    });
  },

  /**
   * Get all payments
   * Backend endpoint: GET /api/admin/payments?page=1&limit=50
   */
  getPayments: async (page: number = 1, limit: number = 50) => {
    return apiCall(`/api/admin/payments?page=${page}&limit=${limit}`);
  },

  /**
   * Get all Irembo applications
   * Backend endpoint: GET /api/admin/irembo?page=1&limit=50
   */
  getIremboApplications: async (page: number = 1, limit: number = 50) => {
    return apiCall(`/api/admin/irembo?page=${page}&limit=${limit}`);
  },

  /**
   * Update Irembo application
   * Backend endpoint: PUT /api/admin/irembo/:applicationId
   */
  updateIremboApplication: async (applicationId: string, updates: any) => {
    return apiCall(`/api/admin/irembo/${applicationId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  /**
   * Upload resource
   * Backend endpoint: POST /api/admin/resources
   */
  uploadResource: async (formData: FormData) => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${PRIMARY_API_BASE}/api/admin/resources`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    return response.json();
  },

  /**
   * Delete resource
   * Backend endpoint: DELETE /api/admin/resources/:resourceId
   */
  deleteResource: async (resourceId: string) => {
    return apiCall(`/api/admin/resources/${resourceId}`, {
      method: 'DELETE',
    });
  },

  /**
   * Get notifications
   * Backend endpoint: GET /api/admin/notifications
   */
  getNotifications: async (page: number = 1, limit: number = 50) => {
    return apiCall(`/api/admin/notifications?page=${page}&limit=${limit}`);
  },

  /**
   * Delete notification
   * Backend endpoint: DELETE /api/admin/notifications/:notificationId
   */
  deleteNotification: async (notificationId: string) => {
    return apiCall(`/api/admin/notifications/${notificationId}`, {
      method: 'DELETE',
    });
  },

  /**
   * Send push notification
   * Backend endpoint: POST /api/admin/notifications
   */
  sendNotification: async (data: {
    title: string;
    body: string;
    segment: string;
    scheduledAt?: string;
  }) => {
    return apiCall('/api/admin/notifications', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Get fraud logs
   * Backend endpoint: GET /api/admin/fraud-logs?page=1&limit=50
   */
  getFraudLogs: async (page: number = 1, limit: number = 50) => {
    return apiCall(`/api/admin/fraud-logs?page=${page}&limit=${limit}`);
  },

  /**
   * Get user logs
   * Backend endpoint: GET /api/admin/user-logs/:userId
   */
  getUserLogs: async (userId: string) => {
    return apiCall(`/api/admin/user-logs/${userId}`);
  },

  getNewsletterSubscribers: async (page: number = 1, limit: number = 50) => {
    return apiCall(`/api/admin/newsletter/subscribers?page=${page}&limit=${limit}`);
  },
  getNewsletterCampaigns: async (page: number = 1, limit: number = 50) => {
    return apiCall(`/api/admin/newsletter/campaigns?page=${page}&limit=${limit}`);
  },
  sendNewsletter: async (subject: string, body: string) => {
    return apiCall('/api/admin/newsletter/send', {
      method: 'POST',
      body: JSON.stringify({ subject, body }),
    });
  },

  // ── Public API keys & usage (live backend data) ─────────────────────

  /**
   * List all public API keys (admin)
   * Backend endpoint: GET /api/admin/api/keys
   */
  getApiKeys: async () => {
    const res = await apiCall('/api/admin/api/keys');
    return res.data || { keys: [], total: 0, active: 0, pro: 0, enterprise: 0 };
  },

  /**
   * Create a public API key (admin) with an access plan.
   * Backend endpoint: POST /api/admin/api/keys
   */
  createApiKey: async (data: { name: string; website?: string; plan?: 'free' | 'pro' | 'enterprise'; rateLimit?: number }) => {
    const res = await apiCall('/api/admin/api/keys', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.data;
  },

  /**
   * Update a public API key (admin): plan, active state, rate limit, etc.
   * Backend endpoint: PATCH /api/admin/api/keys/:id
   */
  updateApiKey: async (id: string, updates: { name?: string; website?: string; plan?: 'free' | 'pro' | 'enterprise'; rateLimit?: number; isActive?: boolean }) => {
    const res = await apiCall(`/api/admin/api/keys/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
    return res.data;
  },

  /**
   * Delete a public API key (admin)
   * Backend endpoint: DELETE /api/admin/api/keys/:id
   */
  deleteApiKey: async (id: string) => {
    return apiCall(`/api/admin/api/keys/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Get usage summary + recent request logs (admin)
   * Backend endpoint: GET /api/admin/api/usage?limit=300&days=7
   */
  getApiUsage: async () => {
    const res = await apiCall('/api/admin/api/usage?limit=300&days=7');
    return res.data || { summary: null, logs: [] };
  },
};

export default {
  auth: authAPI,
  quiz: quizAPI,
  ai: aiAPI,
  payment: paymentAPI,
  resources: resourcesAPI,
  leaderboard: leaderboardAPI,
  irembo: iremboAPI,
  simulation: simulationAPI,
  conversations: conversationAPI,
  admin: adminAPI,
  newsletter: newsletterAPI,
};
