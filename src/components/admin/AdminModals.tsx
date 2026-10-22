import React, { useState } from 'react';
import { X, Upload, Save, Image as ImageIcon, Video, FileText, User, Trash2, RefreshCw, Sparkles, CheckCircle2 } from 'lucide-react';
import { HeroSlide, Course, Student, Teacher, VideoClass, NoteResource, Notice, Language } from '../../types';
import { readFileAsDataUrl } from '../../lib/storageService';
import { extractYouTubeId, resolveAutoThumbnail } from '../../services/videoService';

// ======================= 1. EDIT HERO SLIDE MODAL =======================
export const EditSlideModal: React.FC<{
  slide: HeroSlide | null;
  lang: Language;
  onSave: (updated: HeroSlide) => void;
  onClose: () => void;
}> = ({ slide, lang, onSave, onClose }) => {
  const [form, setForm] = useState<HeroSlide>(slide || {} as HeroSlide);

  React.useEffect(() => {
    if (slide) setForm(slide);
  }, [slide]);

  if (!slide) return null;

  const handleImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    const file = target.files?.[0];
    if (file) {
      try {
        const dataUrl = await readFileAsDataUrl(file);
        setForm((prev) => ({ ...prev, imageUrl: dataUrl }));
      } finally {
        target.value = '';
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-900">
            {lang === 'bn' ? 'হিরো স্লাইড এডিট করুন' : 'Edit Hero Slide'}
          </h3>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSave(form); onClose(); }} className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Title (English)</label>
              <input
                type="text"
                required
                value={form.titleEn}
                onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
                className="w-full border rounded-xl px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">শিরোনাম (বাংলা)</label>
              <input
                type="text"
                required
                value={form.titleBn}
                onChange={(e) => setForm({ ...form, titleBn: e.target.value })}
                className="w-full border rounded-xl px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Subtitle (English)</label>
              <input
                type="text"
                value={form.subtitleEn}
                onChange={(e) => setForm({ ...form, subtitleEn: e.target.value })}
                className="w-full border rounded-xl px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">সাবটাইটেল (বাংলা)</label>
              <input
                type="text"
                value={form.subtitleBn}
                onChange={(e) => setForm({ ...form, subtitleBn: e.target.value })}
                className="w-full border rounded-xl px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Direct Image Upload */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <label className="block font-bold text-slate-700">
              {lang === 'bn' ? 'স্লাইডের ছবি পরিবর্তন করুন (ফাইল আপলোড)' : 'Change Slide Image (Direct File Upload)'}
            </label>
            <div className="flex items-center gap-3">
              <label className="cursor-pointer px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center gap-1.5 transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'ছবি নির্বাচন করুন' : 'Choose File'}</span>
                <input type="file" accept="image/*" onChange={handleImageFile} className="hidden" />
              </label>
              {form.imageUrl && (
                <img src={form.imageUrl} alt="preview" className="w-16 h-10 object-cover rounded border" />
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold">
              {lang === 'bn' ? 'বাতিল' : 'Cancel'}
            </button>
            <button type="submit" className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-sm">
              <Save className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'আপডেট সংরক্ষণ করুন' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ======================= 2. EDIT COURSE MODAL =======================
export const EditCourseModal: React.FC<{
  course: Course | null;
  lang: Language;
  onSave: (updated: Course) => void;
  onClose: () => void;
}> = ({ course, lang, onSave, onClose }) => {
  const [form, setForm] = useState<Course>(course || {} as Course);

  React.useEffect(() => {
    if (course) setForm(course);
  }, [course]);

  if (!course) return null;

  const handleBannerFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    const file = target.files?.[0];
    if (file) {
      try {
        const dataUrl = await readFileAsDataUrl(file);
        setForm((prev) => ({ ...prev, bannerImage: dataUrl }));
      } finally {
        target.value = '';
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-900">
            {lang === 'bn' ? 'কোর্স তথ্য এডিট করুন' : 'Edit Course Details'}
          </h3>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSave(form); onClose(); }} className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">কোর্সের নাম (বাংলা)</label>
              <input
                type="text"
                required
                value={form.titleBn}
                onChange={(e) => setForm({ ...form, titleBn: e.target.value })}
                className="w-full border rounded-xl px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Course Title (English)</label>
              <input
                type="text"
                required
                value={form.titleEn}
                onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
                className="w-full border rounded-xl px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">কোর্স ফি / মূল্য (টাকা)</label>
              <input
                type="number"
                required
                value={form.price}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                className="w-full border rounded-xl px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">পূর্বের মূল্য (টাকা - ডিসকাউন্ট দেখাতে)</label>
              <input
                type="number"
                value={form.originalPrice}
                onChange={(e) => setForm({ ...form, originalPrice: Number(e.target.value) })}
                className="w-full border rounded-xl px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">বিস্তারিত বিবরণ (বাংলা)</label>
            <textarea
              rows={3}
              value={form.descriptionBn}
              onChange={(e) => setForm({ ...form, descriptionBn: e.target.value })}
              className="w-full border rounded-xl p-3 text-xs focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Direct Banner / Logo Image Upload */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <label className="block font-bold text-slate-700">
              {lang === 'bn' ? 'কোর্সের লোগো / ব্যানার ইমেজ সরাসরি আপলোড' : 'Course Banner / Logo Upload'}
            </label>
            <div className="flex items-center gap-3">
              <label className="cursor-pointer px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center gap-1.5 transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'ব্যানার বেছে নিন' : 'Upload Banner'}</span>
                <input type="file" accept="image/*" onChange={handleBannerFile} className="hidden" />
              </label>
              {form.bannerImage && (
                <img src={form.bannerImage} alt="preview" className="w-20 h-12 object-cover rounded border" />
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold">
              {lang === 'bn' ? 'বাতিল' : 'Cancel'}
            </button>
            <button type="submit" className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-sm">
              <Save className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'কোর্স আপডেট করুন' : 'Update Course'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ======================= 3. EDIT STUDENT MODAL =======================
export const EditStudentModal: React.FC<{
  student: Student | null;
  courses: Course[];
  lang: Language;
  onSave: (updated: Student) => void;
  onClose: () => void;
}> = ({ student, courses, lang, onSave, onClose }) => {
  const [form, setForm] = useState<Student>(student || {} as Student);

  React.useEffect(() => {
    if (student) setForm(student);
  }, [student]);

  if (!student) return null;

  const handlePhotoFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    const file = target.files?.[0];
    if (file) {
      try {
        const dataUrl = await readFileAsDataUrl(file);
        setForm((prev) => ({ ...prev, photoUrl: dataUrl }));
      } finally {
        target.value = '';
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-900">
            {lang === 'bn' ? 'শিক্ষার্থীর তথ্য এডিট করুন' : 'Edit Student Roster Info'}
          </h3>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSave(form); onClose(); }} className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">শিক্ষাবর্ষ</label>
              <select
                value={form.academicYear}
                onChange={(e) => setForm({ ...form, academicYear: e.target.value })}
                className="w-full border rounded-xl px-3 py-2 text-xs bg-white focus:outline-none"
              >
                <option value="2027">2027</option>
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">রোল নম্বর</label>
              <input
                type="text"
                required
                value={form.roll}
                onChange={(e) => setForm({ ...form, roll: e.target.value })}
                className="w-full border rounded-xl px-3 py-2 text-xs font-mono font-bold focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">শিক্ষার্থীর নাম (বাংলা)</label>
              <input
                type="text"
                required
                value={form.nameBn}
                onChange={(e) => setForm({ ...form, nameBn: e.target.value })}
                className="w-full border rounded-xl px-3 py-2 text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Student Name (English)</label>
              <input
                type="text"
                required
                value={form.nameEn}
                onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
                className="w-full border rounded-xl px-3 py-2 text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">পিতার নাম (বাংলা)</label>
              <input
                type="text"
                value={form.fatherNameBn}
                onChange={(e) => setForm({ ...form, fatherNameBn: e.target.value })}
                className="w-full border rounded-xl px-3 py-2 text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">মাতার নাম (বাংলা)</label>
              <input
                type="text"
                value={form.motherNameBn}
                onChange={(e) => setForm({ ...form, motherNameBn: e.target.value })}
                className="w-full border rounded-xl px-3 py-2 text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">মোবাইল নম্বর</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full border rounded-xl px-3 py-2 text-xs font-mono focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">ঠিকানা</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full border rounded-xl px-3 py-2 text-xs focus:outline-none"
              />
            </div>
          </div>

          {/* Student Photo Upload */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <label className="block font-bold text-slate-700">
              {lang === 'bn' ? 'শিক্ষার্থীর ছবি পরিবর্তন / আপলোড' : 'Upload Student Photo'}
            </label>
            <div className="flex items-center gap-3">
              <label className="cursor-pointer px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center gap-1.5 transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'ছবি সিলেক্ট করুন' : 'Choose Photo'}</span>
                <input type="file" accept="image/*" onChange={handlePhotoFile} className="hidden" />
              </label>
              {form.photoUrl && (
                <img src={form.photoUrl} alt="preview" className="w-12 h-12 object-cover rounded-xl border border-emerald-400" />
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold">
              {lang === 'bn' ? 'বাতিল' : 'Cancel'}
            </button>
            <button type="submit" className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-sm">
              <Save className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'শিক্ষার্থী আপডেট করুন' : 'Update Student'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ======================= 4. EDIT TEACHER MODAL =======================
export const EditTeacherModal: React.FC<{
  teacher: Teacher | null;
  lang: Language;
  onSave: (updated: Teacher) => void;
  onClose: () => void;
}> = ({ teacher, lang, onSave, onClose }) => {
  const [form, setForm] = useState<Teacher>(teacher || {} as Teacher);

  React.useEffect(() => {
    if (teacher) setForm(teacher);
  }, [teacher]);

  if (!teacher) return null;

  const handlePhotoFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    const file = target.files?.[0];
    if (file) {
      try {
        const dataUrl = await readFileAsDataUrl(file);
        setForm((prev) => ({ ...prev, photoUrl: dataUrl }));
      } finally {
        target.value = '';
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-900">
            {lang === 'bn' ? 'শিক্ষকের তথ্য এডিট করুন' : 'Edit Teacher Profile'}
          </h3>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSave(form); onClose(); }} className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">শিক্ষকের নাম (বাংলা)</label>
              <input
                type="text"
                required
                value={form.nameBn}
                onChange={(e) => setForm({ ...form, nameBn: e.target.value })}
                className="w-full border rounded-xl px-3 py-2 text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Teacher Name (English)</label>
              <input
                type="text"
                required
                value={form.nameEn}
                onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
                className="w-full border rounded-xl px-3 py-2 text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">পদবি (বাংলা)</label>
              <input
                type="text"
                required
                value={form.designationBn}
                onChange={(e) => setForm({ ...form, designationBn: e.target.value })}
                className="w-full border rounded-xl px-3 py-2 text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">শিক্ষাগত যোগ্যতা</label>
              <input
                type="text"
                required
                value={form.qualification}
                onChange={(e) => setForm({ ...form, qualification: e.target.value })}
                className="w-full border rounded-xl px-3 py-2 text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">মোবাইল নম্বর</label>
              <input
                type="text"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full border rounded-xl px-3 py-2 text-xs font-mono focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">ঠিকানা</label>
              <input
                type="text"
                value={form.address || ''}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full border rounded-xl px-3 py-2 text-xs focus:outline-none"
              />
            </div>
          </div>

          {/* Teacher Photo Direct Upload */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <label className="block font-bold text-slate-700">
              {lang === 'bn' ? 'শিক্ষকের ছবি আপলোড করুন' : 'Teacher Photo Upload'}
            </label>
            <div className="flex items-center gap-3">
              <label className="cursor-pointer px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center gap-1.5 transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'ছবি নির্বাচন করুন' : 'Select Photo'}</span>
                <input type="file" accept="image/*" onChange={handlePhotoFile} className="hidden" />
              </label>
              {form.photoUrl && (
                <img src={form.photoUrl} alt="preview" className="w-12 h-12 object-cover rounded-xl border border-emerald-400" />
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold">
              {lang === 'bn' ? 'বাতিল' : 'Cancel'}
            </button>
            <button type="submit" className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-sm">
              <Save className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'আপডেট করুন' : 'Update Profile'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ======================= 5. EDIT VIDEO CLASS MODAL =======================
export const EditVideoClassModal: React.FC<{
  video: VideoClass | null;
  lang: Language;
  onSave: (updated: VideoClass) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}> = ({ video, lang, onSave, onDelete, onClose }) => {
  const [form, setForm] = useState<VideoClass>(video || ({} as VideoClass));
  const [isResolvingThumb, setIsResolvingThumb] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  React.useEffect(() => {
    if (video) setForm(video);
  }, [video]);

  if (!video) return null;

  const handleCustomThumbFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    const file = target.files?.[0];
    if (file) {
      try {
        const dataUrl = await readFileAsDataUrl(file);
        setForm((prev) => ({ ...prev, thumbnailUrl: dataUrl }));
      } catch (err) {
        console.error('Thumbnail upload failed:', err);
      } finally {
        target.value = '';
      }
    }
  };

  const handleAutoExtractThumb = async () => {
    if (!form.videoUrl) return;
    setIsResolvingThumb(true);
    try {
      const res = await resolveAutoThumbnail(form.videoUrl, form.videoPlatform);
      const ytId = extractYouTubeId(form.videoUrl);
      setForm((prev) => ({
        ...prev,
        thumbnailUrl: res.url,
        youtubeId: ytId || prev.youtubeId,
        videoPlatform: res.platform === 'custom' ? prev.videoPlatform : res.platform
      }));
    } finally {
      setIsResolvingThumb(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Video className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                {lang === 'bn' ? 'ফ্রি ভিডিও ক্লাস এডিট ও পরিচালনা' : 'Edit Free Video Class'}
              </h3>
              <p className="text-[11px] text-slate-500">
                {lang === 'bn' ? 'ইউটিউব, ফেসবুক লিঙ্ক অথবা থাম্বনেইল ছবি পরিবর্তন করুন।' : 'Update video link, title or custom thumbnail.'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const ytId = extractYouTubeId(form.videoUrl || '');
            const finalForm = {
              ...form,
              youtubeId: ytId || form.youtubeId || 'dQw4w9WgXcQ'
            };
            onSave(finalForm);
            onClose();
          }}
          className="space-y-4 text-xs"
        >
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              {lang === 'bn' ? 'ভিডিও শিরোনাম (বাংলা)' : 'Video Title (Bangla)'}
            </label>
            <input
              type="text"
              required
              value={form.titleBn}
              onChange={(e) => setForm({ ...form, titleBn: e.target.value })}
              className="w-full border rounded-xl px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">ক্যাটাগরি</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as any })}
                className="w-full border rounded-xl px-3 py-2 text-xs bg-white focus:outline-none"
              >
                <option value="Grammar Hacks">Grammar Hacks</option>
                <option value="Spoken English">Spoken English</option>
                <option value="HSC English">HSC English</option>
                <option value="BCS & Govt Job">BCS & Govt Job</option>
                <option value="Vocabulary">Vocabulary</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">ভিডিও প্ল্যাটফর্ম</label>
              <select
                value={form.videoPlatform || 'youtube'}
                onChange={(e) => setForm({ ...form, videoPlatform: e.target.value as any })}
                className="w-full border rounded-xl px-3 py-2 text-xs bg-white focus:outline-none font-semibold"
              >
                <option value="youtube">YouTube</option>
                <option value="facebook">Facebook</option>
                <option value="tiktok">TikTok</option>
                <option value="uploaded">Uploaded Video</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block font-bold text-slate-700">
                {lang === 'bn' ? 'ভিডিও লিঙ্ক (URL)' : 'Video URL'}
              </label>
              {form.videoUrl && (
                <button
                  type="button"
                  onClick={handleAutoExtractThumb}
                  disabled={isResolvingThumb}
                  className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className={`w-3 h-3 ${isResolvingThumb ? 'animate-spin' : ''}`} />
                  <span>{lang === 'bn' ? 'অটো থাম্বনেইল আনুন' : 'Auto-Get Thumbnail'}</span>
                </button>
              )}
            </div>
            <input
              type="text"
              placeholder="https://www.youtube.com/watch?v=... অথবা https://www.facebook.com/..."
              value={form.videoUrl || ''}
              onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
              className="w-full border rounded-xl px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Thumbnail Section: Auto-Preview + Custom Upload Option */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-800 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-emerald-600" />
                <span>{lang === 'bn' ? 'ভিডিও থাম্বনেইল ছবি' : 'Video Thumbnail'}</span>
              </label>
              <span className="text-[10px] text-slate-500">
                {lang === 'bn' ? 'অটো অথবা ফাইল থেকে ছবি আপলোড' : 'Auto or direct file upload'}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative w-full sm:w-40 aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-900 shrink-0 shadow-xs">
                {form.thumbnailUrl ? (
                  <img src={form.thumbnailUrl} alt="Thumbnail preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                    No Thumbnail
                  </div>
                )}
              </div>

              <div className="w-full space-y-2">
                <label className="cursor-pointer w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? 'থাম্বনেইল ছবি আপলোড করুন' : 'Upload Custom Thumbnail'}</span>
                  <input type="file" accept="image/*" onChange={handleCustomThumbFile} className="hidden" />
                </label>

                {form.videoUrl && (
                  <button
                    type="button"
                    onClick={handleAutoExtractThumb}
                    disabled={isResolvingThumb}
                    className="w-full py-1.5 px-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors"
                  >
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    <span>{lang === 'bn' ? 'লিংক থেকে অটো থাম্বনেইল সেট করুন' : 'Reset to Auto Thumbnail'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">ভিডিও দৈর্ঘ্য (Duration)</label>
              <input
                type="text"
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                className="w-full border rounded-xl px-3 py-2 text-xs focus:outline-none"
                placeholder="যেমন: 18:45"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">ভিউ সংখ্যা (Views)</label>
              <input
                type="text"
                value={form.views}
                onChange={(e) => setForm({ ...form, views: e.target.value })}
                className="w-full border rounded-xl px-3 py-2 text-xs focus:outline-none"
                placeholder="যেমন: 2.5K"
              />
            </div>
          </div>

          {/* Action Buttons: Delete (Red) & Save (Green) */}
          <div className="flex items-center justify-between pt-3 border-t">
            {confirmDelete ? (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    onDelete(video.id);
                    onClose();
                  }}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs flex items-center gap-1 shadow-xs"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? 'হ্যাঁ, নিশ্চিত মুছুন' : 'Confirm Delete'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="px-2.5 py-1.5 bg-slate-100 text-slate-600 rounded-xl text-xs font-semibold"
                >
                  {lang === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 font-bold flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'ডিলিট করুন' : 'Delete Class'}</span>
              </button>
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
              >
                {lang === 'bn' ? 'বন্ধ' : 'Close'}
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'সংরক্ষণ করুন' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
