import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Sparkles, MessageCircle, Send } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const EnrollmentModal: React.FC = () => {
  const { 
    lang, 
    selectedCourseForEnrollment, 
    closeEnrollmentModal, 
    enrollInCourse, 
    isEnrolled,
    schoolSettings,
    addStudent
  } = useApp();

  const [nameEn, setNameEn] = useState('');
  const [nameBn, setNameBn] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!selectedCourseForEnrollment) return null;

  const course = selectedCourseForEnrollment;
  const alreadyEnrolled = isEnrolled(course.id);
  const courseTitle = lang === 'bn' ? course.titleBn : course.titleEn;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameEn || !phoneNumber) return;

    // Register into student list
    addStudent({
      id: `std-${Date.now()}`,
      academicYear: '2026',
      courseId: course.id,
      roll: String(Math.floor(100 + Math.random() * 900)),
      nameEn,
      nameBn: nameBn || nameEn,
      fatherNameEn: fatherName,
      fatherNameBn: fatherName,
      motherNameEn: motherName,
      motherNameBn: motherName,
      address,
      phone: phoneNumber,
      admissionDate: new Date().toISOString().split('T')[0]
    });

    enrollInCourse(course.id);
    setIsSuccess(true);
  };

  const handleSendWhatsApp = () => {
    const text = `*New Admission Application - ${schoolSettings.instituteNameEn}*
----------------------------------------
*Course:* ${courseTitle} (৳${course.price})
*Student Name (EN):* ${nameEn || 'N/A'}
*নাম (বাংলা):* ${nameBn || 'N/A'}
*Father's Name:* ${fatherName || 'N/A'}
*Mother's Name:* ${motherName || 'N/A'}
*Address:* ${address || 'N/A'}
*Phone:* ${phoneNumber || 'N/A'}
----------------------------------------
I want to confirm my admission in Tuhin Sir's batch.`;

    const url = `https://wa.me/${schoolSettings.whatsapp}?text=${encodeURIComponent(text)}`;
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.click();
  };

  const handleDone = () => {
    setIsSuccess(false);
    closeEnrollmentModal();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
      onClick={closeEnrollmentModal}
    >
      <div 
        className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[92vh] animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider bg-emerald-500/30 px-2 py-0.5 rounded text-emerald-100">
              {lang === 'bn' ? 'অনলাইন ভর্তি ফরম' : 'Online Admission Desk'}
            </span>
            <h3 className="text-base sm:text-lg font-bold mt-1 text-white leading-snug">
              {courseTitle}
            </h3>
          </div>
          <button
            onClick={closeEnrollmentModal}
            className="p-1 rounded-full hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {isSuccess || alreadyEnrolled ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-900">
                  {lang === 'bn' ? 'ভর্তি নিশ্চিত হয়েছে!' : 'Admission Confirmed!'}
                </h4>
                <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto">
                  {lang === 'bn'
                    ? 'আই হ্যাভ এ স্কুলে আপনাকে স্বাগতম। আপনি এখন ক্লাসরুমের সকল লেকচার ও শিট অ্যাক্সেস করতে পারবেন।'
                    : 'Welcome to I Have A School. You can now access all course lectures and materials.'}
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-2 text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-500">{lang === 'bn' ? 'কোর্স:' : 'Course:'}</span>
                  <span className="font-semibold text-slate-900">{courseTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{lang === 'bn' ? 'মেন্টর:' : 'Instructor:'}</span>
                  <span className="font-semibold text-slate-900">MD Touhidul Hoque Tuhin</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{lang === 'bn' ? 'হোয়াটসঅ্যাপ হেল্পলাইন:' : 'WhatsApp Support:'}</span>
                  <span className="font-semibold text-emerald-700">+{schoolSettings.whatsapp}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSendWhatsApp}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{lang === 'bn' ? 'হোয়াটসঅ্যাপে যোগাযোগ' : 'Chat on WhatsApp'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleDone}
                  className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors"
                >
                  {lang === 'bn' ? 'ক্লাসরুমে যান' : 'Go to Classroom'}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Fee Bar */}
              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-3.5 flex items-center justify-between">
                <div>
                  <span className="text-xs text-emerald-800 font-medium">
                    {lang === 'bn' ? 'কোর্স ফি:' : 'Course Fee:'}
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-emerald-950">৳{course.price}</span>
                    <span className="text-xs text-slate-400 line-through">৳{course.originalPrice}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleSendWhatsApp}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>
              </div>

              {/* Student Details Fields */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                  {lang === 'bn' ? 'শিক্ষার্থীর পূর্ণাঙ্গ তথ্য (বাংলা ও ইংরেজি):' : 'Student Information (Bilingual):'}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">
                      {lang === 'bn' ? 'নাম (English) *' : 'Student Name (English) *'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Shakil Mahmud"
                      value={nameEn}
                      onChange={(e) => setNameEn(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">
                      {lang === 'bn' ? 'নাম (বাংলা)' : 'Student Name (Bengali)'}
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. শাকিল মাহমুদ"
                      value={nameBn}
                      onChange={(e) => setNameBn(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">
                      {lang === 'bn' ? 'পিতার নাম' : "Father's Name"}
                    </label>
                    <input
                      type="text"
                      placeholder="Father's Name"
                      value={fatherName}
                      onChange={(e) => setFatherName(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">
                      {lang === 'bn' ? 'মাতার নাম' : "Mother's Name"}
                    </label>
                    <input
                      type="text"
                      placeholder="Mother's Name"
                      value={motherName}
                      onChange={(e) => setMotherName(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">
                      {lang === 'bn' ? 'মোবাইল নম্বর (হোয়াটসঅ্যাপ) *' : 'Mobile Number (WhatsApp) *'}
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="017xxxxxxxx"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">
                      {lang === 'bn' ? 'ঠিকানা / জেলা' : 'Address / District'}
                    </label>
                    <input
                      type="text"
                      placeholder="Dhaka, Bangladesh"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-3 rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 text-xs"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{lang === 'bn' ? `ভর্তি সম্পন্ন করুন (৳${course.price})` : `Complete Enrollment (৳${course.price})`}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSendWhatsApp}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-2xl transition-all flex items-center justify-center gap-2 text-xs"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>{lang === 'bn' ? 'তথ্য দিয়ে হোয়াটসঅ্যাপে কথা বলুন' : 'Submit & Message on WhatsApp'}</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>
                  {lang === 'bn' ? '১০০% নিরাপদ ভর্তি • তাৎক্ষণিক লেকচার শিট ও গ্রুপ এক্সেস' : '100% Secure Admission • Instant Material Access'}
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
