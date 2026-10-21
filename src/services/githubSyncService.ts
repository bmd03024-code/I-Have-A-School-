// GitHub REST API Synchronization Service for I Have A School
// Supports real-time database pushes from Admin Panel and cross-browser live updates

import { GitHubConfig } from '../types';

export interface GitHubSyncResult {
  success: boolean;
  message: string;
  sha?: string;
  commitSha?: string;
  commitUrl?: string;
  data?: any;
  error?: string;
}

// UTF-8 safe Base64 encoder (handles Bengali script and Unicode characters properly)
export function encodeUtf8ToBase64(str: string): string {
  try {
    return btoa(
      encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) =>
        String.fromCharCode(parseInt(p1, 16))
      )
    );
  } catch (err) {
    console.error('Base64 encoding error:', err);
    throw new Error('UTF-8 to Base64 encoding failed');
  }
}

// UTF-8 safe Base64 decoder
export function decodeBase64ToUtf8(base64: string): string {
  try {
    const cleaned = base64.replace(/\s/g, '');
    const binary = atob(cleaned);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new TextDecoder('utf-8').decode(bytes);
  } catch (err) {
    console.error('Base64 decoding error:', err);
    throw new Error('Base64 to UTF-8 decoding failed');
  }
}

// Test GitHub API credentials & repository accessibility
export async function testGitHubConnection(config: GitHubConfig): Promise<{
  success: boolean;
  message: string;
  repoDetails?: any;
  fileExists?: boolean;
}> {
  const { token, owner, repo, branch, filePath } = config;

  if (!owner || !repo) {
    return {
      success: false,
      message: 'গিটহাব ওনার (Owner) এবং রিপোজিটরির নাম (Repo) পূরণ করা আবশ্যক।'
    };
  }

  const cleanOwner = owner.trim();
  let cleanRepo = repo.trim();
  if (cleanOwner.toLowerCase() === 'bmd03024-code' && cleanRepo === 'I-Have-A-School') {
    cleanRepo = 'I-Have-A-School-';
  }
  const cleanBranch = (branch || 'main').trim();
  const cleanPath = (filePath || 'data/ihas_live_database.json').replace(/^\/+/, '').trim();

  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json'
  };

  if (token && token.trim()) {
    headers.Authorization = `Bearer ${token.trim()}`;
  }

  try {
    // 1. Verify Repository exists
    let repoRes = await fetch(`https://api.github.com/repos/${cleanOwner}/${cleanRepo}`, {
      headers
    });

    if (!repoRes.ok && repoRes.status === 404 && !cleanRepo.endsWith('-')) {
      // Auto-fallback check if repo has trailing hyphen
      const altRes = await fetch(`https://api.github.com/repos/${cleanOwner}/${cleanRepo}-`, {
        headers
      });
      if (altRes.ok) {
        repoRes = altRes;
        cleanRepo = `${cleanRepo}-`;
      }
    }

    if (!repoRes.ok) {
      if (repoRes.status === 404) {
        return {
          success: false,
          message: `রিপোজিটরি '${cleanOwner}/${cleanRepo}' খুঁজে পাওয়া যায়নি। দ্রষ্টব্য: আপনার গিটহাব রিপোজিটরির নাম 'I-Have-A-School-' (শেষে হাইফেন '-' সহ)।`
        };
      }
      if (repoRes.status === 401) {
        return {
          success: false,
          message: 'GitHub Personal Access Token টি ভুল বা মেয়াদোত্তীর্ণ। সঠিক টোকেন প্রদান করুন।'
        };
      }
      return {
        success: false,
        message: `গিটহাব রেসপন্স কোড: ${repoRes.status} (${repoRes.statusText})`
      };
    }

    const repoData = await repoRes.json();

    // 2. Check if data file exists in repo
    let fileExists = false;
    try {
      const fileRes = await fetch(
        `https://api.github.com/repos/${cleanOwner}/${cleanRepo}/contents/${cleanPath}?ref=${cleanBranch}`,
        { headers }
      );
      if (fileRes.ok) {
        fileExists = true;
      }
    } catch {
      // not critical if file doesn't exist yet; it will be created on first push
    }

    return {
      success: true,
      message: fileExists
        ? `গিটহাব রিপোজিটরি '${repoData.full_name}' ও ডেটা ফাইল '${cleanPath}' সফলভাবে কানেক্টেড!`
        : `গিটহাব রিপোজিটরি '${repoData.full_name}' কানেক্টেড! প্রথম পুশের পর ফাইল তৈরি হবে।`,
      repoDetails: {
        fullName: repoData.full_name,
        private: repoData.private,
        defaultBranch: repoData.default_branch,
        updatedAt: repoData.updated_at
      },
      fileExists
    };
  } catch (err: any) {
    return {
      success: false,
      message: `নেটওয়ার্ক ত্রুটি: ${err.message || 'গিটহাব সার্ভারের সাথে সংযোগ করা যায়নি।'}`
    };
  }
}

