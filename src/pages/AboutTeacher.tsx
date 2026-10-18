import React, { useState } from 'react';
import { TEACHER_PROFILE } from '../data/mockData';
import { GraduationCap, Award, Phone, Mail, MapPin, Send, CheckCircle2, Sparkles, Youtube, Facebook } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AboutTeacher: React.FC = () => {
  const { showToast, lang, schoolSettings } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) return;
    setSubmitted(true);
    showToast(lang === 'bn' ? 'আপনার বার্তা তুহিন স্যারের কাছে পাঠানো হয়েছে!' : 'Your message has been sent to Tuhin Sir!');
  };

  const teacherName = lang === 'bn' ? TEACHER_PROFILE.nameBn : TEACHER_PROFILE.nameEn;
  const teacherDesignation = lang === 'bn' ? TEACHER_PROFILE.designationBn : TEACHER_PROFILE.designationEn;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Hero Profile */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center border border-slate-800">
        <div className="md:col-span-5 text-center md:text-left">
          <div className="relative inline-block">
            <img
              src={TEACHER_PROFILE.photoUrl}
              alt={teacherName}
              className="w-56 h-56 sm:w-64 sm:h-64 rounded-3xl object-cover border-4 border-emerald-400 shadow-2xl"
            />
            <div className="absolute -bottom-3 -right-3 bg-emerald-600 text-white font-bold text-xs px-3 py-1.5 rounded-xl shadow-md">
              Founder & Lead Mentor
            </div>
          </div>
        </div>

        <div className="md:col-span-7 space-y-4">
          <div className="inline-block bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30">
            {lang === 'bn' ? 'শিক্ষক পরিচিতি' : 'MEET YOUR INSTRUCTOR'}
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            {teacherName}
          </h1>
          <p className="text-emerald-400 font-semibold text-sm">
            {teacherDesignation} • {TEACHER_PROFILE.qualification}
          </p>

          <blockquote className="p-4 rounded-2xl bg-white/5 border-l-4 border-emerald-400 text-sm italic font-serif text-slate-200">
            {lang === 'bn' 
              ? 'ইংরেজি শেখা কোনো মুখস্থ বিদ্যার বিষয় নয়, এটি চিন্তা ও আত্মবিশ্বাস প্রকাশের একটি ভাষা।'
              : 'Education is not about rote learning; it is about building the confidence to express your thoughts with precision and clarity.'}
          </blockquote>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {lang === 'bn'
              ? 'এমডি তৌহিদুল হক তুহিন এক দশকেরও বেশি সময় ধরে হাজার হাজার শিক্ষার্থীকে ইংরেজি ব্যাকরণ, স্পোকেন ইংলিশ ও বোর্ড পরীক্ষার প্রস্তুতিতে সফলভাবে দিকনির্দেশনা দিয়ে আসছেন।'
              : 'MD Touhidul Hoque Tuhin has guided thousands of students to academic excellence in SSC, HSC and competitive exams through simple, logical rules and communicative drills.'}
          </p>

          <div className="pt-2 flex items-center gap-3">
            <a
              href={schoolSettings.facebookUrl || 'https://facebook.com'}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 transition-colors shadow-xs"
            >
              <Facebook className="w-4 h-4" /> Facebook Page
            </a>
            <a
              href={schoolSettings.youtubeUrl || 'https://youtube.com'}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-2 transition-colors shadow-xs"
            >
              <Youtube className="w-4 h-4" /> YouTube Classes
            </a>
          </div>
        </div>
      </div>

      {/* Philosophy & Mission of "I Have A School" */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-slate-900">Demystifying Grammar</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Instead of forcing students to memorize hundreds of confusing exceptions, Tuhin Sir teaches through logical sentence architecture and intuitive visual maps.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-slate-900">Spoken English Confidence</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Helping students from Bengali backgrounds break the hesitation barrier through daily conversational drill formulas and interactive speech practices.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-slate-900">Board Exam Mastery</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Year after year, Tuhin Sir's HSC, SSC, and BCS suggestions accurately reflect recurring exam questions, providing students with unmatched confidence.
          </p>
        </div>
      </div>

      {/* Ask Sir a Question / Contact Form */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-5 space-y-4">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
            {lang === 'bn' ? 'সরাসরি প্রশ্ন' : 'Direct Student Inquiry'}
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900">
            {lang === 'bn' ? 'তুহিন স্যারকে প্রশ্ন করুন' : 'Ask Tuhin Sir a Question'}
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            {lang === 'bn'
              ? 'ইংরেজি নিয়ম নিয়ে কোনো বিভ্রান্তি বা কোনো কোর্সে ভর্তি হওয়ার পরামর্শ প্রয়োজন হলে সরাসরি বার্তা পাঠান।'
              : "Have a doubt about an English rule, or want advice on which batch to enroll in? Send your message directly to Tuhin Sir's desk."}
          </p>

          <div className="space-y-3 pt-3 text-xs text-slate-600">
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{TEACHER_PROFILE.phone} (WhatsApp)</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{TEACHER_PROFILE.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Dhaka, Bangladesh</span>
            </div>
          </div>
        </div>

        <div className="md:col-span-7">
          {submitted ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h4 className="text-base font-bold text-emerald-950">
                {lang === 'bn' ? 'বার্তা সফলভাবে পাঠানো হয়েছে!' : 'Message Sent!'}
              </h4>
              <p className="text-xs text-emerald-800">
                {lang === 'bn'
                  ? `ধন্যবাদ ${name}। স্যার এবং আমাদের টিম দ্রুত আপনার সাথে যোগাযোগ করবে।`
                  : `Thank you for reaching out, ${name}. Tuhin Sir and our academic support team will review your message shortly.`}
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs font-bold text-emerald-700 underline"
              >
                {lang === 'bn' ? 'আরেকটি বার্তা পাঠান' : 'Send Another Message'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    {lang === 'bn' ? 'আপনার নাম *' : 'Your Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Shakil"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    {lang === 'bn' ? 'ফোন বা ইমেইল' : 'Your Email or Phone'}
                  </label>
                  <input
                    type="text"
                    placeholder="017... or email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  {lang === 'bn' ? 'বিষয় / ক্যাটাগরি' : 'Subject / Question Category'}
                </label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none"
                >
                  <option value="HSC English 2026 Batch">HSC English 2026 Batch Inquiry</option>
                  <option value="Spoken English Batch">Spoken English Batch Inquiry</option>
                  <option value="Grammar Rule Doubt">Grammar Rule Clarification</option>
                  <option value="BCS / Job Preparation">BCS / Job Preparation Advice</option>
                  <option value="General Question">General Feedback</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  {lang === 'bn' ? 'আপনার বার্তা / প্রশ্ন *' : 'Your Message or Doubt *'}
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder={lang === 'bn' ? 'আপনার প্রশ্নটি বিস্তারিত লিখুন...' : 'Explain your query clearly...'}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <Send className="w-3.5 h-3.5" /> {lang === 'bn' ? 'তুহিন স্যারকে পাঠান' : 'Submit to Tuhin Sir'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
