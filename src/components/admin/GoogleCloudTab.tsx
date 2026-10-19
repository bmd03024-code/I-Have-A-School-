import React, { useState } from 'react';
import { Cloud, RefreshCw, CheckCircle2, ShieldCheck, Database, Key, Server, Layers } from 'lucide-react';
import { GoogleCloudConfig, Language } from '../../types';

interface GoogleCloudTabProps {
  config: GoogleCloudConfig;
  updateConfig: (cfg: GoogleCloudConfig) => void;
  isSyncing: boolean;
  triggerSync: () => Promise<void>;
  lang: Language;
  showToast: (msg: string) => void;
}

export const GoogleCloudTab: React.FC<GoogleCloudTabProps> = ({
  config,
  updateConfig,
  isSyncing,
  triggerSync,
  lang,
  showToast
}) => {
  const [formData, setFormData] = useState<GoogleCloudConfig>({ ...config });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig(formData);
    showToast(lang === 'bn' ? 'গুগল ক্লাউড কনফিগারেশন সংরক্ষিত হয়েছে!' : 'Google Cloud configuration saved successfully!');
  };

  const handleSyncNow = async () => {
    await triggerSync();
    showToast(lang === 'bn' ? 'রিয়েল-টাইম ডেটা ক্লাউডের সাথে সফলভাবে সিঙ্ক হয়েছে!' : 'Real-time data synced with Google Cloud!');
  };

  return (
    <div className="space-y-6">
      {/* Overview & Security Badge */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-sky-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase flex items-center gap-1">
              <Cloud className="w-3 h-3" />
              GOOGLE CLOUD INTEGRATION
            </span>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
              NO FIREBASE • 100% SECURE
            </span>
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            {lang === 'bn' ? 'গুগল ক্লাউড স্টোরেজ ও রিয়েল-টাইম ডেটাবেজ' : 'Google Cloud Storage & Real-Time Sync'}
          </h3>
          <p className="text-xs text-slate-500">
            {lang === 'bn'
              ? 'ওয়েবসাইটের শিক্ষার্থী তালিকা, মার্কশিট, ছবি ও লেকচার নোটস সরাসরি গুগল ক্লাউডের মাধ্যমে রিয়েল-টাইমে আপডেট হয়।'
              : 'Enterprise-grade Google Cloud native storage and cross-window real-time synchronization engine.'}
          </p>
        </div>

        {/* Sync Status Badge */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 min-w-[280px] space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              {lang === 'bn' ? 'সিঙ্ক স্ট্যাটাস:' : 'Sync Status:'}
            </span>
            <span className="font-bold px-2 py-0.5 rounded-full text-[11px] bg-emerald-100 text-emerald-800 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {lang === 'bn' ? 'রিয়েল-টাইম সক্রিয়' : 'Real-time Active'}
            </span>
          </div>

          <div className="text-[11px] text-slate-500 font-mono">
            সর্বশেষ সিঙ্ক: {config.lastSyncedAt ? new Date(config.lastSyncedAt).toLocaleTimeString() : 'Just now'}
          </div>

          <button
            onClick={handleSyncNow}
            disabled={isSyncing}
            className="w-full py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? (lang === 'bn' ? 'সিঙ্ক হচ্ছে...' : 'Syncing...') : (lang === 'bn' ? 'এখনই ক্লাউড সিঙ্ক করুন' : 'Sync Now with Cloud')}</span>
          </button>
        </div>
      </div>

      {/* Configuration Form */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h4 className="text-base font-bold text-slate-900">
            {lang === 'bn' ? 'গুগল ক্লাউড কানেকশন প্যারামিটার' : 'Google Cloud Connection Parameters'}
          </h4>
          <p className="text-xs text-slate-500">
            {lang === 'bn' 
              ? 'আপনার গুগল ক্লাউড প্রোজেক্ট আইডি ও ক্লাউড স্টোরেজ বাকেটের তথ্য দিন।' 
              : 'Configure project credentials and API endpoint for persistent cloud assets.'}
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {lang === 'bn' ? 'গুগল ক্লাউড প্রোজেক্ট আইডি' : 'Google Cloud Project ID'}
              </label>
              <div className="relative">
                <Server className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. ihas-gcp-education-platform"
                  value={formData.projectId}
                  onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-mono focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {lang === 'bn' ? 'গুগল ক্লাউড স্টোরেজ বাকেট' : 'Google Cloud Storage Bucket'}
              </label>
              <div className="relative">
                <Database className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. ihas-assets-storage-bucket"
                  value={formData.bucketName}
                  onChange={(e) => setFormData({ ...formData, bucketName: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-mono focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {lang === 'bn' ? 'স্টোরেজ এপিআই এন্ডপয়েন্ট' : 'Cloud Storage API Endpoint'}
              </label>
              <input
                type="text"
                placeholder="https://storage.googleapis.com/ihas-assets-storage-bucket"
                value={formData.apiEndpoint}
                onChange={(e) => setFormData({ ...formData, apiEndpoint: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {lang === 'bn' ? 'গুগল ক্লাউড এপিআই কী' : 'Google Cloud API Key'}
              </label>
              <div className="relative">
                <Key className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  placeholder="••••••••••••••••••••••••••••"
                  value={formData.apiKey}
                  onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-mono focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 flex items-center justify-between gap-4">
            <div>
              <span className="font-bold text-emerald-900 block text-xs">
                {lang === 'bn' ? 'রিয়েল-টাইম ব্রডকাস্ট চ্যানেল সিঙ্ক' : 'Real-time Multi-tab & Device Sync'}
              </span>
              <p className="text-[11px] text-emerald-700 mt-0.5">
                {lang === 'bn'
                  ? 'সক্রিয় থাকলে যেকোনো পেজ বা ডিভাইসে ডেটা পরিবর্তন হওয়া মাত্রই তা সাথে সাথে সর্বত্র আপডেট হবে।'
                  : 'Instant sub-millisecond broadcast synchronization across active student and admin sessions.'}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={formData.isRealtimeSyncEnabled}
                onChange={(e) => setFormData({ ...formData, isRealtimeSyncEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{lang === 'bn' ? 'ক্লাউড সেটিংস সংরক্ষণ করুন' : 'Save Cloud Settings'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
