import React, { useState } from 'react';
import { Plus, Trash2, Edit3, Calendar, Image as ImageIcon, Printer, Upload, Save, X } from 'lucide-react';
import { ClassRoutine, Course, Language } from '../../types';
import { readFileAsDataUrl } from '../../lib/storageService';

interface RoutineManagementTabProps {
  routines: ClassRoutine[];
  courses: Course[];
  addRoutine: (routine: ClassRoutine) => void;
  updateRoutine: (routine: ClassRoutine) => void;
  deleteRoutine: (id: string) => void;
  lang: Language;
  showToast: (msg: string) => void;
}

export const RoutineManagementTab: React.FC<RoutineManagementTabProps> = ({
  routines,
  courses,
  addRoutine,
  updateRoutine,
  deleteRoutine,
  lang,
  showToast
}) => {
  const [editingRoutine, setEditingRoutine] = useState<ClassRoutine | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Form State
  const [titleBn, setTitleBn] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [academicYear, setAcademicYear] = useState('2026');
  const [category, setCategory] = useState<'Class Routine' | 'Exam Routine' | 'Batch Routine'>('Class Routine');
  const [courseId, setCourseId] = useState(courses[0]?.id || '');
  const [imageUrl, setImageUrl] = useState('');
  const [notes, setNotes] = useState('');

  const handleStartAdd = () => {
    setIsAdding(true);
    setEditingRoutine(null);
    setTitleBn('');
    setTitleEn('');
    setAcademicYear('2026');
    setCategory('Class Routine');
    setCourseId(courses[0]?.id || '');
    setImageUrl('');
    setNotes('');
  };

  const handleStartEdit = (routine: ClassRoutine) => {
    setEditingRoutine(routine);
    setIsAdding(false);
    setTitleBn(routine.titleBn);
    setTitleEn(routine.titleEn);
    setAcademicYear(routine.academicYear);
    setCategory(routine.category);
    setCourseId(routine.courseId || '');
    setImageUrl(routine.imageUrl);
    setNotes(routine.notes || '');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const dataUrl = await readFileAsDataUrl(file);
        setImageUrl(dataUrl);
        showToast(lang === 'bn' ? 'রুটিনের ছবি সফলভাবে আপলোড হয়েছে!' : 'Routine image uploaded successfully!');
      } catch {
        showToast(lang === 'bn' ? 'ছবি পড়তে সমস্যা হয়েছে।' : 'Failed to read image file.');
      }
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleBn.trim() || !imageUrl) {
      showToast(lang === 'bn' ? 'রুটিনের নাম ও ছবি আপলোড আবশ্যক!' : 'Please provide routine title and upload image!');
      return;
    }

    const routineToSave: ClassRoutine = {
      id: editingRoutine ? editingRoutine.id : `rtn-${Date.now()}`,
      titleBn: titleBn.trim(),
      titleEn: titleEn.trim() || titleBn.trim(),
      academicYear,
      category,
      courseId,
      imageUrl,
      uploadedDate: new Date().toISOString().split('T')[0],
      notes: notes.trim()
    };

    if (editingRoutine) {
      updateRoutine(routineToSave);
      showToast(lang === 'bn' ? 'রুটিন আপডেট করা হয়েছে!' : 'Routine updated!');
    } else {
      addRoutine(routineToSave);
      showToast(lang === 'bn' ? 'নতুন রুটিন যুক্ত করা হয়েছে!' : 'New routine added!');
    }

    setIsAdding(false);
    setEditingRoutine(null);
  };

  return (
    <div className="space-y-6">
      {/* Header and Add Button */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
            {lang === 'bn' ? 'সময়সূচি ও রুটিন কন্ট্রোল' : 'Routine & Schedule Engine'}
          </span>
          <h3 className="text-xl font-bold text-slate-900 mt-1">
            {lang === 'bn' ? 'ক্লাস ও পরীক্ষা রুটিন মেনেজমেন্ট' : 'Class & Exam Routine Management'}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {lang === 'bn'
              ? 'এখানে সরাসরি রুটিনের ছবি আপলোড করুন। শিক্ষার্থীরা ওয়েবসাইট থেকে রুটিন দেখতে ও সরাসরি প্রিন্ট করতে পারবে।'
              : 'Directly upload high-resolution schedule images for students to view and print.'}
          </p>
        </div>

        {!isAdding && !editingRoutine && (
          <button
            onClick={handleStartAdd}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{lang === 'bn' ? 'নতুন রুটিন আপলোড করুন' : 'Upload New Routine'}</span>
          </button>
        )}
      </div>

      {/* ADD / EDIT FORM */}
      {(isAdding || editingRoutine) && (
        <div className="bg-white rounded-3xl border-2 border-emerald-500/40 p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase">
                {editingRoutine ? 'EDIT ROUTINE' : 'NEW ROUTINE UPLOAD'}
              </span>
              <h4 className="text-lg font-bold text-slate-900 mt-1">
                {editingRoutine ? (lang === 'bn' ? 'রুটিন সম্পাদনা' : 'Edit Routine') : (lang === 'bn' ? 'রুটিনের ছবি আপলোড ও তথ্য' : 'Upload Routine Image & Details')}
              </h4>
            </div>
            <button
              onClick={() => { setIsAdding(false); setEditingRoutine(null); }}
              className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {lang === 'bn' ? 'রুটিনের নাম (বাংলা)' : 'Routine Title (Bangla)'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: এইচএসসি ২০২৬ লাইভ মাস্টার ক্লাস রুটিন"
                  value={titleBn}
                  onChange={(e) => setTitleBn(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {lang === 'bn' ? 'রুটিনের নাম (English)' : 'Routine Title (English)'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. HSC 2026 Live Master Class Routine"
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {lang === 'bn' ? 'ক্যাটাগরি' : 'Category'}
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none bg-white font-semibold"
                >
                  <option value="Class Routine">Class Routine (ক্লাস রুটিন)</option>
                  <option value="Exam Routine">Exam Routine (পরীক্ষা রুটিন)</option>
                  <option value="Batch Routine">Batch Routine (ব্যাচ রুটিন)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {lang === 'bn' ? 'শিক্ষাবর্ষ (Academic Year)' : 'Academic Year'}
                </label>
                <select
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none bg-white font-semibold"
                >
                  <option value="2027">2027</option>
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                </select>
              </div>
            </div>

            {/* DIRECT IMAGE UPLOAD - NO URL REQUIRED */}
            <div className="border border-emerald-200 bg-emerald-50/40 rounded-2xl p-4 space-y-3">
              <label className="block font-bold text-slate-800">
                {lang === 'bn' ? 'রুটিনের ছবি সরাসরি আপলোড করুন (ছবি সিলেক্ট করুন)' : 'Direct Routine Image Upload (Select File)'}
              </label>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <label className="cursor-pointer px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-2 shadow-xs transition-colors shrink-0">
                  <Upload className="w-4 h-4" />
                  <span>{lang === 'bn' ? 'কম্পিউটার/মোবাইল থেকে ছবি বেছে নিন' : 'Choose Routine Image'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>

                {imageUrl ? (
                  <div className="flex items-center gap-3">
                    <img 
                      src={imageUrl} 
                      alt="Routine preview" 
                      className="w-20 h-14 object-cover rounded-xl border border-emerald-400 shadow-xs" 
                    />
                    <span className="text-xs text-emerald-800 font-semibold">
                      ✓ {lang === 'bn' ? 'ছবি সফলভাবে লোড হয়েছে' : 'Image loaded successfully'}
                    </span>
                  </div>
                ) : (
                  <span className="text-xs text-slate-400 italic">
                    {lang === 'bn' ? 'কোনো ছবি নির্বাচন করা হয়নি' : 'No image chosen yet'}
                  </span>
                )}
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {lang === 'bn' ? 'বিশেষ দ্রষ্টব্য বা অতিরিক্ত নোটস (ঐচ্ছিক)' : 'Additional Notes (Optional)'}
              </label>
              <textarea
                rows={2}
                placeholder={lang === 'bn' ? 'যেমন: শনি, সোম ও বুধবার রাত ৮:৩০ মিনিটে ক্লাস শুরু হবে।' : 'e.g. Classes held on Sat, Mon, Wed at 8:30 PM.'}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full border border-slate-200 rounded-xl p-3 text-xs focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => { setIsAdding(false); setEditingRoutine(null); }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                {lang === 'bn' ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
              >
                <Save className="w-4 h-4" />
                <span>{editingRoutine ? (lang === 'bn' ? 'আপডেট করুন' : 'Update Routine') : (lang === 'bn' ? 'রুটিন প্রকাশ করুন' : 'Publish Routine')}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ROUTINES LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {routines.map((routine) => (
          <div key={routine.id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  {routine.category}
                </span>
                <span className="text-[11px] font-semibold text-slate-400">
                  শিক্ষাবর্ষ {routine.academicYear}
                </span>
              </div>

              <h4 className="font-bold text-slate-900 text-sm">
                {lang === 'bn' ? routine.titleBn : routine.titleEn}
              </h4>

              <div className="rounded-xl overflow-hidden border border-slate-100 bg-slate-50 aspect-video flex items-center justify-center">
                <img src={routine.imageUrl} alt={routine.titleBn} className="w-full h-full object-cover" />
              </div>

              {routine.notes && (
                <p className="text-xs text-slate-500 line-clamp-2 italic">
                  {routine.notes}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-3">
              <span className="text-[10px] text-slate-400">{routine.uploadedDate}</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleStartEdit(routine)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1"
                >
                  <Edit3 className="w-3 h-3 text-emerald-600" />
                  <span>{lang === 'bn' ? 'এডিট' : 'Edit'}</span>
                </button>
                <button
                  onClick={() => {
                    if (confirm(lang === 'bn' ? 'আপনি কি এই রুটিনটি মুছে ফেলতে চান?' : 'Are you sure you want to delete this routine?')) {
                      deleteRoutine(routine.id);
                      showToast(lang === 'bn' ? 'রুটিন মুছে ফেলা হয়েছে!' : 'Routine deleted!');
                    }
                  }}
                  className="px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>{lang === 'bn' ? 'ডিলিট' : 'Delete'}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
