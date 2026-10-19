import React from 'react';
import { X, Download, FileText, Printer, Bookmark } from 'lucide-react';
import { NoteResource } from '../types';
import { useApp } from '../context/AppContext';

interface NotePreviewModalProps {
  note: NoteResource | null;
  onClose: () => void;
}

export const NotePreviewModal: React.FC<NotePreviewModalProps> = ({ note, onClose }) => {
  const { toggleBookmark, isBookmarked, showToast, lang } = useApp();

  if (!note) return null;

  const bookmarked = isBookmarked(note.id);
  const title = lang === 'bn' ? note.titleBn : note.titleEn;
  const description = lang === 'bn' ? note.descriptionBn : note.descriptionEn;

  const handleDownload = () => {
    // Generate clean printable text file / simulate PDF download
    const content = `======================================================
I HAVE A SCHOOL - by MD Touhidul Hoque Tuhin
Lecture Note: ${title}
Subject: ${note.subject} | Category: ${note.category}
Date: ${note.date}
======================================================

Description:
${description}

Key Notes & Rule Extracts:
${note.sampleContent.map((c, i) => `${i + 1}. ${c}`).join('\n\n')}

------------------------------------------------------
"Education is not about rote learning; it is about building the confidence to express your thoughts with precision and clarity."
- MD Touhidul Hoque Tuhin
Official Hotline: +880 1712-345678
======================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.toLowerCase().replace(/\s+/g, '_')}_tuhin_sir.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Download started! Lecture note saved.');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                {note.category} • {note.subject}
              </span>
              <h3 className="text-base font-bold text-white line-clamp-1">
                {title}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Note Document Viewer */}
        <div className="p-6 overflow-y-auto space-y-5 bg-slate-50 font-serif">
          {/* Note Document Header */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4 font-sans">
            <div className="border-b border-slate-100 pb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                  I Have A School Exclusive Notes
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-1">
                  {title}
                </h2>
                <p className="text-xs text-slate-500">
                  Authored by MD Touhidul Hoque Tuhin • {note.pages} Pages • Size: {note.fileSize}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleBookmark(note.id)}
                  className={`p-2 rounded-lg border text-xs font-medium flex items-center gap-1 transition-colors ${
                    bookmarked 
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                  title="Bookmark note"
                >
                  <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-emerald-600' : ''}`} />
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              {description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {note.tags.map((tag, idx) => (
                <span key={idx} className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Sample Note Content & Rules */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-sans border-b border-slate-100 pb-2 flex items-center justify-between">
              <span>Selected Lecture Extracts & Rules</span>
              <span className="text-emerald-600 text-[11px] font-medium">Verified by Tuhin Sir</span>
            </h4>

            <div className="space-y-3 font-sans text-xs text-slate-800">
              {note.sampleContent.map((item, idx) => (
                <div 
                  key={idx}
                  className="p-3.5 rounded-lg bg-emerald-50/50 border-l-4 border-emerald-500 text-slate-700 leading-relaxed font-sans"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            <span>{note.downloads.toLocaleString()} students have downloaded this note</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-4 h-4" /> Print
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Download className="w-4 h-4" /> Download PDF Note ({note.fileSize})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
