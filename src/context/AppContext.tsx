import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  Language, 
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
  Notice,
  ClassRoutine,
  ChatbotTrainingItem,
  GoogleCloudConfig,
  ModelTest
} from '../types';
import { 
  DEFAULT_SCHOOL_SETTINGS, 
  INITIAL_HERO_SLIDES, 
  COURSES as DEFAULT_COURSES, 
  INITIAL_STUDENTS, 
  INITIAL_SUBJECTS, 
  INITIAL_EXAMS, 
  INITIAL_RESULTS, 
  INITIAL_TEACHERS, 
  VIDEO_CLASSES as DEFAULT_VIDEOS, 
  NOTES_RESOURCES as DEFAULT_NOTES, 
  NOTICES as DEFAULT_NOTICES,
  INITIAL_ROUTINES,
  INITIAL_CHATBOT_TRAINING,
  DEFAULT_GOOGLE_CLOUD_CONFIG,
  MODEL_TESTS as DEFAULT_TESTS
} from '../data/mockData';
import { notifyRealtimeUpdate, subscribeRealtimeUpdate } from '../lib/storageService';

export interface AppContextType {
  // Language Toggle
  lang: Language;
  toggleLang: () => void;
  t: (bn: string, en: string) => string;

  // Admin Security & Credentials
  isAdminLoggedIn: boolean;
  adminCredentials: { email: string; password: string };
  loginAdmin: (email: string, pass: string) => boolean;
  logoutAdmin: () => void;
  updateAdminCredentials: (email: string, pass: string) => void;

  // School Settings & Branding
  schoolSettings: SchoolSettings;
  updateSchoolSettings: (settings: SchoolSettings) => void;

  // Hero Slides
  heroSlides: HeroSlide[];
  addHeroSlide: (slide: HeroSlide) => void;
  updateHeroSlide: (slide: HeroSlide) => void;
  deleteHeroSlide: (id: string) => void;

  // Courses
  courses: Course[];
  addCourse: (course: Course) => void;
  updateCourse: (course: Course) => void;
  deleteCourse: (id: string) => void;

  // Students & Admission
  students: Student[];
  addStudent: (student: Student) => void;
  updateStudent: (student: Student) => void;
  deleteStudent: (id: string) => void;

  // Course Subjects & Exams
  subjects: CourseSubject[];
  addSubject: (subject: CourseSubject) => void;
  deleteSubject: (id: string) => void;
  exams: CourseExam[];
  addExam: (exam: CourseExam) => void;
  deleteExam: (id: string) => void;

  // Results & Marksheet
  results: StudentResult[];
  addResult: (result: StudentResult) => void;
  deleteResult: (id: string) => void;

  // Teachers
  teachers: Teacher[];
  addTeacher: (teacher: Teacher) => void;
  updateTeacher: (teacher: Teacher) => void;
  deleteTeacher: (id: string) => void;

  // Videos, Notes & Notices
  videoClasses: VideoClass[];
  addVideoClass: (video: VideoClass) => void;
  updateVideoClass: (video: VideoClass) => void;
  deleteVideoClass: (id: string) => void;
  notes: NoteResource[];
  addNote: (note: NoteResource) => void;
  updateNote: (note: NoteResource) => void;
  deleteNote: (id: string) => void;
  notices: Notice[];
  addNotice: (notice: Notice) => void;
  updateNotice: (notice: Notice) => void;
  deleteNotice: (id: string) => void;

  // Routines
  routines: ClassRoutine[];
  addRoutine: (routine: ClassRoutine) => void;
  updateRoutine: (routine: ClassRoutine) => void;
  deleteRoutine: (id: string) => void;

  // Chatbot Training
  chatbotTraining: ChatbotTrainingItem[];
  addChatbotTraining: (item: ChatbotTrainingItem) => void;
  updateChatbotTraining: (item: ChatbotTrainingItem) => void;
  deleteChatbotTraining: (id: string) => void;

