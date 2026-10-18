import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { EnrollmentModal } from './components/EnrollmentModal';
import { AIChatbot } from './components/AIChatbot';
import { CalculatorModal } from './components/CalculatorModal';
import { Home } from './pages/Home';
import { Courses } from './pages/Courses';
import { VideoClasses } from './pages/VideoClasses';
import { NotesResources } from './pages/NotesResources';
import { EducationalPosts } from './pages/EducationalPosts';
import { ExamSuggestions } from './pages/ExamSuggestions';
import { ModelTestQuiz } from './pages/ModelTestQuiz';
import { ResultsMarksheet } from './pages/ResultsMarksheet';
import { Dictionary } from './pages/Dictionary';
import { TeachersDirectory } from './pages/TeachersDirectory';
import { AboutTeacher } from './pages/AboutTeacher';
import { NoticeBoard } from './pages/NoticeBoard';
import { MyLearning } from './pages/MyLearning';
import { AdminPanel } from './pages/AdminPanel';
import { useApp } from './context/AppContext';
import { CheckCircle } from 'lucide-react';

export const App: React.FC = () => {
  const { toastMessage } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased font-sans">
      <Navbar />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/classes" element={<VideoClasses />} />
          <Route path="/notes" element={<NotesResources />} />
          <Route path="/posts" element={<EducationalPosts />} />
          <Route path="/suggestions" element={<ExamSuggestions />} />
          <Route path="/model-tests" element={<ModelTestQuiz />} />
          <Route path="/results" element={<ResultsMarksheet />} />
          <Route path="/dictionary" element={<Dictionary />} />
          <Route path="/teachers" element={<TeachersDirectory />} />
          <Route path="/about" element={<AboutTeacher />} />
          <Route path="/notices" element={<NoticeBoard />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/my-learning" element={<MyLearning />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />

      {/* Global Enrollment Modal */}
      <EnrollmentModal />

      {/* AI Educational Chatbot Module */}
      <AIChatbot />

      {/* Built-in Academic Calculator */}
      <CalculatorModal />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-bottom-5 duration-200">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
