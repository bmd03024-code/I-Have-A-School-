export type Language = 'bn' | 'en';

export interface FooterCustomLink {
  id: string;
  titleBn: string;
  titleEn: string;
  url: string;
}

export interface SchoolSettings {
  instituteNameEn: string;
  instituteNameBn: string;
  taglineEn: string;
  taglineBn: string;
  logoUrl: string;
  headmasterSignatureUrl: string;
  officialSealUrl: string;
  phone: string;
  whatsapp: string;
  email: string;
  addressEn: string;
  addressBn: string;
  facebookUrl: string;
  youtubeUrl: string;
  telegramUrl: string;
  messengerUrl?: string;
  founderNameBn?: string;
  founderNameEn?: string;
  footerDescriptionBn?: string;
  footerDescriptionEn?: string;
  learningHubLinks?: FooterCustomLink[];
  servicesLinks?: FooterCustomLink[];
}

export interface HeroSlide {
  id: string;
  titleEn: string;
  titleBn: string;
  subtitleEn: string;
  subtitleBn: string;
  imageUrl: string;
  buttonTextEn: string;
  buttonTextBn: string;
  buttonUrl: string;
  active: boolean;
}

export interface Course {
  id: string;
  titleEn: string;
  titleBn: string;
  subtitleEn: string;
  subtitleBn: string;
  category: 'HSC & SSC' | 'Spoken English' | 'BCS & Job Prep' | 'Grammar Foundation';
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  durationEn: string;
  durationBn: string;
  lecturesCount: number;
  price: number;
  originalPrice: number;
  isFeatured?: boolean;
  bannerImage: string;
  descriptionEn: string;
  descriptionBn: string;
  syllabus: {
    week: string;
    topics: string[];
  }[];
  featuresEn: string[];
  featuresBn: string[];
  instructor: {
    name: string;
    designation: string;
    image: string;
  };
}

export interface Student {
  id: string;
  academicYear: string;
  courseId: string;
  roll: string;
  nameEn: string;
  nameBn: string;
  fatherNameEn: string;
  fatherNameBn: string;
  motherNameEn: string;
  motherNameBn: string;
  address: string;
  phone: string;
  admissionDate: string;
  photoUrl?: string;
}

export interface CourseSubject {
  id: string;
  courseId: string;
  name: string;
  fullMarks: number;
  passMarks: number;
}

export interface CourseExam {
  id: string;
  courseId: string;
  name: string;
  examType: string;
  date: string;
}

export interface StudentResult {
  id: string;
  academicYear: string;
  courseId: string;
  examId: string;
  studentRoll: string;
  subjectMarks: Record<string, number>; // subjectId -> mark
  totalMarks: number;
  totalFullMarks: number;
  percentage: number;
  gpa: number;
  grade: string;
  createdDate: string;
}

export interface Teacher {
  id: string;
  nameEn: string;
  nameBn: string;
  designationEn: string;
  designationBn: string;
  qualification: string;
  phone: string;
  email: string;
  photoUrl: string;
  isHeadmaster?: boolean;
  joiningDate?: string;
  signatureUrl?: string;
  address?: string;
}

export interface VideoClass {
  id: string;
  titleEn: string;
  titleBn: string;
  descriptionEn: string;
  descriptionBn: string;
  category: 'Spoken English' | 'Grammar Hacks' | 'HSC English' | 'BCS & Govt Job' | 'Vocabulary';
  duration: string;
  youtubeId: string;
  videoUrl?: string;
  thumbnailUrl: string;
  views: string;
  publishedDate: string;
  level: string;
  chapters?: { time: string; title: string }[];
  keyNotes?: string[];
  videoPlatform?: 'youtube' | 'facebook' | 'tiktok' | 'uploaded';
  videoFileUrl?: string;
}

export interface NoteResource {
  id: string;
  titleEn: string;
  titleBn: string;
  subject: string;
  category: 'Grammar Sheets' | 'Handwritten Notes' | 'HSC English' | 'Vocabulary Booster' | 'Suggestions';
  pages: number;
  fileSize: string;
  downloads: number;
  date: string;
  descriptionEn: string;
  descriptionBn: string;
  fileUrl?: string;
  fileType?: 'pdf' | 'image' | 'link';
  tags: string[];
  sampleContent: string[];
}

export interface EducationalPost {
  id: string;
  titleEn: string;
  titleBn: string;
  author: string;
  date: string;
  category: 'English Grammar' | 'Spoken Fluency' | 'Exam Advice' | 'Vocabulary & Idioms' | 'Motivation';
  readTime: string;
  excerptEn: string;
  excerptBn: string;
  contentEn: string[];
  contentBn: string[];
  likes: number;
  tags: string[];
  imageUrl?: string;
  commentsCount: number;
}

export interface Suggestion {
  id: string;
  titleEn: string;
  titleBn: string;
  targetExam: 'HSC 2026' | 'HSC 2025' | 'SSC 2026' | 'BCS Preliminary' | 'Primary & NTRCA';
  subject: string;
  priority: 'Critical ⭐⭐⭐' | 'High ⭐⭐' | 'Moderate ⭐';
  publishedDate: string;
  descriptionEn: string;
  descriptionBn: string;
  keyPoints: string[];
  recommendedTopics: string[];
}

export interface Notice {
  id: string;
  titleEn: string;
  titleBn: string;
  date: string;
  category: 'Admission' | 'Routine' | 'General' | 'Exam';
  contentEn: string;
  contentBn: string;
  imageUrl?: string;
  pdfUrl?: string;
  isPinned?: boolean;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface ModelTest {
  id: string;
  title: string;
  category: 'HSC 1st & 2nd Paper' | 'Basic Grammar Test' | 'BCS English Model Test' | 'Spoken English Quick Test';
  durationMinutes: number;
  totalMarks: number;
  questions: QuizQuestion[];
}

export interface StudentReview {
  id: string;
  name: string;
  institute: string;
  exam: string;
  rating: number;
  comment: string;
  avatar: string;
}

export interface ChatbotTrainingItem {
  id: string;
  year: string;
  topic: string;
  content: string; // up to 5000 words
  wordCount: number;
  createdAt: string;
  updatedAt?: string;
}

export interface DictionaryCustomEntry {
  id: string;
  word: string;
  phonetic?: string;
  partOfSpeech: string;
  meaningBn: string;
  definitionEn: string;
  exampleEn?: string;
  synonyms?: string[];
  blockName?: string;
  source?: 'oxford' | 'manual' | 'bulk';
}

export interface ClassRoutine {
  id: string;
  titleEn: string;
  titleBn: string;
  academicYear: string;
  courseId?: string;
  category: 'Class Routine' | 'Exam Routine' | 'Batch Routine';
  imageUrl: string;
  uploadedDate: string;
  notes?: string;
}

export interface GoogleCloudConfig {
  projectId: string;
  bucketName: string;
  apiEndpoint?: string;
  apiKey?: string;
  isRealtimeSyncEnabled: boolean;
  oxfordApiCode?: string;
  lastSyncedAt?: string;
}
