import { 
  SchoolSettings, 
  HeroSlide, 
  Course, 
  Student, 
  CourseSubject, 
  CourseExam, 
  StudentResult, 
  Teacher, 
  VideoClass, 
  NoteResource, 
  EducationalPost, 
  Suggestion, 
  ModelTest, 
  Notice, 
  StudentReview,
  ClassRoutine,
  ChatbotTrainingItem,
  GitHubConfig
} from '../types';

export const DEFAULT_SCHOOL_SETTINGS: SchoolSettings = {
  instituteNameEn: 'I Have A School',
  instituteNameBn: 'আই হ্যাভ এ স্কুল',
  taglineEn: 'Learn, Grow, Succeed • By MD Touhidul Hoque Tuhin',
  taglineBn: 'শিখুন, এগিয়ে যান, সফল হোন • এমডি তৌহিদুল হক তুহিন',
  logoUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=240&auto=format&fit=crop',
  headmasterSignatureUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Jon_Kirsch%27s_signature.png',
  officialSealUrl: 'https://cdn-icons-png.flaticon.com/512/992/992001.png',
  phone: '+880 1580-370062',
  whatsapp: '+880 1580-370062',
  email: 'tuhinsir@gmail.com',
  addressEn: 'House 42, Road 11, Dhanmondi, Dhaka-1209, Bangladesh',
  addressBn: 'বাড়ি ৪২, রোড ১১, ধানমন্ডি, ঢাকা-১২০৯, বাংলাদেশ',
  facebookUrl: 'https://www.facebook.com/touhidulhoque.tuhin',
  youtubeUrl: 'https://youtube.com/@ihaveaschool?si=KO9IqCprs_uX0PEY',
  telegramUrl: 'https://t.me',
  tiktokUrl: 'https://www.tiktok.com/@touhidulhoque.tuhin',
  messengerUrl: 'https://m.me/ihaveaschool',
  founderNameBn: 'মো. তৌহিদুল হক তুহিন',
  founderNameEn: 'MD Touhidul Hoque Tuhin',
  footerDescriptionBn: 'এমডি তৌহিদুল হক তুহিন স্যারের শিক্ষামূলক প্ল্যাটফর্ম—ইংরেজি ব্যাকরণ সহজীকরণ, অনর্গল স্পোকেন ইংলিশ, বোর্ড পরীক্ষার ১০০% সাজেশন ও কোয়ালিটি কোর্স।',
  footerDescriptionEn: 'Educational mentorship initiative led by MD Touhidul Hoque Tuhin to empower students across Bangladesh with intuitive English mastery.',
  learningHubLinks: [
    { id: 'lh-1', titleBn: 'কোয়ালিটি কোর্সসমূহ', titleEn: 'Quality Courses', url: '/courses' },
    { id: 'lh-2', titleBn: 'ফ্রি ভিডিও ক্লাস', titleEn: 'Free Video Classes', url: '/classes' },
    { id: 'lh-3', titleBn: 'লেকচার নোটস ও পিডিএফ', titleEn: 'Lecture Notes & PDFs', url: '/notes' },
    { id: 'lh-4', titleBn: 'এইচএসসি ও বোর্ড সাজেশন', titleEn: 'Exam Suggestions', url: '/suggestions' },
    { id: 'lh-5', titleBn: 'অনলাইন মডেল টেস্ট', titleEn: 'Online Model Tests', url: '/model-tests' }
  ],
  servicesLinks: [
    { id: 'srv-1', titleBn: 'মার্কশিট ও ফলাফল প্রিন্ট', titleEn: 'Marksheet & Results', url: '/results' },
    { id: 'srv-2', titleBn: '১০ লাখ শব্দের ডিকশনারি', titleEn: '1M Words Dictionary', url: '/dictionary' },
    { id: 'srv-3', titleBn: 'সায়েন্টিফিক ক্যালকুলেটর', titleEn: 'Scientific Calculator', url: '#calc' },
    { id: 'srv-4', titleBn: 'শিক্ষক প্যানেল ও আইডি কার্ড', titleEn: 'Faculty & ID Cards', url: '/teachers' },
    { id: 'srv-5', titleBn: 'ক্লাস রুটিন ও সময়সূচি', titleEn: 'Class Routines', url: '/routines' }
  ]
};

