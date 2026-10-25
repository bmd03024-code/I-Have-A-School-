import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  LogOut, 
  Plus, 
  Trash2, 
  Edit3, 
  Printer, 
  Upload, 
  CheckCircle2, 
  Calendar, 
  Search, 
  FileText, 
  Image as ImageIcon, 
  BookOpen, 
  Users, 
  Award, 
  Layers, 
  GraduationCap, 
  Video, 
  Bell, 
  Settings, 
  Save, 
  Bot, 
  Cloud, 
  Key,
  X,
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Youtube,
  Send,
  MessageCircle,
  ExternalLink,
  RotateCcw,
  GitBranch,
  Zap,
  RefreshCw,
  Database
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DEFAULT_SCHOOL_SETTINGS, getStoredGitHubToken } from '../data/mockData';
import { cleanGitHubToken } from '../services/githubSyncService';
import { 
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
import { readFileAsDataUrl } from '../lib/storageService';
import { TeacherIdCardModal } from '../components/admin/TeacherIdCardModal';
import { PrintableResultSheet } from '../components/admin/PrintableResultSheet';
import { QuizManagementTab } from '../components/admin/QuizManagementTab';
import { ChatbotTrainingTab } from '../components/admin/ChatbotTrainingTab';
import { GitHubSyncTab } from '../components/admin/GitHubSyncTab';
import { RoutineManagementTab } from '../components/admin/RoutineManagementTab';
import { DictionaryManagementTab } from '../components/admin/DictionaryManagementTab';
import { 
  EditSlideModal, 
  EditCourseModal, 
  EditStudentModal, 
  EditTeacherModal,
  EditVideoClassModal
} from '../components/admin/AdminModals';
import { extractYouTubeId, resolveAutoThumbnail, detectVideoPlatform } from '../services/videoService';

export const AdminPanel: React.FC = () => {
  const {
    lang,
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
    isCodeSyncing,
    codeSyncStatus,
    codeSyncLastSaved,
    saveAllToCodebase,
    markLocalEdit,
    showToast
  } = useApp();

  const handleSaveAllToCodebase = async () => {
    const res = await saveAllToCodebase();
    showToast(res.message);
  };

  const handleManualPushToGitHub = async () => {
    const res = await pushToGitHub('Admin finalized all edits and manually pushed to GitHub');
    if (res.success) {
      showToast(
        lang === 'bn'
          ? 'গিটহাবে ৩টি ফাইল সফলভাবে পুশ সম্পন্ন হয়েছে! Vercel স্বয়ংক্রিয়ভাবে লাইভ রিডিপ্লয় হচ্ছে।'
          : 'All changes successfully pushed to GitHub! Vercel auto-deploy initiated.'
      );
    } else {
      showToast(
        lang === 'bn'
          ? `গিটহাব পুশ ব্যর্থ হয়েছে: ${res.error || 'অনুগ্রহ করে টোকেন ও রিপোজিটরি পারমিশন চেক করুন'}`
          : `Push failed: ${res.error || 'Please check GitHub token and repo permissions'}`
      );
    }
  };

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    | 'settings' 
    | 'slides' 
    | 'courses' 
    | 'students' 
    | 'subjects_exams' 
    | 'results' 
    | 'teachers' 
    | 'classes' 
    | 'notes' 
    | 'notices' 
    | 'routines' 
    | 'chatbot_training' 
    | 'dictionary' 
    | 'quizzes' 
    | 'code_sync'
    | 'github_sync'
    | 'security'
  >('settings');

  // Modal States
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [idCardTeacher, setIdCardTeacher] = useState<Teacher | null>(null);
  const [showPrintResultSheet, setShowPrintResultSheet] = useState(false);

  // Editing Note & Notice Inline/Modal
  const [editingNote, setEditingNote] = useState<NoteResource | null>(null);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [editingVideoClass, setEditingVideoClass] = useState<VideoClass | null>(null);

  // Change Password State
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Settings form state with Auto-Save
  const [settingsForm, setSettingsForm] = useState(schoolSettings);
  const [autoSaveStatus, setAutoSaveStatus] = useState<string>('');
  const [isSavingSettings, setIsSavingSettings] = useState<boolean>(false);
  const lastSavedSettingsRef = useRef<string>(JSON.stringify(schoolSettings));
  const isEditingSettingsRef = useRef<boolean>(false);

  // Sync settingsForm with external schoolSettings updates ONLY when not actively editing and values differ
  useEffect(() => {
    const incomingJson = JSON.stringify(schoolSettings);
    if (incomingJson !== lastSavedSettingsRef.current && !isEditingSettingsRef.current) {
      lastSavedSettingsRef.current = incomingJson;
      setSettingsForm(schoolSettings);
    }
  }, [schoolSettings]);

  // Automatic Auto-Save for Settings Form (saves directly without manual submit, debounced)
  useEffect(() => {
    const currentJson = JSON.stringify(settingsForm);
    if (currentJson === lastSavedSettingsRef.current) {
      isEditingSettingsRef.current = false;
      return;
    }
    isEditingSettingsRef.current = true;
    const timer = setTimeout(() => {
      lastSavedSettingsRef.current = currentJson;
      markLocalEdit();
      updateSchoolSettings(settingsForm);
      isEditingSettingsRef.current = false;
      setAutoSaveStatus(lang === 'bn' ? 'লোকাল সেভ সম্পন্ন' : 'Saved Locally');
      setTimeout(() => setAutoSaveStatus(''), 2500);
    }, 600);

    return () => clearTimeout(timer);
  }, [settingsForm, updateSchoolSettings, markLocalEdit, lang]);

  // Footer Learning Hub and Services Link Management States
  const [newLearningTitleBn, setNewLearningTitleBn] = useState('');
  const [newLearningTitleEn, setNewLearningTitleEn] = useState('');
  const [newLearningUrl, setNewLearningUrl] = useState('');
  const [editingLearningLink, setEditingLearningLink] = useState<{ id: string; titleBn: string; titleEn: string; url: string } | null>(null);

  const [newServiceTitleBn, setNewServiceTitleBn] = useState('');
  const [newServiceTitleEn, setNewServiceTitleEn] = useState('');
  const [newServiceUrl, setNewServiceUrl] = useState('');
  const [editingServiceLink, setEditingServiceLink] = useState<{ id: string; titleBn: string; titleEn: string; url: string } | null>(null);

  const handleAddLearningLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLearningTitleBn.trim() || !newLearningUrl.trim()) {
      showToast(lang === 'bn' ? 'শিরোনাম ও লিংক আবশ্যক!' : 'Title and URL are required!');
      return;
    }
    const current = settingsForm.learningHubLinks || [];
    const newLink = {
      id: `lh-${Date.now()}`,
      titleBn: newLearningTitleBn.trim(),
      titleEn: newLearningTitleEn.trim() || newLearningTitleBn.trim(),
      url: newLearningUrl.trim()
    };
    const updated = {
      ...settingsForm,
      learningHubLinks: [...current, newLink]
    };
    setSettingsForm(updated);
    updateSchoolSettings(updated);
    setNewLearningTitleBn('');
    setNewLearningTitleEn('');
    setNewLearningUrl('');
    showToast(lang === 'bn' ? 'নতুন লার্নিং হাব লিংক যুক্ত হয়েছে!' : 'Learning Hub link added!');
  };

  const handleUpdateLearningLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLearningLink || !editingLearningLink.titleBn.trim() || !editingLearningLink.url.trim()) {
      showToast(lang === 'bn' ? 'শিরোনাম ও লিংক আবশ্যক!' : 'Title and URL are required!');
      return;
    }
    const current = settingsForm.learningHubLinks || [];
    const updated = {
      ...settingsForm,
      learningHubLinks: current.map((l) => (l.id === editingLearningLink.id ? editingLearningLink : l))
    };
    setSettingsForm(updated);
    updateSchoolSettings(updated);
    setEditingLearningLink(null);
    showToast(lang === 'bn' ? 'লার্নিং হাব লিংক আপডেট সম্পন্ন হয়েছে!' : 'Learning Hub link updated!');
  };

  const handleDeleteLearningLink = (id: string) => {
    const current = settingsForm.learningHubLinks || [];
    const updated = {
      ...settingsForm,
      learningHubLinks: current.filter((l) => l.id !== id)
    };
    setSettingsForm(updated);
    updateSchoolSettings(updated);
    showToast(lang === 'bn' ? 'লার্নিং হাব লিংক মুছে ফেলা হয়েছে!' : 'Learning Hub link removed!');
  };

  const handleAddServiceLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceTitleBn.trim() || !newServiceUrl.trim()) {
      showToast(lang === 'bn' ? 'শিরোনাম ও লিংক আবশ্যক!' : 'Title and URL are required!');
      return;
    }
    const current = settingsForm.servicesLinks || [];
    const newLink = {
      id: `srv-${Date.now()}`,
      titleBn: newServiceTitleBn.trim(),
      titleEn: newServiceTitleEn.trim() || newServiceTitleBn.trim(),
      url: newServiceUrl.trim()
    };
    const updated = {
      ...settingsForm,
      servicesLinks: [...current, newLink]
    };
    setSettingsForm(updated);
    updateSchoolSettings(updated);
    setNewServiceTitleBn('');
    setNewServiceTitleEn('');
    setNewServiceUrl('');
    showToast(lang === 'bn' ? 'নতুন সার্ভিস লিংক যুক্ত হয়েছে!' : 'Service link added!');
  };

  const handleUpdateServiceLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingServiceLink || !editingServiceLink.titleBn.trim() || !editingServiceLink.url.trim()) {
      showToast(lang === 'bn' ? 'শিরোনাম ও লিংক আবশ্যক!' : 'Title and URL are required!');
      return;
    }
    const current = settingsForm.servicesLinks || [];
    const updated = {
      ...settingsForm,
      servicesLinks: current.map((s) => (s.id === editingServiceLink.id ? editingServiceLink : s))
    };
    setSettingsForm(updated);
    updateSchoolSettings(updated);
    setEditingServiceLink(null);
    showToast(lang === 'bn' ? 'সার্ভিস লিংক আপডেট সম্পন্ন হয়েছে!' : 'Service link updated!');
  };

  const handleDeleteServiceLink = (id: string) => {
    const current = settingsForm.servicesLinks || [];
    const updated = {
      ...settingsForm,
      servicesLinks: current.filter((l) => l.id !== id)
    };
    setSettingsForm(updated);
    updateSchoolSettings(updated);
    showToast(lang === 'bn' ? 'সার্ভিস লিংক মুছে ফেলা হয়েছে!' : 'Service link removed!');
  };

  const handleResetDefaultLearningLinks = () => {
    const defaultLinks = DEFAULT_SCHOOL_SETTINGS.learningHubLinks || [];
    const updated = {
      ...settingsForm,
      learningHubLinks: defaultLinks
    };
    setSettingsForm(updated);
    updateSchoolSettings(updated);
    showToast(lang === 'bn' ? 'ডিফল্ট লার্নিং হাব লিঙ্কসমূহ ফিরিয়ে আনা হয়েছে!' : 'Default Learning Hub links restored!');
  };

  const handleResetDefaultServicesLinks = () => {
    const defaultLinks = DEFAULT_SCHOOL_SETTINGS.servicesLinks || [];
    const updated = {
      ...settingsForm,
      servicesLinks: defaultLinks
    };
    setSettingsForm(updated);
    updateSchoolSettings(updated);
    showToast(lang === 'bn' ? 'ডিফল্ট প্রয়োজনীয় সার্ভিস লিঙ্কসমূহ ফিরিয়ে আনা হয়েছে!' : 'Default academic services links restored!');
  };

  // 1. New Slide Form State (Image Upload instead of URL)
  const [newSlideTitleBn, setNewSlideTitleBn] = useState('');
  const [newSlideTitleEn, setNewSlideTitleEn] = useState('');
  const [newSlideSubtitleBn, setNewSlideSubtitleBn] = useState('');
  const [newSlideSubtitleEn, setNewSlideSubtitleEn] = useState('');
  const [newSlideImage, setNewSlideImage] = useState('');
  const [newSlideButtonTextBn, setNewSlideButtonTextBn] = useState('কোর্সগুলো দেখুন');
  const [newSlideButtonTextEn, setNewSlideButtonTextEn] = useState('Explore Courses');
  const [newSlideButtonUrl, setNewSlideButtonUrl] = useState('/courses');

  // 2. New Course Form State (Logo/Banner Upload instead of URL)
  const [newCourseTitleBn, setNewCourseTitleBn] = useState('');
  const [newCourseTitleEn, setNewCourseTitleEn] = useState('');
  const [newCourseSubtitleBn, setNewCourseSubtitleBn] = useState('');
  const [newCourseSubtitleEn, setNewCourseSubtitleEn] = useState('');
  const [newCoursePrice, setNewCoursePrice] = useState(1500);
  const [newCourseOriginalPrice, setNewCourseOriginalPrice] = useState(2500);
  const [newCourseCategory, setNewCourseCategory] = useState<any>('HSC & SSC');
  const [newCourseLevel, setNewCourseLevel] = useState<any>('All Levels');
  const [newCourseDurationBn, setNewCourseDurationBn] = useState('৩ মাস (২৪টি লাইভ ক্লাস)');
  const [newCourseDurationEn, setNewCourseDurationEn] = useState('3 Months (24 Live Classes)');
  const [newCourseBanner, setNewCourseBanner] = useState('');
  const [newCourseDescBn, setNewCourseDescBn] = useState('');
  const [newCourseDescEn, setNewCourseDescEn] = useState('');

  // 3. Student Filter & New Student Form State (Photo Upload)
  const [studentFilterYear, setStudentFilterYear] = useState('all');
  const [studentFilterCourse, setStudentFilterCourse] = useState('all');
  const [newStudent, setNewStudent] = useState<Partial<Student>>({
    academicYear: '2026',
    courseId: courses[0]?.id || 'course-1',
    roll: '',
    nameEn: '',
    nameBn: '',
    fatherNameEn: '',
    fatherNameBn: '',
    motherNameEn: '',
    motherNameBn: '',
    address: '',
    phone: '',
    admissionDate: new Date().toISOString().split('T')[0],
    photoUrl: ''
  });

  // 4. Subjects & Exams State
  const [selectedCourseForSetup, setSelectedCourseForSetup] = useState(courses[0]?.id || 'course-1');
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectFullMarks, setNewSubjectFullMarks] = useState(100);
  const [newSubjectPassMarks, setNewSubjectPassMarks] = useState(40);
  const [newExamName, setNewExamName] = useState('');
  const [newExamType, setNewExamType] = useState('Term Exam');
  const [newExamDate, setNewExamDate] = useState(new Date().toISOString().split('T')[0]);

  // 5. Results Entry & Filter State
  const [resYear, setResYear] = useState('2026');
  const [resCourseId, setResCourseId] = useState(courses[0]?.id || 'course-1');
  const [resExamId, setResExamId] = useState(exams[0]?.id || 'exam-1');
  const [resRoll, setResRoll] = useState('');
  const [resSubjectMarks, setResSubjectMarks] = useState<Record<string, number>>({});

  // 6. New Teacher Form State (Photo Upload, Mobile, Address)
  const [newTeacherNameBn, setNewTeacherNameBn] = useState('');
  const [newTeacherNameEn, setNewTeacherNameEn] = useState('');
  const [newTeacherDesigBn, setNewTeacherDesigBn] = useState('সহকারী শিক্ষক (ইংরেজি)');
  const [newTeacherDesigEn, setNewTeacherDesigEn] = useState('Assistant Teacher (English)');
  const [newTeacherQual, setNewTeacherQual] = useState('B.A (Hons), M.A in English');
  const [newTeacherPhone, setNewTeacherPhone] = useState('+880 1');
  const [newTeacherEmail, setNewTeacherEmail] = useState('');
  const [newTeacherAddress, setNewTeacherAddress] = useState('');
  const [newTeacherPhoto, setNewTeacherPhoto] = useState('');
  const [newTeacherIsHeadmaster, setNewTeacherIsHeadmaster] = useState(false);

  // 7. Video Class State (Direct Video File Upload OR YouTube / Facebook / TikTok URL)
  const [newVideoTitleBn, setNewVideoTitleBn] = useState('');
  const [newVideoTitleEn, setNewVideoTitleEn] = useState('');
  const [newVideoDescBn, setNewVideoDescBn] = useState('');
  const [newVideoCategory, setNewVideoCategory] = useState<any>('Grammar Hacks');
  const [newVideoDuration, setNewVideoDuration] = useState('18:45');
  const [newVideoPlatform, setNewVideoPlatform] = useState<'youtube' | 'facebook' | 'tiktok' | 'uploaded'>('youtube');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newVideoFile, setNewVideoFile] = useState('');
  const [newVideoThumb, setNewVideoThumb] = useState('');
  const [deletingVideoId, setDeletingVideoId] = useState<string | null>(null);
  const [isAutoFetchingThumb, setIsAutoFetchingThumb] = useState(false);

  // 8. Notes & Sheets State (Direct Image & PDF Upload)
  const [newNoteTitleBn, setNewNoteTitleBn] = useState('');
  const [newNoteTitleEn, setNewNoteTitleEn] = useState('');
  const [newNoteSubject, setNewNoteSubject] = useState('English 2nd Paper');
  const [newNoteCategory, setNewNoteCategory] = useState<any>('Handwritten Notes');
  const [newNotePages, setNewNotePages] = useState(12);
  const [newNoteDescBn, setNewNoteDescBn] = useState('');
  const [newNoteFileUrl, setNewNoteFileUrl] = useState('');
  const [newNoteFileType, setNewNoteFileType] = useState<'pdf' | 'image' | 'link'>('pdf');

  // 9. Notices State (Direct Image & PDF Upload)
  const [newNoticeTitleBn, setNewNoticeTitleBn] = useState('');
  const [newNoticeTitleEn, setNewNoticeTitleEn] = useState('');
  const [newNoticeCategory, setNewNoticeCategory] = useState<any>('Admission');
  const [newNoticeContentBn, setNewNoticeContentBn] = useState('');
  const [newNoticeContentEn, setNewNoticeContentEn] = useState('');
  const [newNoticeImageUrl, setNewNoticeImageUrl] = useState('');
  const [newNoticePdfUrl, setNewNoticePdfUrl] = useState('');
  const [newNoticeIsPinned, setNewNoticeIsPinned] = useState(false);

  // Student auto-lookup for result entry
  const autoStudent = students.find(
    (s: Student) => s.roll === resRoll && s.academicYear === resYear && s.courseId === resCourseId
  );
  const currentCourseSubjects = subjects.filter((s: CourseSubject) => s.courseId === resCourseId);

  // Auto-logout: When leaving or exiting the Admin Panel, automatically log out
  useEffect(() => {
    const handleBeforeUnload = () => {
      logoutAdmin();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pagehide', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pagehide', handleBeforeUnload);
      logoutAdmin();
    };
  }, [logoutAdmin]);

  // Login handler
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAdmin(loginEmail, loginPassword);
    if (!success) {
      setLoginError(lang === 'bn' ? 'ভুল ইমেইল বা পাসওয়ার্ড!' : 'Invalid credentials!');
    } else {
      setLoginError('');
      setLoginPassword('');
      showToast(lang === 'bn' ? 'লগইন সফল হয়েছে!' : 'Logged in successfully!');
    }
  };

  // Generic File Upload Handlers (Reading to Data URL with canvas compression)
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void, msg?: string) => {
    const target = e.target;
    const file = target.files?.[0];
    if (file) {
      try {
        const dataUrl = await readFileAsDataUrl(file);
        setter(dataUrl);
        showToast(msg || (lang === 'bn' ? 'ফাইল সফলভাবে আপলোড হয়েছে!' : 'File uploaded successfully!'));
      } catch (err) {
        console.error('File upload error:', err);
        showToast(lang === 'bn' ? 'ফাইল আপলোড করতে সমস্যা হয়েছে।' : 'Error uploading file.');
      } finally {
        target.value = '';
      }
    }
  };

  // Dedicated Instant & Authoritative Upload Handlers for Branding Assets
  const handleLogoUpload = async (newLogoUrl: string) => {
    isEditingSettingsRef.current = true;
    markLocalEdit();
    const updated = { ...settingsForm, logoUrl: newLogoUrl };
    setSettingsForm(updated);
    lastSavedSettingsRef.current = JSON.stringify(updated);
    updateSchoolSettings(updated, true);
    await saveAllToCodebase({ ihas_school_settings: updated }).catch(() => {});

    // If GitHub Token is available, push immediately to GitHub repository
    const activeToken = cleanGitHubToken((githubConfig.token && githubConfig.token.trim()) || getStoredGitHubToken());
    if (activeToken && githubConfig.owner && githubConfig.repo) {
      pushToGitHub('Updated school logo from Admin Panel').catch(() => {});
    }

    isEditingSettingsRef.current = false;
    showToast(lang === 'bn' ? 'লোগো সফলভাবে পরিবর্তিত ও চূড়ান্ত হিসেবে সংরক্ষিত হয়েছে!' : 'Logo updated and saved as final!');
  };

  const handleSignatureUpload = async (newSigUrl: string) => {
    isEditingSettingsRef.current = true;
    markLocalEdit();
    const updated = { ...settingsForm, headmasterSignatureUrl: newSigUrl };
    setSettingsForm(updated);
    lastSavedSettingsRef.current = JSON.stringify(updated);
    updateSchoolSettings(updated, true);
    await saveAllToCodebase({ ihas_school_settings: updated }).catch(() => {});

    // If GitHub Token is available, push immediately to GitHub repository
    const activeToken = cleanGitHubToken((githubConfig.token && githubConfig.token.trim()) || getStoredGitHubToken());
    if (activeToken && githubConfig.owner && githubConfig.repo) {
      pushToGitHub('Updated headmaster signature from Admin Panel').catch(() => {});
    }

    isEditingSettingsRef.current = false;
    showToast(lang === 'bn' ? 'প্রধান শিক্ষকের স্বাক্ষর সফলভাবে সংরক্ষিত হয়েছে!' : 'Signature updated and saved as final!');
  };

  const handleSealUpload = async (newSealUrl: string) => {
    isEditingSettingsRef.current = true;
    markLocalEdit();
    const updated = { ...settingsForm, officialSealUrl: newSealUrl };
    setSettingsForm(updated);
    lastSavedSettingsRef.current = JSON.stringify(updated);
    updateSchoolSettings(updated, true);
    await saveAllToCodebase({ ihas_school_settings: updated }).catch(() => {});

    // If GitHub Token is available, push immediately to GitHub repository
    const activeToken = cleanGitHubToken((githubConfig.token && githubConfig.token.trim()) || getStoredGitHubToken());
    if (activeToken && githubConfig.owner && githubConfig.repo) {
      pushToGitHub('Updated official seal from Admin Panel').catch(() => {});
    }

    isEditingSettingsRef.current = false;
    showToast(lang === 'bn' ? 'অফিসিয়াল সিল সফলভাবে সংরক্ষিত হয়েছে!' : 'Official seal updated and saved as final!');
  };

  // Save Settings
  const handleSaveSettings = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSavingSettings(true);
    markLocalEdit();
    try {
      const currentForm = { ...settingsForm };
      lastSavedSettingsRef.current = JSON.stringify(currentForm);
      isEditingSettingsRef.current = false;

      // 1. Force update school settings in AppContext and localStorage
      updateSchoolSettings(currentForm, true);

      // 2. Persist directly to codebase liveData files
      const res = await saveAllToCodebase({ ihas_school_settings: currentForm });

      // 3. If GitHub Token is configured, also push to GitHub live repository
      const activeToken = cleanGitHubToken((githubConfig.token && githubConfig.token.trim()) || getStoredGitHubToken());
      let livePushNotice = '';
      if (activeToken && githubConfig.owner && githubConfig.repo) {
        try {
          const pushRes = await pushToGitHub('Updated school settings and branding');
          if (pushRes.success) {
            livePushNotice = lang === 'bn' ? ' এবং গিটহাবে লাইভ পাবলিশ সম্পন্ন হয়েছে ✓' : ' and published live to GitHub ✓';
          }
        } catch (pushErr) {
          console.warn('Auto-push on save settings error:', pushErr);
        }
      }

      showToast(
        (res.message || (lang === 'bn' ? 'প্রতিষ্ঠান সেটিংস, লোগো, সিল ও স্বাক্ষর সফলভাবে সংরক্ষিত হয়েছে!' : 'Settings, logo, seal, and signature saved successfully!')) +
        livePushNotice
      );
    } catch (err: any) {
      showToast(lang === 'bn' ? `সংরক্ষণ ত্রুটি: ${err?.message || 'সমস্যা হয়েছে'}` : 'Failed to save settings.');
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Add Slide
  const handleAddSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlideTitleBn.trim() || !newSlideImage) {
      showToast(lang === 'bn' ? 'স্লাইডের শিরোনাম ও ছবি আপলোড আবশ্যক!' : 'Title and image are required!');
      return;
    }
    const slide: HeroSlide = {
      id: `slide-${Date.now()}`,
      titleBn: newSlideTitleBn.trim(),
      titleEn: newSlideTitleEn.trim() || newSlideTitleBn.trim(),
      subtitleBn: newSlideSubtitleBn.trim(),
      subtitleEn: newSlideSubtitleEn.trim(),
      imageUrl: newSlideImage,
      buttonTextBn: newSlideButtonTextBn,
      buttonTextEn: newSlideButtonTextEn,
      buttonUrl: newSlideButtonUrl,
      active: true
    };
    addHeroSlide(slide);
    setNewSlideTitleBn('');
    setNewSlideTitleEn('');
    setNewSlideSubtitleBn('');
    setNewSlideSubtitleEn('');
    setNewSlideImage('');
    showToast(lang === 'bn' ? 'নতুন স্লাইড সফলভাবে যোগ হয়েছে!' : 'Hero slide added!');
  };

  // Add Course
  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseTitleBn.trim() || !newCourseBanner) {
      showToast(lang === 'bn' ? 'কোর্সের নাম ও ব্যানার ইমেজ আপলোড আবশ্যক!' : 'Course title and banner are required!');
      return;
    }
    const course: Course = {
      id: `course-${Date.now()}`,
      titleBn: newCourseTitleBn.trim(),
      titleEn: newCourseTitleEn.trim() || newCourseTitleBn.trim(),
      subtitleBn: newCourseSubtitleBn.trim(),
      subtitleEn: newCourseSubtitleEn.trim(),
      category: newCourseCategory,
      level: newCourseLevel,
      durationBn: newCourseDurationBn,
      durationEn: newCourseDurationEn,
      lecturesCount: 24,
      price: Number(newCoursePrice),
      originalPrice: Number(newCourseOriginalPrice),
      bannerImage: newCourseBanner,
      descriptionBn: newCourseDescBn,
      descriptionEn: newCourseDescEn,
      syllabus: [
        { week: 'Week 1', topics: ['Orientation & Fundamentals', 'Grammar Diagnostic Test'] },
        { week: 'Week 2', topics: ['Right Forms of Verbs Mastery', 'Sentence Patterns'] }
      ],
      featuresBn: ['লাইভ ক্লাস ও প্রশ্নোত্তর', 'হাতে লেখা রঙিন লেকচার শিট', 'প্রতি সপ্তাহে মডেল টেস্ট'],
      featuresEn: ['Live interactive sessions', 'Colored handwritten notes', 'Weekly assessment exams'],
      instructor: {
        name: 'MD Touhidul Hoque Tuhin',
        designation: 'Founder & English Specialist',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=240&auto=format&fit=crop'
      }
    };
    addCourse(course);
    setNewCourseTitleBn('');
    setNewCourseTitleEn('');
    setNewCourseSubtitleBn('');
    setNewCourseSubtitleEn('');
    setNewCourseBanner('');
    setNewCourseDescBn('');
    showToast(lang === 'bn' ? 'নতুন কোর্স সফলভাবে যোগ হয়েছে!' : 'New course added!');
  };

  // Add Student
  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.roll || !newStudent.nameBn) {
      showToast(lang === 'bn' ? 'রোল এবং শিক্ষার্থীর নাম আবশ্যক!' : 'Roll and name are required!');
      return;
    }
    const student: Student = {
      id: `st-${Date.now()}`,
      academicYear: newStudent.academicYear || '2026',
      courseId: newStudent.courseId || courses[0]?.id || 'course-1',
      roll: newStudent.roll.trim(),
      nameEn: newStudent.nameEn?.trim() || newStudent.nameBn?.trim() || '',
      nameBn: newStudent.nameBn.trim(),
      fatherNameEn: newStudent.fatherNameEn || '',
      fatherNameBn: newStudent.fatherNameBn || '',
      motherNameEn: newStudent.motherNameEn || '',
      motherNameBn: newStudent.motherNameBn || '',
      address: newStudent.address || '',
      phone: newStudent.phone || '',
      admissionDate: newStudent.admissionDate || new Date().toISOString().split('T')[0],
      photoUrl: newStudent.photoUrl || ''
    };
    addStudent(student);
    setNewStudent({
      ...newStudent,
      roll: '',
      nameEn: '',
      nameBn: '',
      fatherNameEn: '',
      fatherNameBn: '',
      motherNameEn: '',
      motherNameBn: '',
      phone: '',
      address: '',
      photoUrl: ''
    });
    showToast(lang === 'bn' ? 'শিক্ষার্থী সফলভাবে তালিকাভুক্ত হয়েছে!' : 'Student enrolled into database!');
  };

  // Add Subject
  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjectName.trim()) return;
    addSubject({
      id: `sub-${Date.now()}`,
      courseId: selectedCourseForSetup,
      name: newSubjectName.trim(),
      fullMarks: Number(newSubjectFullMarks),
      passMarks: Number(newSubjectPassMarks)
    });
    setNewSubjectName('');
    showToast(lang === 'bn' ? 'বিষয় যুক্ত হয়েছে!' : 'Subject added!');
  };

  // Add Exam
  const handleAddExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExamName.trim()) return;
    addExam({
      id: `exam-${Date.now()}`,
      courseId: selectedCourseForSetup,
      name: newExamName.trim(),
      examType: newExamType,
      date: newExamDate
    });
    setNewExamName('');
    showToast(lang === 'bn' ? 'পরীক্ষা যুক্ত হয়েছে!' : 'Exam added!');
  };

  // Save Result
  const handleSaveResult = (e: React.FormEvent) => {
    e.preventDefault();
    if (!autoStudent) {
      showToast(lang === 'bn' ? 'প্রথমে সঠিক রোল নম্বর দিন!' : 'Please enter a valid student roll number!');
      return;
    }

    let totalMarks = 0;
    let totalFull = 0;

    currentCourseSubjects.forEach((sub: CourseSubject) => {
      const mark = Number(resSubjectMarks[sub.id]) || 0;
      totalMarks += mark;
      totalFull += sub.fullMarks;
    });

    const percentage = totalFull > 0 ? (totalMarks / totalFull) * 100 : 0;
    let gpa = 0.0;
    let grade = 'F';

    if (percentage >= 80) { gpa = 5.0; grade = 'A+'; }
    else if (percentage >= 70) { gpa = 4.0; grade = 'A'; }
    else if (percentage >= 60) { gpa = 3.5; grade = 'A-'; }
    else if (percentage >= 50) { gpa = 3.0; grade = 'B'; }
    else if (percentage >= 40) { gpa = 2.0; grade = 'C'; }
    else if (percentage >= 33) { gpa = 1.0; grade = 'D'; }

    const resultObj: StudentResult = {
      id: `res-${Date.now()}`,
      academicYear: resYear,
      courseId: resCourseId,
      examId: resExamId,
      studentRoll: autoStudent.roll,
      subjectMarks: resSubjectMarks,
      totalMarks,
      totalFullMarks: totalFull,
      percentage,
      gpa,
      grade,
      createdDate: new Date().toISOString().split('T')[0]
    };

    addResult(resultObj);
    setResRoll('');
    setResSubjectMarks({});
    showToast(lang === 'bn' ? 'ফলাফল সংরক্ষিত ও মার্কশিট জেনারেট হয়েছে!' : 'Result saved and marksheet generated!');
  };

  // Add Teacher
  const handleAddTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacherNameBn.trim()) {
      showToast(lang === 'bn' ? 'শিক্ষকের নাম আবশ্যক!' : 'Teacher name is required!');
      return;
    }
    const tch: Teacher = {
      id: `tch-${Date.now()}`,
      nameBn: newTeacherNameBn.trim(),
      nameEn: newTeacherNameEn.trim() || newTeacherNameBn.trim(),
      designationBn: newTeacherDesigBn.trim(),
      designationEn: newTeacherDesigEn.trim(),
      qualification: newTeacherQual.trim(),
      phone: newTeacherPhone.trim(),
      email: newTeacherEmail.trim() || 'teacher@school.com',
      address: newTeacherAddress.trim(),
      photoUrl: newTeacherPhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=240&auto=format&fit=crop',
      isHeadmaster: newTeacherIsHeadmaster
    };
    addTeacher(tch);
    setNewTeacherNameBn('');
    setNewTeacherNameEn('');
    setNewTeacherPhone('+880 1');
    setNewTeacherAddress('');
    setNewTeacherPhoto('');
    showToast(lang === 'bn' ? 'শিক্ষক সফলভাবে যুক্ত হয়েছেন!' : 'Teacher profile added!');
  };

  // Video URL Change: Auto-extract YouTube or Facebook thumbnail
  const handleVideoUrlChange = async (url: string) => {
    setNewVideoUrl(url);
    if (!url.trim()) return;

    const detected = detectVideoPlatform(url);
    setNewVideoPlatform(detected);

    // If user hasn't uploaded a custom image file, auto-set thumbnail
    if (!newVideoThumb || !newVideoThumb.startsWith('data:image')) {
      const res = await resolveAutoThumbnail(url, detected);
      if (res.url) {
        setNewVideoThumb(res.url);
      }
    }
  };

  // Direct Thumbnail Image Upload from local device
  const handleCustomVideoThumbUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    const file = target.files?.[0];
    if (file) {
      try {
        const dataUrl = await readFileAsDataUrl(file);
        setNewVideoThumb(dataUrl);
        showToast(lang === 'bn' ? 'থাম্বনেইল ছবি সফলভাবে আপলোড হয়েছে!' : 'Custom thumbnail uploaded!');
      } catch {
        showToast(lang === 'bn' ? 'ছবি আপলোড করতে সমস্যা হয়েছে।' : 'Error uploading thumbnail.');
      } finally {
        target.value = '';
      }
    }
  };

  // Manual Trigger to auto-fetch thumbnail from YouTube or Facebook
  const handleManualAutoFetchThumb = async () => {
    if (!newVideoUrl.trim()) {
      showToast(lang === 'bn' ? 'প্রথমে ইউটিউব বা ফেসবুক ভিডিওর লিঙ্ক দিন!' : 'Please enter video URL first!');
      return;
    }
    setIsAutoFetchingThumb(true);
    try {
      const res = await resolveAutoThumbnail(newVideoUrl, newVideoPlatform);
      setNewVideoThumb(res.url);
      if (res.platform !== 'custom') {
        setNewVideoPlatform(res.platform);
      }
      showToast(lang === 'bn' ? 'লিঙ্ক থেকে থাম্বনেইল আনা হয়েছে!' : 'Thumbnail extracted from link!');
    } finally {
      setIsAutoFetchingThumb(false);
    }
  };

  // Delete Video Class with immediate feedback and toast
  const handleDeleteVideoClass = (id: string, title?: string) => {
    deleteVideoClass(id);
    setDeletingVideoId(null);
    showToast(
      lang === 'bn' 
        ? `"${title || 'ক্লাস'}" সফলভাবে ডিলিট করা হয়েছে!` 
        : `Video class deleted successfully!`
    );
    if (githubConfig.enabled && githubConfig.autoPushOnChange && githubConfig.token) {
      pushToGitHub('Deleted video: ' + (title || id)).catch(() => {});
    }
  };

  // Add Video Class
  const handleAddVideoClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideoTitleBn.trim()) {
      showToast(lang === 'bn' ? 'ভিডিও শিরোনাম দিন!' : 'Please enter title!');
      return;
    }

    let finalThumb = newVideoThumb;
    const ytId = extractYouTubeId(newVideoUrl) || 'dQw4w9WgXcQ';

    if (!finalThumb) {
      const resolved = await resolveAutoThumbnail(newVideoUrl, newVideoPlatform);
      finalThumb = resolved.url;
    }

    const vid: VideoClass = {
      id: `vid-${Date.now()}`,
      titleBn: newVideoTitleBn.trim(),
      titleEn: newVideoTitleEn.trim() || newVideoTitleBn.trim(),
      descriptionBn: newVideoDescBn.trim() || 'তুহিন স্যারের বিশেষ ফ্রি ক্লাস।',
      descriptionEn: newVideoDescBn.trim() || 'Exclusive free video lecture by Tuhin Sir.',
      category: newVideoCategory,
      duration: newVideoDuration || '18:45',
      youtubeId: ytId,
      videoUrl: newVideoUrl,
      videoPlatform: newVideoPlatform,
      videoFileUrl: newVideoFile,
      thumbnailUrl: finalThumb || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop',
      views: '1.2K',
      publishedDate: 'Just now',
      level: 'All Levels'
    };

    addVideoClass(vid);
    setNewVideoTitleBn('');
    setNewVideoTitleEn('');
    setNewVideoDescBn('');
    setNewVideoUrl('');
    setNewVideoFile('');
    setNewVideoThumb('');
    showToast(lang === 'bn' ? 'ফ্রি ক্লাস সফলভাবে যুক্ত হয়েছে!' : 'Video class added successfully!');
    if (githubConfig.enabled && githubConfig.autoPushOnChange && githubConfig.token) {
      pushToGitHub('Added video: ' + vid.titleBn).catch(() => {});
    }
  };

  // Add Note
  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteTitleBn.trim() || !newNoteFileUrl) {
      showToast(lang === 'bn' ? 'নোটের শিরোনাম ও ফাইল আপলোড আবশ্যক!' : 'Title and file are required!');
      return;
    }
    const note: NoteResource = {
      id: `note-${Date.now()}`,
      titleBn: newNoteTitleBn.trim(),
      titleEn: newNoteTitleEn.trim() || newNoteTitleBn.trim(),
      subject: newNoteSubject,
      category: newNoteCategory,
      pages: Number(newNotePages),
      fileSize: '4.2 MB',
      downloads: 0,
      date: new Date().toLocaleDateString('en-GB'),
      descriptionBn: newNoteDescBn,
      descriptionEn: newNoteDescBn,
      fileUrl: newNoteFileUrl,
      fileType: newNoteFileType,
      tags: ['Handwritten', 'Exclusive'],
      sampleContent: ['Chapter Overview', 'Golden Rules']
    };
    addNote(note);
    setNewNoteTitleBn('');
    setNewNoteTitleEn('');
    setNewNoteFileUrl('');
    setNewNoteDescBn('');
    showToast(lang === 'bn' ? 'নোটস ও শিট যুক্ত হয়েছে!' : 'Note uploaded!');
  };

  // Add Notice
  const handleAddNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoticeTitleBn.trim() || !newNoticeContentBn.trim()) {
      showToast(lang === 'bn' ? 'নোটিশের শিরোনাম ও বিবরণ আবশ্যক!' : 'Notice title and details are required!');
      return;
    }
    const nt: Notice = {
      id: `not-${Date.now()}`,
      titleBn: newNoticeTitleBn.trim(),
      titleEn: newNoticeTitleEn.trim() || newNoticeTitleBn.trim(),
      category: newNoticeCategory,
      date: new Date().toLocaleDateString('en-GB'),
      contentBn: newNoticeContentBn.trim(),
      contentEn: newNoticeContentEn.trim() || newNoticeContentBn.trim(),
      imageUrl: newNoticeImageUrl,
      pdfUrl: newNoticePdfUrl,
      isPinned: newNoticeIsPinned
    };
    addNotice(nt);
    setNewNoticeTitleBn('');
    setNewNoticeTitleEn('');
    setNewNoticeContentBn('');
    setNewNoticeContentEn('');
    setNewNoticeImageUrl('');
    setNewNoticePdfUrl('');
    showToast(lang === 'bn' ? 'অফিশিয়াল নোটিশ প্রকাশ করা হয়েছে!' : 'Notice published!');
  };

  // If not logged in, render the secure Login screen
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 bg-slate-900 text-slate-100">
        <div className="bg-slate-800/90 border border-slate-700 rounded-3xl max-w-md w-full p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center mx-auto shadow-lg">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-white">
              {lang === 'bn' ? 'অ্যাডমিন সিকিউরিটি লগইন' : 'Admin Security Login'}
            </h2>
            <p className="text-xs text-slate-400">
              {lang === 'bn' ? 'আই হ্যাভ এ স্কুল ম্যানেজমেন্ট ড্যাশবোর্ড' : 'I Have A School Portal Authentication'}
            </p>
          </div>

          {loginError && (
            <div className="bg-rose-500/20 border border-rose-500/40 text-rose-300 p-3 rounded-xl text-xs text-center">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                {lang === 'bn' ? 'অ্যাডমিন ইমেইল / ইউজার আইডি' : 'Admin Email / ID'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder={lang === 'bn' ? 'আপনার জিমেইল টাইপ করুন...' : 'Type admin email...'}
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-3 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                {lang === 'bn' ? 'সিক্রেট পাসওয়ার্ড (টাইপ করুন)' : 'Password (Type to Login)'}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder={lang === 'bn' ? 'আপনার পাসওয়ার্ড টাইপ করুন...' : 'Type password...'}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none tracking-widest"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                {lang === 'bn' ? '* শুধুমাত্র সঠিক জিমেইল ও পাসওয়ার্ড টাইপ করে প্রবেশ করতে হবে।' : '* Only valid typed credentials can authenticate into dashboard.'}
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm rounded-xl transition-all shadow-md mt-2 flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{lang === 'bn' ? 'লগইন করুন' : 'Authenticate & Enter'}</span>
            </button>
          </form>

          {/* Return to Website Button (এই ওয়েবসাইটে ফিরে যান) */}
          <div className="pt-2 border-t border-slate-700/60">
            <Link
              to="/"
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'bn' ? 'এই ওয়েবসাইটে ফিরে যান' : 'Return to Website'}</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Filtered Students List
  const filteredStudents = students.filter((s: Student) => {
    const matchYear = studentFilterYear === 'all' || s.academicYear === studentFilterYear;
    const matchCourse = studentFilterCourse === 'all' || s.courseId === studentFilterCourse;
    return matchYear && matchCourse;
  });

  return (
    <div className="min-h-screen bg-slate-100/70 pb-16">
      {/* Modals for Edit and Print */}
      {editingSlide && (
        <EditSlideModal
          slide={editingSlide}
          lang={lang}
          onSave={updateHeroSlide}
          onClose={() => setEditingSlide(null)}
        />
      )}

      {editingCourse && (
        <EditCourseModal
          course={editingCourse}
          lang={lang}
          onSave={updateCourse}
          onClose={() => setEditingCourse(null)}
        />
      )}

      {editingStudent && (
        <EditStudentModal
          student={editingStudent}
          courses={courses}
          lang={lang}
          onSave={updateStudent}
          onClose={() => setEditingStudent(null)}
        />
      )}

      {editingTeacher && (
        <EditTeacherModal
          teacher={editingTeacher}
          lang={lang}
          onSave={updateTeacher}
          onClose={() => setEditingTeacher(null)}
        />
      )}

      {idCardTeacher && (
        <TeacherIdCardModal
          teacher={idCardTeacher}
          schoolSettings={schoolSettings}
          lang={lang}
          onClose={() => setIdCardTeacher(null)}
        />
      )}

      {showPrintResultSheet && (
        <PrintableResultSheet
          results={results}
          students={students}
          courses={courses}
          subjects={subjects}
          exams={exams}
          academicYear={resYear}
          selectedCourseId={resCourseId}
          selectedExamId={resExamId}
          schoolSettings={schoolSettings}
          lang={lang}
          onClose={() => setShowPrintResultSheet(false)}
        />
      )}

      {/* Top Admin Bar */}
      <div className="bg-slate-900 text-white border-b border-slate-800 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="bg-emerald-600 text-white text-[11px] font-black px-2.5 py-0.5 rounded uppercase tracking-wider">
              ADMIN CONTROL PANEL
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">
              Logged in as: <strong className="text-emerald-400">{adminCredentials.email}</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* GitHub Token & Manual Push Mode Badge */}
            <button
              type="button"
              onClick={() => setActiveTab('github_sync')}
              className={`flex items-center gap-1.5 px-3 py-1.5 border text-xs font-semibold rounded-xl shadow-xs transition-all ${
                isGitHubSyncing
                  ? 'bg-amber-950/80 border-amber-500/60 text-amber-300 hover:bg-amber-900/80 animate-pulse'
                  : githubConfig.token
                  ? 'bg-slate-800 border-emerald-500/40 text-emerald-300 hover:bg-slate-750'
                  : 'bg-rose-950/80 border-rose-500/40 text-rose-300 hover:bg-rose-900/80'
              }`}
              title="GitHub Manual Push Mode Status"
            >
              <GitBranch className={`w-3.5 h-3.5 ${isGitHubSyncing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{lang === 'bn' ? 'গিটহাব মোড:' : 'GitHub:'}</span>
              <span className="font-mono text-[11px]">
                {isGitHubSyncing
                  ? (lang === 'bn' ? 'পুশ হচ্ছে...' : 'Pushing...')
                  : githubConfig.token
                  ? (lang === 'bn' ? 'ম্যানুয়াল পুশ প্রস্তুত ✓' : 'Manual Push Ready ✓')
                  : (lang === 'bn' ? 'টোকেন দিন !' : 'Token Required !')}
              </span>
              <span className={`w-2 h-2 rounded-full ${isGitHubSyncing ? 'bg-amber-400 animate-ping' : githubConfig.token ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400 animate-ping'}`} />
            </button>

            {/* Standout GitHub Manual Push Button (Only pushes when clicked) */}
            <button
              type="button"
              onClick={handleManualPushToGitHub}
              disabled={isGitHubSyncing}
              className="flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 disabled:opacity-50 text-white text-xs font-black rounded-xl transition-all shadow-md active:scale-95 border border-emerald-400/50"
              title={lang === 'bn' ? 'সম্পূর্ণ পরিবর্তন হয়ে গেলে গিটহাবে পুশ করতে এখানে ক্লিক করুন' : 'Click to push all finalized changes to GitHub'}
            >
              <Zap className={`w-3.5 h-3.5 text-amber-300 ${isGitHubSyncing ? 'animate-bounce' : ''}`} />
              <span>
                {isGitHubSyncing 
                  ? (lang === 'bn' ? 'গিটহাবে পুশ হচ্ছে...' : 'Pushing to GitHub...') 
                  : (lang === 'bn' ? '🚀 গিটহাবে পুশ করুন' : '🚀 Push to GitHub')}
              </span>
            </button>

            {/* Real-Time Codebase Auto-Sync Status Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold rounded-xl shadow-xs">
              <span className={`w-2 h-2 rounded-full ${codeSyncStatus === 'saving' ? 'bg-amber-400 animate-ping' : 'bg-emerald-400 animate-pulse'}`} />
              <span className="hidden sm:inline">
                {lang === 'bn' ? 'কোডে অটো-পরিবর্তন: ' : 'Auto-Sync to Code: '}
              </span>
              <span className="font-mono text-[11px] text-emerald-200">
                {codeSyncStatus === 'saving'
                  ? (lang === 'bn' ? 'অটো-সংরক্ষণ হচ্ছে...' : 'Auto-saving...')
                  : (lang === 'bn' ? 'স্বয়ংক্রিয় সংরক্ষিত ✓' : 'Auto-Saved ✓')}
              </span>
            </div>

            {/* Master Codebase Save Button */}
            <button
              type="button"
              onClick={handleSaveAllToCodebase}
              disabled={isCodeSyncing}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-95 border border-emerald-400/40"
              title={lang === 'bn' ? 'অ্যাডমিনের সকল পরিবর্তন সরাসরি কোডিং ফাইলে (src/data/liveData.json & public/liveData.json) চূড়ান্ত হিসেবে সংরক্ষণ করুন' : 'Save all admin changes authoritatively to codebase files'}
            >
              <Save className={`w-3.5 h-3.5 ${isCodeSyncing ? 'animate-spin' : ''}`} />
              <span>
                {isCodeSyncing 
                  ? (lang === 'bn' ? 'কোডে সেভ হচ্ছে...' : 'Saving to Code...') 
                  : (lang === 'bn' ? 'কোডে ম্যানুয়াল ফোর্স সেভ' : 'Force Save to Code')}
              </span>
            </button>

            {/* Auto-Save Active Indicator & View Website Button (No cache clearing in admin) */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 rounded-lg text-xs font-semibold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{lang === 'bn' ? 'অটো সেভ সক্রিয়' : 'Auto-Save Active'}</span>
            </div>

            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white text-xs font-bold rounded-lg border border-slate-700 transition-all shadow-xs"
              title={lang === 'bn' ? 'ওয়েবসাইটে পরিবর্তনগুলো সরাসরি দেখুন' : 'View live website'}
            >
              <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">{lang === 'bn' ? 'লাইভ ওয়েবসাইট' : 'Live Website'}</span>
            </Link>

            <button
              onClick={() => setActiveTab('security')}
              className="text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>{lang === 'bn' ? 'পাসওয়ার্ড পরিবর্তন' : 'Change Password'}</span>
            </button>

            <button
              onClick={logoutAdmin}
              className="px-3 py-1.5 bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-bold rounded-lg flex items-center gap-1 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'লগআউট' : 'Logout'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-1.5 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs">
          {[
            { id: 'settings', label: lang === 'bn' ? 'লোগো ও প্রতিষ্ঠান' : 'Branding & Logo', icon: Settings },
            { id: 'slides', label: lang === 'bn' ? '১. হিরো স্লাইডার' : '1. Hero Slider', icon: ImageIcon },
            { id: 'courses', label: lang === 'bn' ? '২. কোর্স কন্ট্রোল' : '2. Courses', icon: BookOpen },
            { id: 'students', label: lang === 'bn' ? '৩. শিক্ষার্থী তালিকা' : '3. Student Roster', icon: Users },
            { id: 'results', label: lang === 'bn' ? '৪. ফলাফল ও প্রিন্ট' : '4. Results & Print', icon: Award },
            { id: 'teachers', label: lang === 'bn' ? '৫. শিক্ষক ও সিল/স্বাক্ষর' : '5. Teachers & Seals', icon: GraduationCap },
            { id: 'classes', label: lang === 'bn' ? '৬. ফ্রি ক্লাস' : '6. Free Classes', icon: Video },
            { id: 'notes', label: lang === 'bn' ? '৭. নোটস ও শিট' : '7. Notes & PDFs', icon: FileText },
            { id: 'notices', label: lang === 'bn' ? '৭. নোটিশ বোর্ড' : '7. Notices', icon: Bell },
            { id: 'chatbot_training', label: lang === 'bn' ? '৮. চ্যাটবট ট্রেনিং' : '8. Chatbot Training', icon: Bot },
            { id: 'dictionary', label: lang === 'bn' ? '৯. ডিকশনারি কন্ট্রোল' : '9. Dictionary', icon: BookOpen },
            { id: 'routines', label: lang === 'bn' ? '১০. রুটিন সেকশন' : '10. Routine', icon: Calendar },
            { id: 'quizzes', label: lang === 'bn' ? 'কুইজ মেনেজমেন্ট' : 'Quiz Management', icon: Layers },
            { id: 'github_sync', label: lang === 'bn' ? '১১. গিটহাব টোকেন ও অটো-পাবলিশ' : '11. GitHub Token & Auto-Publish', icon: GitBranch },
            { id: 'code_sync', label: lang === 'bn' ? '⚡ কোডিং ডেটাবেজ (চূড়ান্ত)' : '⚡ Codebase Database', icon: Database },
            { id: 'security', label: lang === 'bn' ? 'সিকিউরিটি' : 'Security', icon: Lock }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                  activeTab === tab.id
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ==================== TAB 1: INSTITUTION & FOOTER SETTINGS ==================== */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-8">
            <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                  {lang === 'bn' ? '১ নম্বর কন্ট্রোল প্যানেল' : 'OPTION 1 CONTROL PANEL'}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                  {lang === 'bn' ? 'প্রতিষ্ঠান, ব্র্যান্ডিং ও সম্পূর্ণ ফুটার কন্ট্রোল' : 'Institution Branding & Complete Footer Control'}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {lang === 'bn'
                    ? 'এখানে পরিবর্তিত প্রতিটি তথ্য (ফুটারের লেখা, লোগো, ফেসবুক/ইউটিউব/মেসেঞ্জার লিংক, লার্নিং হাব, সার্ভিস ও যোগাযোগ) তাৎক্ষণিকভাবে লাইভ ওয়েবসাইটে আপডেট হবে।'
                    : 'All footer texts, logos, social links, learning hub shortcuts, services, and contacts update live on the website.'}
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                {autoSaveStatus && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-xl animate-in fade-in">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{autoSaveStatus}</span>
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  disabled={isSavingSettings}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 shrink-0"
                >
                  {isSavingSettings ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>{lang === 'bn' ? 'সংরক্ষণ হচ্ছে...' : 'Saving...'}</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>{lang === 'bn' ? 'সকল পরিবর্তন সংরক্ষণ করুন' : 'Save All Changes'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Auto-Save Active & Protected Data Card */}
            <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border border-emerald-500/40 text-white p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 shrink-0 shadow-inner">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-sm sm:text-base text-white">
                      {lang === 'bn' ? 'অ্যাডমিন প্যানেল অটো-সেভ সক্রিয় (ক্যাশ সংরক্ষিত)' : 'Admin Auto-Save Active (Zero Cache Reset)'}
                    </span>
                    <span className="px-2.5 py-0.5 text-[10px] font-black rounded-full bg-emerald-400 text-slate-950 uppercase tracking-wider flex items-center gap-1 shadow-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-pulse" />
                      {lang === 'bn' ? 'অটো-সেভ চালু' : 'AUTO-SAVED'}
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-emerald-100/90 mt-1 max-w-2xl leading-relaxed">
                    {lang === 'bn'
                      ? 'অ্যাডমিন প্যানেলে যেকোনো পরিবর্তন স্বয়ংক্রিয়ভাবে সেভ হয়ে যায় এবং কখনো ক্যাশ ক্লিয়ার হবে না। আর যে কেউ ওয়েবসাইট ওপেন করলে স্বয়ংক্রিয়ভাবে ওয়েবসাইটের ক্যাশ পরিবর্তন হয়ে অ্যাডমিনের নতুন পরিবর্তন দেখতে পাবে।'
                      : 'Every admin edit is automatically saved and protected against cache wipe. Public visitors viewing the website will automatically bypass cache and view the fresh changes.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  to="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4 text-slate-950" />
                  <span>{lang === 'bn' ? 'লাইভ ওয়েবসাইট দেখুন' : 'View on Website'}</span>
                </Link>
              </div>
            </div>

            {/* Quick GitHub Live Sync Card */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400 shrink-0">
                  <GitBranch className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">
                      {lang === 'bn' ? 'গিটহাব এপিআই ও লাইভ সিঙ্ক' : 'GitHub API & Live Sync'}
                    </span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                      githubConfig.token
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {githubConfig.token
                        ? (lang === 'bn' ? 'লাইভ সিঙ্ক চালু' : 'Live Sync ON')
                        : (lang === 'bn' ? 'টোকেন সেটআপ প্রয়োজন' : 'Setup Required')}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    {lang === 'bn'
                      ? 'অ্যাডমিনের পরিবর্তনসমূহ সরাসরি গিটহাবে পুশ করে সকল ব্রাউজারে রিয়েল-টাইম আপডেট সক্রিয় রাখুন।'
                      : 'Sync all admin updates directly to GitHub to update all visitor browsers in real-time.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveTab('github_sync')}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-xl border border-slate-700 text-slate-200 transition-colors flex items-center gap-1.5"
                >
                  <Settings className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{lang === 'bn' ? 'গিটহাব এপিআই অপশন' : 'GitHub API Option'}</span>
                </button>

                {githubConfig.token && (
                  <button
                    type="button"
                    onClick={handleManualPushToGitHub}
                    disabled={isGitHubSyncing}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-xs font-bold rounded-xl text-white transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-300" />
                    <span>{isGitHubSyncing ? (lang === 'bn' ? 'গিটহাবে পুশ হচ্ছে...' : 'Pushing...') : (lang === 'bn' ? '🚀 গিটহাবে পুশ করুন' : '🚀 Push to GitHub')}</span>
                  </button>
                )}
              </div>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-8 text-xs">
              {/* SECTION A: Brand Name & Slogan */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200/80 pb-2">
                  <GraduationCap className="w-4 h-4 text-emerald-600" />
                  <span>{lang === 'bn' ? 'ক. প্রতিষ্ঠানের নাম, ব্র্যান্ডিং ও স্লোগান' : 'A. Institution Name & Tagline'}</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {lang === 'bn' ? 'প্রতিষ্ঠানের নাম (বাংলা)' : 'Institute Name (Bengali)'}
                    </label>
                    <input
                      type="text"
                      required
                      value={settingsForm.instituteNameBn}
                      onChange={(e) => setSettingsForm({ ...settingsForm, instituteNameBn: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {lang === 'bn' ? 'প্রতিষ্ঠানের নাম (English)' : 'Institute Name (English)'}
                    </label>
                    <input
                      type="text"
                      required
                      value={settingsForm.instituteNameEn}
                      onChange={(e) => setSettingsForm({ ...settingsForm, instituteNameEn: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {lang === 'bn' ? 'ট্যাগলাইন / স্লোগান (বাংলা)' : 'Tagline / Slogan (Bengali)'}
                    </label>
                    <input
                      type="text"
                      value={settingsForm.taglineBn || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, taglineBn: e.target.value })}
                      placeholder="যেমন: শিখুন, এগিয়ে যান, সফল হোন • এমডি তৌহিদুল হক তুহিন"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {lang === 'bn' ? 'ট্যাগলাইন / স্লোগান (English)' : 'Tagline / Slogan (English)'}
                    </label>
                    <input
                      type="text"
                      value={settingsForm.taglineEn || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, taglineEn: e.target.value })}
                      placeholder="e.g. Learn, Grow, Succeed • By MD Touhidul Hoque Tuhin"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {lang === 'bn' ? 'প্রতিষ্ঠাতা ও পরিচালক নাম (বাংলা)' : 'Founder & Director Name (Bengali)'}
                    </label>
                    <input
                      type="text"
                      value={settingsForm.founderNameBn || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, founderNameBn: e.target.value })}
                      placeholder="যেমন: মো. তৌহিদুল হক তুহিন"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {lang === 'bn' ? 'প্রতিষ্ঠাতা ও পরিচালক নাম (English)' : 'Founder & Director Name (English)'}
                    </label>
                    <input
                      type="text"
                      value={settingsForm.founderNameEn || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, founderNameEn: e.target.value })}
                      placeholder="e.g. MD Touhidul Hoque Tuhin"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Uploads: Logo, Signature, Seal */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="p-3.5 border border-slate-200 rounded-xl bg-white space-y-2">
                    <span className="font-bold text-slate-800 block text-[11px]">
                      {lang === 'bn' ? 'লোগো সরাসরি আপলোড' : 'Upload Logo'}
                    </span>
                    <div className="flex items-center gap-3">
                      <label className="cursor-pointer px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{lang === 'bn' ? 'ফাইল বেছে নিন' : 'Choose File'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, handleLogoUpload)}
                          className="hidden"
                        />
                      </label>
                      {settingsForm.logoUrl && (
                        <img src={settingsForm.logoUrl} alt="Logo preview" className="w-10 h-10 object-contain rounded border bg-slate-50 p-1" />
                      )}
                    </div>
                  </div>

                  <div className="p-3.5 border border-emerald-200 rounded-xl bg-emerald-50/50 space-y-2">
                    <span className="font-bold text-emerald-900 block text-[11px]">
                      {lang === 'bn' ? 'প্রধান শিক্ষকের স্বাক্ষর' : 'Headmaster Signature'}
                    </span>
                    <div className="flex items-center gap-3">
                      <label className="cursor-pointer px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{lang === 'bn' ? 'স্বাক্ষর ফাইল নিন' : 'Choose Sign'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, handleSignatureUpload)}
                          className="hidden"
                        />
                      </label>
                      {settingsForm.headmasterSignatureUrl && (
                        <img src={settingsForm.headmasterSignatureUrl} alt="Signature preview" className="h-10 w-20 object-contain rounded border bg-white" />
                      )}
                    </div>
                  </div>

                  <div className="p-3.5 border border-emerald-200 rounded-xl bg-emerald-50/50 space-y-2">
                    <span className="font-bold text-emerald-900 block text-[11px]">
                      {lang === 'bn' ? 'অফিসিয়াল সিল আপলোড' : 'Official School Seal'}
                    </span>
                    <div className="flex items-center gap-3">
                      <label className="cursor-pointer px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{lang === 'bn' ? 'সিল ফাইল নিন' : 'Choose Seal'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, handleSealUpload)}
                          className="hidden"
                        />
                      </label>
                      {settingsForm.officialSealUrl && (
                        <img src={settingsForm.officialSealUrl} alt="Seal preview" className="w-10 h-10 object-contain rounded border bg-white" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION B: Footer Bio / Description */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200/80 pb-2">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span>{lang === 'bn' ? 'খ. ফুটারের পরিচিতি ও বিবরণী লেখা' : 'B. Footer Description Text'}</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {lang === 'bn' ? 'ফুটার বিবরণী টেক্সট (বাংলা)' : 'Footer Bio (Bengali)'}
                    </label>
                    <textarea
                      rows={3}
                      value={settingsForm.footerDescriptionBn || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, footerDescriptionBn: e.target.value })}
                      placeholder="এমডি তৌহিদুল হক তুহিন স্যারের শিক্ষামূলক প্ল্যাটফর্ম..."
                      className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs focus:border-emerald-500 focus:outline-none leading-relaxed"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {lang === 'bn' ? 'ফুটার বিবরণী টেক্সট (English)' : 'Footer Bio (English)'}
                    </label>
                    <textarea
                      rows={3}
                      value={settingsForm.footerDescriptionEn || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, footerDescriptionEn: e.target.value })}
                      placeholder="Educational mentorship initiative led by MD Touhidul Hoque Tuhin..."
                      className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs focus:border-emerald-500 focus:outline-none leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION C: Contact & Support (হটলাইন, হোয়াটসঅ্যাপ, ইমেইল, ঠিকানা) */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200/80 pb-2">
                  <Phone className="w-4 h-4 text-emerald-600" />
                  <span>{lang === 'bn' ? 'গ. যোগাযোগ ও সাপোর্ট এক্সেস (হটলাইন, হোয়াটসঅ্যাপ, ইমেইল, ঠিকানা)' : 'C. Contact & Support Details'}</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {lang === 'bn' ? 'হটলাইন নম্বর (কলের জন্য)' : 'Hotline Phone'}
                    </label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={settingsForm.phone}
                        onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-mono focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {lang === 'bn' ? 'হোয়াটসঅ্যাপ হেল্পলাইন নম্বর' : 'WhatsApp Number'}
                    </label>
                    <div className="relative">
                      <MessageCircle className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#25D366]" />
                      <input
                        type="text"
                        required
                        value={settingsForm.whatsapp}
                        onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp: e.target.value })}
                        placeholder="8801712345678"
                        className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-mono focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {lang === 'bn' ? 'অফিসিয়াল ইমেইল অ্যাড্রেস' : 'Official Email'}
                    </label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={settingsForm.email}
                        onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {lang === 'bn' ? 'প্রতিষ্ঠানের ঠিকানা (বাংলা)' : 'Physical Address (Bengali)'}
                    </label>
                    <div className="relative">
                      <MapPin className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                      <textarea
                        rows={2}
                        value={settingsForm.addressBn}
                        onChange={(e) => setSettingsForm({ ...settingsForm, addressBn: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {lang === 'bn' ? 'Physical Address (English)' : 'Physical Address (English)'}
                    </label>
                    <div className="relative">
                      <MapPin className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                      <textarea
                        rows={2}
                        value={settingsForm.addressEn}
                        onChange={(e) => setSettingsForm({ ...settingsForm, addressEn: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION D: Social Media & Messenger Links */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200/80 pb-2">
                  <Facebook className="w-4 h-4 text-emerald-600" />
                  <span>{lang === 'bn' ? 'ঘ. সোশ্যাল মিডিয়া ও মেসেঞ্জার লিঙ্কসমূহ' : 'D. Social Media & Messenger Links'}</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Facebook Link</label>
                    <div className="relative">
                      <Facebook className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-blue-600" />
                      <input
                        type="url"
                        value={settingsForm.facebookUrl}
                        onChange={(e) => setSettingsForm({ ...settingsForm, facebookUrl: e.target.value })}
                        placeholder="https://facebook.com/..."
                        className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">YouTube Channel Link</label>
                    <div className="relative">
                      <Youtube className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-red-600" />
                      <input
                        type="url"
                        value={settingsForm.youtubeUrl}
                        onChange={(e) => setSettingsForm({ ...settingsForm, youtubeUrl: e.target.value })}
                        placeholder="https://youtube.com/..."
                        className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Messenger Link</label>
                    <div className="relative">
                      <Send className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-blue-500" />
                      <input
                        type="url"
                        value={settingsForm.messengerUrl || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, messengerUrl: e.target.value })}
                        placeholder="https://m.me/yourpage"
                        className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Telegram Link</label>
                    <div className="relative">
                      <Send className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-sky-500" />
                      <input
                        type="url"
                        value={settingsForm.telegramUrl}
                        onChange={(e) => setSettingsForm({ ...settingsForm, telegramUrl: e.target.value })}
                        placeholder="https://t.me/yourgroup"
                        className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">TikTok Channel / Profile</label>
                    <div className="relative">
                      <svg className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 fill-current text-slate-800" viewBox="0 0 24 24">
                        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                      </svg>
                      <input
                        type="url"
                        value={settingsForm.tiktokUrl || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, tiktokUrl: e.target.value })}
                        placeholder="https://tiktok.com/@touhidulhoque.tuhin"
                        className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Save All Core Settings & Manual Push Action Buttons */}
              <div className="flex flex-wrap items-center justify-end gap-3 pt-1">
                <button
                  type="submit"
                  disabled={isSavingSettings}
                  className="px-7 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingSettings ? (lang === 'bn' ? 'সংরক্ষণ হচ্ছে...' : 'Saving...') : (lang === 'bn' ? 'প্রতিষ্ঠান ও যোগাযোগ তথ্য সংরক্ষণ করুন' : 'Save Core Information')}</span>
                </button>

                <button
                  type="button"
                  onClick={handleManualPushToGitHub}
                  disabled={isGitHubSyncing}
                  className="px-6 py-3 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-750 border border-slate-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                  title={lang === 'bn' ? 'সকল পরিবর্তন শেষে গিটহাবে পুশ করুন' : 'Push all finalized changes to GitHub'}
                >
                  <Zap className={`w-4 h-4 text-amber-400 ${isGitHubSyncing ? 'animate-bounce' : ''}`} />
                  <span>{isGitHubSyncing ? (lang === 'bn' ? 'গিটহাবে পুশ হচ্ছে...' : 'Pushing...') : (lang === 'bn' ? '🚀 সম্পূর্ণ পরিবর্তন শেষে গিটহাবে পুশ করুন' : '🚀 Push Final Changes to GitHub')}</span>
                </button>
              </div>
            </form>

            {/* SECTION E: Footer Learning Hub Shortcuts Management */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200/80 pb-2 gap-2">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-emerald-600" />
                    <span>{lang === 'bn' ? 'ঙ. ফুটার লার্নিং হাব শর্টকাট লিংক কাস্টমাইজেশন (যোগ, এডিট ও ডিলিট)' : 'E. Footer Learning Hub Shortcuts (Add, Edit, Delete)'}</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {lang === 'bn' ? 'লার্নিং হাবের প্রতিটি লিঙ্ক এডিট করুন অথবা নতুন শর্টকাট যুক্ত করুন।' : 'Edit existing links or add custom shortcuts for the learning hub.'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500 font-semibold bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                    {(settingsForm.learningHubLinks || []).length} {lang === 'bn' ? 'টি সক্রিয়' : 'Active'}
                  </span>
                  <button
                    type="button"
                    onClick={handleResetDefaultLearningLinks}
                    className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors"
                    title="Reset to default links"
                  >
                    <RotateCcw className="w-3 h-3 text-emerald-600" />
                    <span>{lang === 'bn' ? 'ডিফল্ট আনুন' : 'Reset Default'}</span>
                  </button>
                </div>
              </div>

              {/* Edit Learning Link Form (Inline when item is selected for editing) */}
              {editingLearningLink && (
                <form onSubmit={handleUpdateLearningLink} className="p-4 bg-emerald-50/80 rounded-xl border border-emerald-300 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                      <Edit3 className="w-3.5 h-3.5 text-emerald-600" />
                      {lang === 'bn' ? 'লার্নিং হাব লিংক সম্পাদনা / এডিট করুন' : 'Edit Learning Hub Link'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setEditingLearningLink(null)}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">{lang === 'bn' ? 'শিরোনাম (বাংলা)' : 'Title (Bengali)'}</label>
                      <input
                        type="text"
                        required
                        value={editingLearningLink.titleBn}
                        onChange={(e) => setEditingLearningLink({ ...editingLearningLink, titleBn: e.target.value })}
                        className="w-full bg-white border border-emerald-300 rounded-xl px-3 py-2 text-xs focus:border-emerald-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">{lang === 'bn' ? 'Title (English)' : 'Title (English)'}</label>
                      <input
                        type="text"
                        value={editingLearningLink.titleEn}
                        onChange={(e) => setEditingLearningLink({ ...editingLearningLink, titleEn: e.target.value })}
                        className="w-full bg-white border border-emerald-300 rounded-xl px-3 py-2 text-xs focus:border-emerald-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">{lang === 'bn' ? 'ইউআরএল বা রাউট পাথ' : 'URL or Route Path'}</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          required
                          value={editingLearningLink.url}
                          onChange={(e) => setEditingLearningLink({ ...editingLearningLink, url: e.target.value })}
                          className="w-full bg-white border border-emerald-300 rounded-xl px-3 py-2 text-xs font-mono focus:border-emerald-600 focus:outline-none"
                        />
                        <button
                          type="submit"
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0 flex items-center gap-1"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>{lang === 'bn' ? 'সংরক্ষণ' : 'Save'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              )}

              {/* Current List of Learning Hub Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {(settingsForm.learningHubLinks || []).map((link) => (
                  <div key={link.id} className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between shadow-2xs hover:border-emerald-300 transition-all">
                    <div className="overflow-hidden pr-2">
                      <span className="font-bold text-slate-800 text-xs block truncate">{link.titleBn}</span>
                      <span className="text-[10px] text-slate-400 block truncate">{link.titleEn} • <code className="text-emerald-600">{link.url}</code></span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => setEditingLearningLink(link)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                        title="Edit link"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteLearningLink(link.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete link"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Learning Hub Link Form */}
              <form onSubmit={handleAddLearningLink} className="p-4 bg-white rounded-xl border border-emerald-200/80 space-y-3">
                <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5" />
                  {lang === 'bn' ? 'নতুন লার্নিং হাব শর্টকাট লিংক যোগ করুন' : 'Add New Learning Hub Link'}
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    required
                    placeholder={lang === 'bn' ? 'শিরোনাম (বাংলা যেমন: স্পেশাল সাজেশন)' : 'Title (Bengali)'}
                    value={newLearningTitleBn}
                    onChange={(e) => setNewLearningTitleBn(e.target.value)}
                    className="border border-slate-200 rounded-xl px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder={lang === 'bn' ? 'Title (English যেমন: Suggestions)' : 'Title (English)'}
                    value={newLearningTitleEn}
                    onChange={(e) => setNewLearningTitleEn(e.target.value)}
                    className="border border-slate-200 rounded-xl px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none"
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      placeholder="/courses, /classes etc."
                      value={newLearningUrl}
                      onChange={(e) => setNewLearningUrl(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono focus:border-emerald-500 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0 flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{lang === 'bn' ? 'যোগ' : 'Add'}</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* SECTION F: Footer Important Services Shortcuts Management */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200/80 pb-2 gap-2">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Award className="w-4 h-4 text-teal-600" />
                    <span>{lang === 'bn' ? 'চ. ফুটার প্রয়োজনীয় সার্ভিস ও শর্টকাট কাস্টমাইজেশন (যোগ, এডিট ও ডিলিট)' : 'F. Footer Academic Services Shortcuts (Add, Edit, Delete)'}</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {lang === 'bn' ? 'ফুটারের প্রয়োজনীয় সার্ভিসের তালিকা নিজের ইচ্ছামতো সাজান, এডিট ও রিমুভ করুন।' : 'Customize, edit, and organize services displayed in the footer.'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500 font-semibold bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                    {(settingsForm.servicesLinks || []).length} {lang === 'bn' ? 'টি সক্রিয়' : 'Active'}
                  </span>
                  <button
                    type="button"
                    onClick={handleResetDefaultServicesLinks}
                    className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors"
                    title="Reset to default services"
                  >
                    <RotateCcw className="w-3 h-3 text-teal-600" />
                    <span>{lang === 'bn' ? 'ডিফল্ট আনুন' : 'Reset Default'}</span>
                  </button>
                </div>
              </div>

              {/* Edit Service Link Form (Inline when item is selected for editing) */}
              {editingServiceLink && (
                <form onSubmit={handleUpdateServiceLink} className="p-4 bg-teal-50/80 rounded-xl border border-teal-300 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-teal-900 flex items-center gap-1.5">
                      <Edit3 className="w-3.5 h-3.5 text-teal-600" />
                      {lang === 'bn' ? 'প্রয়োজনীয় সার্ভিস লিংক সম্পাদনা / এডিট করুন' : 'Edit Academic Service Link'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setEditingServiceLink(null)}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">{lang === 'bn' ? 'সার্ভিসের নাম (বাংলা)' : 'Service Name (Bengali)'}</label>
                      <input
                        type="text"
                        required
                        value={editingServiceLink.titleBn}
                        onChange={(e) => setEditingServiceLink({ ...editingServiceLink, titleBn: e.target.value })}
                        className="w-full bg-white border border-teal-300 rounded-xl px-3 py-2 text-xs focus:border-teal-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">{lang === 'bn' ? 'Title (English)' : 'Title (English)'}</label>
                      <input
                        type="text"
                        value={editingServiceLink.titleEn}
                        onChange={(e) => setEditingServiceLink({ ...editingServiceLink, titleEn: e.target.value })}
                        className="w-full bg-white border border-teal-300 rounded-xl px-3 py-2 text-xs focus:border-teal-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">{lang === 'bn' ? 'ইউআরএল বা রাউট পাথ' : 'URL or Route Path'}</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          required
                          value={editingServiceLink.url}
                          onChange={(e) => setEditingServiceLink({ ...editingServiceLink, url: e.target.value })}
                          className="w-full bg-white border border-teal-300 rounded-xl px-3 py-2 text-xs font-mono focus:border-teal-600 focus:outline-none"
                        />
                        <button
                          type="submit"
                          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0 flex items-center gap-1"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>{lang === 'bn' ? 'সংরক্ষণ' : 'Save'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              )}

              {/* Current List of Services Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {(settingsForm.servicesLinks || []).map((srv) => (
                  <div key={srv.id} className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between shadow-2xs hover:border-teal-300 transition-all">
                    <div className="overflow-hidden pr-2">
                      <span className="font-bold text-slate-800 text-xs block truncate">{srv.titleBn}</span>
                      <span className="text-[10px] text-slate-400 block truncate">{srv.titleEn} • <code className="text-teal-600">{srv.url}</code></span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => setEditingServiceLink(srv)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-colors"
                        title="Edit service"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteServiceLink(srv.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete service link"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Services Link Form */}
              <form onSubmit={handleAddServiceLink} className="p-4 bg-white rounded-xl border border-teal-200/80 space-y-3">
                <span className="text-xs font-bold text-teal-800 flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5" />
                  {lang === 'bn' ? 'নতুন প্রয়োজনীয় সার্ভিস শর্টকাট যোগ করুন' : 'Add New Service Shortcut'}
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    required
                    placeholder={lang === 'bn' ? 'সার্ভিসের নাম (যেমন: রেজাল্ট শিট)' : 'Service Title (Bengali)'}
                    value={newServiceTitleBn}
                    onChange={(e) => setNewServiceTitleBn(e.target.value)}
                    className="border border-slate-200 rounded-xl px-3 py-2 text-xs focus:border-teal-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder={lang === 'bn' ? 'Title (English যেমন: Results)' : 'Service Title (English)'}
                    value={newServiceTitleEn}
                    onChange={(e) => setNewServiceTitleEn(e.target.value)}
                    className="border border-slate-200 rounded-xl px-3 py-2 text-xs focus:border-teal-500 focus:outline-none"
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      placeholder="/results, /dictionary, #calc"
                      value={newServiceUrl}
                      onChange={(e) => setNewServiceUrl(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono focus:border-teal-500 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0 flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{lang === 'bn' ? 'যোগ' : 'Add'}</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ==================== TAB 1: HERO SLIDES (REQUIREMENT #1) ==================== */}
        {activeTab === 'slides' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">SECTION 1</span>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                  {lang === 'bn' ? 'হিরো স্লাইড সেকশন (ছবি আপলোড ও এডিট/ডিলিট)' : 'Hero Slider Management'}
                </h3>
                <p className="text-xs text-slate-500">
                  {lang === 'bn' ? 'নতুন স্লাইড যোগ করার সময় সরাসরি ছবি আপলোড করুন এবং প্রতিটি স্লাইড এডিট ও ডিলিট করুন।' : 'Upload direct images without URLs, edit and delete slides.'}
                </p>
              </div>

              <form onSubmit={handleAddSlide} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">স্লাইড শিরোনাম (বাংলা)</label>
                    <input
                      type="text"
                      required
                      placeholder="যেমন: তুহিন স্যারের সাথে সহজে ইংরেজি জয় করুন"
                      value={newSlideTitleBn}
                      onChange={(e) => setNewSlideTitleBn(e.target.value)}
                      className="w-full border rounded-xl px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Slide Title (English)</label>
                    <input
                      type="text"
                      placeholder="e.g. Master English with Tuhin Sir"
                      value={newSlideTitleEn}
                      onChange={(e) => setNewSlideTitleEn(e.target.value)}
                      className="w-full border rounded-xl px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">সাবটাইটেল (বাংলা)</label>
                    <input
                      type="text"
                      placeholder="যেমন: জিরো বেসিক থেকে এইচএসসি জিপিএ ৫.০০ ও বিসিএস প্রস্তুতি"
                      value={newSlideSubtitleBn}
                      onChange={(e) => setNewSlideSubtitleBn(e.target.value)}
                      className="w-full border rounded-xl px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Subtitle (English)</label>
                    <input
                      type="text"
                      placeholder="e.g. From fundamentals to academic GPA 5.00"
                      value={newSlideSubtitleEn}
                      onChange={(e) => setNewSlideSubtitleEn(e.target.value)}
                      className="w-full border rounded-xl px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* DIRECT IMAGE FILE UPLOAD */}
                <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-2xl space-y-2">
                  <label className="block font-bold text-emerald-950">
                    {lang === 'bn' ? 'স্লাইডের ছবি সরাসরি আপলোড করুন (কোনো ইউআরএল প্রয়োজন নেই)' : 'Direct Slide Image Upload (No URL required)'}
                  </label>
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <label className="cursor-pointer px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors shrink-0">
                      <Upload className="w-4 h-4" />
                      <span>{lang === 'bn' ? 'স্লাইডের ছবি নির্বাচন করুন' : 'Select Slide Image'}</span>
                      <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setNewSlideImage)} className="hidden" />
                    </label>

                    {newSlideImage ? (
                      <div className="flex items-center gap-3">
                        <img src={newSlideImage} alt="preview" className="w-20 h-12 object-cover rounded-xl border border-emerald-400" />
                        <span className="text-xs text-emerald-800 font-semibold">✓ ছবি আপলোড সম্পন্ন</span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic">কোনো ছবি নির্বাচন করা হয়নি</span>
                    )}
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4 text-emerald-400" />
                    <span>{lang === 'bn' ? 'নতুন স্লাইড প্রকাশ করুন' : 'Publish Slide'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Slides List with Edit & Delete */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {heroSlides.map((slide) => (
                <div key={slide.id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="aspect-video w-full rounded-xl overflow-hidden border border-slate-100 bg-slate-50">
                      <img src={slide.imageUrl} alt={slide.titleBn} className="w-full h-full object-cover" />
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">{slide.titleBn}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2">{slide.subtitleBn}</p>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                    <span className="text-[10px] text-slate-400 font-mono">ID: {slide.id}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setEditingSlide(slide)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1"
                      >
                        <Edit3 className="w-3 h-3 text-emerald-600" />
                        <span>{lang === 'bn' ? 'এডিট' : 'Edit'}</span>
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(lang === 'bn' ? 'আপনি কি এই স্লাইডটি মুছে ফেলতে চান?' : 'Delete this slide?')) {
                            deleteHeroSlide(slide.id);
                            showToast(lang === 'bn' ? 'স্লাইড মুছে ফেলা হয়েছে!' : 'Slide deleted!');
                          }
                        }}
                        className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>{lang === 'bn' ? 'ডিলিট' : 'Delete'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB 2: COURSE CONTROL (REQUIREMENT #2) ==================== */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">SECTION 2</span>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                  {lang === 'bn' ? 'কোর্স কন্ট্রোল সেকশন (লোগো/ব্যানার আপলোড ও এডিট)' : 'Course Control & Management'}
                </h3>
                <p className="text-xs text-slate-500">
                  {lang === 'bn' ? 'কোর্সের লোগো/ব্যানার সরাসরি আপলোড করুন, মূল্য (টাকা) ও তথ্য নির্ধারণ করুন।' : 'Upload course logo/banner directly, manage fees, edit and delete.'}
                </p>
              </div>

              <form onSubmit={handleAddCourse} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">কোর্সের নাম (বাংলা)</label>
                    <input
                      type="text"
                      required
                      placeholder="যেমন: এইচএসসি ২০২৬ ১ম ও ২য় পত্র পূর্ণাঙ্গ ব্যাচ"
                      value={newCourseTitleBn}
                      onChange={(e) => setNewCourseTitleBn(e.target.value)}
                      className="w-full border rounded-xl px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">কোর্স ফি / মূল্য (টাকা)</label>
                    <input
                      type="number"
                      required
                      value={newCoursePrice}
                      onChange={(e) => setNewCoursePrice(Number(e.target.value))}
                      className="w-full border rounded-xl px-3 py-2 text-xs font-mono font-bold focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">পূর্বের মূল্য (টাকা)</label>
                    <input
                      type="number"
                      value={newCourseOriginalPrice}
                      onChange={(e) => setNewCourseOriginalPrice(Number(e.target.value))}
                      className="w-full border rounded-xl px-3 py-2 text-xs font-mono focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">কোর্সের বিস্তারিত তথ্য</label>
                  <textarea
                    rows={2}
                    placeholder="কোর্সের সুবিধা, লেকচার সংখ্যা ও লক্ষ্য..."
                    value={newCourseDescBn}
                    onChange={(e) => setNewCourseDescBn(e.target.value)}
                    className="w-full border rounded-xl p-3 text-xs focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                {/* Direct Banner File Upload */}
                <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-2xl space-y-2">
                  <label className="block font-bold text-emerald-950">
                    {lang === 'bn' ? 'কোর্সের লোগো / ব্যানার ইমেজ সরাসরি আপলোড' : 'Direct Course Logo / Banner Upload'}
                  </label>
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <label className="cursor-pointer px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors shrink-0">
                      <Upload className="w-4 h-4" />
                      <span>{lang === 'bn' ? 'লোগো বা ব্যানার বেছে নিন' : 'Choose Course Banner'}</span>
                      <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setNewCourseBanner)} className="hidden" />
                    </label>

                    {newCourseBanner ? (
                      <div className="flex items-center gap-3">
                        <img src={newCourseBanner} alt="preview" className="w-20 h-12 object-cover rounded-xl border border-emerald-400" />
                        <span className="text-xs text-emerald-800 font-semibold">✓ ব্যানার লোড হয়েছে</span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic">কোনো ব্যানার নির্বাচন করা হয়নি</span>
                    )}
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4 text-emerald-400" />
                    <span>{lang === 'bn' ? 'নতুন কোর্স যোগ করুন' : 'Add Course'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Courses List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map((course) => (
                <div key={course.id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="aspect-video w-full rounded-xl overflow-hidden border border-slate-100 bg-slate-50">
                      <img src={course.bannerImage} alt={course.titleBn} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">{course.category}</span>
                      <span className="font-bold text-emerald-700 text-sm">৳{course.price}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm leading-snug">{course.titleBn}</h4>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                    <span className="text-[10px] text-slate-400 font-mono">ID: {course.id}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setEditingCourse(course)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1"
                      >
                        <Edit3 className="w-3 h-3 text-emerald-600" />
                        <span>{lang === 'bn' ? 'এডিট' : 'Edit'}</span>
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(lang === 'bn' ? 'আপনি কি এই কোর্সটি মুছে ফেলতে চান?' : 'Delete course?')) {
                            deleteCourse(course.id);
                            showToast(lang === 'bn' ? 'কোর্স মুছে ফেলা হয়েছে!' : 'Course deleted!');
                          }
                        }}
                        className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>{lang === 'bn' ? 'ডিলিট' : 'Delete'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB 3: STUDENT ROSTER (REQUIREMENT #3) ==================== */}
        {activeTab === 'students' && (
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">SECTION 3</span>
                  <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                    {lang === 'bn' ? 'শিক্ষার্থী তালিকা ও ব্যাচ ম্যানেজমেন্ট' : 'Student Roster & Batch Management'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {lang === 'bn' ? 'শিক্ষাবর্ষ ও কোর্স অনুযায়ী ফিল্টার করে শিক্ষার্থী তালিকা দেখুন, ছবি আপলোড করুন এবং এডিট/ডিলিট করুন।' : 'Filter by year and course, edit and delete records, upload student photos.'}
                  </p>
                </div>
              </div>

              {/* Year & Course Filter */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {lang === 'bn' ? 'শিক্ষাবর্ষ (Academic Year) ফিল্টার' : 'Academic Year Filter'}
                  </label>
                  <select
                    value={studentFilterYear}
                    onChange={(e) => setStudentFilterYear(e.target.value)}
                    className="w-full border rounded-xl px-3 py-2 text-xs bg-white font-semibold focus:outline-none"
                  >
                    <option value="all">All Academic Years (সকল শিক্ষাবর্ষ)</option>
                    <option value="2027">Year 2027</option>
                    <option value="2026">Year 2026</option>
                    <option value="2025">Year 2025</option>
                    <option value="2024">Year 2024</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {lang === 'bn' ? 'কোর্স (Course) ফিল্টার' : 'Course Filter'}
                  </label>
                  <select
                    value={studentFilterCourse}
                    onChange={(e) => setStudentFilterCourse(e.target.value)}
                    className="w-full border rounded-xl px-3 py-2 text-xs bg-white font-semibold focus:outline-none"
                  >
                    <option value="all">All Courses (সকল কোর্স)</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>{c.titleBn}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Add New Student Form (Includes Photo Upload) */}
              <div className="pt-2">
                <h4 className="font-bold text-slate-800 text-sm mb-3">
                  + {lang === 'bn' ? 'নতুন শিক্ষার্থী এন্ট্রি ফরম' : 'Add New Student Entry'}
                </h4>
                <form onSubmit={handleAddStudent} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">শিক্ষাবর্ষ</label>
                      <select
                        value={newStudent.academicYear}
                        onChange={(e) => setNewStudent({ ...newStudent, academicYear: e.target.value })}
                        className="w-full border rounded-xl px-3 py-2 text-xs bg-white focus:outline-none"
                      >
                        <option value="2027">2027</option>
                        <option value="2026">2026</option>
                        <option value="2025">2025</option>
                        <option value="2024">2024</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">কোর্স</label>
                      <select
                        value={newStudent.courseId}
                        onChange={(e) => setNewStudent({ ...newStudent, courseId: e.target.value })}
                        className="w-full border rounded-xl px-3 py-2 text-xs bg-white focus:outline-none"
                      >
                        {courses.map((c) => (
                          <option key={c.id} value={c.id}>{c.titleBn}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">রোল নম্বর</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 2601"
                        value={newStudent.roll}
                        onChange={(e) => setNewStudent({ ...newStudent, roll: e.target.value })}
                        className="w-full border rounded-xl px-3 py-2 text-xs font-mono font-bold focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">শিক্ষার্থীর নাম (বাংলা)</label>
                      <input
                        type="text"
                        required
                        placeholder="যেমন: তানভীর আহমেদ"
                        value={newStudent.nameBn}
                        onChange={(e) => setNewStudent({ ...newStudent, nameBn: e.target.value })}
                        className="w-full border rounded-xl px-3 py-2 text-xs focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Student Name (English)</label>
                      <input
                        type="text"
                        placeholder="e.g. Tanvir Ahmed"
                        value={newStudent.nameEn}
                        onChange={(e) => setNewStudent({ ...newStudent, nameEn: e.target.value })}
                        className="w-full border rounded-xl px-3 py-2 text-xs focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">মোবাইল নম্বর</label>
                      <input
                        type="text"
                        placeholder="017xxxxxxxx"
                        value={newStudent.phone}
                        onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                        className="w-full border rounded-xl px-3 py-2 text-xs font-mono focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Photo Upload in New Student Form (REQUIREMENT #3) */}
                  <div className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-2">
                    <label className="block font-bold text-emerald-950">
                      {lang === 'bn' ? 'শিক্ষার্থীর ছবি সরাসরি আপলোড' : 'Direct Student Photo Upload'}
                    </label>
                    <div className="flex items-center gap-3">
                      <label className="cursor-pointer px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center gap-1.5 transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{lang === 'bn' ? 'ছবি নির্বাচন করুন' : 'Choose Photo'}</span>
                        <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, (val) => setNewStudent((prev) => ({ ...prev, photoUrl: val })))} className="hidden" />
                      </label>
                      {newStudent.photoUrl && (
                        <img src={newStudent.photoUrl} alt="preview" className="w-10 h-10 object-cover rounded-xl border border-emerald-400" />
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4 text-emerald-400" />
                      <span>{lang === 'bn' ? 'শিক্ষার্থী তালিকাভুক্ত করুন' : 'Enroll Student'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Students Table with Edit & Delete */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs overflow-x-auto">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-700">
                  {lang === 'bn' ? `মোট শিক্ষার্থী: ${filteredStudents.length} জন` : `Showing ${filteredStudents.length} students`}
                </span>
              </div>

              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 font-bold text-slate-700">
                    <th className="p-3 w-14">ছবি</th>
                    <th className="p-3 w-16">রোল</th>
                    <th className="p-3">নাম</th>
                    <th className="p-3">শিক্ষাবর্ষ</th>
                    <th className="p-3">কোর্স</th>
                    <th className="p-3">মোবাইল</th>
                    <th className="p-3 text-right">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((st) => {
                    const crs = courses.find((c) => c.id === st.courseId);
                    return (
                      <tr key={st.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="p-3">
                          <img
                            src={st.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=120&auto=format&fit=crop'}
                            alt={st.nameEn}
                            className="w-9 h-9 rounded-full object-cover border border-slate-200"
                          />
                        </td>
                        <td className="p-3 font-mono font-bold text-emerald-700">{st.roll}</td>
                        <td className="p-3 font-semibold text-slate-900">{st.nameBn || st.nameEn}</td>
                        <td className="p-3 text-slate-600">{st.academicYear}</td>
                        <td className="p-3 text-slate-600 max-w-xs truncate">{crs?.titleBn || st.courseId}</td>
                        <td className="p-3 font-mono text-slate-600">{st.phone || '-'}</td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setEditingStudent(st)}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                            >
                              {lang === 'bn' ? 'এডিট' : 'Edit'}
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(lang === 'bn' ? 'শিক্ষার্থীকে মুছে ফেলতে চান?' : 'Delete student?')) {
                                  deleteStudent(st.id);
                                  showToast(lang === 'bn' ? 'শিক্ষার্থী মুছে ফেলা হয়েছে!' : 'Student deleted!');
                                }
                              }}
                              className="px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 font-semibold"
                            >
                              {lang === 'bn' ? 'ডিলিট' : 'Delete'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================== TAB 4: RESULTS & PRINT (REQUIREMENT #4) ==================== */}
        {activeTab === 'results' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">SECTION 4</span>
                  <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                    {lang === 'bn' ? 'ফলাফল, মার্কস এন্ট্রি ও ব্রডশিট প্রিন্ট' : 'Results Entry & Broadsheet Print'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {lang === 'bn' ? 'শিক্ষাবর্ষ, কোর্স ও পরীক্ষার ধরন অনুযায়ী ফলাফল দেখুন এবং সরাসরি তালিকা প্রিন্ট করুন।' : 'Filter results by year, course, and exam; view and print broadsheet.'}
                  </p>
                </div>

                {/* DIRECT PRINT BUTTON */}
                <button
                  onClick={() => setShowPrintResultSheet(true)}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-md transition-all self-start sm:self-center shrink-0"
                >
                  <Printer className="w-4 h-4" />
                  <span>{lang === 'bn' ? 'ফলাফল তালিকা সরাসরি প্রিন্ট করুন' : 'Print Results Sheet'}</span>
                </button>
              </div>

              {/* Filters for Results View */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">শিক্ষাবর্ষ (Year)</label>
                  <select
                    value={resYear}
                    onChange={(e) => setResYear(e.target.value)}
                    className="w-full border rounded-xl px-3 py-2 text-xs bg-white font-semibold focus:outline-none"
                  >
                    <option value="2027">2027</option>
                    <option value="2026">2026</option>
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">কোর্স নির্বাচন</label>
                  <select
                    value={resCourseId}
                    onChange={(e) => setResCourseId(e.target.value)}
                    className="w-full border rounded-xl px-3 py-2 text-xs bg-white font-semibold focus:outline-none"
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>{c.titleBn}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">পরীক্ষার ধরন</label>
                  <select
                    value={resExamId}
                    onChange={(e) => setResExamId(e.target.value)}
                    className="w-full border rounded-xl px-3 py-2 text-xs bg-white font-semibold focus:outline-none"
                  >
                    {exams.map((ex) => (
                      <option key={ex.id} value={ex.id}>{ex.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Entry Form Preserved */}
              <div className="pt-2">
                <h4 className="font-bold text-slate-800 text-sm mb-3">
                  + {lang === 'bn' ? 'শিক্ষার্থীর নম্বর এন্ট্রি করুন' : 'Enter Student Marks'}
                </h4>
                <form onSubmit={handleSaveResult} className="space-y-4 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-48">
                      <label className="block font-bold text-slate-700 mb-1">শিক্ষার্থীর রোল</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 2601"
                        value={resRoll}
                        onChange={(e) => setResRoll(e.target.value)}
                        className="w-full border rounded-xl px-3 py-2 text-xs font-mono font-bold focus:outline-none"
                      />
                    </div>
                    {autoStudent && (
                      <div className="text-xs text-emerald-800 font-bold bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200 mt-5">
                        ✓ {autoStudent.nameBn} (পিতা: {autoStudent.fatherNameBn})
                      </div>
                    )}
                  </div>

                  {/* Dynamic Subjects */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border">
                    {currentCourseSubjects.map((sub: CourseSubject) => (
                      <div key={sub.id}>
                        <label className="block font-bold text-slate-700 mb-1 truncate">
                          {sub.name} ({sub.fullMarks})
                        </label>
                        <input
                          type="number"
                          min={0}
                          max={sub.fullMarks}
                          value={resSubjectMarks[sub.id] || ''}
                          onChange={(e) => setResSubjectMarks({ ...resSubjectMarks, [sub.id]: Number(e.target.value) })}
                          className="w-full border rounded-xl px-3 py-2 text-xs font-mono font-bold focus:outline-none bg-white"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <Save className="w-4 h-4 text-emerald-400" />
                      <span>{lang === 'bn' ? 'ফলাফল সংরক্ষণ করুন' : 'Save Marks'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Results Table */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs overflow-x-auto">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-700">
                  {lang === 'bn' ? 'বর্তমান ফিল্টারের ফলাফল তালিকা' : 'Results Tabulation Table'}
                </span>
                <button
                  onClick={() => setShowPrintResultSheet(true)}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>প্রিন্ট করুন</span>
                </button>
              </div>

              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 font-bold text-slate-700">
                    <th className="p-3 w-16">রোল</th>
                    <th className="p-3">শিক্ষার্থীর নাম</th>
                    <th className="p-3 text-center">মোট নম্বর</th>
                    <th className="p-3 text-center">%</th>
                    <th className="p-3 text-center">জিপিএ</th>
                    <th className="p-3 text-center">গ্রেড</th>
                    <th className="p-3 text-right">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody>
                  {results
                    .filter((r) => r.academicYear === resYear && r.courseId === resCourseId && r.examId === resExamId)
                    .map((res) => {
                      const st = students.find((s) => s.roll === res.studentRoll);
                      return (
                        <tr key={res.id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="p-3 font-mono font-bold text-emerald-700">{res.studentRoll}</td>
                          <td className="p-3 font-semibold text-slate-900">{st ? st.nameBn : `Roll ${res.studentRoll}`}</td>
                          <td className="p-3 text-center font-bold">{res.totalMarks} / {res.totalFullMarks}</td>
                          <td className="p-3 text-center">{res.percentage.toFixed(1)}%</td>
                          <td className="p-3 text-center font-bold text-emerald-700">{res.gpa.toFixed(2)}</td>
                          <td className="p-3 text-center">
                            <span className="px-2 py-0.5 rounded font-black text-xs bg-emerald-100 text-emerald-800">
                              {res.grade}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => {
                                if (confirm('মুছে ফেলতে চান?')) deleteResult(res.id);
                              }}
                              className="px-2.5 py-1 rounded bg-red-50 text-red-600 font-semibold"
                            >
                              ডিলিট
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================== TAB 5: TEACHERS & ID CARD (REQUIREMENT #5) ==================== */}
        {activeTab === 'teachers' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">SECTION 5</span>
                  <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                    {lang === 'bn' ? 'শিক্ষক মণ্ডলী ও আইডি কার্ড প্রিন্ট' : 'Faculty Roster & Teacher ID Card'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {lang === 'bn' ? 'শিক্ষকদের ছবি আপলোড করুন, তথ্য যুক্ত করুন এবং শিক্ষক আইডি কার্ড প্রিন্ট করুন।' : 'Direct photo uploads, teacher contact & address, instant ID card print.'}
                  </p>
                </div>
              </div>

              {/* Add Teacher Form */}
              <form onSubmit={handleAddTeacher} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">শিক্ষকের নাম (বাংলা)</label>
                    <input
                      type="text"
                      required
                      placeholder="যেমন: এমডি তৌহিদুল হক তুহিন"
                      value={newTeacherNameBn}
                      onChange={(e) => setNewTeacherNameBn(e.target.value)}
                      className="w-full border rounded-xl px-3 py-2 text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Teacher Name (English)</label>
                    <input
                      type="text"
                      placeholder="e.g. MD Touhidul Hoque Tuhin"
                      value={newTeacherNameEn}
                      onChange={(e) => setNewTeacherNameEn(e.target.value)}
                      className="w-full border rounded-xl px-3 py-2 text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">পদবি (বাংলা)</label>
                    <input
                      type="text"
                      required
                      value={newTeacherDesigBn}
                      onChange={(e) => setNewTeacherDesigBn(e.target.value)}
                      className="w-full border rounded-xl px-3 py-2 text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">শিক্ষাগত যোগ্যতা</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. B.A (Hons), M.A in English"
                      value={newTeacherQual}
                      onChange={(e) => setNewTeacherQual(e.target.value)}
                      className="w-full border rounded-xl px-3 py-2 text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">মোবাইল নম্বর</label>
                    <input
                      type="text"
                      required
                      placeholder="+880 1712-345678"
                      value={newTeacherPhone}
                      onChange={(e) => setNewTeacherPhone(e.target.value)}
                      className="w-full border rounded-xl px-3 py-2 text-xs font-mono focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">ঠিকানা</label>
                    <input
                      type="text"
                      placeholder="ধানমন্ডি, ঢাকা"
                      value={newTeacherAddress}
                      onChange={(e) => setNewTeacherAddress(e.target.value)}
                      className="w-full border rounded-xl px-3 py-2 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                {/* Direct Photo Upload */}
                <div className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-2">
                  <label className="block font-bold text-emerald-950">
                    {lang === 'bn' ? 'শিক্ষকের ছবি সরাসরি আপলোড করুন (ছবি সিলেক্ট করুন)' : 'Upload Teacher Photo Directly'}
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="cursor-pointer px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center gap-1.5 transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{lang === 'bn' ? 'ছবি নির্বাচন করুন' : 'Choose Photo'}</span>
                      <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setNewTeacherPhoto)} className="hidden" />
                    </label>
                    {newTeacherPhoto && (
                      <img src={newTeacherPhoto} alt="preview" className="w-12 h-12 object-cover rounded-xl border border-emerald-400" />
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={newTeacherIsHeadmaster}
                      onChange={(e) => setNewTeacherIsHeadmaster(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>{lang === 'bn' ? 'প্রধান শিক্ষক হিসেবে চিহ্নিত করুন' : 'Mark as Headmaster'}</span>
                  </label>

                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4 text-emerald-400" />
                    <span>{lang === 'bn' ? 'শিক্ষক যুক্ত করুন' : 'Add Teacher'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Teachers Cards with ID Card Print Button */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {teachers.map((tch) => (
                <div key={tch.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3 flex flex-col justify-between">
                  <div className="flex items-start gap-3">
                    <img
                      src={tch.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=240&auto=format&fit=crop'}
                      alt={tch.nameEn}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500 shrink-0"
                    />
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-slate-900 text-sm leading-tight">{tch.nameBn || tch.nameEn}</h4>
                      <p className="text-xs text-emerald-700 font-semibold">{tch.designationBn || tch.designationEn}</p>
                      <p className="text-[11px] text-slate-500">{tch.qualification}</p>
                      <p className="text-[11px] text-slate-600 font-mono">{tch.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                    {/* PRINT TEACHER ID CARD BUTTON (REQUIREMENT #5) */}
                    <button
                      onClick={() => setIdCardTeacher(tch)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>{lang === 'bn' ? 'আইডি কার্ড প্রিন্ট' : 'Print ID Card'}</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setEditingTeacher(tch)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                      >
                        {lang === 'bn' ? 'এডিট' : 'Edit'}
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('মুছে ফেলতে চান?')) deleteTeacher(tch.id);
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold"
                      >
                        {lang === 'bn' ? 'ডিলিট' : 'Delete'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB 6: FREE CLASSES (REQUIREMENT #6) ==================== */}
        {activeTab === 'classes' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">SECTION 6</span>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                  {lang === 'bn' ? 'ফ্রি ক্লাস সেকশন (ভিডিও আপলোড ও লিঙ্ক)' : 'Free Video Classes Management'}
                </h3>
                <p className="text-xs text-slate-500">
                  {lang === 'bn' ? 'সরাসরি ভিডিও আপলোড অথবা YouTube, Facebook ও TikTok লিঙ্ক দিয়ে ফ্রি ক্লাস যোগ করুন।' : 'Upload video files directly or embed links from YouTube, Facebook, or TikTok.'}
                </p>
              </div>

              <form onSubmit={handleAddVideoClass} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">ভিডিও ক্লাসের শিরোনাম (বাংলা)</label>
                    <input
                      type="text"
                      required
                      placeholder="যেমন: Right Forms of Verbs গোল্ডেন টেকনিক"
                      value={newVideoTitleBn}
                      onChange={(e) => setNewVideoTitleBn(e.target.value)}
                      className="w-full border rounded-xl px-3 py-2 text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">ক্যাটাগরি</label>
                    <select
                      value={newVideoCategory}
                      onChange={(e) => setNewVideoCategory(e.target.value as any)}
                      className="w-full border rounded-xl px-3 py-2 text-xs bg-white focus:outline-none"
                    >
                      <option value="Grammar Hacks">Grammar Hacks</option>
                      <option value="Spoken English">Spoken English</option>
                      <option value="HSC English">HSC English</option>
                      <option value="BCS & Govt Job">BCS & Govt Job</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">ভিডিও প্ল্যাটফর্ম</label>
                    <select
                      value={newVideoPlatform}
                      onChange={(e) => setNewVideoPlatform(e.target.value as any)}
                      className="w-full border rounded-xl px-3 py-2 text-xs bg-white focus:outline-none font-semibold"
                    >
                      <option value="youtube">YouTube Video</option>
                      <option value="facebook">Facebook Video</option>
                      <option value="tiktok">TikTok Video</option>
                      <option value="uploaded">Direct Uploaded Video File</option>
                    </select>
                  </div>

                  {newVideoPlatform === 'uploaded' ? (
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">সরাসরি ভিডিও ফাইল নির্বাচন করুন (MP4/WebM)</label>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => handleFileChange(e, setNewVideoFile, 'ভিডিও ফাইল লোড হয়েছে!')}
                        className="w-full border rounded-xl p-1.5 text-xs bg-white"
                      />
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block font-bold text-slate-700">
                          {newVideoPlatform.toUpperCase()} ভিডিও লিঙ্ক (URL)
                        </label>
                        {newVideoUrl && (
                          <button
                            type="button"
                            onClick={handleManualAutoFetchThumb}
                            disabled={isAutoFetchingThumb}
                            className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                          >
                            <RefreshCw className={`w-3 h-3 ${isAutoFetchingThumb ? 'animate-spin' : ''}`} />
                            <span>{lang === 'bn' ? 'অটো থাম্বনেইল আনুন' : 'Auto Thumbnail'}</span>
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        placeholder="https://www.youtube.com/watch?v=... অথবা https://www.facebook.com/..."
                        value={newVideoUrl}
                        onChange={(e) => handleVideoUrlChange(e.target.value)}
                        className="w-full border rounded-xl px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none"
                      />
                      <p className="text-[10px] text-slate-400 mt-1">
                        {lang === 'bn'
                          ? '* ইউটিউব বা ফেসবুক লিঙ্ক দিলেই থাম্বনেইল স্বয়ংক্রিয়ভাবে তৈরি হবে।'
                          : '* Thumbnail is automatically extracted from YouTube or Facebook URL.'}
                      </p>
                    </div>
                  )}
                </div>

                {/* THUMBNAIL UPLOAD & AUTO-PREVIEW SECTION */}
                <div className="p-4 bg-slate-50 border border-slate-200/90 rounded-2xl space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label className="font-bold text-slate-800 flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-emerald-600" />
                      <span>{lang === 'bn' ? 'ভিডিও থাম্বনেইল (ছবি আপলোড অথবা অটো)' : 'Video Thumbnail (Upload or Auto)'}</span>
                    </label>
                    {newVideoThumb && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {newVideoThumb.startsWith('data:image')
                          ? (lang === 'bn' ? 'নিজস্ব ছবি আপলোডকৃত' : 'Custom Image Uploaded')
                          : newVideoThumb.includes('youtube')
                          ? (lang === 'bn' ? 'ইউটিউব থেকে অটো থাম্বনেইল' : 'YouTube Auto-Thumbnail')
                          : (lang === 'bn' ? 'ফেসবুক ভিডিও থাম্বনেইল' : 'Facebook Video Thumbnail')}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    {/* Live Preview Aspect Box */}
                    <div className="relative w-full sm:w-48 aspect-video rounded-xl overflow-hidden border-2 border-slate-200 bg-slate-900 shrink-0 shadow-xs flex items-center justify-center">
                      {newVideoThumb ? (
                        <img src={newVideoThumb} alt="Thumbnail preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-slate-400 text-center p-2">
                          <ImageIcon className="w-6 h-6 mb-1 text-slate-500" />
                          <span className="text-[10px]">{lang === 'bn' ? 'থাম্বনেইল প্রিভিউ' : 'No Thumbnail'}</span>
                        </div>
                      )}
                    </div>

                    {/* Direct Image File Upload Button & Options */}
                    <div className="w-full space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <label className="cursor-pointer px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs">
                          <Upload className="w-3.5 h-3.5" />
                          <span>{lang === 'bn' ? 'থাম্বনেইল ছবি আপলোড করুন' : 'Upload Thumbnail Image'}</span>
                          <input type="file" accept="image/*" onChange={handleCustomVideoThumbUpload} className="hidden" />
                        </label>

                        {newVideoThumb && (
                          <button
                            type="button"
                            onClick={() => setNewVideoThumb('')}
                            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-semibold transition-colors"
                          >
                            {lang === 'bn' ? 'রিসেট' : 'Clear'}
                          </button>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        {lang === 'bn'
                          ? 'ফেসবুক বা ইউটিউব লিঙ্ক দিলে অটো থাম্বনেইল চলে আসবে। এছাড়া চাইলে আপনার কম্পিউটার/মোবাইল থেকে সরাসরি যেকোনো ছবি থাম্বনেইল হিসেবে আপলোড করতে পারবেন।'
                          : 'Auto-fetches thumbnail from YouTube/Facebook link. You can also upload any custom image file directly.'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-emerald-400" />
                    <span>{lang === 'bn' ? 'ফ্রি ক্লাস প্রকাশ করুন' : 'Publish Video Class'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Video List */}
            {videoClasses.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-slate-200 p-6 space-y-2">
                <Video className="w-10 h-10 text-slate-400 mx-auto" />
                <h4 className="font-bold text-slate-700 text-sm">{lang === 'bn' ? 'কোনো ফ্রি ক্লাস নেই' : 'No Free Classes Found'}</h4>
                <p className="text-xs text-slate-400">{lang === 'bn' ? 'ওপরের ফরম থেকে ইউটিউব বা ফেসবুক ভিডিও ক্লাস যুক্ত করুন।' : 'Add a YouTube or Facebook video class using the form above.'}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {videoClasses.map((v) => (
                  <div key={v.id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3 flex flex-col justify-between hover:border-emerald-300 transition-colors">
                    <div className="space-y-2">
                      <div className="aspect-video w-full rounded-xl overflow-hidden border border-slate-100 bg-slate-900 flex items-center justify-center relative shadow-2xs">
                        <img src={v.thumbnailUrl} alt={v.titleBn} className="w-full h-full object-cover" />
                        <span className="absolute bottom-2 right-2 bg-black/75 text-white text-[10px] px-1.5 py-0.5 rounded font-mono">
                          {v.duration}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">{v.category}</span>
                      <h4 className="font-bold text-slate-900 text-sm leading-snug">{v.titleBn}</h4>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                      <span className="text-[10px] text-slate-400 uppercase font-mono">{v.videoPlatform || 'YouTube'}</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setEditingVideoClass(v)}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>{lang === 'bn' ? 'এডিট' : 'Edit'}</span>
                        </button>

                        {deletingVideoId === v.id ? (
                          <div className="flex items-center gap-1 animate-scale-in">
                            <button
                              type="button"
                              onClick={() => handleDeleteVideoClass(v.id, v.titleBn)}
                              className="px-2.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold rounded-lg shadow-2xs cursor-pointer"
                            >
                              {lang === 'bn' ? 'হ্যাঁ, মুছুন' : 'Confirm'}
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeletingVideoId(null)}
                              className="px-2 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] font-semibold rounded-lg cursor-pointer"
                            >
                              {lang === 'bn' ? 'বাতিল' : 'Cancel'}
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setDeletingVideoId(v.id)}
                            className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                            title={lang === 'bn' ? 'ক্লাস ডিলিট করুন' : 'Delete class'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>{lang === 'bn' ? 'ডিলিট' : 'Delete'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==================== TAB 7: NOTES & SHEETS (REQUIREMENT #7) ==================== */}
        {activeTab === 'notes' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">SECTION 7</span>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                  {lang === 'bn' ? 'নোটস ও শিট (ছবি ও পিডিএফ সরাসরি আপলোড)' : 'Notes & PDFs Management'}
                </h3>
                <p className="text-xs text-slate-500">
                  {lang === 'bn' ? 'হ্যান্ডনোট ও গ্রামার শিটের ক্ষেত্রে সরাসরি ছবি ও পিডিএফ (PDF) আপলোড করুন।' : 'Upload direct Image and PDF documents, edit and delete resources.'}
                </p>
              </div>

              <form onSubmit={handleAddNote} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">নোটের নাম (বাংলা)</label>
                    <input
                      type="text"
                      required
                      placeholder="যেমন: ২৫০টি প্রয়োজনীয় প্রিপরিশন হ্যান্ডনোট"
                      value={newNoteTitleBn}
                      onChange={(e) => setNewNoteTitleBn(e.target.value)}
                      className="w-full border rounded-xl px-3 py-2 text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">ক্যাটাগরি</label>
                    <select
                      value={newNoteCategory}
                      onChange={(e) => setNewNoteCategory(e.target.value as any)}
                      className="w-full border rounded-xl px-3 py-2 text-xs bg-white focus:outline-none"
                    >
                      <option value="Handwritten Notes">Handwritten Notes</option>
                      <option value="Grammar Sheets">Grammar Sheets</option>
                      <option value="HSC English">HSC English</option>
                      <option value="Vocabulary Booster">Vocabulary Booster</option>
                    </select>
                  </div>
                </div>

                {/* DIRECT PDF OR IMAGE FILE UPLOAD (REQUIREMENT #7) */}
                <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-2xl space-y-2">
                  <label className="block font-bold text-emerald-950">
                    {lang === 'bn' ? 'নোটের পিডিএফ (PDF) বা ছবি সরাসরি আপলোড করুন' : 'Direct PDF or Image File Upload'}
                  </label>
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <label className="cursor-pointer px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors shrink-0">
                      <Upload className="w-4 h-4" />
                      <span>{lang === 'bn' ? 'পিডিএফ বা ছবি বেছে নিন' : 'Choose PDF / Image File'}</span>
                      <input 
                        type="file" 
                        accept=".pdf,image/*" 
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) {
                            setNewNoteFileType(f.type.includes('pdf') ? 'pdf' : 'image');
                            handleFileChange(e, setNewNoteFileUrl, 'ফাইল সফলভাবে আপলোড হয়েছে!');
                          }
                        }} 
                        className="hidden" 
                      />
                    </label>

                    {newNoteFileUrl ? (
                      <span className="text-xs text-emerald-800 font-semibold">
                        ✓ {newNoteFileType.toUpperCase()} ফাইল আপলোড সম্পন্ন
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400 italic">কোনো ফাইল নির্বাচন করা হয়নি</span>
                    )}
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4 text-emerald-400" />
                    <span>{lang === 'bn' ? 'নোটস প্রকাশ করুন' : 'Publish Note Resource'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Notes List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {notes.map((n) => (
                <div key={n.id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">{n.category}</span>
                      <span className="text-[10px] font-bold uppercase text-slate-400">{n.fileType || 'PDF'}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">{n.titleBn}</h4>
                    <p className="text-xs text-slate-500">{n.pages} পৃষ্ঠা • {n.subject}</p>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                    <span className="text-[10px] text-slate-400">{n.date}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          const newTitle = prompt('নতুন শিরোনাম দিন:', n.titleBn);
                          if (newTitle) updateNote({ ...n, titleBn: newTitle });
                        }}
                        className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 text-xs font-semibold"
                      >
                        {lang === 'bn' ? 'এডিট' : 'Edit'}
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('মুছে ফেলতে চান?')) deleteNote(n.id);
                        }}
                        className="px-2.5 py-1 rounded bg-red-50 text-red-600 text-xs font-semibold"
                      >
                        {lang === 'bn' ? 'ডিলিট' : 'Delete'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB 7: NOTICE BOARD (REQUIREMENT #7) ==================== */}
        {activeTab === 'notices' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">SECTION 7</span>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                  {lang === 'bn' ? 'নোটিশ বোর্ড (ছবি ও পিডিএফ সরাসরি আপলোড)' : 'Notice Board Management'}
                </h3>
                <p className="text-xs text-slate-500">
                  {lang === 'bn' ? 'নোটিশের সাথে সরাসরি ছবি ও পিডিএফ ফাইল আপলোড করুন, এডিট ও ডিলিট করুন।' : 'Attach photos and PDFs to notices, full edit and delete controls.'}
                </p>
              </div>

              <form onSubmit={handleAddNotice} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">নোটিশের শিরোনাম (বাংলা)</label>
                    <input
                      type="text"
                      required
                      placeholder="যেমন: এইচএসসি ২০২৬ স্পেশাল ইন্টেনসিভ ইংলিশ ব্যাচে ভর্তি চলছে"
                      value={newNoticeTitleBn}
                      onChange={(e) => setNewNoticeTitleBn(e.target.value)}
                      className="w-full border rounded-xl px-3 py-2 text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">ক্যাটাগরি</label>
                    <select
                      value={newNoticeCategory}
                      onChange={(e) => setNewNoticeCategory(e.target.value as any)}
                      className="w-full border rounded-xl px-3 py-2 text-xs bg-white focus:outline-none"
                    >
                      <option value="Admission">Admission</option>
                      <option value="Routine">Routine</option>
                      <option value="Exam">Exam</option>
                      <option value="General">General</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">নোটিশের বিস্তারিত বিবরণ</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="নোটিশের বিস্তারিত তথ্য লিখুন..."
                    value={newNoticeContentBn}
                    onChange={(e) => setNewNoticeContentBn(e.target.value)}
                    className="w-full border rounded-xl p-3 text-xs focus:outline-none"
                  />
                </div>

                {/* DIRECT PHOTO & PDF ATTACHMENTS (REQUIREMENT #7) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <label className="block font-bold text-slate-700">
                      {lang === 'bn' ? 'নোটিশের ছবি সরাসরি আপলোড' : 'Notice Image Upload'}
                    </label>
                    <div className="flex items-center gap-3">
                      <label className="cursor-pointer px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center gap-1.5 transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{lang === 'bn' ? 'ছবি নির্বাচন' : 'Select Image'}</span>
                        <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setNewNoticeImageUrl)} className="hidden" />
                      </label>
                      {newNoticeImageUrl && (
                        <img src={newNoticeImageUrl} alt="preview" className="w-12 h-12 object-cover rounded-xl border border-emerald-400" />
                      )}
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <label className="block font-bold text-slate-700">
                      {lang === 'bn' ? 'নোটিশের পিডিএফ (PDF) সরাসরি আপলোড' : 'Notice PDF Upload'}
                    </label>
                    <div className="flex items-center gap-3">
                      <label className="cursor-pointer px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold flex items-center gap-1.5 transition-colors">
                        <Upload className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{lang === 'bn' ? 'পিডিএফ নির্বাচন' : 'Select PDF'}</span>
                        <input type="file" accept=".pdf" onChange={(e) => handleFileChange(e, setNewNoticePdfUrl, 'নোটিশ পিডিএফ আপলোড হয়েছে!')} className="hidden" />
                      </label>
                      {newNoticePdfUrl && (
                        <span className="text-xs text-emerald-700 font-bold">✓ PDF Ready</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={newNoticeIsPinned}
                      onChange={(e) => setNewNoticeIsPinned(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>{lang === 'bn' ? 'নোটিশ বোর্ডে উপরে পিন করে রাখুন' : 'Pin to top of board'}</span>
                  </label>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4 text-emerald-400" />
                    <span>{lang === 'bn' ? 'নোটিশ প্রকাশ করুন' : 'Publish Notice'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Notices List */}
            <div className="space-y-3">
              {notices.map((nt) => (
                <div key={nt.id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">{nt.category}</span>
                    <span className="text-[11px] text-slate-400">{nt.date}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{nt.titleBn}</h4>
                  <p className="text-xs text-slate-600 line-clamp-2">{nt.contentBn}</p>
                  <div className="flex items-center justify-between border-t border-slate-100 pt-2 text-xs">
                    <span className="text-slate-400">{nt.imageUrl ? 'ছবি সংযুক্ত' : ''} {nt.pdfUrl ? '• পিডিএফ সংযুক্ত' : ''}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          const newTitle = prompt('নতুন শিরোনাম লিখুন:', nt.titleBn);
                          if (newTitle) updateNotice({ ...nt, titleBn: newTitle });
                        }}
                        className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-semibold"
                      >
                        {lang === 'bn' ? 'এডিট' : 'Edit'}
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('মুছে ফেলতে চান?')) deleteNotice(nt.id);
                        }}
                        className="px-2.5 py-1 rounded bg-red-50 text-red-600 font-semibold"
                      >
                        {lang === 'bn' ? 'ডিলিট' : 'Delete'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB 8: CHATBOT TRAINING (REQUIREMENT #8) ==================== */}
        {activeTab === 'chatbot_training' && (
          <ChatbotTrainingTab
            chatbotTraining={chatbotTraining}
            addChatbotTraining={addChatbotTraining}
            updateChatbotTraining={updateChatbotTraining}
            deleteChatbotTraining={deleteChatbotTraining}
            lang={lang}
            showToast={showToast}
          />
        )}

        {/* ==================== TAB 9: DICTIONARY CONTROL (REQUIREMENT #9) ==================== */}
        {activeTab === 'dictionary' && (
          <DictionaryManagementTab
            lang={lang}
            showToast={showToast}
          />
        )}

        {/* ==================== TAB 10: ROUTINE SECTION (REQUIREMENT #10) ==================== */}
        {activeTab === 'routines' && (
          <RoutineManagementTab
            routines={routines}
            courses={courses}
            addRoutine={addRoutine}
            updateRoutine={updateRoutine}
            deleteRoutine={deleteRoutine}
            lang={lang}
            showToast={showToast}
          />
        )}

        {/* ==================== TAB: QUIZ MANAGEMENT (BONUS REQUIREMENT) ==================== */}
        {activeTab === 'quizzes' && (
          <QuizManagementTab
            modelTests={modelTests}
            addModelTest={addModelTest}
            updateModelTest={updateModelTest}
            deleteModelTest={deleteModelTest}
            lang={lang}
            showToast={showToast}
          />
        )}


        {/* ==================== TAB 12: GITHUB API & REAL-TIME SYNC ==================== */}
        {activeTab === 'github_sync' && (
          <GitHubSyncTab
            config={githubConfig}
            updateConfig={updateGitHubConfig}
            isSyncing={isGitHubSyncing}
            pushToGitHub={pushToGitHub}
            pullFromGitHub={pullFromGitHub}
            syncStatus={gitHubSyncStatus}
            lang={lang}
            showToast={showToast}
          />
        )}

        {/* ==================== TAB: CODEBASE DIRECT DATABASE SYNC ==================== */}
        {activeTab === 'code_sync' && (
          <div className="space-y-6">
            {/* Header & Status Card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-emerald-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded uppercase flex items-center gap-1 shadow-xs">
                    <Database className="w-3 h-3" />
                    AUTHORITATIVE CODEBASE DATABASE
                  </span>
                  <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded font-mono">
                    src/data/liveData.json
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  {lang === 'bn' ? 'অ্যাডমিন কোডিং ডেটাবেজ ও চূড়ান্ত ডেটা কন্ট্রোল' : 'Admin Codebase Database & Final Authority'}
                </h3>
                <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                  {lang === 'bn'
                    ? 'অ্যাডমিন প্যানেল থেকে আপনি যা-ই পরিবর্তন করবেন, তাই চূড়ান্ত এবং তা সরাসরি প্রোজেক্টের কোডিং ফাইলে (src/data/liveData.json) স্বয়ংক্রিয়ভাবে সেভ হয়ে যাবে। কোনো ক্যাশ ক্লিয়ার বা নতুন ডিভাইস থেকেও এই তথ্য আর মুছে যাবে না।'
                    : 'Whatever changes you make in the Admin Panel are authoritative and automatically saved directly into the project codebase file (src/data/liveData.json).'}
                </p>
              </div>

              {/* Status & Master Trigger Box */}
              <div className="bg-slate-900 text-white rounded-2xl p-5 min-w-[280px] space-y-3 shadow-lg border border-slate-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    {lang === 'bn' ? 'সিঙ্ক স্ট্যাটাস:' : 'Sync Status:'}
                  </span>
                  <span className="font-bold px-2.5 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    {lang === 'bn' ? 'কোডে লাইভ সিঙ্ক সক্রিয়' : 'Code Sync Active'}
                  </span>
                </div>

                <div className="text-[11px] text-slate-400 font-mono">
                  {lang === 'bn' ? 'সর্বশেষ কোড আপডেট: ' : 'Last Saved: '}
                  <span className="text-slate-200">
                    {codeSyncLastSaved ? new Date(codeSyncLastSaved).toLocaleTimeString('bn-BD') : 'এখনই'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleSaveAllToCodebase}
                  disabled={isCodeSyncing}
                  className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
                >
                  <Save className={`w-4 h-4 ${isCodeSyncing ? 'animate-spin' : ''}`} />
                  <span>
                    {isCodeSyncing
                      ? (lang === 'bn' ? 'কোডিংয়ে সংরক্ষণ হচ্ছে...' : 'Saving to Codebase...')
                      : (lang === 'bn' ? 'কোডিংয়ে সম্পূর্ণ স্ন্যাপশট লিখুন' : 'Write Full Snapshot to Code')}
                  </span>
                </button>
              </div>
            </div>

            {/* GitHub Token & Codebase Engine Status */}
            <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border border-emerald-500/30 text-white p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shrink-0">
                  <GitBranch className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm text-white">
                      {lang === 'bn' ? 'গিটহাব টোকেন ও লোকাল কোডবেস অটো-পাবলিশ ইঞ্জিন' : 'GitHub Token & Codebase Auto-Publish Engine'}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-black rounded-full bg-emerald-400 text-slate-950 uppercase flex items-center gap-1 shadow-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-pulse" />
                      GITHUB PUBLISH READY
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    {lang === 'bn' 
                      ? 'অ্যাডমিনের প্রতিটি আপডেট সরাসরি লোকাল কোডবেসে সেভ হয় এবং গিটহাব টোকেনের মাধ্যমে স্বয়ংক্রিয়ভাবে পাবলিশ হয়।' 
                      : 'All admin updates save directly to codebase and auto-publish to GitHub via your personal access token.'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] text-emerald-300 bg-emerald-950/80 px-3 py-1.5 rounded-xl border border-emerald-500/40 font-mono flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  {lang === 'bn' ? 'সকল ডিভাইসে দৃশ্যমান' : 'Live on All Devices'}
                </span>
              </div>
            </div>

            {/* Information & Feature Summary Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
                <span className="text-slate-400 font-semibold uppercase text-[10px] flex items-center gap-1">
                  <Settings className="w-3.5 h-3.5 text-emerald-600" />
                  প্রতিষ্ঠান ও ফুটার
                </span>
                <p className="text-lg font-bold text-slate-800">১টি প্রতিষ্ঠান প্রোফাইল</p>
                <p className="text-[11px] text-slate-500">লোগো, সিল, নাম ও ফুটার লিংক কোডে সংরক্ষিত</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
                <span className="text-slate-400 font-semibold uppercase text-[10px] flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                  হিরো স্লাইডার
                </span>
                <p className="text-lg font-bold text-slate-800">{heroSlides.length}টি ব্যানার স্লাইড</p>
                <p className="text-[11px] text-slate-500">হোমপেজের স্লাইডার কোডিং ডেটাবেজে লাইভ</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
                <span className="text-slate-400 font-semibold uppercase text-[10px] flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                  কোর্স কারিকুলাম
                </span>
                <p className="text-lg font-bold text-slate-800">{courses.length}টি ব্যাচ ও কোর্স</p>
                <p className="text-[11px] text-slate-500">ফি, মেয়াদ ও কারিকুলাম কোডে চূড়ান্ত</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
                <span className="text-slate-400 font-semibold uppercase text-[10px] flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-emerald-600" />
                  শিক্ষার্থী তালিকা
                </span>
                <p className="text-lg font-bold text-slate-800">{students.length} জন শিক্ষার্থী</p>
                <p className="text-[11px] text-slate-500">ভর্তি ও শিক্ষার্থীর তথ্য কোডে সংরক্ষিত</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
                <span className="text-slate-400 font-semibold uppercase text-[10px] flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-emerald-600" />
                  ফলাফল ও মার্কশিট
                </span>
                <p className="text-lg font-bold text-slate-800">{results.length}টি পরীক্ষার ফলাফল</p>
                <p className="text-[11px] text-slate-500">{subjects.length} বিষয় ও {exams.length} পরীক্ষার ডেটা</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
                <span className="text-slate-400 font-semibold uppercase text-[10px] flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                  শিক্ষক ও সিল/স্বাক্ষর
                </span>
                <p className="text-lg font-bold text-slate-800">{teachers.length} জন শিক্ষক</p>
                <p className="text-[11px] text-slate-500">আইডি কার্ড ও ডিজিটাল স্বাক্ষর কোডে যুক্ত</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
                <span className="text-slate-400 font-semibold uppercase text-[10px] flex items-center gap-1">
                  <Video className="w-3.5 h-3.5 text-emerald-600" />
                  ফ্রি ক্লাস ও নোটস
                </span>
                <p className="text-lg font-bold text-slate-800">{videoClasses.length}টি ক্লাস, {notes.length}টি নোটস</p>
                <p className="text-[11px] text-slate-500">ভিডিও লেকচার ও পিডিএফ শিট কোডে সিঙ্কড</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
                <span className="text-slate-400 font-semibold uppercase text-[10px] flex items-center gap-1">
                  <Bot className="w-3.5 h-3.5 text-emerald-600" />
                  চ্যাটবট ও কুইজ
                </span>
                <p className="text-lg font-bold text-slate-800">{chatbotTraining.length}টি টপিক, {modelTests.length}টি কুইজ</p>
                <p className="text-[11px] text-slate-500">১০ লাখ শব্দের জ্ঞানভাণ্ডার কোডে চূড়ান্ত</p>
              </div>
            </div>

            {/* How It Works Explanatory Callout */}
            <div className="bg-emerald-50/80 border border-emerald-200 rounded-3xl p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                <h4 className="text-base font-bold text-emerald-950">
                  {lang === 'bn' ? 'কীভাবে এই সিস্টেম কাজ করে?' : 'How this Authoritative Sync Works'}
                </h4>
              </div>
              <ul className="space-y-2 text-xs text-emerald-900 leading-relaxed list-disc list-inside">
                <li>
                  <strong>স্বয়ংক্রিয় কোডিং রাইট:</strong> আপনি অ্যাডমিন প্যানেলে যেকোনো কোর্স, রুটিন, নোটিশ, শিক্ষার্থী, ফলাফল বা স্লাইডার তৈরি বা এডিট করার সাথে সাথে সিস্টেম স্বয়ংক্রিয়ভাবে <code className="bg-white px-2 py-0.5 rounded font-mono border border-emerald-300">src/data/liveData.json</code> ফাইলে তা লিখে দেয়।
                </li>
                <li>
                  <strong>ক্যাশ ক্লিয়ার হলেও কোনো ডেটা হারাবে না:</strong> ব্যবহারকারী বা ভিজিটর যে ডিভাইসেই সাইট ওপেন করুক না কেন, কোডিং ফাইলটি মূল ভিত্তি হওয়ায় কোনো পুরনো বা ডিফল্ট ডেটায় ফিরে যাবে না।
                </li>
                <li>
                  <strong>তাৎক্ষণিক সকল ট্যাবে ব্রডকাস্ট:</strong> এক ট্যাবে পরিবর্তন করার সাথে সাথে অন্য সকল ওপেন ব্রাউজার উইন্ডো ও স্টুডেন্ট সেশনে কোনো বিলম্ব ছাড়াই ডেটা আপডেট হয়ে যাবে।
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* ==================== TAB: SECURITY & CREDENTIALS ==================== */}
        {activeTab === 'security' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs max-w-xl mx-auto space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-xl font-bold text-slate-900">
                {lang === 'bn' ? 'অ্যাডমিন সিকিউরিটি ও পাসওয়ার্ড পরিবর্তন' : 'Admin Security & Password'}
              </h3>
              <p className="text-xs text-slate-500">
                {lang === 'bn' ? 'পাসওয়ার্ড সবসময় এনক্রিপ্টেড এবং মাস্কড থাকবে।' : 'Credentials are fully masked.'}
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (newPassword !== confirmPassword) {
                  showToast(lang === 'bn' ? 'পাসওয়ার্ড দুটি মেলেনি!' : 'Passwords do not match!');
                  return;
                }
                updateAdminCredentials(newEmail || adminCredentials.email, newPassword);
                setNewPassword('');
                setConfirmPassword('');
                showToast(lang === 'bn' ? 'পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে!' : 'Credentials updated!');
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">অ্যাডমিন ইমেইল / ইউজার আইডি</label>
                <input
                  type="email"
                  defaultValue={adminCredentials.email}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full border rounded-xl px-3 py-2 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">নতুন পাসওয়ার্ড</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border rounded-xl px-3 py-2 text-xs font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">নতুন পাসওয়ার্ড নিশ্চিত করুন</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border rounded-xl px-3 py-2 text-xs font-mono focus:outline-none"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
                >
                  <Lock className="w-4 h-4" />
                  <span>{lang === 'bn' ? 'পাসওয়ার্ড আপডেট করুন' : 'Update Password'}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Direct Edit Slide Modal */}
      {editingSlide && (
        <EditSlideModal
          slide={editingSlide}
          lang={lang}
          onSave={(updatedSlide) => {
            updateHeroSlide(updatedSlide);
            setEditingSlide(null);
            showToast(lang === 'bn' ? 'স্লাইড সফলভাবে আপডেট হয়েছে!' : 'Hero slide updated!');
            if (githubConfig.enabled && githubConfig.autoPushOnChange && githubConfig.token) {
              pushToGitHub('Updated hero slide: ' + updatedSlide.titleBn).catch(() => {});
            }
          }}
          onClose={() => setEditingSlide(null)}
        />
      )}

      {/* Direct Edit Course Modal */}
      {editingCourse && (
        <EditCourseModal
          course={editingCourse}
          lang={lang}
          onSave={(updatedCourse) => {
            updateCourse(updatedCourse);
            setEditingCourse(null);
            showToast(lang === 'bn' ? 'কোর্স সফলভাবে আপডেট হয়েছে!' : 'Course updated!');
            if (githubConfig.enabled && githubConfig.autoPushOnChange && githubConfig.token) {
              pushToGitHub('Updated course: ' + updatedCourse.titleBn).catch(() => {});
            }
          }}
          onClose={() => setEditingCourse(null)}
        />
      )}

      {/* Direct Edit Student Modal */}
      {editingStudent && (
        <EditStudentModal
          student={editingStudent}
          courses={courses}
          lang={lang}
          onSave={(updatedStudent) => {
            updateStudent(updatedStudent);
            setEditingStudent(null);
            showToast(lang === 'bn' ? 'শিক্ষার্থী তথ্য আপডেট হয়েছে!' : 'Student updated!');
            if (githubConfig.enabled && githubConfig.autoPushOnChange && githubConfig.token) {
              pushToGitHub('Updated student: ' + updatedStudent.nameBn).catch(() => {});
            }
          }}
          onClose={() => setEditingStudent(null)}
        />
      )}

      {/* Direct Edit Teacher Modal */}
      {editingTeacher && (
        <EditTeacherModal
          teacher={editingTeacher}
          lang={lang}
          onSave={(updatedTeacher) => {
            updateTeacher(updatedTeacher);
            setEditingTeacher(null);
            showToast(lang === 'bn' ? 'শিক্ষক প্রোফাইল আপডেট হয়েছে!' : 'Teacher updated!');
            if (githubConfig.enabled && githubConfig.autoPushOnChange && githubConfig.token) {
              pushToGitHub('Updated teacher: ' + updatedTeacher.nameBn).catch(() => {});
            }
          }}
          onClose={() => setEditingTeacher(null)}
        />
      )}

      {/* Direct Edit Video Class Modal */}
      {editingVideoClass && (
        <EditVideoClassModal
          video={editingVideoClass}
          lang={lang}
          onSave={(updatedVideo) => {
            updateVideoClass(updatedVideo);
            setEditingVideoClass(null);
            showToast(lang === 'bn' ? 'ফ্রি ক্লাস সফলভাবে আপডেট হয়েছে!' : 'Video class updated!');
            if (githubConfig.enabled && githubConfig.autoPushOnChange && githubConfig.token) {
              pushToGitHub('Updated video: ' + updatedVideo.titleBn).catch(() => {});
            }
          }}
          onDelete={(id) => {
            handleDeleteVideoClass(id, editingVideoClass.titleBn);
            setEditingVideoClass(null);
          }}
          onClose={() => setEditingVideoClass(null)}
        />
      )}

      {/* Teacher ID Card Modal */}
      {idCardTeacher && (
        <TeacherIdCardModal
          teacher={idCardTeacher}
          schoolSettings={schoolSettings}
          lang={lang}
          onClose={() => setIdCardTeacher(null)}
        />
      )}

      {/* Printable Result Sheet Modal */}
      {showPrintResultSheet && (
        <PrintableResultSheet
          results={results}
          students={students}
          courses={courses}
          subjects={subjects}
          exams={exams}
          academicYear="2026"
          selectedCourseId={courses[0]?.id || ''}
          selectedExamId={exams[0]?.id || ''}
          schoolSettings={schoolSettings}
          lang={lang}
          onClose={() => setShowPrintResultSheet(false)}
        />
      )}
    </div>
  );
};
