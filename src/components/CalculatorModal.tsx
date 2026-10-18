import React, { useState } from 'react';
import { Calculator as CalcIcon, X, Delete, Percent, RotateCcw, Award } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CalculatorModal: React.FC = () => {
  const { lang, isCalcOpen, setIsCalcOpen } = useApp();
  const [activeTab, setActiveTab] = useState<'standard' | 'gpa'>('standard');
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');

  // GPA quick calculator state
  const [gpaMarks, setGpaMarks] = useState<string>('');
  const [gpaTotalMarks, setGpaTotalMarks] = useState<string>('100');

  if (!isCalcOpen) return null;

  const handleDigit = (d: string) => {
    if (display === '0' && d !== '.') {
      setDisplay(d);
    } else {
      if (d === '.' && display.includes('.')) return;
      setDisplay(display + d);
    }
  };

  const handleOp = (op: string) => {
    setEquation(display + ' ' + op + ' ');
    setDisplay('0');
  };

  const handleClear = () => {
    setDisplay('0');
    setEquation('');
  };

  const handleBackspace = () => {
    if (display.length <= 1) {
      setDisplay('0');
    } else {
      setDisplay(display.slice(0, -1));
    }
  };

  const handleCalculate = () => {
    try {
      const fullExpr = equation + display;
      // Sanitize input to only allowed math characters
      if (!/^[0-9+\-*/. ()]+$/.test(fullExpr)) {
        setDisplay('Error');
        return;
      }
      // Simple evaluator
      // eslint-disable-next-line no-eval
      const result = Function(`'use strict'; return (${fullExpr})`)();
      setDisplay(String(Number(result.toFixed(4))));
      setEquation('');
    } catch {
      setDisplay('Error');
    }
  };

  // GPA calculation logic
  const marksNum = parseFloat(gpaMarks) || 0;
  const totalNum = parseFloat(gpaTotalMarks) || 100;
  const pct = totalNum > 0 ? (marksNum / totalNum) * 100 : 0;

  let gpaCalc = '0.00';
  let gradeCalc = 'F';

  if (pct >= 80) { gpaCalc = '5.00'; gradeCalc = 'A+'; }
  else if (pct >= 70) { gpaCalc = '4.00'; gradeCalc = 'A'; }
  else if (pct >= 60) { gpaCalc = '3.50'; gradeCalc = 'A-'; }
  else if (pct >= 50) { gpaCalc = '3.00'; gradeCalc = 'B'; }
  else if (pct >= 40) { gpaCalc = '2.00'; gradeCalc = 'C'; }
  else if (pct >= 33) { gpaCalc = '1.00'; gradeCalc = 'D'; }
  else { gpaCalc = '0.00'; gradeCalc = 'F'; }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-3xl max-w-sm w-full shadow-2xl overflow-hidden border border-slate-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CalcIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">
                {lang === 'bn' ? 'স্মার্ট ক্যালকুলেটর' : 'Smart Academic Calculator'}
              </h3>
              <p className="text-[10px] text-slate-400">
                {lang === 'bn' ? 'হিসাব ও জিপিএ রূপান্তর' : 'Standard & GPA Calculator'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCalcOpen(false)}
            className="p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-100 bg-slate-50 text-xs font-bold">
          <button
            onClick={() => setActiveTab('standard')}
            className={`flex-1 py-2.5 text-center transition-colors ${
              activeTab === 'standard'
                ? 'bg-white text-emerald-700 border-b-2 border-emerald-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {lang === 'bn' ? 'সাধারণ ক্যালকুলেটর' : 'Standard Calculator'}
          </button>
          <button
            onClick={() => setActiveTab('gpa')}
            className={`flex-1 py-2.5 text-center transition-colors ${
              activeTab === 'gpa'
                ? 'bg-white text-emerald-700 border-b-2 border-emerald-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {lang === 'bn' ? 'জিপিএ ও গ্রেড ক্যালকুলেটর' : 'GPA & Grade Converter'}
          </button>
        </div>

        {/* Standard Calculator Tab */}
        {activeTab === 'standard' && (
          <div className="p-4 space-y-3">
            {/* Screen */}
            <div className="bg-slate-900 rounded-2xl p-4 text-right">
              <div className="h-4 text-[11px] font-mono text-slate-400 overflow-hidden">
                {equation}
              </div>
              <div className="text-2xl font-mono font-bold text-white tracking-wider truncate">
                {display}
              </div>
            </div>

            {/* Keypad */}
            <div className="grid grid-cols-4 gap-2">
              <button onClick={handleClear} className="p-3 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold text-xs">
                C
              </button>
              <button onClick={handleBackspace} className="p-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center">
                <Delete className="w-4 h-4" />
              </button>
              <button onClick={() => handleOp('%')} className="p-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs">
                %
              </button>
              <button onClick={() => handleOp('/')} className="p-3 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-sm">
                ÷
              </button>

              <button onClick={() => handleDigit('7')} className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-sm">
                7
              </button>
              <button onClick={() => handleDigit('8')} className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-sm">
                8
              </button>
              <button onClick={() => handleDigit('9')} className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-sm">
                9
              </button>
              <button onClick={() => handleOp('*')} className="p-3 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-sm">
                ×
              </button>

              <button onClick={() => handleDigit('4')} className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-sm">
                4
              </button>
              <button onClick={() => handleDigit('5')} className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-sm">
                5
              </button>
              <button onClick={() => handleDigit('6')} className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-sm">
                6
              </button>
              <button onClick={() => handleOp('-')} className="p-3 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-sm">
                -
              </button>

              <button onClick={() => handleDigit('1')} className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-sm">
                1
              </button>
              <button onClick={() => handleDigit('2')} className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-sm">
                2
              </button>
              <button onClick={() => handleDigit('3')} className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-sm">
                3
              </button>
              <button onClick={() => handleOp('+')} className="p-3 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-sm">
                +
              </button>

              <button onClick={() => handleDigit('0')} className="col-span-2 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-sm">
                0
              </button>
              <button onClick={() => handleDigit('.')} className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-sm">
                .
              </button>
              <button onClick={handleCalculate} className="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-sm">
                =
              </button>
            </div>
          </div>
        )}

        {/* GPA Converter Tab */}
        {activeTab === 'gpa' && (
          <div className="p-5 space-y-4 text-xs">
            <div className="space-y-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  {lang === 'bn' ? 'প্রাপ্ত নম্বর (Obtained Marks)' : 'Obtained Marks'}
                </label>
                <input
                  type="number"
                  placeholder="e.g. 85"
                  value={gpaMarks}
                  onChange={(e) => setGpaMarks(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  {lang === 'bn' ? 'মোট পূর্ণমান (Full Marks)' : 'Full Marks'}
                </label>
                <input
                  type="number"
                  placeholder="e.g. 100"
                  value={gpaTotalMarks}
                  onChange={(e) => setGpaTotalMarks(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* GPA Result Card */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center space-y-2">
              <div className="flex items-center justify-center gap-1.5 text-emerald-800 font-bold">
                <Award className="w-4 h-4 text-emerald-600" />
                <span>{lang === 'bn' ? 'ফলাফল হিসাব' : 'Calculated GPA'}</span>
              </div>
              <div className="flex items-center justify-around pt-1">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Percentage</span>
                  <span className="text-xl font-black text-slate-900">{pct.toFixed(1)}%</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">GPA (5.00)</span>
                  <span className="text-2xl font-black text-emerald-700">{gpaCalc}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Grade</span>
                  <span className="text-xl font-black text-slate-900">{gradeCalc}</span>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 text-center leading-relaxed">
              {lang === 'bn' 
                ? 'বোর্ড স্ট্যান্ডার্ড গ্রেডিং সিস্টেম (৮০+ = A+, ৭০-৭৯ = A, ৬০-৬৯ = A-, ৫০-৫৯ = B, ৪০-৪৯ = C, ৩৩-৩৯ = D)'
                : 'Bangladesh Education Board Grading standard (80+ = A+, 70-79 = A, 60-69 = A-, 50-59 = B, 40-49 = C, 33-39 = D)'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
