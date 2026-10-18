import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  User, 
  LogOut, 
  Settings, 
  BookOpen, 
  Users, 
  Award, 
  Layers, 
  Image, 
  FileText, 
  Video, 
  Bell, 
  Plus, 
  Trash2, 
  Edit, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Save, 
  Printer, 
  SlidersHorizontal,
  ChevronRight,
  ExternalLink,
  GraduationCap
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Course, Student, CourseSubject, CourseExam, StudentResult, Teacher, HeroSlide, VideoClass, NoteResource, Notice } from '../types';

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
    deleteHeroSlide,
    courses,
    addCourse,
    deleteCourse,
    students,
    addStudent,
    deleteStudent,
    subjects,
    addSubject,
    exams,
    addExam,
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
    showToast
  } = useApp();

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<
    'settings' | 'slides' | 'courses' | 'students' | 'subjects_exams' | 'results' | 'teachers' | 'classes' | 'notes' | 'notices' | 'security'
  >('settings');

  // Change Credentials State
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Settings form state
  const [settingsForm, setSettingsForm] = useState(schoolSettings);

  // New Slide State
  const [newSlide, setNewSlide] = useState<Partial<HeroSlide>>({
    titleEn: '',
    titleBn: '',
    subtitleEn: '',
    subtitleBn: '',
    imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1200&auto=format&fit=crop',
    buttonTextEn: 'Explore Courses',
    buttonTextBn: 'কোর্সগুলো দেখুন',
    buttonUrl: '/courses',
    active: true
  });

  // Student Filter & Form State
  const [studentFilterYear, setStudentFilterYear] = useState('2026');
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
    admissionDate: new Date().toISOString().split('T')[0]
  });

  // Subjects & Exams State
  const [selectedCourseForSetup, setSelectedCourseForSetup] = useState(courses[0]?.id || 'course-1');
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectFullMarks, setNewSubjectFullMarks] = useState(100);
  const [newSubjectPassMarks, setNewSubjectPassMarks] = useState(40);
  const [newExamName, setNewExamName] = useState('');
  const [newExamType, setNewExamType] = useState('Term Exam');
  const [newExamDate, setNewExamDate] = useState(new Date().toISOString().split('T')[0]);

  // Results Entry State
  const [resYear, setResYear] = useState('2026');
  const [resCourseId, setResCourseId] = useState(courses[0]?.id || 'course-1');
  const [resExamId, setResExamId] = useState(exams[0]?.id || 'exam-1');
  const [resRoll, setResRoll] = useState('');
  const [resSubjectMarks, setResSubjectMarks] = useState<Record<string, number>>({});

  // Auto-filled student for result
  const autoStudent = students.find(
    (s: Student) => s.roll === resRoll && s.academicYear === resYear && s.courseId === resCourseId
  );

  // Filtered subjects for current course
  const currentCourseSubjects = subjects.filter((s: CourseSubject) => s.courseId === resCourseId);

  // Login handler
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const success = loginAdmin(loginEmail.trim(), loginPassword);
    if (!success) {
      setLoginError(lang === 'bn' ? 'ভুল ইউজার আইডি বা পাসওয়ার্ড! অনুগ্রহ করে আবার চেষ্টা করুন।' : 'Invalid ID or Password! Please try again.');
    } else {
      showToast(lang === 'bn' ? 'অ্যাডমিন ড্যাশবোর্ডে স্বাগতম!' : 'Welcome to Admin Dashboard!');
    }
  };

  // Change credentials handler
  const handleChangeCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !newPassword) {
      showToast(lang === 'bn' ? 'ইমেইল এবং পাসওয়ার্ড উভয়ই দিন।' : 'Please provide both email and password.');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast(lang === 'bn' ? 'পাসওয়ার্ড দুটি মিলেনি!' : 'Passwords do not match!');
      return;
    }
    updateAdminCredentials(newEmail.trim(), newPassword);
    setNewEmail('');
    setNewPassword('');
    setConfirmPassword('');
    showToast(lang === 'bn' ? 'অ্যাডমিন ক্রডেনশিয়াল সফলভাবে পরিবর্তিত হয়েছে!' : 'Admin credentials updated successfully!');
  };

  // Save Settings handler
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSchoolSettings(settingsForm);
    showToast(lang === 'bn' ? 'স্কুলের তথ্য ও লোগো আপডেট হয়েছে!' : 'School settings and branding saved!');
  };

  // Add Slide handler
  const handleAddSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlide.titleEn || !newSlide.imageUrl) return;
    addHeroSlide({
      id: `slide-${Date.now()}`,
      titleEn: newSlide.titleEn || '',
      titleBn: newSlide.titleBn || newSlide.titleEn || '',
      subtitleEn: newSlide.subtitleEn || '',
      subtitleBn: newSlide.subtitleBn || '',
      imageUrl: newSlide.imageUrl || '',
      buttonTextEn: newSlide.buttonTextEn || 'Explore',
      buttonTextBn: newSlide.buttonTextBn || 'কোর্স দেখুন',
      buttonUrl: newSlide.buttonUrl || '/courses',
      active: true
    });
    setNewSlide({
      titleEn: '',
      titleBn: '',
      subtitleEn: '',
      subtitleBn: '',
      imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1200&auto=format&fit=crop',
      buttonTextEn: 'Explore Courses',
      buttonTextBn: 'কোর্সগুলো দেখুন',
      buttonUrl: '/courses',
      active: true
    });
    showToast(lang === 'bn' ? 'নতুন হিরো স্লাইড যোগ হয়েছে!' : 'New hero slide added!');
  };

  // Add Student handler
  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.roll || !newStudent.nameEn) {
      showToast(lang === 'bn' ? 'রোল এবং নাম আবশ্যক!' : 'Roll and Name are required!');
      return;
    }
    addStudent({
      id: `std-${Date.now()}`,
      academicYear: newStudent.academicYear || '2026',
      courseId: newStudent.courseId || courses[0]?.id || 'course-1',
      roll: newStudent.roll,
      nameEn: newStudent.nameEn,
      nameBn: newStudent.nameBn || newStudent.nameEn,
      fatherNameEn: newStudent.fatherNameEn || '',
      fatherNameBn: newStudent.fatherNameBn || '',
      motherNameEn: newStudent.motherNameEn || '',
      motherNameBn: newStudent.motherNameBn || '',
      address: newStudent.address || '',
      phone: newStudent.phone || '',
      admissionDate: newStudent.admissionDate || new Date().toISOString().split('T')[0]
    });
    setNewStudent({
      ...newStudent,
      roll: '',
      nameEn: '',
      nameBn: '',
      phone: ''
    });
    showToast(lang === 'bn' ? 'শিক্ষার্থী সফলভাবে তালিকাভুক্ত হয়েছে!' : 'Student enrolled into database!');
  };

  // Add Subject handler
  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjectName) return;
    addSubject({
      id: `sub-${Date.now()}`,
      courseId: selectedCourseForSetup,
      name: newSubjectName,
      fullMarks: Number(newSubjectFullMarks),
      passMarks: Number(newSubjectPassMarks)
    });
    setNewSubjectName('');
    showToast('Subject added to course!');
  };

  // Add Exam handler
  const handleAddExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExamName) return;
    addExam({
      id: `exam-${Date.now()}`,
      courseId: selectedCourseForSetup,
      name: newExamName,
      examType: newExamType,
      date: newExamDate
    });
    setNewExamName('');
    showToast('Exam added to course schedule!');
  };

  // Save Result handler
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
                  type="text"
                  required
                  placeholder="tuhinsir@gmail.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-3 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                {lang === 'bn' ? 'সিক্রেট পাসওয়ার্ড (মাস্কড)' : 'Password (Completely Masked)'}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
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
              <p className="text-[10px] text-slate-500 mt-1">
                {lang === 'bn' ? '* পাসওয়ার্ডটি সম্পূর্ণ লুকায়িত থাকবে।' : '* Password is fully masked for privacy.'}
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm rounded-xl transition-all shadow-md mt-2"
            >
              {lang === 'bn' ? 'নিরাপদে প্রবেশ করুন' : 'Authenticate & Enter'}
            </button>
          </form>

          {/* Helper hint for default demo login */}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/60 text-[11px] text-slate-400 space-y-1">
            <span className="font-bold text-emerald-400 block">Default Credentials:</span>
            <div className="flex justify-between font-mono text-[10px]">
              <span>ID: <strong className="text-slate-200">tuhinsir@gmail.com</strong></span>
              <span>Pass: <strong className="text-slate-200">tuhinsir1234</strong></span>
            </div>
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
            { id: 'slides', label: lang === 'bn' ? 'হিরো স্লাইডার' : 'Hero Slider', icon: Image },
            { id: 'courses', label: lang === 'bn' ? 'কোর্স কন্ট্রোল' : 'Courses', icon: BookOpen },
            { id: 'students', label: lang === 'bn' ? 'শিক্ষার্থী তালিকা' : 'Student Roster', icon: Users },
            { id: 'subjects_exams', label: lang === 'bn' ? 'বিষয় ও পরীক্ষা সেটআপ' : 'Subjects & Exams', icon: Layers },
            { id: 'results', label: lang === 'bn' ? 'ফলাফল এন্ট্রি' : 'Result Entry', icon: Award },
            { id: 'teachers', label: lang === 'bn' ? 'শিক্ষক ও সিল/স্বাক্ষর' : 'Teachers & Seals', icon: GraduationCap },
            { id: 'classes', label: lang === 'bn' ? 'ফ্রি ক্লাস' : 'Free Classes', icon: Video },
            { id: 'notes', label: lang === 'bn' ? 'নোটস ও শিট' : 'Notes & PDFs', icon: FileText },
            { id: 'notices', label: lang === 'bn' ? 'নোটিশ বোর্ড' : 'Notices', icon: Bell },
            { id: 'security', label: lang === 'bn' ? 'সিকিউরিটি সেটিংস' : 'Security', icon: Lock }
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

        {/* TAB 1: School Branding, Logo & Footer */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-xl font-bold text-slate-900">
                {lang === 'bn' ? 'প্রতিষ্ঠান সেটিংস, লোগো ও ফুটার কন্ট্রোল' : 'Institution Branding, Logo & Footer Setup'}
              </h3>
              <p className="text-xs text-slate-500">
                {lang === 'bn' ? 'এখানে যে তথ্য দেবেন তা ওয়েবসাইটের হেডার, ফুটার এবং মার্কশিটে তাৎক্ষণিক প্রদর্শিত হবে।' : 'Information configured here reflects globally across header, footer, and transcripts.'}
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Institute Name (English)</label>
                  <input
                    type="text"
                    required
                    value={settingsForm.instituteNameEn}
                    onChange={(e) => setSettingsForm({ ...settingsForm, instituteNameEn: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">প্রতিষ্ঠানের নাম (বাংলা)</label>
                  <input
                    type="text"
                    required
                    value={settingsForm.instituteNameBn}
                    onChange={(e) => setSettingsForm({ ...settingsForm, instituteNameBn: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Logo Image URL</label>
                  <input
                    type="text"
                    value={settingsForm.logoUrl}
                    onChange={(e) => setSettingsForm({ ...settingsForm, logoUrl: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Official WhatsApp Phone (Number with 880)</label>
                  <input
                    type="text"
                    value={settingsForm.whatsapp}
                    onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Hotline / Support Phone</label>
                  <input
                    type="text"
                    value={settingsForm.phone}
                    onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Official Email</label>
                  <input
                    type="email"
                    value={settingsForm.email}
                    onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Address (English)</label>
                  <input
                    type="text"
                    value={settingsForm.addressEn}
                    onChange={(e) => setSettingsForm({ ...settingsForm, addressEn: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ঠিকানা (বাংলা)</label>
                  <input
                    type="text"
                    value={settingsForm.addressBn}
                    onChange={(e) => setSettingsForm({ ...settingsForm, addressBn: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors shadow-xs flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{lang === 'bn' ? 'সেটিংস সংরক্ষণ করুন' : 'Save Institutional Settings'}</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 2: Hero Slider */}
        {activeTab === 'slides' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-base text-slate-900">
                {lang === 'bn' ? 'হোমপেজ হিরো স্লাইডসমূহ' : 'Homepage Hero Slides'} ({heroSlides.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {heroSlides.map((slide: HeroSlide) => (
                  <div key={slide.id} className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50 flex flex-col justify-between">
                    <div>
                      <img src={slide.imageUrl} alt={slide.titleEn} className="w-full h-32 object-cover" />
                      <div className="p-4 space-y-1 text-xs">
                        <strong className="block text-slate-900 line-clamp-1">{slide.titleEn}</strong>
                        <p className="text-[11px] text-slate-500 line-clamp-1">{slide.titleBn}</p>
                        <p className="text-[10px] text-slate-400 truncate">URL: {slide.buttonUrl}</p>
                      </div>
                    </div>
                    <div className="p-3 bg-white border-t border-slate-200 flex justify-between items-center text-xs">
                      <span className="text-emerald-600 font-bold">Active Slide</span>
                      <button
                        onClick={() => deleteHeroSlide(slide.id)}
                        className="text-rose-500 hover:text-rose-700"
                        title="Delete Slide"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Add New Slide Form */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h4 className="font-bold text-sm text-slate-900">
                {lang === 'bn' ? 'নতুন হিরো স্লাইড যোগ করুন' : 'Add New Hero Slide'}
              </h4>
              <form onSubmit={handleAddSlide} className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Slide Title (English) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Master English with Tuhin Sir"
                    value={newSlide.titleEn}
                    onChange={(e) => setNewSlide({ ...newSlide, titleEn: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">স্লাইড শিরোনাম (বাংলা)</label>
                  <input
                    type="text"
                    placeholder="e.g. তুহিন স্যারের সাথে সহজে ইংরেজি শিখুন"
                    value={newSlide.titleBn}
                    onChange={(e) => setNewSlide({ ...newSlide, titleBn: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-medium text-slate-700 mb-1">Image URL *</label>
                  <input
                    type="text"
                    required
                    value={newSlide.imageUrl}
                    onChange={(e) => setNewSlide({ ...newSlide, imageUrl: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" /> Add Slide
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TAB 3: Student Management & Admission */}
        {activeTab === 'students' && (
          <div className="space-y-6">
            {/* Filter and roster */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-bold text-lg text-slate-900">
                    {lang === 'bn' ? 'শিক্ষার্থী তালিকা ও ব্যাচ ম্যানেজমেন্ট' : 'Student Roster & Batch Management'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {lang === 'bn' ? `মোট শিক্ষার্থী: ${filteredStudents.length} জন` : `Total Enrolled: ${filteredStudents.length}`}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={studentFilterYear}
                    onChange={(e) => setStudentFilterYear(e.target.value)}
                    className="border border-slate-200 rounded-xl px-3 py-1.5 text-xs bg-slate-50"
                  >
                    <option value="all">All Years</option>
                    <option value="2026">Year 2026</option>
                    <option value="2025">Year 2025</option>
                  </select>

                  <select
                    value={studentFilterCourse}
                    onChange={(e) => setStudentFilterCourse(e.target.value)}
                    className="border border-slate-200 rounded-xl px-3 py-1.5 text-xs bg-slate-50"
                  >
                    <option value="all">All Courses</option>
                    {courses.map((c: Course) => (
                      <option key={c.id} value={c.id}>{c.titleEn}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Students Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-600 uppercase border-b border-slate-200 font-bold">
                    <tr>
                      <th className="p-3">Roll</th>
                      <th className="p-3">Student Name (EN/BN)</th>
                      <th className="p-3">Father & Mother</th>
                      <th className="p-3">Course & Year</th>
                      <th className="p-3">Phone</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredStudents.map((std: Student) => {
                      const c = courses.find((x: Course) => x.id === std.courseId);
                      return (
                        <tr key={std.id} className="hover:bg-slate-50/60">
                          <td className="p-3 font-mono font-bold text-emerald-700">{std.roll}</td>
                          <td className="p-3">
                            <strong className="block text-slate-900">{std.nameEn}</strong>
                            <span className="text-[11px] text-slate-500">{std.nameBn}</span>
                          </td>
                          <td className="p-3 text-slate-600">
                            <span>F: {std.fatherNameEn || '-'}</span>
                            <span className="block text-[11px] text-slate-400">M: {std.motherNameEn || '-'}</span>
                          </td>
                          <td className="p-3">
                            <span className="text-slate-800 font-medium block truncate max-w-[180px]">{c?.titleEn}</span>
                            <span className="text-[10px] bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded font-bold">{std.academicYear}</span>
                          </td>
                          <td className="p-3 font-mono">{std.phone}</td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => deleteStudent(std.id)}
                              className="text-rose-500 hover:text-rose-700 p-1"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Add Student Form */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-emerald-600" />
                {lang === 'bn' ? 'নতুন শিক্ষার্থী ভর্তি / এন্ট্রি ফরম' : 'Add New Student Entry'}
              </h4>
              <form onSubmit={handleAddStudent} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Academic Year *</label>
                  <select
                    value={newStudent.academicYear}
                    onChange={(e) => setNewStudent({ ...newStudent, academicYear: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs bg-slate-50"
                  >
                    <option value="2026">2026</option>
                    <option value="2025">2025</option>
                    <option value="2027">2027</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Course *</label>
                  <select
                    value={newStudent.courseId}
                    onChange={(e) => setNewStudent({ ...newStudent, courseId: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs bg-slate-50"
                  >
                    {courses.map((c: Course) => (
                      <option key={c.id} value={c.id}>{c.titleEn}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Roll Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 104"
                    value={newStudent.roll}
                    onChange={(e) => setNewStudent({ ...newStudent, roll: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Student Name (English) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Shakil Mahmud"
                    value={newStudent.nameEn}
                    onChange={(e) => setNewStudent({ ...newStudent, nameEn: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">শিক্ষার্থীর নাম (বাংলা)</label>
                  <input
                    type="text"
                    placeholder="e.g. শাকিল মাহমুদ"
                    value={newStudent.nameBn}
                    onChange={(e) => setNewStudent({ ...newStudent, nameBn: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Mobile (WhatsApp) *</label>
                  <input
                    type="tel"
                    required
                    placeholder="017xxxxxxxx"
                    value={newStudent.phone}
                    onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Father's Name (পিতার নাম)</label>
                  <input
                    type="text"
                    placeholder="Father's Name"
                    value={newStudent.fatherNameEn}
                    onChange={(e) => setNewStudent({ ...newStudent, fatherNameEn: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Mother's Name (মাতার নাম)</label>
                  <input
                    type="text"
                    placeholder="Mother's Name"
                    value={newStudent.motherNameEn}
                    onChange={(e) => setNewStudent({ ...newStudent, motherNameEn: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Address / District</label>
                  <input
                    type="text"
                    placeholder="Dhaka, Bangladesh"
                    value={newStudent.address}
                    onChange={(e) => setNewStudent({ ...newStudent, address: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-3">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" /> Save Student Record
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TAB 4: Course Subjects & Exams Setup */}
        {activeTab === 'subjects_exams' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h3 className="font-bold text-lg text-slate-900">
                  {lang === 'bn' ? 'কোর্সভিত্তিক বিষয় ও পরীক্ষা সেটআপ' : 'Course Subjects & Exams Setup'}
                </h3>
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-slate-600">Select Course:</span>
                  <select
                    value={selectedCourseForSetup}
                    onChange={(e) => setSelectedCourseForSetup(e.target.value)}
                    className="border border-slate-200 rounded-xl px-3 py-1.5 bg-slate-50 font-bold"
                  >
                    {courses.map((c: Course) => (
                      <option key={c.id} value={c.id}>{c.titleEn}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Current Subjects & Exams Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {/* Subjects Column */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                  <h4 className="font-bold text-sm text-slate-900 border-b border-slate-200 pb-2">
                    {lang === 'bn' ? 'বর্তমান বিষয়সমূহ' : 'Registered Subjects'}
                  </h4>
                  <div className="space-y-2">
                    {subjects.filter((s: CourseSubject) => s.courseId === selectedCourseForSetup).map((sub: CourseSubject) => (
                      <div key={sub.id} className="p-3 rounded-xl bg-white border border-slate-200 flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-800">{sub.name}</span>
                        <span className="text-slate-500 font-mono">Full: {sub.fullMarks} | Pass: {sub.passMarks}</span>
                      </div>
                    ))}
                  </div>

                  {/* Add Subject mini form */}
                  <form onSubmit={handleAddSubject} className="pt-2 space-y-2 text-xs border-t border-slate-200">
                    <strong className="block text-slate-800">Add New Subject:</strong>
                    <input
                      type="text"
                      required
                      placeholder="Subject Name (e.g. Vocabulary & Modifiers)"
                      value={newSubjectName}
                      onChange={(e) => setNewSubjectName(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs"
                    />
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Full Marks"
                        value={newSubjectFullMarks}
                        onChange={(e) => setNewSubjectFullMarks(Number(e.target.value))}
                        className="w-1/2 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs"
                      />
                      <input
                        type="number"
                        placeholder="Pass Marks"
                        value={newSubjectPassMarks}
                        onChange={(e) => setNewSubjectPassMarks(Number(e.target.value))}
                        className="w-1/2 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs"
                      />
                    </div>
                    <button type="submit" className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs">
                      + Add Subject
                    </button>
                  </form>
                </div>

                {/* Exams Column */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                  <h4 className="font-bold text-sm text-slate-900 border-b border-slate-200 pb-2">
                    {lang === 'bn' ? 'নির্ধারিত পরীক্ষাসমূহ' : 'Configured Exams'}
                  </h4>
                  <div className="space-y-2">
                    {exams.filter((e: CourseExam) => e.courseId === selectedCourseForSetup).map((ex: CourseExam) => (
                      <div key={ex.id} className="p-3 rounded-xl bg-white border border-slate-200 flex justify-between items-center text-xs">
                        <div>
                          <strong className="text-slate-800 block">{ex.name}</strong>
                          <span className="text-[10px] text-slate-400">{ex.examType}</span>
                        </div>
                        <span className="font-mono text-emerald-700 text-[11px]">{ex.date}</span>
                      </div>
                    ))}
                  </div>

                  {/* Add Exam mini form */}
                  <form onSubmit={handleAddExam} className="pt-2 space-y-2 text-xs border-t border-slate-200">
                    <strong className="block text-slate-800">Add New Exam:</strong>
                    <input
                      type="text"
                      required
                      placeholder="Exam Name (e.g. Model Test 01)"
                      value={newExamName}
                      onChange={(e) => setNewExamName(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs"
                    />
                    <div className="flex gap-2">
                      <select
                        value={newExamType}
                        onChange={(e) => setNewExamType(e.target.value)}
                        className="w-1/2 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs"
                      >
                        <option value="Term Exam">Term Exam</option>
                        <option value="Midterm">Midterm</option>
                        <option value="Pre-Test">Pre-Test</option>
                        <option value="Final Model">Final Model</option>
                      </select>
                      <input
                        type="date"
                        value={newExamDate}
                        onChange={(e) => setNewExamDate(e.target.value)}
                        className="w-1/2 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs"
                      />
                    </div>
                    <button type="submit" className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs">
                      + Add Exam Schedule
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: Result Entry & Management */}
        {activeTab === 'results' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold text-slate-900">
                  {lang === 'bn' ? 'ফলাফল ও মার্কস এন্ট্রি মডিউল' : 'Student Result Entry Module'}
                </h3>
                <p className="text-xs text-slate-500">
                  {lang === 'bn' ? 'শিক্ষাবর্ষ, কোর্স ও রোল দিলেই শিক্ষার্থীর নাম অটো চলে আসবে। বিষয়ভিত্তিক নম্বর দিলে স্বয়ংক্রিয়ভাবে মোট নম্বর ও জিপিএ হিসাব হবে।' : 'Student name auto-populates upon selecting Course and Roll. Marks calculation and GPA auto-computed.'}
                </p>
              </div>

              <form onSubmit={handleSaveResult} className="space-y-4 text-xs">
                {/* Selectors */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Academic Year</label>
                    <select
                      value={resYear}
                      onChange={(e) => setResYear(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs"
                    >
                      <option value="2026">2026</option>
                      <option value="2025">2025</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Course</label>
                    <select
                      value={resCourseId}
                      onChange={(e) => {
                        setResCourseId(e.target.value);
                        setResSubjectMarks({});
                      }}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs"
                    >
                      {courses.map((c: Course) => (
                        <option key={c.id} value={c.id}>{c.titleEn}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Exam Type</label>
                    <select
                      value={resExamId}
                      onChange={(e) => setResExamId(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs"
                    >
                      {exams.filter((x: CourseExam) => x.courseId === resCourseId).map((ex: CourseExam) => (
                        <option key={ex.id} value={ex.id}>{ex.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Student Roll *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 101"
                      value={resRoll}
                      onChange={(e) => setResRoll(e.target.value.trim())}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold"
                    />
                  </div>
                </div>

                {/* Auto Student Info Snapshot */}
                {autoStudent ? (
                  <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center justify-between text-xs text-emerald-950">
                    <div>
                      <span className="font-bold block text-sm">{autoStudent.nameEn} ({autoStudent.nameBn})</span>
                      <span className="text-emerald-700">Roll: {autoStudent.roll} • Father: {autoStudent.fatherNameEn} • Mobile: {autoStudent.phone}</span>
                    </div>
                    <span className="bg-emerald-600 text-white font-bold px-2 py-0.5 rounded text-[10px]">
                      VERIFIED STUDENT
                    </span>
                  </div>
                ) : resRoll ? (
                  <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl text-xs text-rose-700">
                    No student found with Roll: "{resRoll}" in this course. Please verify from Student Roster.
                  </div>
                ) : null}

                {/* Subject Marks Input */}
                {currentCourseSubjects.length > 0 && autoStudent && (
                  <div className="space-y-3 pt-2">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                      Input Subject Marks:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {currentCourseSubjects.map((sub: CourseSubject) => (
                        <div key={sub.id} className="p-3 rounded-xl border border-slate-200 bg-white space-y-1">
                          <label className="block font-bold text-slate-800 text-xs">
                            {sub.name} (Full: {sub.fullMarks})
                          </label>
                          <input
                            type="number"
                            required
                            min={0}
                            max={sub.fullMarks}
                            placeholder="Enter marks"
                            value={resSubjectMarks[sub.id] || ''}
                            onChange={(e) => setResSubjectMarks({
                              ...resSubjectMarks,
                              [sub.id]: Number(e.target.value)
                            })}
                            className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold"
                          />
                        </div>
                      ))}
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-sm flex items-center gap-1.5 mt-2"
                    >
                      <Save className="w-4 h-4" /> Calculate & Save Result
                    </button>
                  </div>
                )}
              </form>
            </div>

            {/* Existing Results Table */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-base text-slate-900">
                {lang === 'bn' ? 'সকল সংরক্ষিত ফলাফল' : 'Published Results Database'} ({results.length})
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold uppercase">
                    <tr>
                      <th className="p-3">Roll</th>
                      <th className="p-3">Total Marks</th>
                      <th className="p-3">Percentage</th>
                      <th className="p-3">GPA (5.00)</th>
                      <th className="p-3">Grade</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {results.map((res: StudentResult) => (
                      <tr key={res.id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-emerald-700">{res.studentRoll}</td>
                        <td className="p-3 font-mono font-bold">{res.totalMarks} / {res.totalFullMarks}</td>
                        <td className="p-3 font-mono">{res.percentage.toFixed(1)}%</td>
                        <td className="p-3 font-mono font-bold text-emerald-700">{res.gpa.toFixed(2)}</td>
                        <td className="p-3 font-bold text-slate-900">{res.grade}</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => deleteResult(res.id)}
                            className="text-rose-500 hover:text-rose-700 p-1"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: Teacher Management & Seals */}
        {activeTab === 'teachers' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold text-slate-900">
                  {lang === 'bn' ? 'প্রধান শিক্ষকের স্বাক্ষর ও অফিশিয়াল সিল' : 'Principal Signature & Official Seal Setup'}
                </h3>
                <p className="text-xs text-slate-500">
                  {lang === 'bn' ? 'এখানে আপলোডকৃত স্বাক্ষর ও সিল স্বয়ংক্রিয়ভাবে মার্কশিট এবং শিক্ষক আইডি কার্ডে প্রিন্ট হবে।' : 'These signatures and institutional stamps are automatically embossed onto marksheets and ID cards.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
                  <label className="block font-bold text-slate-800">Headmaster Signature URL</label>
                  <input
                    type="text"
                    value={settingsForm.headmasterSignatureUrl}
                    onChange={(e) => setSettingsForm({ ...settingsForm, headmasterSignatureUrl: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs"
                  />
                  <div className="h-16 flex items-center justify-center bg-white rounded-xl border border-slate-200 p-2">
                    <img src={settingsForm.headmasterSignatureUrl} alt="Signature Preview" className="h-full object-contain" />
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
                  <label className="block font-bold text-slate-800">Official Seal / Stamp URL</label>
                  <input
                    type="text"
                    value={settingsForm.officialSealUrl}
                    onChange={(e) => setSettingsForm({ ...settingsForm, officialSealUrl: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs"
                  />
                  <div className="h-16 flex items-center justify-center bg-white rounded-xl border border-slate-200 p-2">
                    <img src={settingsForm.officialSealUrl} alt="Seal Preview" className="h-full object-contain" />
                  </div>
                </div>
              </div>

              <button
                onClick={handleSaveSettings}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" /> Save Seal & Signature
              </button>
            </div>

            {/* Teachers list */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-base text-slate-900">
                {lang === 'bn' ? 'নিযুক্ত শিক্ষক তালিকা' : 'Faculty Roster'} ({teachers.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {teachers.map((tch: Teacher) => (
                  <div key={tch.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <img src={tch.photoUrl} alt={tch.nameEn} className="w-12 h-12 rounded-xl object-cover" />
                      <div>
                        <strong className="block text-slate-900">{tch.nameEn}</strong>
                        <span className="text-[11px] text-emerald-700 font-medium">{tch.designationEn}</span>
                      </div>
                    </div>
                    {!tch.isHeadmaster && (
                      <button onClick={() => deleteTeacher(tch.id)} className="text-rose-500 hover:text-rose-700">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: Security (Change Credentials) */}
        {activeTab === 'security' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs max-w-xl mx-auto space-y-6">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                {lang === 'bn' ? 'অ্যাডমিন আইডি ও পাসওয়ার্ড পরিবর্তন' : 'Change Admin Credentials'}
              </h3>
              <p className="text-xs text-slate-500">
                {lang === 'bn' ? 'যেকোনো সময় আপনার লগইন ইমেইল এবং পাসওয়ার্ড নিরাপদে পরিবর্তন করতে পারেন।' : 'Update your administrator email / ID and secret password.'}
              </p>
            </div>

            <form onSubmit={handleChangeCredentials} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {lang === 'bn' ? 'নতুন অ্যাডমিন ইমেইল / ইউজার আইডি' : 'New Admin Email / ID *'}
                </label>
                <input
                  type="email"
                  required
                  placeholder="newadmin@gmail.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {lang === 'bn' ? 'নতুন পাসওয়ার্ড (মাস্কড)' : 'New Password *'}
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:border-emerald-500 focus:outline-none tracking-widest"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {lang === 'bn' ? 'পাসওয়ার্ড নিশ্চিত করুন' : 'Confirm New Password *'}
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:border-emerald-500 focus:outline-none tracking-widest"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors shadow-xs"
              >
                {lang === 'bn' ? 'ক্রডেনশিয়াল আপডেট করুন' : 'Save New Credentials'}
              </button>
            </form>
          </div>
        )}

        {/* TAB 8: Free Classes, Notes & Notices Quick Panels */}
        {(activeTab === 'classes' || activeTab === 'notes' || activeTab === 'notices' || activeTab === 'courses') && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4 text-xs">
            <h3 className="font-bold text-base text-slate-900 capitalize">
              {activeTab} Management Desk
            </h3>
            <p className="text-slate-500">
              Active items are dynamically connected to state and render with instant bilingual translation on public pages.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeTab === 'classes' && videoClasses.map((v: VideoClass) => (
                <div key={v.id} className="p-3 border border-slate-200 rounded-xl flex justify-between items-center">
                  <div>
                    <strong className="block text-slate-900">{v.titleEn}</strong>
                    <span className="text-slate-400">{v.duration} • {v.category}</span>
                  </div>
                  <button onClick={() => deleteVideoClass(v.id)} className="text-rose-500 hover:text-rose-700">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {activeTab === 'notes' && notes.map((n: NoteResource) => (
                <div key={n.id} className="p-3 border border-slate-200 rounded-xl flex justify-between items-center">
                  <div>
                    <strong className="block text-slate-900">{n.titleEn}</strong>
                    <span className="text-slate-400">{n.subject} • {n.fileSize}</span>
                  </div>
                  <button onClick={() => deleteNote(n.id)} className="text-rose-500 hover:text-rose-700">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {activeTab === 'notices' && notices.map((nt: Notice) => (
                <div key={nt.id} className="p-3 border border-slate-200 rounded-xl flex justify-between items-center">
                  <div>
                    <strong className="block text-slate-900">{nt.titleEn}</strong>
                    <span className="text-slate-400">{nt.date} • {nt.category}</span>
                  </div>
                  <button onClick={() => deleteNotice(nt.id)} className="text-rose-500 hover:text-rose-700">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {activeTab === 'courses' && courses.map((c: Course) => (
                <div key={c.id} className="p-3 border border-slate-200 rounded-xl flex justify-between items-center">
                  <div>
                    <strong className="block text-slate-900">{c.titleEn}</strong>
                    <span className="text-slate-400">৳{c.price} • {c.durationEn}</span>
                  </div>
                  <button onClick={() => deleteCourse(c.id)} className="text-rose-500 hover:text-rose-700">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
