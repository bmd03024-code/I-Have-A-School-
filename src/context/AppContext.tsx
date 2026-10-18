import React, { createContext, useContext, useState, useEffect } from 'react';
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
  Notice 
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
  NOTICES as DEFAULT_NOTICES 
} from '../data/mockData';

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
  deleteHeroSlide: (id: string) => void;

  // Courses
  courses: Course[];
  addCourse: (course: Course) => void;
  deleteCourse: (id: string) => void;

  // Students & Admission
  students: Student[];
  addStudent: (student: Student) => void;
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
  deleteTeacher: (id: string) => void;

  // Videos, Notes & Notices
  videoClasses: VideoClass[];
  addVideoClass: (video: VideoClass) => void;
  deleteVideoClass: (id: string) => void;
  notes: NoteResource[];
  addNote: (note: NoteResource) => void;
  deleteNote: (id: string) => void;
  notices: Notice[];
  addNotice: (notice: Notice) => void;
  deleteNotice: (id: string) => void;

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
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Language: Default to 'bn' as requested by the user, togglable to 'en'
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
      return next;
    });
  };

  const deleteHeroSlide = (id: string) => {
    setHeroSlides((prev) => {
      const next = prev.filter((s) => s.id !== id);
      localStorage.setItem('ihas_hero_slides', JSON.stringify(next));
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
      return next;
    });
  };

  const deleteCourse = (id: string) => {
    setCourses((prev) => {
      const next = prev.filter((c) => c.id !== id);
      localStorage.setItem('ihas_courses', JSON.stringify(next));
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
      return next;
    });
  };

  const deleteStudent = (id: string) => {
    setStudents((prev) => {
      const next = prev.filter((s) => s.id !== id);
      localStorage.setItem('ihas_students', JSON.stringify(next));
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
      return next;
    });
  };

  const deleteSubject = (id: string) => {
    setSubjects((prev) => {
      const next = prev.filter((s) => s.id !== id);
      localStorage.setItem('ihas_subjects', JSON.stringify(next));
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
      return next;
    });
  };

  const deleteExam = (id: string) => {
    setExams((prev) => {
      const next = prev.filter((e) => e.id !== id);
      localStorage.setItem('ihas_exams', JSON.stringify(next));
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
      return next;
    });
  };

  const deleteResult = (id: string) => {
    setResults((prev) => {
      const next = prev.filter((r) => r.id !== id);
      localStorage.setItem('ihas_results', JSON.stringify(next));
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
      return next;
    });
  };

  const deleteTeacher = (id: string) => {
    setTeachers((prev) => {
      const next = prev.filter((t) => t.id !== id);
      localStorage.setItem('ihas_teachers', JSON.stringify(next));
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
      return next;
    });
  };

  const deleteVideoClass = (id: string) => {
    setVideoClasses((prev) => {
      const next = prev.filter((v) => v.id !== id);
      localStorage.setItem('ihas_videos', JSON.stringify(next));
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
      return next;
    });
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => {
      const next = prev.filter((n) => n.id !== id);
      localStorage.setItem('ihas_notes', JSON.stringify(next));
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
      return next;
    });
  };

  const deleteNotice = (id: string) => {
    setNotices((prev) => {
      const next = prev.filter((nt) => nt.id !== id);
      localStorage.setItem('ihas_notices', JSON.stringify(next));
      return next;
    });
  };

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

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

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
        deleteHeroSlide,
        courses,
        addCourse,
        deleteCourse,
        students,
        addStudent,
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
        deleteTeacher,
        videoClasses,
        addVideoClass,
        deleteVideoClass,
        notes,
        addNote,
        deleteNote,
        notices,
        addNotice,
        deleteNotice,
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
        setIsCalcOpen
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

