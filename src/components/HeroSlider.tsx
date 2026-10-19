import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  ArrowRight, 
  MessageCircle,
  Calendar,
  BookA,
  FileText,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { HeroSlide } from '../types';

// Helper for Bangla Bongabda Calendar string
function getBanglaCalendarInfo(): { full: string; short: string; enFormatted: string } {
  try {
    const now = new Date();
    const enDay = now.getDate();
    const enMonth = now.getMonth();
    const enYear = now.getFullYear();

    const enMonths = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    const toBn = (n: number) => String(n).split('').map(d => banglaDigits[Number(d)] || d).join('');

    let bMonth = 'কার্তিক';
    let bDay = enDay - 16;
    if (bDay <= 0) bDay = 30 + bDay;
    if (enMonth === 10) bMonth = 'অগ্রহায়ণ';
    const bYear = enYear - 593;

    return {
      full: `${toBn(bDay)} ${bMonth}, ${toBn(bYear)} বঙ্গাব্দ`,
      short: `${toBn(bDay)} ${bMonth}`,
      enFormatted: `${enDay} ${enMonths[enMonth]} ${enYear}`
    };
  } catch {
    return {
      full: '৪ কার্তিক, ১৪৩৩ বঙ্গাব্দ',
      short: '৪ কার্তিক',
      enFormatted: '19 Oct 2026'
    };
  }
}

export const HeroSlider: React.FC = () => {
  const { 
    heroSlides, 
    lang, 
    schoolSettings, 
    courses, 
    openEnrollmentModal, 
    setIsFloatingDictOpen, 
    isFloatingDictOpen 
  } = useApp();
  const [currentIdx, setCurrentIdx] = useState(0);

  const activeSlides = heroSlides.filter((s: HeroSlide) => s.active);

  // Keep hero static: no auto-slide interval (static layout as requested)
  if (activeSlides.length === 0) return null;

  const current = activeSlides[currentIdx] || activeSlides[0];

  const handlePrev = () => {
    setCurrentIdx((prev) => (prev === 0 ? activeSlides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIdx((prev) => (prev + 1) % activeSlides.length);
  };

  const title = lang === 'bn' ? current.titleBn : current.titleEn;
  const subtitle = lang === 'bn' ? current.subtitleBn : current.subtitleEn;
  const buttonText = lang === 'bn' ? current.buttonTextBn : current.buttonTextEn;
  const bDate = getBanglaCalendarInfo();

  return (
    <div className="relative overflow-hidden bg-slate-950 text-white min-h-[420px] sm:min-h-[460px] lg:min-h-[480px] flex flex-col justify-between">
      {/* Background image with overlay - completely static, no scale or transition shifts */}
      <div className="absolute inset-0 z-0">
        <img
          src={current.imageUrl}
          alt={title}
          className="w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/25" />
      </div>

      {/* Slide Content: Completely static layout without layout shifts or animations */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-6 sm:pb-8 w-full flex-1 flex items-center">
        <div className="max-w-2xl space-y-4 sm:space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/35 text-emerald-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>{schoolSettings.taglineBn && lang === 'bn' ? schoolSettings.taglineBn : schoolSettings.taglineEn}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight sm:leading-none tracking-tight">
            {title}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal max-w-xl">
            {subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <Link
              to={current.buttonUrl}
              className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-emerald-950/40 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <span>{buttonText}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href={`https://wa.me/${schoolSettings.whatsapp}?text=${encodeURIComponent(
                lang === 'bn' 
                  ? 'আসসালামু আলাইকুম তুহিন স্যার, আমি আপনার স্কুলে ভর্তি হতে আগ্রহী।' 
                  : 'Hello Tuhin Sir, I am interested in enrolling in your school courses.'
              )}`}
              target="_blank"
              rel="noreferrer"
              className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-emerald-700/60 hover:bg-emerald-600/80 text-white font-bold text-xs sm:text-sm border border-emerald-500/50 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-emerald-300" />
              <span>{lang === 'bn' ? 'হোয়াটসঅ্যাপে সরাসরি ভর্তি' : 'WhatsApp Admission'}</span>
            </a>

            <button
              type="button"
              onClick={() => {
                if (courses.length > 0) openEnrollmentModal(courses[0]);
              }}
              className="px-4 py-2.5 sm:py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs sm:text-sm border border-slate-700/80 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'bn' ? 'ভর্তি পরিকল্পনা' : 'Admit Plan'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {activeSlides.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-900/70 hover:bg-emerald-600 text-white border border-slate-700 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-900/70 hover:bg-emerald-600 text-white border border-slate-700 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Integrated Quick-Access Strip (Bangla Calendar, Dictionary, Running Courses, Admit Plan) */}
      <div className="relative z-10 w-full bg-slate-900/90 backdrop-blur-md border-t border-slate-800/80 py-2.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          
          {/* Quick Item 1: Bangla Calendar Date */}
          <div className="flex items-center gap-2 text-slate-300">
            <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Calendar className="w-3.5 h-3.5" />
            </span>
            <div>
              <span className="font-bold text-white text-[11px] block">{bDate.full}</span>
              <span className="text-[10px] text-slate-400">{bDate.enFormatted} • {lang === 'bn' ? 'বঙ্গাব্দ ক্যালেন্ডার' : 'Bangla Calendar'}</span>
            </div>
          </div>

          {/* Quick Item 2: Running Courses */}
          <Link
            to="/courses"
            className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
          >
            <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            <div>
              <span className="font-bold text-emerald-300 text-[11px] block flex items-center gap-1">
                <span>{lang === 'bn' ? `${courses.length}টি লাইভ কোর্স চলমান` : `${courses.length} Active Courses`}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </span>
              <span className="text-[10px] text-slate-400">{lang === 'bn' ? 'এইচএসসি, এসএসসি ও স্পোকেন' : 'HSC, SSC & Spoken English'}</span>
            </div>
          </Link>

          {/* Quick Item 3: Dictionary Shortcut */}
          <button
            type="button"
            onClick={() => setIsFloatingDictOpen(!isFloatingDictOpen)}
            className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors cursor-pointer text-left"
          >
            <span className="w-6 h-6 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
              <BookA className="w-3.5 h-3.5" />
            </span>
            <div>
              <span className="font-bold text-white text-[11px] block">{lang === 'bn' ? 'অক্সফোর্ড ডিকশনারি' : 'Oxford Dictionary'}</span>
              <span className="text-[10px] text-slate-400">{lang === 'bn' ? '১০ লাখ শব্দের অনুসন্ধান' : '1M+ Words Database'}</span>
            </div>
          </button>

          {/* Quick Item 4: Admit Plan */}
          <button
            type="button"
            onClick={() => {
              if (courses.length > 0) openEnrollmentModal(courses[0]);
            }}
            className="hidden md:flex items-center gap-2 text-slate-300 hover:text-white transition-colors cursor-pointer text-left"
          >
            <span className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </span>
            <div>
              <span className="font-bold text-white text-[11px] block">{lang === 'bn' ? 'ভর্তি পরিকল্পনা ২০২৬' : 'Admit Plan 2026'}</span>
              <span className="text-[10px] text-slate-400">{lang === 'bn' ? 'অনলাইন ও অফলাইন ভর্তি' : 'Online & On-Campus'}</span>
            </div>
          </button>

          {/* Dot Indicators */}
          {activeSlides.length > 1 && (
            <div className="flex items-center gap-1.5 ml-auto">
              {activeSlides.map((_: HeroSlide, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIdx(idx)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    currentIdx === idx ? 'w-6 bg-emerald-400' : 'w-1.5 bg-slate-600 hover:bg-slate-400'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
