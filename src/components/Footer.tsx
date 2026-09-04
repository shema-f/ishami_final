import { Facebook, Instagram, Youtube, Mail, ChevronDown, Heart, ExternalLink, Globe, Code } from 'lucide-react';
import { Link } from 'react-router';
import { useState } from 'react';
import { useTranslation } from '../contexts/I18nContext';

export default function Footer() {
  const [quickOpen, setQuickOpen] = useState(false);
  const [legalOpen, setLegalOpen] = useState(false);
  const { t, lang, setLang } = useTranslation();

  return (
    <footer className="relative bg-[#0E0F13]/90 backdrop-blur-xl border-t border-white/10 mt-20 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-amber-500 to-emerald-500" />
      
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30Z' fill='none' stroke='%233B82F6' stroke-width='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}
      />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand - with ISHAMI favicon logo */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="relative w-12 h-12 rounded-2xl bg-white overflow-hidden shadow-lg shadow-black/30 ring-2 ring-white/10 flex items-center justify-center">
                <img src="/apple-touch-icon.png" alt="ISHAMI Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white font-[family-name:var(--font-heading)]">
                  ISHAMI
                </h3>
                <p className="text-xs text-slate-500 -mt-1 tracking-wide uppercase">{t('footer.subtitle')}</p>
              </div>
            </div>
            <p className="text-slate-400 mb-6 max-w-md leading-relaxed">
              {t('footer.description')}
            </p>

            {/* Language Switcher in Footer */}
            <div className="mb-6 inline-flex items-center gap-1 px-1 py-1 rounded-xl bg-slate-800/60 border border-slate-700/50">
              <span className="pl-2 pr-1">
                <Globe className="w-4 h-4 text-slate-400" />
              </span>
              <button
                onClick={() => setLang('en')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  lang === 'en'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                🇬🇧 EN
              </button>
              <button
                onClick={() => setLang('rw')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  lang === 'rw'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                🇷🇼 RW
              </button>
            </div>

            <div className="flex space-x-3 mb-6">
              <a
                href="https://www.facebook.com/profile.php?id=61550840841725"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50 hover:bg-blue-500/15 hover:border-blue-500/30 transition-all duration-300 group"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors" />
              </a>
              <a
                href="https://www.tiktok.com/@ishami_quiz"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50 hover:bg-pink-500/15 hover:border-pink-500/30 transition-all duration-300 group"
                aria-label="TikTok"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="w-5 h-5 text-slate-400 group-hover:text-pink-400 transition-colors"
                >
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/bruno_munezero"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50 hover:bg-purple-500/15 hover:border-purple-500/30 transition-all duration-300 group"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5 text-slate-400 group-hover:text-purple-400 transition-colors" />
              </a>
              <a
                href="http://www.youtube.com/@ishami012"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50 hover:bg-red-500/15 hover:border-red-500/30 transition-all duration-300 group"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5 text-slate-400 group-hover:text-red-400 transition-colors" />
              </a>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-700/50 bg-slate-800/40">
              <img src="/ferrivox.png" alt="Ferrivox Ltd" className="w-5 h-5 rounded-md" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              <span className="text-xs text-slate-400">
                {t('footer.partnership')} <span className="font-semibold text-white">Ferrivox Ltd</span>
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <div className="flex items-center justify-between md:mb-6">
              <h4 className="text-white font-semibold font-[family-name:var(--font-heading)]">{t('footer.quickLinks')}</h4>
              <button
                type="button"
                aria-expanded={quickOpen}
                className="md:hidden p-2 rounded-lg bg-slate-800/60 text-slate-400 hover:text-white transition-colors"
                onClick={() => setQuickOpen((v) => !v)}
              >
                <ChevronDown className={`w-5 h-5 transition-transform ${quickOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>
            <ul
              className={`space-y-3 transition-all duration-300 overflow-hidden ${
                quickOpen ? 'opacity-100 max-h-96' : 'opacity-0 max-h-0 md:opacity-100 md:max-h-none'
              }`}
            >
              {[
                { path: '/', label: t('nav.home') },
                { path: '/quiz', label: t('nav.quiz') },
                { path: '/courses', label: t('nav.courses') },
                { path: '/leaderboard', label: t('nav.leaderboard') },
                { path: '/developers', label: t('footer.developers'), icon: <Code className="w-3 h-3" /> },
              ].map((item) => (
                <li key={item.path}>
                  <Link 
                    to={item.path} 
                    className="text-slate-400 hover:text-white transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-slate-600 group-hover:bg-blue-500 transition-colors" />
                    {'icon' in item && item.icon}
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <a 
                  href="https://wa.me/250798603694" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-slate-400 hover:text-white transition-colors text-sm flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-slate-600 group-hover:bg-green-500 transition-colors" />
                  {t('footer.contactUs')}
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <div className="flex items-center justify-between md:mb-6">
              <h4 className="text-white font-semibold font-[family-name:var(--font-heading)]">{t('footer.legal')}</h4>
              <button
                type="button"
                aria-expanded={legalOpen}
                className="md:hidden p-2 rounded-lg bg-slate-800/60 text-slate-400 hover:text-white transition-colors"
                onClick={() => setLegalOpen((v) => !v)}
              >
                <ChevronDown className={`w-5 h-5 transition-transform ${legalOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>
            <ul
              className={`space-y-3 transition-all duration-300 overflow-hidden ${
                legalOpen ? 'opacity-100 max-h-96' : 'opacity-0 max-h-0 md:opacity-100 md:max-h-none'
              }`}
            >
              <li>
                <Link to="/privacy" className="text-slate-400 hover:text-white transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-slate-600 group-hover:bg-blue-500 transition-colors" />
                  {t('footer.privacy')}
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-slate-400 hover:text-white transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-slate-600 group-hover:bg-blue-500 transition-colors" />
                  {t('footer.terms')}
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-slate-400 hover:text-white transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-slate-600 group-hover:bg-blue-500 transition-colors" />
                  {t('footer.cookies')}
                </Link>
              </li>
              <li>
                <a 
                  href="https://wa.me/250798603694" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-slate-400 hover:text-white transition-colors text-sm flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-slate-600 group-hover:bg-amber-500 transition-colors" />
                  <Mail className="w-4 h-4" />
                  {t('footer.contactUs')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <svg width="24" height="24" viewBox="0 0 24 24" className="text-slate-700">
              <path d="M12 2L22 12L12 22L2 12Z" fill="currentColor" opacity="0.5" />
              <path d="M12 6L18 12L12 18L6 12Z" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
            </svg>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm">
              © {new Date().getFullYear()} ISHAMI App. {t('footer.rights')}
            </p>
            <p className="text-slate-500 text-sm flex items-center gap-1">
              {t('footer.madeIn')} <Heart className="w-4 h-4 text-red-500" /> Rwanda
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
