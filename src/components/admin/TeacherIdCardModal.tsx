import React from 'react';
import { X, Printer, Phone, MapPin, Award, QrCode } from 'lucide-react';
import { Teacher, SchoolSettings, Language } from '../../types';

interface TeacherIdCardModalProps {
  teacher: Teacher | null;
  schoolSettings: SchoolSettings;
  lang: Language;
  onClose: () => void;
}

export const TeacherIdCardModal: React.FC<TeacherIdCardModalProps> = ({
  teacher,
  schoolSettings,
  lang,
  onClose
}) => {
  if (!teacher) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded uppercase">
              OFFICIAL ID CARD
            </span>
            <h3 className="text-sm font-bold text-slate-100">
              {lang === 'bn' ? 'শিক্ষক পরিচয়পত্র প্রিন্ট প্রিভিউ' : 'Teacher ID Card Print Preview'}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable ID Card Container */}
        <div className="p-6 bg-slate-100 flex flex-col items-center justify-center">
          <div 
            id="printable-teacher-id"
            className="w-80 bg-white rounded-2xl shadow-xl border-2 border-emerald-600 overflow-hidden text-slate-900 relative"
          >
            {/* ID Card Top Header */}
            <div className="bg-gradient-to-r from-emerald-800 to-teal-700 text-white p-4 text-center relative">
              <div className="flex items-center justify-center gap-2 mb-1">
                {schoolSettings.logoUrl && (
                  <img src={schoolSettings.logoUrl} alt="Logo" className="w-8 h-8 rounded-full border border-white/40 object-cover" />
                )}
                <span className="font-black text-sm tracking-wide">
                  {schoolSettings.instituteNameBn}
                </span>
              </div>
              <p className="text-[10px] text-emerald-200 font-medium">
                {schoolSettings.instituteNameEn}
              </p>
              <div className="mt-1.5 inline-block bg-amber-400 text-slate-950 text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                TEACHER ID CARD
              </div>
            </div>

            {/* Teacher Photo & Info */}
            <div className="p-5 flex flex-col items-center text-center space-y-3">
              <div className="relative">
                <img
                  src={teacher.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=240&auto=format&fit=crop'}
                  alt={teacher.nameEn}
                  className="w-24 h-24 rounded-2xl object-cover border-4 border-emerald-500 shadow-md"
                />
                {teacher.isHeadmaster && (
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap shadow-xs">
                    Head Teacher
                  </span>
                )}
              </div>

              <div>
                <h4 className="text-base font-black text-slate-900 leading-tight">
                  {teacher.nameBn || teacher.nameEn}
                </h4>
                <p className="text-xs font-semibold text-emerald-700">
                  {teacher.nameEn}
                </p>
                <p className="text-[11px] font-medium text-slate-600 mt-0.5">
                  {teacher.designationBn || teacher.designationEn}
                </p>
              </div>

              <div className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-left space-y-1.5 text-[11px]">
                <div className="flex items-center gap-1.5 text-slate-700">
                  <Award className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="font-semibold text-slate-500">যোগ্যতা:</span>
                  <span className="font-bold truncate">{teacher.qualification || 'M.A in English'}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700">
                  <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="font-semibold text-slate-500">মোবাইল:</span>
                  <span className="font-mono font-bold">{teacher.phone}</span>
                </div>
                {teacher.address && (
                  <div className="flex items-start gap-1.5 text-slate-700">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="font-semibold text-slate-500">ঠিকানা:</span>
                    <span className="truncate">{teacher.address}</span>
                  </div>
                )}
              </div>

              {/* Bottom Signatures & Seal */}
              <div className="w-full pt-2 flex items-end justify-between border-t border-slate-200 mt-2">
                <div className="text-center">
                  {schoolSettings.officialSealUrl ? (
                    <img src={schoolSettings.officialSealUrl} alt="Seal" className="h-9 w-9 mx-auto object-contain" />
                  ) : (
                    <div className="w-8 h-8 rounded-full border border-dashed border-emerald-600 flex items-center justify-center text-[8px] text-emerald-700 font-bold mx-auto">
                      SEAL
                    </div>
                  )}
                  <span className="text-[8px] text-slate-500 block mt-0.5">অফিসিয়াল সিল</span>
                </div>

                <div className="text-center">
                  <QrCode className="w-9 h-9 text-slate-800 mx-auto" />
                  <span className="text-[8px] text-slate-400 block font-mono">VERIFIED ID</span>
                </div>

                <div className="text-center">
                  {schoolSettings.headmasterSignatureUrl && (
                    <img src={schoolSettings.headmasterSignatureUrl} alt="Sign" className="h-7 mx-auto object-contain" />
                  )}
                  <span className="text-[8px] font-bold text-slate-700 border-t border-slate-700 pt-0.5 block">
                    কর্তৃপক্ষের স্বাক্ষর
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Color Stripe */}
            <div className="h-2 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-700" />
          </div>
        </div>

        {/* Modal Actions */}
        <div className="px-6 py-4 bg-white border-t border-slate-200 flex items-center justify-between print:hidden">
          <p className="text-xs text-slate-500">
            {lang === 'bn' ? 'স্ট্যান্ডার্ড সাইজে কার্ডটি প্রিন্ট করুন।' : 'Ready to print on standard cardstock.'}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              {lang === 'bn' ? 'বন্ধ করুন' : 'Cancel'}
            </button>
            <button
              onClick={handlePrint}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all"
            >
              <Printer className="w-4 h-4" />
              {lang === 'bn' ? 'আইডি কার্ড প্রিন্ট করুন' : 'Print ID Card'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
