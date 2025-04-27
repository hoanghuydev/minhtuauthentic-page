import { ImageDto } from '@/dtos/Image.dto';
import ImageWithFallback from '@/components/atoms/images/ImageWithFallback';
import { twMerge } from 'tailwind-merge';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

type Props = {
  image: ImageDto;
  containerClassName?: string;
  imageClassName?: string;
  href?: string;
};
export default function ImageWithRatio({
  image,
  containerClassName,
  imageClassName,
  href,
}: Props) {
  const refContainer = useRef<HTMLDivElement | null>(null);
  const ratio = (image.width || 0) / (image.height || 1);
  const [wh, setWh] = useState({
    width: image.width,
    height: image.height,
  });
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) {
      if (refContainer.current) {
        const width = refContainer.current?.clientWidth || 1;
        const height = width / (ratio || 1);
        setWh({ width, height });
      }
    }
  }, [ready]);

  const renderContent = () => {
    return (
      <ImageWithFallback
        image={image}
        className={twMerge(
          'w-full !h-auto object-contain max-h-full',
          imageClassName,
        )}
      />
    );
  };

  return (
    <div
      ref={refContainer}
      style={{ height: wh.height }}
      className={twMerge(containerClassName)}
    >
      {href ? (
        <Link className={'h-full'} href={href}>
          {renderContent()}
        </Link>
      ) : (
        renderContent()
      )}
    </div>
  );
}
