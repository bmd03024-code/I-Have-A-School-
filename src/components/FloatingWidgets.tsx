import React from 'react';
import { BookA, Calculator as CalcIcon } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const FloatingWidgets: React.FC = () => {
  const { lang, isCalcOpen, setIsCalcOpen, isFloatingDictOpen, setIsFloatingDictOpen } = useApp();

  return (
    <>
      {/* Floating Scientific Calculator Trigger Button */}
      {!isCalcOpen && (
        <div className="fixed bottom-22 right-6 z-40 flex items-center group">
          <span className="hidden sm:block absolute right-16 bg-slate-900 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            {lang === 'bn' ? 'সায়েন্টিফিক ক্যালকুলেটর' : 'Scientific Calculator'}
          </span>
          <button
            onClick={() => setIsCalcOpen(true)}
            className="w-12 h-12 rounded-full bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-800 hover:from-slate-800 hover:to-indigo-900 text-white shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 border border-slate-700/60"
            title={lang === 'bn' ? 'ভাসমান সায়েন্টিফিক ক্যালকুলেটর' : 'Floating Scientific Calculator'}
          >
            <CalcIcon className="w-5 h-5 text-indigo-400 group-hover:text-white transition-colors" />
          </button>
        </div>
      )}

      {/* Floating Oxford Dictionary Trigger Button */}
      {!isFloatingDictOpen && (
        <div className="fixed bottom-36 right-6 z-40 flex items-center group">
          <span className="hidden sm:block absolute right-16 bg-slate-900 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            {lang === 'bn' ? 'ভাসমান অক্সফোর্ড ডিকশনারি (১০ লাখ শব্দ)' : 'Floating Oxford Dictionary (1M)'}
          </span>
          <button
            onClick={() => setIsFloatingDictOpen(true)}
            className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-600 via-emerald-700 to-teal-800 hover:from-amber-500 hover:to-emerald-600 text-white shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 border border-amber-300/30"
            title={lang === 'bn' ? 'ভাসমান ডিকশনারি' : 'Floating Dictionary'}
          >
            <BookA className="w-5 h-5 text-amber-200 group-hover:text-white transition-colors" />
          </button>
        </div>
      )}
    </>
  );
};