export const INITIAL_HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-1',
    titleEn: 'Master English with Tuhin Sir',
    titleBn: 'তুহিন স্যারের সাথে সহজে ইংরেজি জয় করুন',
    subtitleEn: 'From zero fundamentals to academic GPA 5.00 and BCS excellence with proven logical techniques.',
    subtitleBn: 'জিরো বেসিক থেকে এইচএসসি জিপিএ ৫.০০ ও বিসিএস প্রস্তুতি নিন সহজ ও কার্যকর টেকনিকে।',
    imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1400&auto=format&fit=crop',
    buttonTextEn: 'Explore Courses',
    buttonTextBn: 'কোর্সগুলো দেখুন',
    buttonUrl: '/courses',
    active: true
  },
  {
    id: 'slide-2',
    titleEn: 'HSC 2026 & Spoken English Special Batch',
    titleBn: 'এইচএসসি ২০২৬ ও স্পোকেন ইংলিশ স্পেশাল ব্যাচ',
    subtitleEn: 'Admission is currently ongoing! Join interactive live classes, get exclusive handwritten lecture notes.',
    subtitleBn: 'ভর্তি চলছে! নিয়মিত লাইভ ক্লাস, তৌহিদ স্যারের হস্তলিখিত লেকচার শিট ও বোর্ড মডেল টেস্ট।',
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1400&auto=format&fit=crop',
    buttonTextEn: 'Direct WhatsApp Admission',
    buttonTextBn: 'সরাসরি হোয়াটসঅ্যাপে ভর্তি',
    buttonUrl: '/courses',
    active: true
  },
  {
    id: 'slide-3',
    titleEn: 'Free Video Lectures & PDF Resources',
    titleBn: 'ফ্রি ভিডিও লেকচার ও পিডিএফ নোটস লাইব্রেরি',
    subtitleEn: 'Access 100+ free rule-wise video classes, model tests, and download printable cheat-sheets anytime.',
    subtitleBn: '১০০+ ফ্রি ব্যাকরণ ক্লাস, মডেল টেস্ট এবং প্রিন্ট উপযোগী হ্যান্ডনোটস যেকোনো সময় ডাউনলোড করুন।',
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1400&auto=format&fit=crop',
    buttonTextEn: 'Download Free Notes',
    buttonTextBn: 'ফ্রি নোটস ডাউনলোড',
    buttonUrl: '/notes',
    active: true
  }
];

