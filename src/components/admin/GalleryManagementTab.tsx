import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Image as ImageIcon, 
  Video, 
  Upload, 
  Save, 
  X, 
  Eye, 
  Sparkles, 
  CheckCircle, 
  Play, 
  Film,
  Calendar,
  Layers,
  Filter
} from 'lucide-react';
import { GalleryItem, Language } from '../../types';
import { readFileAsDataUrl } from '../../lib/storageService';

interface GalleryManagementTabProps {
  galleryItems: GalleryItem[];
  addGalleryItem: (item: GalleryItem) => void;
  updateGalleryItem: (item: GalleryItem) => void;
  deleteGalleryItem: (id: string) => void;
  lang: Language;
  showToast: (msg: string) => void;
}

export const GalleryManagementTab: React.FC<GalleryManagementTabProps> = ({
  galleryItems,
  addGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  lang,
  showToast
}) => {
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video'>('all');
  const [previewMedia, setPreviewMedia] = useState<GalleryItem | null>(null);

  // Form states
  const [titleBn, setTitleBn] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [type, setType] = useState<'image' | 'video'>('image');
  const [mediaUrl, setMediaUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [captionBn, setCaptionBn] = useState('');
  const [captionEn, setCaptionEn] = useState('');
  const [category, setCategory] = useState('ক্লাসরুম কার্যক্রম');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isProcessingUpload, setIsProcessingUpload] = useState(false);

  const categories = [
    'ক্লাসরুম কার্যক্রম',
    'পুরস্কার বিতরণী',
    'সাংস্কৃতিক অনুষ্ঠান',
    'সেমিনার ও ওরিয়েন্টেশন',
    'পরীক্ষা ও মূল্যায়ন',
    'বিতর্ক প্রতিযোগিতা',
    'ক্যাম্পাস স্মৃতি',
    'অন্যান্য'
  ];

  const handleStartAdd = () => {
    setIsAdding(true);
    setEditingItem(null);
    setTitleBn('');
    setTitleEn('');
    setType('image');
    setMediaUrl('');
    setThumbnailUrl('');
    setCaptionBn('');
    setCaptionEn('');
    setCategory('ক্লাসরুম কার্যক্রম');
    setDate(new Date().toISOString().split('T')[0]);
    setIsFeatured(false);
  };

  const handleStartEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setIsAdding(false);
    setTitleBn(item.titleBn);
    setTitleEn(item.titleEn);
    setType(item.type);
    setMediaUrl(item.mediaUrl);
    setThumbnailUrl(item.thumbnailUrl || '');
    setCaptionBn(item.captionBn || '');
    setCaptionEn(item.captionEn || '');
    setCategory(item.category || 'ক্লাসরুম কার্যক্রম');
    setDate(item.date);
    setIsFeatured(Boolean(item.isFeatured));
  };

  const handleCancelForm = () => {
    setIsAdding(false);
    setEditingItem(null);
  };

  // Direct Image File Upload Handler
  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessingUpload(true);
      const dataUrl = await readFileAsDataUrl(file);
      setMediaUrl(dataUrl);
      if (!thumbnailUrl) {
        setThumbnailUrl(dataUrl);
      }
      showToast(lang === 'bn' ? 'ছবি সফলভাবে লোড হয়েছে!' : 'Image uploaded successfully!');
    } catch (err) {
      console.error(err);
      showToast(lang === 'bn' ? 'ছবি আপলোডে সমস্যা হয়েছে' : 'Failed to upload image');
    } finally {
      setIsProcessingUpload(false);
      e.target.value = '';
    }
  };

  // Direct Video File Upload Handler
  const handleVideoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessingUpload(true);
      const dataUrl = await readFileAsDataUrl(file);
      setMediaUrl(dataUrl);
      showToast(lang === 'bn' ? 'ভিডিও সফলভাবে লোড হয়েছে!' : 'Video uploaded successfully!');
    } catch (err) {
      console.error(err);
      showToast(lang === 'bn' ? 'ভিডিও আপলোডে সমস্যা হয়েছে' : 'Failed to upload video');
    } finally {
      setIsProcessingUpload(false);
      e.target.value = '';
    }
  };

  // Thumbnail File Upload Handler
  const handleThumbnailFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessingUpload(true);
      const dataUrl = await readFileAsDataUrl(file);
      setThumbnailUrl(dataUrl);
      showToast(lang === 'bn' ? 'থাম্বনেইল সফলভাবে লোড হয়েছে!' : 'Thumbnail uploaded successfully!');
    } catch (err) {
      console.error(err);
      showToast(lang === 'bn' ? 'থাম্বনেইল আপলোডে সমস্যা হয়েছে' : 'Failed to upload thumbnail');
    } finally {
      setIsProcessingUpload(false);
      e.target.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!titleBn.trim() || !mediaUrl.trim()) {
      showToast(lang === 'bn' ? 'দয়া করে শিরোনাম এবং ছবি বা ভিডিও লিংক প্রদান করুন' : 'Please provide title and media file');
      return;
    }

    const payload: GalleryItem = {
      id: editingItem ? editingItem.id : `gal-${Date.now()}`,
      titleBn: titleBn.trim(),
      titleEn: titleEn.trim() || titleBn.trim(),
      type,
      mediaUrl: mediaUrl.trim(),
      thumbnailUrl: thumbnailUrl.trim() || (type === 'image' ? mediaUrl.trim() : ''),
      captionBn: captionBn.trim(),
      captionEn: captionEn.trim(),
      category: category.trim(),
      date,
      isFeatured
    };

    if (editingItem) {
      updateGalleryItem(payload);
      showToast(lang === 'bn' ? 'গ্যালারি আইটেম সফলভাবে আপডেট হয়েছে এবং চূড়ান্তভাবে সংরক্ষিত হয়েছে!' : 'Gallery item successfully updated and permanently saved!');
    } else {
      addGalleryItem(payload);
      showToast(lang === 'bn' ? 'নতুন গ্যালারি আইটেম সফলভাবে যোগ করা হয়েছে এবং চূড়ান্তভাবে সংরক্ষিত হয়েছে!' : 'New gallery item successfully added and permanently saved!');
    }

    setIsAdding(false);
    setEditingItem(null);
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(lang === 'bn' ? `আপনি কি নিশ্চিতভাবে "${title}" গ্যালারি থেকে মুছে ফেলতে চান?` : `Are you sure you want to delete "${title}"?`)) {
      deleteGalleryItem(id);
      showToast(lang === 'bn' ? 'আইটেমটি স্থায়ীভাবে মুছে ফেলা হয়েছে!' : 'Item deleted permanently!');
    }
  };

  const filteredItems = galleryItems.filter((item) => {
    if (filterType === 'all') return true;
    return item.type === filterType;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-teal-950 p-6 rounded-3xl text-white shadow-xl border border-emerald-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-bold border border-emerald-500/30">
            <Film className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'সরাসরি মিডিয়া ও গ্যালারি কন্ট্রোল' : 'Direct Media & Gallery Control'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            {lang === 'bn' ? 'ফটো ও ভিডিও গ্যালারি ব্যবস্থাপনা' : 'Photo & Video Gallery Management'}
          </h2>
          <p className="text-xs text-slate-300">
            {lang === 'bn' 
              ? 'এখানে সরাসরি ছবি ও ভিডিও আপলোড করুন। যেকোনো পরিবর্তন স্থায়ী ও চূড়ান্ত হিসেবে মূল পাতার গ্যালারিতে প্রদর্শিত হবে।' 
              : 'Directly upload photos and videos. All changes are authoritative and reflected instantly on the main page.'}
          </p>
        </div>

        <button
          onClick={handleStartAdd}
          disabled={isAdding || editingItem !== null}
          className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-95 shrink-0 disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          <span>{lang === 'bn' ? 'নতুন ছবি বা ভিডিও যোগ করুন' : 'Add Photo / Video'}</span>
        </button>
      </div>

      {/* Add / Edit Form Modal or Card */}
      {(isAdding || editingItem) && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-emerald-500/30 shadow-xl space-y-6 animate-scale-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                {type === 'image' ? <ImageIcon className="w-5 h-5" /> : <Video className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  {editingItem 
                    ? (lang === 'bn' ? 'গ্যালারি আইটেম সম্পাদনা' : 'Edit Gallery Item') 
                    : (lang === 'bn' ? 'নতুন গ্যালারি আইটেম যোগ করুন' : 'Add New Gallery Item')}
                </h3>
                <p className="text-xs text-slate-500">
                  {lang === 'bn' ? 'সরাসরি ফাইল আপলোড অথবা ওয়েব লিংক ব্যবহার করুন' : 'Use direct file upload or direct web URL'}
                </p>
              </div>
            </div>

            <button
              onClick={handleCancelForm}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Type selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                {lang === 'bn' ? 'মিডিয়ার ধরন নির্বাচন করুন *' : 'Select Media Type *'}
              </label>
              <div className="grid grid-cols-2 gap-3 max-w-md">
                <button
                  type="button"
                  onClick={() => setType('image')}
                  className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    type === 'image'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-800 shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <ImageIcon className="w-4 h-4 text-emerald-600" />
                  <span>{lang === 'bn' ? 'ছবি (Photo / Image)' : 'Photo / Image'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setType('video')}
                  className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    type === 'video'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-800 shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Video className="w-4 h-4 text-emerald-600" />
                  <span>{lang === 'bn' ? 'ভিডিও (Video / Lecture)' : 'Video / Lecture'}</span>
                </button>
              </div>
            </div>

            {/* Direct Upload & Media URL Section */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <span className="text-xs font-bold text-slate-800 block">
                {type === 'image'
                  ? (lang === 'bn' ? '১. সরাসরি ছবি ফাইল আপলোড অথবা ইমেজ URL' : '1. Direct Image File Upload or URL')
                  : (lang === 'bn' ? '১. সরাসরি ভিডিও ফাইল আপলোড অথবা ভিডিও URL' : '1. Direct Video File Upload or URL')}
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                {/* File Upload Box */}
                <div className="border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-white rounded-2xl p-4 text-center cursor-pointer transition-colors relative group">
                  <input
                    type="file"
                    accept={type === 'image' ? 'image/*' : 'video/*'}
                    onChange={type === 'image' ? handleImageFileUpload : handleVideoFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full h-full"
                    disabled={isProcessingUpload}
                  />
                  <div className="space-y-2 pointer-events-none">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                      <Upload className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-bold text-slate-700">
                      {isProcessingUpload
                        ? (lang === 'bn' ? 'প্রসেসিং হচ্ছে...' : 'Processing...')
                        : (type === 'image'
                            ? (lang === 'bn' ? 'কম্পিউটার/মোবাইল থেকে সরাসরি ছবি আপলোড করুন' : 'Upload photo directly from device')
                            : (lang === 'bn' ? 'কম্পিউটার/মোবাইল থেকে সরাসরি ভিডিও আপলোড করুন' : 'Upload video directly from device'))}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {type === 'image' 
                        ? (lang === 'bn' ? 'PNG, JPG, WEBP ফরম্যাট (স্বয়ংক্রিয় কম্প্রেসড হবে)' : 'PNG, JPG, WEBP (auto-compressed)')
                        : (lang === 'bn' ? 'MP4, WebM বা ভিডিও ক্লিপ' : 'MP4, WebM format')}
                    </p>
                  </div>
                </div>

                {/* Media URL Input Box */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-600 block">
                    {lang === 'bn' ? 'অথবা সরাসরি মিডিয়া লিঙ্ক (URL) দিন:' : 'Or paste direct Media Link (URL):'}
                  </label>
                  <input
                    type="text"
                    value={mediaUrl}
                    onChange={(e) => setMediaUrl(e.target.value)}
                    placeholder={type === 'image' ? 'https://.../photo.jpg' : 'https://youtube.com/watch?v=... বা mp4 URL'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white"
                  />
                  <p className="text-[10px] text-slate-400">
                    {type === 'video'
                      ? (lang === 'bn' ? 'ইউটিউব লিঙ্ক (YouTube), ফেসবুক ভিডিও বা সরাসরি MP4 ভিডিও ফাইল লিঙ্ক সমর্থন করে।' : 'Supports YouTube links, Facebook videos, or direct MP4 links.')
                      : (lang === 'bn' ? 'যেকোনো অনলাইন ইমেজ লিঙ্ক পেস্ট করতে পারেন।' : 'Any online image URL is supported.')}
                  </p>
                </div>
              </div>

              {/* Instant Preview Box */}
              {mediaUrl && (
                <div className="pt-2">
                  <span className="text-[11px] font-bold text-slate-600 block mb-1.5">
                    {lang === 'bn' ? 'প্রিভিউ:' : 'Instant Preview:'}
                  </span>
                  <div className="relative rounded-2xl overflow-hidden bg-slate-900 max-w-sm max-h-56 flex items-center justify-center border border-slate-200">
                    {type === 'image' ? (
                      <img
                        src={mediaUrl}
                        alt="Preview"
                        className="w-full h-full object-cover max-h-56"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=400';
                        }}
                      />
                    ) : (
                      mediaUrl.includes('youtube.com') || mediaUrl.includes('youtu.be') ? (
                        <div className="p-8 text-center text-white space-y-2">
                          <Play className="w-10 h-10 text-emerald-400 mx-auto" />
                          <p className="text-xs font-bold">{lang === 'bn' ? 'ইউটিউব ভিডিও লিঙ্ক সফলভাবে সংযুক্ত' : 'YouTube link connected'}</p>
                          <p className="text-[10px] text-slate-400 font-mono truncate max-w-xs">{mediaUrl}</p>
                        </div>
                      ) : (
                        <video
                          src={mediaUrl}
                          controls
                          className="w-full max-h-56 object-cover"
                        />
                      )
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Thumbnail Box for Videos */}
            {type === 'video' && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-slate-800 block">
                  {lang === 'bn' ? '২. ভিডিও থাম্বনেইল ছবি (ঐচ্ছিক)' : '2. Video Cover / Thumbnail (Optional)'}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                  <div className="relative border border-dashed border-slate-300 rounded-xl p-3 text-center bg-white cursor-pointer hover:border-emerald-400">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailFileUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <p className="text-xs text-slate-600 font-medium">
                      {lang === 'bn' ? 'কভার ছবি আপলোড করুন' : 'Upload custom thumbnail'}
                    </p>
                  </div>
                  <input
                    type="text"
                    value={thumbnailUrl}
                    onChange={(e) => setThumbnailUrl(e.target.value)}
                    placeholder="বা থাম্বনেইল ইমেজ URL পেস্ট করুন"
                    className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono bg-white"
                  />
                </div>
              </div>
            )}

            {/* Title & Category Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {lang === 'bn' ? 'শিরোনাম (বাংলা) *' : 'Title (Bengali) *'}
                </label>
                <input
                  type="text"
                  required
                  value={titleBn}
                  onChange={(e) => setTitleBn(e.target.value)}
                  placeholder="যেমন: বার্ষিক পুরস্কার বিতরণী ও মেধা সম্মাননা ২০২৬"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {lang === 'bn' ? 'শিরোনাম (English)' : 'Title (English)'}
                </label>
                <input
                  type="text"
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  placeholder="e.g. Annual Academic Merit Award 2026"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>
            </div>

            {/* Category & Date Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {lang === 'bn' ? 'ক্যাটাগরি / বিভাগ' : 'Category'}
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {lang === 'bn' ? 'তারিখ' : 'Date'}
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              <div className="flex items-center pt-5">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-400"
                  />
                  <span className="text-xs font-bold text-slate-700">
                    {lang === 'bn' ? 'ফিচার্ড হিসেবে চিহ্নিত করুন' : 'Mark as Featured'}
                  </span>
                </label>
              </div>
            </div>

            {/* Caption / Description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {lang === 'bn' ? 'সংক্ষিপ্ত বিবরণ বা ক্যাপশন (বাংলা)' : 'Caption / Description (Bengali)'}
                </label>
                <textarea
                  rows={2}
                  value={captionBn}
                  onChange={(e) => setCaptionBn(e.target.value)}
                  placeholder="ছবি বা ভিডিও সম্পর্কে সংক্ষেপে কিছু লিখুন..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {lang === 'bn' ? 'ক্যাপশন (English)' : 'Caption (English)'}
                </label>
                <textarea
                  rows={2}
                  value={captionEn}
                  onChange={(e) => setCaptionEn(e.target.value)}
                  placeholder="Short description in English..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
                />
              </div>
            </div>

            {/* Submit & Cancel Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleCancelForm}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                {lang === 'bn' ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                type="submit"
                disabled={isProcessingUpload}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-md flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>
                  {editingItem 
                    ? (lang === 'bn' ? 'চূড়ান্ত সংরক্ষণ করুন' : 'Save Changes') 
                    : (lang === 'bn' ? 'গ্যালারিতে যুক্ত করুন' : 'Add to Gallery')}
                </span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter and Stats Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-1.5">
          <Filter className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-bold text-slate-700 mr-2">
            {lang === 'bn' ? 'ফিল্টার:' : 'Filter:'}
          </span>
          {[
            { id: 'all', label: lang === 'bn' ? `সব (${galleryItems.length})` : `All (${galleryItems.length})` },
            { id: 'image', label: lang === 'bn' ? `ছবি (${galleryItems.filter(i => i.type === 'image').length})` : `Photos (${galleryItems.filter(i => i.type === 'image').length})` },
            { id: 'video', label: lang === 'bn' ? `ভিডিও (${galleryItems.filter(i => i.type === 'video').length})` : `Videos (${galleryItems.filter(i => i.type === 'video').length})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterType === tab.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <span className="text-xs font-semibold text-slate-500">
          {lang === 'bn' ? `মোট গ্যালারি আইটেম: ${galleryItems.length} টি` : `Total items: ${galleryItems.length}`}
        </span>
      </div>

      {/* Gallery Cards Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-3">
          <Film className="w-12 h-12 text-slate-300 mx-auto" />
          <h4 className="font-bold text-sm text-slate-700">
            {lang === 'bn' ? 'কোনো গ্যালারি আইটেম পাওয়া যায়নি' : 'No gallery items found'}
          </h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {lang === 'bn' ? 'উপরে "নতুন ছবি বা ভিডিও যোগ করুন" বাটনে ক্লিক করে সরাসরি ছবি বা ভিডিও আপলোড করুন।' : 'Click the button above to upload new photos or videos.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:border-emerald-300 smooth-card flex flex-col justify-between group"
            >
              <div>
                {/* Media Thumbnail Container */}
                <div className="relative aspect-video overflow-hidden bg-slate-900">
                  {item.type === 'image' ? (
                    <img
                      src={item.mediaUrl}
                      alt={lang === 'bn' ? item.titleBn : item.titleEn}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=600';
                      }}
                    />
                  ) : (
                    <div className="relative w-full h-full">
                      <img
                        src={item.thumbnailUrl || 'https://images.unsplash.com/photo-1577495508048-b635879837f1?q=80&w=600'}
                        alt={lang === 'bn' ? item.titleBn : item.titleEn}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-emerald-600/90 text-white flex items-center justify-center shadow-lg">
                          <Play className="w-5 h-5 fill-white ml-0.5" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase text-white shadow-xs flex items-center gap-1 ${
                      item.type === 'video' ? 'bg-indigo-600' : 'bg-emerald-600'
                    }`}>
                      {item.type === 'video' ? <Video className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
                      <span>{item.type === 'video' ? 'ভিডিও' : 'ছবি'}</span>
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

                {/* Content */}
                <div className="p-5 space-y-2.5">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{item.date}</span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 leading-snug line-clamp-2">
                    {lang === 'bn' ? item.titleBn : item.titleEn}
                  </h3>

                  {(item.captionBn || item.captionEn) && (
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {lang === 'bn' ? item.captionBn : item.captionEn}
                    </p>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setPreviewMedia(item)}
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-emerald-300 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{lang === 'bn' ? 'প্রিভিউ' : 'Preview'}</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleStartEdit(item)}
                    className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                    title={lang === 'bn' ? 'সম্পাদনা করুন' : 'Edit'}
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, lang === 'bn' ? item.titleBn : item.titleEn)}
                    className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title={lang === 'bn' ? 'মুছে ফেলুন' : 'Delete'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox / Preview Modal */}
      {previewMedia && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreviewMedia(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm">
                  {lang === 'bn' ? previewMedia.titleBn : previewMedia.titleEn}
                </h4>
                <p className="text-[11px] text-emerald-400">
                  {previewMedia.category} • {previewMedia.date}
                </p>
              </div>
              <button
                onClick={() => setPreviewMedia(null)}
                className="p-1 rounded-lg hover:bg-white/10 text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-black flex items-center justify-center max-h-[70vh] overflow-hidden">
              {previewMedia.type === 'image' ? (
                <img
                  src={previewMedia.mediaUrl}
                  alt={previewMedia.titleEn}
                  className="w-full h-auto max-h-[70vh] object-contain"
                />
              ) : previewMedia.mediaUrl.includes('youtube.com') || previewMedia.mediaUrl.includes('youtu.be') ? (
                <div className="w-full aspect-video">
                  <iframe
                    src={previewMedia.mediaUrl.replace('watch?v=', 'embed/')}
                    title={previewMedia.titleEn}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <video
                  src={previewMedia.mediaUrl}
                  controls
                  autoPlay
                  className="w-full max-h-[70vh]"
                />
              )}
            </div>

            {(previewMedia.captionBn || previewMedia.captionEn) && (
              <div className="p-4 bg-slate-50 border-t border-slate-200">
                <p className="text-xs text-slate-700 leading-relaxed">
                  {lang === 'bn' ? previewMedia.captionBn : previewMedia.captionEn}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
