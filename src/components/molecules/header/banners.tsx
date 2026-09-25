'use client';

import Link from 'next/link';
import { StaticContentsDto } from '@/dtos/StaticContents.dto';
import { generateSlugToHref } from '@/utils';
import { useState } from 'react';
import ImageWithFallback from '@/components/atoms/images/ImageWithFallback';
import { twMerge } from 'tailwind-merge';
import { NivoSlider, NivoSlide } from '@/components/atoms/slider';
import {
  BANNER_SIZES_DESKTOP,
  BANNER_SIZES_FULL,
  BANNER_SIZES_MOBILE,
} from '@/config/bannerSizes';
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
                  // Phải khớp `imageSizes` của thẻ preload trong pages/index.tsx.
                  sizes={isFull ? BANNER_SIZES_FULL : BANNER_SIZES_DESKTOP}
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

    // Khoá tỉ lệ khung cho TOÀN BỘ cây mobile. Không có nó, LCP mobile đo được
    // 1.53s..6.90s trên cùng một commit (6 lượt Lighthouse), trong khi 3 chặng
    // mạng của LCP luôn chỉ 70-200ms — toàn bộ dao động nằm ở render delay
    // (61ms..1068ms). Cơ chế: NivoSlider autoplay 3s; mỗi lần chuyển,
    // renderAnimationOverlay() vẽ thêm một <img> `absolute inset-0` với
    // `height:100%; width:auto; minWidth:100%` (overlays/FadeOverlay.tsx:30-40).
    // Overlay suy khung theo CHIỀU CAO, còn slide gốc suy theo CHIỀU RỘNG
    // (`object-cover w-full h-full` trong hộp cao auto) — hai đường làm tròn
    // khác nhau nên hộp overlay lệch một phần pixel. Chrome coi hộp lớn hơn là
    // ứng viên LCP mới và đặt lại đồng hồ ⇒ LCP bị đẩy theo mỗi lần chuyển slide.
    // Đây là cùng cơ chế đã ghi ở homeBanner/index.tsx:71-79 và đã được sửa cho
    // desktop bằng `lg:aspect-[2030/830]` (desktop LCP ổn định 0.9s); phần này
    // là nửa mobile còn thiếu của đúng bản sửa đó.
    // Lấy tỉ lệ của ảnh ĐẦU TIÊN và áp cho mọi slide, để mọi slide có hộp y hệt
    // nhau — tỉ lệ theo từng ảnh vẫn để hộp đổi giữa các slide. Hiện 9/9 banner
    // mobile đều 1:1 (8 ảnh 1200x1200, 1 ảnh 1000x1000) nên không ảnh nào bị
    // cắt. Đọc từ dữ liệu ảnh thật nên nhánh fallback ảnh PC 2030x830 cũng ra
    // đúng tỉ lệ của nó, không bị ép vuông.
    // ĐIỀU KIỆN DUY TRÌ: ảnh trong cùng một khối banner mobile phải cùng tỉ lệ.
    // Vòng render dưới bỏ qua banner không có ảnh (`if (!imageDetail) return null`),
    // nên nguồn tỉ lệ cũng phải bỏ qua y như vậy. Dùng `[0]` thì một banner đầu
    // thiếu ảnh làm `mobileAspectRatio` = undefined và toàn bộ khoá tỉ lệ ÂM
    // THẦM mất tác dụng — đúng cái lỗi LCP mà khối này sinh ra để sửa.
    // Cùng cách với pages/index.tsx:95 khi chọn ảnh để preload.
    const mobileImages = bannersToUse
      .map((banner) =>
        shouldUsePcBanners
          ? banner?.images?.[0]?.image
          : banner?.images_mobile?.[0]?.image,
      )
      .filter((image): image is NonNullable<typeof image> => !!image);
    const mobileFirstImage = mobileImages.find(
      (image) => image.width && image.height,
    );
    const mobileAspectRatio = isSquareBannerMobile
      ? '1 / 1'
      : mobileFirstImage?.width && mobileFirstImage?.height
        ? `${mobileFirstImage.width} / ${mobileFirstImage.height}`
        : undefined;

    // Tỉ lệ của ảnh đầu được áp cho MỌI slide, mà ảnh giữ `object-cover`, nên
    // một ảnh lệch tỉ lệ sẽ bị cắt bớt trên/dưới mà không báo gì. Giữ nguyên
    // khoá tỉ lệ (bỏ nó là LCP dao động trở lại) nhưng bắt buộc phải thấy được
    // vấn đề nội dung khi nó xảy ra.
    if (process.env.NODE_ENV !== 'production' && mobileFirstImage) {
      const base = mobileFirstImage.width! / mobileFirstImage.height!;
      const odd = mobileImages.filter(
        (image) =>
          image.width &&
          image.height &&
          Math.abs(image.width / image.height - base) > 0.01,
      );
      if (odd.length) {
        console.warn(
          `[Banners] ${odd.length}/${mobileImages.length} ảnh banner mobile lệch tỉ lệ so với ảnh đầu (${mobileFirstImage.width}x${mobileFirstImage.height}). Chúng sẽ bị object-cover cắt bớt. Hãy đăng ảnh cùng tỉ lệ.`,
          odd.map((image) => `${image.width}x${image.height}`),
        );
      }
    }

    return (
      <div
        className="w-full lg:!hidden overflow-hidden"
        style={
          mobileAspectRatio ? { aspectRatio: mobileAspectRatio } : undefined
        }
      >
        {/* `h-full` để chiều cao xác định của hộp trên truyền xuống containerRef
            của NivoSlider — nơi overlay `absolute inset-0` lấy làm mốc. */}
        <NivoSlider
          className="w-full h-full"
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
                    style={
                      !isSquareBannerMobile && mobileAspectRatio
                        ? { aspectRatio: mobileAspectRatio }
                        : undefined
                    }
                  >
                    <ImageWithFallback
                      image={imageDetail.image}
                      alt={imageDetail.image?.alt || 'minhtuauthentic'}
                      className="object-cover w-full h-full"
                      unoptimized={false}
                      sizes={BANNER_SIZES_MOBILE}
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
