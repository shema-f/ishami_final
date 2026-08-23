import { Link, useLocation } from 'react-router';
import { Menu, X, ChevronRight, Globe, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../contexts/I18nContext';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  const { t, lang, setLang } = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { path: '/', label: t('nav.home') },
    { path: '/simulation', label: t('nav.simulation') },
    { path: '/ai-assistant', label: t('nav.aiAssistant') },
    { path: '/quiz', label: t('nav.quiz') },
    { path: '/resources', label: t('nav.resources') },
    { path: '/leaderboard', label: t('nav.leaderboard') },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#16171C]/85 backdrop-blur-xl border-b border-white/15 shadow-lg shadow-black/30' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo - using favicon */}
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div 
              className="relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-black/20 ring-1 ring-white/15 bg-white/5 flex items-center justify-center">
                <img src="/apple-touch-icon.png" alt="ISHAMI Logo" className="w-full h-full object-contain" />
              </div>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#00A3AD] to-blue-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-white font-[family-name:var(--font-heading)] tracking-tight">
                ISHAMI
              </span>
              <span className="text-[10px] text-slate-400 tracking-wider uppercase -mt-1">{t('footer.subtitle')}</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
                  isActive(item.path)
                    ? 'text-white'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {isActive(item.path) && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-white/10 rounded-lg border border-white/10"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10 text-sm">{item.label}</span>
              </Link>
            ))}

            {/* Desktop Language Switcher */}
            <div className="ml-2 inline-flex items-center gap-0.5 px-1 py-1 rounded-xl bg-slate-800/60 border border-slate-700/50">
              <button
                onClick={() => setLang('en')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  lang === 'en'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
                title="English"
              >
                🇬🇧 EN
              </button>
              <button
                onClick={() => setLang('rw')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  lang === 'rw'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
                title="Kinyarwanda"
              >
                🇷🇼 RW
              </button>
            </div>
          </div>

          {/* Right Section */}
          <div className="hidden lg:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-slate-800/60 border border-slate-700/50 hover:bg-slate-700/60 transition-colors group"
                >
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-sm text-slate-200 font-medium group-hover:text-white">{user?.username || 'User'}</span>
                  <User className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300" />
                </Link>
                <button
                  onClick={() => {
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('user');
                    window.location.href = '/';
                  }}
                  className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors font-medium"
                >
                  {t('nav.signOut')}
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/auth"
                  className="px-5 py-2.5 text-slate-300 hover:text-white transition-colors font-medium"
                >
                  {t('nav.signIn')}
                </Link>
                <Link
                  to="/auth"
                  className="group px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-1"
                >
                  {t('nav.getStarted')}
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg bg-slate-800/60 border border-slate-700/50 text-slate-300 hover:text-white hover:bg-slate-700/60 transition-colors"
          >
            {isOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-white/15 bg-[#16171C]/95 backdrop-blur-xl"
          >
            <div className="px-4 py-6 space-y-2">
              {/* Mobile Language Switcher */}
              <div className="mb-4 inline-flex items-center gap-1 px-1 py-1 rounded-xl bg-slate-800/60 border border-slate-700/50">
                <Globe className="w-4 h-4 text-slate-400 ml-2 mr-1" />
                <button
                  onClick={() => setLang('en')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    lang === 'en'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  🇬🇧 EN
                </button>
                <button
                  onClick={() => setLang('rw')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    lang === 'rw'
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  🇷🇼 RW
                </button>
              </div>

              {navItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-3 rounded-xl transition-all font-medium ${
                      isActive(item.path)
                        ? 'bg-blue-500/15 text-white border border-blue-500/20'
                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              
              <div className="pt-4 space-y-3 border-t border-slate-700/50">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/profile"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                    >
                      <User className="w-4 h-4" />
                      <span>Signed in as <span className="text-white font-medium">{user?.username}</span></span>
                    </Link>
                    <button
                      onClick={() => {
                        localStorage.removeItem('authToken');
                        localStorage.removeItem('user');
                        window.location.href = '/';
                      }}
                      className="w-full px-4 py-3 text-center text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                    >
                      {t('nav.signOut')}
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/auth"
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-3 text-center text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors font-medium"
                    >
                      {t('nav.signIn')}
                    </Link>
                    <Link
                      to="/auth"
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-3 text-center bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/25"
                    >
                      {t('nav.getStarted')}
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
