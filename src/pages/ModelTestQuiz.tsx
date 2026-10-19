import React, { useState, useEffect, useCallback } from 'react';
import { Clock, CheckCircle2, XCircle, RotateCcw, HelpCircle } from 'lucide-react';
import { MODEL_TESTS } from '../data/mockData';
import { ModelTest } from '../types';
import { useApp } from '../context/AppContext';

export const ModelTestQuiz: React.FC = () => {
  const { saveTestScore, showToast, modelTests } = useApp();
  const availableTests = modelTests && modelTests.length > 0 ? modelTests : MODEL_TESTS;
  const [activeTest, setActiveTest] = useState<ModelTest>(availableTests[0]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>((availableTests[0]?.durationMinutes || 10) * 60);
  const [timerRunning, setTimerRunning] = useState<boolean>(true);

  const handleSubmitTest = useCallback(() => {
    setIsSubmitted(true);
    setTimerRunning(false);

    // Calculate score
    let correctCount = 0;
    activeTest.questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    saveTestScore(activeTest.id, correctCount, activeTest.questions.length);
    showToast(`Test finished! Your Score: ${correctCount}/${activeTest.questions.length}`);
  }, [activeTest, selectedAnswers, saveTestScore, showToast]);

  // Timer countdown
  useEffect(() => {
    if (!timerRunning || isSubmitted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timerRunning, isSubmitted, handleSubmitTest]);

  const handleSelectAnswer = (questionId: number, optionIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleSwitchTest = (test: ModelTest) => {
    setActiveTest(test);
    setSelectedAnswers({});
    setIsSubmitted(false);
    setTimeLeft(test.durationMinutes * 60);
    setTimerRunning(true);
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setTimeLeft(activeTest.durationMinutes * 60);
    setTimerRunning(true);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  let score = 0;
  if (isSubmitted) {
    activeTest.questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        score++;
      }
    });
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
          Board & BCS Standard Evaluation
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Interactive Online Model Tests
        </h1>
        <p className="text-sm text-slate-500 leading-relaxed max-w-xl mx-auto">
          Timed model tests with instant answer analysis and grammatical explanations written by MD Touhidul Hoque Tuhin.
        </p>
      </div>

      {/* Select Test Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {availableTests.map((t) => (
          <button
            key={t.id}
            onClick={() => handleSwitchTest(t)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTest.id === t.id
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {t.title}
          </button>
        ))}
      </div>

      {/* Test Dashboard Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4 sticky top-18 z-30">
        <div>
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
            {activeTest.category}
          </span>
          <h3 className="font-bold text-slate-900 text-sm">
            {activeTest.title}
          </h3>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold bg-slate-900 text-white px-3 py-1.5 rounded-lg">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>{formatTime(timeLeft)}</span>
          </div>

          {!isSubmitted ? (
            <button
              onClick={handleSubmitTest}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
            >
              Submit Test
            </button>
          ) : (
            <button
              onClick={handleReset}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Retake
            </button>
          )}
        </div>
      </div>

      {/* Score Summary Card if submitted */}
      {isSubmitted && (
        <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white p-6 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 animate-in zoom-in-95">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
              Test Completed
            </span>
            <h3 className="text-2xl font-black text-white">
              Your Result: {score} out of {activeTest.questions.length} marks
            </h3>
            <p className="text-xs text-slate-300">
              {score >= activeTest.questions.length * 0.8
                ? 'Outstanding performance! You have strong grammatical command.'
                : 'Good effort! Review the detailed explanations below to cement your rules.'}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-center p-3 rounded-2xl bg-white/10 backdrop-blur-xs min-w-24">
              <span className="text-2xl font-black text-emerald-300">
                {Math.round((score / activeTest.questions.length) * 100)}%
              </span>
              <span className="block text-[10px] text-slate-300 uppercase font-bold">Accuracy</span>
            </div>
            <button
              onClick={handleReset}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-6">
        {activeTest.questions.map((q, idx) => {
          const studentChoice = selectedAnswers[q.id];
          const isCorrect = studentChoice === q.correctAnswer;

          return (
            <div
              key={q.id}
              className={`bg-white rounded-2xl border p-6 shadow-xs space-y-4 transition-all ${
                isSubmitted
                  ? isCorrect
                    ? 'border-emerald-300 bg-emerald-50/20'
                    : 'border-rose-300 bg-rose-50/20'
                  : 'border-slate-200'
              }`}
            >
              {/* Question text */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                    {q.question}
                  </h4>
                </div>

                {isSubmitted && (
                  <div>
                    {isCorrect ? (
                      <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Correct
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-rose-600 flex items-center gap-1">
                        <XCircle className="w-4 h-4" /> Wrong
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {q.options.map((opt, optIdx) => {
                  const isSelected = studentChoice === optIdx;
                  const isThisCorrect = q.correctAnswer === optIdx;

                  let optClass = "border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700";

                  if (!isSubmitted) {
                    if (isSelected) {
                      optClass = "border-emerald-600 bg-emerald-50 text-emerald-900 font-semibold";
                    }
                  } else {
                    if (isThisCorrect) {
                      optClass = "border-emerald-500 bg-emerald-100 text-emerald-900 font-bold";
                    } else if (isSelected) {
                      optClass = "border-rose-400 bg-rose-100 text-rose-900 line-through";
                    } else {
                      optClass = "opacity-60 border-slate-200 text-slate-500";
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={isSubmitted}
                      onClick={() => handleSelectAnswer(q.id, optIdx)}
                      className={`p-3 rounded-xl border text-xs text-left transition-all flex items-center justify-between ${optClass}`}
                    >
                      <span>
                        <strong className="mr-1.5">{String.fromCharCode(65 + optIdx)}.</strong>
                        {opt}
                      </span>
                      {isSubmitted && isThisCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation upon submission */}
              {isSubmitted && (
                <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-700 space-y-1">
                  <span className="font-bold text-slate-900 block flex items-center gap-1.5 text-[11px] uppercase tracking-wide">
                    <HelpCircle className="w-3.5 h-3.5 text-emerald-600" /> Tuhin Sir's Grammatical Analysis:
                  </span>
                  <p className="leading-relaxed">{q.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Floating Submit in Footer if not submitted */}
      {!isSubmitted && (
        <div className="text-center pt-4">
          <button
            onClick={handleSubmitTest}
            className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition-all"
          >
            Submit All Answers ({Object.keys(selectedAnswers).length}/{activeTest.questions.length} answered)
          </button>
        </div>
      )}
    </div>
  );
};
