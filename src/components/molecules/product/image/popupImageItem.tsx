import { twMerge } from 'tailwind-merge';
import ImageWithFallback from '@/components/atoms/images/ImageWithFallback';
import { ImageDto } from '@/dtos/Image.dto';
import { useEffect, useMemo, useState, useRef } from 'react';
import MediaItem from '@/dtos/Media.dto';
import { VideoDetailDto } from '@/dtos/VideoDetail.dto';

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
  const image = media.type === 'image' ? media.data as ImageDto : (media.data as VideoDetailDto).video! as ImageDto;

  useEffect(() => {
    setActive(isActive);
  }, [isActive]);

  const renderImage = useMemo(() => {
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
  }, [media, setMediaActive]);

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
