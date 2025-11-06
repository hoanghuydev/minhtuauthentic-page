/**
 * Utility functions for YouTube URL handling
 */

export const extractVideoId = (url: string): string | null => {
  if (!url) return null;

  const patterns = [
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/ // Direct video ID
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
};

export const toEmbedUrl = (url: string): string | null => {
  const videoId = extractVideoId(url);
  if (!videoId) return null;

  return `https://www.youtube.com/embed/${videoId}`;
};

export const getThumbnailUrl = (videoId: string, quality: 'default' | 'medium' | 'high' | 'standard' | 'maxres' = 'medium'): string => {
  const qualityMap = {
    'default': 'default.jpg',
    'medium': 'mqdefault.jpg', 
    'high': 'hqdefault.jpg',
    'standard': 'sddefault.jpg',
    'maxres': 'maxresdefault.jpg'
  };

  return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}`;
};

export const isValidYouTubeUrl = (url: string): boolean => {
  return extractVideoId(url) !== null;
};

export const getVideoInfo = (url: string): { videoId: string; embedUrl: string; thumbnailUrl: string } | null => {
  const videoId = extractVideoId(url);
  if (!videoId) return null;

  return {
    videoId,
    embedUrl: toEmbedUrl(url)!,
    thumbnailUrl: getThumbnailUrl(videoId)
  };
};
