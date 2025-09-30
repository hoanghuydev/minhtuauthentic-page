import { StaticContentsDto } from '@/dtos/StaticContents.dto';
import { useEffect, useRef, useState } from 'react';
import Close from '@/components/icons/close';
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';
import Link from 'next/link';
import { generateSlugToHref } from '@/utils';
import ImageWithFallback from '@/components/atoms/images/ImageWithFallback';
import { twMerge } from 'tailwind-merge';
import { Navigation, Pagination } from 'swiper/modules';

export default function PopupEvent () {
  const [isClient, setIsClient] = useState(false);
  const [isOpen, setOpen] = useState(true)
  const [banners, setBanners] = useState<StaticContentsDto[]>([])
  const swiperRef = useRef<SwiperClass | null>(null);
  const [isLastSlide, setIsLastSlide] = useState(false);
  const [isFirstSlide, setIsFirstSlide] = useState(true);
  const [duration, setDuration] = useState(15000);
  const timer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const seenBanners: number[] = (JSON.parse(localStorage.getItem('seenBanners') || '[]')) as number[];
      const searchParams = new URLSearchParams();
      for(let id of seenBanners) {
        searchParams.append("ignoreIds[]", id.toString());
      }
      fetch(`/api/static-contents/popup-event?${searchParams}`)
        .then(res => res.json())
        .then(data => {
          setBanners(data.data || [])
          setDuration((data?.data?.[0]?.properties?.duration|| 15) * 1000)
          setOpen(data.data.length > 0)
        })
        .catch(() => setOpen(false)) 
    }
  }, [isClient])

  useEffect(() => {
    if (!isClient) return;
    if(timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setOpen(false)
    }, duration);
  }, [duration])

  const setSeenBanners = (index: number) => {
    if(!banners[index]?.id) return
    const seenBanners: number[] = (JSON.parse(localStorage.getItem('seenBanners') || '[]')) as number[];
    if(seenBanners.includes(banners[index].id)) return
    localStorage.setItem('seenBanners', JSON.stringify([...seenBanners, banners[index].id]))
  }

  if (!isClient) return null;
  
  return isOpen && (
    <div className='fixed flex items-center justify-center top-0 left-0 w-full h-screen z-50 bg-gray-900/50'>
      <div
        className='relative flex-col p-2 max-w-[768px] min-w-[300px]'
      >
        <Close className='w-8 text-white absolute -top-8 cursor-pointer right-0' onClick={() => setOpen(false)}/>
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
            onUpdate={() => setSeenBanners(0)}
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