export const COURSES: Course[] = [
  {
    id: 'course-1',
    titleEn: 'Complete English Grammar Mastery 2026',
    titleBn: 'কমপ্লিট ইংলিশ গ্রামার মাস্টারি ২০২৬',
    subtitleEn: 'From zero fundamentals to advanced grammatical precision for HSC, Admission & BCS.',
    subtitleBn: 'জিরো বেসিক থেকে অ্যাডভান্সড গ্রামার—এইচএসসি, বিশ্ববিদ্যালয় ভর্তি ও বিসিএসের জন্য।',
    category: 'Grammar Foundation',
    level: 'All Levels',
    durationEn: '3 Months (48 Live Classes)',
    durationBn: '৩ মাস (৪৮টি লাইভ ক্লাস)',
    lecturesCount: 48,
    price: 1500,
    originalPrice: 3000,
    isFeatured: true,
    bannerImage: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=800&auto=format&fit=crop',
    descriptionEn: 'A master curriculum designed by Tuhin Sir covering 100% Right Forms of Verbs, Conditionals, Transformations, Modifiers, Connectors, Prepositions, and Narration with 1000+ board question practices.',
    descriptionBn: 'তুহিন স্যারের বিশেষ কারিকুলামে রাইট ফর্ম অব ভার্বস, প্রিপজিশন, কন্ডিশনালস, মডিফায়ার্স, কানেক্টর্স ও ন্যারেশনের ১০০% নিয়ম এবং ১০০০+ বোর্ড প্রশ্ন সমাধান।',
    featuresEn: [
      '48 Interactive Live Classes with Tuhin Sir',
      'Exclusive Hand-written Lecture Notes (PDF)',
      'Chapter-end MCQ Model Tests & Solutions',
      'Dedicated WhatsApp Discussion Group'
    ],
    featuresBn: [
      '৪৮টি ইন্টারেক্টিভ লাইভ ক্লাস তুহিন স্যারের সাথে',
      'এক্সক্লুসিভ হস্তলিখিত লেকচার নোটস (পিডিএফ)',
      'অধ্যায়ভিত্তিক এমসিকিউ মডেল টেস্ট ও সমাধান',
      'ডেডিকেটেড হোয়াটসঅ্যাপ স্টাডি গ্রুপ'
    ],
    syllabus: [
      { week: 'Week 1-2', topics: ['Parts of Speech in Depth', 'Subject-Verb Agreement'] },
      { week: 'Week 3-4', topics: ['Tenses & Timeline Mastery', 'Right Form of Verbs: 35 Golden Rules'] },
      { week: 'Week 5-6', topics: ['Appropriate Preposition Hacks', 'Conditionals & Inversion'] },
      { week: 'Week 7-8', topics: ['Modifiers, Connectors & Transformation'] }
    ],
    instructor: {
      name: 'MD Touhidul Hoque Tuhin',
      designation: 'Headmaster & Lead English Mentor',
      image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=300&auto=format&fit=crop'
    }
  },
  {
    id: 'course-2',
    titleEn: 'Spoken English & Fluency Accelerator',
    titleBn: 'স্পোকেন ইংলিশ ও ফ্লুয়েন্সি এক্সিলারেটর',
    subtitleEn: 'Break the fear of English speaking and speak fluently with real-life daily conversational drills.',
    subtitleBn: 'ইংরেজি কথা বলার জড়তা দূর করুন এবং প্রতিদিনের প্রয়োজনীয় বাক্যে অনর্গল কথা বলুন।',
    category: 'Spoken English',
    level: 'Beginner',
    durationEn: '2.5 Months (30 Sessions)',
    durationBn: '২.৫ মাস (৩০টি সেশন)',
    lecturesCount: 30,
    price: 1200,
    originalPrice: 2500,
    isFeatured: true,
    bannerImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop',
    descriptionEn: 'Specially created for students and job aspirants who hesitate while speaking English. Master 500+ daily sentence patterns and natural accent techniques.',
    descriptionBn: 'কথা বলতে দ্বিধাবোধ করেন এমন শিক্ষার্থীদের জন্য ৫০০+ দৈনন্দিন বাক্য কাঠামো ও ফ্লুয়েন্সি ড্রিল।',
    featuresEn: [
      '30 Fluency Drill Sessions with Peer Practice',
      '500+ Daily Conversational Formulae E-Book',
      'Audio Accent & Pronunciation Guide',
      'Mock Interview & Presentation Training'
    ],
    featuresBn: [
      '৩০টি ফ্লুয়েন্সি স্পিকিং প্র্যাকটিস সেশন',
      '৫০০+ বাক্য গঠনের ফর্মুলা ই-বুক',
      'উচ্চারণ ও এক্সেন্ট অডিও গাইডলাইন',
      'মক ইন্টারভিউ ও প্রেজেন্টেশন প্রস্তুতি'
    ],
    syllabus: [
      { week: 'Week 1-2', topics: ['Overcoming Hesitation', 'Everyday Greetings & Expressions'] },
      { week: 'Week 3-4', topics: ['Expressing Opinions & Feelings', 'Asking Questions Confidently'] }
    ],
    instructor: {
      name: 'MD Touhidul Hoque Tuhin',
      designation: 'Founder, I Have A School',
      image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=300&auto=format&fit=crop'
    }
  },
  {
    id: 'course-3',
    titleEn: 'HSC English 1st & 2nd Paper Complete Booster',
    titleBn: 'এইচএসসি ইংলিশ ১ম ও ২য় পত্র কমপ্লিট বুস্টার',
    subtitleEn: 'Target GPA 5.00 in English with proven board-standard answers and shortcut strategies.',
    subtitleBn: 'বোর্ড পরীক্ষায় জিপিএ ৫.০০ নিশ্চিত করতে প্রথম ও দ্বিতীয় পত্রের সমন্বিত পূর্ণাঙ্গ কোর্স।',
    category: 'HSC & SSC',
    level: 'Intermediate',
    durationEn: '4 Months (56 Classes)',
    durationBn: '৪ মাস (৫৬টি ক্লাস)',
    lecturesCount: 56,
    price: 1800,
    originalPrice: 3500,
    bannerImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop',
    descriptionEn: 'Targeted course for HSC candidates covering both 1st Paper (Passage Analysis, Summaries, Themes) and 2nd Paper (Grammar & Composition).',
    descriptionBn: 'প্যাসেজ বিশ্লেষণ, সামারি, থিম রাইটিং এবং পূর্ণাঙ্গ ব্যাকরণ ও কম্পোজিশন পার্ট কাভার করা হবে।',
    featuresEn: [
      '56 Comprehensive Live Classes',
      'HSC Super Suggestion 2026 PDF Book',
      'Handwritten Sample Formal Letters & Paragraphs',
      'Weekly 100-Mark Model Test Evaluation'
    ],
    featuresBn: [
      '৫৬টি পূর্ণাঙ্গ লাইভ ক্লাস',
      'এইচএসসি সুপার সাজেশন ২০২৬ বুক',
      'তুহিন স্যারের স্পেশাল ফরমাল লেটার ও প্যারাগ্রাফ গাইড',
      'সাপ্তাহিক ১০০ নম্বরের বোর্ড স্ট্যান্ডার্ড টেস্ট'
    ],
    syllabus: [
      { week: 'Month 1', topics: ['HSC 1st Paper Passages, Flowcharts, Summaries'] },
      { week: 'Month 2', topics: ['HSC 2nd Paper Modifiers, Connectors, Narration'] }
    ],
    instructor: {
      name: 'MD Touhidul Hoque Tuhin',
      designation: 'Senior English Educator',
      image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=300&auto=format&fit=crop'
    }
  }
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'std-1',
    academicYear: '2026',
    courseId: 'course-1',
    roll: '101',
    nameEn: 'Ahsan Habib',
    nameBn: 'আহসান হাবীব',
    fatherNameEn: 'Rafiqul Islam',
    fatherNameBn: 'রফিকুল ইসলাম',
    motherNameEn: 'Nasreen Begum',
    motherNameBn: 'নাসরীন বেগম',
    address: 'Dhanmondi, Dhaka',
    phone: '01711223344',
    admissionDate: '2026-01-15'
  },
  {
    id: 'std-2',
    academicYear: '2026',
    courseId: 'course-1',
    roll: '102',
    nameEn: 'Farhana Yeasmin',
    nameBn: 'ফারহানা ইয়াসমিন',
    fatherNameEn: 'Anwar Hossain',
    fatherNameBn: 'আনোয়ার হোসেন',
    motherNameEn: 'Shirin Akter',
    motherNameBn: 'শিরীন আক্তার',
    address: 'Mirpur-10, Dhaka',
    phone: '01822334455',
    admissionDate: '2026-01-18'
  },
  {
    id: 'std-3',
    academicYear: '2026',
    courseId: 'course-3',
    roll: '201',
    nameEn: 'Tanvir Ahmed',
    nameBn: 'তানভীর আহমেদ',
    fatherNameEn: 'Jahangir Alam',
    fatherNameBn: 'জাহাঙ্গীর আলম',
    motherNameEn: 'Rehana Parvin',
    motherNameBn: 'রেহানা পারভীন',
    address: 'Uttara, Dhaka',
    phone: '01933445566',
    admissionDate: '2026-02-01'
  }
];

