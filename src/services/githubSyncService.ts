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
  const cleanRepo = repo.trim();
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
    const repoRes = await fetch(`https://api.github.com/repos/${cleanOwner}/${cleanRepo}`, {
      headers
    });

    if (!repoRes.ok) {
      if (repoRes.status === 404) {
        return {
          success: false,
          message: `রিপোজিটরি '${cleanOwner}/${cleanRepo}' খুঁজে পাওয়া যায়নি। রিপোজিটরি নাম ও টোকেন পারমিশন চেক করুন।`
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

// Push live website database snapshot to GitHub repository
export async function pushDataToGitHub(
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
  const cleanRepo = repo.trim();
  const cleanBranch = (branch || 'main').trim();
  const cleanPath = (filePath || 'data/ihas_live_database.json').replace(/^\/+/, '').trim();

  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token.trim()}`
  };

  try {
    // Step 1: Check existing file SHA if already created
    let existingSha: string | undefined = undefined;
    try {
      const getRes = await fetch(
        `https://api.github.com/repos/${cleanOwner}/${cleanRepo}/contents/${cleanPath}?ref=${cleanBranch}`,
        {
          headers,
          cache: 'no-cache'
        }
      );

      if (getRes.ok) {
        const fileInfo = await getRes.json();
        existingSha = fileInfo.sha;
      }
    } catch (e) {
      console.warn('Could not check existing file SHA (might be brand new file):', e);
    }

    // Step 2: Package JSON with metadata
    const fullSnapshot = {
      _meta: {
        app: 'I Have A School',
        director: 'MD Touhidul Hoque Tuhin',
        schemaVersion: '2026.1',
        lastUpdated: new Date().toISOString(),
        pushedBy: 'Admin Control Panel'
      },
      ...dataPayload
    };

    const jsonString = JSON.stringify(fullSnapshot, null, 2);
    const base64Content = encodeUtf8ToBase64(jsonString);

    const commitMessage =
      customCommitMessage ||
      `Live update from Admin Panel [${new Date().toLocaleString('bn-BD', { timeZone: 'Asia/Dhaka' })}]`;

    const requestBody: any = {
      message: commitMessage,
      content: base64Content,
      branch: cleanBranch
    };

    if (existingSha) {
      requestBody.sha = existingSha;
    }

    // Step 3: Put/commit content to GitHub contents API
    const putRes = await fetch(
      `https://api.github.com/repos/${cleanOwner}/${cleanRepo}/contents/${cleanPath}`,
      {
        method: 'PUT',
        headers,
        body: JSON.stringify(requestBody)
      }
    );

    if (!putRes.ok) {
      const errJson = await putRes.json().catch(() => null);
      const errMsg = errJson?.message || putRes.statusText;
      return {
        success: false,
        message: `গিটহাবে ডেটা পুশ ব্যর্থ হয়েছে (${putRes.status}): ${errMsg}`,
        error: errMsg
      };
    }

    const resJson = await putRes.json();
    const newSha = resJson.content?.sha || resJson.commit?.sha;
    const commitUrl = resJson.commit?.html_url;

    return {
      success: true,
      message: 'গিটহাবে রিয়েল-টাইম ডেটাবেজ সফলভাবে পুশ ও লাইভ আপডেট হয়েছে!',
      sha: newSha,
      commitSha: resJson.commit?.sha,
      commitUrl
    };
  } catch (err: any) {
    return {
      success: false,
      message: `পুশ করার সময় সমস্যা হয়েছে: ${err.message || 'অজানা ত্রুটি'}`,
      error: err.message
    };
  }
}

// Fetch live website data from GitHub (used by visitor browsers and admin)
export async function fetchDataFromGitHub(config: GitHubConfig): Promise<{
  success: boolean;
  message: string;
  data?: any;
  source?: 'api' | 'raw';
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
  const cleanRepo = repo.trim();
  const cleanBranch = (branch || 'main').trim();
  const cleanPath = (filePath || 'data/ihas_live_database.json').replace(/^\/+/, '').trim();

  // Try 1: If Token provided, use GitHub Contents API (works for private repos too!)
  if (token && token.trim()) {
    try {
      const res = await fetch(
        `https://api.github.com/repos/${cleanOwner}/${cleanRepo}/contents/${cleanPath}?ref=${cleanBranch}&t=${Date.now()}`,
        {
          headers: {
            Accept: 'application/vnd.github.v3+json',
            Authorization: `Bearer ${token.trim()}`
          },
          cache: 'no-store'
        }
      );

      if (res.ok) {
        const fileInfo = await res.json();
        if (fileInfo.content) {
          const decodedText = decodeBase64ToUtf8(fileInfo.content);
          const parsed = JSON.parse(decodedText);
          return {
            success: true,
            message: 'গিটহাব এপিআই থেকে ডেটা সংগৃহীত হয়েছে।',
            data: parsed,
            source: 'api',
            sha: fileInfo.sha,
            lastUpdated: parsed._meta?.lastUpdated || new Date().toISOString()
          };
        }
      }
    } catch (e) {
      console.warn('GitHub API fetch failed, trying raw CDN:', e);
    }
  }

  // Try 2: Raw Usercontent CDN (ideal for all visitors to avoid GitHub API rate limits on public repos)
  try {
    const rawUrl = `https://raw.githubusercontent.com/${cleanOwner}/${cleanRepo}/${cleanBranch}/${cleanPath}?t=${Date.now()}`;
    const rawRes = await fetch(rawUrl, {
      cache: 'no-store',
      headers: {
        Accept: 'application/json'
      }
    });

    if (rawRes.ok) {
      const parsed = await rawRes.json();
      return {
        success: true,
        message: 'গিটহাব সিডিএন থেকে ডেটা সংগৃহীত হয়েছে।',
        data: parsed,
        source: 'raw',
        lastUpdated: parsed._meta?.lastUpdated || new Date().toISOString()
      };
    }
  } catch (err: any) {
    console.warn('Raw fetch error:', err);
  }

  return {
    success: false,
    message: 'গিটহাব থেকে ডেটা ফাইল রিড করা সম্ভব হয়নি।'
  };
}
