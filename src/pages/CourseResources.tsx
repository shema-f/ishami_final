import { Link, useParams } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, FileText, Video, Image as ImageIcon, Download, Play, Lock, BookOpen, MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { resourcesAPI } from '../services/api';
import { useCourse } from '../hooks/useCourses';
import { useTranslation } from '../contexts/I18nContext';
import AccessGate from '../components/AccessGate';

export const WHATSAPP_NUMBER = '250790486304';
export const WHATSAPP_DISPLAY = '0790486304';

interface CourseResource {
  id: string;
  title_en: string;
  title_kiny: string;
  type: 'PDF' | 'Video' | 'Image';
  category: string;
  isPremium: boolean;
  fileUrl: string | null;
  thumbnail?: string;
  size?: string;
  courseId?: string;
  description?: string;
}

export default function CourseResources() {
  const { courseId } = useParams();
  const { t, lang } = useTranslation();
  const { course, loading: courseLoading } = useCourse(courseId);

  return (
    <AccessGate
      requiredTier="quiz"
      title={t('courses.require_quiz_access', 'Courses Require Quiz Access')}
      description={t('courses.require_quiz_access_desc', 'Upgrade to Quiz Access (1,000 RWF) to unlock all courses and lessons.')}
    >
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back link */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-6">
          <Link to={courseId ? `/courses/${courseId}` : '/courses'} className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">
              {lang === 'rw'
                ? (course ? `Subira kuri ${course.titleKiny || course.title}` : 'Subira ku Masomo')
                : (course ? `Back to ${course.title}` : 'Back to Courses')}
            </span>
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className={`inline-flex p-4 bg-gradient-to-br ${course?.gradient || 'from-amber-500 to-orange-600'} rounded-3xl mb-6 shadow-lg shadow-amber-500/25`}>
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 font-[family-name:var(--font-heading)]">
            {lang === 'rw'
              ? `${course?.titleKiny || 'Isomo'}: Ibikoresho byo Kwiga`
              : `${course?.title || 'Course'} Resources`}
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            {t('course_res.subtitle', 'Downloadable photos, videos and PDF study materials for this course')}
          </p>
        </motion.div>

        {courseLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
          </div>
        ) : (
          <CourseResourcesContent courseId={String(courseId || '')} />
        )}
      </div>
    </div>
    </AccessGate>
  );
}

/**
 * The actual resources grid — shared by the standalone /courses/:id/resources
 * page and the Resources tab embedded on the course detail page.
 */
