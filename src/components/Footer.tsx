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
  BookA
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { lang, schoolSettings, setIsCalcOpen } = useApp();

  return (
    <footer className="bg-slate-950 text-slate-300 pt-14 pb-8 border-t border-slate-800 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-md">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="font-extrabold text-xl text-white tracking-tight">
                  {lang === 'bn' ? schoolSettings.instituteNameBn : schoolSettings.instituteNameEn}
                </span>
                <p className="text-xs text-emerald-400 font-medium">
                  {lang === 'bn' ? schoolSettings.taglineBn : schoolSettings.taglineEn}
                </p>
              </div>
            </Link>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              {lang === 'bn'
                ? 'এমডি তৌহিদুল হক তুহিন স্যারের শিক্ষামূলক প্ল্যাটফর্ম—ইংরেজি ব্যাকরণ সহজীকরণ, অনর্গল স্পোকেন ইংলিশ, বোর্ড পরীক্ষার ১০০% সাজেশন ও কোয়ালিটি কোর্স।'
                : 'Educational mentorship initiative led by MD Touhidul Hoque Tuhin to empower students across Bangladesh with intuitive English mastery.'}
            </p>
            <div className="pt-2 flex items-center gap-3 text-slate-400">
              <a 
                href={schoolSettings.facebookUrl} 
                target="_blank" 
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-colors"
                title="Follow Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href={schoolSettings.youtubeUrl} 
                target="_blank" 
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-red-600 hover:text-white flex items-center justify-center transition-colors"
                title="Subscribe on YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a 
                href={`https://wa.me/${schoolSettings.whatsapp}`} 
                target="_blank" 
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-colors"
                title="WhatsApp Direct"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Learning Links */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4 border-l-2 border-emerald-500 pl-2">
              {lang === 'bn' ? 'লার্নিং হাব' : 'Learning Hub'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/courses" className="hover:text-emerald-400 transition-colors">
                  {lang === 'bn' ? 'কোয়ালিটি কোর্সসমূহ' : 'Quality Courses'}
                </Link>
              </li>
              <li>
                <Link to="/classes" className="hover:text-emerald-400 transition-colors">
                  {lang === 'bn' ? 'ফ্রি ভিডিও ক্লাস' : 'Free Video Classes'}
                </Link>
              </li>
              <li>
                <Link to="/notes" className="hover:text-emerald-400 transition-colors">
                  {lang === 'bn' ? 'লেকচার নোটস ও পিডিএফ' : 'Lecture Notes & PDFs'}
                </Link>
              </li>
              <li>
                <Link to="/suggestions" className="hover:text-emerald-400 transition-colors">
                  {lang === 'bn' ? 'এইচএসসি ও বোর্ড সাজেশন' : 'Exam Suggestions'}
                </Link>
              </li>
              <li>
                <Link to="/model-tests" className="hover:text-emerald-400 transition-colors">
                  {lang === 'bn' ? 'অনলাইন মডেল টেস্ট' : 'Online Model Tests'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Institutional Shortcuts */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4 border-l-2 border-emerald-500 pl-2">
              {lang === 'bn' ? 'প্রয়োজনীয় সার্ভিস' : 'Academic Services'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/results" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 font-semibold text-emerald-400">
                  <Award className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? 'মার্কশিট ও ফলাফল প্রিন্ট' : 'Marksheet & Results'}</span>
                </Link>
              </li>
              <li>
                <Link to="/dictionary" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <BookA className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? '১০ লাখ শব্দের ডিকশনারি' : '1M Words Dictionary'}</span>
                </Link>
              </li>
              <li>
                <button
                  onClick={() => setIsCalcOpen(true)}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 text-left"
                >
                  <CalcIcon className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{lang === 'bn' ? 'স্মার্ট ক্যালকুলেটর' : 'Smart Calculator'}</span>
                </button>
              </li>
              <li>
                <Link to="/teachers" className="hover:text-emerald-400 transition-colors">
                  {lang === 'bn' ? 'শিক্ষক প্যানেল ও আইডি কার্ড' : 'Faculty & ID Cards'}
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 text-slate-400">
                  <Lock className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? 'অ্যাডমিন ড্যাশবোর্ড' : 'Admin Login'}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4 border-l-2 border-emerald-500 pl-2">
              {lang === 'bn' ? 'যোগাযোগ ও সাপোর্ট' : 'Contact & Support'}
            </h4>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-slate-200 font-semibold">{lang === 'bn' ? 'হটলাইন' : 'Hotline'}</span>
                  <span>{schoolSettings.phone}</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-slate-200 font-semibold">WhatsApp</span>
                  <span>+{schoolSettings.whatsapp}</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-slate-200 font-semibold">Email</span>
                  <span className="truncate">{schoolSettings.email}</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-slate-200 font-semibold">{lang === 'bn' ? 'ঠিকানা' : 'Address'}</span>
                  <span>{lang === 'bn' ? schoolSettings.addressBn : schoolSettings.addressEn}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>
            © {new Date().getFullYear()} <strong>{lang === 'bn' ? schoolSettings.instituteNameBn : schoolSettings.instituteNameEn}</strong>. Directed by <strong>MD Touhidul Hoque Tuhin</strong>. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Learn, Grow, Succeed with Tuhin Sir</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline ml-1" />
          </div>
        </div>
      </div>
    </footer>
  );
};
