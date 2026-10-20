// Video Utility Service for Free Classes (YouTube & Facebook Auto-Thumbnail Extraction)

export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = trimmed.match(regExp);
  if (match && match[2].length === 11) {
    return match[2];
  }
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }
  return null;
}

export function detectVideoPlatform(url: string): 'youtube' | 'facebook' | 'tiktok' | 'uploaded' {
  if (!url) return 'youtube';
  const lower = url.toLowerCase();
  if (lower.includes('facebook.com') || lower.includes('fb.watch') || lower.includes('fb.com')) {
    return 'facebook';
  }
  if (lower.includes('tiktok.com')) {
    return 'tiktok';
  }
  if (lower.startsWith('data:video') || lower.endsWith('.mp4') || lower.endsWith('.webm')) {
    return 'uploaded';
  }
  return 'youtube';
}

export async function resolveAutoThumbnail(
  url: string,
  platform?: string
): Promise<{ url: string; platform: 'youtube' | 'facebook' | 'tiktok' | 'uploaded' | 'custom' }> {
  if (!url) {
    return {
      url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop',
      platform: 'custom'
    };
  }

  const trimmed = url.trim();
  const detected = platform || detectVideoPlatform(trimmed);

  // 1. YouTube Auto-Thumbnail (High Definition)
  const ytId = extractYouTubeId(trimmed);
  if (ytId) {
    return {
      url: `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`,
      platform: 'youtube'
    };
  }

  // 2. Facebook Auto-Thumbnail (try oEmbed first, then fallback to high-quality social video banner)
  if (
    detected === 'facebook' ||
    trimmed.includes('facebook.com') ||
    trimmed.includes('fb.watch') ||
    trimmed.includes('fb.com')
  ) {
    try {
      const oembedUrl = `https://www.facebook.com/plugins/video/oembed.json/?url=${encodeURIComponent(trimmed)}`;
      const res = await fetch(oembedUrl);
      if (res.ok) {
        const data = await res.json();
        if (data.thumbnail_url) {
          return { url: data.thumbnail_url, platform: 'facebook' };
        }
      }
    } catch {
      // Ignore CORS/network fallbacks
    }

    return {
      url: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=800&auto=format&fit=crop',
      platform: 'facebook'
    };
  }

  // 3. TikTok / Other
  if (detected === 'tiktok' || trimmed.includes('tiktok.com')) {
    return {
      url: 'https://images.unsplash.com/photo-1611605698335-8b1569810432?q=80&w=800&auto=format&fit=crop',
      platform: 'tiktok'
    };
  }

  return {
    url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop',
    platform: 'custom'
  };
}
