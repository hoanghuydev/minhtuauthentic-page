import { useEffect, useMemo, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { ProductDto } from '@/dtos/Product.dto';
import { ImageDto } from '@/dtos/Image.dto';
import Close from '@/components/icons/close';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Pagination, Navigation } from 'swiper/modules';
import { Swiper as SwiperClass } from 'swiper/types';
import PopupImageItem from '@/components/molecules/product/image/popupImageItem';
import LeftOutlined from '@ant-design/icons/lib/icons/LeftOutlined';
import RightOutlined from '@ant-design/icons/lib/icons/RightOutlined';
import PopupSlideContent from '@/components/molecules/product/image/popupSlideContent';
import { useProductImageDetail } from '@/contexts/productDetailCarousel';

type Props = {
  open: boolean;
  product: ProductDto;
  image: ImageDto | null;
  setIsOpen?: (item: { display: boolean; image: ImageDto | null }) => void;
};
export default function PopupImage({ open, product, image, setIsOpen }: Props) {
  const { images, imageActive, setImageActive } = useProductImageDetail();
  const swiperRef = useRef<SwiperClass | null>(null);
  const listImageRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (image) {
      setImageActive(image);
    }
  }, [image]);

  useEffect(() => {
    const swiper = swiperRef.current;
    if (swiper) {
      const index = images.findIndex((item) => item.url === imageActive?.url);
      const listImage = listImageRef?.current?.querySelector(`[data-index="${index}"]`);
      console.log(listImageRef.current)
      swiper.slideTo(index);
      listImage?.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',  // center horizontally
        block: 'nearest'
      })
    }
  }, [imageActive]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [open]);

  const renderImage = useMemo(() => {
    return (
      <div ref={listImageRef} className={'w-max mx-auto flex gap-3 h-full py-3 max-lg:px-3'}>
        {images.map((imageItem, index) => (
          <PopupImageItem
            key={index}
            imageItem={imageItem}
            setImageActive={setImageActive}
            isActive={imageItem.id === imageActive?.id}
            index={index}
          />
        ))}
      </div>
    );
  }, [images, imageActive]);

  const handleClickNavigatorButton = (variant: string) => {
    const swiper = swiperRef.current;
    if (swiper) {
      const currentSlide = swiper.activeIndex;
      const indexMax = images.length - 1;
      if (variant === 'next') {
        swiper.slideTo(currentSlide === indexMax ? 0 : currentSlide + 1);
      } else {
        swiper.slideTo(currentSlide === 0 ? indexMax : currentSlide - 1);
      }
    }
  }

  const renderNavigatorButton = (variant: string) => {
    return (
      <div
        onClick={() => handleClickNavigatorButton(variant)}
        className={twMerge(
          'absolute z-[2] w-[32px] h-[32px] rounded-full border border-[#dad4d4] cursor-pointer top-[calc(50%-22px)] lg:top-[calc(50%-16px)] bg-white flex justify-center items-center select-none',
          variant === 'next' ? 'right-[20px]' : 'left-[20px]',
        )}
      >
        {variant === 'next' ? (
          <RightOutlined className={'text-[#dad4d4] text-center select-none'} />
        ) : (
          <LeftOutlined className={'text-[#dad4d4] text-center select-none'} />
        )}
      </div>
    );
  };

  const renderSwiper = useMemo(() => {
    return (
      <Swiper
        className={'h-full select-none'}
        modules={[Pagination, EffectFade, Navigation]}
        effect={'fade'}
        loop={false}
        slidesPerView={1}
        fadeEffect={{
          crossFade: true,
        }}
        speed={400}
        key={'popup-image'}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onSlideChange={(swiper) => {
          const activeIndex = swiper.activeIndex;
          if (images[activeIndex]) {
            setImageActive(images[activeIndex]);
          }
        }}
      >
        {images.map((image, index) => (
          <SwiperSlide
            key={image.url + '_' + index}
            className="relative flex justify-center items-center h-full w-full select-none"
          >
            <PopupSlideContent
              image={image}
              product={product}
              setIsOpen={setIsOpen}
              imageIndex={index}
              totalImages={images.length}
              onPrev={() => handleClickNavigatorButton('prev')}
              onNext={() => handleClickNavigatorButton('next')}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    );
  }, [images]);

  return (
    <>
      <div
        style={{
          backgroundImage: `url("${imageActive?.url}")`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
        className={twMerge(
          'fixed inset-0 transition-all duration-300 select-none',
          open ? 'visible opacity-100 z-[100]' : 'invisible opacity-0 z-[-1]',
        )}
      >
        <div
          className={
            'backdrop-blur-3xl bg-black/30 h-full relative select-none'
          }
        >
          <div
            className={
              'h-[calc(100%-220px)] lg:h-[calc(100%-140px)] pb-0 pt-[40px] w-full box-content'
            }
          >
            <div className={'relative h-full max-lg:px-3'}>
              {images.length > 0 && renderSwiper}
              {images.length > 0 && (
                <>
                  {renderNavigatorButton('prev')}
                  {renderNavigatorButton('next')}
                </>
              )}
            </div>
          </div>
          <div className={'h-[120px] w-full overflow-auto select-none'}>
            {renderImage}
          </div>
          <button
            type="button"
            className={
              'w-8 h-8 absolute top-3 right-3 grid place-items-center cursor-pointer bg-white rounded-full'
            }
            onClick={() => {
              setIsOpen && setIsOpen({ display: false, image: null });
            }}
          >
            <Close className={' cursor-pointer w-6 h-6 block'} />
          </button>
        </div>
      </div>
    </>
  );
}
