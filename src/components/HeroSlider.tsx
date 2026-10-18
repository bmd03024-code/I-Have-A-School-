import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, MessageCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { HeroSlide } from '../types';

export const HeroSlider: React.FC = () => {
  const { heroSlides, lang, schoolSettings } = useApp();
  const [currentIdx, setCurrentIdx] = useState(0);

  const activeSlides = heroSlides.filter((s: HeroSlide) => s.active);

  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % activeSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [activeSlides.length]);

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

  return (
    <div className="relative overflow-hidden bg-slate-950 text-white min-h-[440px] sm:min-h-[500px] flex items-center">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={current.imageUrl}
          alt={title}
          className="w-full h-full object-cover opacity-30 scale-105 transition-all duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30" />
      </div>

      {/* Slide Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 w-full">
        <div className="max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold animate-in fade-in duration-300">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>{schoolSettings.taglineBn && lang === 'bn' ? schoolSettings.taglineBn : schoolSettings.taglineEn}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight sm:leading-none tracking-tight animate-in fade-in duration-300">
            {title}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal animate-in fade-in duration-300 max-w-xl">
            {subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to={current.buttonUrl}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-emerald-950/40 transition-all flex items-center gap-2 hover:scale-102"
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
              className="px-5 py-3.5 rounded-xl bg-emerald-700/60 hover:bg-emerald-600/80 text-white font-bold text-xs sm:text-sm border border-emerald-500/50 flex items-center gap-2 transition-all"
            >
              <MessageCircle className="w-4 h-4 text-emerald-300" />
              <span>{lang === 'bn' ? 'হোয়াটসঅ্যাপে সরাসরি ভর্তি' : 'Direct WhatsApp Admission'}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {activeSlides.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-slate-900/70 hover:bg-emerald-600 text-white border border-slate-700 flex items-center justify-center transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-slate-900/70 hover:bg-emerald-600 text-white border border-slate-700 flex items-center justify-center transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Dot Indicators */}
      {activeSlides.length > 1 && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {activeSlides.map((_: HeroSlide, idx: number) => (
            <button
              key={idx}
              onClick={() => setCurrentIdx(idx)}
              className={`h-2 rounded-full transition-all ${
                currentIdx === idx ? 'w-8 bg-emerald-400' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
