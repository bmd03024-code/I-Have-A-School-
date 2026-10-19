import React from 'react';
import { X, Printer } from 'lucide-react';
import { StudentResult, Student, Course, CourseSubject, CourseExam, SchoolSettings, Language } from '../../types';

interface PrintableResultSheetProps {
  results: StudentResult[];
  students: Student[];
  courses: Course[];
  subjects: CourseSubject[];
  exams: CourseExam[];
  academicYear: string;
  selectedCourseId: string;
  selectedExamId: string;
  schoolSettings: SchoolSettings;
  lang: Language;
  onClose: () => void;
}

export const PrintableResultSheet: React.FC<PrintableResultSheetProps> = ({
  results,
  students,
  courses,
  subjects,
  exams,
  academicYear,
  selectedCourseId,
  selectedExamId,
  schoolSettings,
  lang,
  onClose
}) => {
  const currentCourse = courses.find((c) => c.id === selectedCourseId);
  const currentExam = exams.find((e) => e.id === selectedExamId);
  const courseSubjects = subjects.filter((s) => s.courseId === selectedCourseId);

  const filteredResults = results.filter((r) => {
    const matchYear = academicYear === 'all' || r.academicYear === academicYear;
    const matchCourse = selectedCourseId === 'all' || r.courseId === selectedCourseId;
    const matchExam = selectedExamId === 'all' || r.examId === selectedExamId;
    return matchYear && matchCourse && matchExam;
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-3xl max-w-5xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded uppercase">
              TABULATION SHEET
            </span>
            <h3 className="text-sm font-bold text-slate-100">
              {lang === 'bn' ? 'ফলাফল ব্রডশিট প্রিন্ট প্রিভিউ' : 'Official Result Tabulation Broadsheet'}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Broadsheet Content */}
        <div className="p-8 overflow-y-auto bg-white text-slate-900 flex-1 space-y-6">
          {/* Institutional Header */}
          <div className="text-center pb-4 border-b-2 border-slate-900 space-y-1 relative">
            <div className="flex items-center justify-center gap-3">
              {schoolSettings.logoUrl && (
                <img src={schoolSettings.logoUrl} alt="Logo" className="w-12 h-12 object-contain" />
              )}
              <div>
                <h1 className="text-2xl font-black tracking-tight text-slate-900">
                  {schoolSettings.instituteNameBn}
                </h1>
                <p className="text-xs font-bold text-slate-600 uppercase tracking-widest">
                  {schoolSettings.instituteNameEn}
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-500">
              {schoolSettings.addressBn} • ফোন: {schoolSettings.phone}
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-bold">
              <span className="bg-slate-100 px-3 py-1 rounded border border-slate-300">
                কোর্স: {currentCourse ? currentCourse.titleBn : 'সকল কোর্স'}
              </span>
              <span className="bg-slate-100 px-3 py-1 rounded border border-slate-300">
                পরীক্ষা: {currentExam ? currentExam.name : 'সকল পরীক্ষা'}
              </span>
              <span className="bg-slate-100 px-3 py-1 rounded border border-slate-300">
                শিক্ষাবর্ষ: {academicYear === 'all' ? 'সকল বছর' : academicYear}
              </span>
            </div>
          </div>

          {/* Results Table */}
          {filteredResults.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm italic">
              {lang === 'bn' ? 'নির্বাচিত ফিল্টারে কোনো ফলাফল পাওয়া যায়নি।' : 'No examination results match the selected filter.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse border border-slate-300 text-xs">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300 font-bold text-slate-800">
                    <th className="p-2.5 border border-slate-300 text-center w-12">ক্র.</th>
                    <th className="p-2.5 border border-slate-300 text-center w-16">রোল</th>
                    <th className="p-2.5 border border-slate-300">শিক্ষার্থীর নাম</th>
                    {courseSubjects.map((sub) => (
                      <th key={sub.id} className="p-2.5 border border-slate-300 text-center">
                        {sub.name} <br />
                        <span className="text-[10px] font-normal text-slate-500">({sub.fullMarks})</span>
                      </th>
                    ))}
                    <th className="p-2.5 border border-slate-300 text-center font-black">মোট নম্বর</th>
                    <th className="p-2.5 border border-slate-300 text-center">%</th>
                    <th className="p-2.5 border border-slate-300 text-center font-black">জিপিএ</th>
                    <th className="p-2.5 border border-slate-300 text-center font-black">গ্রেড</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResults.map((res, idx) => {
                    const st = students.find((s) => s.roll === res.studentRoll);
                    return (
                      <tr key={res.id} className="border-b border-slate-200 hover:bg-slate-50">
                        <td className="p-2.5 border border-slate-300 text-center">{idx + 1}</td>
                        <td className="p-2.5 border border-slate-300 text-center font-bold font-mono">
                          {res.studentRoll}
                        </td>
                        <td className="p-2.5 border border-slate-300">
                          <div className="font-bold text-slate-900">{st ? (st.nameBn || st.nameEn) : `Roll: ${res.studentRoll}`}</div>
                          <div className="text-[10px] text-slate-500">{st?.fatherNameBn || ''}</div>
                        </td>
                        {courseSubjects.map((sub) => {
                          const mark = res.subjectMarks[sub.id] ?? '-';
                          const isFail = typeof mark === 'number' && mark < sub.passMarks;
                          return (
                            <td 
                              key={sub.id} 
                              className={`p-2.5 border border-slate-300 text-center font-semibold ${isFail ? 'text-red-600 font-bold bg-red-50' : 'text-slate-800'}`}
                            >
                              {mark}
                            </td>
                          );
                        })}
                        <td className="p-2.5 border border-slate-300 text-center font-bold text-slate-900">
                          {res.totalMarks} / {res.totalFullMarks}
                        </td>
                        <td className="p-2.5 border border-slate-300 text-center">
                          {res.percentage.toFixed(1)}%
                        </td>
                        <td className="p-2.5 border border-slate-300 text-center font-bold text-emerald-700">
                          {res.gpa.toFixed(2)}
                        </td>
                        <td className="p-2.5 border border-slate-300 text-center">
                          <span className={`px-2 py-0.5 rounded font-black text-xs ${
                            res.grade === 'F' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {res.grade}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer Signature & Seal Block */}
          <div className="pt-10 flex items-end justify-between border-t border-slate-200 text-xs">
            <div className="text-center">
              <div className="w-24 border-b border-slate-600 mb-1" />
              <span className="font-semibold text-slate-600">পরীক্ষা নিয়ন্ত্রক</span>
            </div>

            <div className="text-center">
              {schoolSettings.officialSealUrl ? (
                <img src={schoolSettings.officialSealUrl} alt="Seal" className="h-12 w-12 mx-auto object-contain mb-1" />
              ) : (
                <div className="w-12 h-12 rounded-full border border-dashed border-emerald-600 mx-auto mb-1 flex items-center justify-center text-[8px] text-emerald-800 font-bold">
                  SEAL
                </div>
              )}
              <span className="text-[10px] text-slate-400">অফিসিয়াল সিল</span>
            </div>

            <div className="text-center">
              {schoolSettings.headmasterSignatureUrl ? (
                <img src={schoolSettings.headmasterSignatureUrl} alt="Signature" className="h-10 mx-auto object-contain mb-1" />
              ) : (
                <div className="h-10 w-24 border-b border-slate-600 mb-1 mx-auto" />
              )}
              <span className="font-bold text-slate-900">এমডি তৌহিদুল হক তুহিন</span>
              <p className="text-[10px] text-slate-500">প্রধান শিক্ষক ও প্রতিষ্ঠাতা</p>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="px-6 py-4 bg-white border-t border-slate-200 flex items-center justify-between print:hidden">
          <span className="text-xs text-slate-500">
            {lang === 'bn' ? `মোট ${filteredResults.length} জন শিক্ষার্থীর ফলাফল প্রস্তুত` : `${filteredResults.length} records ready for broadsheet export`}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              {lang === 'bn' ? 'বন্ধ করুন' : 'Cancel'}
            </button>
            <button
              onClick={handlePrint}
              disabled={filteredResults.length === 0}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all"
            >
              <Printer className="w-4 h-4" />
              {lang === 'bn' ? 'ফলাফল তালিকা প্রিন্ট করুন' : 'Print Result Sheet'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
