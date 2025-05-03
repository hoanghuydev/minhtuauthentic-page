import { twMerge } from 'tailwind-merge';
import ImageWithFallback from '@/components/atoms/images/ImageWithFallback';
import { ImageDto } from '@/dtos/Image.dto';
import { useEffect, useMemo, useState, useRef } from 'react';

type Props = {
  imageItem: ImageDto;
  isActive: boolean;
  setImageActive: (image: ImageDto) => void;
};

export default function PopupImageItem({
  imageItem,
  isActive,
  setImageActive,
}: Props) {
  const [active, setActive] = useState<boolean>(isActive);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setActive(isActive);
  }, [isActive]);

  const renderImage = useMemo(() => {
    return (
      <ImageWithFallback
        // onClick={() => handleClickImage(imageItem)}
        image={imageItem}
        onMouseEnter={() => {
          const timeout = setTimeout(() => {
            setImageActive(imageItem);
          }, 70);
          hoverTimeoutRef.current = timeout;
        }}
        onMouseLeave={() => {
          if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current as NodeJS.Timeout);
            hoverTimeoutRef.current = null;
          }
        }}
        alt={imageItem.alt || ''}
        className={
          'w-full h-full object-contain hover:scale-105 transition-transform duration-300 cursor-pointer'
        }
      />
    );
  }, [imageItem, setImageActive]);

  return (
    <div
      className={twMerge(
        'w-[80px] h-[80px] select-none',
        active && 'border-2 overflow-hidden rounded-[10px] border-primary',
      )}
    >
      {renderImage}
    </div>
  );
}
