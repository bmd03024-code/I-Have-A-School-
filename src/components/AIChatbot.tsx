import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles, Minimize2, Maximize2, HelpCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
}

export const AIChatbot: React.FC = () => {
  const { lang, schoolSettings, chatbotTraining, isChatbotOpen, setIsChatbotOpen } = useApp();
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'bot',
      text: lang === 'bn' 
        ? 'আসসালামু আলাইকুম! আমি "আই হ্যাভ এ স্কুল" এআই অ্যাসিস্ট্যান্ট। ইংরেজি ব্যাকরণ, কোর্স ভর্তি, পরীক্ষার সাজেশন বা তুহিন স্যারের ক্লাস সম্পর্কে যেকোনো প্রশ্ন আমাকে করতে পারেন।'
        : 'Welcome! I am the "I Have A School" AI Assistant. Ask me anything about English grammar rules, course admissions, exam suggestions, or Tuhin Sir\'s classes.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isChatbotOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isChatbotOpen, isMinimized]);

  const quickPrompts = lang === 'bn' 
    ? [
        'কোর্সে ভর্তি হওয়ার নিয়ম কী?',
        'Right Form of Verbs এর নিয়ম বলুন',
        'এইচএসসি ২০২৬ স্পেশাল সাজেশন',
        'তুহিন স্যারের সাথে সরাসরি যোগাযোগ'
      ]
    : [
        'How to enroll in courses?',
        'Explain Right Form of Verbs rules',
        'HSC 2026 English suggestions',
        'Direct contact with Tuhin Sir'
      ];

  const generateAIResponse = (userQuestion: string): string => {
    const q = userQuestion.toLowerCase();

    // 1. Admission & Fees
    if (q.includes('ভর্তি') || q.includes('ফি') || q.includes('enroll') || q.includes('admission') || q.includes('fee') || q.includes('টাকা') || q.includes('price')) {
      return lang === 'bn'
        ? `আমাদের বর্তমানে ৩টি স্পেশাল ব্যাচে ভর্তি চলছে:\n১. কমপ্লিট ইংলিশ গ্রামার মাস্টারি (ফি: ৳১৫০০)\n২. স্পোকেন ইংলিশ ও ফ্লুয়েন্সি (ফি: ৳১২০০)\n৩. এইচএসসি ১ম ও ২য় পত্র বুস্টার (ফি: ৳১৮০০)\n\nভর্তির জন্য আপনি সরাসরি কোর্স পেজের "Enroll Now" বাটনে ক্লিক করে বিকাশ/নগদে টাকা পাঠিয়ে হোয়াটসঅ্যাপে (${schoolSettings.phone}) কনফার্ম করতে পারেন।`
        : `Admission is ongoing for our special batches:\n1. Complete English Grammar Mastery (Fee: ৳1500)\n2. Spoken English & Fluency (Fee: ৳1200)\n3. HSC 1st & 2nd Paper Booster (Fee: ৳1800)\n\nYou can enroll directly from the Courses page or contact our WhatsApp helpline at ${schoolSettings.phone}.`;
    }

    // 2. Right Form of Verbs
    if (q.includes('right form') || q.includes('verb') || q.includes('ভার্ব')) {
      return lang === 'bn'
        ? `তুহিন স্যারের গোল্ডেন রুলস:\n১. "It is high time / It is time" এর পর Subject থাকলে Past Indefinite (V2) হয়। যেমন: It is high time we changed our habits.\n২. With a view to, look forward to, get used to এর পর Verb+ing বসে।\n৩. As well as, with, along with থাকলে প্রথম Subject অনুযায়ী Verb বসে।`
        : `Key Right Form of Verbs Rules by Tuhin Sir:\n1. After "It is high time", use past tense (V2): "It is high time we changed our habits."\n2. Phrasal prepositions (look forward to, with a view to) take V+ing.\n3. When joined by "as well as", verb agrees with the FIRST subject.`;
    }

    // 3. Prepositions
    if (q.includes('preposition') || q.includes('প্রিপজিশন')) {
      return lang === 'bn'
        ? `গুরুত্বপূর্ণ প্রিপজিশন টিপস:\n• Die of (রোগে মারা যাওয়া): He died of cholera.\n• Die from (অতিরিক্ত খাওয়া/আঘাত ইত্যাদি কারণে): He died from over-eating.\n• Blind of (চোখে অন্ধ) vs Blind to (দোষের প্রতি অন্ধ)।\nআমাদের "Notes & PDFs" সেকশন থেকে ২৫০টি অ্যাপ্রোপ্রিয়েট প্রিপজিশনের শিট ডাউনলোড করে নিতে পারেন!`
        : `Essential Preposition Rules:\n• Die OF disease vs Die FROM external effect (e.g. overeating).\n• Blind OF one eye vs Blind TO faults.\nDownload our complete 250 Prepositions sheet from the Notes & PDFs section!`;
    }

    // 4. Contact / Tuhin Sir
    if (q.includes('তুহিন') || q.includes('tuhin') || q.includes('যোগাযোগ') || q.includes('contact') || q.includes('phone') || q.includes('নাম্বার')) {
      return lang === 'bn'
        ? `এমডি তৌহিদুল হক তুহিন স্যারের সাথে সরাসরি যোগাযোগ করতে কল বা হোয়াটসঅ্যাপ করুন:\n📞 হটলাইন: ${schoolSettings.phone}\n💬 হোয়াটসঅ্যাপ: +${schoolSettings.whatsapp}\n📧 ইমেইল: ${schoolSettings.email}\nঠিকানা: ${schoolSettings.addressBn}`
        : `To reach MD Touhidul Hoque Tuhin directly:\n📞 Hotline: ${schoolSettings.phone}\n💬 WhatsApp: +${schoolSettings.whatsapp}\n📧 Email: ${schoolSettings.email}\nAddress: ${schoolSettings.addressEn}`;
    }

    // 5. Suggestions
    if (q.includes('suggestion') || q.includes('সাজেশন') || q.includes('hsc') || q.includes('এইচএসসি')) {
      return lang === 'bn'
        ? `এইচএসসি ২০২৬ এর জন্য গুরুত্বপূর্ণ আইটেম:\n• ১ম পত্র: Nelson Mandela, Folk Music, Environmental Pollution প্যাসেজ।\n• ২য় পত্র: Modifiers, Connectors, Right form of verbs এবং ফরমাল লেটার।\nসম্পূর্ণ সাজেশন বিস্তারিত দেখতে ওয়েবসাইটের "Suggestions" পেজে যান এবং ফ্রি পিডিএফ ডাউনলোড করুন!`
        : `HSC 2026 High-Yield Items:\n• 1st Paper: Nelson Mandela, Traditional Folk Music, Environmental Pollution.\n• 2nd Paper: Modifiers, Connectors, Right Forms of Verbs.\nVisit the "Suggestions" page to view the full breakdown and download the printable PDF sheet!`;
    }

    // 6. Year-Based Admin Chatbot Training Knowledge Base (up to 1,000,000 words)
    if (chatbotTraining && chatbotTraining.length > 0) {
      const match = chatbotTraining.find((item) => {
        const words = q.split(/\s+/).filter((w) => w.length > 2);
        const topicMatch = item.topic.toLowerCase().includes(q) || (item.year && q.includes(item.year));
        const contentMatch = words.some((w) => item.content.toLowerCase().includes(w));
        return topicMatch || contentMatch;
      });

      if (match) {
        return `[${match.topic} - শিক্ষাবর্ষ ${match.year}]\n\n${match.content}`;
      }
    }

    // 7. Default Fallback
    return lang === 'bn'
      ? `আপনার প্রশ্নের জন্য ধন্যবাদ! তুহিন স্যারের তৈরি "আই হ্যাভ এ স্কুল" প্ল্যাটফর্মে আপনি ফ্রি ভিডিও ক্লাস, হ্যান্ডনোট এবং পূর্ণাঙ্গ কোর্স পাবেন। আপনার প্রয়োজনটি আরও একটু বিস্তারিত লিখলে আমি সঠিকভাবে বুঝিয়ে বলতে পারব। আপনি চাইলে সরাসরি হোয়াটসঅ্যাপে (${schoolSettings.phone}) কথা বলতে পারেন।`
      : `Thank you for your question! On "I Have A School", you can access free video classes, lecture notes, and premium batches guided by Tuhin Sir. Feel free to provide more details or message our WhatsApp desk at ${schoolSettings.phone}.`;
  };

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const botReplyText = generateAIResponse(query);
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: botReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  if (!isChatbotOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={lang === 'bn' ? 'এআই শিক্ষক চ্যাটবট' : 'AI Assistant Chat'}
      className={`!fixed bottom-4 sm:bottom-6 right-3 sm:right-6 z-[9999] w-[calc(100vw-24px)] sm:w-96 max-w-sm bg-white rounded-3xl shadow-2xl shadow-slate-900/40 border border-slate-200 overflow-hidden flex flex-col transition-all duration-200 animate-in slide-in-from-bottom-5 ${
        isMinimized ? 'h-16' : 'h-[520px] max-h-[82vh]'
      }`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white p-3.5 sm:p-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-xs sm:text-sm flex items-center gap-1.5">
              <span>{lang === 'bn' ? 'আই হ্যাভ এ স্কুল এআই' : 'IHAS Study Assistant'}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
            </h3>
            <p className="text-[10px] text-emerald-200">
              {lang === 'bn' ? '২৪/৭ ইংরেজি ও ভর্তি সহকারী' : '24/7 English & Batch Guide'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-emerald-100">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            title={isMinimized ? 'Expand' : 'Minimize'}
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsChatbotOpen(false)}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
            <>
              {/* Messages Body */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 text-xs">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 ${
                      msg.sender === 'user' ? 'flex-row-reverse' : ''
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-white text-[11px] font-bold ${
                        msg.sender === 'user' ? 'bg-slate-700' : 'bg-emerald-600'
                      }`}
                    >
                      {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                    </div>

                    <div
                      className={`p-3 rounded-2xl max-w-[80%] leading-relaxed whitespace-pre-line shadow-xs ${
                        msg.sender === 'user'
                          ? 'bg-emerald-600 text-white rounded-tr-none'
                          : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none'
                      }`}
                    >
                      {msg.text}
                      <span className={`block text-[9px] mt-1 text-right ${
                        msg.sender === 'user' ? 'text-emerald-100' : 'text-slate-400'
                      }`}>
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-center gap-2 text-slate-400 text-xs italic pl-9">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce delay-100" />
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce delay-200" />
                    <span>{lang === 'bn' ? 'উত্তর তৈরি হচ্ছে...' : 'Tuhin Sir AI is thinking...'}</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompts */}
              <div className="p-2 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto no-scrollbar">
                {quickPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(prompt)}
                    className="shrink-0 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 text-[11px] font-medium px-2.5 py-1 rounded-full border border-slate-200/60 transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Input Footer */}
              <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
                <input
                  type="text"
                  placeholder={lang === 'bn' ? 'যেকোনো ব্যাকরণ বা কোর্স সম্পর্কিত প্রশ্ন লিখুন...' : 'Ask about grammar or admission...'}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:border-emerald-500 focus:outline-none"
                />
                <button
                  onClick={() => handleSend()}
                  className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
  );
};