export const INITIAL_SUBJECTS: CourseSubject[] = [
  { id: 'sub-1', courseId: 'course-1', name: 'Right Form of Verbs', fullMarks: 100, passMarks: 40 },
  { id: 'sub-2', courseId: 'course-1', name: 'Appropriate Prepositions', fullMarks: 100, passMarks: 40 },
  { id: 'sub-3', courseId: 'course-1', name: 'Modifiers & Connectors', fullMarks: 100, passMarks: 40 },
  { id: 'sub-4', courseId: 'course-3', name: 'English 1st Paper', fullMarks: 100, passMarks: 40 },
  { id: 'sub-5', courseId: 'course-3', name: 'English 2nd Paper', fullMarks: 100, passMarks: 40 }
];

export const INITIAL_EXAMS: CourseExam[] = [
  { id: 'exam-1', courseId: 'course-1', name: 'First Term Model Exam', examType: 'Term Exam', date: '2026-03-10' },
  { id: 'exam-2', courseId: 'course-1', name: 'Midterm Evaluation Test', examType: 'Midterm', date: '2026-06-15' },
  { id: 'exam-3', courseId: 'course-3', name: 'HSC Pre-Test Model Exam', examType: 'Pre-Test', date: '2026-04-20' }
];

export const INITIAL_RESULTS: StudentResult[] = [
  {
    id: 'res-1',
    academicYear: '2026',
    courseId: 'course-1',
    examId: 'exam-1',
    studentRoll: '101',
    subjectMarks: {
      'sub-1': 92,
      'sub-2': 88,
      'sub-3': 95
    },
    totalMarks: 275,
    totalFullMarks: 300,
    percentage: 91.67,
    gpa: 5.0,
    grade: 'A+',
    createdDate: '2026-03-15'
  },
  {
    id: 'res-2',
    academicYear: '2026',
    courseId: 'course-1',
    examId: 'exam-1',
    studentRoll: '102',
    subjectMarks: {
      'sub-1': 84,
      'sub-2': 79,
      'sub-3': 86
    },
    totalMarks: 249,
    totalFullMarks: 300,
    percentage: 83.0,
    gpa: 4.8,
    grade: 'A',
    createdDate: '2026-03-15'
  }
];

export const INITIAL_TEACHERS: Teacher[] = [
  {
    id: 'tch-1',
    nameEn: 'MD Touhidul Hoque Tuhin',
    nameBn: 'এমডি তৌহিদুল হক তুহিন',
    designationEn: 'Founder, Headmaster & English Specialist',
    designationBn: 'প্রতিষ্ঠাতা, প্রধান শিক্ষক ও ইংরেজি বিশেষজ্ঞ',
    qualification: 'M.A in English, 12+ Years Teaching Experience',
    phone: '+880 1580-370062',
    email: 'tuhinsir@gmail.com',
    photoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=600&auto=format&fit=crop',
    isHeadmaster: true,
    joiningDate: '2015-01-01',
    signatureUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Jon_Kirsch%27s_signature.png'
  },
  {
    id: 'tch-2',
    nameEn: 'Prof. Mahfuzur Rahman',
    nameBn: 'প্রফেসর মাহফুজুর রহমান',
    designationEn: 'Senior Advisor & Spoken English Trainer',
    designationBn: 'সিনিয়র উপদেষ্টা ও স্পোকেন ইংলিশ ট্রেইনার',
    qualification: 'M.A. in ELT, British Council Certified',
    phone: '+880 1819-223344',
    email: 'mahfuz.ihas@gmail.com',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
    joiningDate: '2018-05-10'
  },
  {
    id: 'tch-3',
    nameEn: 'Sharmin Sultana',
    nameBn: 'শারমিন সুলতানা',
    designationEn: 'Assistant Teacher (Grammar & Writing)',
    designationBn: 'সহকারী শিক্ষক (গ্রামার ও রাইটিং)',
    qualification: 'B.A. (Hons), M.A. in English (DU)',
    phone: '+880 1912-889900',
    email: 'sharmin.ihas@gmail.com',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop',
    joiningDate: '2020-03-01'
  }
];

