import React, { useState } from 'react';
import { 
  Film, 
  Image as ImageIcon, 
  Video, 
  Play, 
  X, 
  Maximize2, 
  Calendar, 
  Sparkles, 
  ChevronRight,
  Filter
} from 'lucide-react';
import { GalleryItem } from '../types';

interface HomeGallerySectionProps {
  galleryItems: GalleryItem[];
  lang: 'bn' | 'en';
}

export const HomeGallerySection: React.FC<HomeGallerySectionProps> = ({ galleryItems, lang }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'image' | 'video'>('all');
  const [selectedMedia, setSelectedMedia] = useState<GalleryItem | null>(null);

  const filteredItems = galleryItems.filter((item) => {
    if (activeTab === 'all') return true;
    return item.type === activeTab;
  });

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header and Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-emerald-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Film className="w-4 h-4" />
            <span>{lang === 'bn' ? 'ফটো ও ভিডিও গ্যালারি' : 'Photo & Video Gallery'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {lang === 'bn' ? 'একাডেমির আনন্দঘন মুহূর্ত ও ক্লাস কার্যক্রম' : 'Moments & Class Activities at IHAS'}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {lang === 'bn' 
              ? 'পুরস্কার বিতরণী, সেমিনার, সরাসরি স্পোকেন ক্লাস ও ক্যাম্পাসের সুন্দর মুহূর্তসমূহ।' 
              : 'Memorable events, prize distribution, interactive spoken drills, and seminars.'}
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shrink-0">
          {[
            { id: 'all', label: lang === 'bn' ? `সব (${galleryItems.length})` : `All (${galleryItems.length})`, icon: null },
            { id: 'image', label: lang === 'bn' ? `ছবি (${galleryItems.filter(i => i.type === 'image').length})` : `Photos (${galleryItems.filter(i => i.type === 'image').length})`, icon: ImageIcon },
            { id: 'video', label: lang === 'bn' ? `ভিডিও (${galleryItems.filter(i => i.type === 'video').length})` : `Videos (${galleryItems.filter(i => i.type === 'video').length})`, icon: Video }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  activeTab === tab.id
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Gallery Cards Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-2">
          <Film className="w-12 h-12 text-slate-300 mx-auto" />
          <h4 className="font-bold text-sm text-slate-700">
            {lang === 'bn' ? 'কোনো গ্যালারি আইটেম পাওয়া যায়নি' : 'No items found'}
          </h4>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const isVideo = item.type === 'video';
            const displayImg = isVideo 
              ? (item.thumbnailUrl || 'https://images.unsplash.com/photo-1577495508048-b635879837f1?q=80&w=600')
              : item.mediaUrl;

            return (
              <div
                key={item.id}
                onClick={() => setSelectedMedia(item)}
                className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:border-emerald-400 hover:shadow-lg transition-all duration-300 cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  {/* Media Viewport */}
                  <div className="relative aspect-video overflow-hidden bg-slate-950">
                    <img
                      src={displayImg}
                      alt={lang === 'bn' ? item.titleBn : item.titleEn}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95 group-hover:opacity-100"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=600';
                      }}
                    />

                    {/* Overlay & Type Indicator */}
                    <div className="absolute inset-0 bg-black/25 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                      {isVideo ? (
                        <div className="w-14 h-14 rounded-full bg-emerald-600/90 group-hover:bg-emerald-500 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                          <Play className="w-6 h-6 fill-white ml-1" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all">
                          <Maximize2 className="w-4 h-4" />
                        </div>
                      )}
                    </div>

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase text-white shadow-xs flex items-center gap-1 ${
                        isVideo ? 'bg-indigo-600' : 'bg-emerald-600'
                      }`}>
                        {isVideo ? <Video className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
                        <span>{isVideo ? (lang === 'bn' ? 'ভিডিও' : 'Video') : (lang === 'bn' ? 'ছবি' : 'Photo')}</span>
                      </span>

                      {item.category && (
                        <span className="bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-lg">
                          {item.category}
                        </span>
                      )}
                    </div>

                    {item.isFeatured && (
                      <span className="absolute top-3 right-3 bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs flex items-center gap-0.5">
                        <Sparkles className="w-3 h-3" />
                        <span>FEATURED</span>
                      </span>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-2">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{item.date}</span>
                    </div>

                    <h3 className="font-bold text-sm text-slate-900 leading-snug line-clamp-2 group-hover:text-emerald-600 transition-colors">
                      {lang === 'bn' ? item.titleBn : item.titleEn}
                    </h3>

                    {(item.captionBn || item.captionEn) && (
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {lang === 'bn' ? item.captionBn : item.captionEn}
                      </p>
                    )}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-600 font-bold group-hover:underline">
                  <span>{isVideo ? (lang === 'bn' ? 'ভিডিও দেখুন ▶' : 'Watch Video ▶') : (lang === 'bn' ? 'ছবি বড় করে দেখুন 🔍' : 'View Full Image 🔍')}</span>
                  <span className="text-slate-400 font-normal text-[11px]">
                    {lang === 'bn' ? 'আই হ্যাভ এ স্কুল' : 'IHAS Academy'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Media Lightbox / Modal */}
      {selectedMedia && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
          onClick={() => setSelectedMedia(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500 text-slate-950">
                    {selectedMedia.type === 'video' ? 'ভিডিও' : 'ছবি'}
                  </span>
                  {selectedMedia.category && (
                    <span className="text-[11px] text-slate-300">
                      {selectedMedia.category}
                    </span>
                  )}
                  <span className="text-[11px] text-slate-400">• {selectedMedia.date}</span>
                </div>
                <h3 className="font-bold text-sm sm:text-base text-white">
                  {lang === 'bn' ? selectedMedia.titleBn : selectedMedia.titleEn}
                </h3>
              </div>
              <button
                onClick={() => setSelectedMedia(null)}
                className="p-2 text-white/70 hover:text-white rounded-xl hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Media Body */}
            <div className="bg-black flex items-center justify-center max-h-[75vh] overflow-hidden">
              {selectedMedia.type === 'image' ? (
                <img
                  src={selectedMedia.mediaUrl}
                  alt={selectedMedia.titleEn}
                  className="w-full h-auto max-h-[75vh] object-contain"
                />
              ) : selectedMedia.mediaUrl.includes('youtube.com') || selectedMedia.mediaUrl.includes('youtu.be') ? (
                <div className="w-full aspect-video">
                  <iframe
                    src={selectedMedia.mediaUrl.replace('watch?v=', 'embed/')}
                    title={selectedMedia.titleEn}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <video
                  src={selectedMedia.mediaUrl}
                  controls
                  autoPlay
                  className="w-full max-h-[75vh]"
                />
              )}
            </div>

            {/* Modal Footer Caption */}
            {(selectedMedia.captionBn || selectedMedia.captionEn) && (
              <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed">
                <p>{lang === 'bn' ? selectedMedia.captionBn : selectedMedia.captionEn}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