  // Quizzes / Model Tests (Quiz Management)
  modelTests: ModelTest[];
  addModelTest: (test: ModelTest) => void;
  updateModelTest: (test: ModelTest) => void;
  deleteModelTest: (id: string) => void;

  // Google Cloud & Realtime
  googleCloudConfig: GoogleCloudConfig;
  updateGoogleCloudConfig: (config: GoogleCloudConfig) => void;
  isCloudSyncing: boolean;
  triggerCloudSync: () => Promise<void>;

  // Student State
  bookmarks: string[];
  toggleBookmark: (id: string) => void;
  isBookmarked: (id: string) => boolean;
  enrolledCourseIds: string[];
  enrollInCourse: (courseId: string) => void;
  isEnrolled: (courseId: string) => boolean;
  watchedVideoIds: string[];
  markVideoWatched: (videoId: string) => void;
  testScores: Record<string, { score: number; total: number; date: string }>;
  saveTestScore: (testId: string, score: number, total: number) => void;

  // Modals & UI
  selectedCourseForEnrollment: Course | null;
  openEnrollmentModal: (course: Course) => void;
  closeEnrollmentModal: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  isCalcOpen: boolean;
  setIsCalcOpen: (open: boolean) => void;
  isFloatingDictOpen: boolean;
  setIsFloatingDictOpen: (open: boolean) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Language: Default to 'bn', togglable to 'en'
  const [lang, setLang] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('ihas_language');
      return (saved === 'en' || saved === 'bn') ? saved : 'bn';
    } catch {
      return 'bn';
    }
  });

  const toggleLang = () => {
    setLang((prev) => {
      const next = prev === 'bn' ? 'en' : 'bn';
      localStorage.setItem('ihas_language', next);
      return next;
    });
  };

  const t = (bn: string, en: string) => (lang === 'bn' ? bn : en);

  // 2. Admin Authentication & Default Credentials (tuhinsir@gmail.com / tuhinsir1234)
  const [adminCredentials, setAdminCredentials] = useState(() => {
    try {
      const saved = localStorage.getItem('ihas_admin_creds');
      return saved ? JSON.parse(saved) : { email: 'tuhinsir@gmail.com', password: 'tuhinsir1234' };
    } catch {
      return { email: 'tuhinsir@gmail.com', password: 'tuhinsir1234' };
    }
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    try {
      return localStorage.getItem('ihas_admin_session') === 'true';
    } catch {
      return false;
    }
  });

  const loginAdmin = (email: string, pass: string): boolean => {
    if (email.toLowerCase() === adminCredentials.email.toLowerCase() && pass === adminCredentials.password) {
      setIsAdminLoggedIn(true);
      localStorage.setItem('ihas_admin_session', 'true');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('ihas_admin_session');
  };

  const updateAdminCredentials = (email: string, pass: string) => {
    const creds = { email, password: pass };
    setAdminCredentials(creds);
    localStorage.setItem('ihas_admin_creds', JSON.stringify(creds));
  };

  // 3. School Settings & Branding
  const [schoolSettings, setSchoolSettings] = useState<SchoolSettings>(() => {
    try {
      const saved = localStorage.getItem('ihas_school_settings');
      return saved ? JSON.parse(saved) : DEFAULT_SCHOOL_SETTINGS;
    } catch {
      return DEFAULT_SCHOOL_SETTINGS;
    }
  });

  const updateSchoolSettings = (newSettings: SchoolSettings) => {
    setSchoolSettings(newSettings);
    localStorage.setItem('ihas_school_settings', JSON.stringify(newSettings));
    notifyRealtimeUpdate('schoolSettings', newSettings);
  };

  // 4. Hero Slides
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(() => {
    try {
      const saved = localStorage.getItem('ihas_hero_slides');
      return saved ? JSON.parse(saved) : INITIAL_HERO_SLIDES;
    } catch {
      return INITIAL_HERO_SLIDES;
    }
  });

  const addHeroSlide = (slide: HeroSlide) => {
    setHeroSlides((prev) => {
      const next = [slide, ...prev];
      localStorage.setItem('ihas_hero_slides', JSON.stringify(next));
      notifyRealtimeUpdate('heroSlides', next);
      return next;
    });
  };

  const updateHeroSlide = (slide: HeroSlide) => {
    setHeroSlides((prev) => {
      const next = prev.map((s) => (s.id === slide.id ? slide : s));
      localStorage.setItem('ihas_hero_slides', JSON.stringify(next));
      notifyRealtimeUpdate('heroSlides', next);
      return next;
    });
  };

  const deleteHeroSlide = (id: string) => {
    setHeroSlides((prev) => {
      const next = prev.filter((s) => s.id !== id);
      localStorage.setItem('ihas_hero_slides', JSON.stringify(next));
      notifyRealtimeUpdate('heroSlides', next);
      return next;
    });
  };

  // 5. Courses
  const [courses, setCourses] = useState<Course[]>(() => {
    try {
      const saved = localStorage.getItem('ihas_courses');
      return saved ? JSON.parse(saved) : DEFAULT_COURSES;
    } catch {
      return DEFAULT_COURSES;
    }
  });

  const addCourse = (course: Course) => {
    setCourses((prev) => {
      const next = [course, ...prev];
      localStorage.setItem('ihas_courses', JSON.stringify(next));
      notifyRealtimeUpdate('courses', next);
      return next;
    });
  };

  const updateCourse = (course: Course) => {
    setCourses((prev) => {
      const next = prev.map((c) => (c.id === course.id ? course : c));
      localStorage.setItem('ihas_courses', JSON.stringify(next));
      notifyRealtimeUpdate('courses', next);
      return next;
    });
  };

  const deleteCourse = (id: string) => {
    setCourses((prev) => {
      const next = prev.filter((c) => c.id !== id);
      localStorage.setItem('ihas_courses', JSON.stringify(next));
      notifyRealtimeUpdate('courses', next);
      return next;
    });
  };

  // 6. Students
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem('ihas_students');
      return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
    } catch {
      return INITIAL_STUDENTS;
    }
  });

  const addStudent = (student: Student) => {
    setStudents((prev) => {
      const next = [student, ...prev];
      localStorage.setItem('ihas_students', JSON.stringify(next));
      notifyRealtimeUpdate('students', next);
      return next;
    });
  };

  const updateStudent = (student: Student) => {
    setStudents((prev) => {
      const next = prev.map((s) => (s.id === student.id ? student : s));
      localStorage.setItem('ihas_students', JSON.stringify(next));
      notifyRealtimeUpdate('students', next);
      return next;
    });
  };

  const deleteStudent = (id: string) => {
    setStudents((prev) => {
      const next = prev.filter((s) => s.id !== id);
      localStorage.setItem('ihas_students', JSON.stringify(next));
      notifyRealtimeUpdate('students', next);
      return next;
    });
  };

  // 7. Subjects & Exams
  const [subjects, setSubjects] = useState<CourseSubject[]>(() => {
    try {
      const saved = localStorage.getItem('ihas_subjects');
      return saved ? JSON.parse(saved) : INITIAL_SUBJECTS;
    } catch {
      return INITIAL_SUBJECTS;
    }
  });

  const addSubject = (sub: CourseSubject) => {
    setSubjects((prev) => {
      const next = [...prev, sub];
      localStorage.setItem('ihas_subjects', JSON.stringify(next));
      notifyRealtimeUpdate('subjects', next);
      return next;
    });
  };

  const deleteSubject = (id: string) => {
    setSubjects((prev) => {
      const next = prev.filter((s) => s.id !== id);
      localStorage.setItem('ihas_subjects', JSON.stringify(next));
      notifyRealtimeUpdate('subjects', next);
      return next;
    });
  };

  const [exams, setExams] = useState<CourseExam[]>(() => {
    try {
      const saved = localStorage.getItem('ihas_exams');
      return saved ? JSON.parse(saved) : INITIAL_EXAMS;
    } catch {
      return INITIAL_EXAMS;
    }
  });

  const addExam = (exam: CourseExam) => {
    setExams((prev) => {
      const next = [...prev, exam];
      localStorage.setItem('ihas_exams', JSON.stringify(next));
      notifyRealtimeUpdate('exams', next);
      return next;
    });
  };

  const deleteExam = (id: string) => {
    setExams((prev) => {
      const next = prev.filter((e) => e.id !== id);
      localStorage.setItem('ihas_exams', JSON.stringify(next));
      notifyRealtimeUpdate('exams', next);
      return next;
    });
  };

  // 8. Results
  const [results, setResults] = useState<StudentResult[]>(() => {
    try {
      const saved = localStorage.getItem('ihas_results');
      return saved ? JSON.parse(saved) : INITIAL_RESULTS;
    } catch {
      return INITIAL_RESULTS;
    }
  });

  const addResult = (res: StudentResult) => {
    setResults((prev) => {
      const filtered = prev.filter(
        (r) => !(r.studentRoll === res.studentRoll && r.academicYear === res.academicYear && r.courseId === res.courseId && r.examId === res.examId)
      );
      const next = [res, ...filtered];
      localStorage.setItem('ihas_results', JSON.stringify(next));
      notifyRealtimeUpdate('results', next);
      return next;
    });
  };

  const deleteResult = (id: string) => {
    setResults((prev) => {
      const next = prev.filter((r) => r.id !== id);
      localStorage.setItem('ihas_results', JSON.stringify(next));
      notifyRealtimeUpdate('results', next);
      return next;
    });
  };

  // 9. Teachers
  const [teachers, setTeachers] = useState<Teacher[]>(() => {
    try {
      const saved = localStorage.getItem('ihas_teachers');
      return saved ? JSON.parse(saved) : INITIAL_TEACHERS;
    } catch {
      return INITIAL_TEACHERS;
    }
  });

  const addTeacher = (tch: Teacher) => {
    setTeachers((prev) => {
      const next = [...prev, tch];
      localStorage.setItem('ihas_teachers', JSON.stringify(next));
      notifyRealtimeUpdate('teachers', next);
      return next;
    });
  };

  const updateTeacher = (tch: Teacher) => {
    setTeachers((prev) => {
      const next = prev.map((t) => (t.id === tch.id ? tch : t));
      localStorage.setItem('ihas_teachers', JSON.stringify(next));
      notifyRealtimeUpdate('teachers', next);
      return next;
    });
  };

  const deleteTeacher = (id: string) => {
    setTeachers((prev) => {
      const next = prev.filter((t) => t.id !== id);
      localStorage.setItem('ihas_teachers', JSON.stringify(next));
      notifyRealtimeUpdate('teachers', next);
      return next;
    });
  };

  // 10. Videos, Notes, Notices
  const [videoClasses, setVideoClasses] = useState<VideoClass[]>(() => {
    try {
      const saved = localStorage.getItem('ihas_videos');
      return saved ? JSON.parse(saved) : DEFAULT_VIDEOS;
    } catch {
      return DEFAULT_VIDEOS;
    }
  });

  const addVideoClass = (v: VideoClass) => {
    setVideoClasses((prev) => {
      const next = [v, ...prev];
      localStorage.setItem('ihas_videos', JSON.stringify(next));
      notifyRealtimeUpdate('videoClasses', next);
      return next;
    });
  };

  const updateVideoClass = (v: VideoClass) => {
    setVideoClasses((prev) => {
      const next = prev.map((vid) => (vid.id === v.id ? v : vid));
      localStorage.setItem('ihas_videos', JSON.stringify(next));
      notifyRealtimeUpdate('videoClasses', next);
      return next;
    });
  };

  const deleteVideoClass = (id: string) => {
    setVideoClasses((prev) => {
      const next = prev.filter((v) => v.id !== id);
      localStorage.setItem('ihas_videos', JSON.stringify(next));
      notifyRealtimeUpdate('videoClasses', next);
      return next;
    });
  };

  const [notes, setNotes] = useState<NoteResource[]>(() => {
    try {
      const saved = localStorage.getItem('ihas_notes');
      return saved ? JSON.parse(saved) : DEFAULT_NOTES;
    } catch {
      return DEFAULT_NOTES;
    }
  });

  const addNote = (n: NoteResource) => {
    setNotes((prev) => {
      const next = [n, ...prev];
      localStorage.setItem('ihas_notes', JSON.stringify(next));
      notifyRealtimeUpdate('notes', next);
      return next;
    });
  };

  const updateNote = (n: NoteResource) => {
    setNotes((prev) => {
      const next = prev.map((note) => (note.id === n.id ? n : note));
      localStorage.setItem('ihas_notes', JSON.stringify(next));
      notifyRealtimeUpdate('notes', next);
      return next;
    });
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => {
      const next = prev.filter((n) => n.id !== id);
      localStorage.setItem('ihas_notes', JSON.stringify(next));
      notifyRealtimeUpdate('notes', next);
      return next;
    });
  };

  const [notices, setNotices] = useState<Notice[]>(() => {
    try {
      const saved = localStorage.getItem('ihas_notices');
      return saved ? JSON.parse(saved) : DEFAULT_NOTICES;
    } catch {
      return DEFAULT_NOTICES;
    }
  });

  const addNotice = (nt: Notice) => {
    setNotices((prev) => {
      const next = [nt, ...prev];
      localStorage.setItem('ihas_notices', JSON.stringify(next));
      notifyRealtimeUpdate('notices', next);
      return next;
    });
  };

  const updateNotice = (nt: Notice) => {
    setNotices((prev) => {
      const next = prev.map((n) => (n.id === nt.id ? nt : n));
      localStorage.setItem('ihas_notices', JSON.stringify(next));
      notifyRealtimeUpdate('notices', next);
      return next;
    });
  };

  const deleteNotice = (id: string) => {
    setNotices((prev) => {
      const next = prev.filter((nt) => nt.id !== id);
      localStorage.setItem('ihas_notices', JSON.stringify(next));
      notifyRealtimeUpdate('notices', next);
      return next;
    });
  };

  // 11. Routines
  const [routines, setRoutines] = useState<ClassRoutine[]>(() => {
    try {
      const saved = localStorage.getItem('ihas_routines');
      return saved ? JSON.parse(saved) : INITIAL_ROUTINES;
    } catch {
      return INITIAL_ROUTINES;
    }
  });

  const addRoutine = (rtn: ClassRoutine) => {
    setRoutines((prev) => {
      const next = [rtn, ...prev];
      localStorage.setItem('ihas_routines', JSON.stringify(next));
      notifyRealtimeUpdate('routines', next);
      return next;
    });
  };

  const updateRoutine = (rtn: ClassRoutine) => {
    setRoutines((prev) => {
      const next = prev.map((r) => (r.id === rtn.id ? rtn : r));
      localStorage.setItem('ihas_routines', JSON.stringify(next));
      notifyRealtimeUpdate('routines', next);
      return next;
    });
  };

  const deleteRoutine = (id: string) => {
    setRoutines((prev) => {
      const next = prev.filter((r) => r.id !== id);
      localStorage.setItem('ihas_routines', JSON.stringify(next));
      notifyRealtimeUpdate('routines', next);
      return next;
    });
  };

  // 12. Chatbot Training Module (up to 1,000,000 words capacity)
  const [chatbotTraining, setChatbotTraining] = useState<ChatbotTrainingItem[]>(() => {
    try {
      const saved = localStorage.getItem('ihas_chatbot_training');
      return saved ? JSON.parse(saved) : INITIAL_CHATBOT_TRAINING;
    } catch {
      return INITIAL_CHATBOT_TRAINING;
    }
  });

  const addChatbotTraining = (item: ChatbotTrainingItem) => {
    setChatbotTraining((prev) => {
      const next = [item, ...prev];
      localStorage.setItem('ihas_chatbot_training', JSON.stringify(next));
      notifyRealtimeUpdate('chatbotTraining', next);
      return next;
    });
  };

  const updateChatbotTraining = (item: ChatbotTrainingItem) => {
    setChatbotTraining((prev) => {
      const next = prev.map((t) => (t.id === item.id ? item : t));
      localStorage.setItem('ihas_chatbot_training', JSON.stringify(next));
      notifyRealtimeUpdate('chatbotTraining', next);
      return next;
    });
  };

  const deleteChatbotTraining = (id: string) => {
    setChatbotTraining((prev) => {
      const next = prev.filter((t) => t.id !== id);
      localStorage.setItem('ihas_chatbot_training', JSON.stringify(next));
      notifyRealtimeUpdate('chatbotTraining', next);
      return next;
    });
  };

  // 13. Quizzes / Model Tests (Quiz Management)
  const [modelTests, setModelTests] = useState<ModelTest[]>(() => {
    try {
      const saved = localStorage.getItem('ihas_quizzes');
      return saved ? JSON.parse(saved) : DEFAULT_TESTS;
    } catch {
      return DEFAULT_TESTS;
    }
  });

  const addModelTest = (test: ModelTest) => {
    setModelTests((prev) => {
      const next = [test, ...prev];
      localStorage.setItem('ihas_quizzes', JSON.stringify(next));
      notifyRealtimeUpdate('quizzes', next);
      return next;
    });
  };

  const updateModelTest = (test: ModelTest) => {
    setModelTests((prev) => {
      const next = prev.map((t) => (t.id === test.id ? test : t));
      localStorage.setItem('ihas_quizzes', JSON.stringify(next));
      notifyRealtimeUpdate('quizzes', next);
      return next;
    });
  };

  const deleteModelTest = (id: string) => {
    setModelTests((prev) => {
      const next = prev.filter((t) => t.id !== id);
      localStorage.setItem('ihas_quizzes', JSON.stringify(next));
      notifyRealtimeUpdate('quizzes', next);
      return next;
    });
  };

  // 14. Google Cloud Database & Storage Integration
  const [googleCloudConfig, setGoogleCloudConfig] = useState<GoogleCloudConfig>(() => {
    try {
      const saved = localStorage.getItem('ihas_google_cloud_config');
      return saved ? JSON.parse(saved) : DEFAULT_GOOGLE_CLOUD_CONFIG;
    } catch {
      return DEFAULT_GOOGLE_CLOUD_CONFIG;
    }
  });

  const [isCloudSyncing, setIsCloudSyncing] = useState(false);

  const updateGoogleCloudConfig = (config: GoogleCloudConfig) => {
    setGoogleCloudConfig(config);
    localStorage.setItem('ihas_google_cloud_config', JSON.stringify(config));
    notifyRealtimeUpdate('googleCloudConfig', config);
  };

  const triggerCloudSync = async () => {
    setIsCloudSyncing(true);
    try {
      // Simulate/trigger real-time handshake with Google Cloud storage & synchronization endpoint
      await new Promise((resolve) => setTimeout(resolve, 800));
      const updatedConfig = {
        ...googleCloudConfig,
        lastSyncedAt: new Date().toISOString()
      };
      setGoogleCloudConfig(updatedConfig);
      localStorage.setItem('ihas_google_cloud_config', JSON.stringify(updatedConfig));
      notifyRealtimeUpdate('googleCloudSync', { status: 'synced', time: updatedConfig.lastSyncedAt });
    } finally {
      setIsCloudSyncing(false);
    }
  };

  // Listen to cross-tab / cross-window real-time synchronization updates
  useEffect(() => {
    const unsubscribe = subscribeRealtimeUpdate((topic, data) => {
      try {
        switch (topic) {
          case 'schoolSettings':
          case 'settings': {
            if (data) setSchoolSettings(data);
            else {
              const raw = localStorage.getItem('ihas_school_settings');
              if (raw) setSchoolSettings(JSON.parse(raw));
            }
            break;
          }
          case 'heroSlides':
          case 'slides': {
            if (data) setHeroSlides(data);
            else {
              const raw = localStorage.getItem('ihas_hero_slides');
              if (raw) setHeroSlides(JSON.parse(raw));
            }
            break;
          }
          case 'courses': {
            if (data) setCourses(data);
            else {
              const raw = localStorage.getItem('ihas_courses');
              if (raw) setCourses(JSON.parse(raw));
            }
            break;
          }
          case 'students': {
            if (data) setStudents(data);
            else {
              const raw = localStorage.getItem('ihas_students');
              if (raw) setStudents(JSON.parse(raw));
            }
            break;
          }
          case 'subjects': {
            if (data) setSubjects(data);
            else {
              const raw = localStorage.getItem('ihas_subjects');
              if (raw) setSubjects(JSON.parse(raw));
            }
            break;
          }
          case 'exams': {
            if (data) setExams(data);
            else {
              const raw = localStorage.getItem('ihas_exams');
              if (raw) setExams(JSON.parse(raw));
            }
            break;
          }
          case 'results': {
            if (data) setResults(data);
            else {
              const raw = localStorage.getItem('ihas_results');
              if (raw) setResults(JSON.parse(raw));
            }
            break;
          }
          case 'teachers': {
            if (data) setTeachers(data);
            else {
              const raw = localStorage.getItem('ihas_teachers');
              if (raw) setTeachers(JSON.parse(raw));
            }
            break;
          }
          case 'videoClasses':
          case 'videos': {
            if (data) setVideoClasses(data);
            else {
              const raw = localStorage.getItem('ihas_videos');
              if (raw) setVideoClasses(JSON.parse(raw));
            }
            break;
          }
          case 'notes': {
            if (data) setNotes(data);
            else {
              const raw = localStorage.getItem('ihas_notes');
              if (raw) setNotes(JSON.parse(raw));
            }
            break;
          }
          case 'notices': {
            if (data) setNotices(data);
            else {
              const raw = localStorage.getItem('ihas_notices');
              if (raw) setNotices(JSON.parse(raw));
            }
            break;
          }
          case 'routines': {
            if (data) setRoutines(data);
            else {
              const raw = localStorage.getItem('ihas_routines');
              if (raw) setRoutines(JSON.parse(raw));
            }
            break;
          }
          case 'chatbotTraining':
          case 'chatbot_training': {
            if (data) setChatbotTraining(data);
            else {
              const raw = localStorage.getItem('ihas_chatbot_training');
              if (raw) setChatbotTraining(JSON.parse(raw));
            }
            break;
          }
          case 'quizzes': {
            if (data) setModelTests(data);
            else {
              const raw = localStorage.getItem('ihas_quizzes');
              if (raw) setModelTests(JSON.parse(raw));
            }
            break;
          }
          case 'googleCloudConfig':
          case 'google_cloud': {
            if (data) setGoogleCloudConfig(data);
            else {
              const raw = localStorage.getItem('ihas_google_cloud_config');
              if (raw) setGoogleCloudConfig(JSON.parse(raw));
            }
            break;
          }
          case 'admin_creds': {
            if (data) setAdminCredentials(data);
            else {
              const raw = localStorage.getItem('ihas_admin_creds');
              if (raw) setAdminCredentials(JSON.parse(raw));
            }
            break;
          }
        }
      } catch (err) {
        console.warn('Realtime update processing error:', err);
      }
    });

    return () => unsubscribe();
  }, []);

  // Student Bookmarks & Enrolled Courses
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ihas_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ihas_enrolled_courses');
      return saved ? JSON.parse(saved) : ['course-1'];
    } catch {
      return ['course-1'];
    }
  });

  const [watchedVideoIds, setWatchedVideoIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ihas_watched_videos');
      return saved ? JSON.parse(saved) : ['vid-1'];
    } catch {
      return ['vid-1'];
    }
  });

  const [testScores, setTestScores] = useState<Record<string, { score: number; total: number; date: string }>>(() => {
    try {
      const saved = localStorage.getItem('ihas_test_scores');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [selectedCourseForEnrollment, setSelectedCourseForEnrollment] = useState<Course | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isCalcOpen, setIsCalcOpen] = useState(false);
  const [isFloatingDictOpen, setIsFloatingDictOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('ihas_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem('ihas_enrolled_courses', JSON.stringify(enrolledCourseIds));
  }, [enrolledCourseIds]);

  useEffect(() => {
    localStorage.setItem('ihas_watched_videos', JSON.stringify(watchedVideoIds));
  }, [watchedVideoIds]);

  useEffect(() => {
    localStorage.setItem('ihas_test_scores', JSON.stringify(testScores));
  }, [testScores]);

  const toggleBookmark = (id: string) => {
    setBookmarks((prev) => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter((item) => item !== id) : [...prev, id];
      showToast(exists ? 'Removed from bookmarks' : 'Added to saved items');
      return next;
    });
  };

  const isBookmarked = (id: string) => bookmarks.includes(id);

  const enrollInCourse = (courseId: string) => {
    setEnrolledCourseIds((prev) => {
      if (prev.includes(courseId)) return prev;
      return [...prev, courseId];
    });
    showToast(lang === 'bn' ? 'সফলভাবে ব্যাচে ভর্তি সম্পন্ন হয়েছে!' : 'Successfully enrolled in course!');
  };

  const isEnrolled = (courseId: string) => enrolledCourseIds.includes(courseId);

  const markVideoWatched = (videoId: string) => {
    setWatchedVideoIds((prev) => {
      if (prev.includes(videoId)) return prev;
      return [...prev, videoId];
    });
    showToast(lang === 'bn' ? 'ক্লাসটি সম্পন্ন হিসেবে চিহ্নিত করা হলো।' : 'Lesson marked as completed!');
  };

  const saveTestScore = (testId: string, score: number, total: number) => {
    setTestScores((prev) => ({
      ...prev,
      [testId]: {
        score,
        total,
        date: new Date().toLocaleDateString()
      }
    }));
  };

  const openEnrollmentModal = (course: Course) => {
    setSelectedCourseForEnrollment(course);
  };

  const closeEnrollmentModal = () => {
    setSelectedCourseForEnrollment(null);
  };

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  }, []);

  return (
    <AppContext.Provider
      value={{
        lang,
        toggleLang,
        t,
        isAdminLoggedIn,
        adminCredentials,
        loginAdmin,
        logoutAdmin,
        updateAdminCredentials,
        schoolSettings,
        updateSchoolSettings,
        heroSlides,
        addHeroSlide,
        updateHeroSlide,
        deleteHeroSlide,
        courses,
        addCourse,
        updateCourse,
        deleteCourse,
        students,
        addStudent,
        updateStudent,
        deleteStudent,
        subjects,
        addSubject,
        deleteSubject,
        exams,
        addExam,
        deleteExam,
        results,
        addResult,
        deleteResult,
        teachers,
        addTeacher,
        updateTeacher,
        deleteTeacher,
        videoClasses,
        addVideoClass,
        updateVideoClass,
        deleteVideoClass,
        notes,
        addNote,
        updateNote,
        deleteNote,
        notices,
        addNotice,
        updateNotice,
        deleteNotice,
        routines,
        addRoutine,
        updateRoutine,
        deleteRoutine,
        chatbotTraining,
        addChatbotTraining,
        updateChatbotTraining,
        deleteChatbotTraining,
        modelTests,
        addModelTest,
        updateModelTest,
        deleteModelTest,
        googleCloudConfig,
        updateGoogleCloudConfig,
        isCloudSyncing,
        triggerCloudSync,
        bookmarks,
        toggleBookmark,
        isBookmarked,
        enrolledCourseIds,
        enrollInCourse,
        isEnrolled,
        watchedVideoIds,
        markVideoWatched,
        testScores,
        saveTestScore,
        selectedCourseForEnrollment,
        openEnrollmentModal,
        closeEnrollmentModal,
        searchQuery,
        setSearchQuery,
        toastMessage,
        showToast,
        isCalcOpen,
        setIsCalcOpen,
        isFloatingDictOpen,
        setIsFloatingDictOpen
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