export function CourseResourcesContent({ courseId, embedded = false }: { courseId: string; embedded?: boolean }) {
  const { user } = useAuth();
  const { t, lang } = useTranslation();
  const [filter, setFilter] = useState<'All' | 'PDF' | 'Video' | 'Image'>('All');
  const [all, setAll] = useState<CourseResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPaywall, setShowPaywall] = useState(false);
  const [previewVideo, setPreviewVideo] = useState<CourseResource | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    (async () => {
      try {
        const data = await resourcesAPI.getResources();
        if (active && Array.isArray(data?.resources)) {
          setAll(data.resources);
        }
      } catch (e) {
        console.error('Failed to fetch course resources', e);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [courseId]);

  const resources = all.filter((r) => r.courseId && String(r.courseId) === String(courseId || ''));
  const filtered = resources.filter((r) => filter === 'All' || r.type === filter);

  const handleOpen = (resource: CourseResource) => {
    if (resource.isPremium && user?.accessTier !== 'full') {
      setShowPaywall(true);
      return;
    }
    if (!resource.fileUrl) return;
    if (resource.type === 'Video') {
      setPreviewVideo(resource);
      return;
    }
    window.open(resource.fileUrl, '_blank', 'noopener');
  };

  const getTypeMeta = (type: string) => {
    switch (type) {
      case 'PDF': return { icon: <FileText className="w-6 h-6" />, gradient: 'from-red-500 to-red-700', label: 'PDF' };
      case 'Video': return { icon: <Video className="w-6 h-6" />, gradient: 'from-purple-500 to-violet-700', label: 'Video' };
      case 'Image': return { icon: <ImageIcon className="w-6 h-6" />, gradient: 'from-emerald-500 to-green-700', label: 'Photo' };
      default: return { icon: <FileText className="w-6 h-6" />, gradient: 'from-gray-500 to-gray-700', label: type };
    }
  };

  return (
    <div className={embedded ? 'space-y-6' : ''}>
      {/* Filter buttons */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap justify-center gap-3 mb-8">
        {(['All', 'PDF', 'Video', 'Image'] as const).map((opt) => (
          <motion.button
            key={opt}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilter(opt)}
            className={`px-6 py-3 rounded-xl transition-all duration-300 font-medium ${
              filter === opt
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30'
                : 'bg-white/5 backdrop-blur-xl text-gray-300 border border-white/10 hover:border-amber-500/30 hover:text-white hover:bg-white/10'
            }`}
          >
            {opt === 'All' ? (lang === 'rw' ? 'Byose' : 'All') : opt === 'Image' ? (lang === 'rw' ? 'Amafoto' : 'Photos') : opt}
          </motion.button>
        ))}
      </motion.div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-10 h-10 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((resource, index) => {
            const meta = getTypeMeta(resource.type);
            return (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ y: -8 }}
                className="bg-white/5 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10 shadow-xl group hover:bg-white/10 hover:border-white/20 transition-all duration-300"
              >
                {/* Thumbnail */}
                <div className={`relative h-44 bg-gradient-to-br ${meta.gradient} flex items-center justify-center`}>
                  {resource.thumbnail ? (
                    <img src={resource.thumbnail} alt={resource.title_en} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                  ) : (
                    <div className="text-white/80">{meta.icon}</div>
                  )}
                  {resource.isPremium && (
                    <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs rounded-full flex items-center gap-1">
                      <Lock className="w-3 h-3" /><span>Pro</span>
                    </div>
                  )}
                  {resource.type === 'Video' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                      <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 text-purple-600 ml-0.5" />
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-md text-white text-xs rounded-full">{meta.label}</div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <span className="text-xs text-amber-400 uppercase tracking-wide font-medium">{resource.category}</span>
                  <h3 className="text-white mb-1 font-semibold mt-1">{resource.title_en}</h3>
                  <p className="text-gray-400 text-sm mb-3">{resource.title_kiny}</p>
                  {resource.description && <p className="text-gray-500 text-xs mb-3 leading-relaxed">{resource.description}</p>}
                  {resource.size && <p className="text-gray-500 text-xs mb-3">{resource.size}</p>}
                  <button
                    onClick={() => handleOpen(resource)}
                    disabled={!resource.fileUrl || (resource.isPremium && user?.accessTier !== 'full')}
                    className={`w-full px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 font-semibold ${
                      !resource.fileUrl || (resource.isPremium && user?.accessTier !== 'full')
                        ? 'bg-white/5 text-gray-500 border border-white/10 cursor-not-allowed'
                        : 'bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:shadow-lg hover:shadow-amber-500/25'
                    }`}
                  >
                    {!resource.fileUrl ? (
                      <><Lock className="w-4 h-4" />{t('course_res.coming_soon', 'Coming Soon')}</>
                    ) : resource.isPremium && user?.accessTier !== 'full' ? (
                      <><Lock className="w-4 h-4" />{t('course_res.pro_only', 'Pro Only')}</>
                    ) : resource.type === 'Video' ? (
                      <><Play className="w-4 h-4" />{lang === 'rw' ? 'Reba Videwo' : 'Watch Video'}</>
                    ) : resource.type === 'Image' ? (
                      <><ImageIcon className="w-4 h-4" />{lang === 'rw' ? 'Reba Ifoto' : 'View Photo'}</>
                    ) : (
                      <><Download className="w-4 h-4" />{lang === 'rw' ? 'Kuramo PDF' : 'Download PDF'}</>
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-600" />
          <p className="text-gray-400 mb-2">
            {lang === 'rw'
              ? 'Nta bikoresho byo kwiga bihari kuri iri somo kuri ubu.'
              : 'No downloadable resources for this course yet.'}
          </p>
          <p className="text-gray-500 text-sm mb-6">
            {lang === 'rw'
              ? 'Tubaze kuri WhatsApp ngo tuguhe ibikoresho.'
              : 'Ask us on WhatsApp and we will share the materials with you.'}
          </p>
          <WhatsAppCta compact />
        </motion.div>
      )}

      {/* WhatsApp help card */}
      {!loading && filtered.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-10">
          <WhatsAppCta />
        </motion.div>
      )}

      {/* Video preview modal */}
      {previewVideo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreviewVideo(null)}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#111827] rounded-3xl p-4 sm:p-6 w-full max-w-3xl border border-white/10 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold truncate pr-4">{previewVideo.title_en}</h3>
              <button onClick={() => setPreviewVideo(null)} className="text-gray-400 hover:text-white text-xl px-2">✕</button>
            </div>
            <div className="relative rounded-2xl overflow-hidden bg-black border border-white/10" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src={toEmbeddable(previewVideo.fileUrl || '')}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={previewVideo.title_en}
              />
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Paywall */}
      {showPaywall && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowPaywall(false)}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} onClick={(e) => e.stopPropagation()} className="bg-[#111827] rounded-3xl p-8 max-w-md w-full border border-white/10 shadow-2xl text-center">
            <div className="inline-flex p-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl mb-6 shadow-lg shadow-yellow-500/30">
              <Lock className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">{t('course_res.paywall_title', 'Premium Resource')}</h2>
            <p className="text-gray-400 mb-6 text-sm">{t('course_res.paywall_desc', 'This resource is for Full Access members (3,000 RWF). Upgrade to unlock every photo, video and PDF.')}</p>
            <Link to="/quiz" className="block w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-bold hover:shadow-lg transition-all duration-300">
              {t('course_res.paywall_cta', 'Upgrade to Full Access')}
            </Link>
            <button onClick={() => setShowPaywall(false)} className="w-full px-6 py-3 text-gray-400 hover:text-white transition-colors mt-2">
              {t('course_res.maybe_later', 'Maybe Later')}
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

function toEmbeddable(url: string): string {
  if (!url) return '';
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtu.be')) {
      const id = u.pathname.split('/').filter(Boolean)[0] || '';
      return id ? `https://www.youtube.com/embed/${id}` : url;
    }
    if (u.hostname.includes('youtube.com')) {
      if (u.pathname.startsWith('/embed/')) return url;
      const id = u.searchParams.get('v') || '';
      return id ? `https://www.youtube.com/embed/${id}` : url;
    }
  } catch { /* ignore */ }
  return url;
}

