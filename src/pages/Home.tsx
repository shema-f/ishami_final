import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Zap, Brain, BookOpen, Trophy, Car, ChevronRight, Star, Mail, ArrowRight, Sparkles, Shield, Target, Award, CheckCircle2 } from 'lucide-react';
import { useState, lazy, Suspense } from 'react';
import { newsletterAPI } from '../services/api';
import { toast } from 'sonner';
import { useTranslation } from '../contexts/I18nContext';

// Lazy-load heavy components below the fold
const FlipCard = lazy(() => import('../components/FlipCard'));
const TestimonialCarousel = lazy(() => import('../components/TestimonialCarousel'));

// Lazy-load the hero — the 3D scene + GSAP + three.js are code-split into a separate chunk
const CinematicHero = lazy(() => import('../components/hero/CinematicHero'));

export default function Home() {
  const { t, lang } = useTranslation();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await newsletterAPI.subscribe(email);
      if (res?.success) {
        setSubscribed(true);
        setEmail('');
        toast.success(t('home.newsletter.success', '✓ Thank you for subscribing! Check your email for confirmation.'));
      }
    } catch {
      toast.error(t('home.newsletter.error', 'Subscription failed. Please try again.'));
    }
  };

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: t('home.features.quizzes_title', 'Interactive Quizzes'),
      description: t('home.features.quizzes_desc', 'Test your knowledge with timed quizzes based on real Rwanda traffic rules.'),
      link: '/quiz',
      color: 'from-blue-500 to-blue-600',
      glow: 'shadow-blue-500/25'
    },
    {
      icon: <Car className="w-6 h-6" />,
      title: t('home.features.simulation_title', '3D Driving Simulation'),
      description: t('home.features.simulation_desc', 'Practice real-world scenarios in immersive 3D environments.'),
      link: '/simulation',
      color: 'from-purple-500 to-purple-600',
      glow: 'shadow-purple-500/25'
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: t('home.features.ai_title', 'AI Assistant - Moto-Sensei'),
      description: t('home.features.ai_desc', 'Get instant answers from your friendly Rwandan driving instructor.'),
      link: '/ai-assistant',
      color: 'from-emerald-500 to-emerald-600',
      glow: 'shadow-emerald-500/25'
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: t('home.features.resources_title', 'Download Resources'),
      description: t('home.features.resources_desc', 'Access PDFs, videos, and images of traffic signs and rules.'),
      link: '/resources',
      color: 'from-amber-500 to-amber-600',
      glow: 'shadow-amber-500/25'
    }
  ];

  const stats = [
    { value: '10K+', label: t('home.stats.students', 'Students'), icon: <Target className="w-5 h-5" /> },
    { value: '500+', label: t('home.stats.questions', 'Questions'), icon: <BookOpen className="w-5 h-5" /> },
    { value: '95%', label: t('home.stats.pass_rate', 'Pass Rate'), icon: <Trophy className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen">
      {/* Cinematic 3D Hero Section (lazy-loaded) */}
      <Suspense
        fallback={
          <section className="relative bg-[#0a0e14]" style={{ height: '100dvh', minHeight: '600px' }}>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                <span className="text-slate-400 text-sm tracking-wider">{t('home.loading', 'Loading...')}</span>
              </div>
            </div>
          </section>
        }
      >
        <CinematicHero />
      </Suspense>

      {/* Features Section */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-[family-name:var(--font-heading)]">
              {t('home.features.title')}
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              {t('home.features.sub')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={feature.link}
                  className="block group"
                >
                  <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 h-full hover:bg-white/15 hover:border-white/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10">
                    {/* Icon */}
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} text-white mb-4 shadow-lg ${feature.glow} group-hover:scale-110 transition-transform`}>
                      {feature.icon}
                    </div>
                    
                    <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
                    
                    <div className="mt-4 flex items-center text-blue-400 group-hover:text-blue-300">
                      <span className="text-sm font-medium">{t('home.learn_more', 'Learn more')}</span>
                      <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Assistant CTA */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#111827] to-[#030712] p-8 sm:p-12 border border-white/15 shadow-xl shadow-black/30"
          >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px]" />
            
            {/* Imigongo decorative corner */}
            <svg className="absolute top-0 right-0 w-32 h-32 opacity-20" viewBox="0 0 100 100">
              <path d="M100 0L100 100L0 100" fill="none" stroke="#F59E0B" strokeWidth="2"/>
              <path d="M100 20L100 100L20 100" fill="none" stroke="#F59E0B" strokeWidth="1" opacity="0.5"/>
            </svg>
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8">
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
                  <Brain className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm text-emerald-400 font-medium">{t('home.ai_section.badge', 'AI-Powered Learning')}</span>
                </div>
                
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-[family-name:var(--font-heading)]">
                  {t('home.ai_section.title', 'Meet Moto-Sensei')}
                </h2>
                <p className="text-slate-400 mb-6 max-w-lg leading-relaxed">
                  {t('home.ai_section.description', 'Your friendly AI driving instructor. Ask questions in Kinyarwanda, get instant explanations, and master traffic rules faster.')}
                </p>
                
                <Link
                  to="/ai-assistant"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-emerald-500/25 transition-all duration-300 hover:-translate-y-0.5"
                >
                  <span>{t('home.ai_section.cta', 'Chat with Moto-Sensei')}</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
              
              {/* Chat Preview */}
              <div className="w-full lg:w-auto lg:max-w-sm">
                <div className="bg-[#030712]/70 rounded-2xl p-4 border border-white/15">
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                        <Brain className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-white/10 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-slate-200 border border-white/15">
                        {t('home.ai_section.preview_greeting', "Muraho! I'm Moto-Sensei. What would you like to learn today?")}
                      </div>
                    </div>
                    <div className="flex gap-3 justify-end">
                      <div className="bg-blue-500 rounded-2xl rounded-tr-sm px-4 py-3 text-sm text-white">
                        {t('home.ai_section.preview_question', 'What does a red triangle sign mean?')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Flip Cards Section */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-[family-name:var(--font-heading)]">
              {t('home.flip.title')}
            </h2>
            <p className="text-slate-400">
              {t('home.flip.subtitle')}
            </p>
          </div>
          <Suspense fallback={<div className="h-64 flex items-center justify-center"><div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" /></div>}>
            <FlipCard />
          </Suspense>
        </div>
      </section>

      {/* Certification CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl p-8 sm:p-12"
            style={{
              background: 'linear-gradient(135deg, #0a1628 0%, #0d1f3c 40%, #0f2340 70%, #0a1628 100%)',
            }}
          >
            {/* Gold accent lines */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-600" />
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-500" />

            {/* Pattern overlay */}
            <div className="absolute inset-0 opacity-5">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="cert-home-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M20 0L40 20L20 40L0 20Z" fill="none" stroke="#c9a84c" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#cert-home-pattern)" />
              </svg>
            </div>

            {/* Glow orbs */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px]" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10">
              {/* Left content */}
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 mb-6">
                  <Award className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-yellow-400 font-medium">{t('home.certificate_section.badge', 'Earn Your Certificate')}</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-[family-name:var(--font-heading)]">
                  {t('home.certificate_section.title', 'Get Your Official ISHAMI Certificate')}
                </h2>
                <p className="text-slate-400 mb-6 max-w-lg leading-relaxed">
                  {t('home.certificate_section.description', 'Complete the Traffic Rules & Road Safety quiz and earn an official certificate. Share it with employers, print it, or verify it online. Prove your driving knowledge!')}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link
                    to="/quiz"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-slate-900 rounded-xl font-bold hover:shadow-xl hover:shadow-yellow-500/25 transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <Trophy className="w-5 h-5" />
                    <span>{t('home.certificate_section.take_quiz', 'Take a Quiz')}</span>
                  </Link>
                  <Link
                    to="/certificate"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/15 text-white rounded-xl font-semibold hover:bg-white/10 transition-all duration-300"
                  >
                    <span>{t('home.certificate_section.view_certificate', 'View Certificate')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Right: Mini certificate preview */}
              <div className="w-full lg:w-80 shrink-0">
                <div className="bg-gradient-to-br from-[#0f2340] to-[#0a1628] rounded-2xl p-6 border border-yellow-500/20 shadow-2xl shadow-black/30">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center overflow-hidden">
                      <img src="/apple-touch-icon.png" alt="ISHAMI" className="w-6 h-6 object-contain" />
                    </div>
                    <span className="text-sm font-bold text-white">ISHAMI</span>
                  </div>
                  <p className="text-[10px] text-yellow-500 uppercase tracking-widest mb-2 font-bold">{t('home.certificate_section.certificate_title', 'Certificate of Completion')}</p>
                  <div className="h-2 w-20 bg-yellow-500/30 rounded-full mb-4" />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-white">87%</p>
                      <p className="text-[10px] text-slate-500">{t('home.certificate_section.final_score', 'Final Score')}</p>
                    </div>
                    <div className="p-3 rounded-full bg-yellow-500/20">
                      <Shield className="w-6 h-6 text-yellow-400" />
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    <span className="text-xs text-slate-400">{t('home.certificate_section.electronically_verifiable', 'Electronically verifiable')}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-[family-name:var(--font-heading)]">
              {t('home.testimonials.title')}
            </h2>
            <p className="text-slate-400">
              {t('home.testimonials.subtitle', 'Join thousands of successful learners')}
            </p>
          </div>
          <Suspense fallback={<div className="h-64 flex items-center justify-center"><div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" /></div>}>
            <TestimonialCarousel />
          </Suspense>
        </div>
      </section>

      {/* Irembo Service CTA */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 to-purple-800 p-8 md:p-12"
          >
            {/* Imigongo geometric overlay */}
            <div 
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30Z' fill='none' stroke='white' stroke-width='1'/%3E%3C/svg%3E")`,
                backgroundSize: '60px 60px'
              }}
            />
            <div className="relative z-10 text-center text-white">
              <Trophy className="w-16 h-16 mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-4 font-[family-name:var(--font-heading)]">{t('home.irembo_section.title', 'Need Help with Irembo Registration?')}</h2>
              <p className="mb-8 text-purple-100">
                {t('home.irembo_section.description', 'We can help you get your exam code through Irembo services. Fast, reliable, and secure assistance.')}
              </p>
              <Link
                to="/irembo"
                className="inline-flex items-center px-8 py-4 bg-white text-purple-700 rounded-xl font-semibold hover:bg-slate-100 transition-all duration-300 gap-2 hover:shadow-xl hover:-translate-y-0.5"
              >
                <span>{t('home.irembo_section.cta', 'Get Irembo Help')}</span>
                <ChevronRight className="w-5 h-5" />
              </Link>
              <p className="mt-4 text-sm text-purple-200">
                {t('home.irembo_section.fee', 'Service Fee: 5,500 RWF | Processing Time: Within 8 hours')}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Mail className="w-12 h-12 mx-auto mb-6 text-blue-400" />
            <h2 className="text-3xl font-bold text-white mb-4 font-[family-name:var(--font-heading)]">
              {t('home.newsletter.title')}
            </h2>
            <p className="text-slate-400 mb-8">
              {t('home.newsletter.desc')}
            </p>

            {subscribed ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl"
              >
                <p className="text-emerald-400">
                  {t('home.newsletter.success', '✓ Thank you for subscribing! Check your email for confirmation.')}
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  name="email"
                  aria-label="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('home.newsletter.enter_email', 'Enter your email')}
                  required
                  className="flex-1 px-6 py-4 bg-white/5 border border-white/15 rounded-[14px] focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-500 transition-all"
                />
                <button
                  type="submit"
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-[14px] font-semibold hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 hover:-translate-y-0.5"
                >
                  {t('home.newsletter.subscribe', 'Subscribe')}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-700 p-12 rounded-3xl text-white"
          >
            {/* Imigongo geometric overlay */}
            <div 
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0L40 20L20 40L0 20Z' fill='none' stroke='white' stroke-width='0.5'/%3E%3C/svg%3E")`,
                backgroundSize: '40px 40px'
              }}
            />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 font-[family-name:var(--font-heading)]">
                {t('home.cta.title')}
              </h2>
              <p className="text-lg text-blue-100 mb-8">
                {t('home.cta.subtitle')}
              </p>
              <Link
                to="/auth"
                className="inline-flex items-center gap-2 px-10 py-5 bg-white text-blue-600 rounded-xl font-bold text-lg hover:bg-slate-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
              >
                <span>{t('home.cta.start')}</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
