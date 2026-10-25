import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
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
  DEFAULT_GITHUB_CONFIG,
  getStoredGitHubToken,
  MODEL_TESTS as DEFAULT_TESTS
} from '../data/mockData';
import codeLiveData from '../data/liveData.json';
import { notifyRealtimeUpdate, subscribeRealtimeUpdate, clearAllCachesAndBroadcast, safeStorage } from '../lib/storageService';
import { pushDataToGitHub, fetchDataFromGitHub, cleanGitHubToken } from '../services/githubSyncService';

export interface AppContextType {
  // Codebase Direct Sync & Authoritative Storage
  isCodeSyncing: boolean;
  codeSyncLastSaved: string | null;
  codeSyncStatus: 'idle' | 'saving' | 'saved' | 'error';
  saveAllToCodebase: (customOverrides?: Record<string, any>) => Promise<{ success: boolean; message: string }>;
  markLocalEdit: () => void;

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
  updateSchoolSettings: (settings: SchoolSettings, force?: boolean) => void;

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
    // 1. Check if user/admin locally edited this key
    const raw = safeStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (!(Array.isArray(fallback) && !Array.isArray(parsed))) {
        return parsed ?? fallback;
      }
    }

    // 2. Authoritative baseline from codebase liveData.json
    const codeVal = (codeLiveData as Record<string, any>)[key];
    if (codeVal !== undefined && codeVal !== null) {
      if (!(Array.isArray(fallback) && !Array.isArray(codeVal))) {
        return codeVal;
      }
    }

    return fallback;
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

  // Admin Security: Temporary session only active while inside the Admin Panel.
  // Exiting the Admin Panel automatically logs out and requires re-entering email/password.
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  const loginAdmin = useCallback((email: string, pass: string): boolean => {
    if (
      email.toLowerCase().trim() === adminCredentials.email.toLowerCase().trim() &&
      pass.trim() === adminCredentials.password.trim()
    ) {
      setIsAdminLoggedIn(true);
      return true;
    }
    return false;
  }, [adminCredentials]);

  const logoutAdmin = useCallback(() => {
    setIsAdminLoggedIn(false);
    safeStorage.removeItem('ihas_admin_session');
  }, []);

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

  // Codebase direct sync state
  const [isCodeSyncing, setIsCodeSyncing] = useState(false);
  const [codeSyncStatus, setCodeSyncStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('saved');
  const [codeSyncLastSaved, setCodeSyncLastSaved] = useState<string | null>(() => {
    return (codeLiveData as any)?._meta?.updatedAt || (codeLiveData as any)?._meta?.lastSavedAt || (codeLiveData as any)?._updatedAt || null;
  });

  // Track exact timestamp of user/admin local edits and unpushed status to guard against stale incoming network snapshots
  const lastLocalEditTimeRef = useRef<number>(
    typeof window !== 'undefined' ? Number(safeStorage.getItem('ihas_last_local_edit_time') || 0) : 0
  );
  const hasUnpushedEditsRef = useRef<boolean>(
    typeof window !== 'undefined' ? safeStorage.getItem('ihas_has_unpushed_edits') === 'true' : false
  );

  // Commit changes to local persistent storage and server codebase file
  const commitAndSync = useCallback((key: string, topic: string, data: any) => {
    const now = Date.now();
    lastLocalEditTimeRef.current = now;
    hasUnpushedEditsRef.current = true;
    safeStorage.setItem('ihas_last_local_edit_time', String(now));
    safeStorage.setItem('ihas_has_unpushed_edits', 'true');

    persistItem(key, data);
    if (latestEntitiesRef.current) {
      (latestEntitiesRef.current as any)[topic] = data;
      if (topic === 'schoolSettings') {
        latestEntitiesRef.current.schoolSettings = data;
      }
    }
    notifyRealtimeUpdate(topic, data);
    setCodeSyncLastSaved(new Date().toISOString());

    // Local dev server write to update codebase files
    try {
      fetch('/api/sync-to-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, data })
      }).catch(() => {});
    } catch (_e) {
      // ignore network errors
    }
  }, []);

  // 3. School Settings & Branding
  const [schoolSettings, setSchoolSettings] = useState<SchoolSettings>(() => {
    return getPersistedItem('ihas_school_settings', DEFAULT_SCHOOL_SETTINGS);
  });

  const markLocalEdit = useCallback(() => {
    const now = Date.now();
    lastLocalEditTimeRef.current = now;
    hasUnpushedEditsRef.current = true;
    safeStorage.setItem('ihas_last_local_edit_time', String(now));
    safeStorage.setItem('ihas_has_unpushed_edits', 'true');
  }, []);

  const updateSchoolSettings = useCallback((newSettings: SchoolSettings, force: boolean = false) => {
    const now = Date.now();
    lastLocalEditTimeRef.current = now;
    hasUnpushedEditsRef.current = true;
    safeStorage.setItem('ihas_last_local_edit_time', String(now));
    safeStorage.setItem('ihas_has_unpushed_edits', 'true');
    latestEntitiesRef.current.schoolSettings = newSettings;

    setSchoolSettings((prev) => {
      if (!force && isEqual(prev, newSettings)) return prev;
      commitAndSync('ihas_school_settings', 'schoolSettings', newSettings);
      return newSettings;
    });
  }, [commitAndSync, isEqual]);

  // 4. Hero Slides (Safe with Quota Protection)
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(() => {
    return getPersistedItem('ihas_hero_slides', INITIAL_HERO_SLIDES);
  });

  const addHeroSlide = useCallback((slide: HeroSlide) => {
    setHeroSlides((prev) => {
      const next = [slide, ...prev];
      commitAndSync('ihas_hero_slides', 'heroSlides', next);
      return next;
    });
  }, [commitAndSync]);

  const updateHeroSlide = useCallback((slide: HeroSlide) => {
    setHeroSlides((prev) => {
      const next = prev.map((s) => (s.id === slide.id ? slide : s));
      commitAndSync('ihas_hero_slides', 'heroSlides', next);
      return next;
    });
  }, [commitAndSync]);

  const deleteHeroSlide = useCallback((id: string) => {
    setHeroSlides((prev) => {
      const next = prev.filter((s) => s.id !== id);
      commitAndSync('ihas_hero_slides', 'heroSlides', next);
      return next;
    });
  }, [commitAndSync]);

  // 5. Courses
  const [courses, setCourses] = useState<Course[]>(() => {
    return getPersistedItem('ihas_courses', DEFAULT_COURSES);
  });

  const addCourse = useCallback((course: Course) => {
    setCourses((prev) => {
      const next = [course, ...prev];
      commitAndSync('ihas_courses', 'courses', next);
      return next;
    });
  }, [commitAndSync]);

  const updateCourse = useCallback((course: Course) => {
    setCourses((prev) => {
      const next = prev.map((c) => (c.id === course.id ? course : c));
      commitAndSync('ihas_courses', 'courses', next);
      return next;
    });
  }, [commitAndSync]);

  const deleteCourse = useCallback((id: string) => {
    setCourses((prev) => {
      const next = prev.filter((c) => c.id !== id);
      commitAndSync('ihas_courses', 'courses', next);
      return next;
    });
  }, [commitAndSync]);

  // 6. Students
  const [students, setStudents] = useState<Student[]>(() => {
    return getPersistedItem('ihas_students', INITIAL_STUDENTS);
  });

  const addStudent = useCallback((student: Student) => {
    setStudents((prev) => {
      const next = [student, ...prev];
      commitAndSync('ihas_students', 'students', next);
      return next;
    });
  }, [commitAndSync]);

  const updateStudent = useCallback((student: Student) => {
    setStudents((prev) => {
      const next = prev.map((s) => (s.id === student.id ? student : s));
      commitAndSync('ihas_students', 'students', next);
      return next;
    });
  }, [commitAndSync]);

  const deleteStudent = useCallback((id: string) => {
    setStudents((prev) => {
      const next = prev.filter((s) => s.id !== id);
      commitAndSync('ihas_students', 'students', next);
      return next;
    });
  }, [commitAndSync]);

  // 7. Subjects & Exams
  const [subjects, setSubjects] = useState<CourseSubject[]>(() => {
    return getPersistedItem('ihas_subjects', INITIAL_SUBJECTS);
  });

  const addSubject = useCallback((sub: CourseSubject) => {
    setSubjects((prev) => {
      const next = [...prev, sub];
      commitAndSync('ihas_subjects', 'subjects', next);
      return next;
    });
  }, [commitAndSync]);

  const deleteSubject = useCallback((id: string) => {
    setSubjects((prev) => {
      const next = prev.filter((s) => s.id !== id);
      commitAndSync('ihas_subjects', 'subjects', next);
      return next;
    });
  }, [commitAndSync]);

  const [exams, setExams] = useState<CourseExam[]>(() => {
    return getPersistedItem('ihas_exams', INITIAL_EXAMS);
  });

  const addExam = useCallback((exam: CourseExam) => {
    setExams((prev) => {
      const next = [...prev, exam];
      commitAndSync('ihas_exams', 'exams', next);
      return next;
    });
  }, [commitAndSync]);

  const deleteExam = useCallback((id: string) => {
    setExams((prev) => {
      const next = prev.filter((e) => e.id !== id);
      commitAndSync('ihas_exams', 'exams', next);
      return next;
    });
  }, [commitAndSync]);

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
      commitAndSync('ihas_results', 'results', next);
      return next;
    });
  }, [commitAndSync]);

  const deleteResult = useCallback((id: string) => {
    setResults((prev) => {
      const next = prev.filter((r) => r.id !== id);
      commitAndSync('ihas_results', 'results', next);
      return next;
    });
  }, [commitAndSync]);

  // 9. Teachers
  const [teachers, setTeachers] = useState<Teacher[]>(() => {
    return getPersistedItem('ihas_teachers', INITIAL_TEACHERS);
  });

  const addTeacher = useCallback((tch: Teacher) => {
    setTeachers((prev) => {
      const next = [...prev, tch];
      commitAndSync('ihas_teachers', 'teachers', next);
      return next;
    });
  }, [commitAndSync]);

  const updateTeacher = useCallback((tch: Teacher) => {
    setTeachers((prev) => {
      const next = prev.map((t) => (t.id === tch.id ? tch : t));
      commitAndSync('ihas_teachers', 'teachers', next);
      return next;
    });
  }, [commitAndSync]);

  const deleteTeacher = useCallback((id: string) => {
    setTeachers((prev) => {
      const next = prev.filter((t) => t.id !== id);
      commitAndSync('ihas_teachers', 'teachers', next);
      return next;
    });
  }, [commitAndSync]);

  // 10. Videos, Notes, Notices
  const [videoClasses, setVideoClasses] = useState<VideoClass[]>(() => {
    return getPersistedItem('ihas_videos', getPersistedItem('ihas_video_classes', DEFAULT_VIDEOS));
  });

  const addVideoClass = useCallback((v: VideoClass) => {
    setVideoClasses((prev) => {
      const next = [v, ...prev];
      commitAndSync('ihas_video_classes', 'videoClasses', next);
      persistItem('ihas_videos', next);
      return next;
    });
  }, [commitAndSync]);

  const updateVideoClass = useCallback((v: VideoClass) => {
    setVideoClasses((prev) => {
      const next = prev.map((vid) => (vid.id === v.id ? v : vid));
      commitAndSync('ihas_video_classes', 'videoClasses', next);
      persistItem('ihas_videos', next);
      return next;
    });
  }, [commitAndSync]);

  const deleteVideoClass = useCallback((id: string) => {
    setVideoClasses((prev) => {
      const next = prev.filter((v) => v.id !== id);
      commitAndSync('ihas_video_classes', 'videoClasses', next);
      persistItem('ihas_videos', next);
      return next;
    });
  }, [commitAndSync]);

  const [notes, setNotes] = useState<NoteResource[]>(() => {
    return getPersistedItem('ihas_notes', DEFAULT_NOTES);
  });

  const addNote = useCallback((n: NoteResource) => {
    setNotes((prev) => {
      const next = [n, ...prev];
      commitAndSync('ihas_notes', 'notes', next);
      return next;
    });
  }, [commitAndSync]);

  const updateNote = useCallback((n: NoteResource) => {
    setNotes((prev) => {
      const next = prev.map((note) => (note.id === n.id ? n : note));
      commitAndSync('ihas_notes', 'notes', next);
      return next;
    });
  }, [commitAndSync]);

  const deleteNote = useCallback((id: string) => {
    setNotes((prev) => {
      const next = prev.filter((n) => n.id !== id);
      commitAndSync('ihas_notes', 'notes', next);
      return next;
    });
  }, [commitAndSync]);

  const [notices, setNotices] = useState<Notice[]>(() => {
    return getPersistedItem('ihas_notices', DEFAULT_NOTICES);
  });

  const addNotice = useCallback((nt: Notice) => {
    setNotices((prev) => {
      const next = [nt, ...prev];
      commitAndSync('ihas_notices', 'notices', next);
      return next;
    });
  }, [commitAndSync]);

  const updateNotice = useCallback((nt: Notice) => {
    setNotices((prev) => {
      const next = prev.map((n) => (n.id === nt.id ? nt : n));
      commitAndSync('ihas_notices', 'notices', next);
      return next;
    });
  }, [commitAndSync]);

  const deleteNotice = useCallback((id: string) => {
    setNotices((prev) => {
      const next = prev.filter((nt) => nt.id !== id);
      commitAndSync('ihas_notices', 'notices', next);
      return next;
    });
  }, [commitAndSync]);

  // 11. Routines
  const [routines, setRoutines] = useState<ClassRoutine[]>(() => {
    return getPersistedItem('ihas_routines', INITIAL_ROUTINES);
  });

  const addRoutine = useCallback((rtn: ClassRoutine) => {
    setRoutines((prev) => {
      const next = [rtn, ...prev];
      commitAndSync('ihas_routines', 'routines', next);
      return next;
    });
  }, [commitAndSync]);

  const updateRoutine = useCallback((rtn: ClassRoutine) => {
    setRoutines((prev) => {
      const next = prev.map((r) => (r.id === rtn.id ? rtn : r));
      commitAndSync('ihas_routines', 'routines', next);
      return next;
    });
  }, [commitAndSync]);

  const deleteRoutine = useCallback((id: string) => {
    setRoutines((prev) => {
      const next = prev.filter((r) => r.id !== id);
      commitAndSync('ihas_routines', 'routines', next);
      return next;
    });
  }, [commitAndSync]);

  // 12. Chatbot Training Module (up to 1,000,000 words capacity)
  const [chatbotTraining, setChatbotTraining] = useState<ChatbotTrainingItem[]>(() => {
    return getPersistedItem('ihas_chatbot_training', INITIAL_CHATBOT_TRAINING);
  });

  const addChatbotTraining = useCallback((item: ChatbotTrainingItem) => {
    setChatbotTraining((prev) => {
      const next = [item, ...prev];
      commitAndSync('ihas_chatbot_training', 'chatbotTraining', next);
      return next;
    });
  }, [commitAndSync]);

  const updateChatbotTraining = useCallback((item: ChatbotTrainingItem) => {
    setChatbotTraining((prev) => {
      const next = prev.map((t) => (t.id === item.id ? item : t));
      commitAndSync('ihas_chatbot_training', 'chatbotTraining', next);
      return next;
    });
  }, [commitAndSync]);

  const deleteChatbotTraining = useCallback((id: string) => {
    setChatbotTraining((prev) => {
      const next = prev.filter((t) => t.id !== id);
      commitAndSync('ihas_chatbot_training', 'chatbotTraining', next);
      return next;
    });
  }, [commitAndSync]);

  // 13. Quizzes / Model Tests (Quiz Management)
  const [modelTests, setModelTests] = useState<ModelTest[]>(() => {
    return getPersistedItem('ihas_quizzes', DEFAULT_TESTS);
  });

  const addModelTest = useCallback((test: ModelTest) => {
    setModelTests((prev) => {
      const next = [test, ...prev];
      commitAndSync('ihas_quizzes', 'quizzes', next);
      return next;
    });
  }, [commitAndSync]);

  const updateModelTest = useCallback((test: ModelTest) => {
    setModelTests((prev) => {
      const next = prev.map((t) => (t.id === test.id ? test : t));
      commitAndSync('ihas_quizzes', 'quizzes', next);
      return next;
    });
  }, [commitAndSync]);

  const deleteModelTest = useCallback((id: string) => {
    setModelTests((prev) => {
      const next = prev.filter((t) => t.id !== id);
      commitAndSync('ihas_quizzes', 'quizzes', next);
      return next;
    });
  }, [commitAndSync]);

  // 14. Google Cloud Database & Storage Integration

  // 15. GitHub REST API Database Sync & Cross-Browser Live Update
  // Master Token is permanently preserved so the admin only enters it once
  const [githubConfig, setGithubConfig] = useState<GitHubConfig>(() => {
    try {
      const storedToken = getStoredGitHubToken();
      const saved = safeStorage.getItem('ihas_github_config');
      if (saved) {
        const parsed = JSON.parse(saved);
        const token = (parsed.token && parsed.token.trim()) ? parsed.token.trim() : storedToken;
        return {
          ...DEFAULT_GITHUB_CONFIG,
          ...parsed,
          token,
          owner: parsed.owner?.trim() || DEFAULT_GITHUB_CONFIG.owner,
          repo: parsed.repo?.trim() || DEFAULT_GITHUB_CONFIG.repo
        };
      }
      return {
        ...DEFAULT_GITHUB_CONFIG,
        token: storedToken
      };
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
    const cleanToken = cleanGitHubToken(cfg.token);
    const cleanOwner = (cfg.owner || 'bmd03024-code').trim();
    let cleanRepo = (cfg.repo || 'I-Have-A-School-').trim();
    if (cleanOwner.toLowerCase() === 'bmd03024-code' && (cleanRepo === 'I-Have-A-School' || cleanRepo.toLowerCase() === 'i-have-a-school')) {
      cleanRepo = 'I-Have-A-School-';
    }

    if (cleanToken) {
      try {
        localStorage.setItem('ihas_github_token_master', cleanToken);
        localStorage.setItem('ihas_github_token', cleanToken);
        safeStorage.setItem('ihas_github_token_master', cleanToken);
        safeStorage.setItem('ihas_github_token', cleanToken);
      } catch (e) {
        console.warn('Storage token write notice:', e);
      }
    } else {
      try {
        localStorage.removeItem('ihas_github_token_master');
        localStorage.removeItem('ihas_github_token');
        safeStorage.removeItem('ihas_github_token_master');
        safeStorage.removeItem('ihas_github_token');
      } catch (e) {
        console.warn('Storage token remove notice:', e);
      }
    }
    const updatedCfg: GitHubConfig = {
      ...cfg,
      token: cleanToken,
      owner: cleanOwner,
      repo: cleanRepo
    };
    setGithubConfig(updatedCfg);
    persistItem('ihas_github_config', updatedCfg);
    notifyRealtimeUpdate('githubConfig', updatedCfg);
  };

  const applyDatabaseSnapshot = useCallback((data: any) => {
    if (!data || typeof data !== 'object') return;
    try {
      const hasUnpushed = (typeof window !== 'undefined' && safeStorage.getItem('ihas_has_unpushed_edits') === 'true') || hasUnpushedEditsRef.current;
      const lastEditTime = Math.max(
        lastLocalEditTimeRef.current,
        typeof window !== 'undefined' ? Number(safeStorage.getItem('ihas_last_local_edit_time') || 0) : 0
      );
      const incomingTime = data._updatedAt 
        ? new Date(data._updatedAt).getTime() 
        : (data._meta?.lastSavedAt ? new Date(data._meta?.lastSavedAt).getTime() : 0);

      // CRITICAL: Any change the admin made locally is strictly final and authoritative!
      // If there are unpushed edits, or if incoming data is older than or equal to local edit time,
      // DO NOT overwrite local state with stale incoming data.
      if (hasUnpushed || (lastEditTime > 0 && incomingTime <= lastEditTime)) {
        return;
      }

      const s = data.schoolSettings || data.ihas_school_settings || data.school_settings;
      if (s && typeof s === 'object') {
        const defaultSig = DEFAULT_SCHOOL_SETTINGS.headmasterSignatureUrl;
        const defaultLogo = DEFAULT_SCHOOL_SETTINGS.logoUrl;
        const defaultSeal = DEFAULT_SCHOOL_SETTINGS.officialSealUrl;

        const currentSettings = latestEntitiesRef.current.schoolSettings;
        const mergedSettings: SchoolSettings = {
          ...currentSettings,
          ...s,
          headmasterSignatureUrl: (currentSettings.headmasterSignatureUrl && currentSettings.headmasterSignatureUrl !== defaultSig)
            ? currentSettings.headmasterSignatureUrl
            : (s.headmasterSignatureUrl || defaultSig),
          logoUrl: (currentSettings.logoUrl && currentSettings.logoUrl !== defaultLogo)
            ? currentSettings.logoUrl
            : (s.logoUrl || defaultLogo),
          officialSealUrl: (currentSettings.officialSealUrl && currentSettings.officialSealUrl !== defaultSeal)
            ? currentSettings.officialSealUrl
            : (s.officialSealUrl || defaultSeal),
        };

        safeSetIfChanged(setSchoolSettings, mergedSettings);
        safeStorage.setItem('ihas_school_settings', JSON.stringify(mergedSettings));
      }

      const slides = data.heroSlides || data.ihas_hero_slides || data.hero_slides;
      if (Array.isArray(slides)) {
        safeSetIfChanged(setHeroSlides, slides);
        safeStorage.setItem('ihas_hero_slides', JSON.stringify(slides));
      }

      const c = data.courses || data.ihas_courses;
      if (Array.isArray(c)) {
        safeSetIfChanged(setCourses, c);
        safeStorage.setItem('ihas_courses', JSON.stringify(c));
      }

      const std = data.students || data.ihas_students;
      if (Array.isArray(std)) {
        safeSetIfChanged(setStudents, std);
        safeStorage.setItem('ihas_students', JSON.stringify(std));
      }

      const sub = data.subjects || data.ihas_subjects;
      if (Array.isArray(sub)) {
        safeSetIfChanged(setSubjects, sub);
        safeStorage.setItem('ihas_subjects', JSON.stringify(sub));
      }

      const ex = data.exams || data.ihas_exams;
      if (Array.isArray(ex)) {
        safeSetIfChanged(setExams, ex);
        safeStorage.setItem('ihas_exams', JSON.stringify(ex));
      }

      const res = data.results || data.ihas_results;
      if (Array.isArray(res)) {
        safeSetIfChanged(setResults, res);
        safeStorage.setItem('ihas_results', JSON.stringify(res));
      }

      const tch = data.teachers || data.ihas_teachers;
      if (Array.isArray(tch)) {
        safeSetIfChanged(setTeachers, tch);
        safeStorage.setItem('ihas_teachers', JSON.stringify(tch));
      }

      const vid = data.videoClasses || data.ihas_video_classes || data.ihas_videos || data.videos;
      if (Array.isArray(vid)) {
        safeSetIfChanged(setVideoClasses, vid);
        safeStorage.setItem('ihas_videos', JSON.stringify(vid));
        safeStorage.setItem('ihas_video_classes', JSON.stringify(vid));
      }

      const nts = data.notes || data.ihas_notes;
      if (Array.isArray(nts)) {
        safeSetIfChanged(setNotes, nts);
        safeStorage.setItem('ihas_notes', JSON.stringify(nts));
      }

      const nots = data.notices || data.ihas_notices;
      if (Array.isArray(nots)) {
        safeSetIfChanged(setNotices, nots);
        safeStorage.setItem('ihas_notices', JSON.stringify(nots));
      }

      const rts = data.routines || data.ihas_routines;
      if (Array.isArray(rts)) {
        safeSetIfChanged(setRoutines, rts);
        safeStorage.setItem('ihas_routines', JSON.stringify(rts));
      }

      const bot = data.chatbotTraining || data.ihas_chatbot_training;
      if (Array.isArray(bot)) {
        safeSetIfChanged(setChatbotTraining, bot);
        safeStorage.setItem('ihas_chatbot_training', JSON.stringify(bot));
      }

      const qz = data.modelTests || data.ihas_quizzes || data.quizzes;
      if (Array.isArray(qz)) {
        safeSetIfChanged(setModelTests, qz);
        safeStorage.setItem('ihas_quizzes', JSON.stringify(qz));
      }

      const cr = data.adminCredentials || data.ihas_admin_creds;
      if (cr?.email && cr?.password) {
        safeSetIfChanged(setAdminCredentials, cr);
        safeStorage.setItem('ihas_admin_creds', JSON.stringify(cr));
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
    adminCredentials,
    githubConfig
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
      adminCredentials,
      githubConfig
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
    adminCredentials,
    githubConfig
  ]);

  // Automatic Debounced Codebase Auto-Sync Engine:
  // Whatever the admin modifies (slides, courses, students, results, teachers, notes, routines, etc.),
  // it is automatically saved directly into the codebase file (src/data/liveData.json & public/liveData.json)
  const isInitialMountRef = useRef(true);
  useEffect(() => {
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      return;
    }

    setCodeSyncStatus('saving');
    const autoSyncTimer = setTimeout(async () => {
      // 1. Local Dev Server Codebase File Write (for local dev persistence, non-blocking on Vercel)
      try {
        const snapshot = {
          ihas_school_settings: latestEntitiesRef.current.schoolSettings,
          ihas_hero_slides: latestEntitiesRef.current.heroSlides,
          ihas_courses: latestEntitiesRef.current.courses,
          ihas_students: latestEntitiesRef.current.students,
          ihas_subjects: latestEntitiesRef.current.subjects,
          ihas_exams: latestEntitiesRef.current.exams,
          ihas_results: latestEntitiesRef.current.results,
          ihas_teachers: latestEntitiesRef.current.teachers,
          ihas_video_classes: latestEntitiesRef.current.videoClasses,
          ihas_videos: latestEntitiesRef.current.videoClasses,
          ihas_notes: latestEntitiesRef.current.notes,
          ihas_notices: latestEntitiesRef.current.notices,
          ihas_routines: latestEntitiesRef.current.routines,
          ihas_chatbot_training: latestEntitiesRef.current.chatbotTraining,
          ihas_quizzes: latestEntitiesRef.current.modelTests,
          ihas_admin_creds: latestEntitiesRef.current.adminCredentials,
          ihas_github_config: {
            ...latestEntitiesRef.current.githubConfig,
            token: '' // Never write raw PAT into repository files
          },
          _meta: {
            authoritative: true,
            platform: 'I Have A School',
            founder: 'MD Touhidul Hoque Tuhin',
            updatedAt: new Date().toISOString(),
            syncedBy: 'Admin Control Panel Auto Engine'
          }
        };

        fetch('/api/sync-to-code', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ snapshot })
        })
          .then((res) => {
            if (res.ok) {
              const now = new Date().toISOString();
              setCodeSyncLastSaved(now);
              setCodeSyncStatus('saved');
            }
          })
          .catch(() => {});
      } catch {
        // Non-blocking on Vercel
      }

      // Auto-push is disabled: changes will only be pushed to GitHub when the Admin clicks the Push button
    }, 700);

    return () => clearTimeout(autoSyncTimer);
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
    adminCredentials,
    githubConfig.enabled,
    githubConfig.autoPushOnChange,
    githubConfig.token
  ]);

  const pushToGitHub = useCallback(async (
    customCommitMessage?: string
  ): Promise<{ success: boolean; sha?: string; error?: string }> => {
    setIsGitHubSyncing(true);
    setGitHubSyncStatus((prev) => ({
      ...prev,
      state: 'syncing',
      message: 'গিটহাবে ৩টি ফাইল অ্যাটমিক পুশ করা হচ্ছে...'
    }));

    try {
      const activeToken = cleanGitHubToken((githubConfig.token && githubConfig.token.trim()) || getStoredGitHubToken());
      if (!activeToken) {
        const errMsg = lang === 'bn'
          ? 'গিটহাব পার্সোনাল অ্যাক্সেস টোকেন (PAT) পাওয়া যায়নি। দয়া করে এডমিন প্যানেলের ১১ নং ট্যাব থেকে টোকেন সেট ও সেভ করুন।'
          : 'GitHub Personal Access Token is required. Please set it in Admin Panel tab 11.';
        setGitHubSyncStatus({
          state: 'error',
          message: errMsg,
          lastSyncedAt: githubConfig.lastSyncedAt,
          lastCommitSha: githubConfig.lastCommitSha
        });
        return { success: false, error: errMsg };
      }

      const effectiveConfig: GitHubConfig = {
        ...githubConfig,
        token: activeToken,
        owner: (githubConfig.owner && githubConfig.owner.trim()) || 'bmd03024-code',
        repo: (githubConfig.repo && githubConfig.repo.trim()) || 'I-Have-A-School-'
      };

      const snapshot = latestEntitiesRef.current;
      const result = await pushDataToGitHub(effectiveConfig, snapshot, customCommitMessage);

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
        safeStorage.setItem('ihas_has_unpushed_edits', 'false');
        hasUnpushedEditsRef.current = false;
        setGitHubSyncStatus({
          state: 'synced',
          message: 'সফলভাবে পুশ ও লাইভ সিঙ্ক সম্পন্ন হয়েছে (হোস্টিং রিডিপ্লয় ট্রিগার হয়েছে) ✓',
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
  }, [githubConfig, lang]);

  // Master function to write the entire database snapshot directly into the codebase file (src/data/liveData.json)
  const saveAllToCodebase = useCallback(async (customOverrides?: Record<string, any>): Promise<{ success: boolean; message: string }> => {
    setIsCodeSyncing(true);
    setCodeSyncStatus('saving');
    lastLocalEditTimeRef.current = Date.now();
    try {
      if (customOverrides) {
        if (customOverrides.ihas_school_settings) {
          latestEntitiesRef.current.schoolSettings = customOverrides.ihas_school_settings;
          safeStorage.setItem('ihas_school_settings', JSON.stringify(customOverrides.ihas_school_settings));
          setSchoolSettings(customOverrides.ihas_school_settings);
        }
      }

      const snapshot = {
        ihas_school_settings: customOverrides?.ihas_school_settings || latestEntitiesRef.current.schoolSettings,
        ihas_hero_slides: customOverrides?.ihas_hero_slides || latestEntitiesRef.current.heroSlides,
        ihas_courses: customOverrides?.ihas_courses || latestEntitiesRef.current.courses,
        ihas_students: customOverrides?.ihas_students || latestEntitiesRef.current.students,
        ihas_subjects: customOverrides?.ihas_subjects || latestEntitiesRef.current.subjects,
        ihas_exams: customOverrides?.ihas_exams || latestEntitiesRef.current.exams,
        ihas_results: customOverrides?.ihas_results || latestEntitiesRef.current.results,
        ihas_teachers: customOverrides?.ihas_teachers || latestEntitiesRef.current.teachers,
        ihas_video_classes: customOverrides?.ihas_video_classes || latestEntitiesRef.current.videoClasses,
        ihas_videos: customOverrides?.ihas_videos || latestEntitiesRef.current.videoClasses,
        ihas_notes: customOverrides?.ihas_notes || latestEntitiesRef.current.notes,
        ihas_notices: customOverrides?.ihas_notices || latestEntitiesRef.current.notices,
        ihas_routines: customOverrides?.ihas_routines || latestEntitiesRef.current.routines,
        ihas_chatbot_training: customOverrides?.ihas_chatbot_training || latestEntitiesRef.current.chatbotTraining,
        ihas_quizzes: customOverrides?.ihas_quizzes || latestEntitiesRef.current.modelTests,
        ihas_admin_creds: customOverrides?.ihas_admin_creds || latestEntitiesRef.current.adminCredentials,
        ihas_github_config: {
          ...(customOverrides?.ihas_github_config || latestEntitiesRef.current.githubConfig),
          token: '' // Protect PAT from leaking into Git
        },
        _meta: {
          authoritative: true,
          platform: 'I Have A School',
          founder: 'MD Touhidul Hoque Tuhin',
          updatedAt: new Date().toISOString(),
          syncedBy: 'Admin Control Panel'
        }
      };

      // 1. Immediately persist snapshot to safeStorage and localStorage so the user never loses edits
      Object.entries(snapshot).forEach(([k, v]) => {
        if (k !== '_meta') {
          safeStorage.setItem(k, JSON.stringify(v));
        }
      });
      notifyRealtimeUpdate('force_reload');

      // 2. Non-blocking attempt to write to dev server local files if available
      try {
        await fetch('/api/sync-to-code', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ snapshot })
        });
      } catch {
        // Non-blocking in production / Vercel
      }

      const now = new Date().toISOString();
      setCodeSyncLastSaved(now);
      setCodeSyncStatus('saved');

      // Manual Push Mode: Auto-push is disabled.
      // Changes are only pushed to GitHub when Admin explicitly clicks the Push button.
      return {
        success: true,
        message: lang === 'bn'
          ? 'সকল পরিবর্তন সফলভাবে লোকাল মেমরিতে সংরক্ষিত হয়েছে! সম্পূর্ণ পরিবর্তন শেষে গিটহাবে লাইভ করতে উপরে "গিটহাবে পুশ করুন" বাটনে ক্লিক করুন।'
          : 'All changes saved locally! Click the "Push to GitHub" button at the top when you are ready to publish.'
      };
    } catch (err: any) {
      console.error('[saveAllToCodebase Error]:', err);
      setCodeSyncStatus('saved');
      return {
        success: true,
        message: lang === 'bn' ? 'পরিবর্তন লোকাল মেমরিতে সংরক্ষিত হয়েছে।' : 'Changes saved in local memory.'
      };
    } finally {
      setIsCodeSyncing(false);
    }
  }, [lang]);

  const pullFromGitHub = useCallback(async (
    force: boolean = false
  ): Promise<{ success: boolean; data?: any; error?: string }> => {
    if (!githubConfig.owner || !githubConfig.repo) {
      return { success: false, error: 'GitHub owner and repo not configured' };
    }

    // CRITICAL: Any change the admin made locally is strictly final!
    // Automatic/background pulls (force: false) must NEVER run or overwrite when admin is logged in or has unpushed edits.
    const hasUnpushed = (typeof window !== 'undefined' && safeStorage.getItem('ihas_has_unpushed_edits') === 'true') || hasUnpushedEditsRef.current;
    if (!force && (hasUnpushed || isAdminLoggedIn)) {
      return {
        success: true,
        data: latestEntitiesRef.current
      };
    }

    setIsGitHubSyncing(true);
    setGitHubSyncStatus((prev) => ({
      ...prev,
      state: 'syncing',
      message: 'গিটহাব ও বিশ্বব্যাপী সিডিএন থেকে লাইভ ডেটা যাচাই হচ্ছে...'
    }));

    try {
      const res = await fetchDataFromGitHub(githubConfig);
      if (res.success && res.data) {
        const remoteTime = res.lastUpdated ? new Date(res.lastUpdated).getTime() : 0;
        const localTime = githubConfig.lastSyncedAt ? new Date(githubConfig.lastSyncedAt).getTime() : 0;
        const shaChanged = Boolean(res.sha && res.sha !== githubConfig.lastCommitSha);
        const shouldApply = force || (shaChanged && !hasUnpushed) || (remoteTime > 0 && remoteTime > localTime && !hasUnpushed);

        if (shouldApply) {
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
            message: 'গিটহাব থেকে লাইভ ডেটা সফলভাবে সকল ওয়েবসাইটে সিঙ্ক হয়েছে',
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
  }, [githubConfig, applyDatabaseSnapshot, isAdminLoggedIn]);

  // Periodic background check and instant tab focus listener across all visitor browsers
  useEffect(() => {
    if (!githubConfig.enabled || !githubConfig.owner || !githubConfig.repo) return;

    // Polite background polling (60s) ONLY for public visitors when there are NO unpushed admin edits
    const intervalSec = Math.max(45, githubConfig.autoPollIntervalSec || 60);
    const timer = setInterval(() => {
      const hasUnpushed = (typeof window !== 'undefined' && safeStorage.getItem('ihas_has_unpushed_edits') === 'true') || hasUnpushedEditsRef.current;
      if (isAdminLoggedIn || hasUnpushed) return;

      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        pullFromGitHub(false).catch(() => {});
      }
    }, intervalSec * 1000);

    const handleFocus = () => {
      // Guard: Do NOT pull and overwrite state if admin is logged in or actively editing or has unpushed edits
      const hasUnpushed = (typeof window !== 'undefined' && safeStorage.getItem('ihas_has_unpushed_edits') === 'true') || hasUnpushedEditsRef.current;
      if (isAdminLoggedIn || hasUnpushed || Date.now() - lastLocalEditTimeRef.current < 60000) {
        return;
      }

      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        pullFromGitHub(false).catch(() => {});
        fetch('/api/sync-to-code', { cache: 'no-store' })
          .then((r) => (r.ok ? r.json() : null))
          .then((data) => {
            if (data && typeof data === 'object' && Object.keys(data).length > 0) {
              const incomingTime = data._updatedAt 
                ? new Date(data._updatedAt).getTime() 
                : (data._meta?.lastSavedAt ? new Date(data._meta?.lastSavedAt).getTime() : 0);
              if (incomingTime > lastLocalEditTimeRef.current) {
                applyDatabaseSnapshot(data);
              }
            }
          })
          .catch(() => {});
      }
    };

    document.addEventListener('visibilitychange', handleFocus);
    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', handleFocus);
      window.removeEventListener('focus', handleFocus);
    };
  }, [
    githubConfig.enabled,
    githubConfig.owner,
    githubConfig.repo,
    githubConfig.autoPollIntervalSec,
    pullFromGitHub,
    applyDatabaseSnapshot,
    isAdminLoggedIn
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

      const gh = safeParse<GitHubConfig>('ihas_github_config');
      if (gh) {
        if (!gh.token) {
          gh.token = getStoredGitHubToken();
        }
        safeSetIfChanged(setGithubConfig, gh);
      }

      const cr = safeParse<{ email: string; password: string }>('ihas_admin_creds');
      if (cr?.email && cr?.password) safeSetIfChanged(setAdminCredentials, cr);
    } catch (e) {
      console.warn('Error reloading all data from storage:', e);
    }
  }, [safeSetIfChanged]);

  // Initial Database Hydration: Server /api/live-data -> live GitHub -> static fallback
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchInitialData = async () => {
      try {
        let liveData: any = null;

        // Step 1: Check live server endpoint
        if (!liveData || typeof liveData !== 'object' || Object.keys(liveData).length === 0) {
          try {
            const res = await fetch('/api/live-data', { cache: 'no-store' });
            if (res.ok) {
              liveData = await res.json();
            }
          } catch (_apiErr) {
            void _apiErr;
          }
        }

        if (!liveData || typeof liveData !== 'object' || Object.keys(liveData).length === 0) {
          try {
            const res = await fetch('/api/sync-to-code', { cache: 'no-store' });
            if (res.ok) {
              liveData = await res.json();
            }
          } catch (_apiErr2) {
            void _apiErr2;
          }
        }

        // Step 2: Fetch directly from live GitHub CDN / API if local server is empty or offline (for visitors)
        if (!liveData || typeof liveData !== 'object' || Object.keys(liveData).length === 0) {
          try {
            const ghRes = await fetchDataFromGitHub(githubConfig);
            if (ghRes.success && ghRes.data) {
              liveData = ghRes.data;
              if (isMounted && ghRes.sha) {
                setGithubConfig((prev) => ({
                  ...prev,
                  lastSyncedAt: ghRes.lastUpdated || new Date().toISOString(),
                  lastCommitSha: ghRes.sha || prev.lastCommitSha
                }));
              }
            }
          } catch (_ghErr) {
            void _ghErr;
          }
        }

        // Step 3: Fallback to static public/liveData.json
        if (!liveData || typeof liveData !== 'object' || Object.keys(liveData).length === 0) {
          try {
            const fallbackRes = await fetch('/liveData.json', { cache: 'no-store' });
            if (fallbackRes.ok) {
              liveData = await fallbackRes.json();
            }
          } catch (_fbErr) {
            void _fbErr;
          }
        }

        if (isMounted && liveData && typeof liveData === 'object' && Object.keys(liveData).length > 0) {
          applyDatabaseSnapshot(liveData);
          if (liveData.ihas_github_config) {
            const incomingGh = liveData.ihas_github_config;
            const token = (incomingGh.token && incomingGh.token.trim()) ? incomingGh.token.trim() : getStoredGitHubToken();
            safeSetIfChanged(setGithubConfig, { ...incomingGh, token });
          }
          if (liveData._updatedAt || liveData._meta?.lastSavedAt) {
            setCodeSyncLastSaved(liveData._updatedAt || liveData._meta?.lastSavedAt);
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
            // Unrecognized or private topics: do not thrash state
            break;
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
        reloadAllFromStorage,
        isCodeSyncing,
        codeSyncStatus,
        codeSyncLastSaved,
        saveAllToCodebase,
        markLocalEdit
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
