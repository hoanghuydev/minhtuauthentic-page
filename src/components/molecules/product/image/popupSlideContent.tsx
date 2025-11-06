import { useRef } from 'react';
import { ImageDto } from '@/dtos/Image.dto';
import { ProductDto } from '@/dtos/Product.dto';
import ImageWithFallback from '@/components/atoms/images/ImageWithFallback';
import ImageCount from '@/components/atoms/imageCount';
import MediaItem from '@/dtos/Media.dto';
import YouTubeEmbed from '@/components/atoms/video/YouTubeEmbed';
import { VideoDetailDto } from '@/dtos/VideoDetail.dto';

interface PopupSlideContentProps {
  media: MediaItem;
  product: ProductDto;
  setIsOpen?: (item: { display: boolean; media: MediaItem | null }) => void;
  mediaIndex: number;
  totalMedia: number;
  onPrev: () => void;
  onNext: () => void;
}

export default function PopupSlideContent({
  media,
  product,
  setIsOpen,
  mediaIndex,
  totalMedia,
  onPrev,
  onNext,
}: PopupSlideContentProps) {
  const imageRef = useRef<HTMLDivElement>(null);

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (imageRef.current && !imageRef.current.contains(e.target as Node)) {
      setIsOpen && setIsOpen({ display: false, media: null });
    }
  };

  return (
    <div
      className="w-full h-full flex justify-center relative items-center select-none"
      onClick={handleBackgroundClick}
    >
      <div
        ref={imageRef}
        className="relative h-full select-none isolate pointer-events-auto"
      >
        {media.type === 'image' ? (
          <ImageWithFallback
            className={'object-contain h-full w-auto m-auto select-none'}
            image={media.data as ImageDto}
            alt={product.title || product.name}
            unoptimized={true}
            quality={100}
          />
        ) : (
          <YouTubeEmbed 
            video={media.data as VideoDetailDto}
            width="100%"
            height="auto"
            className="product-detail-main-video-wrapper m-auto w-auto h-full aspect-square"
            title={(media.data as VideoDetailDto).video?.name || 'Product video'}
          />
        )}
       
        <ImageCount
          currentIndex={mediaIndex}
          total={totalMedia}
          onPrev={onPrev}
          onNext={onNext}
        />
      </div>
    </div>
  );
}
