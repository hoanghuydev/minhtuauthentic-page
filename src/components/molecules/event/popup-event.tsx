import { StaticContentsDto } from '@/dtos/StaticContents.dto';
import { JSX, MouseEventHandler, useEffect, useRef, useState } from 'react';
import Close from '@/components/icons/close';
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';
import Link from 'next/link';
import { generateSlugToHref } from '@/utils';
import ImageWithFallback from '@/components/atoms/images/ImageWithFallback';
import { twMerge } from 'tailwind-merge';
import { Navigation, Pagination } from 'swiper/modules';

interface PopupEventProps {
  externalOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onBannersLoaded?: (hasBanners: boolean) => void;
  onNewBannersDetected?: () => void;
}

export default function PopupEvent ({ externalOpen, onOpenChange, onBannersLoaded, onNewBannersDetected }: PopupEventProps = {}) {
  const [isClient, setIsClient] = useState(false);
  const [isOpen, setOpen] = useState(false)
  const [banners, setBanners] = useState<StaticContentsDto[]>([])
  const swiperRef = useRef<SwiperClass | null>(null);
  const [isLastSlide, setIsLastSlide] = useState(false);
  const [isFirstSlide, setIsFirstSlide] = useState(true);
  const [duration, setDuration] = useState(15000);
  const timer = useRef<NodeJS.Timeout | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const autoOpenTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const seenBanners: number[] = (JSON.parse(localStorage.getItem('seenBanners') || '[]')) as number[];
      const detectedBanners: number[] = (JSON.parse(localStorage.getItem('detectedBanners') || '[]')) as number[];
      
      // Fetch all active popups (no filtering)
      fetch(`/api/static-contents/popup-event`)
        .then(res => res.json())
        .then(data => {
          const allBanners = data.data || [];
          setBanners(allBanners)
          setDuration((allBanners?.[0]?.properties?.duration|| 15) * 1000)
          const hasBanners = allBanners.length > 0;
          
          if (onBannersLoaded) {
            onBannersLoaded(hasBanners);
          }
          
          // Check if there are new banners (never detected before)
          if (hasBanners) {
            const currentBannerIds = allBanners.map((b: StaticContentsDto) => b.id);
            const hasNewBanners = currentBannerIds.some((id: number) => !detectedBanners.includes(id));
            
            if (hasNewBanners && onNewBannersDetected) {
              // Save detected banners
              localStorage.setItem('detectedBanners', JSON.stringify(currentBannerIds));
              onNewBannersDetected();
            } else if (!hasNewBanners && detectedBanners.length === 0) {
              // First time detection
              localStorage.setItem('detectedBanners', JSON.stringify(currentBannerIds));
            }
            
            // Auto-open only if there are unseen banners
            const hasUnseenBanners = currentBannerIds.some((id: number) => !seenBanners.includes(id));
            if (hasUnseenBanners && externalOpen === undefined) {
              autoOpenTimer.current = setTimeout(() => {
                setOpen(true)
              }, 6000)
            }
          }
        })
        .catch(() => setOpen(false)) 
    }
    return () => {
      if (autoOpenTimer.current) {
        clearTimeout(autoOpenTimer.current);
      }
    }
  }, [isClient, onBannersLoaded, onNewBannersDetected])

  useEffect(() => {
    if (externalOpen !== undefined) {
      setOpen(externalOpen);
      if (externalOpen && autoOpenTimer.current) {
        clearTimeout(autoOpenTimer.current);
      }
    }
  }, [externalOpen]);

  useEffect(() => {
    if (!isClient || !isOpen) return;
    if(timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      handleClose();
    }, duration);
    return () => {
      if(timer.current) clearTimeout(timer.current);
    }
  }, [duration, isOpen, isClient])

  const handleClose = () => {
    setOpen(false);
    if (onOpenChange) {
      onOpenChange(false);
    }
  }

  const clickOutsideAction: MouseEventHandler<HTMLDivElement> = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if(contentRef.current && !contentRef.current.contains(event.target as Node)) {
      handleClose();
    }
  }

  const setSeenBanners = (index: number) => {
    if(!banners[index]?.id) return
    const seenBanners: number[] = (JSON.parse(localStorage.getItem('seenBanners') || '[]')) as number[];
    if(seenBanners.includes(banners[index].id)) return
    localStorage.setItem('seenBanners', JSON.stringify([...seenBanners, banners[index].id]))
  }

  if (!isClient) return null;
  
  return isOpen && (
    <div className='fixed flex justify-center items-center top-0 left-0 w-full h-screen z-50 bg-gray-900/50' onClick={clickOutsideAction}>
      <div
        ref={contentRef}
        className='relative flex-col p-2 max-w-sm md:max-w-xl min-w-[300px]'
      >
        <div className="flex flex-row absolute -top-8 right-0 cursor-pointer items-center p-2 mr-2 bg-red-600" onClick={handleClose}>
          <Close className='w-6 text-white'/>
          <div className='text-white'>close</div>
        </div>
        <div
          className={twMerge(
            'relative banner-container w-full h-full',
            isLastSlide && 'hide-next-button',
            isFirstSlide && 'hide-prev-button',
          )}
          onMouseEnter={() => swiperRef.current?.autoplay?.stop()}
          onMouseLeave={() => swiperRef.current?.autoplay?.start()}
        >
          <Swiper 
            onSwiper={(swiper: SwiperClass) => {
              swiperRef.current = swiper
            }}
            onAfterInit={() => setSeenBanners(0)}
            onSlideChange={(swiper) => {
              setDuration((banners?.[swiper.activeIndex]?.properties?.duration || 15) * 1000)
              setSeenBanners(swiper.activeIndex);
              setIsFirstSlide(swiper.isBeginning);
              setIsLastSlide(swiper.isEnd);
            }}
            modules={[Pagination, Navigation]}
            pagination={banners.length > 1}
            navigation={banners.length > 1}
          >
            {banners.map((banner, index) => {
              const imageDetail = banner?.images?.[0];
              if (!imageDetail) return null;

              const imageElement = (
                <ImageWithFallback
                  image={imageDetail.image}
                  alt={imageDetail.image?.alt || 'minhtuauthentic'}
                  className={'object-contain w-full h-full'}
                  loading="eager"
                  priority={index === 0} // High priority for first banner
                  unoptimized={true}
                  sizes="100vw"
                  quality={100}
                />
              );

              return (
                <SwiperSlide
                  key={`desktop-${index}`}
                  className="w-full slide-popup-event"
                >
                  <Link href={generateSlugToHref(banner?.properties?.slug)}>
                    {imageElement}
                  </Link>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>  
      </div>
    </div>
  )
}
