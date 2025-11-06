import React from 'react';
import { VideoDetailDto } from '@/dtos/VideoDetail.dto';
import { toEmbedUrl } from '@/utils/youtube';

interface YouTubeEmbedProps {
  video: VideoDetailDto;
  className?: string;
  width?: string | number;
  height?: string | number;
  title?: string;
}

const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({
  video,
  className = '',
  width = '100%',
  height = '100%',
  title
}) => {
  if (!video?.video?.url) {
    return null;
  }

  const embedUrl = toEmbedUrl(video.video.url);
  
  if (!embedUrl) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
        <p className="text-gray-500">Video không hợp lệ</p>
      </div>
    );
  }

  const containerStyle = height === 'auto' ? { width } : { width, height };
  
  return (
    <div className={`relative ${className}`} style={containerStyle}>
      <iframe
        src={embedUrl}
        title={title || video.video.title || video.alt || 'YouTube video'}
        width="100%"
        height="100%"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
        loading="lazy"
      />
    </div>
  );
};

export default YouTubeEmbed;