export const VIDEO_CLASSES: VideoClass[] = [
  {
    id: 'vid-1',
    titleEn: 'Right Form of Verbs: 7 Magical Rules That Always Come in Exams',
    titleBn: 'রাইট ফর্ম অব ভার্বস: ৭টি জাদুকরী নিয়ম যা পরীক্ষায় অবশ্যই আসে',
    descriptionEn: 'In this high-yield lecture, Tuhin Sir demonstrates how to solve 95% of Right Form of Verbs questions in HSC and job exams without getting confused by exceptions.',
    descriptionBn: 'তুহিন স্যারের এই স্পেশাল ক্লাসে এইচএসসি ও চাকুরির পরীক্ষায় আসা ৯৫% রাইট ফর্ম অব ভার্বস সমাধানের সহজ ট্রিকস শিখুন।',
    category: 'Grammar Hacks',
    duration: '28:45',
    youtubeId: 'kJQP7kiw5Fk',
    thumbnailUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=600&auto=format&fit=crop',
    views: '45.2K',
    publishedDate: '3 days ago',
    level: 'HSC / SSC / Job',
    chapters: [
      { time: '00:00', title: 'Introduction & Common Mistakes' },
      { time: '04:15', title: 'Rule 1: As if / As though & Unreal Past' },
      { time: '09:30', title: 'Rule 2: It is high time / Wish conditions' },
      { time: '14:20', title: 'Rule 3: Causative Verbs (Have, Get, Make)' },
      { time: '20:10', title: 'Rule 4 & 5: Preposition + Verb-ing Exceptions' }
    ],
    keyNotes: [
      'After "It is high time", use past indefinite (V2) or to + V1.',
      'Look forward to, with a view to, get used to take V+ing.',
      'Causative: Subject + have/get + Person + to-V1 or V1.'
    ]
  },
  {
    id: 'vid-2',
    titleEn: 'How to Speak Fluent English Without Hesitation (Bangla to English)',
    titleBn: 'লজ্জা ও জড়তা ছাড়া অনর্গল ইংরেজি বলার গোপন কৌশল',
    descriptionEn: 'Learn the natural formula to speak English daily even if you have no speaking partner.',
    descriptionBn: 'স্পিকিং পার্টনার ছাড়াই বাসায় বসে প্রতিদিন ইংরেজি অনুশীলনের কার্যকর ৩টি উপায়।',
    category: 'Spoken English',
    duration: '22:15',
    youtubeId: '1G4isv_Fylg',
    thumbnailUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=600&auto=format&fit=crop',
    views: '88.5K',
    publishedDate: '1 week ago',
    level: 'Beginner to Intermediate',
    chapters: [
      { time: '00:00', title: 'Why do we freeze while speaking?' },
      { time: '05:10', title: 'Exercise 1: The 1-Minute Mirror Technique' }
    ],
    keyNotes: [
      'Stop translating Bengali idioms word for word.',
      'Use natural connectors: "To be honest", "As far as I remember".'
    ]
  }
];

export const NOTES_RESOURCES: NoteResource[] = [
  {
    id: 'note-1',
    titleEn: 'Right Form of Verbs: 40 Golden Rules Sheet',
    titleBn: 'রাইট ফর্ম অব ভার্বস: ৪০টি গোল্ডেন রুলস শিট',
    subject: 'English 2nd Paper',
    category: 'Grammar Sheets',
    pages: 12,
    fileSize: '2.4 MB',
    downloads: 14200,
    date: 'Oct 2026',
    descriptionEn: 'Complete concise guide prepared by MD Touhidul Hoque Tuhin. Contains all rules, real exam examples, common pitfalls, and a 50-question practice set.',
    descriptionBn: 'তুহিন স্যারের প্রস্তুতকৃত পূর্ণাঙ্গ গাইড—নিয়ম, বাস্তব উদাহরণ এবং ৫০টি অনুশীলনী প্রশ্নসহ।',
    tags: ['Right Form of Verbs', 'HSC 2026', 'Grammar'],
    sampleContent: [
      'Rule 1: As well as, with, along with, together with — the verb follows the FIRST subject.',
      'Rule 2: "One of the + plural noun" always takes a SINGULAR verb.',
      'Rule 3: "A number of" takes plural verb, while "The number of" takes singular verb.'
    ]
  },
  {
    id: 'note-2',
    titleEn: 'Top 250 Appropriate Prepositions with Bengali Meaning',
    titleBn: 'শীর্ষ ২৫০টি অ্যাপ্রোপ্রিয়েট প্রিপজিশন বাংলা অর্থসহ',
    subject: 'Vocabulary & Grammar',
    category: 'Handwritten Notes',
    pages: 18,
    fileSize: '3.8 MB',
    downloads: 21500,
    date: 'Sep 2026',
    descriptionEn: 'Alphabetically organized appropriate prepositions with authentic Bengali explanations and sample sentences.',
    descriptionBn: 'বর্ণানুক্রমিক সাজানো প্রয়োজনীয় প্রিপজিশন, অর্থ এবং বোর্ড প্রশ্ন বিশ্লেষণ।',
    tags: ['Prepositions', 'BCS', 'Admission', 'Handwritten'],
    sampleContent: [
      'Abide by (মেনে চলা) - You must abide by the school rules.',
      'Abound in (প্রচুর পরিমাণে থাকা) - Fish abounds in our rivers.',
      'Blind of (চোখে অন্ধ) vs Blind to (দোষের প্রতি অন্ধ).'
    ]
  }
];

