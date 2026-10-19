import React, { useState } from 'react';
import { 
  GitBranch, 
  RefreshCw, 
  CheckCircle2, 
  ExternalLink, 
  Key, 
  Server, 
  Database, 
  Save, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  ArrowUpRight, 
  Check, 
  Copy, 
  Globe, 
  Zap, 
  Radio,
  BookA
} from 'lucide-react';
import { GitHubConfig, Language } from '../../types';
import { testGitHubConnection } from '../../services/githubSyncService';

interface GitHubSyncTabProps {
  config: GitHubConfig;
  updateConfig: (cfg: GitHubConfig) => void;
  isSyncing: boolean;
  pushToGitHub: (customCommitMessage?: string) => Promise<{ success: boolean; sha?: string; error?: string }>;
  pullFromGitHub: (force?: boolean) => Promise<{ success: boolean; data?: any; error?: string }>;
  syncStatus: {
    state: 'idle' | 'syncing' | 'synced' | 'error';
    message: string;
    lastSyncedAt?: string;
    lastCommitSha?: string;
  };
  lang: Language;
  showToast: (msg: string) => void;
}

export const GitHubSyncTab: React.FC<GitHubSyncTabProps> = ({
  config,
  updateConfig,
  isSyncing,
  pushToGitHub,
  pullFromGitHub,
  syncStatus,
  lang,
  showToast
}) => {
  const [formData, setFormData] = useState<GitHubConfig>({ ...config });
  const [showToken, setShowToken] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    tested: boolean;
    success: boolean;
    message: string;
    repoDetails?: any;
  } | null>(null);
  const [copiedSha, setCopiedSha] = useState(false);
  const [customCommitMsg, setCustomCommitMsg] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig(formData);
    showToast(
      lang === 'bn'
        ? 'গিটহাব এপিআই কনফিগারেশন সফলভাবে সংরক্ষিত হয়েছে!'
        : 'GitHub API configuration saved successfully!'
    );
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await testGitHubConnection(formData);
      setTestResult({
        tested: true,
        success: res.success,
        message: res.message,
        repoDetails: res.repoDetails
      });
      if (res.success) {
        showToast(lang === 'bn' ? 'গিটহাব সংযোগ সফল!' : 'GitHub connection verified!');
      } else {
        showToast(lang === 'bn' ? 'সংযোগ ত্রুটি!' : 'Connection error!');
      }
    } finally {
      setIsTesting(false);
    }
  };

  const handleManualPush = async () => {
    const res = await pushToGitHub(customCommitMsg || undefined);
    if (res.success) {
      showToast(
        lang === 'bn'
          ? 'সকল ডেটাবেজ গিটহাবে পুশ ও লাইভ আপডেট হয়েছে!'
          : 'Database pushed to GitHub and updated live across all browsers!'
      );
      setCustomCommitMsg('');
    } else {
      showToast(
        lang === 'bn'
          ? `পুশ ব্যর্থ: ${res.error || 'ত্রুটি'}`
          : `Push failed: ${res.error || 'Error'}`
      );
    }
  };

  const handleManualPull = async () => {
    const res = await pullFromGitHub(true);
    if (res.success) {
      showToast(
        lang === 'bn'
          ? 'গিটহাব থেকে সর্বশেষ লাইভ ডেটা ব্রাউজারে সিঙ্ক হয়েছে!'
          : 'Latest live data synced from GitHub!'
      );
    } else {
      showToast(
        lang === 'bn'
          ? `সিঙ্ক ব্যর্থ: ${res.error || 'ত্রুটি'}`
          : `Sync failed: ${res.error || 'Error'}`
      );
    }
  };

  const copySha = () => {
    const sha = config.lastCommitSha || syncStatus.lastCommitSha;
    if (sha) {
      navigator.clipboard.writeText(sha);
      setCopiedSha(true);
      setTimeout(() => setCopiedSha(false), 2000);
      showToast(lang === 'bn' ? 'কমিট SHA কপি হয়েছে!' : 'Commit SHA copied!');
    }
  };

  const isConfigured = Boolean(formData.owner && formData.repo);
  const repoUrl = isConfigured
    ? `https://github.com/${formData.owner.trim()}/${formData.repo.trim()}`
    : null;
  const rawDataUrl = isConfigured
    ? `https://raw.githubusercontent.com/${formData.owner.trim()}/${formData.repo.trim()}/${(formData.branch || 'main').trim()}/${(formData.filePath || 'data/ihas_live_database.json').replace(/^\/+/, '').trim()}`
    : null;

  return (
    <div className="space-y-6">
      {/* Overview & Live Status Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-slate-900 text-white text-[10px] font-black px-2.5 py-0.5 rounded uppercase flex items-center gap-1.5 shadow-xs">
              <GitBranch className="w-3.5 h-3.5 text-emerald-400" />
              GITHUB REST API V3
            </span>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded flex items-center gap-1">
              <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
              {lang === 'bn' ? 'রিয়েল-টাইম ব্রাউজার ব্রডকাস্ট' : 'Real-time Browser Broadcast'}
            </span>
            {config.enabled && (
              <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded">
                AUTO-PUSH {config.autoPushOnChange ? 'ON' : 'OFF'}
              </span>
            )}
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
            {lang === 'bn'
              ? 'গিটহাব এপিআই সেটআপ ও সকল ব্রাউজারে লাইভ আপডেট'
              : 'GitHub API Integration & Cross-Browser Live Sync'}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {lang === 'bn'
              ? 'অ্যাডমিন প্যানেলে যেকোনো পরিবর্তন (কোর্স, ফলাফল, নোটিশ, রুটিন, শিক্ষক, স্লাইডার ইত্যাদি) সরাসরি গিটহাবে পুশ হবে এবং বিশ্বজুড়ে সকল ব্যবহারকারীর ব্রাউজারে কোনো রিলোড ছাড়াই সাথে সাথে লাইভ দৃশ্যমান হবে।'
              : 'Push complete database snapshots to your GitHub repository automatically. All visitor browsers poll and receive instant updates in real time without manual reload.'}
          </p>
        </div>

        {/* Sync Status Badge Box */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 min-w-[300px] space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              {lang === 'bn' ? 'লাইভ সিঙ্ক স্ট্যাটাস:' : 'Live Sync Status:'}
            </span>
            <span
              className={`font-bold px-2.5 py-0.5 rounded-full text-[11px] flex items-center gap-1.5 ${
                syncStatus.state === 'error'
                  ? 'bg-rose-100 text-rose-800'
                  : syncStatus.state === 'syncing'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  syncStatus.state === 'error'
                    ? 'bg-rose-500'
                    : syncStatus.state === 'syncing'
                    ? 'bg-amber-500 animate-spin'
                    : 'bg-emerald-500 animate-pulse'
                }`}
              />
              {syncStatus.state === 'syncing'
                ? lang === 'bn' ? 'সিঙ্ক হচ্ছে...' : 'Syncing...'
                : syncStatus.state === 'error'
                ? lang === 'bn' ? 'ত্রুটি' : 'Error'
                : lang === 'bn' ? 'সক্রিয় ও লাইভ' : 'Active & Live'}
            </span>
          </div>

          <div className="space-y-1 text-[11px] text-slate-500 font-mono bg-white p-2.5 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between">
              <span>{lang === 'bn' ? 'সর্বশেষ সিঙ্ক:' : 'Last Synced:'}</span>
              <strong className="text-slate-700">
                {config.lastSyncedAt ? new Date(config.lastSyncedAt).toLocaleTimeString() : 'Just now'}
              </strong>
            </div>
            {config.lastCommitSha && (
              <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                <span>Commit SHA:</span>
                <button
                  type="button"
                  onClick={copySha}
                  className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1"
                >
                  <span>{config.lastCommitSha.substring(0, 7)}</span>
                  {copiedSha ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={handleManualPush}
              disabled={isSyncing}
              className="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs"
            >
              <Zap className={`w-3.5 h-3.5 ${isSyncing ? 'animate-bounce' : ''}`} />
              <span>{isSyncing ? (lang === 'bn' ? 'পুশ হচ্ছে...' : 'Pushing...') : (lang === 'bn' ? 'এখনই পুশ করুন' : 'Push to GitHub')}</span>
            </button>

            <button
              type="button"
              onClick={handleManualPull}
              disabled={isSyncing}
              className="py-2 px-3 bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{lang === 'bn' ? 'গিটহাব থেকে সিঙ্ক' : 'Pull Updates'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Test Result Banner */}
      {testResult && (
        <div
          className={`p-4 rounded-2xl border text-xs flex items-start gap-3 transition-all ${
            testResult.success
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          {testResult.success ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          )}
          <div className="space-y-1">
            <div className="font-bold text-sm">{testResult.message}</div>
            {testResult.repoDetails && (
              <div className="font-mono text-[11px] opacity-90">
                Repo: {testResult.repoDetails.fullName} • Default Branch: {testResult.repoDetails.defaultBranch} • Visibility: {testResult.repoDetails.private ? 'Private' : 'Public'}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Configuration Form */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald-600" />
              {lang === 'bn' ? 'গিটহাব এপিআই ও কানেকশন সেটিংস' : 'GitHub API Connection Settings'}
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              {lang === 'bn'
                ? 'আপনার GitHub Personal Access Token ও রিপোজিটরি প্যারামিটার কনফিগার করুন।'
                : 'Configure GitHub Personal Access Token and target repository parameters.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={isTesting}
              className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
              <span>{isTesting ? (lang === 'bn' ? 'যাচাই হচ্ছে...' : 'Testing...') : (lang === 'bn' ? 'সংযোগ পরীক্ষা করুন' : 'Test Connection')}</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'সংরক্ষণ করুন' : 'Save Config'}</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6 text-xs">
          {/* Active Integration Switch */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-600" />
                {lang === 'bn' ? 'গিটহাব লাইভ ডাটাবেজ সিঙ্ক সক্রিয় রাখুন' : 'Enable GitHub Live Database Sync'}
              </div>
              <p className="text-xs text-slate-500">
                {lang === 'bn'
                  ? 'অন থাকলে ভিজিটরদের ব্রাউজার স্বয়ংক্রিয়ভাবে গিটহাব থেকে নতুন ডেটা ফেচ করবে।'
                  : 'When enabled, visitor browsers periodically fetch latest data pushed to GitHub.'}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.enabled}
                onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          {/* GitHub Token Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block font-bold text-slate-700">
                {lang === 'bn' ? 'GitHub Personal Access Token (PAT)' : 'GitHub Personal Access Token (PAT)'}
                <span className="text-rose-500 ml-1">*</span>
              </label>
              <a
                href="https://github.com/settings/tokens/new?scopes=repo&description=I+Have+A+School+Live+Data"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-emerald-600 hover:text-emerald-700 font-bold flex items-center gap-1"
              >
                <span>{lang === 'bn' ? 'গিটহাবে নতুন টোকেন তৈরি করুন' : 'Generate Token on GitHub'}</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
            <div className="relative">
              <Key className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showToken ? 'text' : 'password'}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                value={formData.token}
                onChange={(e) => setFormData({ ...formData, token: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-900 font-mono focus:border-emerald-500 focus:bg-white focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowToken(!showToken)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              {lang === 'bn'
                ? 'টোকেন তৈরির সময় অবশ্যই "repo" স্কোপ (Full control of private repositories) টিক মার্ক দিতে হবে।'
                : 'Select the "repo" scope (full control of repositories) when generating this token.'}
            </p>
          </div>

          {/* Owner, Repo, Branch, FilePath Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {lang === 'bn' ? 'গিটহাব ইউজারনেম / ওনার (Owner)' : 'Repository Owner / Username'}
                <span className="text-rose-500 ml-1">*</span>
              </label>
              <input
                type="text"
                placeholder="md-touhidul-hoque"
                value={formData.owner}
                onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {lang === 'bn' ? 'রিপোজিটরির নাম (Repo Name)' : 'Repository Name'}
                <span className="text-rose-500 ml-1">*</span>
              </label>
              <input
                type="text"
                placeholder="ihaveaschool-live-database"
                value={formData.repo}
                onChange={(e) => setFormData({ ...formData, repo: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {lang === 'bn' ? 'টার্গেট ব্রাঞ্চ (Branch)' : 'Target Branch'}
              </label>
              <input
                type="text"
                placeholder="main"
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {lang === 'bn' ? 'ডেটাবেজ ফাইল পাথ (File Path in Repo)' : 'Database File Path in Repo'}
              </label>
              <input
                type="text"
                placeholder="data/ihas_live_database.json"
                value={formData.filePath}
                onChange={(e) => setFormData({ ...formData, filePath: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono focus:border-emerald-500 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* Auto-Push & Interval Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-800">
                  {lang === 'bn' ? 'স্বয়ংক্রিয় পুশ (Auto-push on Admin Save)' : 'Auto-Push on Admin Save'}
                </div>
                <div className="text-[11px] text-slate-500">
                  {lang === 'bn'
                    ? 'এডমিন যেকোনো পরিবর্তন সেভ করলেই স্বয়ংক্রিয়ভাবে গিটহাবে পুশ হবে।'
                    : 'Automatically push updates to GitHub when saving edits in admin panel.'}
                </div>
              </div>
              <input
                type="checkbox"
                checked={formData.autoPushOnChange}
                onChange={(e) => setFormData({ ...formData, autoPushOnChange: e.target.checked })}
                className="w-4 h-4 text-emerald-600 rounded"
              />
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <label className="block font-bold text-slate-700 mb-1">
                {lang === 'bn' ? 'সকল ব্রাউজারে লাইভ আপডেট সময়সীমা (Interval)' : 'Visitor Browser Auto-Sync Interval'}
              </label>
              <select
                value={formData.autoPollIntervalSec}
                onChange={(e) => setFormData({ ...formData, autoPollIntervalSec: Number(e.target.value) })}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none"
              >
                <option value={15}>প্রতি ১৫ সেকেন্ড পর পর (15 Seconds - Ultra Fast)</option>
                <option value={30}>প্রতি ৩০ সেকেন্ড পর পর (30 Seconds - Recommended)</option>
                <option value={60}>প্রতি ১ মিনিট পর পর (1 Minute - Light)</option>
                <option value={120}>প্রতি ২ মিনিট পর পর (2 Minutes)</option>
              </select>
            </div>
          </div>

          {/* Quick Push with Custom Commit Message */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <label className="block font-bold text-slate-700">
              {lang === 'bn' ? 'ম্যানুয়াল পুশের জন্য কমিট বার্তা (ঐচ্ছিক)' : 'Commit Message for Manual Push (Optional)'}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={lang === 'bn' ? 'উদা: কোর্স ও নোটিশ লাইভ আপডেট সম্পন্ন' : 'e.g. Updated courses and notices for HSC 2026'}
                value={customCommitMsg}
                onChange={(e) => setCustomCommitMsg(e.target.value)}
                className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleManualPush}
                disabled={isSyncing}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shrink-0"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>{isSyncing ? (lang === 'bn' ? 'পুশ হচ্ছে...' : 'Pushing...') : (lang === 'bn' ? 'গিটহাবে পুশ করুন' : 'Push Snapshot')}</span>
              </button>
            </div>
          </div>

          {/* Live Links Preview */}
          {repoUrl && (
            <div className="bg-slate-900 text-slate-100 p-4 rounded-2xl space-y-2 font-mono text-[11px]">
              <div className="text-emerald-400 font-sans font-bold text-xs flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" />
                {lang === 'bn' ? 'লাইভ গিটহাব ইউআরএল ও সিডিএন এন্ডপয়েন্ট:' : 'Live GitHub & CDN Endpoints:'}
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 overflow-x-auto">
                <span className="text-slate-400">Repository:</span>
                <a
                  href={repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-400 hover:underline flex items-center gap-1"
                >
                  {repoUrl}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              {rawDataUrl && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 overflow-x-auto pt-1 border-t border-slate-800">
                  <span className="text-slate-400">Raw JSON CDN:</span>
                  <a
                    href={rawDataUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sky-400 hover:underline flex items-center gap-1"
                  >
                    {rawDataUrl}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Save Action */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{lang === 'bn' ? 'গিটহাব এপিআই সেটিংস সংরক্ষণ করুন' : 'Save GitHub API Settings'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Step by Step Guide & Help */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <BookA className="w-4 h-4 text-emerald-600" />
          {lang === 'bn' ? 'গিটহাব এপিআই সেটআপ ও লাইভ সিঙ্ক নির্দেশিকা' : 'GitHub Setup & Live Sync Instructions'}
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <div className="font-bold text-slate-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">১</span>
              {lang === 'bn' ? 'গিটহাবে রিপোজিটরি তৈরি করুন' : 'Create GitHub Repository'}
            </div>
            <p>
              {lang === 'bn'
                ? 'github.com এ লগইন করে একটি নতুন রিপোজিটরি তৈরি করুন (যেমন: "ihaveaschool-live-database")। এটি পাবলিক বা প্রাইভেট যেকোনোটি হতে পারে।'
                : 'Create a new repository on github.com (e.g., "ihaveaschool-live-database"). It can be either public or private.'}
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <div className="font-bold text-slate-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">২</span>
              {lang === 'bn' ? 'Personal Access Token সংগ্রহ করুন' : 'Get Personal Access Token'}
            </div>
            <p>
              {lang === 'bn'
                ? 'GitHub Profile > Settings > Developer settings > Personal access tokens (classic) থেকে একটি নতুন টোকেন নিন এবং অবশ্যই "repo" বক্সে টিক দিন।'
                : 'Generate a classic token in GitHub Settings with the "repo" scope checked so the app can commit files.'}
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <div className="font-bold text-slate-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">৩</span>
              {lang === 'bn' ? 'টোকেন ও রিপোজিটরি নাম বসান' : 'Input Credentials'}
            </div>
            <p>
              {lang === 'bn'
                ? 'উপরের ফর্মে টোকেন, আপনার গিটহাব ইউজারনেম ও রিপোজিটরি নাম দিয়ে "সংযোগ পরীক্ষা করুন" ক্লিক করুন।'
                : 'Fill in the token, owner, and repository name in the form above and click "Test Connection".'}
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <div className="font-bold text-slate-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">৪</span>
              {lang === 'bn' ? 'স্বয়ংক্রিয় পুশ ও লাইভ ব্রাউজার আপডেট' : 'Auto-Push & Live Updates'}
            </div>
            <p>
              {lang === 'bn'
                ? 'এডমিন যেকোনো কিছু পরিবর্তন বা সেভ করার সাথে সাথে তা গিটহাবে পুশ হবে এবং যেকোনো ব্রাউজারে সাইট খোলা থাকা অবস্থায় সরাসরি লাইভ আপডেট হবে।'
                : 'Whenever the admin saves or edits content, changes are pushed to GitHub, instantly syncing across all visitor browsers!'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
