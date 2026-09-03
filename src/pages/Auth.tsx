import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, CheckCircle, Brain } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { auth as firebaseAuth } from '../lib/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { authAPI } from '../services/api';
import { useNavigate } from 'react-router';
import { useTranslation } from '../contexts/I18nContext';

export default function Auth() {
  const { t, lang } = useTranslation();
  const features = [
    t('auth.features.quizzes'),
    t('auth.features.ai_assistant'),
    t('auth.features.track_progress'),
    t('auth.features.simulation'),
  ];
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword2, setNewPassword2] = useState('');
  const [forgotStatus, setForgotStatus] = useState('');
  
  const { login, signup, firebaseLogin, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/quiz');
    }
  }, [user, navigate]);

  const handleGoogleFirebaseSignIn = async () => {
    try {
      setError('');
      setLoading(true);
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const cred = await signInWithPopup(firebaseAuth, provider);
      const oauthCred = GoogleAuthProvider.credentialFromResult(cred);
      const idToken = oauthCred?.idToken;
      
      if (!idToken) {
        setError(t('auth.errors.google_sign_in_token', 'Google sign-in did not return an ID token'));
        setLoading(false);
        return;
      }
      
      await firebaseLogin(idToken);
      navigate('/');
    } catch (e: any) {
      if (e?.code === 'auth/popup-blocked') {
        setError(t('auth.errors.popup_blocked', 'Popup was blocked. Please allow popups for this site.'));
      } else if (e?.code === 'auth/popup-closed-by-user') {
        setError(t('auth.errors.sign_in_cancelled', 'Sign-in cancelled.'));
      } else {
        setError(e?.message || t('auth.errors.google_sign_in_failed', 'Google sign-in failed'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignIn) {
        if (!identifier) {
          setError(t('auth.errors.email_phone_required', 'Email or phone is required'));
          setLoading(false);
          return;
        }
        await login(identifier, password);
      } else {
        if (!username) {
          setError(t('auth.errors.username_required', 'Username is required'));
          setLoading(false);
          return;
        }
        if (!identifier) {
          setError(t('auth.errors.email_phone_required', 'Email or phone is required'));
          setLoading(false);
          return;
        }
        const isEmail = identifier.includes('@');
        try {
          const check = await authAPI.checkIdentifier(identifier.trim());
          if (check?.exists) {
            setError(t('auth.errors.account_exists', 'Account already exists. Please sign in.'));
            setIsSignIn(true);
            setLoading(false);
            return;
          }
        } catch {}
        try {
          await signup(username, isEmail ? identifier : '', password, isEmail ? undefined : identifier);
        } catch (e: any) {
          const msg = String(e?.message || '').toLowerCase();
          if (msg.includes('account already exists')) {
            setError(t('auth.errors.account_exists', 'Account already exists. Please sign in.'));
            setIsSignIn(true);
            return;
          }
          throw e;
        }
      }
      navigate('/quiz');
    } catch (err: any) {
      setError(err.message || t('auth.errors.auth_failed', 'Authentication failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      {/* Background glow */}
      <div className="fixed top-1/2 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-64 h-64 bg-green-500/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-5xl w-full grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Side - Branding */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden lg:block"
        >
          <div className="relative">
            {/* Animated Logo */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"
            />
            
            <div className="relative z-10">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-8 shadow-xl shadow-black/20 ring-2 ring-white/40 overflow-hidden"
              >
                <img src="/apple-touch-icon.png" alt="ISHAMI Logo" className="w-full h-full object-contain" />
              </motion.div>
              
              <h1 className="text-4xl font-bold text-white mb-4 font-[family-name:var(--font-heading)]">
                {t('auth.welcome')}
              </h1>
              <p className="text-gray-400 text-lg mb-8">
                {t('auth.tagline')}
              </p>
              
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    </div>
                    <span className="text-gray-300">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Side - Auth Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl"
        >
          {/* Logo for mobile */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center overflow-hidden ring-2 ring-white/20">
              <img src="/apple-touch-icon.png" alt="ISHAMI Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-xl font-bold text-white font-[family-name:var(--font-heading)]">ISHAMI</span>
          </div>

          {/* Toggle Buttons */}
          <div className="flex space-x-2 mb-8 bg-white/5 rounded-xl p-1">
            <button
              onClick={() => { setIsSignIn(true); setError(''); }}
              className={`flex-1 py-3 rounded-lg transition-all duration-300 font-medium ${
                isSignIn
                  ? 'bg-white/10 text-white shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {t('auth.signIn')}
            </button>
            <button
              onClick={() => { setIsSignIn(false); setError(''); }}
              className={`flex-1 py-3 rounded-lg transition-all duration-300 font-medium ${
                !isSignIn
                  ? 'bg-white/10 text-white shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {t('auth.signUp')}
            </button>
          </div>

          <h2 className="text-2xl font-bold text-white mb-2 font-[family-name:var(--font-heading)]">
            {isSignIn ? t('auth.welcomeBack') : t('auth.createAccount')}
          </h2>
          <p className="text-gray-400 mb-8">
            {isSignIn
              ? t('auth.signInTo')
              : t('auth.createAcc')}
          </p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isSignIn && (
              <div>
                <label className="block text-gray-300 mb-2 text-sm font-medium">
                  {t('auth.form.username_label', 'Username')}
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={t('auth.form.username_placeholder', 'Enter your username')}
                    required={!isSignIn}
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500 transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-gray-300 mb-2 text-sm font-medium">
                {t('auth.form.email_phone_label', 'Email or Phone')}
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={t('auth.form.email_phone_placeholder', 'name@example.com or +2507xxxxxxx')}
                  required
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 mb-2 text-sm font-medium">
                {t('auth.form.password_label', 'Password')}
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('auth.form.password_placeholder', 'Enter your password')}
                  required
                  className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {isSignIn && (
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-500 border-white/20 rounded focus:ring-blue-500 bg-white/5"
                  />
                  <span className="text-gray-400 text-sm">{t('auth.form.remember_me', 'Remember me')}</span>
                </label>
                <button type="button" onClick={() => setShowForgot(true)} className="text-blue-400 text-sm hover:text-blue-300 transition-colors">
                  {t('auth.form.forgot_password', 'Forgot password?')}
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {t('auth.button.please_wait', 'Please wait...')}
                </span>
              ) : (
                <>
                  {isSignIn ? t('auth.button.sign_in', 'Sign In') : t('auth.button.sign_up', 'Create Account')}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {showForgot && (
            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-gray-300 mb-2 text-sm font-medium">{t('auth.forgot_password_modal.email_phone_label', 'Email or Phone')}</label>
                <input
                  type="text"
                  value={forgotIdentifier}
                  onChange={(e) => setForgotIdentifier(e.target.value)}
                  placeholder={t('auth.forgot_password_modal.email_phone_placeholder', 'Enter email or phone')}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500"
                />
              </div>
              <button
                onClick={async () => {
                  try {
                    setForgotStatus('');
                    const res = await authAPI.forgotPassword(forgotIdentifier);
                    setForgotStatus(res.sent ? 'Reset link sent to your email' : 'If an account exists, a link has been sent');
                  } catch (e: any) {
                    setForgotStatus(e?.message || 'Request failed');
                  }
                }}
                className="w-full py-3 bg-white/10 text-white rounded-xl hover:bg-white/15 transition-colors font-medium"
              >
                {t('auth.forgot_password_modal.send_reset_link', 'Send Reset Link')}
              </button>
              <div className="text-center">
                <button 
                  onClick={() => setShowForgot(false)}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {t('auth.forgot_password_modal.cancel', 'Cancel')}
                </button>
              </div>
              {forgotStatus && (
                <div className="text-center text-sm text-gray-400">{forgotStatus}</div>
              )}
            </div>
          )}

          {/* Social Login */}
          <div className="mt-8">
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-[#111827] text-gray-400">
                  {t('auth.social.or_continue_with', 'Or continue with')}
                </span>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => handleGoogleFirebaseSignIn()}
                className="flex items-center justify-center space-x-2 py-3 px-8 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
                  <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.6 32.4 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c10.7 0 19.6-8.3 20-19v-4.5z"/>
                  <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.3 16.3 18.8 14 24 14c3 0 5.7 1.1 7.8 3l5.7-5.7C34.6 6.1 29.6 4 24 4 16.6 4 10.3 8.2 6.3 14.7z"/>
                  <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.3l-6.2-5.1c-2 1.7-4.7 2.7-7.4 2.7-5.1 0-9.4-3.3-11-7.9l-6.6 5.1C9.9 39.8 16.5 44 24 44z"/>
                  <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.1-3.5 5.7-6.5 7.2l6.2 5.1C37.8 37.7 44 32.9 44 24c0-1.2-.1-2.3-.4-3.5z"/>
                </svg>
                <span className="text-gray-300">{t('auth.social.google', 'Google')}</span>
              </button>
            </div>
          </div>

          <p className="mt-6 text-center text-gray-500 text-sm">
            {t('auth.legal.by_continuing', 'By continuing, you agree to our')}{' '}
            <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
              {t('auth.legal.terms_of_service', 'Terms of Service')}
            </a>{' '}
            {t('auth.legal.and', 'and')}{' '}
            <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
              {t('auth.legal.privacy_policy', 'Privacy Policy')}
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
