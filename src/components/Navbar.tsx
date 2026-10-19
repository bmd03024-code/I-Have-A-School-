import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  GraduationCap, 
  Menu, 
  X, 
  Search, 
  Award, 
  Globe, 
  Calculator as CalcIcon, 
  Lock, 
  BookA, 
  PhoneCall, 
  MessageCircle,
  FileText,
  Calendar,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';

// Helper for Bangla Bongabda Calendar string
function getBanglaCalendarInfo(): { full: string; short: string; enFormatted: string } {
  try {
    const now = new Date();
    const enDay = now.getDate();
    const enMonth = now.getMonth();
    const enYear = now.getFullYear();

    const enMonths = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    const toBn = (n: number) => String(n).split('').map(d => banglaDigits[Number(d)] || d).join('');

    // Bangladesh revised Bengali calendar approximation
    // Mid-October corresponds to Kartik (কার্তিক)
    let bMonth = 'কার্তিক';
    let bDay = enDay - 16;
    if (bDay <= 0) bDay = 30 + bDay;
    if (enMonth === 10) bMonth = 'অগ্রহায়ণ';
    const bYear = enYear - 593; // 2026 - 593 = 1433

    return {
      full: `${toBn(bDay)} ${bMonth}, ${toBn(bYear)} বঙ্গাব্দ`,
      short: `${toBn(bDay)} ${bMonth}`,
      enFormatted: `${enDay} ${enMonths[enMonth]} ${enYear}`
    };
  } catch {
    return {
      full: '৪ কার্তিক, ১৪৩৩ বঙ্গাব্দ',
      short: '৪ কার্তিক',
      enFormatted: '19 October 2026'
    };
  }
}

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { 
    lang, 
    toggleLang, 
    schoolSettings, 
    courses,
    enrolledCourseIds, 
    searchQuery, 
    setSearchQuery,
    isCalcOpen,
    setIsCalcOpen,
    isFloatingDictOpen,
    setIsFloatingDictOpen,
    openEnrollmentModal,
    isAdminLoggedIn
  } = useApp();

  const calendarInfo = getBanglaCalendarInfo();

  const navLinks = [
    { nameEn: 'Home', nameBn: 'হোম', path: '/' },
    { nameEn: 'Courses', nameBn: 'কোর্সসমূহ', path: '/courses' },
    { nameEn: 'Free Classes', nameBn: 'ফ্রি ক্লাস', path: '/classes' },
    { nameEn: 'Notes & Sheets', nameBn: 'নোটস ও শিট', path: '/notes' },
    { nameEn: 'Suggestions', nameBn: 'সাজেশন', path: '/suggestions' },
    { nameEn: 'Model Tests', nameBn: 'মডেল টেস্ট', path: '/model-tests' },
    { nameEn: 'Results', nameBn: 'ফলাফল', path: '/results' },
    { nameEn: 'Routines', nameBn: 'রুটিন', path: '/routines' },
    { nameEn: 'Notices', nameBn: 'নোটিশ', path: '/notices' },
    { nameEn: 'Teachers', nameBn: 'শিক্ষক', path: '/teachers' },
    { nameEn: 'Dictionary (1M)', nameBn: 'ডিকশনারি', path: '/dictionary' },
    { nameEn: 'Admin', nameBn: 'অ্যাডমিন', path: '/admin' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs print:hidden">
      {/* 1. Top Notice Line (Maintained Smooth Continuous Marquee Ticker moving Right to Left in a Looping Motion) */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white text-xs py-1 px-4 font-medium border-b border-emerald-700/40 overflow-hidden relative select-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          
          {/* Fixed Badge & Announcement Label */}
          <div className="flex items-center gap-1.5 shrink-0 z-10 bg-emerald-900/95 py-0.5 pr-2.5 rounded-r-md">
            <span className="bg-emerald-400 text-emerald-950 font-black px-2 py-0.5 rounded text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-950 animate-pulse" />
              {lang === 'bn' ? 'জরুরি নোটিশ' : 'LIVE NOTICE'}
            </span>
          </div>

          {/* Smooth Continuous Looping Marquee Ticker */}
          <div className="flex-1 overflow-hidden relative">
            <div className="animate-ticker inline-flex items-center gap-10 text-[11px] font-medium text-emerald-50">
              <span className="inline-flex items-center gap-2">
                <span className="text-amber-300 font-bold">🔥</span>
                <span>
                  {lang === 'bn'
                    ? 'এইচএসসি ২০২৬ ও এসএসসি স্পেশাল রিভিশন ব্যাচে সরাসরি ভর্তি চলছে! সরাসরি তৌহিদুল হক তুহিন স্যারের তত্ত্বাবধান।'
                    : 'Admissions open for HSC 2026 & SSC Special Revision Batches by MD Touhidul Hoque Tuhin!'}
                </span>
              </span>
              <span className="text-emerald-400/60 font-mono">✦</span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-300" />
                <span>{lang === 'bn' ? `বাংলা ক্যালেন্ডার: ${calendarInfo.full}` : `Bangla Date: ${calendarInfo.full} (${calendarInfo.enFormatted})`}</span>
              </span>
              <span className="text-emerald-400/60 font-mono">✦</span>
              <span className="inline-flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                <span>
                  {lang === 'bn' 
                    ? `চলমান কোর্সসমূহ: ${courses.slice(0, 3).map(c => c.titleBn).join(' • ')}`
                    : `Running Courses: ${courses.slice(0, 3).map(c => c.titleEn).join(' • ')}`}
                </span>
              </span>
              <span className="text-emerald-400/60 font-mono">✦</span>
              <span className="inline-flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-amber-300" />
                <span>{lang === 'bn' ? 'ভর্তি পরিকল্পনা: ঘরে বসেই অনলাইন অথবা প্রতিষ্ঠানে সরাসরি ভর্তি ফরম পূরণের সুবিধা।' : 'Admit Plan: Enroll online from home or campus admission.'}</span>
              </span>
              <span className="text-emerald-400/60 font-mono">✦</span>
              <span className="inline-flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-emerald-300" />
                <span>{lang === 'bn' ? `হেল্পলাইন: ${schoolSettings.phone}` : `Hotline: ${schoolSettings.phone}`}</span>
              </span>

              {/* Duplicate Run for 100% Seamless Continuous Right-to-Left Loop */}
              <span className="inline-flex items-center gap-2">
                <span className="text-amber-300 font-bold">🔥</span>
                <span>
                  {lang === 'bn'
                    ? 'এইচএসসি ২০২৬ ও এসএসসি স্পেশাল রিভিশন ব্যাচে সরাসরি ভর্তি চলছে! সরাসরি তৌহিদুল হক তুহিন স্যারের তত্ত্বাবধান।'
                    : 'Admissions open for HSC 2026 & SSC Special Revision Batches by MD Touhidul Hoque Tuhin!'}
                </span>
              </span>
              <span className="text-emerald-400/60 font-mono">✦</span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-300" />
                <span>{lang === 'bn' ? `বাংলা ক্যালেন্ডার: ${calendarInfo.full}` : `Bangla Date: ${calendarInfo.full} (${calendarInfo.enFormatted})`}</span>
              </span>
              <span className="text-emerald-400/60 font-mono">✦</span>
              <span className="inline-flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                <span>
                  {lang === 'bn' 
                    ? `চলমান কোর্সসমূহ: ${courses.slice(0, 3).map(c => c.titleBn).join(' • ')}`
                    : `Running Courses: ${courses.slice(0, 3).map(c => c.titleEn).join(' • ')}`}
                </span>
              </span>
              <span className="text-emerald-400/60 font-mono">✦</span>
              <span className="inline-flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-amber-300" />
                <span>{lang === 'bn' ? 'ভর্তি পরিকল্পনা: ঘরে বসেই অনলাইন অথবা প্রতিষ্ঠানে সরাসরি ভর্তি ফরম পূরণের সুবিধা।' : 'Admit Plan: Enroll online from home or campus admission.'}</span>
              </span>
            </div>
          </div>

          {/* Quick WhatsApp Shortcut on Right */}
          <div className="hidden md:flex items-center gap-3 text-[11px] shrink-0 z-10 bg-emerald-900/95 pl-2">
            <a
              href={`https://wa.me/${schoolSettings.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="hover:underline flex items-center gap-1 text-emerald-200 hover:text-white font-medium"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-300" />
              <span>+{schoolSettings.whatsapp}</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. Main Header: Completely Static & Fixed Layout, No Layout Shifting, Large Height */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-[76px] sm:min-h-[86px] py-2.5 sm:py-3.5 gap-3">
          
          {/* First Column: Brand Logo & Title + 'By Tuhin Sir' + Language Toggle + Navigation */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0 lg:shrink min-w-0">
            {/* Brand Logo & Dynamic Institute Name with 'By Tuhin Sir' - Completely Static */}
            <Link to="/" className="flex items-center gap-2.5 sm:gap-3 shrink-0">
              {schoolSettings.logoUrl ? (
                <img
                  src={schoolSettings.logoUrl}
                  alt={schoolSettings.instituteNameEn}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl object-cover border-2 border-emerald-500/80 shadow-xs shrink-0"
                />
              ) : (
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-md shrink-0">
                  <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
              )}
              <div className="shrink-0 flex flex-col justify-center">
                <div className="font-black text-base sm:text-lg lg:text-xl text-slate-900 tracking-tight flex items-center gap-1.5 flex-wrap">
                  <span>{lang === 'bn' ? schoolSettings.instituteNameBn : schoolSettings.instituteNameEn}</span>
                  
                  {/* 'By Tuhin Sir' directly next to logo and title */}
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white font-extrabold text-[11px] sm:text-xs shadow-xs tracking-wide">
                    <span>By Tuhin Sir</span>
                  </span>

                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-black px-1.5 py-0.5 rounded">
                    IHAS
                  </span>
                </div>

                {/* Fully visible text below the title and notice bar, completely static and never cut off */}
                <p className="text-[11px] sm:text-xs text-slate-600 font-medium line-clamp-1 mt-0.5 flex items-center gap-1.5">
                  <span className="text-emerald-700 font-semibold">{lang === 'bn' ? schoolSettings.taglineBn : schoolSettings.taglineEn}</span>
                  <span className="text-slate-300 hidden md:inline">•</span>
                  <span className="text-slate-500 hidden md:inline">{schoolSettings.founderNameBn || 'মো. তৌহিদুল হক তুহিন'}</span>
                </p>
              </div>
            </Link>

            {/* Language Converter Button: Immediately Following Brand Logo and Title */}
            <button
              type="button"
              onClick={toggleLang}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-[11px] border border-emerald-200 transition-colors shadow-2xs shrink-0 cursor-pointer"
              title={lang === 'bn' ? 'Switch to English' : 'বাংলা ভাষায় দেখুন'}
            >
              <Globe className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{lang === 'bn' ? 'English' : 'বাংলা'}</span>
            </button>

            {/* Compact Desktop Navigation Links positioned right next to language toggle */}
            <nav className="hidden lg:flex items-center space-x-0.5 font-bold text-xs text-slate-600 pl-0.5">
              {navLinks.slice(0, 4).map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-2 py-1 rounded-lg transition-colors whitespace-nowrap ${
                    isActive(link.path)
                      ? 'bg-emerald-50 text-emerald-700 font-black'
                      : 'hover:text-emerald-700 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  {lang === 'bn' ? link.nameBn : link.nameEn}
                </Link>
              ))}

              {/* Extra links visible on xl screens */}
              {navLinks.slice(4, 6).map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`hidden xl:inline-block px-2 py-1 rounded-lg transition-colors whitespace-nowrap ${
                    isActive(link.path)
                      ? 'bg-emerald-50 text-emerald-700 font-black'
                      : 'hover:text-emerald-700 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  {lang === 'bn' ? link.nameBn : link.nameEn}
                </Link>
              ))}

              {/* Compact "More" dropdown for additional links */}
              <div className="relative group">
                <button
                  type="button"
                  className="px-2 py-1 rounded-lg text-slate-700 hover:text-emerald-700 hover:bg-slate-100 font-bold flex items-center gap-0.5 whitespace-nowrap cursor-pointer"
                >
                  <span>{lang === 'bn' ? 'আরও' : 'More'}</span>
                  <span className="text-[10px] text-slate-400 group-hover:text-emerald-600">▾</span>
                </button>
                <div className="absolute left-0 top-full mt-1 w-44 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                  <div className="xl:hidden">
                    {navLinks.slice(4, 6).map((link) => (
                      <Link
                        key={link.path}
                        to={link.path}
                        className={`block px-3 py-1.5 text-xs font-semibold ${
                          isActive(link.path) ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {lang === 'bn' ? link.nameBn : link.nameEn}
                      </Link>
                    ))}
                  </div>
                  {navLinks.slice(6).map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`block px-3 py-1.5 text-xs font-semibold ${
                        isActive(link.path) ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {lang === 'bn' ? link.nameBn : link.nameEn}
                    </Link>
                  ))}
                </div>
              </div>
            </nav>
          </div>

          {/* 3. Second Column of the Header: Essential Quick-Access Items & Tools */}
          {/* Dictionary icon directly ABOVE Calculator icon (ONLY Icons, No Spelling/Text), shifted inward */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Bangla Calendar Badge */}
            <div
              className="hidden 2xl:flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200/80 text-[11px] font-bold select-none shrink-0"
              title={`English Date: ${calendarInfo.enFormatted}`}
            >
              <Calendar className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>{calendarInfo.short}</span>
            </div>

            {/* Running Courses Quick Info */}
            <Link
              to="/courses"
              className="hidden 2xl:flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-[11px] font-bold transition-colors shrink-0"
              title={lang === 'bn' ? 'চলমান সকল কোর্স ও ব্যাচ' : 'Active Running Courses'}
            >
              <Sparkles className="w-3 h-3 text-emerald-600 shrink-0" />
              <span>{lang === 'bn' ? `${courses.length}টি লাইভ কোর্স` : `${courses.length} Courses`}</span>
            </Link>

            {/* Compact 2-Icon Vertical Stack: Dictionary directly ABOVE Calculator (NO text/spelling, only icons) */}
            <div className="flex flex-col items-center justify-center gap-0.5 shrink-0">
              {/* Dictionary: Icon ONLY */}
              <button
                type="button"
                onClick={() => setIsFloatingDictOpen(!isFloatingDictOpen)}
                className="w-7 h-6 rounded bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 flex items-center justify-center border border-slate-200/80 transition-colors shrink-0 cursor-pointer"
                title={lang === 'bn' ? '১০ লাখ শব্দের অক্সফোর্ড ডিকশনারি' : '1M Words Oxford Dictionary'}
                aria-label="Dictionary"
              >
                <BookA className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              </button>

              {/* Calculator: Icon ONLY directly below Dictionary */}
              <button
                type="button"
                onClick={() => setIsCalcOpen(!isCalcOpen)}
                className="w-7 h-6 rounded bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 flex items-center justify-center border border-slate-200/80 transition-colors shrink-0 cursor-pointer"
                title={lang === 'bn' ? 'সায়েন্টিফিক ক্যালকুলেটর' : 'Scientific Calculator'}
                aria-label="Calculator"
              >
                <CalcIcon className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              </button>
            </div>

            {/* Admit Plan (ভর্তি পরিকল্পনা) Quick Access Button */}
            <button
              type="button"
              onClick={() => {
                if (courses.length > 0) {
                  openEnrollmentModal(courses[0]);
                }
              }}
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-[11px] font-bold shadow-xs transition-colors shrink-0 cursor-pointer"
              title={lang === 'bn' ? 'ভর্তি পরিকল্পনা ও অনলাইন ফরম' : 'Admit Plan & Enrollment'}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'ভর্তি পরিকল্পনা' : 'Admit Plan'}</span>
            </button>

            {/* My Learning Classroom */}
            <Link
              to="/my-learning"
              className="hidden md:flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-white px-2.5 py-1.5 rounded-xl text-xs font-bold transition-colors shadow-xs shrink-0"
              title={lang === 'bn' ? 'আমার ক্লাসরুম' : 'My Classroom'}
            >
              <Award className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden xl:inline">{lang === 'bn' ? 'ক্লাসরুম' : 'Class'}</span>
              {enrolledCourseIds.length > 0 && (
                <span className="bg-emerald-500 text-slate-950 rounded-full text-[9px] w-4 h-4 flex items-center justify-center font-black">
                  {enrolledCourseIds.length}
                </span>
              )}
            </Link>

            {/* Admin Badge */}
            <Link
              to="/admin"
              className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors shrink-0 ${
                isAdminLoggedIn 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
              title="Admin Panel"
            >
              <Lock className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">{isAdminLoggedIn ? 'Admin Active' : 'Admin'}</span>
            </Link>

            {/* Mobile / Tablet Drawer Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer shrink-0"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 animate-fade-in">
          <div className="relative mb-2">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={lang === 'bn' ? 'সার্চ করুন...' : 'Search classes, notes, rules...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 text-xs rounded-xl pl-9 pr-3 py-2 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                  isActive(link.path)
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {lang === 'bn' ? link.nameBn : link.nameEn}
              </Link>
            ))}
          </div>

          {/* Mobile Quick Items Strip */}
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 text-xs font-semibold">
              <Calendar className="w-3.5 h-3.5 text-amber-600" />
              <span>{calendarInfo.full}</span>
            </div>

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                if (courses.length > 0) openEnrollmentModal(courses[0]);
              }}
              className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold flex items-center gap-1"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'ভর্তি পরিকল্পনা' : 'Admit Plan'}</span>
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>{schoolSettings.instituteNameBn}</span>
            <button
              onClick={toggleLang}
              className="text-emerald-700 font-bold hover:underline"
            >
              {lang === 'bn' ? 'Switch to English' : 'বাংলায় দেখুন'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
