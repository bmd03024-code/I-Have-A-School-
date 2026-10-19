import React, { useState } from 'react';
import { Award, Mail, Phone, GraduationCap, Printer, X, QrCode, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Teacher } from '../types';

export const TeachersDirectory: React.FC = () => {
  const { lang, teachers, schoolSettings } = useApp();
  const [selectedTeacherForId, setSelectedTeacherForId] = useState<Teacher | null>(null);

  const handlePrintIdCard = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
          {lang === 'bn' ? 'শ্রদ্ধেয় শিক্ষকমণ্ডলী' : 'Faculty & Educators'}
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          {lang === 'bn' ? 'আই হ্যাভ এ স্কুল শিক্ষক প্যানেল' : 'I Have A School Faculty Directory'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          {lang === 'bn' 
            ? 'এমডি তৌহিদুল হক তুহিন স্যারের দিকনির্দেশনায় পাঠদানকারী দক্ষ ও অভিজ্ঞ শিক্ষকবৃন্দ।' 
            : 'Dedicated and accomplished English educators mentoring students under the leadership of Tuhin Sir.'}
        </p>
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {teachers.map((teacher: Teacher) => (
          <div
            key={teacher.id}
            className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                <img
                  src={teacher.photoUrl}
                  alt={teacher.nameEn}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {teacher.isHeadmaster && (
                  <span className="absolute top-3 left-3 bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-sm">
                    {lang === 'bn' ? 'প্রধান শিক্ষক' : 'Headmaster'}
                  </span>
                )}
              </div>

              <div className="p-6 space-y-3">
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {lang === 'bn' ? teacher.nameBn : teacher.nameEn}
                  </h3>
                  <p className="text-xs font-bold text-emerald-600 mt-0.5">
                    {lang === 'bn' ? teacher.designationBn : teacher.designationEn}
                  </p>
                </div>

                <p className="text-xs text-slate-500 flex items-start gap-1.5 leading-relaxed">
                  <GraduationCap className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span>{teacher.qualification}</span>
                </p>

                <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{teacher.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="truncate">{teacher.email}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100">
              <button
                onClick={() => setSelectedTeacherForId(teacher)}
                className="w-full py-2 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-700 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'শিক্ষক আইডি কার্ড প্রিন্ট' : 'Print Faculty ID Card'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ID Card Print Modal */}
      {selectedTeacherForId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 print:hidden">
              <h3 className="font-bold text-sm text-slate-900">
                {lang === 'bn' ? 'অফিশিয়াল শিক্ষক আইডি কার্ড' : 'Official Faculty ID Card'}
              </h3>
              <button
                onClick={() => setSelectedTeacherForId(null)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Printable ID Card Container */}
            <div className="border-2 border-slate-800 rounded-2xl p-5 bg-gradient-to-b from-emerald-50/50 via-white to-slate-50 text-center space-y-4 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-center gap-2 border-b border-emerald-200 pb-2">
                <img src={schoolSettings.logoUrl} alt="Logo" className="w-8 h-8 rounded-lg object-cover" />
                <div className="text-left">
                  <span className="font-black text-xs text-slate-900 block leading-tight">
                    {schoolSettings.instituteNameEn}
                  </span>
                  <span className="text-[9px] text-emerald-800 font-bold block">
                    TEACHER IDENTITY CARD
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <img
                  src={selectedTeacherForId.photoUrl}
                  alt={selectedTeacherForId.nameEn}
                  className="w-24 h-24 rounded-2xl object-cover mx-auto border-2 border-slate-800 shadow-sm"
                />
                <div>
                  <h4 className="font-bold text-sm text-slate-900 leading-tight">
                    {selectedTeacherForId.nameEn}
                  </h4>
                  <p className="text-[11px] font-bold text-emerald-700">
                    {selectedTeacherForId.designationEn}
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                    ID No: IHAS-TCH-{selectedTeacherForId.id.replace('tch-', '00')}
                  </p>
                </div>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-[10px] text-slate-600 space-y-1 text-left">
                <p><strong>Qualification:</strong> {selectedTeacherForId.qualification}</p>
                <p><strong>Mobile:</strong> {selectedTeacherForId.phone}</p>
                <p><strong>Validity:</strong> 2026 - 2028</p>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-200 text-[9px]">
                <div className="text-left">
                  <span className="block text-slate-400">Headmaster Signature</span>
                  <img src={schoolSettings.headmasterSignatureUrl} alt="Sign" className="h-6 object-contain" />
                </div>
                <div>
                  <img src={schoolSettings.officialSealUrl} alt="Seal" className="w-8 h-8 object-contain opacity-80" />
                </div>
              </div>
            </div>

            <div className="flex gap-2 print:hidden">
              <button
                onClick={() => setSelectedTeacherForId(null)}
                className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>
              <button
                onClick={handlePrintIdCard}
                className="flex-1 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" /> Print ID Card
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
