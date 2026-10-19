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
  GitHubConfig,
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
  DEFAULT_GITHUB_CONFIG,
  MODEL_TESTS as DEFAULT_TESTS
} from '../data/mockData';
import { notifyRealtimeUpdate, subscribeRealtimeUpdate, clearAllCachesAndBroadcast, safeStorage } from '../lib/storageService';
import { pushDataToGitHub, fetchDataFromGitHub } from '../services/githubSyncService';

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

  // GitHub REST API Integration & Cross-Browser Live Sync
  githubConfig: GitHubConfig;
  updateGitHubConfig: (config: GitHubConfig) => void;
  isGitHubSyncing: boolean;
  gitHubSyncStatus: {
    state: 'idle' | 'syncing' | 'synced' | 'error';
    message: string;
    lastSyncedAt?: string;
    lastCommitSha?: string;
  };
  pushToGitHub: (customCommitMessage?: string) => Promise<{ success: boolean; sha?: string; error?: string }>;
  pullFromGitHub: (force?: boolean) => Promise<{ success: boolean; data?: any; error?: string }>;

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
  isChatbotOpen: boolean;
  setIsChatbotOpen: (open: boolean) => void;
  clearCacheAndSyncRealtime: () => void;
  reloadAllFromStorage: () => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

const persistItem = (key: string, data: any) => {
  try {
    const val = typeof data === 'string' ? data : JSON.stringify(data);
    safeStorage.setItem(key, val);
  } catch (err) {
    console.warn(`[AppContext] Error persisting ${key}:`, err);
  }
};

