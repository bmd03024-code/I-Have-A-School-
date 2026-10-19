import React, { useState } from 'react';
import { MessageCircle, X, Send, PhoneCall, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const FloatingWhatsApp: React.FC = () => {
  const { lang, schoolSettings } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  // Clean phone number for WhatsApp link
  const rawNumber = schoolSettings.whatsapp || schoolSettings.phone || '8801700000000';
  const cleanNumber = rawNumber.replace(/[^0-9]/g, '');

  const defaultMessage = lang === 'bn'
    ? 'আসসালামু আলাইকুম স্যার, আমি "আই হ্যাভ এ স্কুল" একাডেমি ও কোর্স সম্পর্কিত তথ্য জানতে চাই।'
    : 'Hello Sir, I would like to get information regarding "I Have A School" courses.';

  const handleOpenWhatsApp = () => {
    const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(defaultMessage)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      {/* Floating WhatsApp Action Button */}
      <div className="fixed bottom-6 left-6 z-40 flex items-center gap-3">
        <div className="relative group">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group focus:outline-none"
            style={{ boxShadow: '0 8px 24px -4px rgba(37, 211, 102, 0.5)' }}
            title={lang === 'bn' ? 'হোয়াটসঅ্যাপে সরাসরি চ্যাট করুন' : 'Chat on WhatsApp'}
          >
            {/* Pulsing ring indicator */}
            <span className="absolute -inset-1 rounded-full bg-[#25D366]/40 animate-ping pointer-events-none" />
            
            {/* WhatsApp Official SVG Icon */}
            <svg
              className="w-7 h-7 fill-current relative z-10"
              viewBox="0 0 24 24"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </button>

          {/* Tooltip on hover */}
          <span className="hidden sm:block absolute left-16 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            {lang === 'bn' ? 'হোয়াটসঅ্যাপ শর্টকাট' : 'WhatsApp Shortcut'}
          </span>
        </div>
      </div>

      {/* Mini WhatsApp Chat Card / Modal */}
      {isOpen && (
        <div className="fixed bottom-22 left-6 z-50 w-80 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-5 duration-200 text-slate-800">
          {/* Card Header */}
          <div className="bg-[#075E54] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-white">
                  {lang === 'bn' ? 'তুহিন স্যার হেল্পডেস্ক' : 'Tuhin Sir Helpdesk'}
                </h4>
                <p className="text-[10px] text-emerald-200 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
                  {lang === 'bn' ? 'অনলাইন ও সক্রিয়' : 'Online & Active'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-white/10 text-white/80 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Card Body */}
          <div className="p-4 bg-[#E5DDD5]/40 space-y-3 text-xs">
            {/* Simulated WhatsApp incoming message bubble */}
            <div className="bg-white rounded-2xl p-3 shadow-xs border border-slate-200/60 max-w-[90%] space-y-1">
              <p className="font-bold text-[11px] text-emerald-800">
                {lang === 'bn' ? 'মো. তৌহিদুল হক তুহিন' : 'MD Touhidul Hoque Tuhin'}
              </p>
              <p className="text-slate-700 text-[11px] leading-relaxed">
                {lang === 'bn' 
                  ? 'আসসালামু আলাইকুম! যেকোনো কোর্স, ফ্রি ভিডিও ক্লাস বা ভর্তি সংক্রান্ত তথ্যের জন্য সরাসরি হোয়াটসঅ্যাপে মেসেজ দিন।' 
                  : 'Hello! Feel free to message on WhatsApp for any course details, admission rules, or questions.'}
              </p>
              <span className="text-[9px] text-slate-400 block text-right">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 flex items-center gap-2 text-[11px] text-emerald-900">
              <PhoneCall className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span className="font-mono font-bold">+{schoolSettings.whatsapp || schoolSettings.phone}</span>
            </div>
          </div>

          {/* Card Action */}
          <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
            <button
              onClick={() => {
                handleOpenWhatsApp();
                setIsOpen(false);
              }}
              className="w-full py-2.5 px-4 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'হোয়াটসঅ্যাপে মেসেজ পাঠান' : 'Start WhatsApp Chat'}</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};
