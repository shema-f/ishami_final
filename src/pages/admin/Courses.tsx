import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Trash2, Pencil, GraduationCap, X, Loader2, BookOpen, GripVertical } from 'lucide-react';
import { coursesAPI } from '../../services/api';
import { toast } from 'sonner';
import { resetRemoteCourses } from '../../lib/courseRegistry';

interface LessonDraft {
  id: number;
  title: string;
  titleKiny: string;
  type: string;
  duration: string;
  description: string;
  body: string;
  videoUrl: string;
}

interface CourseDraft {
  _id?: string;
  slug: string;
  title: string;
  titleKiny: string;
  description: string;
  descriptionKiny: string;
  level: string;
  levelKiny: string;
  instructor: string;
  instructorTitle: string;
  duration: string;
  gradient: string;
  icon: string;
  badge: string;
  badgeColor: string;
  isActive: boolean;
  curriculumTitle: string;
  curriculumTitleKiny: string;
  lessons: LessonDraft[];
}

const GRADIENTS = [
  'from-emerald-500 via-teal-500 to-cyan-500',
  'from-orange-500 via-red-500 to-pink-500',
  'from-blue-500 via-indigo-500 to-violet-500',
  'from-yellow-500 via-amber-500 to-orange-500',
  'from-purple-500 via-fuchsia-500 to-pink-500',
  'from-red-500 via-rose-500 to-red-600',
  'from-slate-600 via-zinc-600 to-gray-700',
  'from-indigo-600 via-purple-700 to-violet-800',
  'from-amber-500 via-yellow-500 to-orange-500',
];

const BADGE_COLORS = [
  'bg-emerald-500', 'bg-orange-500', 'bg-blue-500', 'bg-yellow-500',
  'bg-purple-500', 'bg-red-500', 'bg-slate-600', 'bg-indigo-600', 'bg-amber-500',
];

const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
const LESSON_TYPES = ['text', 'video', 'interactive', 'quiz', 'assessment'];

function emptyDraft(): CourseDraft {
  return {
    slug: '',
    title: '',
    titleKiny: '',
    description: '',
    descriptionKiny: '',
    level: 'Beginner',
    levelKiny: 'Utangira',
    instructor: 'Moto Sensei',
    instructorTitle: 'Driving Expert & Instructor',
    duration: '2 hours',
    gradient: GRADIENTS[2],
    icon: '🚗',
    badge: '',
    badgeColor: 'bg-blue-500',
    isActive: true,
    curriculumTitle: 'Course Curriculum',
    curriculumTitleKiny: "Ibikubiyemo by'Isomo",
    lessons: [],
  };
}

function toDraft(c: any): CourseDraft {
  const lessons = Array.isArray(c.curriculum?.lessons) ? c.curriculum.lessons : [];
  return {
    _id: c._id,
    slug: c.slug || c.id || '',
    title: c.title || '',
    titleKiny: c.titleKiny || '',
    description: c.description || '',
    descriptionKiny: c.descriptionKiny || '',
    level: c.level || 'Beginner',
    levelKiny: c.levelKiny || '',
    instructor: c.instructor || 'Moto Sensei',
    instructorTitle: c.instructorTitle || 'Driving Expert & Instructor',
    duration: c.duration || '',
    gradient: c.gradient || GRADIENTS[2],
    icon: c.icon || '🚗',
    badge: c.badge || '',
    badgeColor: c.badgeColor || 'bg-blue-500',
    isActive: c.isActive !== false,
    curriculumTitle: c.curriculum?.title || 'Course Curriculum',
    curriculumTitleKiny: c.curriculum?.titleKiny || "Ibikubiyemo by'Isomo",
    lessons: lessons.map((l: any, i: number) => ({
      id: Number(l.id) || i + 1,
      title: l.title || '',
      titleKiny: l.titleKiny || '',
      type: l.type || 'text',
      duration: l.duration || '15 min',
      description: l.description || '',
      body: l.body || '',
      videoUrl: l.videoUrl || '',
    })),
  };
}

const inputCls = 'w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent dark:text-white focus:ring-2 focus:ring-[#00A3AD] outline-none text-sm';
const labelCls = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1';