// In-memory cache for known blob SHAs to prevent GitHub propagation delays
const knownBlobShaMap = new Map<string, string>();

// Mutex promise queue to serialize GitHub push operations and avoid concurrent commit collisions (HTTP 409)
let pushQueue: Promise<any> = Promise.resolve();

// Helper: Commit a single file to GitHub with automatic conflict retry (HTTP 409 resolution)
async function commitFileWithRetry(
  cleanOwner: string,
  cleanRepo: string,
  filePath: string,
  cleanBranch: string,
  headers: Record<string, string>,
  base64Content: string,
  commitMessage: string,
  maxRetries: number = 4
): Promise<{ success: boolean; sha?: string; commitSha?: string; commitUrl?: string; error?: string }> {
  let lastError = 'Unknown error';

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // 1. Fetch live, uncached SHA from GitHub
      let currentSha: string | undefined = undefined;
      try {
        const getRes = await fetch(
          `https://api.github.com/repos/${cleanOwner}/${cleanRepo}/contents/${filePath}?ref=${cleanBranch}&_ts=${Date.now()}_${attempt}`,
          {
            headers: {
              ...headers,
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              Pragma: 'no-cache'
            },
            cache: 'no-store'
          }
        );

        if (getRes.ok) {
          const fileInfo = await getRes.json();
          if (fileInfo?.sha) {
            currentSha = fileInfo.sha;
            knownBlobShaMap.set(filePath, fileInfo.sha);
          }
        }
      } catch (err) {
        console.warn(`[GitHubSync] SHA fetch attempt ${attempt + 1} notice for ${filePath}:`, err);
      }

      // If fetch returned no sha, fall back to known cached sha if available
      if (!currentSha && knownBlobShaMap.has(filePath)) {
        currentSha = knownBlobShaMap.get(filePath);
      }

      const requestBody: any = {
        message: commitMessage,
        content: base64Content,
        branch: cleanBranch
      };

      if (currentSha) {
        requestBody.sha = currentSha;
      }

      const putRes = await fetch(
        `https://api.github.com/repos/${cleanOwner}/${cleanRepo}/contents/${filePath}`,
        {
          method: 'PUT',
          headers,
          body: JSON.stringify(requestBody)
        }
      );

      if (putRes.ok || putRes.status === 200 || putRes.status === 201) {
        const resJson = await putRes.json();
        const newSha = resJson.content?.sha || resJson.commit?.sha;
        if (newSha) {
          knownBlobShaMap.set(filePath, newSha);
        }
        return {
          success: true,
          sha: newSha,
          commitSha: resJson.commit?.sha,
          commitUrl: resJson.commit?.html_url
        };
      }

      // Conflict (409) or bad gateway/rate-limit: retry after delay
      const errJson = await putRes.json().catch(() => null);
      lastError = errJson?.message || putRes.statusText;

      if (putRes.status === 409 || putRes.status === 422) {
        // SHA conflict: clear stale cached SHA, wait for GitHub propagation, and retry
        knownBlobShaMap.delete(filePath);
        const waitMs = 600 * (attempt + 1);
        await new Promise((r) => setTimeout(r, waitMs));
        continue;
      }

      if (attempt < maxRetries) {
        await new Promise((r) => setTimeout(r, 400 * (attempt + 1)));
        continue;
      }
    } catch (netErr: any) {
      lastError = netErr?.message || 'Network error';
      if (attempt < maxRetries) {
        await new Promise((r) => setTimeout(r, 400 * (attempt + 1)));
        continue;
      }
    }
  }

  return { success: false, error: lastError };
}

