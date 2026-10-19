import React, { useState } from 'react';
import { Plus, Trash2, Edit3, CheckCircle2, Clock, HelpCircle, Layers, Save, X } from 'lucide-react';
import { ModelTest, QuizQuestion, Language } from '../../types';

interface QuizManagementTabProps {
  modelTests: ModelTest[];
  addModelTest: (test: ModelTest) => void;
  updateModelTest: (test: ModelTest) => void;
  deleteModelTest: (id: string) => void;
  lang: Language;
  showToast: (msg: string) => void;
}

export const QuizManagementTab: React.FC<QuizManagementTabProps> = ({
  modelTests,
  addModelTest,
  updateModelTest,
  deleteModelTest,
  lang,
  showToast
}) => {
  const [editingQuiz, setEditingQuiz] = useState<ModelTest | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Form State for Quiz
  const [quizForm, setQuizForm] = useState<Partial<ModelTest>>({
    title: '',
    category: 'Basic Grammar Test',
    durationMinutes: 10,
    totalMarks: 10,
    questions: []
  });

  // Current Question being added
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newOptions, setNewOptions] = useState(['', '', '', '']);
  const [newCorrectAnswer, setNewCorrectAnswer] = useState(0);
  const [newExplanation, setNewExplanation] = useState('');

  const handleStartAddQuiz = () => {
    setIsAddingNew(true);
    setEditingQuiz(null);
    setQuizForm({
      id: `test-${Date.now()}`,
      title: '',
      category: 'Basic Grammar Test',
      durationMinutes: 10,
      totalMarks: 10,
      questions: []
    });
  };

  const handleStartEditQuiz = (quiz: ModelTest) => {
    setEditingQuiz(quiz);
    setIsAddingNew(false);
    setQuizForm({ ...quiz });
  };

  const handleAddQuestionToForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim() || newOptions.some((opt) => !opt.trim())) {
      showToast(lang === 'bn' ? 'অনুগ্রহ করে প্রশ্নের বিবরণ ও ৪টি অপশন পূরণ করুন!' : 'Please fill question text and all 4 options!');
      return;
    }

    const newQ: QuizQuestion = {
      id: Date.now(),
      question: newQuestionText.trim(),
      options: [...newOptions],
      correctAnswer: newCorrectAnswer,
      explanation: newExplanation.trim() || 'Correct answer based on English grammatical rules.'
    };

    setQuizForm((prev) => ({
      ...prev,
      questions: [...(prev.questions || []), newQ],
      totalMarks: (prev.questions?.length || 0) + 1
    }));

    setNewQuestionText('');
    setNewOptions(['', '', '', '']);
    setNewCorrectAnswer(0);
    setNewExplanation('');
    showToast(lang === 'bn' ? 'প্রশ্ন কুইজে যুক্ত হয়েছে!' : 'Question added to quiz!');
  };

  const handleRemoveQuestion = (qId: number) => {
    setQuizForm((prev) => ({
      ...prev,
      questions: (prev.questions || []).filter((q) => q.id !== qId)
    }));
  };

  const handleSaveQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizForm.title?.trim()) {
      showToast(lang === 'bn' ? 'কুইজের নাম দিন!' : 'Please enter quiz title!');
      return;
    }

    if (!quizForm.questions || quizForm.questions.length === 0) {
      showToast(lang === 'bn' ? 'অন্তত ১টি বহুনির্বাচনী প্রশ্ন যুক্ত করুন!' : 'Please add at least 1 question!');
      return;
    }

    const testToSave: ModelTest = {
      id: quizForm.id || `test-${Date.now()}`,
      title: quizForm.title.trim(),
      category: quizForm.category as any,
      durationMinutes: Number(quizForm.durationMinutes) || 10,
      totalMarks: quizForm.questions.length,
      questions: quizForm.questions
    };

    if (editingQuiz) {
      updateModelTest(testToSave);
      showToast(lang === 'bn' ? 'কুইজ সফলভাবে আপডেট হয়েছে!' : 'Quiz updated successfully!');
    } else {
      addModelTest(testToSave);
      showToast(lang === 'bn' ? 'নতুন কুইজ তৈরি হয়েছে!' : 'New model test created!');
    }

    setIsAddingNew(false);
    setEditingQuiz(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Action */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
            {lang === 'bn' ? 'অনলাইন মডেল টেস্ট ও কুইজ কন্ট্রোল' : 'Interactive Model Test Engine'}
          </span>
          <h3 className="text-xl font-bold text-slate-900 mt-1">
            {lang === 'bn' ? 'কুইজ মেনেজমেন্ট ও প্রশ্ন ব্যাংক' : 'Quiz Management & Question Bank'}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {lang === 'bn' 
              ? 'এখানে তৈরি করা সকল কুইজ ও প্রশ্ন শিক্ষার্থীরা "Model Tests" পেজে সরাসরি সময় নির্ধারণ করে দিতে পারবে।' 
              : 'Create timed tests with instant results and detailed grammatical explanations.'}
          </p>
        </div>

        {!isAddingNew && !editingQuiz && (
          <button
            onClick={handleStartAddQuiz}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{lang === 'bn' ? 'নতুন কুইজ তৈরি করুন' : 'Create New Model Test'}</span>
          </button>
        )}
      </div>

      {/* CREATE / EDIT QUIZ FORM */}
      {(isAddingNew || editingQuiz) && (
        <div className="bg-white rounded-3xl border-2 border-emerald-500/40 p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase">
                {editingQuiz ? 'EDIT QUIZ' : 'NEW QUIZ'}
              </span>
              <h4 className="text-lg font-bold text-slate-900 mt-1">
                {editingQuiz 
                  ? (lang === 'bn' ? 'কুইজ ও প্রশ্ন সম্পাদনা' : 'Edit Model Test') 
                  : (lang === 'bn' ? 'নতুন মডেল টেস্ট তৈরি' : 'Create New Model Test')}
              </h4>
            </div>
            <button
              onClick={() => { setIsAddingNew(false); setEditingQuiz(null); }}
              className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSaveQuiz} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">
                  {lang === 'bn' ? 'কুইজ / মডেল টেস্টের শিরোনাম' : 'Quiz Title'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. HSC 2026: Modifiers & Connectors Mastery Test"
                  value={quizForm.title}
                  onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {lang === 'bn' ? 'ক্যাটাগরি' : 'Category'}
                </label>
                <select
                  value={quizForm.category}
                  onChange={(e) => setQuizForm({ ...quizForm, category: e.target.value as any })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none bg-white"
                >
                  <option value="Basic Grammar Test">Basic Grammar Test</option>
                  <option value="HSC 1st & 2nd Paper">HSC 1st & 2nd Paper</option>
                  <option value="BCS English Model Test">BCS English Model Test</option>
                  <option value="Spoken English Quick Test">Spoken English Quick Test</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {lang === 'bn' ? 'সময়সীমা (মিনিট)' : 'Duration (Minutes)'}
                </label>
                <div className="relative">
                  <Clock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="number"
                    min={1}
                    max={120}
                    required
                    value={quizForm.durationMinutes}
                    onChange={(e) => setQuizForm({ ...quizForm, durationMinutes: Number(e.target.value) })}
                    className="w-full border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {lang === 'bn' ? 'মোট প্রশ্ন সংখ্যা' : 'Questions Count'}
                </label>
                <input
                  type="text"
                  disabled
                  value={`${quizForm.questions?.length || 0} টি প্রশ্ন যুক্ত হয়েছে`}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs bg-slate-50 text-slate-600 font-semibold"
                />
              </div>
            </div>

            {/* Questions Bank for this quiz */}
            <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h5 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-emerald-600" />
                  {lang === 'bn' ? 'কুইজের অন্তর্ভুক্ত প্রশ্নসমূহ' : 'Questions in this Quiz'} ({quizForm.questions?.length || 0})
                </h5>
              </div>

              {quizForm.questions && quizForm.questions.length > 0 ? (
                <div className="space-y-3">
                  {quizForm.questions.map((q, idx) => (
                    <div key={q.id} className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs space-y-2 relative">
                      <div className="flex items-start justify-between gap-3 pr-8">
                        <span className="font-bold text-slate-900">
                          {idx + 1}. {q.question}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveQuestion(q.id)}
                          className="text-red-500 hover:text-red-700 p-1 absolute top-2.5 right-2.5"
                          title="Remove Question"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        {q.options.map((opt, oIdx) => (
                          <div 
                            key={oIdx}
                            className={`px-2 py-1 rounded border ${
                              oIdx === q.correctAnswer
                                ? 'bg-emerald-50 border-emerald-400 text-emerald-800 font-bold'
                                : 'bg-slate-50 border-slate-200 text-slate-600'
                            }`}
                          >
                            {String.fromCharCode(65 + oIdx)}. {opt} {oIdx === q.correctAnswer && '✓'}
                          </div>
                        ))}
                      </div>

                      {q.explanation && (
                        <p className="text-[11px] text-slate-500 italic bg-amber-50/60 p-2 rounded border border-amber-200/50">
                          <strong>ব্যাখ্যা:</strong> {q.explanation}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-4 text-xs text-slate-400 italic">
                  {lang === 'bn' ? 'নিচে ফর্ম পূরণ করে কুইজে প্রশ্ন যোগ করুন।' : 'Add questions to this quiz below.'}
                </p>
              )}

              {/* Add Single Question Inline Box */}
              <div className="bg-white p-4 rounded-xl border border-emerald-200 space-y-3 text-xs">
                <span className="font-bold text-emerald-800 block">
                  + {lang === 'bn' ? 'নতুন বহুনির্বাচনী প্রশ্ন যোগ করুন' : 'Add Multiple Choice Question'}
                </span>
                
                <div>
                  <input
                    type="text"
                    placeholder={lang === 'bn' ? 'প্রশ্নটি লিখুন (যেমন: It is high time we ______ our habits.)' : 'Type question statement here'}
                    value={newQuestionText}
                    onChange={(e) => setNewQuestionText(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {newOptions.map((opt, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="correctAnswerSelect"
                        checked={newCorrectAnswer === i}
                        onChange={() => setNewCorrectAnswer(i)}
                        className="text-emerald-600 focus:ring-emerald-500"
                        title={lang === 'bn' ? 'সঠিক উত্তর চিহ্নিত করুন' : 'Mark as correct'}
                      />
                      <input
                        type="text"
                        placeholder={`Option ${String.fromCharCode(65 + i)}`}
                        value={opt}
                        onChange={(e) => {
                          const updated = [...newOptions];
                          updated[i] = e.target.value;
                          setNewOptions(updated);
                        }}
                        className={`w-full border rounded-xl px-3 py-1.5 text-xs focus:outline-none ${
                          newCorrectAnswer === i ? 'border-emerald-500 bg-emerald-50/40' : 'border-slate-200'
                        }`}
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <input
                    type="text"
                    placeholder={lang === 'bn' ? 'ব্যাখ্যা বা নিয়ম (যেমন: It is high time এর পর past indefinite বসে)' : 'Explanation of why this option is correct'}
                    value={newExplanation}
                    onChange={(e) => setNewExplanation(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleAddQuestionToForm}
                    className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{lang === 'bn' ? 'প্রশ্ন যোগ করুন' : 'Add Question'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Save Quiz Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => { setIsAddingNew(false); setEditingQuiz(null); }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                {lang === 'bn' ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
              >
                <Save className="w-4 h-4" />
                <span>{editingQuiz ? (lang === 'bn' ? 'আপডেট সংরক্ষণ করুন' : 'Save Changes') : (lang === 'bn' ? 'কুইজ প্রকাশ করুন' : 'Publish Quiz')}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* QUIZZES LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {modelTests.map((quiz) => (
          <div key={quiz.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                  {quiz.category}
                </span>
                <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {quiz.durationMinutes} mins
                </span>
              </div>

              <h4 className="font-bold text-slate-900 text-sm leading-snug">
                {quiz.title}
              </h4>

              <div className="flex items-center gap-3 text-xs text-slate-600">
                <span className="flex items-center gap-1 font-semibold text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {quiz.questions?.length || 0} টি প্রশ্ন
                </span>
                <span>• পূর্ণমান: {quiz.totalMarks || quiz.questions?.length || 0}</span>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-3">
              <span className="text-[11px] text-slate-400">
                আইডি: <strong className="font-mono">{quiz.id}</strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleStartEditQuiz(quiz)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Edit3 className="w-3 h-3 text-emerald-600" />
                  <span>{lang === 'bn' ? 'এডিট' : 'Edit'}</span>
                </button>
                <button
                  onClick={() => {
                    if (confirm(lang === 'bn' ? 'আপনি কি এই কুইজটি মুছে ফেলতে চান?' : 'Are you sure you want to delete this quiz?')) {
                      deleteModelTest(quiz.id);
                      showToast(lang === 'bn' ? 'কুইজ মুছে ফেলা হয়েছে!' : 'Quiz deleted!');
                    }
                  }}
                  className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>{lang === 'bn' ? 'ডিলিট' : 'Delete'}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
