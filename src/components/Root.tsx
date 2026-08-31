import { Outlet } from 'react-router';
import Navigation from './Navigation';
import Footer from './Footer';
import AnimatedBackground from './AnimatedBackground';
import { useEffect, useState, Suspense, Component, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, X, AlertTriangle, RefreshCw } from 'lucide-react';
import { useTranslation } from '../contexts/I18nContext';

// ─── Error Boundary ──────────────────────────────────────
class ErrorBoundary extends Component<{ children: ReactNode; fallback?: ReactNode }, { hasError: boolean; error: Error | null }> {
  state = { hasError: false, error: null as Error | null };
  static getDerivedStateFromError(error: Error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#111827] rounded-3xl border border-white/10 p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-500/15 border border-red-500/25 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
            <p className="text-slate-400 text-sm mb-6">The page failed to load. This might be a temporary issue.</p>
            <button
              onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload(); }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> Try Again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function Root() {
  const { t } = useTranslation();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstall, setShowInstall] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      const hasSeen = localStorage.getItem('ishami_install_prompt_seen');
      if (!hasSeen) {
        setShowInstall(true);
      }
    };
    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => setInstalled(true));
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    if (isStandalone) setInstalled(true);
    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowInstall(false);
      localStorage.setItem('ishami_install_prompt_seen', 'true');
    }
  };

  const handleDismiss = () => {
    setShowInstall(false);
    localStorage.setItem('ishami_install_prompt_seen', 'true');
  };

  return (
    <div className="min-h-screen">
      <AnimatedBackground />
      <Navigation />
      <main>
        <ErrorBoundary>
          <Suspense fallback={null}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />

      <AnimatePresence>
        {!installed && showInstall && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }} 
              className="w-full max-w-sm bg-[#111827]/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/15 overflow-hidden"
            >
              <div className="relative p-6 text-center">
                {/* Close button */}
                <button
                  onClick={handleDismiss}
                  className="absolute top-4 right-4 p-2 rounded-lg bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-700/60 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Logo using favicon */}
                <div className="mx-auto w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-white/20 shadow-lg shadow-blue-500/25 mb-6 bg-white flex items-center justify-center">
                  <img src="/apple-touch-icon.png" alt="ISHAMI Logo" className="w-full h-full object-contain" />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2 font-[family-name:var(--font-heading)]">
                  {t('root.installTitle')}
                </h3>
                <p className="text-slate-400 mb-6 text-sm">
                  {t('root.installDesc')}
                </p>
                
                <div className="space-y-3">
                  <button 
                    onClick={installApp} 
                    className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 transition-all hover:-translate-y-0.5"
                  >
                    <Download className="w-5 h-5" />
                    {t('root.installNow')}
                  </button>
                  <button 
                    onClick={handleDismiss} 
                    className="w-full py-3 text-slate-400 hover:text-white font-medium transition-colors"
                  >
                    {t('root.maybeLater')}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
