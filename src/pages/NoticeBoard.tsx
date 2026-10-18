import React, { useState } from 'react';
import { Pin, Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Notice } from '../types';

export const NoticeBoard: React.FC = () => {
  const { notices, lang } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Admission', 'Routine', 'Exam', 'General'];

  const filteredNotices = selectedCategory === 'All'
    ? notices
    : notices.filter((n: Notice) => n.category === selectedCategory);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
          {lang === 'bn' ? 'অফিশিয়াল নোটিশ' : 'Official Circulars'}
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

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {content}
              </p>

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
