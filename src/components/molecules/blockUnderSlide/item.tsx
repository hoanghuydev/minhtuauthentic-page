import Link from 'next/link';
import { StaticContentsDto } from '@/dtos/StaticContents.dto';
import ImageWithFallback from '@/components/atoms/images/ImageWithFallback';
import { twMerge } from 'tailwind-merge';
import { isMobile } from 'react-device-detect';

const BlockUnderSlideItem = ({
  content,
  classImage,
  isUseImageFill,
}: {
  content: StaticContentsDto;
  classImage?: string;
  isUseImageFill?: boolean;
}) => {
  const imageDetail = content?.images?.[0];
  const image = imageDetail?.image || null;
  return (
    <>
      <div
        className={twMerge(
          'rounded-[10px] overflow-hidden mx-auto',
          isUseImageFill && 'pt-[100%] relative',
        )}
        style={{
          backgroundColor: content.properties?.backgroundColor || 'transparent',
        }}
      >
        <Link href={content?.properties?.slug || '/'}>
          <ImageWithFallback
            image={image}
            className={twMerge(
              'object-cover w-full h-full hover:scale-105 transition-transform duration-300 m-auto',
              classImage,
            )}
            isFill={isUseImageFill}
            alt={imageDetail?.alt || content?.title || ''}
            unoptimized={!isMobile}
          />
        </Link>
      </div>
      <p className={'text-center lg:mt-3'}>{content.title || ''}</p>
    </>
  );
};
export default BlockUnderSlideItem;
