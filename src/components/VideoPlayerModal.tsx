import React, { useState } from 'react';
import { X, CheckCircle, Clock, Eye, Share2 } from 'lucide-react';
import { VideoClass } from '../types';
import { useApp } from '../context/AppContext';

interface VideoPlayerModalProps {
  video: VideoClass | null;
  onClose: () => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({ video, onClose }) => {
  const { watchedVideoIds, markVideoWatched, showToast, lang } = useApp();
  const [activeTab, setActiveTab] = useState<'notes' | 'chapters'>('notes');

  if (!video) return null;

  const isWatched = watchedVideoIds.includes(video.id);
  const title = lang === 'bn' ? video.titleBn : video.titleEn;
  const description = lang === 'bn' ? video.descriptionBn : video.descriptionEn;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast(lang === 'bn' ? 'ভিডিও পাঠের লিঙ্ক কপি করা হয়েছে!' : 'Video lesson link copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm">
      <div 
        className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2.5 py-0.5 rounded-full font-semibold shrink-0">
              {video.category}
            </span>
            <h3 className="font-bold text-sm sm:text-base text-white truncate">
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player Frame */}
        <div className="relative aspect-video bg-black w-full overflow-hidden flex items-center justify-center">
          {video.videoFileUrl || (video.videoUrl && (video.videoUrl.startsWith('data:video') || video.videoUrl.endsWith('.mp4') || video.videoUrl.endsWith('.webm'))) ? (
            <video
              src={video.videoFileUrl || video.videoUrl}
              controls
              autoPlay
              className="w-full h-full object-contain"
            />
          ) : video.videoUrl && video.videoUrl.includes('facebook.com') ? (
            <iframe
              src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(video.videoUrl)}&show_text=false`}
              title={title}
              className="w-full h-full border-0"
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${video.youtubeId || 'dQw4w9WgXcQ'}?autoplay=1&rel=0`}
              title={title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>

        {/* Actions & Details Bar */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white leading-snug">
                {title}
              </h2>
              <div className="flex items-center gap-4 text-xs text-slate-400 mt-1">
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" /> {video.views} views
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {video.duration}
                </span>
                <span>Instructor: MD Touhidul Hoque Tuhin</span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleShare}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 flex items-center gap-1.5 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" /> {lang === 'bn' ? 'শেয়ার' : 'Share'}
              </button>
              <button
                onClick={() => markVideoWatched(video.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  isWatched
                    ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                {isWatched 
                  ? (lang === 'bn' ? 'সম্পন্ন হয়েছে' : 'Completed') 
                  : (lang === 'bn' ? 'দেখা হয়েছে মার্ক করুন' : 'Mark as Watched')}
              </button>
            </div>
          </div>

          {/* Tabs: Notes & Timestamps */}
          <div className="flex gap-2 border-b border-slate-800 pb-2">
            <button
              onClick={() => setActiveTab('notes')}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === 'notes'
                  ? 'bg-emerald-600/30 text-emerald-400 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {lang === 'bn' ? 'মূল নিয়ম ও হাইলাইটস' : 'Key Rules & Highlights'} ({video.keyNotes?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('chapters')}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === 'chapters'
                  ? 'bg-emerald-600/30 text-emerald-400 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {lang === 'bn' ? 'পাঠের অধ্যায়সমূহ' : 'Lesson Chapters'} ({video.chapters?.length || 0})
            </button>
          </div>

          {/* Content */}
          {activeTab === 'notes' ? (
            <div className="space-y-2">
              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                {description}
              </p>
              <div className="space-y-2">
                {video.keyNotes?.map((note, idx) => (
                  <div 
                    key={idx}
                    className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-start gap-2.5 text-xs text-slate-200"
                  >
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-[10px]">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{note}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              {video.chapters?.map((ch, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/40 hover:bg-slate-800 text-xs text-slate-300 transition-colors"
                >
                  <span className="font-medium">{ch.title}</span>
                  <span className="font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                    {ch.time}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
