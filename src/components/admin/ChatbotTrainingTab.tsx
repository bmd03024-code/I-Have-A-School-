import React, { useState } from 'react';
import { Plus, Trash2, Edit3, Bot, Sparkles, BookOpen, Save, X, Database } from 'lucide-react';
import { ChatbotTrainingItem, Language } from '../../types';

interface ChatbotTrainingTabProps {
  chatbotTraining: ChatbotTrainingItem[];
  addChatbotTraining: (item: ChatbotTrainingItem) => void;
  updateChatbotTraining: (item: ChatbotTrainingItem) => void;
  deleteChatbotTraining: (id: string) => void;
  lang: Language;
  showToast: (msg: string) => void;
}

export const ChatbotTrainingTab: React.FC<ChatbotTrainingTabProps> = ({
  chatbotTraining,
  addChatbotTraining,
  updateChatbotTraining,
  deleteChatbotTraining,
  lang,
  showToast
}) => {
  const [editingItem, setEditingItem] = useState<ChatbotTrainingItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const [year, setYear] = useState('2026');
  const [topic, setTopic] = useState('');
  const [content, setContent] = useState('');

  // Calculate total words stored across all training entries
  const totalTrainedWords = chatbotTraining.reduce((sum, item) => sum + (item.wordCount || 0), 0);
  const maxCapacity = 1000000; // 10 Lakh words
  const capacityPercent = Math.min(100, (totalTrainedWords / maxCapacity) * 100);

  // Current input word count
  const currentWordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  const handleStartAdd = () => {
    setIsAdding(true);
    setEditingItem(null);
    setYear('2026');
    setTopic('');
    setContent('');
  };

  const handleStartEdit = (item: ChatbotTrainingItem) => {
    setEditingItem(item);
    setIsAdding(false);
    setYear(item.year);
    setTopic(item.topic);
    setContent(item.content);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      showToast(lang === 'bn' ? 'ট্রেনিং বিষয়ের নাম দিন!' : 'Please enter training topic!');
      return;
    }

    if (!content.trim()) {
      showToast(lang === 'bn' ? 'ট্রেনিং টেক্সট বক্সে তথ্য দিন!' : 'Please provide training content!');
      return;
    }

    if (currentWordCount > 5000) {
      showToast(lang === 'bn' ? 'একবারে সর্বোচ্চ ৫০০০ শব্দ যোগ করা যাবে!' : 'Maximum 5,000 words per entry allowed!');
      return;
    }

    const itemToSave: ChatbotTrainingItem = {
      id: editingItem ? editingItem.id : `train-${Date.now()}`,
      year,
      topic: topic.trim(),
      content: content.trim(),
      wordCount: currentWordCount,
      createdAt: editingItem ? editingItem.createdAt : new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    if (editingItem) {
      updateChatbotTraining(itemToSave);
      showToast(lang === 'bn' ? 'চ্যাটবট ট্রেনিং ডেটা আপডেট হয়েছে!' : 'Chatbot training module updated!');
    } else {
      addChatbotTraining(itemToSave);
      showToast(lang === 'bn' ? 'নতুন ট্রেনিং ডেটা চ্যাটবটে যুক্ত হয়েছে!' : 'New training data added to AI assistant!');
    }

    setIsAdding(false);
    setEditingItem(null);
    setTopic('');
    setContent('');
  };

  return (
    <div className="space-y-6">
      {/* Overview & Capacity Stats */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase flex items-center gap-1">
              <Bot className="w-3 h-3" />
              AI TRAINING ENGINE
            </span>
            <span className="text-xs font-bold text-slate-500">
              {lang === 'bn' ? '১০ লাখ শব্দের বৃহৎ ডেটাবেজ' : '1,000,000 Words High-Capacity Engine'}
            </span>
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            {lang === 'bn' ? 'শিক্ষাবর্ষ ভিত্তিক চ্যাটবট ট্রেনিং মডিউল' : 'Academic Year-Based Chatbot Training'}
          </h3>
          <p className="text-xs text-slate-500">
            {lang === 'bn'
              ? 'এখানে প্রতিটি শিক্ষাবর্ষের (Year) জন্য ৫,০০০ শব্দ পর্যন্ত নোট, নিয়মাবলি বা নির্দেশনা সংরক্ষণ করুন। চ্যাটবট স্বয়ংক্রিয়ভাবে শিক্ষার্থীদের সঠিক উত্তর দেবে।'
              : 'Add up to 5,000 words per entry. The AI chatbot uses this trained knowledge base to resolve academic and course queries.'}
          </p>
        </div>

        {/* Capacity Bar */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 min-w-[280px] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              {lang === 'bn' ? 'মোট সংরক্ষিত শব্দ:' : 'Trained Capacity:'}
            </span>
            <span className="font-mono font-bold text-emerald-700">
              {totalTrainedWords.toLocaleString()} / {maxCapacity.toLocaleString()}
            </span>
          </div>

          <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
            <div 
              className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500" 
              style={{ width: `${Math.max(2, capacityPercent)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-500">
            <span>{chatbotTraining.length} টি ট্রেনিং এন্ট্রি সক্রিয়</span>
            <span>সর্বোচ্চ ১০,০০,০০০ শব্দ সাপোর্ট</span>
          </div>
        </div>

        {!isAdding && !editingItem && (
          <button
            onClick={handleStartAdd}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-all shrink-0 self-start lg:self-center"
          >
            <Plus className="w-4 h-4" />
            <span>{lang === 'bn' ? 'নতুন ট্রেনিং ডেটা যোগ করুন' : 'Add Training Data'}</span>
          </button>
        )}
      </div>

      {/* ADD / EDIT FORM */}
      {(isAdding || editingItem) && (
        <div className="bg-white rounded-3xl border-2 border-emerald-500/40 p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase">
                {editingItem ? 'EDIT TRAINING ENTRY' : 'NEW TRAINING ENTRY'}
              </span>
              <h4 className="text-lg font-bold text-slate-900 mt-1">
                {editingItem 
                  ? (lang === 'bn' ? 'চ্যাটবট ট্রেনিং মডিউল সম্পাদনা' : 'Edit Training Module') 
                  : (lang === 'bn' ? 'নতুন চ্যাটবট ট্রেনিং তথ্য যোগ (একত্রে সর্বোচ্চ ৫,০০০ শব্দ)' : 'Add Chatbot Training Data (Up to 5,000 words)')}
              </h4>
            </div>
            <button
              onClick={() => { setIsAdding(false); setEditingItem(null); }}
              className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {lang === 'bn' ? 'শিক্ষাবর্ষ (Academic Year)' : 'Academic Year'}
                </label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none bg-white font-semibold"
                >
                  <option value="2027">2027</option>
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                  <option value="General">General / All Years</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">
                  {lang === 'bn' ? 'ট্রেনিং বিষয় / টপিকের শিরোনাম' : 'Training Topic / Title'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={lang === 'bn' ? 'যেমন: এইচএসসি ২০২৬ ইংলিশ ২য় পত্র গ্রামার রুলস ও শর্টকাট' : 'e.g. HSC 2026 Modifiers Rules and Shortcuts'}
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-bold text-slate-700">
                  {lang === 'bn' ? 'ট্রেনিং টেক্সট বক্স (বড় টেক্সট - ৫,০০০ শব্দ পর্যন্ত)' : 'Training Content Box (Up to 5,000 words)'}
                </label>
                <span className={`font-mono text-xs font-bold ${
                  currentWordCount > 5000 ? 'text-red-600' : 'text-emerald-700'
                }`}>
                  {currentWordCount} / 5,000 {lang === 'bn' ? 'শব্দ' : 'words'}
                </span>
              </div>
              <textarea
                rows={12}
                required
                placeholder={lang === 'bn' 
                  ? 'এখানে একসাথে ৫,০০০ শব্দ পর্যন্ত নোট, নিয়মাবলি, প্রশ্ন-উত্তর বা দিকনির্দেশনা পেস্ট বা টাইপ করুন...' 
                  : 'Paste or type up to 5,000 words of educational guidelines, grammar rules, admission details, or FAQs...'}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full border border-slate-200 rounded-2xl p-4 text-xs font-mono leading-relaxed focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                {lang === 'bn' 
                  ? '* শিক্ষার্থীরা চ্যাটবটে প্রশ্ন করার সময় এই ডেটাবেজ স্ক্যান করে স্বয়ংক্রিয়ভাবে সঠিক উত্তর প্রস্তুত হবে।' 
                  : '* The AI assistant parses this content to answer student questions.'}
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => { setIsAdding(false); setEditingItem(null); }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                {lang === 'bn' ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
              >
                <Save className="w-4 h-4" />
                <span>{editingItem ? (lang === 'bn' ? 'আপডেট সংরক্ষণ করুন' : 'Update Training') : (lang === 'bn' ? 'সংরক্ষণ করুন' : 'Save Training')}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TRAINING ITEMS LIST */}
      <div className="space-y-3">
        {chatbotTraining.map((item) => (
          <div 
            key={item.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3 hover:border-emerald-300 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    শিক্ষাবর্ষ {item.year}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    {item.wordCount} শব্দ • আইডি: {item.id}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">
                  {item.topic}
                </h4>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleStartEdit(item)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{lang === 'bn' ? 'এডিট' : 'Edit'}</span>
                </button>
                <button
                  onClick={() => {
                    if (confirm(lang === 'bn' ? 'আপনি কি এই ট্রেনিং ডেটা মুছে ফেলতে চান?' : 'Are you sure you want to delete this training data?')) {
                      deleteChatbotTraining(item.id);
                      showToast(lang === 'bn' ? 'ট্রেনিং ডেটা মুছে ফেলা হয়েছে!' : 'Training item deleted!');
                    }
                  }}
                  className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? 'ডিলিট' : 'Delete'}</span>
                </button>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs text-slate-700 font-mono line-clamp-3 whitespace-pre-line">
              {item.content}
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 pt-2">
              <span>সংরক্ষিত তারিখ: {item.createdAt}</span>
              {item.updatedAt && <span>সর্বশেষ আপডেট: {item.updatedAt}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
