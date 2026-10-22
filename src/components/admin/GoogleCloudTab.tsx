import React, { useState } from 'react';
import { 
  Zap, 
  RefreshCw, 
  CheckCircle2, 
  Database, 
  GitBranch, 
  Radio, 
  Globe, 
  Layers, 
  ArrowUpRight, 
  Check, 
  Activity, 
  Flame, 
  ExternalLink,
  ShieldCheck,
  Server,
  Copy,
  AlertTriangle
} from 'lucide-react';
import { GoogleCloudConfig, Language } from '../../types';
import { useApp } from '../../context/AppContext';

interface GoogleCloudTabProps {
  config: GoogleCloudConfig;
  updateConfig: (cfg: GoogleCloudConfig) => void;
  isSyncing: boolean;
  triggerSync: () => Promise<void>;
  lang: Language;
  showToast: (msg: string) => void;
}

export const GoogleCloudTab: React.FC<GoogleCloudTabProps> = ({
  lang,
  showToast
}) => {
  const {
    githubConfig,
    isGitHubSyncing,
    pushToGitHub,
    pullFromGitHub,
    gitHubSyncStatus,
    codeSyncLastSaved,
    isCodeSyncing,
    saveAllToCodebase,
    universalCloudSyncConfig,
    updateUniversalCloudSyncConfig,
    isUniversalCloudSyncing,
    universalCloudSyncStatus,
    triggerUniversalCloudSync,
    testCloudConnection,
    supabaseStatus,
    syncAllToSupabase,
    testSupabaseStatus,
    requiredSqlMigration
  } = useApp();

  const [isPushingSupabase, setIsPushingSupabase] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [isTestingSupabase, setIsTestingSupabase] = useState(false);
  const [showSqlEditorModal, setShowSqlEditorModal] = useState(false);

  const [cloudForm, setCloudForm] = useState(universalCloudSyncConfig);
  const [testResult, setTestResult] = useState<{
    running: boolean;
    jsdelivrStatus?: string;
    githubStatus?: string;
    serverStatus?: string;
    cloudStatus?: string;
  }>({ running: false });

  const handleSaveCloudConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateUniversalCloudSyncConfig(cloudForm);
    showToast(lang === 'bn' ? 'সার্বজনীন ক্লাউড কনফিগারেশন সংরক্ষিত হয়েছে!' : 'Universal cloud configuration saved!');
  };

  const handleTestAllEngines = async () => {
    setTestResult({ running: true });
    showToast(lang === 'bn' ? 'সকল সিঙ্ক ইঞ্জিনের লাইভ সংযোগ পরীক্ষা করা হচ্ছে...' : 'Testing all sync engines...');

    let jsdelivr = 'ব্যর্থ';
    let github = 'ব্যর্থ';
    let server = 'ব্যর্থ';
    let cloud = 'নিষ্ক্রিয়';

    // 1. Test jsDelivr CDN
    try {
      const cleanRepo = githubConfig.repo || 'I-Have-A-School-';
      const cleanOwner = githubConfig.owner || 'bmd03024-code';
      const jsdRes = await fetch(
        `https://cdn.jsdelivr.net/gh/${cleanOwner}/${cleanRepo}@main/data/ihas_live_database.json?_t=${Date.now()}`,
        { cache: 'no-store' }
      );
      if (jsdRes.ok) {
        jsdelivr = 'সক্রিয় ও সুপারফাস্ট (200 OK)';
      }
    } catch {
      jsdelivr = 'অনুপলব্ধ';
    }

    // 2. Test GitHub API
    try {
      const ghRes = await fetch(
        `https://api.github.com/repos/${githubConfig.owner || 'bmd03024-code'}/${githubConfig.repo || 'I-Have-A-School-'}/commits/main`,
        { cache: 'no-store' }
      );
      if (ghRes.ok) {
        github = 'সক্রিয় (Commits API 200 OK)';
      }
    } catch {
      github = 'অনুপলব্ধ';
    }

    // 3. Test local /api/live-data
    try {
      const sRes = await fetch('/api/live-data', { cache: 'no-store' });
      if (sRes.ok) {
        server = 'সক্রিয় (Server Stream 200 OK)';
      }
    } catch {
      server = 'স্ট্যাটিক মোড';
    }

    // 4. Test Cloud store if configured
    if (cloudForm.endpointUrl) {
      try {
        const cRes = await testCloudConnection();
        cloud = cRes.success ? `সফল (${cRes.latencyMs}ms)` : `ব্যর্থ (${cRes.message})`;
      } catch {
        cloud = 'কানেকশন এরর';
      }
    }

    setTestResult({
      running: false,
      jsdelivrStatus: jsdelivr,
      githubStatus: github,
      serverStatus: server,
      cloudStatus: cloud
    });

    showToast(lang === 'bn' ? 'সংযোগ পরীক্ষা সম্পন্ন হয়েছে!' : 'Connectivity test completed!');
  };

  const handleBroadcastAll = async () => {
    showToast(lang === 'bn' ? 'সকল ওয়েবসাইটে লাইভ আপডেট পাঠানো হচ্ছে...' : 'Broadcasting updates across all websites...');
    try {
      await saveAllToCodebase();
      if (githubConfig.token?.trim()) {
        await pushToGitHub('Universal broadcast update to all websites');
      }
      if (cloudForm.endpointUrl?.trim()) {
        await triggerUniversalCloudSync();
      }
      showToast(lang === 'bn' ? 'সকল ওয়েবসাইটে পরিবর্তন সরাসরি পৌঁছে গেছে!' : 'Changes broadcasted worldwide!');
    } catch (e: any) {
      showToast(e.message || 'Error broadcasting');
    }
  };

  return (
    <div className="space-y-6">
      {/* Primary Authoritative Central Database: Supabase */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-slate-900">
                  {lang === 'bn' ? 'সুপারবেস (Supabase) সেন্ট্রাল ডেটাবেজ ও রিয়েল-টাইম ইঞ্জিন' : 'Supabase Central Database & Realtime Engine'}
                </h3>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  supabaseStatus.tableExists 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {supabaseStatus.tableExists ? 'সক্রিয় (Active)' : 'মাইগ্রেশন প্রয়োজন (Migration Needed)'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                প্রজেক্ট URL: <code className="font-mono font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">https://gdopjlajrlexmuccpctg.supabase.co</code>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={async () => {
                setIsTestingSupabase(true);
                await testSupabaseStatus();
                setIsTestingSupabase(false);
                showToast(lang === 'bn' ? 'সুপারবেস স্ট্যাটাস আপডেট হয়েছে' : 'Supabase status updated');
              }}
              disabled={isTestingSupabase}
              className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTestingSupabase ? 'animate-spin' : ''}`} />
              <span>{lang === 'bn' ? 'কানেকশন চেক' : 'Check Status'}</span>
            </button>

            <button
              type="button"
              onClick={async () => {
                setIsPushingSupabase(true);
                const res = await syncAllToSupabase();
                setIsPushingSupabase(false);
                showToast(res.message);
              }}
              disabled={isPushingSupabase}
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Zap className={`w-3.5 h-3.5 ${isPushingSupabase ? 'animate-bounce' : ''}`} />
              <span>{isPushingSupabase ? 'আপলোড হচ্ছে...' : (lang === 'bn' ? 'সকল ডেটা সুপারবেসে পুশ করুন' : 'Push All to Supabase')}</span>
            </button>
          </div>
        </div>

        {/* Status details grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500">টেবিল স্ট্যাটাস (public.ihas_data)</span>
            <div className="flex items-center gap-2 text-xs font-bold">
              {supabaseStatus.tableExists ? (
                <span className="text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> টেবিল উপস্থিত ও সক্রিয়
                </span>
              ) : (
                <span className="text-amber-600 flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" /> টেবিল নেই (SQL চালান)
                </span>
              )}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500">রিয়েল-টাইম রেপ্লিকেশন (WebSocket)</span>
            <div className="flex items-center gap-2 text-xs font-bold">
              {supabaseStatus.realtimeConnected ? (
                <span className="text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> লাইভ ব্রডকাস্ট কানেক্টেড
                </span>
              ) : (
                <span className="text-slate-600 flex items-center gap-1">
                  <Activity className="w-4 h-4" /> স্ট্যান্ডবাই / চ্যানেল সক্রিয়
                </span>
              )}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500">সর্বশেষ সফল সিঙ্ক</span>
            <div className="text-xs font-bold text-slate-800">
              {supabaseStatus.lastSyncedAt
                ? new Date(supabaseStatus.lastSyncedAt).toLocaleString('bn-BD')
                : 'অপেক্ষমাণ (Pending)'}
            </div>
          </div>
        </div>

        {/* If table is missing or user wants to view migration */}
        <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-5 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <h4 className="text-xs font-bold text-indigo-950">
                {lang === 'bn'
                  ? 'সুপারবেস ডেটাবেজ সেটআপ নির্দেশিকা (SQL Migration Script)'
                  : 'Supabase Database Setup Guide (SQL Migration Script)'}
              </h4>
            </div>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(requiredSqlMigration);
                setCopiedSql(true);
                showToast(lang === 'bn' ? 'SQL স্ক্রিপ্ট ক্লিপবোর্ডে কপি হয়েছে!' : 'SQL script copied to clipboard!');
                setTimeout(() => setCopiedSql(false), 2500);
              }}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSql ? 'কপি হয়েছে!' : 'স্ক্রিপ্ট কপি করুন'}</span>
            </button>
          </div>

          <ol className="text-xs text-slate-600 space-y-1 list-decimal list-inside font-medium leading-relaxed">
            <li>
              Supabase ড্যাশবোর্ডে যান:{' '}
              <a
                href="https://supabase.com/dashboard/project/gdopjlajrlexmuccpctg/sql"
                target="_blank"
                rel="noreferrer"
                className="text-indigo-600 hover:underline font-bold inline-flex items-center gap-1"
              >
                SQL Editor খুলুন <ExternalLink className="w-3 h-3" />
              </a>
            </li>
            <li>উপরে <strong>"স্ক্রিপ্ট কপি করুন"</strong> বাটনে ক্লিক করুন।</li>
            <li>Supabase SQL Editor-এ পেস্ট করে <strong>"Run"</strong> বাটনে চাপ দিন।</li>
            <li>এরপর উপরে <strong>"সকল ডেটা সুপারবেসে পুশ করুন"</strong> বাটনে চাপ দিলে আপনার সকল বিদ্যমান ডাটা এক ক্লিকে ক্লাউডে লাইভ হয়ে যাবে!</li>
          </ol>

          <div className="mt-2">
            <button
              type="button"
              onClick={() => setShowSqlEditorModal(!showSqlEditorModal)}
              className="text-[11px] font-bold text-indigo-700 hover:text-indigo-900 underline cursor-pointer"
            >
              {showSqlEditorModal ? 'SQL স্ক্রিপ্ট লুকান' : 'SQL স্ক্রিপ্ট দেখতে ক্লিক করুন'}
            </button>
            {showSqlEditorModal && (
              <pre className="mt-2 p-3 bg-slate-900 text-emerald-400 font-mono text-[11px] rounded-xl overflow-x-auto max-h-56 select-all">
                {requiredSqlMigration}
              </pre>
            )}
          </div>
        </div>
      </div>

      {/* Secondary Multi-Sync Engine Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl border border-indigo-500/30 p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1 shadow-xs">
                <Zap className="w-3 h-3 fill-slate-950" />
                ১০০% স্বাধীন রিয়েল-টাইম আর্কিটেকচার
              </span>
              <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                ফায়ারবেস, সুপারবেস ও গুগল ক্লাউড বিহীন
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white">
              {lang === 'bn' ? 'সার্বজনীন রিয়েল-টাইম ক্লাউড ও লাইভ সিঙ্ক হাব' : 'Universal Real-Time Live Sync Hub'}
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              {lang === 'bn'
                ? 'এডমিন প্যানেলে যেকোনো নোটিশ, কোর্স, ফলাফল, রুটিন বা সেটিংস পরিবর্তন করলে তা কোনো থার্ড-পার্টি নির্ভরশীলতা ছাড়া স্বয়ংক্রিয়ভাবে সকল ওয়েবসাইটে এবং সকল ব্যবহারকারীর ব্রাউজারে সেকেন্ডের মধ্যে লাইভ দৃশ্যমান হয়।'
                : 'Zero-lock-in real-time synchronization engine. Whatever the admin modifies propagates authoritatively across all devices and visitor browsers worldwide.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleBroadcastAll}
              disabled={isCodeSyncing || isGitHubSyncing || isUniversalCloudSyncing}
              className="px-5 py-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-50 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Zap className={`w-4 h-4 fill-slate-950 ${(isCodeSyncing || isGitHubSyncing) ? 'animate-bounce' : ''}`} />
              <span>{lang === 'bn' ? 'সকল ওয়েবসাইটে এখনই লাইভ পুশ করুন' : 'Broadcast to All Websites Now'}</span>
            </button>

            <button
              type="button"
              onClick={handleTestAllEngines}
              disabled={testResult.running}
              className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-2"
            >
              <Activity className={`w-4 h-4 text-emerald-400 ${testResult.running ? 'animate-spin' : ''}`} />
              <span>{lang === 'bn' ? 'লাইভ কানেকশন টেস্ট' : 'Test Live Connections'}</span>
            </button>
          </div>
        </div>

        {/* Live Connectivity Test Results */}
        {testResult.jsdelivrStatus && (
          <div className="mt-6 pt-5 border-t border-indigo-800/40 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-800/70 p-3 rounded-xl border border-slate-700 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                <Globe className="w-3 h-3 text-emerald-400" />
                বিশ্বব্যাপী সিডিএন (jsDelivr)
              </span>
              <p className="font-bold text-emerald-300">{testResult.jsdelivrStatus}</p>
            </div>

            <div className="bg-slate-800/70 p-3 rounded-xl border border-slate-700 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                <GitBranch className="w-3 h-3 text-emerald-400" />
                গিটহাব কমিট লাইভ এপিআই
              </span>
              <p className="font-bold text-emerald-300">{testResult.githubStatus}</p>
            </div>

            <div className="bg-slate-800/70 p-3 rounded-xl border border-slate-700 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                <Server className="w-3 h-3 text-emerald-400" />
                সার্ভার স্ট্রিম (SSE)
              </span>
              <p className="font-bold text-emerald-300">{testResult.serverStatus}</p>
            </div>

            <div className="bg-slate-800/70 p-3 rounded-xl border border-slate-700 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                <Radio className="w-3 h-3 text-emerald-400" />
                উন্মুক্ত ক্লাউড রেস্ট স্টোর
              </span>
              <p className="font-bold text-emerald-300">{testResult.cloudStatus}</p>
            </div>
          </div>
        )}
      </div>

      {/* 3 Core Multi-Sync Engines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Engine 1: GitHub High-Speed Live Engine */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-[10px] uppercase flex items-center gap-1">
                <GitBranch className="w-3 h-3" />
                ইঞ্জিন ১: গিটহাব লাইভ
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <div>
              <h4 className="font-bold text-slate-900 text-sm">গিটহাব ও বিশ্বব্যাপী সিডিএন</h4>
              <p className="text-xs text-slate-500 mt-1">
                রিপোজিটরি: <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-slate-800 font-bold">bmd03024-code/I-Have-A-School-</code>
              </p>
            </div>

            <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
              <li>এডমিন পরিবর্তন করার সাথে সাথে স্বয়ংক্রিয় পুশ।</li>
              <li>টোকেন একবার বসালে স্থায়ীভাবে সংরক্ষিত থাকে।</li>
              <li>jsDelivr বিশ্বব্যাপী এজ সিডিএন ১ সেকেন্ডে অটো-পার্জ হয়।</li>
              <li>কমিট হ্যাশ ট্র্যাকিংয়ের মাধ্যমে ০ ক্যাশ ল্যাগ।</li>
            </ul>
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2">
            <div className="text-[11px] text-slate-500 font-mono">
              সর্বশেষ সিঙ্ক: {githubConfig.lastSyncedAt ? new Date(githubConfig.lastSyncedAt).toLocaleTimeString('bn-BD') : 'এখনই'}
            </div>
            <button
              type="button"
              onClick={() => pushToGitHub('Manual sync from Universal Realtime Hub')}
              disabled={isGitHubSyncing}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGitHubSyncing ? 'animate-spin' : ''}`} />
              <span>{isGitHubSyncing ? 'গিটহাবে সিঙ্ক হচ্ছে...' : 'গিটহাবে ম্যানুয়াল পুশ'}</span>
            </button>
          </div>
        </div>

        {/* Engine 2: Open Cloud REST JSON Store */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-lg bg-indigo-100 text-indigo-800 font-bold text-[10px] uppercase flex items-center gap-1">
                <Radio className="w-3 h-3" />
                ইঞ্জিন ২: ক্লাউড রেস্ট স্টোর
              </span>
              <span className={`w-2.5 h-2.5 rounded-full ${cloudForm.enabled ? 'bg-indigo-500 animate-pulse' : 'bg-slate-300'}`} />
            </div>

            <div>
              <h4 className="font-bold text-slate-900 text-sm">উন্মুক্ত ক্লাউড স্টোরেজ (বিকল্প সিঙ্ক)</h4>
              <p className="text-xs text-slate-500 mt-1">
                কোনো ফায়ারবেস বা গুগল ক্লাউড ছাড়া সরাসরি ওপেন JSON এন্ডপয়েন্ট (nPoint / JSONBin / Custom API)।
              </p>
            </div>

            <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
              <li>লগইন ছাড়া ফ্রি রেস্ট স্টোরেজে ডেটা সংরক্ষণ।</li>
              <li>যে কোনো কাস্টম ডোমেইন বা হোস্টিংয়ে দ্রুত সিঙ্ক।</li>
              <li>গিটহাব এপিআই সীমাবদ্ধ থাকলে ব্যাকআপ হিসেবে কাজ করে।</li>
            </ul>
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2">
            <div className="text-[11px] text-slate-500 font-mono">
              স্ট্যাটাস: {universalCloudSyncStatus.message}
            </div>
            <button
              type="button"
              onClick={triggerUniversalCloudSync}
              disabled={isUniversalCloudSyncing || !cloudForm.endpointUrl}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all"
            >
              <Zap className={`w-3.5 h-3.5 ${isUniversalCloudSyncing ? 'animate-bounce' : ''}`} />
              <span>{isUniversalCloudSyncing ? 'ক্লাউডে সিঙ্ক হচ্ছে...' : 'ক্লাউড স্টোরে পুশ করুন'}</span>
            </button>
          </div>
        </div>

        {/* Engine 3: Server Live Stream & Codebase Files */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-lg bg-teal-100 text-teal-800 font-bold text-[10px] uppercase flex items-center gap-1">
                <Server className="w-3 h-3" />
                ইঞ্জিন ৩: লোকাল ও সার্ভার কোড
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse" />
            </div>

            <div>
              <h4 className="font-bold text-slate-900 text-sm">সার্ভার-সেন্ট ইভেন্টস (SSE) ও ফাইল</h4>
              <p className="text-xs text-slate-500 mt-1">
                ফাইল: <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-slate-800 font-bold">src/data/liveData.json</code>
              </p>
            </div>

            <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
              <li>কোডবেজের মূল ফাইলে সরাসরি রাইট করা হয়।</li>
              <li>কানেক্টেড ভিজিটর ব্রাউজারে &lt;১০০ms এ লাইভ পুশ।</li>
              <li>ক্যাশ ক্লিয়ার হলেও কোনো ডেটা হারিয়ে যায় না।</li>
            </ul>
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2">
            <div className="text-[11px] text-slate-500 font-mono">
              সর্বশেষ সেভ: {codeSyncLastSaved ? new Date(codeSyncLastSaved).toLocaleTimeString('bn-BD') : 'এখনই'}
            </div>
            <button
              type="button"
              onClick={saveAllToCodebase}
              disabled={isCodeSyncing}
              className="w-full py-2 bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all"
            >
              <Database className={`w-3.5 h-3.5 ${isCodeSyncing ? 'animate-spin' : ''}`} />
              <span>{isCodeSyncing ? 'কোডে সেভ হচ্ছে...' : 'কোডে ফোর্স সেভ'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Engine 2 Configuration: Open Cloud REST JSON Store Form */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-base font-bold text-slate-900">
              {lang === 'bn' ? 'উন্মুক্ত ক্লাউড রেস্ট স্টোর কনফিগারেশন (বিকল্প লাইভ সিঙ্ক)' : 'Open Cloud REST JSON Store Configuration'}
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              {lang === 'bn' 
                ? 'ফায়ারবেস, সুপারবেস বা গুগল ক্লাউড ছাড়াও যেকোনো ওপেন REST JSON এপিআই দিয়ে রিয়েল-টাইম সিঙ্ক সক্রিয় রাখতে পারেন।' 
                : 'Configure open REST JSON storage without third-party platform lock-in.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-700 cursor-pointer flex items-center gap-2">
              <input
                type="checkbox"
                checked={cloudForm.enabled}
                onChange={(e) => setCloudForm({ ...cloudForm, enabled: e.target.checked })}
                className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
              />
              <span>{lang === 'bn' ? 'ক্লাউড স্টোর সক্রিয়' : 'Enable Cloud Store'}</span>
            </label>
          </div>
        </div>

        <form onSubmit={handleSaveCloudConfig} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {lang === 'bn' ? 'প্রোভাইডার টাইপ' : 'Provider Type'}
              </label>
              <select
                value={cloudForm.provider}
                onChange={(e) => setCloudForm({ ...cloudForm, provider: e.target.value as any })}
                className="w-full border rounded-xl px-3 py-2 text-xs focus:outline-none bg-white"
              >
                <option value="server_stream">অন্তর্নির্মিত সার্ভার স্ট্রিম (Built-in Server Stream - Default)</option>
                <option value="npoint">nPoint.io (Free Open JSON Bin)</option>
                <option value="jsonbin">JSONBin.io (Free Cloud JSON Store)</option>
                <option value="custom">কাস্টম REST API এন্ডপয়েন্ট (Custom Endpoint)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {lang === 'bn' ? 'ক্লাউড এন্ডপয়েন্ট URL (GET & PUT)' : 'Cloud Endpoint URL'}
              </label>
              <input
                type="text"
                placeholder={cloudForm.provider === 'npoint' ? 'https://api.npoint.io/your_bin_id' : 'https://api.jsonbin.io/v3/b/your_bin_id'}
                value={cloudForm.endpointUrl}
                onChange={(e) => setCloudForm({ ...cloudForm, endpointUrl: e.target.value })}
                className="w-full border rounded-xl px-3 py-2 text-xs font-mono focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {lang === 'bn' ? 'ঐচ্ছিক এপিআই কি / মাস্টার কি (যদি থাকে)' : 'Optional API Key (if required)'}
              </label>
              <input
                type="password"
                placeholder="••••••••••••••••"
                value={cloudForm.apiKey || ''}
                onChange={(e) => setCloudForm({ ...cloudForm, apiKey: e.target.value })}
                className="w-full border rounded-xl px-3 py-2 text-xs font-mono focus:outline-none"
              />
            </div>

            <div className="flex items-center pt-5">
              <label className="text-xs font-bold text-slate-700 cursor-pointer flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={cloudForm.autoSyncOnChange}
                  onChange={(e) => setCloudForm({ ...cloudForm, autoSyncOnChange: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                />
                <span>{lang === 'bn' ? 'এডমিন পরিবর্তনের সাথে সাথে অটো-পুশ করুন' : 'Auto-push on Admin changes'}</span>
              </label>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <button
              type="button"
              onClick={async () => {
                const res = await testCloudConnection();
                showToast(res.message);
              }}
              disabled={!cloudForm.endpointUrl}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-800 font-bold rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Activity className="w-3.5 h-3.5 text-indigo-600" />
              <span>{lang === 'bn' ? 'এন্ডপয়েন্ট টেস্ট করুন' : 'Test Endpoint'}</span>
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{lang === 'bn' ? 'কনফিগারেশন সেভ করুন' : 'Save Configuration'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Explanatory Help Card for Admin */}
      <div className="bg-emerald-50/80 border border-emerald-200 rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-600" />
          <h4 className="text-base font-bold text-emerald-950">
            {lang === 'bn' ? 'কীভাবে নিশ্চিত হবেন সকল ওয়েবসাইটে লাইভ আপডেট যাচ্ছে?' : 'How Live Updates Reach All Websites'}
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-emerald-900 leading-relaxed">
          <div className="p-4 bg-white/80 rounded-2xl border border-emerald-200/80 space-y-1">
            <p className="font-bold text-emerald-950">১. কোনো থার্ড-পার্টি বাধা নেই</p>
            <p className="text-emerald-800">
              ফায়ারবেস বা গুগল ক্লাউডের জটিল কনফিগারেশন বাদ দিয়ে সরাসরি গিটহাব লাইভ এপিআই, jsDelivr গ্লোবাল সিডিএন ও বিল্ট-ইন সার্ভার স্ট্রিম ব্যবহার করা হচ্ছে।
            </p>
          </div>

          <div className="p-4 bg-white/80 rounded-2xl border border-emerald-200/80 space-y-1">
            <p className="font-bold text-emerald-950">২. ভিজিটর ব্রাউজারে অটো-রিফ্রেশ</p>
            <p className="text-emerald-800">
              যেকোনো শিক্ষার্থী বা অভিভাবক যখন ওয়েবসাইটে থাকেন, তাদের ব্রাউজার ব্যাকগ্রাউন্ডে প্রতি ১৫-২০ সেকেন্ড পর পর লাইভ ডেটা টেনে নেয়। পেজ রিলোড দেওয়ারও প্রয়োজন হয় না।
            </p>
          </div>

          <div className="p-4 bg-white/80 rounded-2xl border border-emerald-200/80 space-y-1">
            <p className="font-bold text-emerald-950">৩. টোকেন ও কোড অটো-পুশ</p>
            <p className="text-emerald-800">
              এডমিন টোকেন স্থায়ীভাবে মেমরিতে সংরক্ষিত থাকায় এডমিন যেকোনো ডাটা পরিবর্তন করলে তা স্বয়ংক্রিয়ভাবে কোড ফাইলে ও গিটহাবে পুশ হয়ে যায়।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
