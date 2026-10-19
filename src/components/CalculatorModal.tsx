import React, { useState } from 'react';
import { Calculator as CalcIcon, X, Delete, RotateCcw, Award, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CalculatorModal: React.FC = () => {
  const { lang, isCalcOpen, setIsCalcOpen } = useApp();
  const [activeTab, setActiveTab] = useState<'scientific' | 'gpa'>('scientific');
  
  // Calculator state
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [isRad, setIsRad] = useState(false); // Default to Degree (DEG)
  const [lastAnswer, setLastAnswer] = useState<string>('0');
  const [memory, setMemory] = useState<number>(0);
  const [justCalculated, setJustCalculated] = useState(false);

  // GPA Calculator state
  const [gpaMarks, setGpaMarks] = useState<string>('');
  const [gpaTotalMarks, setGpaTotalMarks] = useState<string>('100');

  if (!isCalcOpen) return null;

  // Helper for factorial
  const factorial = (n: number): number => {
    if (n < 0 || !Number.isInteger(n)) return NaN;
    if (n === 0 || n === 1) return 1;
    let res = 1;
    for (let i = 2; i <= Math.min(n, 170); i++) res *= i;
    return res;
  };

  // Convert to radians if in DEG mode
  const toRad = (angle: number) => (isRad ? angle : (angle * Math.PI) / 180);
  // Convert from radians to degrees if in DEG mode
  const fromRad = (rad: number) => (isRad ? rad : (rad * 180) / Math.PI);

  const handleDigit = (d: string) => {
    if (justCalculated) {
      setDisplay(d === '.' ? '0.' : d);
      setExpression('');
      setJustCalculated(false);
      return;
    }

    if (display === '0' && d !== '.') {
      setDisplay(d);
    } else {
      if (d === '.' && display.includes('.')) return;
      setDisplay(display + d);
    }
  };

  const handleOperator = (op: string) => {
    setJustCalculated(false);
    if (expression && !justCalculated && display === '0') {
      // replace operator
      setExpression((prev) => prev.slice(0, -2) + op + ' ');
      return;
    }
    setExpression((prev) => prev + display + ' ' + op + ' ');
    setDisplay('0');
  };

  const handleClear = () => {
    setDisplay('0');
    setExpression('');
    setJustCalculated(false);
  };

  const handleBackspace = () => {
    if (justCalculated) {
      handleClear();
      return;
    }
    if (display.length <= 1 || display === 'Error') {
      setDisplay('0');
    } else {
      setDisplay(display.slice(0, -1));
    }
  };

  // Immediate scientific functions on current display number
  const handleImmediateFn = (fnName: string) => {
    const val = parseFloat(display);
    if (isNaN(val)) return;

    let res = 0;
    try {
      switch (fnName) {
        case 'sin':
          res = Math.sin(toRad(val));
          break;
        case 'cos':
          res = Math.cos(toRad(val));
          break;
        case 'tan': {
          const mod = isRad ? val % Math.PI : val % 180;
          if (mod === 90 || mod === -90) {
            setDisplay('Undefined');
            return;
          }
          res = Math.tan(toRad(val));
          break;
        }
        case 'asin':
          if (val < -1 || val > 1) {
            setDisplay('Error');
            return;
          }
          res = fromRad(Math.asin(val));
          break;
        case 'acos':
          if (val < -1 || val > 1) {
            setDisplay('Error');
            return;
          }
          res = fromRad(Math.acos(val));
          break;
        case 'atan':
          res = fromRad(Math.atan(val));
          break;
        case 'sinh':
          res = Math.sinh(val);
          break;
        case 'cosh':
          res = Math.cosh(val);
          break;
        case 'tanh':
          res = Math.tanh(val);
          break;
        case 'ln':
          if (val <= 0) {
            setDisplay('Error');
            return;
          }
          res = Math.log(val);
          break;
        case 'log':
          if (val <= 0) {
            setDisplay('Error');
            return;
          }
          res = Math.log10(val);
          break;
        case 'log2':
          if (val <= 0) {
            setDisplay('Error');
            return;
          }
          res = Math.log2(val);
          break;
        case 'sqrt':
          if (val < 0) {
            setDisplay('Error');
            return;
          }
          res = Math.sqrt(val);
          break;
        case 'cbrt':
          res = Math.cbrt(val);
          break;
        case 'sq':
          res = Math.pow(val, 2);
          break;
        case 'cube':
          res = Math.pow(val, 3);
          break;
        case 'exp':
          res = Math.exp(val);
          break;
        case 'pow10':
          res = Math.pow(10, val);
          break;
        case 'fact':
          res = factorial(val);
          break;
        case 'inv':
          if (val === 0) {
            setDisplay('Error');
            return;
          }
          res = 1 / val;
          break;
        case 'abs':
          res = Math.abs(val);
          break;
        case 'neg':
          res = -val;
          break;
        default:
          return;
      }

      // Format result to avoid floating point inaccuracies
      const formatted = Number.isInteger(res)
        ? String(res)
        : parseFloat(res.toPrecision(10)).toString();

      setDisplay(formatted);
      setJustCalculated(true);
    } catch {
      setDisplay('Error');
    }
  };

  const handleInsertConstant = (name: 'pi' | 'e') => {
    const val = name === 'pi' ? Math.PI : Math.E;
    setDisplay(parseFloat(val.toPrecision(10)).toString());
    setJustCalculated(true);
  };

  const handleParenthesis = (p: '(' | ')') => {
    if (p === '(') {
      if (display !== '0') {
        setExpression((prev) => prev + display + ' * ( ');
      } else {
        setExpression((prev) => prev + '( ');
      }
      setDisplay('0');
    } else {
      setExpression((prev) => prev + display + ' ) ');
      setDisplay('0');
    }
  };

  const handleCalculate = () => {
    try {
      let fullExpr = expression + display;
      // Replace power and times symbols for evaluation
      fullExpr = fullExpr.replace(/×/g, '*').replace(/÷/g, '/').replace(/\^/g, '**');

      // Sanitize input to only allowed characters
      if (!/^[0-9+\-*/(). eE*]+$/.test(fullExpr)) {
        setDisplay('Error');
        return;
      }

      // Safe calculation evaluation
      // eslint-disable-next-line no-eval
      const evaluated = Function(`'use strict'; return (${fullExpr})`)();

      if (!isFinite(evaluated) || isNaN(evaluated)) {
        setDisplay('Error');
        return;
      }

      const formatted = Number.isInteger(evaluated)
        ? String(evaluated)
        : parseFloat(evaluated.toPrecision(10)).toString();

      setDisplay(formatted);
      setLastAnswer(formatted);
      setExpression('');
      setJustCalculated(true);
    } catch {
      setDisplay('Error');
    }
  };

  // Memory functions
  const handleMemory = (action: 'mc' | 'mr' | 'm+' | 'm-') => {
    const current = parseFloat(display) || 0;
    switch (action) {
      case 'mc':
        setMemory(0);
        break;
      case 'mr':
        setDisplay(String(memory));
        setJustCalculated(true);
        break;
      case 'm+':
        setMemory((prev) => prev + current);
        break;
      case 'm-':
        setMemory((prev) => prev - current);
        break;
    }
  };

  // GPA calculation
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
    <div 
      className="!fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md"
      onClick={() => setIsCalcOpen(false)}
    >
      <div
        className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl shadow-indigo-950/50 flex flex-col text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-teal-950 px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <CalcIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <span>{lang === 'bn' ? 'ভাসমান সায়েন্টিফিক ক্যালকুলেটর' : 'Floating Scientific Calculator'}</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-extrabold px-1.5 py-0.5 rounded uppercase">
                  {lang === 'bn' ? 'প্রো ম্যাথ' : 'Pro Math'}
                </span>
              </h3>
              <p className="text-[10px] text-slate-400">
                {lang === 'bn' ? 'ত্রিকোণমিতি, লগ, ঘাত ও একাডেমিক জিপিএ হিসাব' : 'Trig, Logs, Powers & Academic GPA'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCalcOpen(false)}
              className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 text-xs font-bold">
          <button
            onClick={() => setActiveTab('scientific')}
            className={`flex-1 py-2.5 text-center transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'scientific'
                ? 'bg-slate-900 text-emerald-400 border-b-2 border-emerald-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'সম্পূর্ণ সায়েন্টিফিক মোড' : 'Full Scientific Mode'}</span>
          </button>
          <button
            onClick={() => setActiveTab('gpa')}
            className={`flex-1 py-2.5 text-center transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'gpa'
                ? 'bg-slate-900 text-emerald-400 border-b-2 border-emerald-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'জিপিএ ও গ্রেড কনভার্টার' : 'GPA & Grade Converter'}</span>
          </button>
        </div>

        {/* Scientific Calculator View */}
        {activeTab === 'scientific' && (
          <div className="p-4 sm:p-5 space-y-3">
            {/* Display screen */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-right shadow-inner">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsRad(!isRad)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors ${
                      isRad
                        ? 'bg-teal-900/50 text-teal-300 border-teal-600/50'
                        : 'bg-emerald-900/50 text-emerald-300 border-emerald-600/50'
                    }`}
                  >
                    {isRad ? 'RAD' : 'DEG'}
                  </button>
                  {memory !== 0 && (
                    <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-1 rounded">
                      M
                    </span>
                  )}
                </div>
                <div className="truncate max-w-[260px] overflow-hidden text-right text-slate-400">
                  {expression || '\u00A0'}
                </div>
              </div>

              <div className="text-2xl sm:text-3xl font-mono font-bold text-white tracking-wider truncate">
                {display}
              </div>
            </div>

            {/* Scientific Function Grid */}
            <div className="space-y-1.5">
              {/* Row 1: Memory & Trig Toggles */}
              <div className="grid grid-cols-6 gap-1.5 text-xs font-semibold">
                <button onClick={() => handleMemory('mc')} className="py-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors">
                  MC
                </button>
                <button onClick={() => handleMemory('mr')} className="py-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors">
                  MR
                </button>
                <button onClick={() => handleMemory('m+')} className="py-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors">
                  M+
                </button>
                <button onClick={() => handleImmediateFn('sin')} className="py-2 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800/50 transition-colors">
                  sin
                </button>
                <button onClick={() => handleImmediateFn('cos')} className="py-2 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800/50 transition-colors">
                  cos
                </button>
                <button onClick={() => handleImmediateFn('tan')} className="py-2 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800/50 transition-colors">
                  tan
                </button>
              </div>

              {/* Row 2: Inverse Trig & Logs */}
              <div className="grid grid-cols-6 gap-1.5 text-xs font-semibold">
                <button onClick={() => handleImmediateFn('asin')} className="py-2 rounded-lg bg-slate-800/60 hover:bg-slate-700 text-slate-300 transition-colors">
                  sin⁻¹
                </button>
                <button onClick={() => handleImmediateFn('acos')} className="py-2 rounded-lg bg-slate-800/60 hover:bg-slate-700 text-slate-300 transition-colors">
                  cos⁻¹
                </button>
                <button onClick={() => handleImmediateFn('atan')} className="py-2 rounded-lg bg-slate-800/60 hover:bg-slate-700 text-slate-300 transition-colors">
                  tan⁻¹
                </button>
                <button onClick={() => handleImmediateFn('ln')} className="py-2 rounded-lg bg-teal-950/60 hover:bg-teal-900/60 text-teal-300 border border-teal-800/50 transition-colors">
                  ln
                </button>
                <button onClick={() => handleImmediateFn('log')} className="py-2 rounded-lg bg-teal-950/60 hover:bg-teal-900/60 text-teal-300 border border-teal-800/50 transition-colors">
                  log
                </button>
                <button onClick={() => handleImmediateFn('fact')} className="py-2 rounded-lg bg-teal-950/60 hover:bg-teal-900/60 text-teal-300 border border-teal-800/50 transition-colors">
                  n!
                </button>
              </div>

              {/* Row 3: Powers & Roots */}
              <div className="grid grid-cols-6 gap-1.5 text-xs font-semibold">
                <button onClick={() => handleImmediateFn('sq')} className="py-2 rounded-lg bg-slate-800/60 hover:bg-slate-700 text-slate-300 transition-colors">
                  x²
                </button>
                <button onClick={() => handleImmediateFn('cube')} className="py-2 rounded-lg bg-slate-800/60 hover:bg-slate-700 text-slate-300 transition-colors">
                  x³
                </button>
                <button onClick={() => handleOperator('^')} className="py-2 rounded-lg bg-slate-800/60 hover:bg-slate-700 text-slate-300 transition-colors">
                  xʸ
                </button>
                <button onClick={() => handleImmediateFn('sqrt')} className="py-2 rounded-lg bg-slate-800/60 hover:bg-slate-700 text-slate-300 transition-colors">
                  √x
                </button>
                <button onClick={() => handleImmediateFn('cbrt')} className="py-2 rounded-lg bg-slate-800/60 hover:bg-slate-700 text-slate-300 transition-colors">
                  ∛x
                </button>
                <button onClick={() => handleImmediateFn('inv')} className="py-2 rounded-lg bg-slate-800/60 hover:bg-slate-700 text-slate-300 transition-colors">
                  1/x
                </button>
              </div>

              {/* Row 4: Constants & Parentheses */}
              <div className="grid grid-cols-6 gap-1.5 text-xs font-semibold">
                <button onClick={() => handleInsertConstant('pi')} className="py-2 rounded-lg bg-slate-800/70 hover:bg-slate-700 text-amber-300 transition-colors">
                  π
                </button>
                <button onClick={() => handleInsertConstant('e')} className="py-2 rounded-lg bg-slate-800/70 hover:bg-slate-700 text-amber-300 transition-colors">
                  e
                </button>
                <button onClick={() => handleParenthesis('(')} className="py-2 rounded-lg bg-slate-800/70 hover:bg-slate-700 text-slate-200 transition-colors">
                  (
                </button>
                <button onClick={() => handleParenthesis(')')} className="py-2 rounded-lg bg-slate-800/70 hover:bg-slate-700 text-slate-200 transition-colors">
                  )
                </button>
                <button onClick={() => handleImmediateFn('exp')} className="py-2 rounded-lg bg-slate-800/70 hover:bg-slate-700 text-slate-300 transition-colors">
                  eˣ
                </button>
                <button onClick={() => handleImmediateFn('pow10')} className="py-2 rounded-lg bg-slate-800/70 hover:bg-slate-700 text-slate-300 transition-colors">
                  10ˣ
                </button>
              </div>

              {/* Main Keypad: 4 Columns */}
              <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-800 text-sm font-bold">
                <button
                  onClick={handleClear}
                  className="py-3 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30 transition-colors"
                >
                  AC
                </button>
                <button
                  onClick={handleBackspace}
                  className="py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
                >
                  <Delete className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleOperator('%')}
                  className="py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  %
                </button>
                <button
                  onClick={() => handleOperator('÷')}
                  className="py-3 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/40 text-emerald-400 border border-emerald-500/30 transition-colors"
                >
                  ÷
                </button>

                <button onClick={() => handleDigit('7')} className="py-3 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 text-white transition-colors">
                  7
                </button>
                <button onClick={() => handleDigit('8')} className="py-3 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 text-white transition-colors">
                  8
                </button>
                <button onClick={() => handleDigit('9')} className="py-3 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 text-white transition-colors">
                  9
                </button>
                <button
                  onClick={() => handleOperator('×')}
                  className="py-3 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/40 text-emerald-400 border border-emerald-500/30 transition-colors"
                >
                  ×
                </button>

                <button onClick={() => handleDigit('4')} className="py-3 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 text-white transition-colors">
                  4
                </button>
                <button onClick={() => handleDigit('5')} className="py-3 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 text-white transition-colors">
                  5
                </button>
                <button onClick={() => handleDigit('6')} className="py-3 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 text-white transition-colors">
                  6
                </button>
                <button
                  onClick={() => handleOperator('-')}
                  className="py-3 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/40 text-emerald-400 border border-emerald-500/30 transition-colors"
                >
                  -
                </button>

                <button onClick={() => handleDigit('1')} className="py-3 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 text-white transition-colors">
                  1
                </button>
                <button onClick={() => handleDigit('2')} className="py-3 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 text-white transition-colors">
                  2
                </button>
                <button onClick={() => handleDigit('3')} className="py-3 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 text-white transition-colors">
                  3
                </button>
                <button
                  onClick={() => handleOperator('+')}
                  className="py-3 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/40 text-emerald-400 border border-emerald-500/30 transition-colors"
                >
                  +
                </button>

                <button
                  onClick={() => handleImmediateFn('neg')}
                  className="py-3 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 text-slate-300 transition-colors"
                >
                  ±
                </button>
                <button onClick={() => handleDigit('0')} className="py-3 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 text-white transition-colors">
                  0
                </button>
                <button onClick={() => handleDigit('.')} className="py-3 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 text-white transition-colors">
                  .
                </button>
                <button
                  onClick={handleCalculate}
                  className="py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-base shadow-lg transition-all"
                >
                  =
                </button>
              </div>

              {/* Bottom auxiliary toolbar */}
              <div className="flex items-center justify-between text-[11px] pt-1 text-slate-400 px-1 font-mono">
                <span>Ans: {lastAnswer}</span>
                <span className="text-[10px] text-emerald-400/80 font-sans">
                  {lang === 'bn' ? 'সায়েন্টিফিক ম্যাথ ইঞ্জিন সক্রিয়' : 'Scientific Math Engine Active'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* GPA Converter Tab */}
        {activeTab === 'gpa' && (
          <div className="p-5 space-y-4 text-xs">
            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  {lang === 'bn' ? 'প্রাপ্ত নম্বর (Obtained Marks)' : 'Obtained Marks'}
                </label>
                <input
                  type="number"
                  placeholder="e.g. 85"
                  value={gpaMarks}
                  onChange={(e) => setGpaMarks(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  {lang === 'bn' ? 'মোট পূর্ণমান (Full Marks)' : 'Full Marks'}
                </label>
                <input
                  type="number"
                  placeholder="e.g. 100"
                  value={gpaTotalMarks}
                  onChange={(e) => setGpaTotalMarks(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* GPA Result Card */}
            <div className="bg-gradient-to-br from-emerald-950/70 to-slate-950 border border-emerald-500/30 rounded-2xl p-4 text-center space-y-2">
              <div className="flex items-center justify-center gap-1.5 text-emerald-400 font-bold">
                <Award className="w-4 h-4" />
                <span>{lang === 'bn' ? 'ফলাফল ও জিপিএ রূপান্তর' : 'Calculated GPA & Grade'}</span>
              </div>
              <div className="flex items-center justify-around pt-1">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Percentage</span>
                  <span className="text-xl font-black text-white">{pct.toFixed(1)}%</span>
                </div>
                <div>
                  <span className="text-[10px] text-emerald-400 uppercase font-bold block">GPA (5.00)</span>
                  <span className="text-2xl font-black text-emerald-400">{gpaCalc}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Grade</span>
                  <span className="text-xl font-black text-amber-300">{gradeCalc}</span>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 text-center leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              {lang === 'bn'
                ? 'বাংলাদেশ শিক্ষা বোর্ড গ্রেডিং স্কেল: ৮০+ = A+, ৭০-৭৯ = A, ৬০-৬৯ = A-, ৫০-৫৯ = B, ৪০-৪৯ = C, ৩৩-৩৯ = D, <৩৩ = F'
                : 'Bangladesh Education Board Grading standard: 80+ = A+, 70-79 = A, 60-69 = A-, 50-59 = B, 40-49 = C, 33-39 = D, <33 = F'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
