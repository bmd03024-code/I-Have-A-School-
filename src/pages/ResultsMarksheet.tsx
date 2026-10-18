import React, { useState } from 'react';
import { Search, Printer, Award, CheckCircle2, School, User, Calendar, FileText, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StudentResult, Student, CourseSubject, Course, CourseExam } from '../types';

export const ResultsMarksheet: React.FC = () => {
  const { lang, results, students, courses, subjects, exams, schoolSettings, showToast } = useApp();
  
  const [academicYear, setAcademicYear] = useState('2026');
  const [courseId, setCourseId] = useState(courses[0]?.id || 'course-1');
  const [examId, setExamId] = useState(exams[0]?.id || 'exam-1');
  const [rollNumber, setRollNumber] = useState('101');
  
  const [matchedResult, setMatchedResult] = useState<StudentResult | null>(() => {
    return results.find((r: StudentResult) => r.studentRoll === '101' && r.academicYear === '2026') || results[0] || null;
  });
  const [matchedStudent, setMatchedStudent] = useState<Student | null>(() => {
    return students.find((s: Student) => s.roll === '101') || students[0] || null;
  });

  const availableExams = exams.filter((e: CourseExam) => e.courseId === courseId);
  const selectedCourse = courses.find((c: Course) => c.id === courseId);
  const selectedExam = exams.find((e: CourseExam) => e.id === examId);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanRoll = rollNumber.trim();
    if (!cleanRoll) {
      showToast(lang === 'bn' ? 'দয়া করে রোল নম্বর লিখুন।' : 'Please enter student roll number.');
      return;
    }

    const res = results.find(
      (r: StudentResult) => r.studentRoll === cleanRoll && r.academicYear === academicYear && r.courseId === courseId && r.examId === examId
    );

    const std = students.find(
      (s: Student) => s.roll === cleanRoll && s.academicYear === academicYear && s.courseId === courseId
    );

    if (res && std) {
      setMatchedResult(res);
      setMatchedStudent(std);
      showToast(lang === 'bn' ? 'ফলাফল পাওয়া গেছে!' : 'Official Marksheet generated successfully!');
    } else {
      setMatchedResult(null);
      setMatchedStudent(null);
      showToast(lang === 'bn' ? 'কোনো ফলাফল পাওয়া যায়নি। সঠিক তথ্য দিয়ে পুনরায় খুঁজুন।' : 'No result found for the selected criteria.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-2 print:hidden">
        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
          {lang === 'bn' ? 'অনলাইন ফলাফল ও মার্কশিট' : 'Online Results & Marksheet'}
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
          {lang === 'bn' ? 'অফিশিয়াল মার্কশিট যাচাই ও প্রিন্ট' : 'Verify & Print Academic Transcript'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          {lang === 'bn' 
            ? 'শিক্ষাবর্ষ, কোর্স, পরীক্ষার ধরণ ও রোল নম্বর দিয়ে তাৎক্ষণিক মার্কশিট সংগ্রহ করুন।' 
            : 'Enter Academic Year, Course, Exam and Roll to generate an authentic institutional marksheet.'}
        </p>
      </div>

      {/* Search Form (Hidden in print) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs print:hidden space-y-4">
        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          {/* Academic Year */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {lang === 'bn' ? 'শিক্ষাবর্ষ (Year)' : 'Academic Year'}
            </label>
            <select
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none"
            >
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2027">2027</option>
            </select>
          </div>

          {/* Course */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {lang === 'bn' ? 'কোর্স (Course)' : 'Course'}
            </label>
            <select
              value={courseId}
              onChange={(e) => {
                setCourseId(e.target.value);
                const ex = exams.find((x: CourseExam) => x.courseId === e.target.value);
                if (ex) setExamId(ex.id);
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none"
            >
              {courses.map((c: Course) => (
                <option key={c.id} value={c.id}>
                  {lang === 'bn' ? c.titleBn : c.titleEn}
                </option>
              ))}
            </select>
          </div>

          {/* Exam Type */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {lang === 'bn' ? 'পরীক্ষার ধরণ (Exam)' : 'Exam Type'}
            </label>
            <select
              value={examId}
              onChange={(e) => setExamId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none"
            >
              {availableExams.length === 0 ? (
                <option value="">No exam set</option>
              ) : (
                availableExams.map((ex: CourseExam) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.name}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Student Roll */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {lang === 'bn' ? 'রোল নম্বর (Roll)' : 'Roll Number'}
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 101"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none font-mono"
            />
          </div>

          {/* Search Button */}
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Search className="w-4 h-4" />
              <span>{lang === 'bn' ? 'মার্কশিট দেখুন' : 'Get Marksheet'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Generated Marksheet / Transcript */}
      {matchedResult && matchedStudent ? (
        <div className="space-y-4">
          <div className="flex justify-end print:hidden">
            <button
              onClick={handlePrint}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>{lang === 'bn' ? 'অফিশিয়াল মার্কশিট প্রিন্ট করুন' : 'Print Official Marksheet'}</span>
            </button>
          </div>

          {/* Print Sheet Container */}
          <div className="bg-white rounded-3xl border-2 border-slate-300 p-8 sm:p-12 shadow-xl space-y-8 relative overflow-hidden print:border-none print:shadow-none print:p-0 print:rounded-none">
            {/* Background watermarked seal */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
              <img
                src={schoolSettings.officialSealUrl}
                alt="Watermark Seal"
                className="w-96 h-96 object-contain"
              />
            </div>

            {/* Marksheet Header */}
            <div className="text-center space-y-2 border-b-2 border-slate-800 pb-6 relative z-10">
              <div className="flex items-center justify-center gap-3">
                <img
                  src={schoolSettings.logoUrl}
                  alt={schoolSettings.instituteNameEn}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-600"
                />
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    {lang === 'bn' ? schoolSettings.instituteNameBn : schoolSettings.instituteNameEn}
                  </h2>
                  <p className="text-xs text-slate-600 font-medium">
                    {lang === 'bn' ? schoolSettings.taglineBn : schoolSettings.taglineEn}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {lang === 'bn' ? schoolSettings.addressBn : schoolSettings.addressEn} • Phone: {schoolSettings.phone}
                  </p>
                </div>
              </div>

              <div className="pt-3">
                <span className="inline-block bg-slate-900 text-white text-xs sm:text-sm font-black uppercase tracking-widest px-4 py-1 rounded-full">
                  ACADEMIC TRANSCRIPT / MARKSHEET
                </span>
                <p className="text-xs font-bold text-emerald-800 mt-1">
                  {selectedExam?.name || 'Annual Examination'} • Session: {matchedResult.academicYear}
                </p>
              </div>
            </div>

            {/* Student & Course Particulars */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 relative z-10">
              <div>
                <span className="text-slate-400 block font-medium">Student Name:</span>
                <strong className="text-slate-900 block text-sm">{matchedStudent.nameEn}</strong>
                <span className="text-[11px] text-slate-600 font-medium">{matchedStudent.nameBn}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Roll Number:</span>
                <strong className="text-slate-900 block text-base font-mono">{matchedStudent.roll}</strong>
                <span className="text-[11px] text-slate-500">Year: {matchedResult.academicYear}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Father's Name:</span>
                <strong className="text-slate-900 block">{matchedStudent.fatherNameEn}</strong>
                <span className="text-slate-400 block font-medium mt-1">Mother's Name:</span>
                <strong className="text-slate-900 block">{matchedStudent.motherNameEn}</strong>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Course:</span>
                <strong className="text-emerald-800 block text-xs">{selectedCourse?.titleEn || 'English'}</strong>
                <span className="text-slate-400 block font-medium mt-1">Contact:</span>
                <span className="font-mono">{matchedStudent.phone}</span>
              </div>
            </div>

            {/* Subject-Wise Marks Breakdown Table */}
            <div className="relative z-10">
              <table className="w-full border-collapse border border-slate-300 text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                    <th className="p-3 text-left border border-slate-300">SL</th>
                    <th className="p-3 text-left border border-slate-300">Subject Name</th>
                    <th className="p-3 text-center border border-slate-300">Full Marks</th>
                    <th className="p-3 text-center border border-slate-300">Pass Marks</th>
                    <th className="p-3 text-center border border-slate-300">Marks Obtained</th>
                    <th className="p-3 text-center border border-slate-300">Letter Grade</th>
                    <th className="p-3 text-center border border-slate-300">Grade Point</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(matchedResult.subjectMarks).map(([subId, marks], idx) => {
                    const subInfo = subjects.find((s: CourseSubject) => s.id === subId);
                    const subPct = subInfo ? (marks / subInfo.fullMarks) * 100 : marks;
                    let gp = 0;
                    let lg = 'F';

                    if (subPct >= 80) { gp = 5.0; lg = 'A+'; }
                    else if (subPct >= 70) { gp = 4.0; lg = 'A'; }
                    else if (subPct >= 60) { gp = 3.5; lg = 'A-'; }
                    else if (subPct >= 50) { gp = 3.0; lg = 'B'; }
                    else if (subPct >= 40) { gp = 2.0; lg = 'C'; }
                    else if (subPct >= 33) { gp = 1.0; lg = 'D'; }

                    return (
                      <tr key={subId} className="border-b border-slate-200">
                        <td className="p-3 border border-slate-300 text-center font-mono">{idx + 1}</td>
                        <td className="p-3 border border-slate-300 font-bold text-slate-900">
                          {subInfo?.name || `Subject ${idx + 1}`}
                        </td>
                        <td className="p-3 border border-slate-300 text-center font-mono">
                          {subInfo?.fullMarks || 100}
                        </td>
                        <td className="p-3 border border-slate-300 text-center font-mono">
                          {subInfo?.passMarks || 40}
                        </td>
                        <td className="p-3 border border-slate-300 text-center font-mono font-bold text-slate-900 text-base">
                          {marks}
                        </td>
                        <td className="p-3 border border-slate-300 text-center font-bold text-emerald-800">
                          {lg}
                        </td>
                        <td className="p-3 border border-slate-300 text-center font-mono font-bold">
                          {gp.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-50 font-bold border-t-2 border-slate-800">
                    <td colSpan={2} className="p-3 border border-slate-300 text-right uppercase">
                      Grand Total & Evaluation:
                    </td>
                    <td className="p-3 border border-slate-300 text-center font-mono">
                      {matchedResult.totalFullMarks || 300}
                    </td>
                    <td className="p-3 border border-slate-300 text-center">-</td>
                    <td className="p-3 border border-slate-300 text-center font-mono text-base font-black text-emerald-800">
                      {matchedResult.totalMarks}
                    </td>
                    <td className="p-3 border border-slate-300 text-center text-base font-black text-emerald-700">
                      {matchedResult.grade}
                    </td>
                    <td className="p-3 border border-slate-300 text-center font-mono text-base font-black text-emerald-700">
                      GPA: {matchedResult.gpa.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Performance Summary Banner */}
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-wrap items-center justify-between gap-3 text-xs text-emerald-950 relative z-10">
              <div>
                <span className="font-bold block text-sm">
                  Final Result: PASSED WITH DISTINCTION (GRADE: {matchedResult.grade})
                </span>
                <span className="text-emerald-800">
                  Percentage Secured: {matchedResult.percentage.toFixed(2)}% • Date of Issue: {matchedResult.createdDate}
                </span>
              </div>
              <div className="font-mono text-[11px] bg-white px-3 py-1.5 rounded-lg border border-emerald-200">
                Verified Document ID: IHAS-{matchedResult.academicYear}-{matchedStudent.roll}
              </div>
            </div>

            {/* Signatures & Official Institutional Stamp */}
            <div className="pt-12 grid grid-cols-3 gap-6 items-end text-center relative z-10">
              {/* Controller / Prepared By */}
              <div className="space-y-2">
                <div className="h-14 flex items-center justify-center">
                  <span className="text-xs text-slate-400 italic font-serif">Verified System Record</span>
                </div>
                <div className="border-t border-slate-600 pt-1 text-xs font-bold text-slate-800">
                  Prepared & Verified By
                </div>
              </div>

              {/* Official Seal / Stamp */}
              <div className="flex flex-col items-center justify-center space-y-1">
                <img
                  src={schoolSettings.officialSealUrl}
                  alt="Official Seal"
                  className="w-20 h-20 object-contain drop-shadow-sm opacity-90"
                />
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  Official Institutional Seal
                </span>
              </div>

              {/* Head Teacher Signature */}
              <div className="space-y-2">
                <div className="h-14 flex items-center justify-center">
                  <img
                    src={schoolSettings.headmasterSignatureUrl}
                    alt="Headmaster Signature"
                    className="h-12 object-contain"
                  />
                </div>
                <div className="border-t border-slate-600 pt-1 text-xs font-bold text-slate-800">
                  MD Touhidul Hoque Tuhin
                  <span className="block text-[10px] text-slate-500 font-normal">Headmaster & Lead Mentor</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400 space-y-3">
          <FileText className="w-12 h-12 text-slate-300 mx-auto" />
          <h4 className="font-bold text-slate-700 text-sm">
            {lang === 'bn' ? 'ফলাফল দেখতে উপরে সার্চ করুন' : 'Search above to view academic transcript'}
          </h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {lang === 'bn' 
              ? 'উদাহরণস্বরূপ: শিক্ষাবর্ষ "2026", কোর্স "কমপ্লিট ইংলিশ গ্রামার" এবং রোল "101" দিয়ে টেস্ট করতে পারেন।' 
              : 'Try searching with Year: 2026, Course: Complete English Grammar, and Roll: 101.'}
          </p>
        </div>
      )}
    </div>
  );
};
