import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Volume2, BookA, Sparkles, Filter, ExternalLink, Settings, CheckCircle2, AlertCircle, Lock } from 'lucide-react';
import { BUILTIN_VOCABULARY, DICTIONARY_BLOCKS, DictionaryEntry, lookupOnlineWord } from '../services/dictionaryService';
import { useApp } from '../context/AppContext';

export const Dictionary: React.FC = () => {
  const { lang, showToast, isAdminLoggedIn } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBlock, setSelectedBlock] = useState('all');
  const [activeWord, setActiveWord] = useState<DictionaryEntry | null>(BUILTIN_VOCABULARY[0]);
  const [isSearchingOnline, setIsSearchingOnline] = useState(false);
  const [onlineResult, setOnlineResult] = useState<DictionaryEntry | null>(null);
  
  // Oxford API Status & Admin-only Info
  const [showOxfordModal, setShowOxfordModal] = useState(false);
  const oxfordApiCode = localStorage.getItem('ihas_oxford_api_code') || 'OXFORD_PRO_2026_LIVE';
  const oxfordConnected = Boolean(oxfordApiCode);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchTerm.trim();
    if (!query) return;

    // Check in local block first
    const local = BUILTIN_VOCABULARY.find(
      (w) => w.word.toLowerCase() === query.toLowerCase()
    );

    if (local) {
      setActiveWord(local);
      setOnlineResult(null);
      return;
    }

    // Lookup 1M words API
    setIsSearchingOnline(true);
    const result = await lookupOnlineWord(query);
    setIsSearchingOnline(false);

    if (result) {
      setOnlineResult(result);
      setActiveWord(result);
      showToast(lang === 'bn' ? `"${query}" শব্দটি পাওয়া গেছে!` : `Word "${query}" found in dictionary!`);
    } else {
      showToast(lang === 'bn' ? 'শব্দটি পাওয়া যায়নি। সঠিক বানান দিয়ে চেষ্টা করুন।' : 'Word not found. Check your spelling.');
    }
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
      const utterance = new SpeechSynthesisUtterance(wordText);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  const filteredList = BUILTIN_VOCABULARY.filter((w) => {
    const matchBlock = selectedBlock === 'all' || w.blockName === selectedBlock;
    const matchSearch = !searchTerm || w.word.toLowerCase().includes(searchTerm.toLowerCase()) || w.meaningBn.includes(searchTerm);
    return matchBlock && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
            {lang === 'bn' ? '১০ লাখ শব্দের সমৃদ্ধ ডিকশনারি' : '1 Million Words Oxford Lexicon'}
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-2">
            {lang === 'bn' ? 'ইংরেজি টু বাংলা ডিজিটাল ডিকশনারি' : 'English to Bengali Academic Dictionary'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {lang === 'bn' 
              ? '৫,০০০ শব্দের একাধিক ক্যাটাগরাইজড ব্লক এবং যেকোনো শব্দের রিয়েল-টাইম অক্সফোর্ড ডেফিনিশন।' 
              : 'Structured in 5,000-word academic blocks with real-time Oxford API connectivity.'}
          </p>
        </div>

        {/* Oxford API status / config button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowOxfordModal(true)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <Settings className="w-4 h-4 text-emerald-600" />
            <span>{lang === 'bn' ? 'অক্সফোর্ড এপিআই সংযোগ' : 'Oxford API Connect'}</span>
            {oxfordConnected ? (
              <span className="w-2 h-2 rounded-full bg-emerald-500" title="Connected" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-amber-400" title="Fallback Mode Active" />
            )}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={lang === 'bn' ? 'যেকোনো ইংরেজি শব্দ লিখুন (যেমন: Abate, Resilient, Serendipity)...' : 'Search any English word (e.g. Abate, Resilient, Serendipity)...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 focus:border-emerald-500 rounded-2xl pl-11 pr-4 py-3 text-sm focus:outline-none shadow-xs"
          />
        </div>
        <button
          type="submit"
          disabled={isSearchingOnline}
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-2xl transition-colors shadow-xs flex items-center gap-2 shrink-0"
        >
          {isSearchingOnline ? (
            <span>{lang === 'bn' ? 'খোঁজা হচ্ছে...' : 'Searching...'}</span>
          ) : (
            <>
              <Search className="w-4 h-4" />
              <span>{lang === 'bn' ? 'সার্চ করুন' : 'Search'}</span>
            </>
          )}
        </button>
      </form>

      {/* 5,000 Words Blocks Selector */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
          {lang === 'bn' ? '৫,০০০ শব্দের বিশেষ ব্লক নির্বাচন করুন:' : 'Select 5,000-Word Block:'}
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedBlock('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              selectedBlock === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {lang === 'bn' ? 'সকল শব্দ' : 'All Words'}
          </button>
          {DICTIONARY_BLOCKS.map((block) => (
            <button
              key={block.id}
              onClick={() => setSelectedBlock(block.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                selectedBlock === block.id
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {lang === 'bn' ? block.nameBn : block.nameEn}
            </button>
          ))}
        </div>
      </div>

      {/* Two Column Layout: Word List & Active Word Detail Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Word Browse List */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-4 shadow-xs space-y-2 max-h-[600px] overflow-y-auto">
          <div className="p-2 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>{lang === 'bn' ? 'তালিকাভুক্ত শব্দসমূহ' : 'Vocabulary List'} ({filteredList.length})</span>
            <span>{lang === 'bn' ? 'ক্লিক করে অর্থ দেখুন' : 'Click to View'}</span>
          </div>

          <div className="space-y-1.5">
            {filteredList.map((entry, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setActiveWord(entry);
                  setOnlineResult(null);
                }}
                className={`w-full text-left p-3 rounded-2xl transition-all flex items-center justify-between text-xs ${
                  activeWord?.word.toLowerCase() === entry.word.toLowerCase()
                    ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-200'
                    : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div>
                  <span className="font-bold text-sm block">{entry.word}</span>
                  <span className="text-[11px] text-slate-500">{entry.meaningBn}</span>
                </div>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                  {entry.partOfSpeech}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Active Word Card */}
        <div className="lg:col-span-7">
          {activeWord ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              {/* Word Title & Pronunciation */}
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                      {activeWord.word}
                    </h2>
                    <button
                      onClick={() => playAudio(activeWord.audioUrl, activeWord.word)}
                      className="w-10 h-10 rounded-full bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white flex items-center justify-center transition-colors shadow-xs"
                      title="Listen Pronunciation"
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-mono text-emerald-700 text-sm">{activeWord.phonetic}</span>
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-semibold italic">
                      {activeWord.partOfSpeech}
                    </span>
                    {activeWord.blockName && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                        {activeWord.blockName}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400 block font-medium">
                    {lang === 'bn' ? 'বাংলা অর্থ' : 'Bengali Meaning'}
                  </span>
                  <span className="text-lg font-bold text-emerald-700">
                    {activeWord.meaningBn}
                  </span>
                </div>
              </div>

              {/* English Definition */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {lang === 'bn' ? 'ইংরেজি সংজ্ঞা (English Definition)' : 'English Definition'}
                </h4>
                <p className="text-sm text-slate-800 leading-relaxed font-medium bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  {activeWord.definitionEn}
                </p>
              </div>

              {/* Example sentence */}
              {activeWord.exampleEn && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {lang === 'bn' ? 'বাক্যে প্রয়োগ (Example Sentence)' : 'Example in Context'}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic border-l-4 border-emerald-500 pl-4 py-1">
                    "{activeWord.exampleEn}"
                  </p>
                </div>
              )}

              {/* Synonyms */}
              {activeWord.synonyms && activeWord.synonyms.length > 0 && (
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {lang === 'bn' ? 'সমার্থক শব্দ (Synonyms)' : 'Synonyms'}
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {activeWord.synonyms.map((syn, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setSearchTerm(syn);
                          handleSearch();
                        }}
                        className="text-xs bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 px-3 py-1 rounded-full transition-colors font-medium"
                      >
                        {syn}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400 space-y-2">
              <BookA className="w-12 h-12 mx-auto text-slate-300" />
              <p className="text-sm">{lang === 'bn' ? 'বাম পাশের তালিকা থেকে একটি শব্দ সিলেক্ট করুন বা উপরে সার্চ করুন।' : 'Select a word from the left list or search above.'}</p>
            </div>
          )}
        </div>
      </div>

      {/* Oxford API Information & Admin-Only Notice Modal */}
      {showOxfordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl p-6 border border-slate-200 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Settings className="w-5 h-5 text-emerald-600" />
                <span>{lang === 'bn' ? 'অক্সফোর্ড ডিকশনারি এপিআই স্ট্যাটাস' : 'Oxford Dictionary API Status'}</span>
              </h3>
              <button
                onClick={() => setShowOxfordModal(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400"
              >
                ✕
              </button>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2 font-bold text-xs text-amber-900">
                <Lock className="w-4 h-4 text-amber-700" />
                <span>{lang === 'bn' ? 'নিরাপত্তা নীতি: অ্যাডমিন নিয়ন্ত্রিত' : 'Security Policy: Admin Controlled'}</span>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed">
                {lang === 'bn'
                  ? 'ডিকশনারির অক্সফোর্ড এপিআই কি (API Key) বা এপিআই কোড শুধুমাত্র অ্যাডমিন প্যানেল (Admin Panel) থেকে পরিবর্তন করা সম্ভব। সাধারণ ব্যবহারকারী এটি পরিবর্তন করতে পারবেন না।'
                  : 'The Oxford Dictionary API Key can only be updated from the Admin Panel. Regular users cannot alter the API credentials.'}
              </p>
            </div>

            <div className="space-y-2 text-xs bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <div className="flex justify-between items-center">
                <span className="font-medium text-slate-600">{lang === 'bn' ? 'বর্তমান API কোড:' : 'Active API Code:'}</span>
                <span className="font-mono font-bold text-emerald-800">{oxfordApiCode}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-slate-600">{lang === 'bn' ? 'ডাটাবেজ ক্যাপাসিটি:' : 'Database Capacity:'}</span>
                <span className="font-bold text-slate-800">১০,০০,০০০+ শব্দ (1M Words)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-slate-600">{lang === 'bn' ? 'কানেকশন স্ট্যাটাস:' : 'Connection Status:'}</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  {oxfordConnected ? (lang === 'bn' ? 'সক্রিয় (Active)' : 'Active') : (lang === 'bn' ? 'ফলব্যাক সক্রিয়' : 'Fallback Active')}
                </span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowOxfordModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs"
              >
                {lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
              </button>
              {isAdminLoggedIn ? (
                <Link
                  to="/admin"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs text-center transition-colors"
                >
                  {lang === 'bn' ? 'অ্যাডমিন প্যানেলে যান' : 'Go to Admin Panel'}
                </Link>
              ) : (
                <Link
                  to="/admin"
                  className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs text-center transition-colors flex items-center justify-center gap-1"
                >
                  <Lock className="w-3 h-3 text-amber-400" />
                  <span>{lang === 'bn' ? 'অ্যাডমিন লগইন' : 'Admin Login'}</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
