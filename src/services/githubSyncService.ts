// GitHub REST API Synchronization Service for I Have A School
// Supports atomic commits, real-time database pushes from Admin Panel, and cross-browser live updates

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

// Token sanitizer: removes extra whitespace, wrapping quotes, and unintentional 'Bearer'/'token' prefixes
export function cleanGitHubToken(token?: string): string {
  if (!token) return '';
  let cleaned = token.trim();
  cleaned = cleaned.replace(/^["']|["']$/g, '').trim();
  if (cleaned.toLowerCase().startsWith('bearer ')) {
    cleaned = cleaned.slice(7).trim();
  } else if (cleaned.toLowerCase().startsWith('token ')) {
    cleaned = cleaned.slice(6).trim();
  }
  return cleaned;
}

// Normalize owner and repository name (handles full URLs, slashes, trailing hyphens and case)
export function normalizeRepoInfo(owner?: string, repo?: string): { owner: string; repo: string } {
  let cleanOwner = (owner || 'bmd03024-code').trim();
  let cleanRepo = (repo || 'I-Have-A-School-').trim();

  // Strip full github.com URL if pasted
  cleanOwner = cleanOwner.replace(/^https?:\/\/github\.com\//i, '').replace(/\/+$/, '');
  cleanRepo = cleanRepo.replace(/^https?:\/\/github\.com\//i, '').replace(/\/+$/, '');

  // Handle owner/repo in single input
  if (cleanRepo.includes('/')) {
    const parts = cleanRepo.split('/');
    cleanOwner = parts[0].trim();
    cleanRepo = parts[1].trim();
  }
  if (cleanOwner.includes('/')) {
    const parts = cleanOwner.split('/');
    cleanOwner = parts[0].trim();
    if (!repo) cleanRepo = parts[1].trim();
  }

  // Remove trailing .git if present
  cleanRepo = cleanRepo.replace(/\.git$/i, '');

  if (cleanOwner.toLowerCase() === 'bmd03024-code') {
    cleanOwner = 'bmd03024-code';
    if (cleanRepo === 'I-Have-A-School' || cleanRepo.toLowerCase() === 'i-have-a-school') {
      cleanRepo = 'I-Have-A-School-';
    }
  }
  return { owner: cleanOwner, repo: cleanRepo };
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
  canPush?: boolean;
}> {
  const { owner: rawOwner, repo: rawRepo, token, branch, filePath } = config;
  const { owner: cleanOwner, repo: cleanRepo } = normalizeRepoInfo(rawOwner, rawRepo);
  const cleanToken = cleanGitHubToken(token);
  const cleanBranch = (branch || 'main').trim();
  const cleanPath = (filePath || 'data/ihas_live_database.json').replace(/^\/+/, '').trim();

  if (!cleanToken) {
    return {
      success: false,
      message: 'গিটহাব পার্সোনাল অ্যাক্সেস টোকেন (PAT) প্রদান করা হয়নি।'
    };
  }

  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
    Authorization: `Bearer ${cleanToken}`
  };

  try {
    // 1. Verify Repository and check permissions
    let repoRes = await fetch(`https://api.github.com/repos/${cleanOwner}/${cleanRepo}`, {
      headers
    });

    if (!repoRes.ok && repoRes.status === 404 && !cleanRepo.endsWith('-')) {
      const altRes = await fetch(`https://api.github.com/repos/${cleanOwner}/${cleanRepo}-`, {
        headers
      });
      if (altRes.ok) {
        repoRes = altRes;
      }
    }

    if (!repoRes.ok) {
      if (repoRes.status === 404) {
        return {
          success: false,
          message: `রিপোজিটরি '${cleanOwner}/${cleanRepo}' খুঁজে পাওয়া যায়নি। রিপোজিটরি নাম ও ওনার সঠিক কিনা যাচাই করুন।`
        };
      }
      if (repoRes.status === 401) {
        return {
          success: false,
          message: 'GitHub Personal Access Token টি ভুল, অবৈধ বা মেয়াদোত্তীর্ণ। সঠিক টোকেন প্রদান করুন।'
        };
      }
      return {
        success: false,
        message: `গিটহাব রেসপন্স কোড: ${repoRes.status} (${repoRes.statusText})`
      };
    }

    const repoData = await repoRes.json();
    const canPush = Boolean(repoData.permissions?.push || repoData.permissions?.admin);

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
      // not critical if file doesn't exist yet
    }

    let message = '';
    if (canPush) {
      message = `গিটহাব রিপোজিটরি '${repoData.full_name}' সফলভাবে কানেক্টেড এবং পুশ পারমিশন সক্রিয় (Full Write & Auto-Deploy Access)!`;
    } else {
      message = `গিটহাব রিপোজিটরি কানেক্টেড, কিন্তু পুশ পারমিশন নেই। টোকেন তৈরি করার সময় 'repo' স্কোপ নির্বাচন করুন।`;
    }

    return {
      success: canPush,
      canPush,
      message,
      repoDetails: {
        fullName: repoData.full_name,
        private: repoData.private,
        defaultBranch: repoData.default_branch,
        updatedAt: repoData.updated_at,
        canPush
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

// In-memory cache for known blob SHAs to speed up individual file fallback
const knownBlobShaMap = new Map<string, string>();

// Mutex promise queue to serialize GitHub push operations and avoid concurrent commit collisions
let pushQueue: Promise<any> = Promise.resolve();

// Helper to create a git blob via GitHub API (supports files of any size without the 100KB limit of inline tree contents)
async function createGitBlob(
  cleanOwner: string,
  cleanRepo: string,
  headers: Record<string, string>,
  content: string
): Promise<string> {
  const base64Content = encodeUtf8ToBase64(content);
  const res = await fetch(`https://api.github.com/repos/${cleanOwner}/${cleanRepo}/git/blobs`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      content: base64Content,
      encoding: 'base64'
    })
  });

  if (!res.ok) {
    const errJson = await res.json().catch(() => null);
    throw new Error(errJson?.message || `Failed to create git blob: ${res.status}`);
  }

  const data = await res.json();
  return data.sha;
}

// Atomic Multi-file Commit using Git Database API
// Atomic Multi-file Commit using Git Database API
// Creates blobs for each file, links them in a tree, and updates HEAD in ONE single atomic commit!
async function commitMultipleFilesAtomic(
  cleanOwner: string,
  cleanRepo: string,
  cleanBranch: string,
  headers: Record<string, string>,
  files: Array<{ path: string; content: string }>,
  commitMessage: string
): Promise<{ success: boolean; commitSha?: string; commitUrl?: string; error?: string }> {
  // Step 1: Get latest commit on target branch (gives both commit SHA and its base tree SHA)
  let activeBranch = cleanBranch;
  let commitRes = await fetch(
    `https://api.github.com/repos/${cleanOwner}/${cleanRepo}/commits/${activeBranch}?_t=${Date.now()}`,
    {
      headers: {
        ...headers,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache'
      },
      cache: 'no-store'
    }
  );

  // If specified branch 404s, try fallback branch (master vs main)
  if (!commitRes.ok && commitRes.status === 404) {
    const fallbackBranch = activeBranch === 'main' ? 'master' : 'main';
    const altCommitRes = await fetch(
      `https://api.github.com/repos/${cleanOwner}/${cleanRepo}/commits/${fallbackBranch}?_t=${Date.now()}`,
      { headers, cache: 'no-store' }
    );
    if (altCommitRes.ok) {
      commitRes = altCommitRes;
      activeBranch = fallbackBranch;
    }
  }

  if (!commitRes.ok) {
    const errJson = await commitRes.json().catch(() => null);
    throw new Error(errJson?.message || `Failed to get latest commit on ${activeBranch}: ${commitRes.status}`);
  }

  const commitData = await commitRes.json();
  const parentCommitSha = commitData.sha;
  const baseTreeSha = commitData.commit?.tree?.sha;
  if (!parentCommitSha || !baseTreeSha) {
    throw new Error('Could not find latest parent commit or tree SHA');
  }

  // Step 2: Create Git Blobs for all files (handles Bengali UTF-8 and arbitrary file sizes)
  // Shared blob optimization: if identical content, reuse blob SHA
  const blobShaCache = new Map<string, string>();
  const treeItems: Array<{ path: string; mode: string; type: string; sha: string }> = [];

  for (const f of files) {
    let sha = blobShaCache.get(f.content);
    if (!sha) {
      sha = await createGitBlob(cleanOwner, cleanRepo, headers, f.content);
      blobShaCache.set(f.content, sha);
    }
    treeItems.push({
      path: f.path,
      mode: '100644',
      type: 'blob',
      sha
    });
  }

  // Step 3: Create a new Tree pointing to the blobs
  const treePayload = {
    base_tree: baseTreeSha,
    tree: treeItems
  };

  const treeRes = await fetch(
    `https://api.github.com/repos/${cleanOwner}/${cleanRepo}/git/trees`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify(treePayload)
    }
  );

  if (!treeRes.ok) {
    const errJson = await treeRes.json().catch(() => null);
    throw new Error(errJson?.message || `Failed to create tree on GitHub: ${treeRes.status}`);
  }

  const treeData = await treeRes.json();
  const newTreeSha = treeData.sha;

  // Step 4: Create new Commit
  const newCommitPayload = {
    message: commitMessage,
    tree: newTreeSha,
    parents: [parentCommitSha]
  };

  const newCommitRes = await fetch(
    `https://api.github.com/repos/${cleanOwner}/${cleanRepo}/git/commits`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify(newCommitPayload)
    }
  );

  if (!newCommitRes.ok) {
    const errJson = await newCommitRes.json().catch(() => null);
    throw new Error(errJson?.message || `Failed to create commit on GitHub: ${newCommitRes.status}`);
  }

  const newCommitData = await newCommitRes.json();
  const newCommitSha = newCommitData.sha;

  // Step 5: Update branch reference (Fast-Forward HEAD with force fallback)
  const patchRefRes = await fetch(
    `https://api.github.com/repos/${cleanOwner}/${cleanRepo}/git/refs/heads/${activeBranch}`,
    {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ sha: newCommitSha, force: true })
    }
  );

  // If reference doesn't exist yet (404), create it via POST git/refs
  if (!patchRefRes.ok && patchRefRes.status === 404) {
    const createRefRes = await fetch(
      `https://api.github.com/repos/${cleanOwner}/${cleanRepo}/git/refs`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({ ref: `refs/heads/${activeBranch}`, sha: newCommitSha })
      }
    );
    if (createRefRes.ok) {
      return {
        success: true,
        commitSha: newCommitSha,
        commitUrl: `https://github.com/${cleanOwner}/${cleanRepo}/commit/${newCommitSha}`
      };
    }
  }

  if (!patchRefRes.ok) {
    const errJson = await patchRefRes.json().catch(() => null);
    throw new Error(errJson?.message || `Failed to update ref/heads/${activeBranch}: ${patchRefRes.status}`);
  }

  return {
    success: true,
    commitSha: newCommitSha,
    commitUrl: `https://github.com/${cleanOwner}/${cleanRepo}/commit/${newCommitSha}`
  };
}