export const NOTICES: Notice[] = [
  {
    id: 'not-1',
    titleEn: 'HSC 2026 Exclusive Intensive English Batch: Admission Open',
    titleBn: 'এইচএসসি ২০২৬ স্পেশাল ইন্টেনসিভ ইংলিশ ব্যাচে ভর্তি চলছে',
    date: '18 Oct 2026',
    category: 'Admission',
    isPinned: true,
    contentEn: 'Registration is now open for the HSC 2026 Comprehensive English 1st & 2nd Paper Batch conducted directly by MD Touhidul Hoque Tuhin Sir. Limited seats. Contact via WhatsApp or online admission form.',
    contentBn: 'সরাসরি তৌহিদুল হক তুহিন স্যারের তত্ত্বাবধানে এইচএসসি ২০২৬ শিক্ষার্থীদের ১ম ও ২য় পত্রের নতুন ব্যাচে ভর্তি চলছে। সীমিত আসন। হোয়াটসঅ্যাপ অথবা অনলাইন ফরমের মাধ্যমে দ্রুত যোগাযোগ করুন।'
  },
  {
    id: 'not-2',
    titleEn: 'Monthly Model Test Schedule for All Batches Published',
    titleBn: 'সকল ব্যাচের মাসিক মডেল টেস্ট রুটিন প্রকাশিত',
    date: '15 Oct 2026',
    category: 'Routine',
    isPinned: true,
    contentEn: 'The monthly evaluation exam for all enrolled students will commence from next Friday. Check your course subject details in the classroom.',
    contentBn: 'আগামী শুক্রবার থেকে সকল কোর্সের শিক্ষার্থীদের মাসিক মূল্যায়ন পরীক্ষা শুরু হবে। বিস্তারিত বিষয় ও রুটিন ক্লাসরুম থেকে জেনে নিন।'
  }
];

export const EDUCATIONAL_POSTS: EducationalPost[] = [
  {
    id: 'post-1',
    titleEn: 'Top 5 Grammatical Mistakes Most HSC Students Make',
    titleBn: 'যে ৫টি ভুলের কারণে অধিকাংশ শিক্ষার্থী এইচএসসি ইংরেজিতে মার্ক হারায়',
    author: 'MD Touhidul Hoque Tuhin',
    date: 'Oct 15, 2026',
    category: 'Exam Advice',
    readTime: '4 min read',
    excerptEn: 'Learn the 5 critical grammatical traps in English 2nd Paper and how to easily avoid them in the board exam.',
    excerptBn: 'ইংরেজি ২য় পত্রে অনেকেই নিয়মের বাইরে না গিয়েও ছোটখাটো ভুলের জন্য ১০-১৫ মার্ক হারিয়ে ফেলে। জেনে নিন সেই ৫টি ভুল।',
    likes: 342,
    commentsCount: 48,
    tags: ['HSC 2026', 'English 2nd Paper', 'Exam Tips'],
    contentEn: [
      '1. Writing overly long sentences in Modifiers: When asked to pre-modify or post-modify, use concise exact words or small phrases.',
      '2. Using Connectors without understanding contrast vs reason.',
      '3. Inconsistent pronoun reference in Narration.'
    ],
    contentBn: [
      '১. Modifier-এ অযথা বড় বাক্য লেখা: সংক্ষিপ্ত ও নির্ভুল শব্দ ব্যবহার করুন।',
      '২. Connectors-এর অর্থ না বুঝে মুখস্থ বসানো।',
      '৩. Narration-এ Pronoun ও Tense-এর অসঙ্গতি এড়িয়ে চলুন।'
    ]
  }
];

