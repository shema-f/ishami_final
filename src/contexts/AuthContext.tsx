import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

interface User {
  id: string;
  username: string;
  email: string;
  isPro: boolean;
  accessTier: 'free' | 'quiz' | 'full';
  role: string;
  loginStreak: number;
  badges: string[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string, phone?: string) => Promise<void>;
  firebaseLogin: (idToken: string) => Promise<void>;
  socialLogin: (provider: 'google' | 'facebook') => Promise<void>;
  googleIdTokenLogin: (idToken: string) => Promise<void>;
  loginPhone: (phone: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setIsLoading(false);
      return;
    }
    (async () => {
      try {
        const res = await authAPI.verifyToken();
        if (res?.user) {
          setUser(res.user);
          localStorage.setItem('user', JSON.stringify(res.user));
        }
      } catch {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await authAPI.signin(email, password);
    localStorage.setItem('authToken', res.token);
    localStorage.setItem('user', JSON.stringify(res.user));
    setUser(res.user);
  };

  const signup = async (username: string, email: string, password: string, phone?: string) => {
    const res = await authAPI.signup(username, email, password, phone);
    localStorage.setItem('authToken', res.token);
    localStorage.setItem('user', JSON.stringify(res.user));
    setUser(res.user);
  };

  const firebaseLogin = async (idToken: string) => {
    const res = await authAPI.firebaseExchange(idToken);
    localStorage.setItem('authToken', res.token);
    localStorage.setItem('user', JSON.stringify(res.user));
    setUser(res.user);
  };

  const socialLogin = async (provider: 'google' | 'facebook') => {
    const res = await authAPI.socialSignin(provider);
    localStorage.setItem('authToken', res.token);
    localStorage.setItem('user', JSON.stringify(res.user));
    setUser(res.user);
  };

  const googleIdTokenLogin = async (idToken: string) => {
    const res = await authAPI.googleVerifyIdToken(idToken);
    localStorage.setItem('authToken', res.token);
    localStorage.setItem('user', JSON.stringify(res.user));
    setUser(res.user);
  };

  const loginPhone = async (phone: string, password: string) => {
    const res = await authAPI.signinPhone(phone, password);
    localStorage.setItem('authToken', res.token);
    localStorage.setItem('user', JSON.stringify(res.user));
    setUser(res.user);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, signup, firebaseLogin, socialLogin, googleIdTokenLogin, loginPhone, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
