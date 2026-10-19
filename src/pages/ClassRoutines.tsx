import React, { useState } from 'react';
import { Calendar, Printer, Download, Eye, Filter } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ClassRoutine } from '../types';

export const ClassRoutines: React.FC = () => {
  const { routines, lang, schoolSettings, courses } = useApp();
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeRoutineForPrint, setActiveRoutineForPrint] = useState<ClassRoutine | null>(null);
  const [viewingRoutine, setViewingRoutine] = useState<ClassRoutine | null>(null);

  const filteredRoutines = routines.filter((r) => {
    const matchYear = selectedYear === 'all' || r.academicYear === selectedYear;
    const matchCat = selectedCategory === 'all' || r.category === selectedCategory;
    return matchYear && matchCat;
  });

  const handlePrint = (routine: ClassRoutine) => {
    setActiveRoutineForPrint(routine);
    setTimeout(() => {
      window.print();
    }, 250);
  };

  const handleDownloadImage = (routine: ClassRoutine) => {
    const link = document.createElement('a');
    link.href = routine.imageUrl;
    link.download = `${routine.titleEn || 'routine'}-${routine.academicYear}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Printable Routine Sheet (Hidden except during window.print()) */}
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

      {/* Fullscreen View Modal */}
      {viewingRoutine && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 space-y-4 max-h-[90vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">
                  {lang === 'bn' ? viewingRoutine.titleBn : viewingRoutine.titleEn}
                </h3>
                <span className="text-xs text-emerald-700 font-semibold">
                  শিক্ষাবর্ষ: {viewingRoutine.academicYear} • {viewingRoutine.category}
                </span>
              </div>
              <button
                onClick={() => setViewingRoutine(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold px-2 py-1"
              >
                ✕ বন্ধ করুন
              </button>
            </div>

            <div className="flex-1 overflow-auto flex justify-center p-2 bg-slate-50 rounded-2xl border">
              <img
                src={viewingRoutine.imageUrl}
                alt={viewingRoutine.titleBn}
                className="max-h-[65vh] w-auto object-contain rounded-xl"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500 italic">
                {viewingRoutine.notes}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadImage(viewingRoutine)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? 'ডাউনলোড' : 'Download'}</span>
                </button>
                <button
                  onClick={() => handlePrint(viewingRoutine)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? 'প্রিন্ট করুন' : 'Print Routine'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
          {lang === 'bn' ? 'অফিশিয়াল একাডেমিক রুটিন' : 'Official Academic Routine'}
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {lang === 'bn' ? 'ক্লাস ও পরীক্ষার সময়সূচি' : 'Class & Examination Routine'}
        </h1>
        <p className="text-sm text-slate-500 leading-relaxed max-w-lg mx-auto">
          {lang === 'bn'
            ? 'শিক্ষাবর্ষ ভিত্তিক ক্লাস, পরীক্ষা ও স্পেশাল ব্যাচের অফিশিয়াল রুটিন দেখুন, ডাউনলোড করুন অথবা সরাসরি প্রিন্ট করুন।'
            : 'Access official academic year routines, view full-resolution schedule cards, download, or print directly.'}
        </p>
      </div>

      {/* Filter Controls */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-emerald-600" />
            {lang === 'bn' ? 'ফিল্টার:' : 'Filter:'}
          </span>

          {/* Academic Year Selector */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-50 focus:outline-none"
          >
            <option value="all">{lang === 'bn' ? 'সকল শিক্ষাবর্ষ (All Years)' : 'All Years'}</option>
            <option value="2027">Year 2027</option>
            <option value="2026">Year 2026</option>
            <option value="2025">Year 2025</option>
            <option value="2024">Year 2024</option>
          </select>

          {/* Category Selector */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-50 focus:outline-none"
          >
            <option value="all">{lang === 'bn' ? 'সকল ক্যাটাগরি' : 'All Categories'}</option>
            <option value="Class Routine">{lang === 'bn' ? 'ক্লাস রুটিন' : 'Class Routine'}</option>
            <option value="Exam Routine">{lang === 'bn' ? 'পরীক্ষার রুটিন' : 'Exam Routine'}</option>
            <option value="Batch Routine">{lang === 'bn' ? 'ব্যাচ রুটিন' : 'Batch Routine'}</option>
          </select>
        </div>

        <span className="text-xs text-slate-400 font-semibold">
          {filteredRoutines.length} {lang === 'bn' ? 'টি রুটিন পাওয়া গেছে' : 'routines found'}
        </span>
      </div>

      {/* Routines Grid */}
      {filteredRoutines.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400 space-y-2">
          <Calendar className="w-10 h-10 mx-auto text-slate-300" />
          <p className="text-sm font-semibold">
            {lang === 'bn' ? 'নির্বাচিত ক্যাটাগরিতে কোনো রুটিন পাওয়া যায়নি।' : 'No routines found for selected filters.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRoutines.map((routine) => {
            const courseObj = courses.find((c) => c.id === routine.courseId);
            return (
              <div
                key={routine.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Routine Image Preview */}
                  <div 
                    onClick={() => setViewingRoutine(routine)}
                    className="aspect-[4/3] bg-slate-100 overflow-hidden relative group cursor-pointer"
                  >
                    <img
                      src={routine.imageUrl}
                      alt={routine.titleBn}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-bold">
                      <Eye className="w-4 h-4" />
                      <span>{lang === 'bn' ? 'বড় করে দেখুন' : 'Full Preview'}</span>
                    </div>

                    <span className="absolute top-3 right-3 bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded shadow">
                      {routine.academicYear}
                    </span>
                  </div>

                  <div className="p-5 pb-0 space-y-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800">
                      {routine.category}
                    </span>
                    <h3 className="font-bold text-slate-900 text-base leading-snug">
                      {lang === 'bn' ? routine.titleBn : routine.titleEn}
                    </h3>
                    {courseObj && (
                      <p className="text-xs text-slate-500 font-medium truncate">
                        {lang === 'bn' ? courseObj.titleBn : courseObj.titleEn}
                      </p>
                    )}
                    {routine.notes && (
                      <p className="text-xs text-slate-600 line-clamp-2 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        {routine.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2 mt-4">
                  <button
                    onClick={() => handleDownloadImage(routine)}
                    className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{lang === 'bn' ? 'ডাউনলোড' : 'Download'}</span>
                  </button>

                  <button
                    onClick={() => handlePrint(routine)}
                    className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>{lang === 'bn' ? 'প্রিন্ট' : 'Print'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