export const SUGGESTIONS: Suggestion[] = [
  {
    id: 'sug-1',
    titleEn: 'HSC 2026 English 1st Paper Super Exclusive Suggestions',
    titleBn: 'এইচএসসি ২০২৬ ইংলিশ ১ম পত্র সুপার এক্সক্লুসিভ সাজেশন',
    targetExam: 'HSC 2026',
    subject: 'English 1st Paper',
    priority: 'Critical ⭐⭐⭐',
    publishedDate: 'Updated Oct 2026',
    descriptionEn: 'High-yield passage analysis, poem themes, and writing items curated from all education boards question frequency analysis.',
    descriptionBn: 'সকল শিক্ষা বোর্ডের বিগত বছরের প্রশ্ন বিশ্লেষণ করে তৈরি করা ১০০% গুরুত্বপূর্ণ প্যাসেজ, কবিতা ও কম্পোজিশন সাজেশন।',
    recommendedTopics: [
      'Passage 1: Folk Music & Traditional Culture of Bangladesh',
      'Passage 2: The Unbeaten Nelson Mandela & Anti-Apartheid Movement',
      'Themes of poems: "Under the Greenwood Tree", "I Died for Beauty"',
      'Top Paragraphs: "Metro Rail in Bangladesh", "Smart Bangladesh 2041"'
    ],
    keyPoints: [
      'Focus strictly on 3-part answer format for 2-mark open-ended questions.',
      'Never copy verbatim sentences in summary writing; stay within 75 words.'
    ]
  }
];

export const MODEL_TESTS: ModelTest[] = [
  {
    id: 'test-1',
    title: 'Grammar Precision Challenge: Right Forms of Verbs & Prepositions',
    category: 'Basic Grammar Test',
    durationMinutes: 10,
    totalMarks: 10,
    questions: [
      {
        id: 1,
        question: 'Neither the headmaster nor the assistant teachers _______ present in the meeting.',
        options: ['was', 'were', 'is', 'has been'],
        correctAnswer: 1,
        explanation: 'When subjects are joined by "neither... nor", the verb agrees with the subject closest to it. Here, "assistant teachers" is plural, so the verb is "were".'
      },
      {
        id: 2,
        question: 'It is high time we _______ our bad habits and worked sincerely.',
        options: ['change', 'changed', 'have changed', 'will change'],
        correctAnswer: 1,
        explanation: 'After "It is high time" followed by a subject, past simple tense (V2) is used.'
      },
      {
        id: 3,
        question: 'The criminal was accused _______ committing forgery and theft.',
        options: ['for', 'with', 'of', 'in'],
        correctAnswer: 2,
        explanation: 'The appropriate preposition with "accuse" is "of" (accuse somebody of something).'
      }
    ]
  }
];

export const STUDENT_REVIEWS: StudentReview[] = [
  {
    id: 'rev-1',
    name: 'Tanvir Ahmed',
    institute: 'Dhaka College',
    exam: 'HSC GPA 5.00',
    rating: 5,
    comment: 'Tuhin Sir transformed my fear of English grammar into pure confidence. His Right Form of Verbs and Modifier rules are unbeatable!',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'rev-2',
    name: 'Nusrat Jahan Mim',
    institute: 'Viqarunnisa Noon College',
    exam: 'HSC Candidate',
    rating: 5,
    comment: 'The handwritten lecture notes of "I Have A School" are unmatched. Complex transformations become so easy!',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop'
  }
];

export const TEACHER_PROFILE = INITIAL_TEACHERS[0];

export const INITIAL_ROUTINES: ClassRoutine[] = [
  {
    id: 'rtn-1',
    titleEn: 'HSC 2026 Live Master Class Routine',
    titleBn: 'এইচএসসি ২০২৬ লাইভ মাস্টার ক্লাস রুটিন',
    academicYear: '2026',
    category: 'Class Routine',
    imageUrl: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=1200&auto=format&fit=crop',
    uploadedDate: '2026-10-18',
    notes: 'শনি, সোম ও বুধবার রাত ৮:৩০ মিনিটে লাইভ ক্লাস অনুষ্ঠিত হয়।'
  },
  {
    id: 'rtn-2',
    titleEn: 'Monthly Model Test & Assessment Exam Routine',
    titleBn: 'মাসিক মডেল টেস্ট ও মূল্যায়ন পরীক্ষা রুটিন',
    academicYear: '2026',
    category: 'Exam Routine',
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1200&auto=format&fit=crop',
    uploadedDate: '2026-10-15',
    notes: 'পরীক্ষার্থীদের নির্ধারিত সময়ের ১০ মিনিট পূর্বে ক্লাসরুমে উপস্থিত হতে হবে।'
  }
];