// Comprehensive SHA Resolver across all branches, default branch, commits, and in-memory cache
async function resolveFileSha(
  cleanOwner: string,
  cleanRepo: string,
  filePath: string,
  cleanBranch: string,
  headers: Record<string, string>
): Promise<string | undefined> {
  const normalizedPath = filePath.replace(/^\/+/, '').trim();

  // Strategy 1: In-memory cache
  const cached = knownBlobShaMap.get(normalizedPath);

  // Strategy 2: Direct contents query with specified branch
  try {
    const res = await fetch(
      `https://api.github.com/repos/${cleanOwner}/${cleanRepo}/contents/${normalizedPath}?ref=${cleanBranch}&_ts=${Date.now()}`,
      {
        headers: {
          ...headers,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache'
        },
        cache: 'no-store'
      }
    );
    if (res.ok) {
      const data = await res.json();
      if (data?.sha) {
        knownBlobShaMap.set(normalizedPath, data.sha);
        return data.sha;
      }
    }
  } catch {
    // continue
  }

  // Strategy 3: Contents query WITHOUT ?ref= (GitHub resolves against repository's default branch)
  try {
    const resNoRef = await fetch(
      `https://api.github.com/repos/${cleanOwner}/${cleanRepo}/contents/${normalizedPath}?_ts=${Date.now()}`,
      {
        headers: {
          ...headers,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache'
        },
        cache: 'no-store'
      }
    );
    if (resNoRef.ok) {
      const data = await resNoRef.json();
      if (data?.sha) {
        knownBlobShaMap.set(normalizedPath, data.sha);
        return data.sha;
      }
    }
  } catch {
    // continue
  }

  // Strategy 4: Fallback branch (main <-> master)
  const altBranch = cleanBranch === 'main' ? 'master' : 'main';
  try {
    const resAlt = await fetch(
      `https://api.github.com/repos/${cleanOwner}/${cleanRepo}/contents/${normalizedPath}?ref=${altBranch}&_ts=${Date.now()}`,
      {
        headers: {
          ...headers,
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        },
        cache: 'no-store'
      }
    );
    if (resAlt.ok) {
      const data = await resAlt.json();
      if (data?.sha) {
        knownBlobShaMap.set(normalizedPath, data.sha);
        return data.sha;
      }
    }
  } catch {
    // continue
  }

  // Strategy 5: Query commits for file to extract blob SHA
  try {
    const commitsRes = await fetch(
      `https://api.github.com/repos/${cleanOwner}/${cleanRepo}/commits?path=${normalizedPath}&per_page=1&_ts=${Date.now()}`,
      { headers, cache: 'no-store' }
    );
    if (commitsRes.ok) {
      const commits = await commitsRes.json();
      if (Array.isArray(commits) && commits.length > 0) {
        const commitSha = commits[0]?.sha;
        if (commitSha) {
          const detailRes = await fetch(
            `https://api.github.com/repos/${cleanOwner}/${cleanRepo}/commits/${commitSha}`,
            { headers, cache: 'no-store' }
          );
          if (detailRes.ok) {
            const detail = await detailRes.json();
            const matchedFile = detail.files?.find((f: any) => f.filename === normalizedPath);
            if (matchedFile?.sha) {
              knownBlobShaMap.set(normalizedPath, matchedFile.sha);
              return matchedFile.sha;
            }
          }
        }
      }
    }
  } catch {
    // continue
  }

  // Strategy 6: Query git tree
  try {
    const treeRes = await fetch(
      `https://api.github.com/repos/${cleanOwner}/${cleanRepo}/git/trees/${cleanBranch}?recursive=1`,
      { headers, cache: 'no-store' }
    );
    if (treeRes.ok) {
      const treeData = await treeRes.json();
      if (Array.isArray(treeData?.tree)) {
        const item = treeData.tree.find((t: any) => t.path === normalizedPath);
        if (item?.sha) {
          knownBlobShaMap.set(normalizedPath, item.sha);
          return item.sha;
        }
      }
    }
  } catch {
    // continue
  }

  return cached || undefined;
}

