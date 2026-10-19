import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  BookOpen, 
  Video, 
  FileText, 
  CheckCircle, 
  Star, 
  Play, 
  Award, 
  Download,
  ChevronRight,
  MessageCircle,
  BookA,
  Printer
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { HeroSlider } from '../components/HeroSlider';
import { VideoPlayerModal } from '../components/VideoPlayerModal';
import { NotePreviewModal } from '../components/NotePreviewModal';
import { VideoClass, NoteResource, Course, Teacher } from '../types';

export const Home: React.FC = () => {
  const { 
    lang, 
    courses, 
    videoClasses, 
    notes, 
    openEnrollmentModal, 
    isEnrolled,
    schoolSettings,
    teachers 
  } = useApp();

  const [selectedVideo, setSelectedVideo] = useState<VideoClass | null>(null);
  const [selectedNote, setSelectedNote] = useState<NoteResource | null>(null);
  
  // Daily Grammar Challenge Mini-Quiz state
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const dailyQuiz = {
    questionEn: 'Choose the correct preposition: "He has been absent _______ school since last Monday."',
    questionBn: 'সঠিক প্রিপজিশনটি নির্বাচন করুন: "He has been absent _______ school since last Monday."',
    options: ['at', 'from', 'in', 'to'],
    correctIndex: 1,
    explanationEn: 'The adjective "absent" requires the preposition "from" (absent from school/work).',
    explanationBn: '"absent"-এর পর এপ্রোপ্রিয়েট প্রিপজিশন হিসেবে "from" বসে (যেমন: absent from school)।'
  };

  const handleQuizSubmit = (index: number) => {
    setQuizAnswer(index);
    setQuizSubmitted(true);
  };

  const headTeacher = teachers.find((t: Teacher) => t.isHeadmaster) || teachers[0];

  return (
    <div className="space-y-16 pb-16">
      {/* 1. Dynamic Hero Slider (3 Slides with auto-play and WhatsApp Admission) */}
      <HeroSlider />

      {/* Feature Highlights Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/courses"
            className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4 hover:border-emerald-300 smooth-card group"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">
                {lang === 'bn' ? 'কোয়ালিটি কোর্স' : 'Quality Courses'}
              </h4>
              <p className="text-xs text-slate-500">
                {lang === 'bn' ? 'লাইভ ক্লাস ও হ্যান্ডনোটস' : 'Live batches & study guides'}
              </p>
            </div>
          </Link>

          <Link
            to="/classes"
            className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4 hover:border-emerald-300 smooth-card group"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Video className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">
                {lang === 'bn' ? 'ফ্রি ভিডিও লেকচার' : 'Free Video Classes'}
              </h4>
              <p className="text-xs text-slate-500">
                {lang === 'bn' ? 'তুহিন স্যারের ব্যাকরণ ক্লাস' : 'Grammar hacks by Tuhin Sir'}
              </p>
            </div>
          </Link>

          <Link
            to="/results"
            className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4 hover:border-emerald-300 smooth-card group"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">
                {lang === 'bn' ? 'মার্কশিট ও ফলাফল' : 'Official Marksheet'}
              </h4>
              <p className="text-xs text-slate-500">
                {lang === 'bn' ? 'স্বাক্ষর ও সিলযুক্ত প্রিন্ট' : 'Verified Academic Transcript'}
              </p>
            </div>
          </Link>

          <Link
            to="/dictionary"
            className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4 hover:border-emerald-300 smooth-card group"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <BookA className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">
                {lang === 'bn' ? '১০ লাখ শব্দের ডিকশনারি' : '1M Words Dictionary'}
              </h4>
              <p className="text-xs text-slate-500">
                {lang === 'bn' ? 'অক্সফোর্ড এপিআই সাপোর্ট' : 'Oxford Lexicon blocks'}
              </p>
            </div>
          </Link>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-emerald-600 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'বিশেষ একাডেমিক কোর্সসমূহ' : 'Curated Academic Batches'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {lang === 'bn' ? 'তুহিন স্যারের পরিচালিত কোর্সসমূহ' : 'Quality Courses by MD Touhidul Hoque Tuhin'}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {lang === 'bn' 
                ? 'বোর্ড পরীক্ষা ও স্পোকেন ইংলিশে শতভাগ সফলতার জন্য সাজানো কারিকুলাম।' 
                : 'Master English with structured curriculums and direct mentorship.'}
            </p>
          </div>
          <Link
            to="/courses"
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 group shrink-0"
          >
            <span>{lang === 'bn' ? `সকল কোর্স দেখুন (${courses.length})` : `View All Courses (${courses.length})`}</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course: Course) => {
            const enrolled = isEnrolled(course.id);
            const courseTitle = lang === 'bn' ? course.titleBn : course.titleEn;
            const courseSub = lang === 'bn' ? course.subtitleBn : course.subtitleEn;
            const courseDur = lang === 'bn' ? course.durationBn : course.durationEn;

            return (
              <div
                key={course.id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:border-emerald-300 smooth-card flex flex-col justify-between group"
              >
                <div>
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={course.bannerImage}
                      alt={courseTitle}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-lg">
                      {course.category}
                    </span>
                    {course.isFeatured && (
                      <span className="absolute top-3 right-3 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                        TOP RATED
                      </span>
                    )}
                  </div>

                  <div className="p-6 space-y-3">
                    <h3 className="font-bold text-base text-slate-900 line-clamp-2 leading-snug group-hover:text-emerald-600 transition-colors">
                      {courseTitle}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {courseSub}
                    </p>

                    <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
                      <span>{courseDur}</span>
                      <span>{course.lecturesCount} {lang === 'bn' ? 'ক্লাস' : 'Lectures'}</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-xs text-slate-400 line-through mr-1.5">৳{course.originalPrice}</span>
                    <span className="text-xl font-black text-slate-900">৳{course.price}</span>
                  </div>

                  <div className="flex gap-1.5">
                    <a
                      href={`https://wa.me/${schoolSettings.whatsapp}?text=${encodeURIComponent(
                        lang === 'bn'
                          ? `আসসালামু আলাইকুম তুহিন স্যার, আমি "${courseTitle}" কোর্সে ভর্তি হতে চাই।`
                          : `Hello Tuhin Sir, I want to enroll in "${courseTitle}".`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 transition-colors"
                      title="WhatsApp Admission"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => openEnrollmentModal(course)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors shadow-xs"
                    >
                      {enrolled ? (lang === 'bn' ? 'ভর্তি সম্পন্ন ✓' : 'Enrolled ✓') : (lang === 'bn' ? 'ভর্তি ফরম' : 'Enroll Now')}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Free Video Classes Showcase */}
      <section className="bg-slate-100/70 py-12 px-4 sm:px-6 lg:px-8 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                {lang === 'bn' ? '১০০% ফ্রি ক্লাস' : '100% Free Lectures'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {lang === 'bn' ? 'তুহিন স্যারের ফ্রি ভিডিও লেকচারসমূহ' : 'Free Video Classes by Tuhin Sir'}
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                {lang === 'bn' 
                  ? 'বোর্ড প্রশ্নের ট্রিকস ও স্পোকেন ড্রিল সরাসরি ভিডিওতে দেখে সহজে শিখুন।' 
                  : 'Watch high-yield English grammar and spoken video lessons.'}
              </p>
            </div>
            <Link
              to="/classes"
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 group"
            >
              <span>{lang === 'bn' ? 'সকল ভিডিও ক্লাস দেখুন' : 'Explore All Video Classes'}</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {videoClasses.slice(0, 2).map((video: VideoClass) => (
              <div
                key={video.id}
                onClick={() => setSelectedVideo(video)}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:border-emerald-300 smooth-card cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-video overflow-hidden bg-slate-900">
                    <img
                      src={video.thumbnailUrl}
                      alt={lang === 'bn' ? video.titleBn : video.titleEn}
                      className="w-full h-full object-cover opacity-90"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                      <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg">
                        <Play className="w-5 h-5 fill-white ml-0.5" />
                      </div>
                    </div>
                    <span className="absolute bottom-2 right-2 bg-slate-900/90 text-white font-mono text-[10px] px-2 py-0.5 rounded">
                      {video.duration}
                    </span>
                  </div>

                  <div className="p-5 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span className="bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded">
                        {video.category}
                      </span>
                      <span>{video.views} views</span>
                    </div>

                    <h3 className="font-bold text-sm text-slate-900 leading-snug line-clamp-2 group-hover:text-emerald-600 transition-colors">
                      {lang === 'bn' ? video.titleBn : video.titleEn}
                    </h3>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-1 flex items-center justify-between text-xs text-slate-400 border-t border-slate-50">
                  <span>{lang === 'bn' ? 'প্রভাষক: তৌহিদুল হক তুহিন' : 'Instructor: Tuhin Sir'}</span>
                  <span className="text-emerald-600 font-bold group-hover:underline">
                    {lang === 'bn' ? 'ক্লাস শুরু করুন →' : 'Watch Class →'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Two Column: Daily Grammar Quiz & Downloadable Notes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Daily Grammar Quiz Card */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-700 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-sm text-white">
                {lang === 'bn' ? 'আজকের গ্রামার কুইজ চ্যালেঞ্জ' : 'Daily Grammar Quiz Challenge'}
              </h3>
            </div>
            <span className="text-[10px] bg-amber-400/20 text-amber-300 font-bold px-2 py-0.5 rounded">
              TODAY'S RULE
            </span>
          </div>

          <p className="text-xs text-slate-300">
            {lang === 'bn' ? '৩০ সেকেন্ডে যাচাই করুন আপনার ইংরেজি ব্যাকরণ জ্ঞান:' : 'Test your grammatical instinct in 30 seconds with Tuhin Sir:'}
          </p>

          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm font-semibold text-emerald-200 leading-relaxed">
            "{lang === 'bn' ? dailyQuiz.questionBn : dailyQuiz.questionEn}"
          </div>

          <div className="space-y-2">
            {dailyQuiz.options.map((opt, idx) => {
              const isSelected = quizAnswer === idx;
              const isCorrect = idx === dailyQuiz.correctIndex;

              let btnClass = "bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-200";
              if (quizSubmitted) {
                if (isCorrect) {
                  btnClass = "bg-emerald-600 border-emerald-500 text-white";
                } else if (isSelected) {
                  btnClass = "bg-rose-600 border-rose-500 text-white";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => !quizSubmitted && handleQuizSubmit(idx)}
                  disabled={quizSubmitted}
                  className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition-all flex items-center justify-between ${btnClass}`}
                >
                  <span>{String.fromCharCode(65 + idx)}. {opt}</span>
                  {quizSubmitted && isCorrect && <CheckCircle className="w-4 h-4 text-white" />}
                </button>
              );
            })}
          </div>

          {quizSubmitted && (
            <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-xs text-emerald-200 space-y-1">
              <span className="font-bold block">
                {lang === 'bn' ? 'তুহিন স্যারের ব্যাকরণগত ব্যাখ্যা:' : "Tuhin Sir's Explanation:"}
              </span>
              <p>{lang === 'bn' ? dailyQuiz.explanationBn : dailyQuiz.explanationEn}</p>
            </div>
          )}

          <div className="pt-2 text-center">
            <Link
              to="/model-tests"
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold underline"
            >
              {lang === 'bn' ? '১০ নম্বরের পূর্ণাঙ্গ অনলাইন টেস্ট দিন →' : 'Take Full 10-Mark Model Test with Timer →'}
            </Link>
          </div>
        </div>

        {/* Free PDF Notes Download */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                {lang === 'bn' ? 'ফ্রি পিডিএফ লাইব্রেরি' : 'Free Downloadable Materials'}
              </span>
              <h3 className="font-bold text-lg text-slate-900">
                {lang === 'bn' ? 'হস্তলিখিত লেকচার নোটস ও শিট' : 'Handwritten Lecture Notes & Cheat Sheets'}
              </h3>
            </div>
            <Link to="/notes" className="text-xs font-semibold text-emerald-600 hover:underline">
              {lang === 'bn' ? 'সকল নোটস →' : 'See All →'}
            </Link>
          </div>

          <div className="space-y-3">
            {notes.slice(0, 3).map((note: NoteResource) => (
              <div
                key={note.id}
                className="p-3.5 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:bg-slate-50/50 transition-all flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">
                      {lang === 'bn' ? note.titleBn : note.titleEn}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      {note.subject} • {note.pages} {lang === 'bn' ? 'পৃষ্ঠা' : 'pages'} • {note.fileSize}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setSelectedNote(note)}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" /> PDF
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-xs text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span>
              {lang === 'bn' ? 'এইচএসসি ২০২৬ বা বিসিএস স্পেশাল সাজেশন প্রয়োজন?' : 'Need exam suggestions for HSC 2026 or BCS?'}
            </span>
            <Link
              to="/suggestions"
              className="font-bold text-emerald-700 hover:underline shrink-0"
            >
              {lang === 'bn' ? 'সাজেশন দেখুন →' : 'Browse Suggestions →'}
            </Link>
          </div>
        </div>
      </section>

      {/* Headmaster Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center border border-emerald-900/40">
          <div className="md:col-span-4 text-center md:text-left">
            <img
              src={headTeacher.photoUrl}
              alt={headTeacher.nameEn}
              className="w-44 h-44 sm:w-52 sm:h-52 rounded-3xl object-cover mx-auto md:mx-0 border-4 border-emerald-400 shadow-2xl"
            />
          </div>
          <div className="md:col-span-8 space-y-4">
            <div className="inline-block bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30">
              {lang === 'bn' ? 'প্রতিষ্ঠাতা ও প্রধান শিক্ষক' : 'FOUNDER & HEADMASTER'}
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              {lang === 'bn' ? headTeacher.nameBn : headTeacher.nameEn}
            </h2>
            <p className="text-emerald-300 text-sm font-semibold">
              {lang === 'bn' ? headTeacher.designationBn : headTeacher.designationEn} • {headTeacher.qualification}
            </p>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-serif italic border-l-2 border-emerald-400 pl-4 py-0.5">
              "{lang === 'bn' ? 'শিক্ষা কোনো অন্ধ মুখস্থবিদ্যা নয়; এটি হলো নির্ভুলভাবে নিজের ভাবনা প্রকাশের আত্মবিশ্বাস অর্জন করা।' : 'Education is not about rote learning; it is about building the confidence to express your thoughts with precision and clarity.'}"
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                to="/teachers"
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors"
              >
                {lang === 'bn' ? 'সকল শিক্ষক পরিচিতি' : 'View Faculty Directory'}
              </Link>
              <a
                href={`https://wa.me/${schoolSettings.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-300" />
                <span>{lang === 'bn' ? 'তুহিন স্যারের সাথে সরাসরি হোয়াটসঅ্যাপ' : 'WhatsApp Tuhin Sir'}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Modals */}
      <VideoPlayerModal
        video={selectedVideo}
        onClose={() => setSelectedVideo(null)}
      />
      <NotePreviewModal
        note={selectedNote}
        onClose={() => setSelectedNote(null)}
      />
    </div>
  );
};
