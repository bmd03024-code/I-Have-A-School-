import React from 'react';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, 
  Mail, 
  Phone, 
  MapPin, 
  Heart, 
  Youtube, 
  Facebook, 
  Send, 
  MessageCircle, 
  Award, 
  Lock, 
  Calculator as CalcIcon,
  BookA,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { lang, schoolSettings, setIsCalcOpen } = useApp();

  const defaultLearningHub = [
    { id: 'lh-1', titleBn: 'কোয়ালিটি কোর্সসমূহ', titleEn: 'Quality Courses', url: '/courses' },
    { id: 'lh-2', titleBn: 'ফ্রি ভিডিও ক্লাস', titleEn: 'Free Video Classes', url: '/classes' },
    { id: 'lh-3', titleBn: 'লেকচার নোটস ও পিডিএফ', titleEn: 'Lecture Notes & PDFs', url: '/notes' },
    { id: 'lh-4', titleBn: 'এইচএসসি ও বোর্ড সাজেশন', titleEn: 'Exam Suggestions', url: '/suggestions' },
    { id: 'lh-5', titleBn: 'অনলাইন মডেল টেস্ট', titleEn: 'Online Model Tests', url: '/model-tests' }
  ];

  const defaultServices = [
    { id: 'srv-1', titleBn: 'মার্কশিট ও ফলাফল প্রিন্ট', titleEn: 'Marksheet & Results', url: '/results' },
    { id: 'srv-2', titleBn: '১০ লাখ শব্দের ডিকশনারি', titleEn: '1M Words Dictionary', url: '/dictionary' },
    { id: 'srv-3', titleBn: 'সায়েন্টিফিক ক্যালকুলেটর', titleEn: 'Scientific Calculator', url: '#calc' },
    { id: 'srv-4', titleBn: 'শিক্ষক প্যানেল ও আইডি কার্ড', titleEn: 'Faculty & ID Cards', url: '/teachers' },
    { id: 'srv-5', titleBn: 'ক্লাস রুটিন ও সময়সূচি', titleEn: 'Class Routines', url: '/routines' },
    { id: 'srv-6', titleBn: 'অ্যাডমিন ড্যাশবোর্ড', titleEn: 'Admin Dashboard', url: '/admin' }
  ];

  const learningHubLinks = schoolSettings.learningHubLinks && schoolSettings.learningHubLinks.length > 0 
    ? schoolSettings.learningHubLinks 
    : defaultLearningHub;

  const servicesLinks = schoolSettings.servicesLinks && schoolSettings.servicesLinks.length > 0 
    ? schoolSettings.servicesLinks 
    : defaultServices;

  return (
    <footer className="bg-slate-950 text-slate-300 pt-14 pb-8 border-t border-slate-800 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              {schoolSettings.logoUrl ? (
                <img 
                  src={schoolSettings.logoUrl} 
                  alt={schoolSettings.instituteNameEn}
                  className="w-11 h-11 rounded-xl object-contain bg-white/10 p-1 border border-emerald-500/40 shadow-md"
                />
              ) : (
                <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-md">
                  <GraduationCap className="w-6 h-6" />
                </div>
              )}
              <div>
                <span className="font-extrabold text-xl text-white tracking-tight block">
                  {lang === 'bn' ? schoolSettings.instituteNameBn : schoolSettings.instituteNameEn}
                </span>
                <p className="text-xs text-emerald-400 font-medium">
                  {lang === 'bn' ? schoolSettings.taglineBn : schoolSettings.taglineEn}
                </p>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              {lang === 'bn'
                ? (schoolSettings.footerDescriptionBn || 'এমডি তৌহিদুল হক তুহিন স্যারের শিক্ষামূলক প্ল্যাটফর্ম—ইংরেজি ব্যাকরণ সহজীকরণ, অনর্গল স্পোকেন ইংলিশ, বোর্ড পরীক্ষার ১০০% সাজেশন ও কোয়ালিটি কোর্স।')
                : (schoolSettings.footerDescriptionEn || 'Educational mentorship initiative led by MD Touhidul Hoque Tuhin to empower students across Bangladesh with intuitive English mastery.')}
            </p>

            {/* Social Links */}
            <div className="pt-2 flex flex-wrap items-center gap-2.5 text-slate-400">
              {schoolSettings.facebookUrl && (
                <a 
                  href={schoolSettings.facebookUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 hover:border-emerald-500 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-all shadow-xs"
                  title="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}

              {schoolSettings.youtubeUrl && (
                <a 
                  href={schoolSettings.youtubeUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 hover:border-red-500 hover:bg-red-600 hover:text-white flex items-center justify-center transition-all shadow-xs"
                  title="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}

              {schoolSettings.tiktokUrl && (
                <a 
                  href={schoolSettings.tiktokUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 hover:border-pink-500 hover:bg-black hover:text-white flex items-center justify-center transition-all shadow-xs group"
                  title="TikTok"
                >
                  <svg className="w-4 h-4 fill-current text-slate-400 group-hover:text-pink-400" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                  </svg>
                </a>
              )}

              {schoolSettings.whatsapp && (
                <a 
                  href={`https://wa.me/${schoolSettings.whatsapp.replace(/[^0-9]/g, '')}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 hover:border-emerald-500 hover:bg-[#25D366] hover:text-white flex items-center justify-center transition-all shadow-xs"
                  title="WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              )}

              {schoolSettings.messengerUrl && (
                <a 
                  href={schoolSettings.messengerUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 hover:border-blue-500 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-all shadow-xs"
                  title="Messenger"
                >
                  <Send className="w-4 h-4" />
                </a>
              )}

              {schoolSettings.telegramUrl && (
                <a 
                  href={schoolSettings.telegramUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 hover:border-sky-500 hover:bg-sky-600 hover:text-white flex items-center justify-center transition-all shadow-xs"
                  title="Telegram"
                >
                  <Send className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Learning Links (Dynamic) */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4 border-l-2 border-emerald-500 pl-2">
              {lang === 'bn' ? 'লার্নিং হাব' : 'Learning Hub'}
            </h4>
            <ul className="space-y-2.5 text-xs">
              {learningHubLinks.map((link) => (
                <li key={link.id}>
                  <Link 
                    to={link.url} 
                    className="hover:text-emerald-400 transition-colors flex items-center gap-1 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 group-hover:bg-emerald-400 transition-colors" />
                    <span>{lang === 'bn' ? link.titleBn : link.titleEn}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Institutional Shortcuts & Services (Dynamic) */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4 border-l-2 border-emerald-500 pl-2">
              {lang === 'bn' ? 'প্রয়োজনীয় সার্ভিস' : 'Academic Services'}
            </h4>
            <ul className="space-y-2.5 text-xs">
              {servicesLinks.map((srv) => (
                <li key={srv.id}>
                  {srv.url === '#calc' || srv.url === '/calc' ? (
                    <button
                      onClick={() => setIsCalcOpen(true)}
                      className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 text-left text-emerald-400 font-semibold"
                    >
                      <CalcIcon className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{lang === 'bn' ? srv.titleBn : srv.titleEn}</span>
                    </button>
                  ) : (
                    <Link 
                      to={srv.url} 
                      className="hover:text-emerald-400 transition-colors flex items-center gap-1 group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-500/50 group-hover:bg-emerald-400 transition-colors" />
                      <span>{lang === 'bn' ? srv.titleBn : srv.titleEn}</span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details (Dynamic) */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4 border-l-2 border-emerald-500 pl-2">
              {lang === 'bn' ? 'যোগাযোগ ও সাপোর্ট' : 'Contact & Support'}
            </h4>
            <div className="space-y-3.5 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-slate-200 font-semibold">{lang === 'bn' ? 'হটলাইন নম্বর' : 'Hotline'}</span>
                  <a href={`tel:${schoolSettings.phone}`} className="hover:text-emerald-400 transition-colors font-mono">
                    {schoolSettings.phone}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <MessageCircle className="w-4 h-4 text-[#25D366] shrink-0 mt-0.5" />
                <div>
                  <span className="block text-slate-200 font-semibold">WhatsApp হেল্পলাইন</span>
                  <a 
                    href={`https://wa.me/${schoolSettings.whatsapp.replace(/[^0-9]/g, '')}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="hover:text-emerald-400 transition-colors font-mono"
                  >
                    {schoolSettings.whatsapp.startsWith('+') ? schoolSettings.whatsapp : `+${schoolSettings.whatsapp}`}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-slate-200 font-semibold">{lang === 'bn' ? 'অফিসিয়াল ইমেইল' : 'Email'}</span>
                  <a href={`mailto:${schoolSettings.email}`} className="hover:text-emerald-400 transition-colors truncate block">
                    {schoolSettings.email}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-slate-200 font-semibold">{lang === 'bn' ? 'ঠিকানা ও অবস্থান' : 'Address'}</span>
                  <span className="leading-relaxed block">
                    {lang === 'bn' ? schoolSettings.addressBn : schoolSettings.addressEn}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>
            © {new Date().getFullYear()} <strong>{lang === 'bn' ? schoolSettings.instituteNameBn : schoolSettings.instituteNameEn}</strong>. {lang === 'bn' ? 'পরিচালনায়' : 'Directed by'} <strong>{lang === 'bn' ? (schoolSettings.founderNameBn || 'মো. তৌহিদুল হক তুহিন') : (schoolSettings.founderNameEn || 'MD Touhidul Hoque Tuhin')}</strong>. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>{lang === 'bn' ? schoolSettings.taglineBn : schoolSettings.taglineEn}</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline ml-1" />
          </div>
        </div>
      </div>
    </footer>
  );
};
