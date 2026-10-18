import React, { useState } from 'react';
import { Star, CheckCircle, Download, Printer, AlertCircle } from 'lucide-react';
import { SUGGESTIONS } from '../data/mockData';
import { useApp } from '../context/AppContext';
import { Suggestion } from '../types';

export const ExamSuggestions: React.FC = () => {
  const { showToast, lang } = useApp();
  const [selectedExam, setSelectedExam] = useState<string>('All');

  const exams = ['All', 'HSC 2026', 'BCS Preliminary'];

  const filteredSuggestions = selectedExam === 'All'
    ? SUGGESTIONS
    : SUGGESTIONS.filter((s: Suggestion) => s.targetExam === selectedExam);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = (sug: Suggestion) => {
    const title = lang === 'bn' ? sug.titleBn : sug.titleEn;
    const description = lang === 'bn' ? sug.descriptionBn : sug.descriptionEn;

    const text = `======================================================
I HAVE A SCHOOL - by MD Touhidul Hoque Tuhin
EXAM SUGGESTION: ${title}
Target Exam: ${sug.targetExam} | Subject: ${sug.subject}
Priority: ${sug.priority}
======================================================

Description:
${description}

RECOMMENDED HIGH-YIELD TOPICS:
${sug.recommendedTopics.map((t: string, i: number) => `${i + 1}. ${t}`).join('\n')}

CRUCIAL EXAM TIPS & STRATEGIES:
${sug.keyPoints.map((p: string, i: number) => `${i + 1}. ${p}`).join('\n')}

======================================================
Dedicated to student success. Best of luck from Tuhin Sir!
Hotline: +880 1712-345678
======================================================`;

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${sug.targetExam.toLowerCase().replace(/\s+/g, '_')}_suggestion_tuhin_sir.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(lang === 'bn' ? 'সাজেশন শিট ডাউনলোড হয়েছে!' : 'Suggestion sheet downloaded!');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full uppercase tracking-wider border border-amber-200">
          {lang === 'bn' ? 'তুহিন স্যারের স্পেশাল এক্সাম ব্লুপ্রিন্ট' : 'Super Exclusive Exam Blueprint'}
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {lang === 'bn' ? 'পরীক্ষার চূড়ান্ত সাজেশন ২০২৬' : 'Exam Suggestions by Tuhin Sir'}
        </h1>
        <p className="text-sm text-slate-500 leading-relaxed">
          {lang === 'bn'
            ? 'বিগত ১০ বছরের বোর্ড প্রশ্ন বিশ্লেষণ ও নিয়মিত কমন পড়ার নিশ্চয়তায় তৈরি সাজেশন্স।'
            : 'Curated after rigorous analysis of past 10 years board questions, recurring patterns, and curriculum weightage.'}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex justify-center gap-2">
        {exams.map((ex) => (
          <button
            key={ex}
            onClick={() => setSelectedExam(ex)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedExam === ex
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {ex}
          </button>
        ))}
      </div>

      {/* Suggestion Cards */}
      <div className="space-y-6">
        {filteredSuggestions.map((sug: Suggestion) => {
          const title = lang === 'bn' ? sug.titleBn : sug.titleEn;
          const description = lang === 'bn' ? sug.descriptionBn : sug.descriptionEn;

          return (
            <div
              key={sug.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs hover:border-emerald-300 transition-all space-y-6"
            >
              {/* Header info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                      {sug.targetExam}
                    </span>
                    <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                      {sug.priority}
                    </span>
                    <span className="text-xs text-slate-400">{sug.publishedDate}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    {title}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">Subject: {sug.subject}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handlePrint}
                    className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Printer className="w-4 h-4" /> Print
                  </button>
                  <button
                    onClick={() => handleDownload(sug)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Download className="w-4 h-4" /> Download PDF Sheet
                  </button>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {description}
              </p>

              {/* Recommended High-Yield Topics */}
              <div className="space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  {lang === 'bn' ? 'অবশ্যই পাঠ্য গুরুত্বপূর্ণ টপিক ও প্যাসেজ:' : 'Must-Read Priority Items & Passages:'}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-700">
                  {sug.recommendedTopics.map((topic: string, idx: number) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-white border border-slate-200/80 flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-[10px]">
                        {idx + 1}
                      </span>
                      <span className="font-medium leading-relaxed">{topic}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strategic Exam Tips */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-emerald-600" />
                  {lang === 'bn' ? 'পরীক্ষার হলের বিশেষ কৌশল:' : "Tuhin Sir's Exam Hall Strategies:"}
                </h4>
                <div className="space-y-1.5 text-xs text-slate-600">
                  {sug.keyPoints.map((point: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2 bg-emerald-50/50 p-2.5 rounded-lg border-l-3 border-emerald-500">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
