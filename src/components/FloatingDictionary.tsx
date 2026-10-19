import React, { useState } from 'react';
import { 
  BookA, 
  Search, 
  Volume2, 
  X, 
  Sparkles, 
  ExternalLink, 
  Lock, 
  CheckCircle2, 
  BookOpen, 
  Layers,
  ArrowRight,
  Bookmark
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BUILTIN_VOCABULARY, DictionaryEntry, lookupOnlineWord } from '../services/dictionaryService';
import { useNavigate } from 'react-router-dom';

export const FloatingDictionary: React.FC = () => {
  const { lang, isFloatingDictOpen, setIsFloatingDictOpen, showToast, isAdminLoggedIn } = useApp();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [activeWord, setActiveWord] = useState<DictionaryEntry | null>(BUILTIN_VOCABULARY[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(['Diligent', 'Benevolent', 'Eloquent', 'Resilient']);

  if (!isFloatingDictOpen) return null;

  const handleSearch = async (queryText?: string) => {
    const query = (queryText || searchTerm).trim();
    if (!query) return;

    // Check local vocabulary first
    const local = BUILTIN_VOCABULARY.find(
      (w) => w.word.toLowerCase() === query.toLowerCase()
    );

    if (local) {
      setActiveWord(local);
      updateRecent(local.word);
      return;
    }

    setIsLoading(true);
    const result = await lookupOnlineWord(query);
    setIsLoading(false);

    if (result) {
      setActiveWord(result);
      updateRecent(result.word);
      showToast(lang === 'bn' ? `"${query}" শব্দটি পাওয়া গেছে!` : `Word "${query}" found!`);
    } else {
      showToast(lang === 'bn' ? 'শব্দটি পাওয়া যায়নি। সঠিক বানান দিয়ে চেষ্টা করুন।' : 'Word not found. Check spelling.');
    }
  };

  const updateRecent = (word: string) => {
    setRecentSearches((prev) => {
      const filtered = prev.filter((w) => w.toLowerCase() !== word.toLowerCase());
      return [word, ...filtered].slice(0, 6);
    });
  };

  const playAudio = (audioUrl?: string, wordText?: string) => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play().catch(() => playSpeech(wordText));
    } else {
      playSpeech(wordText);
    }
  };

  const playSpeech = (wordText?: string) => {
    if ('speechSynthesis' in window && wordText) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(wordText);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div 
      className="!fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md"
      onClick={() => setIsFloatingDictOpen(false)}
    >
      <div 
        className="bg-white rounded-3xl max-w-lg w-full shadow-2xl shadow-emerald-950/40 border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shadow-inner">
              <BookA className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white">
                  {lang === 'bn' ? 'ভাসমান অক্সফোর্ড ডিকশনারি' : 'Floating Oxford Dictionary'}
                </h3>
                <span className="text-[10px] bg-emerald-400 text-emerald-950 font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  ১০ লাখ শব্দ
                </span>
              </div>
              <p className="text-[11px] text-emerald-100">
                {lang === 'bn' ? 'ইংরেজি টু বাংলা অর্থ, উচ্চারণ ও সংজ্ঞা' : 'English to Bengali meanings & phonetics'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                setIsFloatingDictOpen(false);
                navigate('/dictionary');
              }}
              className="p-1.5 rounded-xl hover:bg-white/10 text-emerald-100 hover:text-white transition-colors"
              title={lang === 'bn' ? 'সম্পূর্ণ ডিকশনারি পেজে যান' : 'Go to Full Dictionary Page'}
            >
              <ExternalLink className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsFloatingDictOpen(false)}
              className="p-1.5 rounded-xl hover:bg-white/10 text-emerald-100 hover:text-white transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Admin API Policy Banner (এপিআই কি শুধুমাত্র এডমিন প্যানেলে বসানো যাবে) */}
        <div className="bg-amber-50 border-b border-amber-200/80 px-4 py-2 text-[11px] text-amber-900 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 font-medium">
            <Lock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span>
              {lang === 'bn' 
                ? 'ডিকশনারি API Key শুধুমাত্র অ্যাডমিন প্যানেল থেকে কনফিগার করা যাবে।' 
                : 'Dictionary API Key can only be configured in the Admin Panel.'}
            </span>
          </div>
          {isAdminLoggedIn ? (
            <button
              onClick={() => {
                setIsFloatingDictOpen(false);
                navigate('/admin');
              }}
              className="text-[10px] font-bold text-amber-900 underline hover:text-amber-950 shrink-0"
            >
              {lang === 'bn' ? 'অ্যাডমিন সেটিংস' : 'Admin Settings'}
            </button>
          ) : (
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shrink-0">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              {lang === 'bn' ? 'API সক্রিয়' : 'API Active'}
            </span>
          )}
        </div>

        {/* Search Input */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/70">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={lang === 'bn' ? 'যেকোনো ইংরেজি শব্দ লিখুন (যেমন: Diligent, Resilient)...' : 'Type any English word...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-20 py-2.5 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none shadow-xs"
            />
            <button
              onClick={() => handleSearch()}
              disabled={isLoading}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-[11px] rounded-xl transition-colors"
            >
              {isLoading ? (lang === 'bn' ? 'খোঁজা হচ্ছে...' : 'Searching...') : (lang === 'bn' ? 'সার্চ' : 'Search')}
            </button>
          </div>

          {/* Quick word suggestions */}
          <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto no-scrollbar">
            <span className="text-[10px] font-bold text-slate-400 shrink-0">
              {lang === 'bn' ? 'জনপ্রিয়:' : 'Popular:'}
            </span>
            {recentSearches.map((w, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSearchTerm(w);
                  handleSearch(w);
                }}
                className="shrink-0 text-[10px] font-medium bg-white hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 px-2.5 py-0.5 rounded-full border border-slate-200 transition-colors"
              >
                {w}
              </button>
            ))}
          </div>
        </div>

        {/* Word Detail Card */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {activeWord ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                      {activeWord.word}
                    </h2>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 uppercase">
                      {activeWord.partOfSpeech}
                    </span>
                  </div>
                  {activeWord.phonetic && (
                    <p className="text-xs font-mono text-slate-500 mt-1">
                      {activeWord.phonetic}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => playAudio(activeWord.audioUrl, activeWord.word)}
                  className="w-10 h-10 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 flex items-center justify-center transition-colors shadow-xs"
                  title="Listen pronunciation"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>

              {/* Bengali Meaning */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/70 rounded-2xl p-4">
                <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider block mb-1">
                  {lang === 'bn' ? 'বাংলা অর্থ' : 'Bengali Meaning'}
                </span>
                <p className="text-base font-bold text-slate-900">
                  {activeWord.meaningBn}
                </p>
              </div>

              {/* English Definition */}
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  {lang === 'bn' ? 'ইংরেজি সংজ্ঞা (Oxford Definition)' : 'English Definition'}
                </span>
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {activeWord.definitionEn}
                </p>
              </div>

              {/* Example */}
              {activeWord.exampleEn && (
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    {lang === 'bn' ? 'বাক্যে প্রয়োগ (Example Sentence)' : 'Example in Sentence'}
                  </span>
                  <p className="text-xs italic text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    "{activeWord.exampleEn}"
                  </p>
                </div>
              )}

              {/* Synonyms */}
              {activeWord.synonyms && activeWord.synonyms.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                    {lang === 'bn' ? 'সমার্থক শব্দ (Synonyms)' : 'Synonyms'}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeWord.synonyms.map((syn, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSearchTerm(syn);
                          handleSearch(syn);
                        }}
                        className="text-[11px] bg-slate-100 hover:bg-emerald-100 hover:text-emerald-800 text-slate-700 px-2.5 py-1 rounded-lg transition-colors font-medium"
                      >
                        {syn}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="py-12 text-center space-y-2 text-slate-400">
              <BookOpen className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-xs">
                {lang === 'bn' ? 'উপরে শব্দ লিখে সার্চ বাটনে চাপুন' : 'Type a word above to view definition'}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
          <button
            onClick={() => {
              setIsFloatingDictOpen(false);
              navigate('/dictionary');
            }}
            className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1"
          >
            <span>{lang === 'bn' ? 'পূর্ণাঙ্গ ডিকশনারি পেজে যান' : 'Open Full Dictionary'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <span className="text-[10px] text-slate-400">
            {lang === 'bn' ? '১০ লাখ শব্দের অক্সফোর্ড লেক্সিকন' : '1M Oxford Lexicon'}
          </span>
        </div>
      </div>
    </div>
  );
};