export default function AdminCourses() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [draft, setDraft] = useState<CourseDraft>(emptyDraft());
  const [tab, setTab] = useState<'details' | 'lessons'>('details');

  const fetchCourses = useCallback(async () => {
    try {
      const list = await coursesAPI.adminList();
      setCourses(list);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCourses(); }, [fetchCourses]);

  const openCreate = () => {
    setDraft(emptyDraft());
    setEditing(false);
    setTab('details');
    setModalOpen(true);
  };

  const openEdit = (c: any) => {
    setDraft(toDraft(c));
    setEditing(true);
    setTab('details');
    setModalOpen(true);
  };

  const setField = <K extends keyof CourseDraft>(key: K, value: CourseDraft[K]) => {
    setDraft((d) => ({ ...d, [key]: value }));
  };

  const setLesson = (index: number, patch: Partial<LessonDraft>) => {
    setDraft((d) => ({
      ...d,
      lessons: d.lessons.map((l, i) => (i === index ? { ...l, ...patch } : l)),
    }));
  };

  const addLesson = () => {
    setDraft((d) => ({
      ...d,
      lessons: [
        ...d.lessons,
        {
          id: d.lessons.length + 1,
          title: '',
          titleKiny: '',
          type: 'text',
          duration: '15 min',
          description: '',
          body: '',
          videoUrl: '',
        },
      ],
    }));
  };

  const removeLesson = (index: number) => {
    setDraft((d) => ({
      ...d,
      lessons: d.lessons.filter((_, i) => i !== index).map((l, i) => ({ ...l, id: i + 1 })),
    }));
  };

  const handleDelete = async (c: any) => {
    if (!confirm(`Delete course "${c.title}"? This cannot be undone.`)) return;
    try {
      await coursesAPI.remove(c._id || c.id);
      resetRemoteCourses();
      toast.success('Course deleted');
      fetchCourses();
    } catch (error: any) {
      toast.error(error?.message || 'Failed to delete course');
    }
  };

  const validate = (): string | null => {
    if (!draft.title.trim()) return 'Course title is required';
    if (draft.lessons.length === 0) return 'Add at least one lesson';
    for (const l of draft.lessons) {
      if (!l.title.trim()) return 'Every lesson needs a title';
      if (l.type === 'video' && !l.videoUrl.trim()) return `Lesson "${l.title}" is a video — add a YouTube video URL`;
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const problem = validate();
    if (problem) { toast.error(problem); return; }
    setSubmitting(true);
    const payload = {
      slug: draft.slug,
      title: draft.title,
      titleKiny: draft.titleKiny,
      description: draft.description,
      descriptionKiny: draft.descriptionKiny,
      level: draft.level,
      levelKiny: draft.levelKiny,
      instructor: draft.instructor,
      instructorTitle: draft.instructorTitle,
      duration: draft.duration,
      gradient: draft.gradient,
      icon: draft.icon,
      badge: draft.badge,
      badgeColor: draft.badgeColor,
      isActive: draft.isActive,
      curriculumTitle: draft.curriculumTitle,
      curriculumTitleKiny: draft.curriculumTitleKiny,
      lessons: draft.lessons.map(({ id, title, titleKiny, type, duration, description, body, videoUrl }) => ({
        id, title, titleKiny, type, duration, description, body, videoUrl,
      })),
    };
    try {
      if (editing && draft._id) {
        await coursesAPI.update(draft._id, payload);
        toast.success('Course updated');
      } else {
        await coursesAPI.create(payload);
        toast.success('Course created — it is now live on the website');
      }
      resetRemoteCourses();
      setModalOpen(false);
      fetchCourses();
    } catch (error: any) {
      toast.error(error?.message || 'Failed to save course');
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = courses.filter((c) =>
    (c.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.titleKiny || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Courses</h1>
          <p className="text-gray-600 dark:text-gray-400">Create dynamic courses that instantly appear on the website</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center px-4 py-2 bg-[#00A3AD] text-white rounded-lg hover:bg-[#008891] transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Course
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search courses..."
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
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Course</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Level</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Lessons</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filtered.map((c) => (
                <tr key={c._id || c.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${c.gradient || GRADIENTS[2]} flex items-center justify-center text-lg shrink-0`}>{c.icon || '🚗'}</div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-medium text-gray-900 dark:text-white truncate">{c.title}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400 truncate">{c.titleKiny}</span>
                        <span className="text-[11px] text-gray-400 font-mono">/{c.slug}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{c.level}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{c.totalLessons}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${c.isActive === false ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'}`}>
                      {c.isActive === false ? 'Hidden' : 'Live'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <button onClick={() => openEdit(c)} className="text-gray-400 hover:text-[#00A3AD] transition-colors" title="Edit">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(c)} className="text-gray-400 hover:text-red-500 transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && !loading && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    No courses found. Click “New Course” to create the first dynamic course.
                  </td>
                </tr>
              )}
              {loading && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Editor modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {editing ? `Edit Course: ${draft.title || 'Untitled'}` : 'Create Dynamic Course'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 px-6 pt-4">
              {(['details', 'lessons'] as const).map((tb) => (
                <button
                  key={tb}
                  onClick={() => setTab(tb)}
                  className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-colors ${tab === tb
                    ? 'bg-[#00A3AD] text-white'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white bg-gray-100 dark:bg-gray-700'}`}
                >
                  {tb === 'details' ? 'Course Details' : `Lessons (${draft.lessons.length})`}
                </button>
              ))}
            </div>

            {/* Body */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
              {tab === 'details' ? (
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Title (English) *</label>
                      <input required value={draft.title} onChange={(e) => setField('title', e.target.value)} className={inputCls} placeholder="e.g. Highway Driving Masterclass" />
                    </div>
                    <div>
                      <label className={labelCls}>Title (Kinyarwanda)</label>
                      <input value={draft.titleKiny} onChange={(e) => setField('titleKiny', e.target.value)} className={inputCls} placeholder="e.g. Kubaga ku Muhanda Mukuru" />
                    </div>
                    <div>
                      <label className={labelCls}>Slug (URL) — auto-generated from title if empty</label>
                      <input value={draft.slug} onChange={(e) => setField('slug', e.target.value)} className={`${inputCls} font-mono`} placeholder="highway-driving-masterclass" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelCls}>Level</label>
                        <select value={draft.level} onChange={(e) => setField('level', e.target.value)} className={inputCls}>
                          {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className={labelCls}>Level (Kinyarwanda)</label>
                        <input value={draft.levelKiny} onChange={(e) => setField('levelKiny', e.target.value)} className={inputCls} />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Description (English)</label>
                      <textarea rows={2} value={draft.description} onChange={(e) => setField('description', e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Description (Kinyarwanda)</label>
                      <textarea rows={2} value={draft.descriptionKiny} onChange={(e) => setField('descriptionKiny', e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Duration</label>
                      <input value={draft.duration} onChange={(e) => setField('duration', e.target.value)} className={inputCls} placeholder="2 hours" />
                    </div>
                    <div>
                      <label className={labelCls}>Instructor</label>
                      <input value={draft.instructor} onChange={(e) => setField('instructor', e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Instructor Title</label>
                      <input value={draft.instructorTitle} onChange={(e) => setField('instructorTitle', e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Icon (emoji)</label>
                      <input value={draft.icon} onChange={(e) => setField('icon', e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Badge (optional)</label>
                      <input value={draft.badge} onChange={(e) => setField('badge', e.target.value)} className={inputCls} placeholder="e.g. New" />
                    </div>
                    <div>
                      <label className={labelCls}>Gradient (card colour)</label>
                      <select value={draft.gradient} onChange={(e) => setField('gradient', e.target.value)} className={inputCls}>
                        {GRADIENTS.map((g) => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>Badge colour</label>
                      <select value={draft.badgeColor} onChange={(e) => setField('badgeColor', e.target.value)} className={inputCls}>
                        {BADGE_COLORS.map((g) => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>Curriculum Title</label>
                      <input value={draft.curriculumTitle} onChange={(e) => setField('curriculumTitle', e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Curriculum Title (Kinyarwanda)</label>
                      <input value={draft.curriculumTitleKiny} onChange={(e) => setField('curriculumTitleKiny', e.target.value)} className={inputCls} />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" id="isActive" checked={draft.isActive} onChange={(e) => setField('isActive', e.target.checked)} className="w-4 h-4 text-[#00A3AD] border-gray-300 rounded focus:ring-[#00A3AD]" />
                    <label htmlFor="isActive" className="text-sm text-gray-700 dark:text-gray-300">Live on the website (uncheck to hide)</label>
                  </div>
                  <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900/40 flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${draft.gradient} flex items-center justify-center text-xl`}>{draft.icon || '🚗'}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-white truncate">{draft.title || 'Untitled Course'}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{draft.level} · {draft.duration} · {draft.lessons.length} lessons</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button type="button" onClick={() => setTab('lessons')} className="text-sm text-[#00A3AD] font-medium flex items-center gap-1">
                        <BookOpen className="w-4 h-4" /> Add lessons →
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 space-y-4">
                  {draft.lessons.map((lesson, i) => (
                    <div key={i} className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-3 bg-gray-50/60 dark:bg-gray-900/30">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1">
                          <GripVertical className="w-4 h-4" /> Lesson {i + 1}
                        </span>
                        <button type="button" onClick={() => removeLesson(i)} className="text-gray-400 hover:text-red-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input value={lesson.title} onChange={(e) => setLesson(i, { title: e.target.value })} placeholder="Lesson title *" className={inputCls} />
                        <input value={lesson.titleKiny} onChange={(e) => setLesson(i, { titleKiny: e.target.value })} placeholder="Title (Kinyarwanda)" className={inputCls} />
                        <div className="grid grid-cols-2 gap-3">
                          <select value={lesson.type} onChange={(e) => setLesson(i, { type: e.target.value })} className={inputCls}>
                            {LESSON_TYPES.map((ty) => <option key={ty} value={ty}>{ty}</option>)}
                          </select>
                          <input value={lesson.duration} onChange={(e) => setLesson(i, { duration: e.target.value })} placeholder="15 min" className={inputCls} />
                        </div>
                      </div>
                      <input value={lesson.description} onChange={(e) => setLesson(i, { description: e.target.value })} placeholder="Short description shown on the course page" className={inputCls} />
                      {lesson.type === 'video' ? (
                        <input value={lesson.videoUrl} onChange={(e) => setLesson(i, { videoUrl: e.target.value })} placeholder="YouTube URL (e.g. https://www.youtube.com/watch?v=...)" className={`${inputCls} font-mono`} />
                      ) : (
                        <textarea rows={3} value={lesson.body} onChange={(e) => setLesson(i, { body: e.target.value })} placeholder="Lesson content (written in paragraphs, separated by blank lines) — shown when the learner opens this lesson" className={inputCls} />
                      )}
                    </div>
                  ))}
                  {draft.lessons.length === 0 && (
                    <div className="text-center py-10 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl">
                      <BookOpen className="w-10 h-10 mx-auto mb-3 text-gray-400" />
                      <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">No lessons yet — add the first lesson of this course.</p>
                    </div>
                  )}
                  <button type="button" onClick={addLesson} className="w-full py-3 border-2 border-dashed border-[#00A3AD]/50 text-[#00A3AD] rounded-xl font-medium hover:bg-[#00A3AD]/5 transition-colors flex items-center justify-center gap-2">
                    <Plus className="w-4 h-4" /> Add Lesson
                  </button>
                </div>
              )}

              {/* Footer */}
              <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  Cancel
                </button>
                {tab === 'lessons' ? (
                  <button type="button" onClick={() => setTab('details')} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                    ← Back to Details
                  </button>
                ) : null}
                <button type="submit" disabled={submitting} className="px-5 py-2 bg-[#00A3AD] text-white rounded-lg hover:bg-[#008891] transition-colors disabled:opacity-50 flex items-center gap-2">
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editing ? 'Save Changes' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="mt-6 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
        <GraduationCap className="w-5 h-5 shrink-0 text-[#00A3AD]" />
        <p>Dynamic courses appear on the homepage and Courses page immediately, alongside the built-in Moto Sensei courses. Every lesson you add becomes a page at /courses/&lt;slug&gt;/lessons/&lt;n&gt;.</p>
      </div>
    </div>
  );
}
