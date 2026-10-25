import React, { useState } from 'react';
import { Bell, Calendar, ChevronRight, FileText, Pin, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Notice } from '../types';

interface HomeNoticeSectionProps {
  notices: Notice[];
  lang: 'bn' | 'en';
}

export const HomeNoticeSection: React.FC<HomeNoticeSectionProps> = ({ notices, lang }) => {
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  // Take top 4 most recent notices
  const displayNotices = notices.slice(0, 4);

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'Admission':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Exam':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'Routine':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getCategoryLabel = (category: string) => {
    if (lang === 'en') return category;
    switch (category) {
      case 'Admission': return 'ভর্তি নোটিশ';
      case 'Exam': return 'পরীক্ষা সংক্রান্ত';
      case 'Routine': return 'ক্লাস রুটিন';
      case 'General': return 'সাধারণ নোটিশ';
      default: return category;
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-emerald-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Bell className="w-4 h-4 animate-bounce" />
            <span>{lang === 'bn' ? 'অফিসিয়াল নোটিশ বোর্ড' : 'Official Notice Board'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {lang === 'bn' ? 'সর্বশেষ নোটিশ ও ঘোষণা' : 'Latest Notices & Announcements'}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {lang === 'bn'
              ? 'ভর্তি, ক্লাস রুটিন ও পরীক্ষা সংক্রান্ত প্রাতিষ্ঠানিক সকল জরুরি আপডেট।'
              : 'Stay up-to-date with exam dates, admission alerts, and routine changes.'}
          </p>
        </div>

        <Link
          to="/notices"
          className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 group shrink-0"
        >
          <span>{lang === 'bn' ? `সকল নোটিশ দেখুন (${notices.length})` : `All Notices (${notices.length})`}</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayNotices.map((notice) => (
          <div
            key={notice.id}
            onClick={() => setSelectedNotice(notice)}
            className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-lg border ${getCategoryBadgeClass(notice.category)}`}>
                  {getCategoryLabel(notice.category)}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                  <Calendar className="w-3.5 h-3.5" />
                  {notice.date}
                </span>
              </div>

              <h3 className="font-bold text-base text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-2 leading-snug">
                {lang === 'bn' ? notice.titleBn : notice.titleEn}
              </h3>

              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {lang === 'bn' ? notice.contentBn : notice.contentEn}
              </p>
            </div>

            <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-emerald-600 font-bold group-hover:underline flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'বিস্তারিত নোটিশ পড়ুন →' : 'Read Notice →'}</span>
              </span>
              <span className="text-[11px] text-slate-400">
                {lang === 'bn' ? 'আই হ্যাভ এ স্কুল একাডেমি' : 'I Have A School'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Notice Detail Modal */}
      {selectedNotice && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedNotice(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className={`text-xs font-bold px-3 py-1 rounded-xl border ${getCategoryBadgeClass(selectedNotice.category)}`}>
                {getCategoryLabel(selectedNotice.category)}
              </span>
              <button
                onClick={() => setSelectedNotice(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                <span>{selectedNotice.date}</span>
              </div>
              <h3 className="text-lg font-black text-slate-900 leading-snug">
                {lang === 'bn' ? selectedNotice.titleBn : selectedNotice.titleEn}
              </h3>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-700 leading-relaxed whitespace-pre-line max-h-72 overflow-y-auto">
              {lang === 'bn' ? selectedNotice.contentBn : selectedNotice.contentEn}
            </div>

            <div className="flex items-center justify-between pt-2">
              <Link
                to="/notices"
                onClick={() => setSelectedNotice(null)}
                className="text-xs font-bold text-emerald-600 hover:underline"
              >
                {lang === 'bn' ? 'সব নোটিশের পাতায় যান' : 'Go to Notice Board'}
              </Link>
              <button
                onClick={() => setSelectedNotice(null)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl"
              >
                {lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