/** WhatsApp contact card used on course resource pages. */
export function WhatsAppCta({ compact = false }: { compact?: boolean }) {
  const { lang } = useTranslation();
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    lang === 'rw'
      ? `Muraho! Nashaka ibikoresho byo kwiga (ama foto, videwo cyangwa PDF) kuri ISHAMI.`
      : 'Hello! I would like study materials (photos, videos or PDFs) from ISHAMI.'
  )}`;
  return (
    <a
      href={waLink}
      target="_blank"
      rel="noopener noreferrer"
      className={`block group ${compact ? 'max-w-xs mx-auto' : ''}`}
    >
      <div className="flex items-center gap-4 p-5 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/30 hover:bg-[#25D366]/15 transition-all duration-300 group-hover:border-[#25D366]/50">
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#25D366] flex items-center justify-center shadow-lg shadow-[#25D366]/30">
          <MessageCircle className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 text-left">
          <p className="text-white font-semibold text-sm sm:text-base">
            {lang === 'rw' ? `Tuvugishe kuri WhatsApp: ${WHATSAPP_DISPLAY}` : `Chat with us on WhatsApp: ${WHATSAPP_DISPLAY}`}
          </p>
          <p className="text-gray-400 text-xs">
            {lang === 'rw'
              ? 'Ukeneye ibindi bikoresho byo kwiga? Twandikire!'
              : 'Need more study materials or help with a course? Message us!'}
          </p>
        </div>
        <span className="flex-shrink-0 text-[#25D366] font-semibold text-sm group-hover:translate-x-1 transition-transform">{lang === 'rw' ? 'Andika' : 'Chat'} →</span>
      </div>
    </a>
  );
}
