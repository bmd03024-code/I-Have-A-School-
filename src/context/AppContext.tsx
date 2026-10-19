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
  isInitialLoading: boolean;
  clearCacheAndSyncRealtime: () => void;
  reloadAllFromStorage: () => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

const syncToCodebase = (key: string, data: any) => {
  try {
    if (typeof window !== 'undefined' && typeof fetch === 'function') {
      fetch('/api/sync-to-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, data, updatedAt: new Date().toISOString() })
      }).catch(() => {});
    }
  } catch {
    // ignore
  }
};

const persistItem = (key: string, data: any) => {
  try {
    const val = typeof data === 'string' ? data : JSON.stringify(data);
    safeStorage.setItem(key, val);
    syncToCodebase(key, data);
  } catch (err) {
    console.warn(`[AppContext] Error persisting ${key}:`, err);
  }
};

const getPersistedItem = <T,>(key: string, fallback: T): T => {
  try {
    const raw = safeStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    if (Array.isArray(fallback) && !Array.isArray(parsed)) {
      return fallback;
    }
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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

  // Helper for deep equality checking before state sets to avoid unnecessary re-renders
  const isEqual = useCallback((a: any, b: any): boolean => {
    if (a === b) return true;
    if (!a || !b) return false;
    try {
      return JSON.stringify(a) === JSON.stringify(b);
    } catch {
      return false;
    }
  }, []);

  // Safe setter that only triggers React render if data is genuinely different
  const safeSetIfChanged = useCallback(<T,>(setter: React.Dispatch<React.SetStateAction<T>>, nextVal: T) => {
    setter((prev) => {
      if (isEqual(prev, nextVal)) return prev;
      return nextVal;
    });
  }, [isEqual]);

  // Post changes asynchronously after render, NEVER inside setState updater function
  const commitEntityChange = useCallback((key: string, topic: string, data: any) => {
    queueMicrotask(() => {
      persistItem(key, data);
      notifyRealtimeUpdate(topic, data);
    });
  }, []);

  // 3. School Settings & Branding
  const [schoolSettings, setSchoolSettings] = useState<SchoolSettings>(() => {
    return getPersistedItem('ihas_school_settings', DEFAULT_SCHOOL_SETTINGS);
  });

  const updateSchoolSettings = useCallback((newSettings: SchoolSettings) => {
    setSchoolSettings((prev) => {
      if (isEqual(prev, newSettings)) return prev;
      commitEntityChange('ihas_school_settings', 'schoolSettings', newSettings);
      return newSettings;
    });
  }, [commitEntityChange, isEqual]);

  // 4. Hero Slides (Safe with Quota Protection)
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(() => {
    return getPersistedItem('ihas_hero_slides', INITIAL_HERO_SLIDES);
  });

  const addHeroSlide = useCallback((slide: HeroSlide) => {
    setHeroSlides((prev) => {
      const next = [slide, ...prev];
      commitEntityChange('ihas_hero_slides', 'heroSlides', next);
      return next;
    });
  }, [commitEntityChange]);

  const updateHeroSlide = useCallback((slide: HeroSlide) => {
    setHeroSlides((prev) => {
      const next = prev.map((s) => (s.id === slide.id ? slide : s));
      commitEntityChange('ihas_hero_slides', 'heroSlides', next);
      return next;
    });
  }, [commitEntityChange]);

  const deleteHeroSlide = useCallback((id: string) => {
    setHeroSlides((prev) => {
      const next = prev.filter((s) => s.id !== id);
      commitEntityChange('ihas_hero_slides', 'heroSlides', next);
      return next;
    });
  }, [commitEntityChange]);

  // 5. Courses
  const [courses, setCourses] = useState<Course[]>(() => {
    return getPersistedItem('ihas_courses', DEFAULT_COURSES);
  });

  const addCourse = useCallback((course: Course) => {
    setCourses((prev) => {
      const next = [course, ...prev];
      commitEntityChange('ihas_courses', 'courses', next);
      return next;
    });
  }, [commitEntityChange]);

  const updateCourse = useCallback((course: Course) => {
    setCourses((prev) => {
      const next = prev.map((c) => (c.id === course.id ? course : c));
      commitEntityChange('ihas_courses', 'courses', next);
      return next;
    });
  }, [commitEntityChange]);

  const deleteCourse = useCallback((id: string) => {
    setCourses((prev) => {
      const next = prev.filter((c) => c.id !== id);
      commitEntityChange('ihas_courses', 'courses', next);
      return next;
    });
  }, [commitEntityChange]);

  // 6. Students
  const [students, setStudents] = useState<Student[]>(() => {
    return getPersistedItem('ihas_students', INITIAL_STUDENTS);
  });

  const addStudent = useCallback((student: Student) => {
    setStudents((prev) => {
      const next = [student, ...prev];
      commitEntityChange('ihas_students', 'students', next);
      return next;
    });
  }, [commitEntityChange]);

  const updateStudent = useCallback((student: Student) => {
    setStudents((prev) => {
      const next = prev.map((s) => (s.id === student.id ? student : s));
      commitEntityChange('ihas_students', 'students', next);
      return next;
    });
  }, [commitEntityChange]);

  const deleteStudent = useCallback((id: string) => {
    setStudents((prev) => {
      const next = prev.filter((s) => s.id !== id);
      commitEntityChange('ihas_students', 'students', next);
      return next;
    });
  }, [commitEntityChange]);

  // 7. Subjects & Exams
  const [subjects, setSubjects] = useState<CourseSubject[]>(() => {
    return getPersistedItem('ihas_subjects', INITIAL_SUBJECTS);
  });

  const addSubject = useCallback((sub: CourseSubject) => {
    setSubjects((prev) => {
      const next = [...prev, sub];
      commitEntityChange('ihas_subjects', 'subjects', next);
      return next;
    });
  }, [commitEntityChange]);

  const deleteSubject = useCallback((id: string) => {
    setSubjects((prev) => {
      const next = prev.filter((s) => s.id !== id);
      commitEntityChange('ihas_subjects', 'subjects', next);
      return next;
    });
  }, [commitEntityChange]);

  const [exams, setExams] = useState<CourseExam[]>(() => {
    return getPersistedItem('ihas_exams', INITIAL_EXAMS);
  });

  const addExam = useCallback((exam: CourseExam) => {
    setExams((prev) => {
      const next = [...prev, exam];
      commitEntityChange('ihas_exams', 'exams', next);
      return next;
    });
  }, [commitEntityChange]);

  const deleteExam = useCallback((id: string) => {
    setExams((prev) => {
      const next = prev.filter((e) => e.id !== id);
      commitEntityChange('ihas_exams', 'exams', next);
      return next;
    });
  }, [commitEntityChange]);

  // 8. Results
  const [results, setResults] = useState<StudentResult[]>(() => {
    return getPersistedItem('ihas_results', INITIAL_RESULTS);
  });

  const addResult = useCallback((res: StudentResult) => {
    setResults((prev) => {
      const filtered = prev.filter(
        (r) => !(r.studentRoll === res.studentRoll && r.academicYear === res.academicYear && r.courseId === res.courseId && r.examId === res.examId)
      );
      const next = [res, ...filtered];
      commitEntityChange('ihas_results', 'results', next);
      return next;
    });
  }, [commitEntityChange]);

  const deleteResult = useCallback((id: string) => {
    setResults((prev) => {
      const next = prev.filter((r) => r.id !== id);
      commitEntityChange('ihas_results', 'results', next);
      return next;
    });
  }, [commitEntityChange]);

  // 9. Teachers
  const [teachers, setTeachers] = useState<Teacher[]>(() => {
    return getPersistedItem('ihas_teachers', INITIAL_TEACHERS);
  });

  const addTeacher = useCallback((tch: Teacher) => {
    setTeachers((prev) => {
      const next = [...prev, tch];
      commitEntityChange('ihas_teachers', 'teachers', next);
      return next;
    });
  }, [commitEntityChange]);

  const updateTeacher = useCallback((tch: Teacher) => {
    setTeachers((prev) => {
      const next = prev.map((t) => (t.id === tch.id ? tch : t));
      commitEntityChange('ihas_teachers', 'teachers', next);
      return next;
    });
  }, [commitEntityChange]);

  const deleteTeacher = useCallback((id: string) => {
    setTeachers((prev) => {
      const next = prev.filter((t) => t.id !== id);
      commitEntityChange('ihas_teachers', 'teachers', next);
      return next;
    });
  }, [commitEntityChange]);

  // 10. Videos, Notes, Notices
  const [videoClasses, setVideoClasses] = useState<VideoClass[]>(() => {
    return getPersistedItem('ihas_videos', getPersistedItem('ihas_video_classes', DEFAULT_VIDEOS));
  });

  const addVideoClass = useCallback((v: VideoClass) => {
    setVideoClasses((prev) => {
      const next = [v, ...prev];
      commitEntityChange('ihas_video_classes', 'videoClasses', next);
      return next;
    });
  }, [commitEntityChange]);

  const updateVideoClass = useCallback((v: VideoClass) => {
    setVideoClasses((prev) => {
      const next = prev.map((vid) => (vid.id === v.id ? v : vid));
      commitEntityChange('ihas_video_classes', 'videoClasses', next);
      return next;
    });
  }, [commitEntityChange]);

  const deleteVideoClass = useCallback((id: string) => {
    setVideoClasses((prev) => {
      const next = prev.filter((v) => v.id !== id);
      commitEntityChange('ihas_video_classes', 'videoClasses', next);
      return next;
    });
  }, [commitEntityChange]);

  const [notes, setNotes] = useState<NoteResource[]>(() => {
    return getPersistedItem('ihas_notes', DEFAULT_NOTES);
  });

  const addNote = useCallback((n: NoteResource) => {
    setNotes((prev) => {
      const next = [n, ...prev];
      commitEntityChange('ihas_notes', 'notes', next);
      return next;
    });
  }, [commitEntityChange]);

  const updateNote = useCallback((n: NoteResource) => {
    setNotes((prev) => {
      const next = prev.map((note) => (note.id === n.id ? n : note));
      commitEntityChange('ihas_notes', 'notes', next);
      return next;
    });
  }, [commitEntityChange]);

  const deleteNote = useCallback((id: string) => {
    setNotes((prev) => {
      const next = prev.filter((n) => n.id !== id);
      commitEntityChange('ihas_notes', 'notes', next);
      return next;
    });
  }, [commitEntityChange]);

  const [notices, setNotices] = useState<Notice[]>(() => {
    return getPersistedItem('ihas_notices', DEFAULT_NOTICES);
  });

  const addNotice = useCallback((nt: Notice) => {
    setNotices((prev) => {
      const next = [nt, ...prev];
      commitEntityChange('ihas_notices', 'notices', next);
      return next;
    });
  }, [commitEntityChange]);

  const updateNotice = useCallback((nt: Notice) => {
    setNotices((prev) => {
      const next = prev.map((n) => (n.id === nt.id ? nt : n));
      commitEntityChange('ihas_notices', 'notices', next);
      return next;
    });
  }, [commitEntityChange]);

  const deleteNotice = useCallback((id: string) => {
    setNotices((prev) => {
      const next = prev.filter((nt) => nt.id !== id);
      commitEntityChange('ihas_notices', 'notices', next);
      return next;
    });
  }, [commitEntityChange]);

  // 11. Routines
  const [routines, setRoutines] = useState<ClassRoutine[]>(() => {
    return getPersistedItem('ihas_routines', INITIAL_ROUTINES);
  });

  const addRoutine = useCallback((rtn: ClassRoutine) => {
    setRoutines((prev) => {
      const next = [rtn, ...prev];
      commitEntityChange('ihas_routines', 'routines', next);
      return next;
    });
  }, [commitEntityChange]);

  const updateRoutine = useCallback((rtn: ClassRoutine) => {
    setRoutines((prev) => {
      const next = prev.map((r) => (r.id === rtn.id ? rtn : r));
      commitEntityChange('ihas_routines', 'routines', next);
      return next;
    });
  }, [commitEntityChange]);

  const deleteRoutine = useCallback((id: string) => {
    setRoutines((prev) => {
      const next = prev.filter((r) => r.id !== id);
      commitEntityChange('ihas_routines', 'routines', next);
      return next;
    });
  }, [commitEntityChange]);

  // 12. Chatbot Training Module (up to 1,000,000 words capacity)
  const [chatbotTraining, setChatbotTraining] = useState<ChatbotTrainingItem[]>(() => {
    return getPersistedItem('ihas_chatbot_training', INITIAL_CHATBOT_TRAINING);
  });

  const addChatbotTraining = useCallback((item: ChatbotTrainingItem) => {
    setChatbotTraining((prev) => {
      const next = [item, ...prev];
      commitEntityChange('ihas_chatbot_training', 'chatbotTraining', next);
      return next;
    });
  }, [commitEntityChange]);

  const updateChatbotTraining = useCallback((item: ChatbotTrainingItem) => {
    setChatbotTraining((prev) => {
      const next = prev.map((t) => (t.id === item.id ? item : t));
      commitEntityChange('ihas_chatbot_training', 'chatbotTraining', next);
      return next;
    });
  }, [commitEntityChange]);

  const deleteChatbotTraining = useCallback((id: string) => {
    setChatbotTraining((prev) => {
      const next = prev.filter((t) => t.id !== id);
      commitEntityChange('ihas_chatbot_training', 'chatbotTraining', next);
      return next;
    });
  }, [commitEntityChange]);

  // 13. Quizzes / Model Tests (Quiz Management)
  const [modelTests, setModelTests] = useState<ModelTest[]>(() => {
    return getPersistedItem('ihas_quizzes', DEFAULT_TESTS);
  });

  const addModelTest = useCallback((test: ModelTest) => {
    setModelTests((prev) => {
      const next = [test, ...prev];
      commitEntityChange('ihas_quizzes', 'quizzes', next);
      return next;
    });
  }, [commitEntityChange]);

  const updateModelTest = useCallback((test: ModelTest) => {
    setModelTests((prev) => {
      const next = prev.map((t) => (t.id === test.id ? test : t));
      commitEntityChange('ihas_quizzes', 'quizzes', next);
      return next;
    });
  }, [commitEntityChange]);

  const deleteModelTest = useCallback((id: string) => {
    setModelTests((prev) => {
      const next = prev.filter((t) => t.id !== id);
      commitEntityChange('ihas_quizzes', 'quizzes', next);
      return next;
    });
  }, [commitEntityChange]);

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
        safeSetIfChanged(setHeroSlides, data.heroSlides);
        persistItem('ihas_hero_slides', data.heroSlides);
      }
      if (Array.isArray(data.courses)) {
        safeSetIfChanged(setCourses, data.courses);
        persistItem('ihas_courses', data.courses);
      }
      if (Array.isArray(data.students)) {
        safeSetIfChanged(setStudents, data.students);
        persistItem('ihas_students', data.students);
      }
      if (Array.isArray(data.subjects)) {
        safeSetIfChanged(setSubjects, data.subjects);
        persistItem('ihas_subjects', data.subjects);
      }
      if (Array.isArray(data.exams)) {
        safeSetIfChanged(setExams, data.exams);
        persistItem('ihas_exams', data.exams);
      }
      if (Array.isArray(data.results)) {
        safeSetIfChanged(setResults, data.results);
        persistItem('ihas_results', data.results);
      }
      if (Array.isArray(data.teachers)) {
        safeSetIfChanged(setTeachers, data.teachers);
        persistItem('ihas_teachers', data.teachers);
      }
      if (Array.isArray(data.videoClasses)) {
        safeSetIfChanged(setVideoClasses, data.videoClasses);
        persistItem('ihas_videos', data.videoClasses);
        persistItem('ihas_video_classes', data.videoClasses);
      }
      if (Array.isArray(data.notes)) {
        safeSetIfChanged(setNotes, data.notes);
        persistItem('ihas_notes', data.notes);
      }
      if (Array.isArray(data.notices)) {
        safeSetIfChanged(setNotices, data.notices);
        persistItem('ihas_notices', data.notices);
      }
      if (Array.isArray(data.routines)) {
        safeSetIfChanged(setRoutines, data.routines);
        persistItem('ihas_routines', data.routines);
      }
      if (Array.isArray(data.chatbotTraining)) {
        safeSetIfChanged(setChatbotTraining, data.chatbotTraining);
        persistItem('ihas_chatbot_training', data.chatbotTraining);
      }
      if (Array.isArray(data.modelTests)) {
        safeSetIfChanged(setModelTests, data.modelTests);
        persistItem('ihas_quizzes', data.modelTests);
      }
      if (data.adminCredentials?.email && data.adminCredentials?.password) {
        safeSetIfChanged(setAdminCredentials, data.adminCredentials);
        persistItem('ihas_admin_creds', data.adminCredentials);
      }
    } catch (e) {
      console.warn('Error applying database snapshot:', e);
    }
  }, [safeSetIfChanged]);

  // Keep a fresh reference to state snapshot without triggering useCallback invalidation
  const latestEntitiesRef = React.useRef({
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
  });

  useEffect(() => {
    latestEntitiesRef.current = {
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
  }, [
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
  ]);

  const pushToGitHub = useCallback(async (
    customCommitMessage?: string
  ): Promise<{ success: boolean; sha?: string; error?: string }> => {
    setIsGitHubSyncing(true);
    setGitHubSyncStatus((prev) => ({
      ...prev,
      state: 'syncing',
      message: 'গিটহাবে রিয়েল-টাইম ডেটাবেজ পুশ করা হচ্ছে...'
    }));

    try {
      const snapshot = latestEntitiesRef.current;
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
  }, [githubConfig]);

  const pullFromGitHub = useCallback(async (
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
  }, [githubConfig, applyDatabaseSnapshot]);

  // Periodic background check against GitHub for live updates across all visitor browsers
  useEffect(() => {
    if (!githubConfig.enabled || !githubConfig.owner || !githubConfig.repo) return;

    // Run initial pull check on mount
    const initialTimer = setTimeout(() => {
      pullFromGitHub(false).catch(() => {});
    }, 1200);

    // Polling interval for all visitor browsers (min 30s)
    const intervalSec = Math.max(30, githubConfig.autoPollIntervalSec || 60);
    const timer = setInterval(() => {
      if (document.visibilityState === 'visible') {
        pullFromGitHub(false).catch(() => {});
      }
    }, intervalSec * 1000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(timer);
    };
  }, [
    githubConfig.enabled,
    githubConfig.owner,
    githubConfig.repo,
    githubConfig.autoPollIntervalSec,
    pullFromGitHub
  ]);

  // Comprehensive state reload from storage to synchronize in-memory state WITHOUT unnecessary re-renders
  const reloadAllFromStorage = useCallback(() => {
    const safeParse = <T,>(key: string): T | null => {
      try {
        const raw = safeStorage.getItem(key);
        if (!raw) return null;
        return JSON.parse(raw);
      } catch {
        return null;
      }
    };

    try {
      const s = safeParse<SchoolSettings>('ihas_school_settings');
      if (s) safeSetIfChanged(setSchoolSettings, s);

      const slides = safeParse<HeroSlide[]>('ihas_hero_slides');
      if (Array.isArray(slides)) safeSetIfChanged(setHeroSlides, slides);

      const c = safeParse<Course[]>('ihas_courses');
      if (Array.isArray(c)) safeSetIfChanged(setCourses, c);

      const std = safeParse<Student[]>('ihas_students');
      if (Array.isArray(std)) safeSetIfChanged(setStudents, std);

      const sub = safeParse<CourseSubject[]>('ihas_subjects');
      if (Array.isArray(sub)) safeSetIfChanged(setSubjects, sub);

      const ex = safeParse<CourseExam[]>('ihas_exams');
      if (Array.isArray(ex)) safeSetIfChanged(setExams, ex);

      const res = safeParse<StudentResult[]>('ihas_results');
      if (Array.isArray(res)) safeSetIfChanged(setResults, res);

      const tch = safeParse<Teacher[]>('ihas_teachers');
      if (Array.isArray(tch)) safeSetIfChanged(setTeachers, tch);

      const vid = safeParse<VideoClass[]>('ihas_videos') || safeParse<VideoClass[]>('ihas_video_classes');
      if (Array.isArray(vid)) safeSetIfChanged(setVideoClasses, vid);

      const nts = safeParse<NoteResource[]>('ihas_notes');
      if (Array.isArray(nts)) safeSetIfChanged(setNotes, nts);

      const nots = safeParse<Notice[]>('ihas_notices');
      if (Array.isArray(nots)) safeSetIfChanged(setNotices, nots);

      const rts = safeParse<ClassRoutine[]>('ihas_routines');
      if (Array.isArray(rts)) safeSetIfChanged(setRoutines, rts);

      const bot = safeParse<ChatbotTrainingItem[]>('ihas_chatbot_training');
      if (Array.isArray(bot)) safeSetIfChanged(setChatbotTraining, bot);

      const qz = safeParse<ModelTest[]>('ihas_quizzes');
      if (Array.isArray(qz)) safeSetIfChanged(setModelTests, qz);

      const g = safeParse<GoogleCloudConfig>('ihas_google_cloud_config');
      if (g) safeSetIfChanged(setGoogleCloudConfig, g);

      const gh = safeParse<GitHubConfig>('ihas_github_config');
      if (gh) safeSetIfChanged(setGithubConfig, gh);

      const cr = safeParse<{ email: string; password: string }>('ihas_admin_creds');
      if (cr?.email && cr?.password) safeSetIfChanged(setAdminCredentials, cr);
    } catch (e) {
      console.warn('Error reloading all data from storage:', e);
    }
  }, [safeSetIfChanged]);

  // Initial Database Hydration from server /api/sync-to-code
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchInitialData = async () => {
      try {
        const res = await fetch('/api/sync-to-code', { cache: 'no-store' });
        if (res.ok) {
          const liveData = await res.json();
          if (isMounted && liveData && typeof liveData === 'object') {
            if (liveData.ihas_school_settings) safeSetIfChanged(setSchoolSettings, liveData.ihas_school_settings);
            if (Array.isArray(liveData.ihas_hero_slides)) safeSetIfChanged(setHeroSlides, liveData.ihas_hero_slides);
            if (Array.isArray(liveData.ihas_courses)) safeSetIfChanged(setCourses, liveData.ihas_courses);
            if (Array.isArray(liveData.ihas_students)) safeSetIfChanged(setStudents, liveData.ihas_students);
            if (Array.isArray(liveData.ihas_subjects)) safeSetIfChanged(setSubjects, liveData.ihas_subjects);
            if (Array.isArray(liveData.ihas_exams)) safeSetIfChanged(setExams, liveData.ihas_exams);
            if (Array.isArray(liveData.ihas_results)) safeSetIfChanged(setResults, liveData.ihas_results);
            if (Array.isArray(liveData.ihas_teachers)) safeSetIfChanged(setTeachers, liveData.ihas_teachers);
            if (Array.isArray(liveData.ihas_video_classes) || Array.isArray(liveData.ihas_videos)) {
              safeSetIfChanged(setVideoClasses, liveData.ihas_video_classes || liveData.ihas_videos);
            }
            if (Array.isArray(liveData.ihas_notes)) safeSetIfChanged(setNotes, liveData.ihas_notes);
            if (Array.isArray(liveData.ihas_notices)) safeSetIfChanged(setNotices, liveData.ihas_notices);
            if (Array.isArray(liveData.ihas_routines)) safeSetIfChanged(setRoutines, liveData.ihas_routines);
            if (Array.isArray(liveData.ihas_chatbot_training)) safeSetIfChanged(setChatbotTraining, liveData.ihas_chatbot_training);
            if (Array.isArray(liveData.ihas_quizzes)) safeSetIfChanged(setModelTests, liveData.ihas_quizzes);
          }
        }
      } catch (err) {
        console.warn('Initial live database sync failed, using local storage state', err);
      } finally {
        if (isMounted) setIsInitialLoading(false);
      }
    };

    fetchInitialData();
    return () => { isMounted = false; };
  }, [safeSetIfChanged]);

  // Listen to cross-tab / cross-window real-time synchronization updates with safeSetIfChanged
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
            if (data) safeSetIfChanged(setSchoolSettings, data);
            else {
              const raw = safeStorage.getItem('ihas_school_settings');
              if (raw) safeSetIfChanged(setSchoolSettings, JSON.parse(raw));
            }
            break;
          }
          case 'heroSlides':
          case 'slides':
          case 'hero_slides': {
            if (data) safeSetIfChanged(setHeroSlides, data);
            else {
              const raw = safeStorage.getItem('ihas_hero_slides');
              if (raw) safeSetIfChanged(setHeroSlides, JSON.parse(raw));
            }
            break;
          }
          case 'courses': {
            if (data) safeSetIfChanged(setCourses, data);
            else {
              const raw = safeStorage.getItem('ihas_courses');
              if (raw) safeSetIfChanged(setCourses, JSON.parse(raw));
            }
            break;
          }
          case 'students': {
            if (data) safeSetIfChanged(setStudents, data);
            else {
              const raw = safeStorage.getItem('ihas_students');
              if (raw) safeSetIfChanged(setStudents, JSON.parse(raw));
            }
            break;
          }
          case 'subjects': {
            if (data) safeSetIfChanged(setSubjects, data);
            else {
              const raw = safeStorage.getItem('ihas_subjects');
              if (raw) safeSetIfChanged(setSubjects, JSON.parse(raw));
            }
            break;
          }
          case 'exams': {
            if (data) safeSetIfChanged(setExams, data);
            else {
              const raw = safeStorage.getItem('ihas_exams');
              if (raw) safeSetIfChanged(setExams, JSON.parse(raw));
            }
            break;
          }
          case 'results': {
            if (data) safeSetIfChanged(setResults, data);
            else {
              const raw = safeStorage.getItem('ihas_results');
              if (raw) safeSetIfChanged(setResults, JSON.parse(raw));
            }
            break;
          }
          case 'teachers': {
            if (data) safeSetIfChanged(setTeachers, data);
            else {
              const raw = safeStorage.getItem('ihas_teachers');
              if (raw) safeSetIfChanged(setTeachers, JSON.parse(raw));
            }
            break;
          }
          case 'videoClasses':
          case 'videos':
          case 'video_classes': {
            if (data) safeSetIfChanged(setVideoClasses, data);
            else {
              const raw = safeStorage.getItem('ihas_videos') || safeStorage.getItem('ihas_video_classes');
              if (raw) safeSetIfChanged(setVideoClasses, JSON.parse(raw));
            }
            break;
          }
          case 'notes': {
            if (data) safeSetIfChanged(setNotes, data);
            else {
              const raw = safeStorage.getItem('ihas_notes');
              if (raw) safeSetIfChanged(setNotes, JSON.parse(raw));
            }
            break;
          }
          case 'notices': {
            if (data) safeSetIfChanged(setNotices, data);
            else {
              const raw = safeStorage.getItem('ihas_notices');
              if (raw) safeSetIfChanged(setNotices, JSON.parse(raw));
            }
            break;
          }
          case 'routines': {
            if (data) safeSetIfChanged(setRoutines, data);
            else {
              const raw = safeStorage.getItem('ihas_routines');
              if (raw) safeSetIfChanged(setRoutines, JSON.parse(raw));
            }
            break;
          }
          case 'chatbotTraining':
          case 'chatbot_training': {
            if (data) safeSetIfChanged(setChatbotTraining, data);
            else {
              const raw = safeStorage.getItem('ihas_chatbot_training');
              if (raw) safeSetIfChanged(setChatbotTraining, JSON.parse(raw));
            }
            break;
          }
          case 'quizzes':
          case 'modelTests':
          case 'model_tests': {
            if (data) safeSetIfChanged(setModelTests, data);
            else {
              const raw = safeStorage.getItem('ihas_quizzes');
              if (raw) safeSetIfChanged(setModelTests, JSON.parse(raw));
            }
            break;
          }
          case 'googleCloudConfig':
          case 'google_cloud':
          case 'google_cloud_config': {
            if (data) safeSetIfChanged(setGoogleCloudConfig, data);
            else {
              const raw = safeStorage.getItem('ihas_google_cloud_config');
              if (raw) safeSetIfChanged(setGoogleCloudConfig, JSON.parse(raw));
            }
            break;
          }
          case 'admin_creds':
          case 'adminCredentials': {
            if (data) safeSetIfChanged(setAdminCredentials, data);
            else {
              const raw = safeStorage.getItem('ihas_admin_creds');
              if (raw) safeSetIfChanged(setAdminCredentials, JSON.parse(raw));
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
            if (data) safeSetIfChanged(setGithubConfig, data);
            else {
              const raw = safeStorage.getItem('ihas_github_config');
              if (raw) safeSetIfChanged(setGithubConfig, JSON.parse(raw));
            }
            break;
          }
          default: {
            reloadAllFromStorage();
          }
        }
      } catch (err) {
        console.warn('Realtime update processing error:', err);
      }
    });

    return () => unsubscribe();
  }, [reloadAllFromStorage, applyDatabaseSnapshot, safeSetIfChanged]);

  // Clean Tab-visibility check: only reload when visitor returns to tab and version genuinely changed
  const lastKnownVersionRef = React.useRef(typeof window !== 'undefined' ? localStorage.getItem('ihas_cache_version') || '0' : '0');

  useEffect(() => {
    const handleVisibilityOrFocus = () => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        const currentVersion = localStorage.getItem('ihas_cache_version') || '0';
        if (currentVersion !== lastKnownVersionRef.current) {
          lastKnownVersionRef.current = currentVersion;
          reloadAllFromStorage();
        }
      }
    };

    window.addEventListener('visibilitychange', handleVisibilityOrFocus);
    window.addEventListener('focus', handleVisibilityOrFocus);

    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityOrFocus);
      window.removeEventListener('focus', handleVisibilityOrFocus);
    };
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

  const toastTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((msg: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(msg);
    toastTimeoutRef.current = setTimeout(() => {
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
        isInitialLoading,
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
