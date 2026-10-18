import React from 'react';
import { Link } from 'react-router-dom';
import { Award, BookOpen, CheckCircle2, Bookmark, ArrowRight, FileText, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NOTES_RESOURCES, EDUCATIONAL_POSTS, MODEL_TESTS } from '../data/mockData';
import { Course, NoteResource, EducationalPost } from '../types';

export const MyLearning: React.FC = () => {
  const { courses, enrolledCourseIds, bookmarks, toggleBookmark, watchedVideoIds, testScores, lang } = useApp();

  const enrolledCourses = courses.filter((c: Course) => enrolledCourseIds.includes(c.id));
  const bookmarkedNotes = NOTES_RESOURCES.filter((n: NoteResource) => bookmarks.includes(n.id));
  const bookmarkedPosts = EDUCATIONAL_POSTS.filter((p: EducationalPost) => bookmarks.includes(p.id));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white rounded-3xl p-8 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
            {lang === 'bn' ? 'শিক্ষার্থী ড্যাশবোর্ড' : 'Student Dashboard'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {lang === 'bn' ? 'আমার ক্লাসরুম ও শিখন কেন্দ্র' : 'My Classroom & Learning Hub'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            {lang === 'bn'
              ? 'আপনার ভর্তিকৃত কোর্স, সেভ করা লেকচার শিট ও পরীক্ষার ফলাফল একনজরে দেখুন।'
              : 'Access your enrolled courses, saved lecture notes, and test records in one place.'}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-center bg-white/10 p-3.5 rounded-2xl min-w-24 border border-white/10">
            <span className="text-2xl font-black text-emerald-300">{enrolledCourses.length}</span>
            <span className="block text-[10px] text-slate-300 font-bold uppercase">{lang === 'bn' ? 'কোর্স' : 'Enrolled'}</span>
          </div>
          <div className="text-center bg-white/10 p-3.5 rounded-2xl min-w-24 border border-white/10">
            <span className="text-2xl font-black text-teal-300">{watchedVideoIds.length}</span>
            <span className="block text-[10px] text-slate-300 font-bold uppercase">{lang === 'bn' ? 'ক্লাস সমাপ্ত' : 'Completed'}</span>
          </div>
        </div>
      </div>

      {/* Enrolled Courses */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-600" /> {lang === 'bn' ? 'আমার সক্রিয় ব্যাচসমূহ' : 'My Enrolled Batches'}
          </h2>
          <Link to="/courses" className="text-xs font-bold text-emerald-600 hover:underline">
            {lang === 'bn' ? 'আরও কোর্স দেখুন →' : 'Explore More Batches →'}
          </Link>
        </div>

        {enrolledCourses.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-700">{lang === 'bn' ? 'এখনো কোনো কোর্সে ভর্তি হননি' : 'No courses enrolled yet'}</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {lang === 'bn'
                ? 'লাইভ ক্লাস ও বিশেষ লেকচার শিট পেতে তুহিন স্যারের যেকোনো একটি কোর্সে এনরোল করুন।'
                : "Enroll in one of Tuhin Sir's high-standard English batches to gain full access to live classes and private materials."}
            </p>
            <Link
              to="/courses"
              className="inline-block px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
            >
              {lang === 'bn' ? 'কোর্সগুলো দেখুন' : 'Browse Courses'}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {enrolledCourses.map((c: Course) => {
              const title = lang === 'bn' ? c.titleBn : c.titleEn;
              const duration = lang === 'bn' ? c.durationBn : c.durationEn;
              return (
                <div
                  key={c.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4"
                >
                  <div className="flex gap-4">
                    <img
                      src={c.bannerImage}
                      alt={title}
                      className="w-24 h-20 rounded-xl object-cover shrink-0"
                    />
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        ACTIVE BATCH
                      </span>
                      <h3 className="font-bold text-sm text-slate-900 line-clamp-1">
                        {title}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {duration} • {c.lecturesCount} Lectures
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-emerald-600 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Enrolled & Verified
                    </span>
                    <Link
                      to="/classes"
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1 shadow-xs"
                    >
                      Open Classroom <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Model Test Records */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" /> {lang === 'bn' ? 'সাম্প্রতিক মডেল টেস্ট স্কোর' : 'Recent Model Test Scores'}
        </h2>

        {Object.keys(testScores).length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center text-xs text-slate-500">
            {lang === 'bn' ? 'আপনি এখনো কোনো অনলাইন টেস্ট দেননি।' : "You haven't completed any online model test yet."}{' '}
            <Link to="/model-tests" className="text-emerald-600 font-bold hover:underline">
              {lang === 'bn' ? 'প্রথম টেস্ট দিন →' : 'Take your first test now →'}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(testScores).map(([testId, record]: [string, { score: number; total: number; date: string }]) => {
              const testInfo = MODEL_TESTS.find((t) => t.id === testId);
              return (
                <div key={testId} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>{record.date}</span>
                    <span className="font-bold text-emerald-600">
                      {Math.round((record.score / record.total) * 100)}%
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 line-clamp-1">
                    {testInfo?.title || 'Model Test'}
                  </h4>
                  <div className="flex items-baseline gap-1 text-emerald-700 font-black text-xl">
                    <span>{record.score}</span>
                    <span className="text-xs text-slate-400 font-normal">/ {record.total} marks</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Saved Bookmarks */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Bookmark className="w-5 h-5 text-emerald-600" /> {lang === 'bn' ? 'সংরক্ষিত নোটস ও আর্টিকেসমূহ' : 'Saved Notes & Articles'}
        </h2>

        {bookmarkedNotes.length === 0 && bookmarkedPosts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center text-xs text-slate-500">
            {lang === 'bn' ? 'কোনো আইটেম সংরক্ষিত নেই।' : 'No items bookmarked. Click the bookmark icon on any note or post to save it for quick review.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {bookmarkedNotes.map((note: NoteResource) => {
              const noteTitle = lang === 'bn' ? note.titleBn : note.titleEn;
              return (
                <div key={note.id} className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{noteTitle}</h4>
                      <span className="text-[10px] text-slate-400">{note.category}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleBookmark(note.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-500"
                    title="Remove bookmark"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
            {bookmarkedPosts.map((post: EducationalPost) => {
              const postTitle = lang === 'bn' ? post.titleBn : post.titleEn;
              return (
                <div key={post.id} className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{postTitle}</h4>
                    <span className="text-[10px] text-slate-400">{post.category}</span>
                  </div>
                  <button
                    onClick={() => toggleBookmark(post.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-500"
                    title="Remove bookmark"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
