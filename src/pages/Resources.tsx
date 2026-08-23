import { motion } from 'motion/react';
import { FileText, Video, Image as ImageIcon, Download, Lock, Play, Search, Filter, Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { resourcesAPI } from '../services/api';
import { useTranslation } from '../contexts/I18nContext';

interface Resource {
  id: string;
  title_en: string;
  title_kiny: string;
  type: 'PDF' | 'Video' | 'Image';
  category: string;
  isPremium: boolean;
  fileUrl: string;
  thumbnail?: string;
  size?: string;
}

const mockResources: Resource[] = [
  {
    id: 'drive-traffic-questions',
    title_en: 'Traffic Rules Questions (PDF)',
    title_kiny: "Ibibazo ku Amategeko y'Umuhanda (PDF)",
    type: 'PDF',
    category: "Amategeko y'Umuhanda",
    isPremium: false,
    fileUrl: 'https://drive.google.com/uc?export=download&id=130sYhKdQehDECE262oORiX8_08LNxtbZ',
    thumbnail: undefined,
    size: undefined,
  },
  {
    id: 'drive-gazette-traffic-rules',
    title_en: 'Gazette: Traffic Rules (PDF)',
    title_kiny: "Igazeti y'Amategeko y'Umuhanda (PDF)",
    type: 'PDF',
    category: "Amategeko y'Umuhanda",
    isPremium: false,
    fileUrl: 'https://drive.google.com/uc?export=download&id=130sYhKdQehDECE262oORiX8_08LNxtbZ',
    thumbnail: undefined,
    size: undefined,
  },
  {
    id: 'docs-ibimenyetso-bimurika',
    title_en: 'Light Signals: Ibimenyetso Bimurika (PDF)',
    title_kiny: 'Ibimenyetso Bimurika (PDF)',
    type: 'PDF',
    category: "Amategeko y'Umuhanda",
    isPremium: false,
    fileUrl: 'https://docs.google.com/document/d/1hNs7FsuX8A2qmfpWUXv8TpW_SINS03Nl/export?format=pdf',
    thumbnail: undefined,
    size: undefined,
  },
];

export default function Resources() {
  const { user } = useAuth();
  const { t, lang } = useTranslation();
  const [filter, setFilter] = useState<'All' | 'PDF' | 'Video' | 'Image'>('All');
  const [showPaywall, setShowPaywall] = useState(false);
  const [resources, setResources] = useState<Resource[]>([]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await resourcesAPI.getResources();
        if (active && Array.isArray(data?.resources)) {
          setResources(data.resources);
        }
      } catch (e) {
        console.error('Failed to fetch resources', e);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const filteredResources = (resources.length ? resources : mockResources).filter(
    resource => filter === 'All' || resource.type === filter
  );

  const handleDownload = (resource: Resource) => {
    if (!resource.fileUrl) {
      return;
    }
    if (resource.isPremium && !user?.isPro) {
      setShowPaywall(true);
      return;
    }
    const isExternal = /^https?:\/\//i.test(resource.fileUrl);
    if (isExternal) {
      window.open(resource.fileUrl, '_blank');
      return;
    }
    resourcesAPI.downloadResource(resource.id);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'PDF':
        return <FileText className="w-6 h-6" />;
      case 'Video':
        return <Video className="w-6 h-6" />;
      case 'Image':
        return <ImageIcon className="w-6 h-6" />;
      default:
        return <FileText className="w-6 h-6" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'PDF':
        return 'from-red-500 to-red-700';
      case 'Video':
        return 'from-purple-500 to-purple-700';
      case 'Image':
        return 'from-green-500 to-green-700';
      default:
        return 'from-gray-500 to-gray-700';
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex p-4 bg-gradient-to-br from-red-500 to-orange-500 rounded-3xl mb-6 shadow-lg shadow-red-500/30">
            <FileText className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-[family-name:var(--font-heading)]">
            Learning Resources
          </h1>
          <p className="text-gray-400 text-lg">
            Download study materials, videos, and reference images
            <span className="block mt-1 text-green-400">
              Kuramo Ibikoresho byo Kwiga
            </span>
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {['All', 'PDF', 'Video', 'Image'].map((filterOption) => (
            <motion.button
              key={filterOption}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(filterOption as typeof filter)}
              className={`px-6 py-3 rounded-xl transition-all duration-300 font-medium ${
                filter === filterOption
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-white/5 backdrop-blur-xl text-gray-300 border border-white/10 hover:border-blue-500/30 hover:text-white hover:bg-white/10'
              }`}
            >
              {filterOption}
            </motion.button>
          ))}
        </motion.div>

        {/* Resources Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource, index) => (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="bg-white/5 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10 shadow-xl group hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-2"
            >
              {/* Thumbnail or Icon Header */}
              <div className={`relative h-48 bg-gradient-to-br ${getTypeColor(resource.type)} flex items-center justify-center`}>
                {resource.thumbnail ? (
                  <img
                    src={resource.thumbnail}
                    alt={resource.title_en}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-white">
                    {getIcon(resource.type)}
                  </div>
                )}
                
                {/* Premium Badge */}
                {resource.isPremium && (
                  <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs rounded-full flex items-center space-x-1">
                    <Lock className="w-3 h-3" />
                    <span>Pro</span>
                  </div>
                )}

                {/* Type Badge */}
                <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-md text-white text-xs rounded-full">
                  {resource.type}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="mb-2">
                  <span className="text-xs text-blue-400 uppercase tracking-wide font-medium">
                    {resource.category}
                  </span>
                </div>
                
                <h3 className="text-white mb-2 font-semibold">
                  {resource.title_en}
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  {resource.title_kiny}
                </p>

                {resource.size && (
                  <p className="text-gray-500 text-xs mb-4">
                    Size: {resource.size}
                  </p>
                )}

                <button
                  onClick={() => handleDownload(resource)}
                  disabled={!resource.fileUrl || (resource.isPremium && !user?.isPro)}
                  className={`w-full px-6 py-3 rounded-xl flex items-center justify-center space-x-2 transition-all duration-300 font-semibold ${
                    !resource.fileUrl
                      ? 'bg-white/5 text-gray-500 border border-white/10 cursor-not-allowed'
                      : resource.isPremium && !user?.isPro
                        ? 'bg-white/5 text-gray-500 border border-white/10 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5'
                  }`}
                >
                  {!resource.fileUrl ? (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Coming Soon</span>
                    </>
                  ) : resource.isPremium && !user?.isPro ? (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Pro Only</span>
                    </>
                  ) : (
                    <>
                      {resource.type === 'Video' ? (
                        <>
                          <Play className="w-4 h-4" />
                          <span>Watch</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          <span>Download</span>
                        </>
                      )}
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredResources.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <p className="text-gray-400">
              No resources found for this filter.
            </p>
          </motion.div>
        )}
      </div>

      {/* Paywall Modal */}
      {showPaywall && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowPaywall(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#111827] rounded-3xl p-8 max-w-md w-full border border-white/10 shadow-2xl"
          >
            <div className="text-center">
              <div className="inline-flex p-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl mb-6 shadow-lg shadow-yellow-500/30">
                <Lock className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2 font-[family-name:var(--font-heading)]">Premium Resource</h2>
              <p className="text-gray-400 mb-6">
                This resource is only available to Pro members. 
                Upgrade for only <span className="text-blue-400 font-semibold">100 RWF</span> to access all premium content.
              </p>
              <div className="space-y-3">
                <button className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300">
                  Upgrade to Pro - 100 RWF
                </button>
                <button
                  onClick={() => setShowPaywall(false)}
                  className="w-full px-6 py-3 text-gray-400 hover:text-white transition-colors"
                >
                  Browse Free Resources
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
