import React, { useState } from 'react';
import { CheckCircle2, Clock, BookOpen, User, ChevronDown, ChevronUp, ShieldCheck, MessageCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Course } from '../types';

export const Courses: React.FC = () => {
  const { courses, openEnrollmentModal, isEnrolled, lang, schoolSettings } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedSyllabusCourseId, setExpandedSyllabusCourseId] = useState<string | null>(null);

  const categories = ['All', 'Grammar Foundation', 'Spoken English', 'HSC & SSC', 'BCS & Job Prep'];

  const filteredCourses = selectedCategory === 'All'
    ? courses
    : courses.filter((c: Course) => c.category === selectedCategory);

  const toggleSyllabus = (courseId: string) => {
    setExpandedSyllabusCourseId((prev) => (prev === courseId ? null : courseId));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Page Title */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
          {lang === 'bn' ? 'তুহিন স্যারের প্রিমিয়ার কোর্সসমূহ' : 'Premier Academic Courses'}
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {lang === 'bn' ? 'মানসম্মত কোর্সসমূহ - আই হ্যাভ এ স্কুল' : 'Quality Courses by MD Touhidul Hoque Tuhin'}
        </h1>
        <p className="text-sm text-slate-500 leading-relaxed">
          {lang === 'bn'
            ? 'লাইভ ক্লাস, প্রাকটিক্যাল শিট, বোর্ড স্ট্যান্ডার্ড মডেল টেস্ট ও সরাসরি দিকনির্দেশনার মাধ্যমে আপনার পড়ালেখা এগিয়ে নিন।'
            : 'Structured live batches, curated lecture sheets, personal mentoring, and model tests designed to guarantee academic excellence.'}
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === cat
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Courses List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredCourses.map((course: Course) => {
          const enrolled = isEnrolled(course.id);
          const isSyllabusOpen = expandedSyllabusCourseId === course.id;
          const title = lang === 'bn' ? course.titleBn : course.titleEn;
          const description = lang === 'bn' ? course.descriptionBn : course.descriptionEn;
          const duration = lang === 'bn' ? course.durationBn : course.durationEn;
          const features = lang === 'bn' ? course.featuresBn : course.featuresEn;

          const whatsappMessage = encodeURIComponent(
            lang === 'bn'
              ? `আসসালামু আলাইকুম তুহিন স্যার, আমি আপনার "${title}" কোর্সে ভর্তি হতে চাই। ফি: ৳${course.price}। ভর্তির প্রক্রিয়া জানিয়ে বাধিত করবেন।`
              : `Hello Tuhin Sir, I would like to enroll in the "${title}" course (Fee: ৳${course.price}). Please guide me through admission.`
          );

          return (
            <div
              key={course.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:border-emerald-300 smooth-card flex flex-col justify-between"
            >
              <div>
                {/* Banner & Badges */}
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={course.bannerImage}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg">
                      {course.category}
                    </span>
                    <span className="bg-slate-900/80 text-white text-[11px] font-medium px-2 py-1 rounded-lg">
                      {course.level}
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h2 className="text-xl font-bold leading-tight drop-shadow-sm">
                      {title}
                    </h2>
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 space-y-5">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {description}
                  </p>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-2 gap-3 text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-emerald-600" />
                      <span>{duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-emerald-600" />
                      <span>{course.lecturesCount} {lang === 'bn' ? 'টি লাইভ ক্লাস' : 'Live Classes'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-emerald-600" />
                      <span>{lang === 'bn' ? 'তুহিন স্যারের সরাসরি গাইডেন্স' : 'Tuhin Sir Mentorship'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>{lang === 'bn' ? 'আজীবন ক্লাস অ্যাক্সেস' : 'Lifetime Class Access'}</span>
                    </div>
                  </div>

                  {/* Key Features */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      {lang === 'bn' ? 'কোর্সের অন্তর্ভুক্ত সুবিধাসমূহ:' : 'Course Inclusions:'}
                    </h4>
                    <div className="space-y-1.5">
                      {features?.map((feat: string, i: number) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Toggle Syllabus */}
                  <div className="pt-2">
                    <button
                      onClick={() => toggleSyllabus(course.id)}
                      className="w-full text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100 flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span>
                        {isSyllabusOpen 
                          ? (lang === 'bn' ? 'সিলেবাস বন্ধ করুন' : 'Hide Syllabus Breakdown') 
                          : (lang === 'bn' ? 'বিস্তারিত সিলেবাস দেখুন' : 'View Detailed Syllabus')}
                      </span>
                      {isSyllabusOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    {isSyllabusOpen && (
                      <div className="mt-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-3">
                        <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                          {lang === 'bn' ? 'সাপ্তাহিক রুটিন ও বিষয়সমূহ' : 'Curriculum Outline'}
                        </h5>
                        <div className="space-y-3">
                          {course.syllabus?.map((s: { week: string; topics: string[] }, idx: number) => (
                            <div key={idx} className="border-b border-slate-200/60 pb-2 last:border-0 last:pb-0">
                              <span className="font-bold text-emerald-700 block">{s.week}</span>
                              <ul className="list-disc list-inside text-slate-600 mt-1 space-y-0.5">
                                {s.topics.map((t: string, ti: number) => (
                                  <li key={ti}>{t}</li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Price & Action */}
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-slate-400 line-through mr-2">৳{course.originalPrice}</span>
                  <span className="text-2xl font-black text-slate-900">৳{course.price}</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded ml-2">
                    {lang === 'bn' ? 'বিশেষ ছাড়' : 'Special Offer'}
                  </span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <a
                    href={`https://wa.me/${schoolSettings.whatsapp}?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 sm:flex-none px-4 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-200" />
                    <span>WhatsApp</span>
                  </a>

                  <button
                    onClick={() => openEnrollmentModal(course)}
                    className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all"
                  >
                    {enrolled 
                      ? (lang === 'bn' ? 'ভর্তি হওয়া শেষ' : 'Enrolled') 
                      : (lang === 'bn' ? 'ভর্তি ফরম পূরণ' : 'Enroll in Course')}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
