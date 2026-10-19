import React, { useState } from 'react';
import { Play, Eye, CheckCircle, Search } from 'lucide-react';
import { VideoClass } from '../types';
import { VideoPlayerModal } from '../components/VideoPlayerModal';
import { useApp } from '../context/AppContext';

export const VideoClasses: React.FC = () => {
  const { videoClasses, watchedVideoIds, searchQuery, setSearchQuery, lang } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeVideo, setActiveVideo] = useState<VideoClass | null>(null);

  const categories = ['All', 'Grammar Hacks', 'Spoken English', 'HSC English', 'BCS & Govt Job'];

  const filteredVideos = videoClasses.filter((video: VideoClass) => {
    const title = lang === 'bn' ? video.titleBn : video.titleEn;
    const description = lang === 'bn' ? video.descriptionBn : video.descriptionEn;
    const matchesCategory = selectedCategory === 'All' || video.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
          {lang === 'bn' ? 'ফ্রি ভিডিও ক্লাসরুম' : 'Free Video Classroom'}
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {lang === 'bn' ? 'তুহিন স্যারের ফ্রি ভিডিও লেকচারসমূহ' : 'Free Video Lectures by Tuhin Sir'}
        </h1>
        <p className="text-sm text-slate-500 leading-relaxed">
          {lang === 'bn'
            ? 'অধ্যায়ভিত্তিক টাইমস্ট্যাম্প এবং প্রতিটি নিয়মের বিস্তারিত ব্যাখ্যাসহ সম্পূর্ণ ফ্রি ক্লাস।'
            : 'High-definition video lessons with chapter markers and key rule takeaways. Watch and master English at your own pace.'}
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={lang === 'bn' ? 'ক্লাস বা নিয়ম খুঁজুন...' : 'Search classes...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 text-xs rounded-lg pl-9 pr-3 py-2 outline-none"
          />
        </div>
      </div>

      {/* Watched Progress Banner */}
      <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-emerald-950 block">
              {lang === 'bn' ? 'আপনার অগ্রগতি:' : 'Your Learning Progress:'}
            </span>
            <span className="text-emerald-700">
              {lang === 'bn' 
                ? `আপনি ${videoClasses.length}টি ক্লাসের মধ্যে ${watchedVideoIds.length}টি ক্লাস সম্পন্ন করেছেন।`
                : `You have completed ${watchedVideoIds.length} of ${videoClasses.length} featured video lectures.`}
            </span>
          </div>
        </div>
        <div className="w-full sm:w-48 bg-emerald-200 rounded-full h-2.5 overflow-hidden">
          <div 
            className="bg-emerald-600 h-2.5 rounded-full transition-all"
            style={{ width: `${Math.min(100, (watchedVideoIds.length / (videoClasses.length || 1)) * 100)}%` }}
          />
        </div>
      </div>

      {/* Video Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map((video: VideoClass) => {
          const isWatched = watchedVideoIds.includes(video.id);
          const title = lang === 'bn' ? video.titleBn : video.titleEn;
          const description = lang === 'bn' ? video.descriptionBn : video.descriptionEn;

          return (
            <div
              key={video.id}
              onClick={() => setActiveVideo(video)}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:border-emerald-300 smooth-card cursor-pointer group flex flex-col justify-between"
            >
              <div>
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden bg-slate-900">
                  <img
                    src={video.thumbnailUrl}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                  />
                  
                  {/* Play Overlay */}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="absolute top-3 left-3">
                    <span className="bg-slate-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      {video.category}
                    </span>
                  </div>

                  {isWatched && (
                    <div className="absolute top-3 right-3 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 shadow-sm">
                      <CheckCircle className="w-3 h-3" /> {lang === 'bn' ? 'দেখা হয়েছে' : 'Watched'}
                    </div>
                  )}

                  <span className="absolute bottom-2 right-2 bg-black/80 font-mono text-white text-[10px] px-2 py-0.5 rounded">
                    {video.duration}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" /> {video.views} {lang === 'bn' ? 'ভিউ' : 'views'}
                    </span>
                    <span>{video.publishedDate}</span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 leading-snug line-clamp-2 group-hover:text-emerald-600 transition-colors">
                    {title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {description}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Level: {video.level}</span>
                <span className="text-emerald-600 font-bold group-hover:underline flex items-center gap-1">
                  {lang === 'bn' ? 'ক্লাস শুরু করুন' : 'Start Class'} <Play className="w-3 h-3 fill-emerald-600" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Video Player Modal */}
      <VideoPlayerModal video={activeVideo} onClose={() => setActiveVideo(null)} />
    </div>
  );
};
