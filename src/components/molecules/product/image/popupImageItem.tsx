import { twMerge } from 'tailwind-merge';
import ImageWithFallback from '@/components/atoms/images/ImageWithFallback';
import { ImageDto } from '@/dtos/Image.dto';
import { useEffect, useMemo, useState, useRef } from 'react';
import MediaItem from '@/dtos/Media.dto';
import { VideoDetailDto } from '@/dtos/VideoDetail.dto';
import { PlayCircleOutlined } from '@ant-design/icons';

type Props = {
  media: MediaItem;
  isActive: boolean;
  index?: number;
  setMediaActive: (media: MediaItem) => void;
};

export default function PopupImageItem({
  media,
  isActive,
  setMediaActive,
  index,
}: Props) {
  const [active, setActive] = useState<boolean>(isActive);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const image = useMemo(() => {
    return {...media.data} as ImageDto;
  }, [media]);

  useEffect(() => {
    setActive(isActive);
  }, [isActive]);

  const renderImage = useMemo(() => {
    if (media.type === 'video') {
      return (
        <div
          className="w-full h-full bg-white border border-gray-200 flex flex-col items-center justify-center gap-1 hover:scale-105 transition-transform duration-300 cursor-pointer"
          onMouseEnter={() => {
            const timeout = setTimeout(() => {
              setMediaActive(media);
            }, 70);
            hoverTimeoutRef.current = timeout;
          }}
          onMouseLeave={() => {
            if (hoverTimeoutRef.current) {
              clearTimeout(hoverTimeoutRef.current as NodeJS.Timeout);
              hoverTimeoutRef.current = null;
            }
          }}
        >
          <PlayCircleOutlined className="text-gray-600 text-base" />
          <span className="text-[10px] text-gray-600 font-medium">Video</span>
        </div>
      );
    }

    return (
      <ImageWithFallback
        // onClick={() => handleClickImage(imageItem)}
        image={image}
        onMouseEnter={() => {
          const timeout = setTimeout(() => {
            setMediaActive(media);
          }, 70);
          hoverTimeoutRef.current = timeout;
        }}
        onMouseLeave={() => {
          if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current as NodeJS.Timeout);
            hoverTimeoutRef.current = null;
          }
        }}
        alt={image.alt || image.name || ''}
        // sizes="80px"
        unoptimized={true}
        className={
          'w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer'
        }
      />
    );
  }, [media, setMediaActive, image]);

  return (
    <div
      data-index={index}
      className={twMerge(
        'w-[80px] h-[80px] select-none',
        active && 'border-2 overflow-hidden rounded-[10px] border-primary',
      )}
    >
      {renderImage}
    </div>
  );
}