const getPersistedItem = <T,>(key: string, fallback: T): T => {
  try {
    const raw = safeStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Safe storage initialization: clean legacy bloated data URLs that may choke browser quota
  useEffect(() => {
    try {
      const keysToAudit = ['ihas_hero_slides', 'ihas_teachers', 'ihas_courses', 'ihas_notices', 'ihas_routines', 'ihas_notes'];
      for (const k of keysToAudit) {
        const val = safeStorage.getItem(k);
        if (val && val.length > 250000) {
          try {
            const parsed = JSON.parse(val);
            if (Array.isArray(parsed)) {
              let modified = false;
              const sanitized = parsed.map((item: any) => {
                if (item && typeof item === 'object') {
                  const clone = { ...item };
                  ['imageUrl', 'photoUrl', 'bannerUrl', 'pdfUrl'].forEach((prop) => {
                    if (typeof clone[prop] === 'string' && clone[prop].startsWith('data:image') && clone[prop].length > 60000) {
                      clone[prop] = 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80';
                      modified = true;
                    }
                  });
                  return clone;
                }
                return item;
              });
              if (modified) {
                safeStorage.setItem(k, JSON.stringify(sanitized));
              }
            }
          } catch {
            // ignore
          }
        }
      }
    } catch (e) {
      console.warn('Initial storage cleanup error:', e);
    }
  }, []);

  // 1. Language: Default to 'bn', togglable to 'en'
  const [lang, setLang] = useState<Language>(() => {
    try {
      const saved = safeStorage.getItem('ihas_language');
      return (saved === 'en' || saved === 'bn') ? saved : 'bn';
    } catch {
      return 'bn';
    }
  });

  const toggleLang = () => {
    setLang((prev) => {
      const next = prev === 'bn' ? 'en' : 'bn';
      persistItem('ihas_language', next);
      return next;
    });
  };

  const t = (bn: string, en: string) => (lang === 'bn' ? bn : en);

  // 2. Admin Authentication & Default Credentials (tuhinsir@gmail.com / tuhinsir1234)
  const [adminCredentials, setAdminCredentials] = useState(() => {
    return getPersistedItem('ihas_admin_creds', { email: 'tuhinsir@gmail.com', password: 'tuhinsir1234' });
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    try {
      return safeStorage.getItem('ihas_admin_session') === 'true';
    } catch {
      return false;
    }
  });

  const loginAdmin = (email: string, pass: string): boolean => {
    if (email.toLowerCase() === adminCredentials.email.toLowerCase() && pass === adminCredentials.password) {
      setIsAdminLoggedIn(true);
      safeStorage.setItem('ihas_admin_session', 'true');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    safeStorage.removeItem('ihas_admin_session');
  };

  const updateAdminCredentials = (email: string, pass: string) => {
    const creds = { email, password: pass };
    setAdminCredentials(creds);
    persistItem('ihas_admin_creds', creds);
  };

  // 3. School Settings & Branding
  const [schoolSettings, setSchoolSettings] = useState<SchoolSettings>(() => {
    return getPersistedItem('ihas_school_settings', DEFAULT_SCHOOL_SETTINGS);
  });

  const updateSchoolSettings = (newSettings: SchoolSettings) => {
    setSchoolSettings(newSettings);
    persistItem('ihas_school_settings', newSettings);
    notifyRealtimeUpdate('schoolSettings', newSettings);
  };

  // 4. Hero Slides (Safe with Quota Protection)
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(() => {
    return getPersistedItem('ihas_hero_slides', INITIAL_HERO_SLIDES);
  });

  const addHeroSlide = (slide: HeroSlide) => {
    setHeroSlides((prev) => {
      const next = [slide, ...prev];
      persistItem('ihas_hero_slides', next);
      notifyRealtimeUpdate('heroSlides', next);
      return next;
    });
  };

  const updateHeroSlide = (slide: HeroSlide) => {
    setHeroSlides((prev) => {
      const next = prev.map((s) => (s.id === slide.id ? slide : s));
      persistItem('ihas_hero_slides', next);
      notifyRealtimeUpdate('heroSlides', next);
      return next;
    });
  };

  const deleteHeroSlide = (id: string) => {
    setHeroSlides((prev) => {
      const next = prev.filter((s) => s.id !== id);
      persistItem('ihas_hero_slides', next);
      notifyRealtimeUpdate('heroSlides', next);
      return next;
    });
  };

  // 5. Courses
  const [courses, setCourses] = useState<Course[]>(() => {
    return getPersistedItem('ihas_courses', DEFAULT_COURSES);
  });

  const addCourse = (course: Course) => {
    setCourses((prev) => {
      const next = [course, ...prev];
      persistItem('ihas_courses', next);
      notifyRealtimeUpdate('courses', next);
      return next;
    });
  };

  const updateCourse = (course: Course) => {
    setCourses((prev) => {
      const next = prev.map((c) => (c.id === course.id ? course : c));
      persistItem('ihas_courses', next);
      notifyRealtimeUpdate('courses', next);
      return next;
    });
  };

  const deleteCourse = (id: string) => {
    setCourses((prev) => {
      const next = prev.filter((c) => c.id !== id);
      persistItem('ihas_courses', next);
      notifyRealtimeUpdate('courses', next);
      return next;
    });
  };

  // 6. Students
  const [students, setStudents] = useState<Student[]>(() => {
    return getPersistedItem('ihas_students', INITIAL_STUDENTS);
  });

  const addStudent = (student: Student) => {
    setStudents((prev) => {
      const next = [student, ...prev];
      persistItem('ihas_students', next);
      notifyRealtimeUpdate('students', next);
      return next;
    });
  };

  const updateStudent = (student: Student) => {
    setStudents((prev) => {
      const next = prev.map((s) => (s.id === student.id ? student : s));
      persistItem('ihas_students', next);
      notifyRealtimeUpdate('students', next);
      return next;
    });
  };

  const deleteStudent = (id: string) => {
    setStudents((prev) => {
      const next = prev.filter((s) => s.id !== id);
      persistItem('ihas_students', next);
      notifyRealtimeUpdate('students', next);
      return next;
    });
  };

  // 7. Subjects & Exams
  const [subjects, setSubjects] = useState<CourseSubject[]>(() => {
    return getPersistedItem('ihas_subjects', INITIAL_SUBJECTS);
  });

  const addSubject = (sub: CourseSubject) => {
    setSubjects((prev) => {
      const next = [...prev, sub];
      persistItem('ihas_subjects', next);
      notifyRealtimeUpdate('subjects', next);
      return next;
    });
  };

  const deleteSubject = (id: string) => {
    setSubjects((prev) => {
      const next = prev.filter((s) => s.id !== id);
      persistItem('ihas_subjects', next);
      notifyRealtimeUpdate('subjects', next);
      return next;
    });
  };

  const [exams, setExams] = useState<CourseExam[]>(() => {
    return getPersistedItem('ihas_exams', INITIAL_EXAMS);
  });

  const addExam = (exam: CourseExam) => {
    setExams((prev) => {
      const next = [...prev, exam];
      persistItem('ihas_exams', next);
      notifyRealtimeUpdate('exams', next);
      return next;
    });
  };

  const deleteExam = (id: string) => {
    setExams((prev) => {
      const next = prev.filter((e) => e.id !== id);
      persistItem('ihas_exams', next);
      notifyRealtimeUpdate('exams', next);
      return next;
    });
  };

  // 8. Results
  const [results, setResults] = useState<StudentResult[]>(() => {
    return getPersistedItem('ihas_results', INITIAL_RESULTS);
  });

  const addResult = (res: StudentResult) => {
    setResults((prev) => {
      const filtered = prev.filter(
        (r) => !(r.studentRoll === res.studentRoll && r.academicYear === res.academicYear && r.courseId === res.courseId && r.examId === res.examId)
      );
      const next = [res, ...filtered];
      persistItem('ihas_results', next);
      notifyRealtimeUpdate('results', next);
      return next;
    });
  };

  const deleteResult = (id: string) => {
    setResults((prev) => {
      const next = prev.filter((r) => r.id !== id);
      persistItem('ihas_results', next);
      notifyRealtimeUpdate('results', next);
      return next;
    });
  };

  // 9. Teachers
  const [teachers, setTeachers] = useState<Teacher[]>(() => {
    return getPersistedItem('ihas_teachers', INITIAL_TEACHERS);
  });

  const addTeacher = (tch: Teacher) => {
    setTeachers((prev) => {
      const next = [...prev, tch];
      persistItem('ihas_teachers', next);
      notifyRealtimeUpdate('teachers', next);
      return next;
    });
  };

  const updateTeacher = (tch: Teacher) => {
    setTeachers((prev) => {
      const next = prev.map((t) => (t.id === tch.id ? tch : t));
      persistItem('ihas_teachers', next);
      notifyRealtimeUpdate('teachers', next);
      return next;
    });
  };

  const deleteTeacher = (id: string) => {
    setTeachers((prev) => {
      const next = prev.filter((t) => t.id !== id);
      persistItem('ihas_teachers', next);
      notifyRealtimeUpdate('teachers', next);
      return next;
    });
  };

  // 10. Videos, Notes, Notices
  const [videoClasses, setVideoClasses] = useState<VideoClass[]>(() => {
    return getPersistedItem('ihas_videos', getPersistedItem('ihas_video_classes', DEFAULT_VIDEOS));
  });

  const addVideoClass = (v: VideoClass) => {
    setVideoClasses((prev) => {
      const next = [v, ...prev];
      persistItem('ihas_videos', next);
      persistItem('ihas_video_classes', next);
      notifyRealtimeUpdate('videoClasses', next);
      return next;
    });
  };

  const updateVideoClass = (v: VideoClass) => {
    setVideoClasses((prev) => {
      const next = prev.map((vid) => (vid.id === v.id ? v : vid));
      persistItem('ihas_videos', next);
      persistItem('ihas_video_classes', next);
      notifyRealtimeUpdate('videoClasses', next);
      return next;
    });
  };

  const deleteVideoClass = (id: string) => {
    setVideoClasses((prev) => {
      const next = prev.filter((v) => v.id !== id);
      persistItem('ihas_videos', next);
      persistItem('ihas_video_classes', next);
      notifyRealtimeUpdate('videoClasses', next);
      return next;
    });
  };

  const [notes, setNotes] = useState<NoteResource[]>(() => {
    return getPersistedItem('ihas_notes', DEFAULT_NOTES);
  });

  const addNote = (n: NoteResource) => {
    setNotes((prev) => {
      const next = [n, ...prev];
      persistItem('ihas_notes', next);
      notifyRealtimeUpdate('notes', next);
      return next;
    });
  };

  const updateNote = (n: NoteResource) => {
    setNotes((prev) => {
      const next = prev.map((note) => (note.id === n.id ? n : note));
      persistItem('ihas_notes', next);
      notifyRealtimeUpdate('notes', next);
      return next;
    });
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => {
      const next = prev.filter((n) => n.id !== id);
      persistItem('ihas_notes', next);
      notifyRealtimeUpdate('notes', next);
      return next;
    });
  };

  const [notices, setNotices] = useState<Notice[]>(() => {
    return getPersistedItem('ihas_notices', DEFAULT_NOTICES);
  });

  const addNotice = (nt: Notice) => {
    setNotices((prev) => {
      const next = [nt, ...prev];
      persistItem('ihas_notices', next);
      notifyRealtimeUpdate('notices', next);
      return next;
    });
  };

  const updateNotice = (nt: Notice) => {
    setNotices((prev) => {
      const next = prev.map((n) => (n.id === nt.id ? nt : n));
      persistItem('ihas_notices', next);
      notifyRealtimeUpdate('notices', next);
      return next;
    });
  };

  const deleteNotice = (id: string) => {
    setNotices((prev) => {
      const next = prev.filter((nt) => nt.id !== id);
      persistItem('ihas_notices', next);
      notifyRealtimeUpdate('notices', next);
      return next;
    });
  };

  // 11. Routines
  const [routines, setRoutines] = useState<ClassRoutine[]>(() => {
    return getPersistedItem('ihas_routines', INITIAL_ROUTINES);
  });

  const addRoutine = (rtn: ClassRoutine) => {
    setRoutines((prev) => {
      const next = [rtn, ...prev];
      persistItem('ihas_routines', next);
      notifyRealtimeUpdate('routines', next);
      return next;
    });
  };

  const updateRoutine = (rtn: ClassRoutine) => {
    setRoutines((prev) => {
      const next = prev.map((r) => (r.id === rtn.id ? rtn : r));
      persistItem('ihas_routines', next);
      notifyRealtimeUpdate('routines', next);
      return next;
    });
  };

  const deleteRoutine = (id: string) => {
    setRoutines((prev) => {
      const next = prev.filter((r) => r.id !== id);
      persistItem('ihas_routines', next);
      notifyRealtimeUpdate('routines', next);
      return next;
    });
  };

  // 12. Chatbot Training Module (up to 1,000,000 words capacity)
  const [chatbotTraining, setChatbotTraining] = useState<ChatbotTrainingItem[]>(() => {
    return getPersistedItem('ihas_chatbot_training', INITIAL_CHATBOT_TRAINING);
  });

  const addChatbotTraining = (item: ChatbotTrainingItem) => {
    setChatbotTraining((prev) => {
      const next = [item, ...prev];
      persistItem('ihas_chatbot_training', next);
      notifyRealtimeUpdate('chatbotTraining', next);
      return next;
    });
  };

  const updateChatbotTraining = (item: ChatbotTrainingItem) => {
    setChatbotTraining((prev) => {
      const next = prev.map((t) => (t.id === item.id ? item : t));
      persistItem('ihas_chatbot_training', next);
      notifyRealtimeUpdate('chatbotTraining', next);
      return next;
    });
  };

  const deleteChatbotTraining = (id: string) => {
    setChatbotTraining((prev) => {
      const next = prev.filter((t) => t.id !== id);
      persistItem('ihas_chatbot_training', next);
      notifyRealtimeUpdate('chatbotTraining', next);
      return next;
    });
  };

  // 13. Quizzes / Model Tests (Quiz Management)
  const [modelTests, setModelTests] = useState<ModelTest[]>(() => {
    return getPersistedItem('ihas_quizzes', DEFAULT_TESTS);
  });

  const addModelTest = (test: ModelTest) => {
    setModelTests((prev) => {
      const next = [test, ...prev];
      persistItem('ihas_quizzes', next);
      notifyRealtimeUpdate('quizzes', next);
      return next;
    });
  };

  const updateModelTest = (test: ModelTest) => {
    setModelTests((prev) => {
      const next = prev.map((t) => (t.id === test.id ? test : t));
      persistItem('ihas_quizzes', next);
      notifyRealtimeUpdate('quizzes', next);
      return next;
    });
  };

  const deleteModelTest = (id: string) => {
    setModelTests((prev) => {
      const next = prev.filter((t) => t.id !== id);
      persistItem('ihas_quizzes', next);
      notifyRealtimeUpdate('quizzes', next);
      return next;
    });
  };

  // 14. Google Cloud Database & Storage Integration
  const [googleCloudConfig, setGoogleCloudConfig] = useState<GoogleCloudConfig>(() => {
    return getPersistedItem('ihas_google_cloud_config', DEFAULT_GOOGLE_CLOUD_CONFIG);
  });

  const [isCloudSyncing, setIsCloudSyncing] = useState(false);

  const updateGoogleCloudConfig = (config: GoogleCloudConfig) => {
    setGoogleCloudConfig(config);
    persistItem('ihas_google_cloud_config', config);
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
      persistItem('ihas_google_cloud_config', updatedConfig);
      notifyRealtimeUpdate('googleCloudSync', { status: 'synced', time: updatedConfig.lastSyncedAt });
    } finally {
      setIsCloudSyncing(false);
    }
  };

  // 15. GitHub REST API Database Sync & Cross-Browser Live Update
  const [githubConfig, setGithubConfig] = useState<GitHubConfig>(() => {
    try {
      const saved = localStorage.getItem('ihas_github_config');
      return saved ? JSON.parse(saved) : DEFAULT_GITHUB_CONFIG;
    } catch {
      return DEFAULT_GITHUB_CONFIG;
    }
  });

  const [isGitHubSyncing, setIsGitHubSyncing] = useState(false);
  const [gitHubSyncStatus, setGitHubSyncStatus] = useState<{
    state: 'idle' | 'syncing' | 'synced' | 'error';
    message: string;
    lastSyncedAt?: string;
    lastCommitSha?: string;
  }>({
    state: 'idle',
    message: 'প্রস্তুত',
    lastSyncedAt: githubConfig.lastSyncedAt,
    lastCommitSha: githubConfig.lastCommitSha
  });

  const updateGitHubConfig = (cfg: GitHubConfig) => {
    setGithubConfig(cfg);
    persistItem('ihas_github_config', cfg);
    notifyRealtimeUpdate('githubConfig', cfg);
  };

  const applyDatabaseSnapshot = useCallback((data: any) => {
    if (!data || typeof data !== 'object') return;
    try {
      if (data.schoolSettings) {
        setSchoolSettings(data.schoolSettings);
        persistItem('ihas_school_settings', data.schoolSettings);
      }
      if (Array.isArray(data.heroSlides)) {
        setHeroSlides(data.heroSlides);
        persistItem('ihas_hero_slides', data.heroSlides);
      }
      if (Array.isArray(data.courses)) {
        setCourses(data.courses);
        persistItem('ihas_courses', data.courses);
      }
      if (Array.isArray(data.students)) {
        setStudents(data.students);
        persistItem('ihas_students', data.students);
      }
      if (Array.isArray(data.subjects)) {
        setSubjects(data.subjects);
        persistItem('ihas_subjects', data.subjects);
      }
      if (Array.isArray(data.exams)) {
        setExams(data.exams);
        persistItem('ihas_exams', data.exams);
      }
      if (Array.isArray(data.results)) {
        setResults(data.results);
        persistItem('ihas_results', data.results);
      }
      if (Array.isArray(data.teachers)) {
        setTeachers(data.teachers);
        persistItem('ihas_teachers', data.teachers);
      }
      if (Array.isArray(data.videoClasses)) {
        setVideoClasses(data.videoClasses);
        persistItem('ihas_videos', data.videoClasses);
        persistItem('ihas_video_classes', data.videoClasses);
      }
      if (Array.isArray(data.notes)) {
        setNotes(data.notes);
        persistItem('ihas_notes', data.notes);
      }
      if (Array.isArray(data.notices)) {
        setNotices(data.notices);
        persistItem('ihas_notices', data.notices);
      }
      if (Array.isArray(data.routines)) {
        setRoutines(data.routines);
        persistItem('ihas_routines', data.routines);
      }
      if (Array.isArray(data.chatbotTraining)) {
        setChatbotTraining(data.chatbotTraining);
        persistItem('ihas_chatbot_training', data.chatbotTraining);
      }
      if (Array.isArray(data.modelTests)) {
        setModelTests(data.modelTests);
        persistItem('ihas_quizzes', data.modelTests);
      }
      if (data.adminCredentials?.email && data.adminCredentials?.password) {
        setAdminCredentials(data.adminCredentials);
        persistItem('ihas_admin_creds', data.adminCredentials);
      }
    } catch (e) {
      console.warn('Error applying database snapshot:', e);
    }
  }, []);

  const pushToGitHub = async (
    customCommitMessage?: string
  ): Promise<{ success: boolean; sha?: string; error?: string }> => {
    setIsGitHubSyncing(true);
    setGitHubSyncStatus((prev) => ({
      ...prev,
      state: 'syncing',
      message: 'গিটহাবে রিয়েল-টাইম ডেটাবেজ পুশ করা হচ্ছে...'
    }));

    try {
      const snapshot = {
        schoolSettings,
        heroSlides,
        courses,
        students,
        subjects,
        exams,
        results,
        teachers,
        videoClasses,
        notes,
        notices,
        routines,
        chatbotTraining,
        modelTests,
        adminCredentials
      };

      const result = await pushDataToGitHub(githubConfig, snapshot, customCommitMessage);

      if (result.success) {
        const now = new Date().toISOString();
        const updatedConfig: GitHubConfig = {
          ...githubConfig,
          lastSyncedAt: now,
          lastCommitSha: result.sha || result.commitSha || '',
          lastCommitMessage: customCommitMessage || 'Live update from Admin Panel'
        };
        setGithubConfig(updatedConfig);
        persistItem('ihas_github_config', updatedConfig);
        setGitHubSyncStatus({
          state: 'synced',
          message: 'সফলভাবে পুশ ও লাইভ সিঙ্ক সম্পন্ন হয়েছে',
          lastSyncedAt: now,
          lastCommitSha: updatedConfig.lastCommitSha
        });
        notifyRealtimeUpdate('github_sync', { snapshot, config: updatedConfig });
        return { success: true, sha: updatedConfig.lastCommitSha };
      } else {
        setGitHubSyncStatus({
          state: 'error',
          message: result.message || 'পুশ ব্যর্থ হয়েছে',
          lastSyncedAt: githubConfig.lastSyncedAt,
          lastCommitSha: githubConfig.lastCommitSha
        });
        return { success: false, error: result.message };
      }
    } catch (err: any) {
      const errMsg = err.message || 'অজানা ত্রুটি';
      setGitHubSyncStatus({
        state: 'error',
        message: errMsg,
        lastSyncedAt: githubConfig.lastSyncedAt,
        lastCommitSha: githubConfig.lastCommitSha
      });
      return { success: false, error: errMsg };
    } finally {
      setIsGitHubSyncing(false);
    }
  };

  const pullFromGitHub = async (
    force: boolean = false
  ): Promise<{ success: boolean; data?: any; error?: string }> => {
    if (!githubConfig.owner || !githubConfig.repo) {
      return { success: false, error: 'GitHub owner and repo not configured' };
    }
    setIsGitHubSyncing(true);
    setGitHubSyncStatus((prev) => ({
      ...prev,
      state: 'syncing',
      message: 'গিটহাব থেকে লাইভ ডেটা যাচাই ও লোড হচ্ছে...'
    }));

    try {
      const res = await fetchDataFromGitHub(githubConfig);
      if (res.success && res.data) {
        const remoteTime = res.lastUpdated ? new Date(res.lastUpdated).getTime() : 0;
        const localTime = githubConfig.lastSyncedAt ? new Date(githubConfig.lastSyncedAt).getTime() : 0;

        if (force || remoteTime > localTime || !localTime) {
          applyDatabaseSnapshot(res.data);
          const now = new Date().toISOString();
          const updatedConfig: GitHubConfig = {
            ...githubConfig,
            lastSyncedAt: res.lastUpdated || now,
            lastCommitSha: res.sha || githubConfig.lastCommitSha
          };
          setGithubConfig(updatedConfig);
          persistItem('ihas_github_config', updatedConfig);
          setGitHubSyncStatus({
            state: 'synced',
            message: 'গিটহাব থেকে লাইভ ডেটা সকল ব্রাউজারে সফলভাবে সিঙ্ক হয়েছে',
            lastSyncedAt: updatedConfig.lastSyncedAt,
            lastCommitSha: updatedConfig.lastCommitSha
          });
          notifyRealtimeUpdate('github_sync', { snapshot: res.data, config: updatedConfig });
        } else {
          setGitHubSyncStatus({
            state: 'synced',
            message: 'ওয়েবসাইট ডেটা সর্বশেষ গিটহাব সংস্করণের সাথে আপডেট আছে',
            lastSyncedAt: githubConfig.lastSyncedAt,
            lastCommitSha: githubConfig.lastCommitSha
          });
        }
        return { success: true, data: res.data };
      } else {
        setGitHubSyncStatus((prev) => ({
          ...prev,
          state: 'idle',
          message: res.message || 'গিটহাবে কোনো নতুন পরিবর্তন পাওয়া যায়নি'
        }));
        return { success: false, error: res.message };
      }
    } catch (err: any) {
      return { success: false, error: err.message };
    } finally {
      setIsGitHubSyncing(false);
    }
  };

  // Periodic background check against GitHub for live updates across all visitor browsers
  useEffect(() => {
    if (!githubConfig.enabled || !githubConfig.owner || !githubConfig.repo) return;

    // Run initial pull check on mount
    const initialTimer = setTimeout(() => {
      pullFromGitHub(false).catch(() => {});
    }, 0);

    // Polling interval for all visitor browsers
    const intervalSec = Math.max(10, githubConfig.autoPollIntervalSec || 30);
    const timer = setInterval(() => {
      if (document.visibilityState === 'visible') {
        pullFromGitHub(false).catch(() => {});
      }
    }, intervalSec * 1000);

    // Also pull whenever browser window regains focus or reconnects to internet
    const handleFocus = () => {
      pullFromGitHub(false).catch(() => {});
    };
    window.addEventListener('focus', handleFocus);
    window.addEventListener('online', handleFocus);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(timer);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('online', handleFocus);
    };
  }, [
    githubConfig.enabled,
    githubConfig.owner,
    githubConfig.repo,
    githubConfig.branch,
    githubConfig.filePath,
    githubConfig.autoPollIntervalSec
  ]);

  // Comprehensive state reload from storage to clear stale cache and synchronize in-memory state
  const reloadAllFromStorage = useCallback(() => {
    try {
      const rawSettings = localStorage.getItem('ihas_school_settings');
      if (rawSettings) setSchoolSettings(JSON.parse(rawSettings));

      const rawSlides = localStorage.getItem('ihas_hero_slides');
      if (rawSlides) setHeroSlides(JSON.parse(rawSlides));

      const rawCourses = localStorage.getItem('ihas_courses');
      if (rawCourses) setCourses(JSON.parse(rawCourses));

      const rawStudents = localStorage.getItem('ihas_students');
      if (rawStudents) setStudents(JSON.parse(rawStudents));

      const rawSubjects = localStorage.getItem('ihas_subjects');
      if (rawSubjects) setSubjects(JSON.parse(rawSubjects));

      const rawExams = localStorage.getItem('ihas_exams');
      if (rawExams) setExams(JSON.parse(rawExams));

      const rawResults = localStorage.getItem('ihas_results');
      if (rawResults) setResults(JSON.parse(rawResults));

      const rawTeachers = localStorage.getItem('ihas_teachers');
      if (rawTeachers) setTeachers(JSON.parse(rawTeachers));

      const rawVideos = localStorage.getItem('ihas_videos') || localStorage.getItem('ihas_video_classes');
      if (rawVideos) setVideoClasses(JSON.parse(rawVideos));

      const rawNotes = localStorage.getItem('ihas_notes');
      if (rawNotes) setNotes(JSON.parse(rawNotes));

      const rawNotices = localStorage.getItem('ihas_notices');
      if (rawNotices) setNotices(JSON.parse(rawNotices));

      const rawRoutines = localStorage.getItem('ihas_routines');
      if (rawRoutines) setRoutines(JSON.parse(rawRoutines));

      const rawChatbot = localStorage.getItem('ihas_chatbot_training');
      if (rawChatbot) setChatbotTraining(JSON.parse(rawChatbot));

      const rawQuizzes = localStorage.getItem('ihas_quizzes');
      if (rawQuizzes) setModelTests(JSON.parse(rawQuizzes));

      const rawGoogle = localStorage.getItem('ihas_google_cloud_config');
      if (rawGoogle) setGoogleCloudConfig(JSON.parse(rawGoogle));

      const rawGithub = localStorage.getItem('ihas_github_config');
      if (rawGithub) setGithubConfig(JSON.parse(rawGithub));

      const rawCreds = localStorage.getItem('ihas_admin_creds');
      if (rawCreds) setAdminCredentials(JSON.parse(rawCreds));
    } catch (e) {
      console.warn('Error reloading all data from storage:', e);
    }
  }, []);

  // Listen to cross-tab / cross-window real-time synchronization updates
  useEffect(() => {
    const unsubscribe = subscribeRealtimeUpdate((topic, data) => {
      try {
        switch (topic) {
          case 'all':
          case 'cache_clear':
          case 'force_reload': {
            reloadAllFromStorage();
            break;
          }
          case 'schoolSettings':
          case 'settings':
          case 'school_settings': {
            if (data) setSchoolSettings(data);
            else {
              const raw = localStorage.getItem('ihas_school_settings');
              if (raw) setSchoolSettings(JSON.parse(raw));
            }
            break;
          }
          case 'heroSlides':
          case 'slides':
          case 'hero_slides': {
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
          case 'videos':
          case 'video_classes': {
            if (data) setVideoClasses(data);
            else {
              const raw = localStorage.getItem('ihas_videos') || localStorage.getItem('ihas_video_classes');
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
          case 'quizzes':
          case 'modelTests':
          case 'model_tests': {
            if (data) setModelTests(data);
            else {
              const raw = localStorage.getItem('ihas_quizzes');
              if (raw) setModelTests(JSON.parse(raw));
            }
            break;
          }
          case 'googleCloudConfig':
          case 'google_cloud':
          case 'google_cloud_config': {
            if (data) setGoogleCloudConfig(data);
            else {
              const raw = localStorage.getItem('ihas_google_cloud_config');
              if (raw) setGoogleCloudConfig(JSON.parse(raw));
            }
            break;
          }
          case 'admin_creds':
          case 'adminCredentials': {
            if (data) setAdminCredentials(data);
            else {
              const raw = localStorage.getItem('ihas_admin_creds');
              if (raw) setAdminCredentials(JSON.parse(raw));
            }
            break;
          }
          case 'github_sync': {
            if (data?.snapshot) {
              applyDatabaseSnapshot(data.snapshot);
            }
            if (data?.config) {
              setGithubConfig(data.config);
            }
            break;
          }
          case 'githubConfig':
          case 'github_config': {
            if (data) setGithubConfig(data);
            else {
              const raw = localStorage.getItem('ihas_github_config');
              if (raw) setGithubConfig(JSON.parse(raw));
            }
            break;
          }
          default: {
            // For any other entity ping, reload from storage
            reloadAllFromStorage();
          }
        }
      } catch (err) {
        console.warn('Realtime update processing error:', err);
      }
    });

    return () => unsubscribe();
  }, [reloadAllFromStorage, applyDatabaseSnapshot]);

  // Active Cache-Busting Heartbeat: Polls every 1s to auto-detect any admin edits across windows or iframes without requiring manual page refresh
  useEffect(() => {
    let lastKnownVersion = typeof window !== 'undefined' ? localStorage.getItem('ihas_cache_version') || '0' : '0';

    const checkHeartbeat = () => {
      try {
        const currentVersion = localStorage.getItem('ihas_cache_version') || '0';
        if (currentVersion !== lastKnownVersion) {
          lastKnownVersion = currentVersion;
          reloadAllFromStorage();
        }
      } catch {
        // ignore storage errors
      }
    };

    const interval = setInterval(checkHeartbeat, 1000);
    return () => clearInterval(interval);
  }, [reloadAllFromStorage]);

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
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  useEffect(() => {
    persistItem('ihas_bookmarks', bookmarks);
  }, [bookmarks]);

  useEffect(() => {
    persistItem('ihas_enrolled_courses', enrolledCourseIds);
  }, [enrolledCourseIds]);

  useEffect(() => {
    persistItem('ihas_watched_videos', watchedVideoIds);
  }, [watchedVideoIds]);

  useEffect(() => {
    persistItem('ihas_test_scores', testScores);
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

  const clearCacheAndSyncRealtime = useCallback(() => {
    clearAllCachesAndBroadcast();
    reloadAllFromStorage();
    showToast(lang === 'bn' ? 'সকল ক্যাশ সফলভাবে ক্লিয়ার হয়েছে এবং সকল উইন্ডোতে রিয়েল-টাইমে আপডেট পাঠানো হয়েছে!' : 'All caches cleared & synced across all windows in real-time!');
  }, [lang, reloadAllFromStorage, showToast]);

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
        githubConfig,
        updateGitHubConfig,
        isGitHubSyncing,
        gitHubSyncStatus,
        pushToGitHub,
        pullFromGitHub,
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
        setIsFloatingDictOpen,
        isChatbotOpen,
        setIsChatbotOpen,
        clearCacheAndSyncRealtime,
        reloadAllFromStorage
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