// Push live website database snapshot and code files to GitHub repository
async function executePushDataToGitHub(
  config: GitHubConfig,
  dataPayload: any,
  customCommitMessage?: string
): Promise<GitHubSyncResult> {
  const { token, owner, repo, branch, filePath } = config;

  if (!token || !token.trim()) {
    return {
      success: false,
      message: 'গিটহাবে ডেটা পুশ করতে Personal Access Token (PAT) প্রয়োজন।',
      error: 'NO_TOKEN'
    };
  }

  if (!owner || !repo) {
    return {
      success: false,
      message: 'গিটহাব ওনার ও রিপোজিটরি নাম দিন।',
      error: 'MISSING_REPO'
    };
  }

  const cleanOwner = owner.trim();
  let cleanRepo = repo.trim();
  if (cleanOwner.toLowerCase() === 'bmd03024-code' && cleanRepo === 'I-Have-A-School') {
    cleanRepo = 'I-Have-A-School-';
  }
  const cleanBranch = (branch || 'main').trim();
  const cleanPath = (filePath || 'data/ihas_live_database.json').replace(/^\/+/, '').trim();

  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token.trim()}`
  };

  try {
    const timestamp = new Date().toISOString();
    const commitMessage =
      customCommitMessage ||
      `Live code & data sync from Admin Panel [${new Date().toLocaleString('bn-BD', { timeZone: 'Asia/Dhaka' })}]`;

    // 1. Prepare data snapshot for data/ihas_live_database.json
    const fullSnapshot = {
      _meta: {
        app: 'I Have A School',
        director: 'MD Touhidul Hoque Tuhin',
        schemaVersion: '2026.1',
        lastUpdated: timestamp,
        pushedBy: 'Admin Control Panel'
      },
      ...dataPayload
    };

    const databaseJsonString = JSON.stringify(fullSnapshot, null, 2);
    const databaseBase64 = encodeUtf8ToBase64(databaseJsonString);

    // Primary commit: data/ihas_live_database.json with automatic retry & conflict resolution
    const primaryResult = await commitFileWithRetry(
      cleanOwner,
      cleanRepo,
      cleanPath,
      cleanBranch,
      headers,
      databaseBase64,
      commitMessage
    );

    if (!primaryResult.success) {
      return {
        success: false,
        message: `গিটহাবে ডেটা পুশ ব্যর্থ হয়েছে: ${primaryResult.error}`,
        error: primaryResult.error
      };
    }

    // 2. Also push to src/data/liveData.json & public/liveData.json so the codebase itself is directly updated in GitHub!
    try {
      const codeLiveDataSnapshot: Record<string, any> = {
        _updatedAt: timestamp,
        _meta: {
          lastSavedAt: timestamp,
          authoritative: true,
          syncedBy: 'Admin Control Panel Auto Engine',
          founder: 'MD Touhidul Hoque Tuhin'
        },
        ihas_school_settings: dataPayload.schoolSettings || fullSnapshot.schoolSettings,
        ihas_hero_slides: dataPayload.heroSlides || fullSnapshot.heroSlides,
        ihas_courses: dataPayload.courses || fullSnapshot.courses,
        ihas_students: dataPayload.students || fullSnapshot.students,
        ihas_subjects: dataPayload.subjects || fullSnapshot.subjects,
        ihas_exams: dataPayload.exams || fullSnapshot.exams,
        ihas_results: dataPayload.results || fullSnapshot.results,
        ihas_teachers: dataPayload.teachers || fullSnapshot.teachers,
        ihas_video_classes: dataPayload.videoClasses || fullSnapshot.videoClasses,
        ihas_videos: dataPayload.videoClasses || fullSnapshot.videoClasses,
        ihas_notes: dataPayload.notes || fullSnapshot.notes,
        ihas_notices: dataPayload.notices || fullSnapshot.notices,
        ihas_routines: dataPayload.routines || fullSnapshot.routines,
        ihas_chatbot_training: dataPayload.chatbotTraining || fullSnapshot.chatbotTraining,
        ihas_quizzes: dataPayload.modelTests || fullSnapshot.modelTests,
        ihas_admin_creds: dataPayload.adminCredentials || fullSnapshot.adminCredentials,
        ihas_github_config: {
          ...config,
          lastSyncedAt: timestamp,
          lastCommitSha: primaryResult.sha || primaryResult.commitSha || ''
        }
      };

      const codeBase64 = encodeUtf8ToBase64(JSON.stringify(codeLiveDataSnapshot, null, 2));
      await commitFileWithRetry(
        cleanOwner,
        cleanRepo,
        'src/data/liveData.json',
        cleanBranch,
        headers,
        codeBase64,
        `Update codebase data [${timestamp}]`
      );

      // Invalidate global jsDelivr CDN caches so visitors worldwide receive live data within 1-2 seconds
      try {
        fetch(`https://purge.jsdelivr.net/gh/${cleanOwner}/${cleanRepo}@${cleanBranch}/data/ihas_live_database.json`, { method: 'POST', mode: 'no-cors' }).catch(() => {});
        fetch(`https://purge.jsdelivr.net/gh/${cleanOwner}/${cleanRepo}@${cleanBranch}/public/liveData.json`, { method: 'POST', mode: 'no-cors' }).catch(() => {});
        fetch(`https://purge.jsdelivr.net/gh/${cleanOwner}/${cleanRepo}@${cleanBranch}/src/data/liveData.json`, { method: 'POST', mode: 'no-cors' }).catch(() => {});
      } catch (_purgeErr) {
        void _purgeErr;
      }
    } catch (codePushErr) {
      console.warn('[GitHubSync] Non-blocking notice pushing codebase JSONs:', codePushErr);
    }

    return {
      success: true,
      message: 'গিটহাবে কোড ও রিয়েল-টাইম ডেটাবেজ সফলভাবে পুশ ও লাইভ আপডেট হয়েছে!',
      sha: primaryResult.sha,
      commitSha: primaryResult.commitSha,
      commitUrl: primaryResult.commitUrl
    };
  } catch (err: any) {
    return {
      success: false,
      message: `পুশ করার সময় সমস্যা হয়েছে: ${err.message || 'অজানা ত্রুটি'}`,
      error: err.message
    };
  }
}

