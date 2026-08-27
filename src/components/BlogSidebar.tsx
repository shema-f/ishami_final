import { motion } from 'motion/react';
import { ExternalLink, Star, Shield, Award, BookOpen } from 'lucide-react';
import { useTranslation } from '../contexts/I18nContext';
import { Link } from 'react-router';

export default function BlogSidebar() {
  const { lang } = useTranslation();

  return (
    <aside className="space-y-6">
      {/* Featured Ad - Ferrivox */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-gradient-to-br from-[#1a1f2e] to-[#0d1117] rounded-2xl border border-white/10 p-6 overflow-hidden relative"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-4 h-4 text-yellow-400" />
            <span className="text-xs text-yellow-400 font-semibold uppercase tracking-wider">
              {lang === 'rw' ? 'Ikanjyamo' : 'Sponsored'}
            </span>
          </div>
          <h3 className="text-lg font-bold text-white mb-2 font-[family-name:var(--font-heading)]">
            Ferrivox Ltd
          </h3>
          <p className="text-gray-400 text-sm mb-4">
            {lang === 'rw' 
              ? 'Ishirahamwe ry\'Ikoranabuhanga n\'Ubufasha bw\'Amakuru'
              : 'Software Development & Data Engineering Company'}
          </p>
          <p className="text-gray-500 text-xs mb-4">
            {lang === 'rw'
              ? 'Dukora uburyo bw\'ikoranabuhanga bushya, harimo urubuga rwa ISHAMI.'
              : 'Building innovative digital solutions including the ISHAMI platform.'}
          </p>
          <a
            href="https://ferrivox.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-500/30 transition-all"
          >
            {lang === 'rw' ? 'Sura Ferrivox' : 'Visit Ferrivox'}
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </motion.div>

      {/* Irembo Service Ad */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 rounded-2xl border border-purple-500/20 p-6"
      >
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-4 h-4 text-purple-400" />
          <span className="text-xs text-purple-400 font-semibold uppercase tracking-wider">
            {lang === 'rw' ? 'Serivisi' : 'Service'}
          </span>
        </div>
        <h3 className="text-lg font-bold text-white mb-2 font-[family-name:var(--font-heading)]">
          {lang === 'rw' ? 'Irembo Registration' : 'Irembo Registration'}
        </h3>
        <p className="text-gray-400 text-sm mb-4">
          {lang === 'rw'
            ? 'Twagufasha kubona kode yo gukorera ikizamini binyuze muri serivisi za Irembo.'
            : 'Get help registering for your driving test through Irembo services.'}
        </p>
        <div className="text-xs text-purple-300 mb-4">
          {lang === 'rw'
            ? 'Igiciro cya Serivisi: 5,500 RWF'
            : 'Service Fee: 5,500 RWF'}
        </div>
        <Link
          to="/irembo"
          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/30 text-purple-400 rounded-lg text-sm font-medium hover:bg-purple-500/30 transition-all"
        >
          {lang === 'rw' ? 'Bona Ubufasha' : 'Get Help'}
          <ExternalLink className="w-3 h-3" />
        </Link>
      </motion.div>

      {/* Pro Upgrade Ad */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-yellow-900/50 to-orange-800/30 rounded-2xl border border-yellow-500/20 p-6"
      >
        <div className="flex items-center gap-2 mb-3">
          <Award className="w-4 h-4 text-yellow-400" />
          <span className="text-xs text-yellow-400 font-semibold uppercase tracking-wider">
            {lang === 'rw' ? 'Kwiyongera' : 'Upgrade'}
          </span>
        </div>
        <h3 className="text-lg font-bold text-white mb-2 font-[family-name:var(--font-heading)]">
          {lang === 'rw' ? 'Fungura Byose nka Pro' : 'Unlock Pro Access'}
        </h3>
        <p className="text-gray-400 text-sm mb-4">
          {lang === 'rw'
            ? 'Fungura ibibazo byose, imyitozo ya 3D, n\'ubufasha bwa AI.'
            : 'Get unlimited quizzes, 3D simulations, and AI assistant.'}
        </p>
        <div className="text-xs text-yellow-300 mb-4">
          {lang === 'rw' ? 'Kuri 100 RWF gusa' : 'For only 100 RWF'}
        </div>
        <Link
          to="/quiz"
          className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 rounded-lg text-sm font-medium hover:bg-yellow-500/30 transition-all"
        >
          {lang === 'rw' ? 'Tangira Kwiga' : 'Start Learning'}
          <ExternalLink className="w-3 h-3" />
        </Link>
      </motion.div>

      {/* Quick Links */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/5 rounded-2xl border border-white/10 p-6"
      >
        <h3 className="text-lg font-bold text-white mb-4 font-[family-name:var(--font-heading)]">
          {lang === 'rw' ? 'Ibintu Bih快速' : 'Quick Links'}
        </h3>
        <div className="space-y-2">
          <Link to="/quiz" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
            <BookOpen className="w-4 h-4" />
            {lang === 'rw' ? 'Kora Ikizamini' : 'Take a Quiz'}
          </Link>
          <Link to="/ai-assistant" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
            <Shield className="w-4 h-4" />
            {lang === 'rw' ? 'AI Assistant' : 'AI Assistant'}
          </Link>
          <Link to="/simulation" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
            <Award className="w-4 h-4" />
            {lang === 'rw' ? '3D Simulation' : '3D Simulation'}
          </Link>
          <Link to="/resources" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
            <Star className="w-4 h-4" />
            {lang === 'rw' ? 'Imfashanyigisho' : 'Resources'}
          </Link>
        </div>
      </motion.div>
    </aside>
  );
}