export const INITIAL_CHATBOT_TRAINING: ChatbotTrainingItem[] = [
  {
    id: 'train-1',
    year: '2026',
    topic: 'এইচএসসি ২০২৬ ও স্পোকেন ব্যাচ ভর্তি নির্দেশিকা',
    content: `আই হ্যাভ এ স্কুল (I Have A School) প্ল্যাটফর্মে এমডি তৌহিদুল হক তুহিন স্যারের বিশেষ নির্দেশনায় ভর্তি কার্যক্রম পরিচালিত হয়।
কোর্স ফি ও ভর্তি নিয়মাবলী:
১. কমপ্লিট ইংলিশ গ্রামার ফাউন্ডেশন: ১৫০০ টাকা।
২. স্পোকেন ইংলিশ ও ফ্লুয়েন্সি বুস্টার: ১২০০ টাকা।
৩. এইচএসসি ২০২৬ ১ম ও ২য় পত্র পূর্ণাঙ্গ একাডেমিক ব্যাচ: ১৮০০ টাকা।
ভর্তির মাধ্যম: বিকাশ ও নগদ পার্সোনাল নাম্বারে পেমেন্ট করে ট্রানজেকশন আইডি সহ হোয়াটসঅ্যাপ হেল্পলাইনে কনফার্ম করতে হবে।
লাইভ ক্লাস শিডিউল: প্রতি শনি, সোম ও বুধবার রাত ৮:৩০ মিনিটে অনুষ্ঠিত হয়।
লেকচার শিট: প্রতিটি ক্লাসের পর হাতে লেখা পিডিএফ শিট ওয়েবসাইট থেকে ফ্রিতে ডাউনলোড করা যাবে।`,
    wordCount: 88,
    createdAt: '2026-10-18'
  },
  {
    id: 'train-2',
    year: '2026',
    topic: 'এইচএসসি ইংরেজি ২য় পত্র গোল্ডেন গ্রামার রুলস',
    content: `রাইট ফর্ম অফ ভার্বস এবং মডিফায়ার সংক্রান্ত স্পেশাল টেকনিক:
১. বাক্যে "It is high time" বা "It is time" থাকলে এবং পরে Subject আসলে সবসময় Past Indefinite (V2) বসে।
২. With a view to, look forward to, be used to, get used to, cannot help, would you mind ইত্যাদির পর verb+ing যুক্ত হয়।
৩. As well as, along with, together with, accompanied by দ্বারা দুটি subject যুক্ত হলে প্রথম subject অনুযায়ী verb নির্ধারণ করা হয়।
৪. কোনো বাক্যে lest থাকলে পরবর্তী clause-এ should/might বসে।
৫. Modifiers করার সময় লক্ষ্য রাখতে হবে Noun-এর পূর্বে সাধারণত Adjective বা Noun-adjective বসে pre-modifier হিসেবে কাজ করে।`,
    wordCount: 96,
    createdAt: '2026-10-18'
  }
];

// Helper to retrieve securely saved GitHub token across all reloads
export const getStoredGitHubToken = (): string => {
  const sanitize = (val: any): string => {
    if (!val || typeof val !== 'string') return '';
    let cleaned = val.trim();
    cleaned = cleaned.replace(/^["']|["']$/g, '').trim();
    if (cleaned.toLowerCase().startsWith('bearer ')) {
      cleaned = cleaned.slice(7).trim();
    } else if (cleaned.toLowerCase().startsWith('token ')) {
      cleaned = cleaned.slice(6).trim();
    }
    return cleaned;
  };

  try {
    if (typeof window !== 'undefined') {
      const master = sanitize(localStorage.getItem('ihas_github_token_master'));
      if (master) return master;
      const session = sanitize(sessionStorage.getItem('ihas_github_token_master'));
      if (session) return session;
      const safe = sanitize(localStorage.getItem('ihas_github_token'));
      if (safe) return safe;
      const cfgRaw = localStorage.getItem('ihas_github_config');
      if (cfgRaw) {
        try {
          const parsed = JSON.parse(cfgRaw);
          const t = sanitize(parsed?.token);
          if (t) return t;
        } catch {
          // ignore
        }
      }
    }
  } catch {
    // ignore
  }
  const envToken = (typeof process !== 'undefined' && process.env?.VITE_GITHUB_TOKEN) || import.meta.env.VITE_GITHUB_TOKEN || '';
  return sanitize(envToken);
};

// Default GitHub Configuration - Token is permanently saved once entered
// Note: autoPushOnChange is false by default: changes are pushed only when admin clicks the Push button
export const DEFAULT_GITHUB_CONFIG: GitHubConfig = {
  enabled: true,
  token: getStoredGitHubToken(),
  owner: import.meta.env.VITE_GITHUB_OWNER || 'bmd03024-code',
  repo: import.meta.env.VITE_GITHUB_REPO || 'I-Have-A-School-',
  branch: 'main',
  filePath: 'data/ihas_live_database.json',
  autoPushOnChange: false,
  autoPollIntervalSec: 20,
  lastSyncedAt: '',
  lastCommitSha: '',
  lastCommitMessage: 'Manual push mode enabled'
};

