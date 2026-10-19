import React, { useState } from 'react';
import { Pin, Calendar, ArrowRight, Printer, FileText, Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Notice, ClassRoutine } from '../types';

export const NoticeBoard: React.FC = () => {
  const { notices, routines, lang, schoolSettings } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeRoutineForPrint, setActiveRoutineForPrint] = useState<ClassRoutine | null>(null);

  const categories = ['All', 'Admission', 'Routine', 'Exam', 'General'];

  const filteredNotices = selectedCategory === 'All'
    ? notices
    : notices.filter((n: Notice) => n.category === selectedCategory);

  const handlePrintRoutine = (routine: ClassRoutine) => {
    setActiveRoutineForPrint(routine);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Printable Routine Overlay (visible only during print if active) */}
      {activeRoutineForPrint && (
        <div className="hidden print:block fixed inset-0 bg-white z-[9999] p-8 text-slate-900">
          <div className="text-center pb-6 border-b-2 border-slate-900 space-y-2">
            <h1 className="text-2xl font-black">{schoolSettings.instituteNameBn}</h1>
            <p className="text-sm font-semibold">{schoolSettings.instituteNameEn}</p>
            <p className="text-xs text-slate-600">{schoolSettings.addressBn} • ফোন: {schoolSettings.phone}</p>
            <div className="mt-4 inline-block bg-slate-900 text-white font-bold text-sm px-4 py-1 rounded">
              {lang === 'bn' ? activeRoutineForPrint.titleBn : activeRoutineForPrint.titleEn} (শিক্ষাবর্ষ {activeRoutineForPrint.academicYear})
            </div>
          </div>
          <div className="my-6 flex justify-center">
            <img 
              src={activeRoutineForPrint.imageUrl} 
              alt={activeRoutineForPrint.titleBn} 
              className="max-h-[75vh] w-auto object-contain border border-slate-300 rounded"
            />
          </div>
          {activeRoutineForPrint.notes && (
            <p className="text-xs text-slate-700 italic border-t pt-4">
              {lang === 'bn' ? 'বিশেষ দ্রষ্টব্য: ' : 'Note: '}{activeRoutineForPrint.notes}
            </p>
          )}
          <div className="flex justify-between items-end mt-12 pt-4">
            <div className="text-xs text-slate-500">
              মুদ্রণ তারিখ: {new Date().toLocaleDateString('bn-BD')}
            </div>
            <div className="text-center">
              {schoolSettings.headmasterSignatureUrl && (
                <img src={schoolSettings.headmasterSignatureUrl} alt="Signature" className="h-10 mx-auto object-contain" />
              )}
              <div className="text-xs font-bold border-t border-slate-700 pt-1">
                প্রধান শিক্ষক / কোর্স পরিচালক
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
          {lang === 'bn' ? 'অফিশিয়াল নোটিশ ও রুটিন' : 'Official Circulars & Routines'}
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {lang === 'bn' ? 'আই হ্যাভ এ স্কুল নোটিশ বোর্ড' : 'I Have A School Notice Board'}
        </h1>
        <p className="text-sm text-slate-500 leading-relaxed max-w-lg mx-auto">
          {lang === 'bn'
            ? 'ভর্তি সংক্রান্ত তথ্য, লাইভ ক্লাস রুটিন, পরীক্ষার সময়সূচি এবং জরুরি ঘোষণা নিয়মিত দেখতে এই পেইজ অনুসরণ করুন।'
            : 'Stay updated with upcoming live class routines, admission deadlines, model test schedules, and special announcements.'}
        </p>
      </div>

      {/* Routine Section Gallery with Print Option */}
      {routines && routines.length > 0 && (
        <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-200/60 pb-4">
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {lang === 'bn' ? 'অফিশিয়াল রুটিন গ্যালারি' : 'Official Routine Gallery'}
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
                {lang === 'bn' ? 'ক্লাস ও পরীক্ষার সময়সূচি (রুটিন)' : 'Class & Exam Schedules (Routines)'}
              </h2>
            </div>
            <p className="text-xs text-slate-600 max-w-xs">
              {lang === 'bn' ? 'সরাসরি রুটিনের ছবি দেখুন অথবা প্রিন্ট করুন' : 'View or print official routine schedules directly'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {routines.map((routine) => (
              <div key={routine.id} className="bg-white rounded-2xl border border-emerald-100 p-4 shadow-xs space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      {routine.category}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400">
                      শিক্ষাবর্ষ {routine.academicYear}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    {lang === 'bn' ? routine.titleBn : routine.titleEn}
                  </h3>
                  <div className="rounded-xl overflow-hidden border border-slate-100 bg-slate-50 aspect-video flex items-center justify-center">
                    <img 
                      src={routine.imageUrl} 
                      alt={routine.titleBn} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
                    />
                  </div>
                  {routine.notes && (
                    <p className="text-xs text-slate-500 italic line-clamp-2">
                      {routine.notes}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => handlePrintRoutine(routine)}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs"
                  >
                    <Printer className="w-3.5 h-3.5 text-emerald-400" />
                    {lang === 'bn' ? 'রুটিন প্রিন্ট করুন' : 'Print Routine'}
                  </button>
                  <a
                    href={routine.imageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    {lang === 'bn' ? 'বড় করে দেখুন' : 'Enlarge'}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === cat
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {filteredNotices.map((notice: Notice) => {
          const title = lang === 'bn' ? notice.titleBn : notice.titleEn;
          const content = lang === 'bn' ? notice.contentBn : notice.contentEn;

          return (
            <div
              key={notice.id}
              className={`bg-white rounded-2xl border p-6 shadow-xs space-y-3 transition-all ${
                notice.isPinned
                  ? 'border-emerald-300 ring-1 ring-emerald-400/30'
                  : 'border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {notice.isPinned && (
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                      <Pin className="w-3 h-3 fill-amber-700" /> {lang === 'bn' ? 'পিন করা' : 'Pinned'}
                    </span>
                  )}
                  <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded">
                    {notice.category}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{notice.date}</span>
                </div>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                {title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {content}
              </p>

              {/* Attachment Preview (Image or PDF) */}
              {notice.imageUrl && (
                <div className="rounded-xl overflow-hidden border border-slate-100 max-h-80 bg-slate-50 flex items-center justify-center">
                  <img src={notice.imageUrl} alt={title} className="max-h-80 w-auto object-contain" />
                </div>
              )}

              {notice.pdfUrl && (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <FileText className="w-4 h-4 text-red-500 shrink-0" />
                  <span className="text-xs text-slate-700 truncate flex-1 font-medium">
                    {lang === 'bn' ? 'সংযুক্ত অফিসিয়াল পিডিএফ ডকুমেন্ট' : 'Official Attached PDF Document'}
                  </span>
                  <a
                    href={notice.pdfUrl}
                    download="official-notice.pdf"
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1 text-xs bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 shrink-0"
                  >
                    {lang === 'bn' ? 'ডাউনলোড / দেখুন' : 'Download / View'}
                  </a>
                </div>
              )}

              <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-100">
                <span className="text-slate-400">
                  {lang === 'bn' ? 'প্রকাশক: প্রশাসন ও পরীক্ষা বিভাগ' : 'Published by Administration Desk'}
                </span>
                {notice.category === 'Admission' && (
                  <Link to="/courses" className="text-emerald-600 font-bold hover:underline flex items-center gap-1">
                    {lang === 'bn' ? 'ব্যাচসমূহ দেখুন' : 'View Batches'} <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
