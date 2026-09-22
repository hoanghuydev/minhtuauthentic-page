'use client';

import Link from 'next/link';
import { StaticContentsDto } from '@/dtos/StaticContents.dto';
import { generateSlugToHref } from '@/utils';
import { useState } from 'react';
import ImageWithFallback from '@/components/atoms/images/ImageWithFallback';
import { twMerge } from 'tailwind-merge';
import { NivoSlider, NivoSlide } from '@/components/atoms/slider';
import type { EffectType } from '@/components/atoms/slider';

export const Banners = ({
  banners,
  className,
  classNameImage,
  isFull = false,
  isSquareBannerMobile = false,
  nivoEffect = 'random',
}: {
  banners: StaticContentsDto[];
  className?: string;
  classNameImage?: string;
  isFull?: boolean;
  isSquareBannerMobile?: boolean;
  nivoEffect?: EffectType;
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Không `priority`/`loading="eager"`: cả hai đều khiến React/next-image phát
  // <link rel="preload"> không kèm `media`, nên mobile tải luôn banner desktop và
  // ngược lại. Để lazy thì cây bị `display:none` theo breakpoint không tải ảnh,
  // còn ảnh LCP đã được pages/index.tsx preload sẵn kèm media đúng breakpoint.

  // Render desktop banners with NivoSlider
  const renderDesktopBanners = () => (
    <div
      className={twMerge(
        'relative banner-container h-full hidden lg:!block rounded-3xl overflow-hidden',
        activeIndex === banners.length - 1 && 'hide-next-button',
        activeIndex === 0 && 'hide-prev-button',
      )}
    >
      <NivoSlider
        className={className}
        effect={nivoEffect}
        slices={15}
        boxCols={8}
        boxRows={4}
        animSpeed={500}
        pauseTime={3000}
        directionNav={true}
        controlNav={true}
        pauseOnHover={true}
        loop={true}
        autoplay={true}
        onSlideChange={setActiveIndex}
      >
        {banners.map((banner, index) => {
          const imageDetail = banner?.images?.[0];
          if (!imageDetail) return null;

          return (
            <NivoSlide key={`desktop-${index}`} className="w-full">
              <Link href={generateSlugToHref(banner?.properties?.slug)}>
                <ImageWithFallback
                  image={imageDetail.image}
                  alt={imageDetail.image?.alt || 'minhtuauthentic'}
                  className={twMerge(
                    'object-contain w-full h-full',
                    classNameImage,
                  )}
                  unoptimized={false}
                  sizes="100vw"
                  // Next 16 mặc định chỉ cho phép qualities: [75]; giá trị khác
                  // làm /_next/image trả 400 và banner biến mất.
                  quality={75}
                />
              </Link>
            </NivoSlide>
          );
        })}
      </NivoSlider>
    </div>
  );

  // Render mobile banners with NivoSlider (reduced params for performance)
  const renderMobileBanners = () => {
    let mobileBanners = banners.filter(
      (banner) =>
        banner.is_mobile_visible &&
        banner.images_mobile &&
        banner.images_mobile.length > 0,
    );

    const shouldUsePcBanners = mobileBanners.length === 0;
    const bannersToUse = shouldUsePcBanners ? banners : mobileBanners;

    return (
      <div className="w-full lg:!hidden">
        <NivoSlider
          className="w-full"
          effect={nivoEffect}
          slices={8}
          boxCols={4}
          boxRows={3}
          animSpeed={400}
          pauseTime={3000}
          directionNav={true}
          controlNav={true}
          pauseOnHover={false}
          loop={true}
          autoplay={true}
        >
          {bannersToUse.map((banner, index) => {
            const imageDetail = shouldUsePcBanners
              ? banner?.images?.[0]
              : banner.images_mobile?.[0];

            if (!imageDetail) return null;

            return (
              <NivoSlide key={`mobile-${index}`} className="w-full">
                <Link
                  href={generateSlugToHref(
                    banner?.properties?.slug_mobile || banner?.properties?.slug,
                  )}
                >
                  <div
                    className={twMerge(
                      'w-full',
                      isSquareBannerMobile && 'aspect-square',
                    )}
                  >
                    <ImageWithFallback
                      image={imageDetail.image}
                      alt={imageDetail.image?.alt || 'minhtuauthentic'}
                      className="object-cover w-full h-full"
                      unoptimized={false}
                      sizes="100vw"
                      quality={75}
                    />
                  </div>
                </Link>
              </NivoSlide>
            );
          })}
        </NivoSlider>
      </div>
    );
  };

  return (
    <>
      {renderDesktopBanners()}
      {renderMobileBanners()}
    </>
  );
};

export default Banners;
