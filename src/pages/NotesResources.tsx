import React, { useState } from 'react';
import { FileText, Download, Eye, Bookmark, Search } from 'lucide-react';
import { NoteResource } from '../types';
import { NotePreviewModal } from '../components/NotePreviewModal';
import { useApp } from '../context/AppContext';

export const NotesResources: React.FC = () => {
  const { notes, toggleBookmark, isBookmarked, searchQuery, setSearchQuery, lang } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeNote, setActiveNote] = useState<NoteResource | null>(null);

  const categories = ['All', 'Grammar Sheets', 'Handwritten Notes', 'HSC English', 'Vocabulary Booster'];

  const filteredNotes = notes.filter((note: NoteResource) => {
    const title = lang === 'bn' ? note.titleBn : note.titleEn;
    const description = lang === 'bn' ? note.descriptionBn : note.descriptionEn;
    const matchesCategory = selectedCategory === 'All' || note.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some((t: string) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
          {lang === 'bn' ? 'ফ্রি পিডিএফ লাইব্রেরি' : 'Free PDF Library'}
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {lang === 'bn' ? 'তুহিন স্যারের হস্তলিখিত লেকচার শিট ও রুলস' : 'Handwritten Lecture Notes & Cheat Sheets'}
        </h1>
        <p className="text-sm text-slate-500 leading-relaxed">
          {lang === 'bn'
            ? 'বোর্ড পরীক্ষার কমন পড়ার মতো ব্যাকরণ শিট, সামারি ও শর্টকাট টেকনিকসমূহ ফ্রিতে ডাউনলোড করুন।'
            : 'High-yield summary sheets, rule compendiums, and board question breakdowns prepared directly by MD Touhidul Hoque Tuhin.'}
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={lang === 'bn' ? 'নোটস, নিয়ম বা ট্যাগ খুঁজুন...' : 'Search notes, rules, tags...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 text-xs rounded-lg pl-9 pr-3 py-2 outline-none"
          />
        </div>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotes.map((note: NoteResource) => {
          const bookmarked = isBookmarked(note.id);
          const title = lang === 'bn' ? note.titleBn : note.titleEn;
          const description = lang === 'bn' ? note.descriptionBn : note.descriptionEn;

          return (
            <div
              key={note.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:border-emerald-300 smooth-card flex flex-col justify-between group p-5 space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    {note.category}
                  </span>
                  <button
                    onClick={() => toggleBookmark(note.id)}
                    className="p-1 rounded text-slate-400 hover:text-emerald-600"
                    title="Bookmark note"
                  >
                    <Bookmark className={`w-4 h-4 ${bookmarked ? 'text-emerald-600 fill-emerald-600' : ''}`} />
                  </button>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 leading-snug line-clamp-2 group-hover:text-emerald-600 transition-colors">
                      {title}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {note.subject} • {note.pages} {lang === 'bn' ? 'পৃষ্ঠা' : 'pages'} • {note.fileSize}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                  {description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {note.tags.map((t: string, idx: number) => (
                    <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-400">
                  {note.downloads.toLocaleString()} {lang === 'bn' ? 'ডাউনলোড' : 'downloads'}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setActiveNote(note)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" /> {lang === 'bn' ? 'প্রিভিউ' : 'Preview'}
                  </button>
                  <button
                    onClick={() => setActiveNote(note)}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 transition-colors shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" /> PDF
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Note Preview Modal */}
      <NotePreviewModal note={activeNote} onClose={() => setActiveNote(null)} />
    </div>
  );
};