// Fallback: Commit a single file to GitHub with automatic SHA resolution & conflict retry
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
  const normalizedPath = filePath.replace(/^\/+/, '').trim();

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // Step A: Resolve existing SHA using comprehensive lookup
      const currentSha = await resolveFileSha(cleanOwner, cleanRepo, normalizedPath, cleanBranch, headers);

      const requestBody: any = {
        message: commitMessage,
        content: base64Content,
        branch: cleanBranch
      };

      if (currentSha) {
        requestBody.sha = currentSha;
      }

      // Step B: Send PUT request
      const putRes = await fetch(
        `https://api.github.com/repos/${cleanOwner}/${cleanRepo}/contents/${normalizedPath}`,
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
          knownBlobShaMap.set(normalizedPath, newSha);
        }
        return {
          success: true,
          sha: newSha,
          commitSha: resJson.commit?.sha,
          commitUrl: resJson.commit?.html_url
        };
      }

      const errJson = await putRes.json().catch(() => null);
      lastError = errJson?.message || putRes.statusText;

      // Step C: Handle 422 ("sha wasn't supplied") or 409 Conflict
      // If GitHub requires SHA or SHA was outdated, immediately force-fetch SHA and retry
      if (putRes.status === 422 || putRes.status === 409) {
        knownBlobShaMap.delete(normalizedPath);
        const forceSha = await resolveFileSha(cleanOwner, cleanRepo, normalizedPath, cleanBranch, headers);
        if (forceSha) {
          requestBody.sha = forceSha;
          const retryRes = await fetch(
            `https://api.github.com/repos/${cleanOwner}/${cleanRepo}/contents/${normalizedPath}`,
            {
              method: 'PUT',
              headers,
              body: JSON.stringify(requestBody)
            }
          );
          if (retryRes.ok || retryRes.status === 200 || retryRes.status === 201) {
            const retryJson = await retryRes.json();
            const newSha = retryJson.content?.sha || retryJson.commit?.sha;
            if (newSha) {
              knownBlobShaMap.set(normalizedPath, newSha);
            }
            return {
              success: true,
              sha: newSha,
              commitSha: retryJson.commit?.sha,
              commitUrl: retryJson.commit?.html_url
            };
          }
        }
        const waitMs = 700 * (attempt + 1);
        await new Promise((r) => setTimeout(r, waitMs));
        continue;
      }

      if (attempt < maxRetries) {
        await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
        continue;
      }
    } catch (netErr: any) {
      lastError = netErr?.message || 'Network error';
      if (attempt < maxRetries) {
        await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
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
  const { owner: rawOwner, repo: rawRepo, token, branch, filePath } = config;
  const { owner: cleanOwner, repo: cleanRepo } = normalizeRepoInfo(rawOwner, rawRepo);
  const cleanToken = cleanGitHubToken(token);
  const cleanBranch = (branch || 'main').trim();
  const cleanPath = (filePath || 'data/ihas_live_database.json').replace(/^\/+/, '').trim();

  if (!cleanToken) {
    return {
      success: false,
      message: 'গিটহাবে ডেটা পুশ করতে Personal Access Token (PAT) প্রয়োজন।',
      error: 'NO_TOKEN'
    };
  }

  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${cleanToken}`
  };

  try {
    const timestamp = new Date().toISOString();
    const commitMessage =
      customCommitMessage ||
      `Live update from Admin Panel [${new Date().toLocaleString('bn-BD', { timeZone: 'Asia/Dhaka' })}]`;

    // 1. Prepare sanitized snapshot for data/ihas_live_database.json
    // CRITICAL SECURITY NOTE: Never commit raw PAT token into GitHub files!
    // GitHub's Secret Scanner will immediately revoke it if found.
    const sanitizedGithubConfig: GitHubConfig = {
      ...config,
      token: '', // Strip token from committed file
      lastSyncedAt: timestamp
    };

    const fullSnapshot = {
      _meta: {
        app: 'I Have A School',
        director: 'MD Touhidul Hoque Tuhin',
        schemaVersion: '2026.1',
        lastUpdated: timestamp,
        pushedBy: 'Admin Control Panel'
      },
      ...dataPayload,
      githubConfig: sanitizedGithubConfig
    };

    const databaseJsonString = JSON.stringify(fullSnapshot, null, 2);

    // 2. Prepare code snapshot for src/data/liveData.json & public/liveData.json
    // This ensures Vercel's build (`npm run build`) uses the exact updated data!
    const codeLiveDataSnapshot: Record<string, any> = {
      _updatedAt: timestamp,
      _meta: {
        lastSavedAt: timestamp,
        authoritative: true,
        syncedBy: 'Admin Control Panel Auto Engine',
        founder: 'MD Touhidul Hoque Tuhin',
        platform: 'I Have A School'
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
      ihas_github_config: sanitizedGithubConfig
    };

    const codeJsonString = JSON.stringify(codeLiveDataSnapshot, null, 2);

    // List of files to commit simultaneously
    const filesToCommit = [
      { path: cleanPath, content: databaseJsonString },
      { path: 'src/data/liveData.json', content: codeJsonString },
      { path: 'public/liveData.json', content: codeJsonString }
    ];

    // Method A: Attempt single atomic commit via Git Database API
    try {
      const atomicResult = await commitMultipleFilesAtomic(
        cleanOwner,
        cleanRepo,
        cleanBranch,
        headers,
        filesToCommit,
        commitMessage
      );

      if (atomicResult.success) {
        // Purge CDN caches asynchronously
        try {
          fetch(`https://purge.jsdelivr.net/gh/${cleanOwner}/${cleanRepo}@${cleanBranch}/data/ihas_live_database.json`, { method: 'POST', mode: 'no-cors' }).catch(() => {});
          fetch(`https://purge.jsdelivr.net/gh/${cleanOwner}/${cleanRepo}@${cleanBranch}/public/liveData.json`, { method: 'POST', mode: 'no-cors' }).catch(() => {});
          fetch(`https://purge.jsdelivr.net/gh/${cleanOwner}/${cleanRepo}@${cleanBranch}/src/data/liveData.json`, { method: 'POST', mode: 'no-cors' }).catch(() => {});
        } catch {
          // ignore
        }

        return {
          success: true,
          message: 'গিটহাবে ৩টি ফাইল সফলভাবে অ্যাটমিক পুশ হয়েছে এবং হোস্টিং রিডিপ্লয় ট্রিগার হয়েছে!',
          commitSha: atomicResult.commitSha,
          sha: atomicResult.commitSha,
          commitUrl: atomicResult.commitUrl
        };
      }
    } catch (atomicErr: any) {
      console.warn('[GitHubSync] Atomic commit notice, falling back to Contents API:', atomicErr?.message);
    }

    // Method B: Fallback to Contents API with sequential commits
    const databaseBase64 = encodeUtf8ToBase64(databaseJsonString);
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

    // Also commit codebase files
    const codeBase64 = encodeUtf8ToBase64(codeJsonString);
    await commitFileWithRetry(
      cleanOwner,
      cleanRepo,
      'src/data/liveData.json',
      cleanBranch,
      headers,
      codeBase64,
      `Update codebase data [${timestamp}]`
    ).catch(() => {});

    await commitFileWithRetry(
      cleanOwner,
      cleanRepo,
      'public/liveData.json',
      cleanBranch,
      headers,
      codeBase64,
      `Update public liveData [${timestamp}]`
    ).catch(() => {});

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
  const { owner: rawOwner, repo: rawRepo, token, branch, filePath } = config;
  const { owner: cleanOwner, repo: cleanRepo } = normalizeRepoInfo(rawOwner, rawRepo);
  const cleanToken = cleanGitHubToken(token);
  const cleanBranch = (branch || 'main').trim();
  const cleanPath = (filePath || 'data/ihas_live_database.json').replace(/^\/+/, '').trim();

  // Fallback candidate paths in the repo
  const candidatePaths = [
    cleanPath,
    'src/data/liveData.json',
    'public/liveData.json'
  ];

  for (const targetPath of candidatePaths) {
    // Tier 1: If Token provided, use GitHub Contents API (works for both private & public repos)
    if (cleanToken) {
      try {
        const res = await fetch(
          `https://api.github.com/repos/${cleanOwner}/${cleanRepo}/contents/${targetPath}?ref=${cleanBranch}&_ts=${Date.now()}`,
          {
            headers: {
              Accept: 'application/vnd.github.v3+json',
              Authorization: `Bearer ${cleanToken}`,
              'Cache-Control': 'no-cache, no-store, must-revalidate'
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
              lastUpdated: parsed._meta?.lastUpdated || parsed._updatedAt || new Date().toISOString()
            };
          }
        }
      } catch (e) {
        console.warn(`[GitHubSync] Tier 1 API fetch notice for ${targetPath}:`, e);
      }
    }

    // Tier 2: Commit-SHA direct raw
    try {
      const commitRes = await fetch(
        `https://api.github.com/repos/${cleanOwner}/${cleanRepo}/commits/${cleanBranch}?_ts=${Date.now()}`,
        {
          headers: {
            Accept: 'application/vnd.github.v3+json',
            ...(cleanToken ? { Authorization: `Bearer ${cleanToken}` } : {})
          },
          cache: 'no-store'
        }
      );
      if (commitRes.ok) {
        const commitInfo = await commitRes.json();
        const commitSha = commitInfo.sha;
        if (commitSha) {
          const commitRawUrl = `https://raw.githubusercontent.com/${cleanOwner}/${cleanRepo}/${commitSha}/${targetPath}`;
          const rawRes = await fetch(commitRawUrl, {
            cache: 'no-store',
            headers: {
              Accept: 'application/json',
              ...(cleanToken ? { Authorization: `Bearer ${cleanToken}` } : {})
            }
          });
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
      console.warn(`[GitHubSync] Tier 2 commit-sha notice for ${targetPath}:`, commitErr);
    }

    // Tier 3: Direct Raw Usercontent
    try {
      const rawUrl = `https://raw.githubusercontent.com/${cleanOwner}/${cleanRepo}/${cleanBranch}/${targetPath}?_t=${Date.now()}_${Math.random().toString(36).substring(7)}`;
      const rawRes = await fetch(rawUrl, {
        cache: 'no-store',
        headers: {
          Accept: 'application/json',
          ...(cleanToken ? { Authorization: `Bearer ${cleanToken}` } : {})
        }
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
      console.warn(`[GitHubSync] Tier 3 Raw notice for ${targetPath}:`, err);
    }

    // Tier 4: jsDelivr Global CDN
    try {
      const jsdelivrUrl = `https://cdn.jsdelivr.net/gh/${cleanOwner}/${cleanRepo}@${cleanBranch}/${targetPath}?_ts=${Date.now()}`;
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
      console.warn(`[GitHubSync] Tier 4 jsDelivr notice for ${targetPath}:`, jsdErr);
    }
  }

  return {
    success: false,
    message: 'গিটহাব থেকে লাইভ ডেটা ফাইল রিড করা সম্ভব হয়নি।'
  };
}