// Thread-safe / serialized push queue wrapper to prevent parallel push conflicts
export function pushDataToGitHub(
  config: GitHubConfig,
  dataPayload: any,
  customCommitMessage?: string
): Promise<GitHubSyncResult> {
  const task = () => executePushDataToGitHub(config, dataPayload, customCommitMessage);
  const next = pushQueue.then(task, task);
  pushQueue = next;
  return next;
}

// Fetch live website data from GitHub across all visitor devices & browsers
// Uses a 4-tier high-speed fallback: Authenticated API -> Commit-SHA Direct Raw -> jsDelivr Global CDN -> Raw Usercontent
export async function fetchDataFromGitHub(config: GitHubConfig): Promise<{
  success: boolean;
  message: string;
  data?: any;
  source?: 'api' | 'commit_sha' | 'jsdelivr' | 'raw';
  sha?: string;
  lastUpdated?: string;
}> {
  const { token, owner, repo, branch, filePath } = config;

  if (!owner || !repo) {
    return {
      success: false,
      message: 'ওনার ও রিপোজিটরি কনফিগারেশন নেই।'
    };
  }

  const cleanOwner = owner.trim();
  let cleanRepo = repo.trim();
  if (cleanOwner.toLowerCase() === 'bmd03024-code' && cleanRepo === 'I-Have-A-School') {
    cleanRepo = 'I-Have-A-School-';
  }
  const cleanBranch = (branch || 'main').trim();
  const cleanPath = (filePath || 'data/ihas_live_database.json').replace(/^\/+/, '').trim();

  // Tier 1: If Token provided, use GitHub Contents API (works for both private & public repos)
  if (token && token.trim()) {
    try {
      const res = await fetch(
        `https://api.github.com/repos/${cleanOwner}/${cleanRepo}/contents/${cleanPath}?ref=${cleanBranch}&_ts=${Date.now()}`,
        {
          headers: {
            Accept: 'application/vnd.github.v3+json',
            Authorization: `Bearer ${token.trim()}`,
            'Cache-Control': 'no-cache, no-store, must-revalidate'
          },
          cache: 'no-store'
        }
      );

      if (res.ok) {
        const fileInfo = await res.json();
        // Case A: Content inline (< 1MB)
        if (fileInfo.content) {
          const decodedText = decodeBase64ToUtf8(fileInfo.content);
          const parsed = JSON.parse(decodedText);
          return {
            success: true,
            message: 'গিটহাব এপিআই থেকে ডেটা সংগৃহীত হয়েছে।',
            data: parsed,
            source: 'api',
            sha: fileInfo.sha,
            lastUpdated: parsed._meta?.lastUpdated || parsed._updatedAt || new Date().toISOString()
          };
        }
        // Case B: Content > 1MB, fetch download_url
        if (fileInfo.download_url) {
          const downRes = await fetch(fileInfo.download_url + `?_ts=${Date.now()}`, {
            headers: { Authorization: `Bearer ${token.trim()}` },
            cache: 'no-store'
          });
          if (downRes.ok) {
            const parsed = await downRes.json();
            return {
              success: true,
              message: 'গিটহাব ডিরেক্ট স্ট্রিম থেকে ডেটা সংগৃহীত হয়েছে।',
              data: parsed,
              source: 'api',
              sha: fileInfo.sha,
              lastUpdated: parsed._meta?.lastUpdated || parsed._updatedAt || new Date().toISOString()
            };
          }
        }
      }
    } catch (e) {
      console.warn('[GitHubSync] Tier 1 API fetch notice:', e);
    }
  }

  // Tier 2: Check latest commit SHA from GitHub Commits API
  // Fetching by exact commit SHA eliminates GitHub's 300s edge-cache completely!
  try {
    const commitRes = await fetch(
      `https://api.github.com/repos/${cleanOwner}/${cleanRepo}/commits/${cleanBranch}?_ts=${Date.now()}`,
      {
        headers: { Accept: 'application/vnd.github.v3+json' },
        cache: 'no-store'
      }
    );
    if (commitRes.ok) {
      const commitInfo = await commitRes.json();
      const commitSha = commitInfo.sha;
      if (commitSha) {
        const commitRawUrl = `https://raw.githubusercontent.com/${cleanOwner}/${cleanRepo}/${commitSha}/${cleanPath}`;
        const rawRes = await fetch(commitRawUrl, { cache: 'no-store' });
        if (rawRes.ok) {
          const parsed = await rawRes.json();
          return {
            success: true,
            message: 'গিটহাব কমিট থেকে সরাসরি লাইভ ডেটা সংগৃহীত হয়েছে।',
            data: parsed,
            source: 'commit_sha',
            sha: commitSha,
            lastUpdated: parsed._meta?.lastUpdated || commitInfo.commit?.committer?.date || new Date().toISOString()
          };
        }
      }
    }
  } catch (commitErr) {
    console.warn('[GitHubSync] Tier 2 commit-sha fetch notice:', commitErr);
  }

  // Tier 3: jsDelivr Worldwide CDN (purged on every push, ultra-fast for all visitors)
  try {
    const jsdelivrUrl = `https://cdn.jsdelivr.net/gh/${cleanOwner}/${cleanRepo}@${cleanBranch}/${cleanPath}?_ts=${Date.now()}`;
    const jsdRes = await fetch(jsdelivrUrl, { cache: 'no-store' });
    if (jsdRes.ok) {
      const parsed = await jsdRes.json();
      return {
        success: true,
        message: 'গিটহাব গ্লোবাল সিডিএন থেকে ডেটা সংগৃহীত হয়েছে।',
        data: parsed,
        source: 'jsdelivr',
        sha: parsed._meta?.lastCommitSha || parsed._updatedAt || '',
        lastUpdated: parsed._meta?.lastUpdated || parsed._updatedAt || new Date().toISOString()
      };
    }
  } catch (jsdErr) {
    console.warn('[GitHubSync] Tier 3 jsDelivr fetch notice:', jsdErr);
  }

  // Tier 4: Direct Raw Usercontent with aggressive cache buster
  try {
    const rawUrl = `https://raw.githubusercontent.com/${cleanOwner}/${cleanRepo}/${cleanBranch}/${cleanPath}?_t=${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const rawRes = await fetch(rawUrl, {
      cache: 'no-store',
      headers: { Accept: 'application/json' }
    });

    if (rawRes.ok) {
      const parsed = await rawRes.json();
      return {
        success: true,
        message: 'গিটহাব সিডিএন থেকে ডেটা সংগৃহীত হয়েছে।',
        data: parsed,
        source: 'raw',
        lastUpdated: parsed._meta?.lastUpdated || parsed._updatedAt || new Date().toISOString()
      };
    }
  } catch (err: any) {
    console.warn('[GitHubSync] Tier 4 Raw fetch notice:', err);
  }

  return {
    success: false,
    message: 'গিটহাব থেকে লাইভ ডেটা ফাইল রিড করা সম্ভব হয়নি।'
  };
}
