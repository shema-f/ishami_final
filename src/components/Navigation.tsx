import { Link, useLocation } from 'react-router';
import { Menu, X, ChevronRight, Globe, User, Bell, Bookmark, History, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../contexts/I18nContext';
import { useNotifications } from '../contexts/NotificationsContext';


export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [blogDropdownOpen, setBlogDropdownOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  const { t, lang, setLang } = useTranslation();
  const { unreadCount } = useNotifications();
  

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setBlogDropdownOpen(false);
    if (blogDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [blogDropdownOpen]);

  const navItems = [
    { path: '/', label: lang === 'rw' ? 'Ahabanza' : 'Home' },
    { path: '/ai-assistant', label: lang === 'rw' ? 'AI' : 'AI' },
    { path: '/quiz', label: lang === 'rw' ? 'Ibizamini' : 'Quiz' },
    { path: '/simulation', label: lang === 'rw' ? '3D Simulation' : 'Simulation' },
    { path: '/courses', label: lang === 'rw' ? 'Amasomo' : 'Courses' },
  ];

  const blogSubItems = [
    { path: '/blog', label: lang === 'rw' ? 'Inkuru' : 'Blog', icon: <Globe className="w-4 h-4" /> },
    { path: '/blog/bookmarks', label: lang === 'rw' ? 'Ibyabikoresheje' : 'Bookmarks', icon: <Bookmark className="w-4 h-4" /> },
    { path: '/blog/notifications', label: lang === 'rw' ? 'Imyirondoro' : 'Notifications', icon: <Bell className="w-4 h-4" />, badge: unreadCount },
  ];

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');
  const isBlogActive = location.pathname.startsWith('/blog');

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/85 dark:bg-[#16171C]/85 backdrop-blur-xl border-b border-black/5 dark:border-white/15 shadow-lg shadow-black/5 dark:shadow-black/30' 
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
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-black/10 dark:shadow-black/20 ring-1 ring-black/5 dark:ring-white/15 bg-white dark:bg-white/5 flex items-center justify-center">
                <img src="/apple-touch-icon.png" alt="ISHAMI Logo" className="w-full h-full object-contain" />
              </div>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#00A3AD] to-blue-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900 dark:text-white font-[family-name:var(--font-heading)] tracking-tight">
                ISHAMI
              </span>
              <span className="text-[10px] text-gray-500 dark:text-slate-400 tracking-wider uppercase -mt-1">{t('footer.subtitle')}</span>
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
                    ? 'text-gray-900 dark:text-white'
                    : 'text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
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

            {/* Blog Dropdown */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setBlogDropdownOpen(!blogDropdownOpen);
                }}
                className={`relative px-4 py-2 rounded-lg transition-all duration-200 font-medium flex items-center gap-1 ${
                  isBlogActive
                    ? 'text-gray-900 dark:text-white'
                    : 'text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                {isBlogActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-white/10 rounded-lg border border-white/10"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10 text-sm">{lang === 'rw' ? 'Inkuru' : 'Blog'}</span>
                <ChevronDown className={`relative z-10 w-3 h-3 transition-transform ${blogDropdownOpen ? 'rotate-180' : ''}`} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold relative z-10">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {blogDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-[#16171C] border border-black/10 dark:border-white/10 rounded-xl shadow-2xl shadow-black/10 dark:shadow-black/30 overflow-hidden z-50"
                  >
                    {blogSubItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setBlogDropdownOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 transition-all ${
                          isActive(item.path)
                            ? 'bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400'
                            : 'text-gray-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
                        }`}
                      >
                        {item.icon}
                        <span className="text-sm font-medium">{item.label}</span>
                        {'badge' in item && item.badge > 0 && (
                          <span className="ml-auto px-2 py-0.5 bg-red-500 text-white text-xs rounded-full font-bold">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>



            {/* Desktop Language Switcher */}
            <div className="ml-1 inline-flex items-center gap-0.5 px-1 py-1 rounded-xl bg-gray-100 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700/50">
              <button
                onClick={() => setLang('en')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  lang === 'en'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
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
                    : 'text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
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
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700/50 hover:bg-gray-200 dark:hover:bg-slate-700/60 transition-colors group"
                >
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-sm text-gray-700 dark:text-slate-200 font-medium group-hover:text-gray-900 dark:group-hover:text-white">{user?.username || 'User'}</span>
                  <User className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500 group-hover:text-gray-600 dark:group-hover:text-slate-300" />
                </Link>
                <button
                  onClick={() => {
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('user');
                    window.location.href = '/';
                  }}
                  className="px-4 py-2 text-sm text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors font-medium"
                >
                  {t('nav.signOut')}
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/auth"
                  className="px-5 py-2.5 text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white transition-colors font-medium"
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
            className="lg:hidden p-2 rounded-lg bg-gray-100 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700/50 text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-slate-700/60 transition-colors"
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
            className="lg:hidden border-t border-black/5 dark:border-white/15 bg-white/95 dark:bg-[#16171C]/95 backdrop-blur-xl"
          >
            <div className="px-4 py-6 space-y-2">
              {/* Mobile Language Switcher */}
              <div className="mb-4 flex items-center gap-3">
                <div className="inline-flex items-center gap-1 px-1 py-1 rounded-xl bg-gray-100 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700/50">
                <Globe className="w-4 h-4 text-slate-400 ml-2 mr-1" />
                <button
                  onClick={() => setLang('en')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    lang === 'en'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                      : 'text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  🇬🇧 EN
                </button>
                <button
                  onClick={() => setLang('rw')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    lang === 'rw'
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md'
                      : 'text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  🇷🇼 RW
                </button>
              </div>
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
                        ? 'bg-blue-500/10 dark:bg-blue-500/15 text-blue-600 dark:text-white border border-blue-500/20'
                        : 'text-gray-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}

              {/* Blog Section (Mobile) */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navItems.length * 0.05 }}
              >
                <div className={`px-4 py-2 text-xs uppercase tracking-wider text-gray-400 dark:text-slate-500 font-semibold ${isBlogActive ? 'text-blue-500 dark:text-blue-400' : ''}`}>
                  {lang === 'rw' ? 'Inkuru' : 'Blog'}
                </div>
                {blogSubItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center justify-between px-4 py-2.5 ml-2 rounded-xl transition-all font-medium ${
                      isActive(item.path)
                        ? 'bg-blue-500/10 dark:bg-blue-500/15 text-blue-600 dark:text-white border border-blue-500/20'
                        : 'text-gray-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                    {'badge' in item && item.badge > 0 && (
                      <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full font-bold">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                ))}
              </motion.div>
              
              <div className="pt-4 space-y-3 border-t border-gray-200 dark:border-slate-700/50">

                {isAuthenticated ? (
                  <>
                    <Link
                      to="/profile"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-colors"
                    >
                      <User className="w-4 h-4" />
                      <span>Signed in as <span className="text-gray-900 dark:text-white font-medium">{user?.username}</span></span>
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
                      className="block px-4 py-3 text-center text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-colors font-medium"
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
    </nav>
  );
}
