import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  GraduationCap, 
  Menu, 
  X, 
  Search, 
  Bell, 
  Award, 
  Globe, 
  Calculator as CalcIcon, 
  Lock, 
  BookA, 
  PhoneCall, 
  MessageCircle,
  FileText
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { 
    lang, 
    toggleLang, 
    schoolSettings, 
    enrolledCourseIds, 
    searchQuery, 
    setSearchQuery,
    isCalcOpen,
    setIsCalcOpen,
    isAdminLoggedIn
  } = useApp();

  const navLinks = [
    { nameEn: 'Home', nameBn: 'হোম', path: '/' },
    { nameEn: 'Courses', nameBn: 'কোর্সসমূহ', path: '/courses' },
    { nameEn: 'Free Classes', nameBn: 'ফ্রি ক্লাস', path: '/classes' },
    { nameEn: 'Notes & PDFs', nameBn: 'নোটস ও শিট', path: '/notes' },
    { nameEn: 'Suggestions', nameBn: 'সাজেশন', path: '/suggestions' },
    { nameEn: 'Model Tests', nameBn: 'মডেল টেস্ট', path: '/model-tests' },
    { nameEn: 'Results & Marksheet', nameBn: 'ফলাফল ও মার্কশিট', path: '/results' },
    { nameEn: 'Dictionary (1M)', nameBn: 'ডিকশনারি', path: '/dictionary' },
    { nameEn: 'Teachers', nameBn: 'শিক্ষকমণ্ডলী', path: '/teachers' },
    { nameEn: 'Notices', nameBn: 'নোটিশ বোর্ড', path: '/notices' },
    { nameEn: 'Admin Panel', nameBn: 'অ্যাডমিন', path: '/admin' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all shadow-xs print:hidden">
      {/* Top Notification Announcement Bar */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white text-xs py-1.5 px-4 font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="bg-emerald-400 text-emerald-950 font-black px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">
              {lang === 'bn' ? 'ভর্তি বিজ্ঞপ্তি' : 'ADMISSION'}
            </span>
            <span className="truncate">
              {lang === 'bn'
                ? 'এইচএসসি ২০২৬ ও স্পোকেন ইংলিশ স্পেশাল ব্যাচে ভর্তি চলছে! সরাসরি তৌহিদুল হক তুহিন স্যারের তত্ত্বাবধান।'
                : 'HSC 2026 & Spoken English Special Batches by MD Touhidul Hoque Tuhin are open for enrollment!'}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-[11px] shrink-0">
            <a
              href={`https://wa.me/${schoolSettings.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="hover:underline flex items-center gap-1 opacity-90 hover:opacity-100"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-300" />
              <span>WhatsApp: +{schoolSettings.whatsapp}</span>
            </a>
            <span className="opacity-50">|</span>
            <a href={`tel:${schoolSettings.phone}`} className="hover:underline opacity-90 hover:opacity-100">
              Hotline: {schoolSettings.phone}
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Brand Logo & Dynamic Institute Name */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            {schoolSettings.logoUrl ? (
              <img
                src={schoolSettings.logoUrl}
                alt={schoolSettings.instituteNameEn}
                className="w-10 h-10 rounded-xl object-cover border border-emerald-500 shadow-sm group-hover:scale-105 transition-transform"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-md">
                <GraduationCap className="w-6 h-6" />
              </div>
            )}
            <div>
              <div className="font-black text-base sm:text-lg text-slate-900 tracking-tight flex items-center gap-1.5">
                <span>{lang === 'bn' ? schoolSettings.instituteNameBn : schoolSettings.instituteNameEn}</span>
                <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                  IHAS
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium line-clamp-1">
                {lang === 'bn' ? schoolSettings.taglineBn : schoolSettings.taglineEn}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden 2xl:flex items-center space-x-0.5 font-semibold text-xs text-slate-600">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-2.5 py-1.5 rounded-lg transition-colors ${
                  isActive(link.path)
                    ? 'bg-emerald-50 text-emerald-700 font-bold'
                    : 'hover:text-emerald-600 hover:bg-slate-50'
                }`}
              >
                {lang === 'bn' ? link.nameBn : link.nameEn}
              </Link>
            ))}
          </nav>

          {/* Actions & Tools */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Quick Search */}
            <div className="relative hidden md:block w-36 lg:w-44">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder={lang === 'bn' ? 'সার্চ...' : 'Search...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100 focus:bg-white border border-slate-200 focus:border-emerald-500 text-xs rounded-full pl-8 pr-2.5 py-1.5 outline-none transition-all"
              />
            </div>

            {/* Language Toggle Button (বাংলা ↔ English) */}
            <button
              onClick={toggleLang}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-200 transition-colors shadow-2xs"
              title={lang === 'bn' ? 'Switch to English' : 'বাংলা ভাষায় দেখুন'}
            >
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
              <span>{lang === 'bn' ? 'English' : 'বাংলা'}</span>
            </button>

            {/* Built-in Academic Calculator Trigger */}
            <button
              onClick={() => setIsCalcOpen(!isCalcOpen)}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors"
              title={lang === 'bn' ? 'ক্যালকুলেটর' : 'Calculator'}
            >
              <CalcIcon className="w-4 h-4 text-emerald-600" />
              <span className="hidden xl:inline">{lang === 'bn' ? 'ক্যালকুলেটর' : 'Calculator'}</span>
            </button>

            {/* Admin Badge / Link */}
            <Link
              to="/admin"
              className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-full text-xs font-bold flex items-center gap-1 transition-colors ${
                isAdminLoggedIn 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
              title="Admin Panel"
            >
              <Lock className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">{isAdminLoggedIn ? 'Admin Active' : 'Admin'}</span>
            </Link>

            {/* My Learning Classroom */}
            <Link
              to="/my-learning"
              className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-full text-xs font-semibold transition-colors shadow-xs"
              title="My Classroom"
            >
              <Award className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">{lang === 'bn' ? 'ক্লাসরুম' : 'Classroom'}</span>
              {enrolledCourseIds.length > 0 && (
                <span className="bg-emerald-500 text-slate-950 rounded-full text-[10px] w-4 h-4 flex items-center justify-center font-bold">
                  {enrolledCourseIds.length}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="2xl:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="2xl:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top duration-150">
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

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
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
