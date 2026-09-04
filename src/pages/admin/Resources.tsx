import { useState, useEffect } from 'react';
import { Plus, Search, Trash2, ExternalLink, FileText, Video, Image as ImageIcon } from 'lucide-react';
import { resourcesAPI } from '../../services/api';
import { toast } from 'sonner';
import { ensureCoursesLoaded, getAllCourses } from '../../lib/courseRegistry';

interface Resource {
  id: string;
  title_en: string;
  title_kiny: string;
  type: 'PDF' | 'Video' | 'Image';
  category: string;
  isPremium: boolean;
  fileUrl: string;
  courseId?: string;
}

export default function AdminResources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [courseOptions, setCourseOptions] = useState<{ id: string; title: string }[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    titleKiny: '',
    type: 'PDF',
    category: 'General',
    fileUrl: '',
    premium: false,
    courseId: ''
  });

  useEffect(() => {
    fetchResources();
    ensureCoursesLoaded().then(() => {
      setCourseOptions(getAllCourses().map((c) => ({ id: c.id, title: c.title })));
    }).catch(() => {});
  }, []);

  const fetchResources = async () => {
    try {
      const data = await resourcesAPI.getResources();
      setResources(data.resources);
    } catch (error) {
      console.error('Failed to fetch resources:', error);
      toast.error('Failed to load resources');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resource?')) return;
    
    try {
      await resourcesAPI.deleteResource(id);
      setResources(prev => prev.filter(r => r.id !== id));
      toast.success('Resource deleted');
    } catch (error) {
      toast.error('Failed to delete resource');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('titleKiny', formData.titleKiny);
      data.append('type', formData.type);
      data.append('category', formData.category);
      data.append('fileUrl', formData.fileUrl);
      data.append('premium', String(formData.premium));
      data.append('courseId', formData.courseId);

      await resourcesAPI.uploadResource(data);
      toast.success('Resource added successfully');
      setIsAddModalOpen(false);
      setFormData({
        title: '',
        titleKiny: '',
        type: 'PDF',
        category: 'General',
        fileUrl: '',
        premium: false,
        courseId: ''
      });
      fetchResources();
    } catch (error) {
      console.error(error);
      toast.error('Failed to add resource');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredResources = resources.filter(r => 
    r.title_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.title_kiny.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAssignCourse = async (resource: Resource, courseId: string) => {
    try {
      await resourcesAPI.updateResource(resource.id, { courseId });
      setResources(prev => prev.map(r => r.id === resource.id ? { ...r, courseId } : r));
      toast.success(courseId ? 'Resource attached to course' : 'Resource moved to library (all resources page)');
    } catch (error: any) {
      toast.error(error?.message || 'Failed to update resource');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Resources</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage learning materials</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center px-4 py-2 bg-[#00A3AD] text-white rounded-lg hover:bg-[#008891] transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Resource
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search resources..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#00A3AD] outline-none"
        />
      </div>

      {/* List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Title</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Course</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Access</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredResources.map((resource) => (
                <tr key={resource.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900 dark:text-white">{resource.title_en}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{resource.title_kiny}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                      {resource.type === 'PDF' && <FileText className="w-4 h-4 mr-2" />}
                      {resource.type === 'Video' && <Video className="w-4 h-4 mr-2" />}
                      {resource.type === 'Image' && <ImageIcon className="w-4 h-4 mr-2" />}
                      {resource.type}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{resource.category}</td>
                  <td className="px-6 py-4">
                    <select
                      value={resource.courseId || ''}
                      onChange={(e) => handleAssignCourse(resource, e.target.value)}
                      className="max-w-[190px] px-2 py-1.5 text-xs border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:ring-1 focus:ring-[#00A3AD] outline-none"
                      title="Attach this resource to a course (its Resources subpage) or keep it in the library"
                    >
                      <option value="">📚 Library only</option>
                      {courseOptions.map((c) => (
                        <option key={c.id} value={c.id}>{c.title}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      resource.isPremium 
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                        : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    }`}>
                      {resource.isPremium ? 'Premium' : 'Free'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <a 
                        href={resource.fileUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-[#00A3AD] transition-colors"
                        title="View File"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => handleDelete(resource.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredResources.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    No resources found. Add one to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md p-6 shadow-xl">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Add New Resource</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title (English)</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent dark:text-white focus:ring-2 focus:ring-[#00A3AD] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title (Kinyarwanda)</label>
                <input
                  type="text"
                  value={formData.titleKiny}
                  onChange={e => setFormData({...formData, titleKiny: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent dark:text-white focus:ring-2 focus:ring-[#00A3AD] outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                  <select
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent dark:text-white focus:ring-2 focus:ring-[#00A3AD] outline-none"
                  >
                    <option value="PDF">PDF</option>
                    <option value="Video">Video</option>
                    <option value="Image">Image</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent dark:text-white focus:ring-2 focus:ring-[#00A3AD] outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">File/Video URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={formData.fileUrl}
                  onChange={e => setFormData({...formData, fileUrl: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent dark:text-white focus:ring-2 focus:ring-[#00A3AD] outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">Direct link to PDF, YouTube video, or Drive file</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Attach to course (optional)</label>
                <select
                  value={formData.courseId}
                  onChange={e => setFormData({...formData, courseId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent dark:text-white focus:ring-2 focus:ring-[#00A3AD] outline-none"
                >
                  <option value="">Library only — shows on the Resources page</option>
                  {courseOptions.map((c) => (
                    <option key={c.id} value={c.id}>{c.title} — course Resources subpage</option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">Resources attached to a course appear on that course's Resources page too.</p>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="premium"
                  checked={formData.premium}
                  onChange={e => setFormData({...formData, premium: e.target.checked})}
                  className="w-4 h-4 text-[#00A3AD] border-gray-300 rounded focus:ring-[#00A3AD]"
                />
                <label htmlFor="premium" className="ml-2 text-sm text-gray-700 dark:text-gray-300">Premium Resource (Pro users only)</label>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-[#00A3AD] text-white rounded-lg hover:bg-[#008891] transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Adding...' : 'Add Resource'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
