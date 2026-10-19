import React from 'react';
import { BookA, Calculator as CalcIcon, Bot, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const FloatingWidgets: React.FC = () => {
  const {
    lang,
    isCalcOpen,
    setIsCalcOpen,
    isFloatingDictOpen,
    setIsFloatingDictOpen,
    isChatbotOpen,
    setIsChatbotOpen
  } = useApp();

  return (
    <aside
      aria-label={lang === 'bn' ? 'ভাসমান টুলস ও সেবা' : 'Floating Tools and Services'}
      className="!fixed bottom-4 sm:bottom-6 right-3 sm:right-6 z-[9990] flex flex-col items-end gap-2.5 sm:gap-3 pointer-events-auto select-none"
    >
      {/* 1. Floating Oxford Dictionary (১০ লাখ শব্দ) */}
      <div className="relative flex items-center group">
        <span className="hidden sm:inline-flex items-center gap-1.5 absolute right-14 bg-slate-900/95 backdrop-blur-md text-white text-[11px] font-semibold px-3 py-1.5 rounded-xl shadow-2xl border border-slate-700/80 whitespace-nowrap opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity pointer-events-none">
          <BookA className="w-3.5 h-3.5 text-amber-300" />
          <span>{lang === 'bn' ? 'অক্সফোর্ড ডিকশনারি (১০ লাখ শব্দ)' : 'Oxford Dictionary (1M Words)'}</span>
        </span>
        <button
          type="button"
          onClick={() => setIsFloatingDictOpen(!isFloatingDictOpen)}
          className={`relative w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-amber-600 via-emerald-700 to-teal-800 hover:from-amber-500 hover:to-emerald-600 text-white shadow-xl shadow-emerald-950/30 flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 border border-amber-300/40 focus:outline-none focus:ring-2 focus:ring-amber-400 ${
            isFloatingDictOpen ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-slate-900' : ''
          }`}
          title={lang === 'bn' ? 'ভাসমান ডিকশনারি (১০ লাখ শব্দ)' : 'Floating Dictionary (1M Words)'}
          aria-label={lang === 'bn' ? 'ভাসমান ডিকশনারি খুলুন' : 'Open Floating Dictionary'}
        >
          <BookA className="w-5 h-5 text-amber-200" />
          {/* Badge */}
          <span className="absolute -top-1 -left-1 bg-amber-500 text-slate-950 text-[9px] font-black px-1.5 py-0.2 rounded-full shadow-md uppercase tracking-tight border border-amber-200">
            ১০L
          </span>
        </button>
      </div>

      {/* 2. Floating Scientific Calculator (ক্যালকুলেটর ও জিপিএ) */}
      <div className="relative flex items-center group">
        <span className="hidden sm:inline-flex items-center gap-1.5 absolute right-14 bg-slate-900/95 backdrop-blur-md text-white text-[11px] font-semibold px-3 py-1.5 rounded-xl shadow-2xl border border-slate-700/80 whitespace-nowrap opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity pointer-events-none">
          <CalcIcon className="w-3.5 h-3.5 text-indigo-400" />
          <span>{lang === 'bn' ? 'সায়েন্টিফিক ক্যালকুলেটর ও জিপিএ' : 'Scientific Calculator & GPA'}</span>
        </span>
        <button
          type="button"
          onClick={() => setIsCalcOpen(!isCalcOpen)}
          className={`relative w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-800 hover:from-slate-800 hover:to-indigo-900 text-white shadow-xl shadow-indigo-950/40 flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 border border-indigo-400/40 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
            isCalcOpen ? 'ring-2 ring-indigo-400 ring-offset-2 ring-offset-slate-900' : ''
          }`}
          title={lang === 'bn' ? 'ভাসমান সায়েন্টিফিক ক্যালকুলেটর' : 'Floating Scientific Calculator'}
          aria-label={lang === 'bn' ? 'ভাসমান সায়েন্টিফিক ক্যালকুলেটর খুলুন' : 'Open Floating Calculator'}
        >
          <CalcIcon className="w-5 h-5 text-indigo-300" />
          {/* Badge */}
          <span className="absolute -top-1 -left-1 bg-indigo-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full shadow-md uppercase tracking-tight border border-indigo-300/40">
            Fx
          </span>
        </button>
      </div>

      {/* 3. Floating AI Educational Chatbot (এআই শিক্ষক) */}
      <div className="relative flex items-center group">
        <span className="hidden sm:inline-flex items-center gap-1.5 absolute right-16 bg-slate-900/95 backdrop-blur-md text-white text-[11px] font-semibold px-3 py-1.5 rounded-xl shadow-2xl border border-slate-700/80 whitespace-nowrap opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity pointer-events-none">
          <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
          <span>{lang === 'bn' ? 'তুহিন স্যার এআই স্টাডি চ্যাটবট' : 'Tuhin Sir AI Study Assistant'}</span>
        </span>
        <button
          type="button"
          onClick={() => setIsChatbotOpen(!isChatbotOpen)}
          className={`relative h-12 px-3 sm:px-4 rounded-full bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white shadow-2xl shadow-emerald-900/40 flex items-center gap-2 transition-all duration-200 hover:scale-105 active:scale-95 border border-emerald-300/40 focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
            isChatbotOpen ? 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-slate-900' : ''
          }`}
          title={lang === 'bn' ? 'ভাসমান এআই শিক্ষক চ্যাটবট' : 'Floating AI Teacher Chatbot'}
          aria-label={lang === 'bn' ? 'ভাসমান এআই চ্যাটবট খুলুন' : 'Open Floating AI Chatbot'}
        >
          <div className="relative flex items-center justify-center">
            <Bot className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-300 rounded-full pointer-events-none" />
          </div>
          <span className="text-xs font-bold whitespace-nowrap hidden sm:inline">
            {lang === 'bn' ? 'এআই শিক্ষক' : 'AI Assistant'}
          </span>
          <span className="text-[10px] font-black sm:hidden bg-white/20 px-1 py-0.5 rounded-md">
            AI
          </span>
        </button>
      </div>
    </aside>
  );
};
