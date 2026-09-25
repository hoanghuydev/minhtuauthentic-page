import {
  CSSProperties,
  JSX,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Swiper as SwiperClass } from 'swiper/types';
import { twMerge } from 'tailwind-merge';
import LeftOutlined from '@ant-design/icons/lib/icons/LeftOutlined';
import RightOutlined from '@ant-design/icons/lib/icons/RightOutlined';
import SectionSwiperSlide from '@/components/organisms/sectionSwiper/slide';
import { Grid, Pagination, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

export type SwiperProps = {
  classNameContainer?: string;
  classNameItems?: string;
  renderItem: (content: unknown) => ReactNode;
  data: unknown[];
  loop?: boolean;
  heightItem?: number;
  slidesPerView?: number;
  spaceBetween?: number;
  isGrid?: boolean;
  isUseHeightWrapper?: boolean;
  isCenter?: boolean;
  onSlideChange?: (activeIndex: number) => void;
  isNotDisplayNavigation?: boolean;
  debug?: boolean;
  onLoad?: () => void;
  isMobile?: boolean;
  auto?:
    | boolean
    | {
        delay?: number;
        disableOnInteraction?: boolean;
        pauseOnMouseEnter?: boolean;
      };
  slidePerViewMobile?: number;
  spaceBetweenMobile?: number;
  classNameLeft?: string;
  classNameRight?: string;
  onSwiper?: (swiper: SwiperClass) => void;
  speed?: number;
};
export default function SectionSwiperItem({
  classNameContainer,
  renderItem,
  data,
  loop,
  classNameItems,
  slidesPerView,
  spaceBetween,
  isGrid,
  isUseHeightWrapper,
  isCenter,
  onSlideChange,
  isNotDisplayNavigation,
  heightItem,
  onLoad,
  auto,
  slidePerViewMobile,
  spaceBetweenMobile,
  classNameLeft,
  classNameRight,
  onSwiper,
  speed,
}: SwiperProps) {
  const rows = 2;
  // Giữ qua ref, KHÔNG qua state. Trước đây `setSwiper` lúc Swiper khởi tạo làm
  // `swiper` đổi ⇒ `renderSwiper` useMemo chạy lại ⇒ dựng lại toàn bộ thẻ sản
  // phẩm của khối, chỉ để nối lại hai nút mũi tên. Handler đọc ref lúc bấm nên
  // không cần re-render nào.
  const swiperRef = useRef<SwiperClass | null>(null);
  const [heightWrapper, setHeightWrapper] = useState<number>(heightItem || 0);
  const [ready, setReady] = useState<boolean>(false);
  useEffect(() => {
    setReady(true);
    if (heightItem) {
      handlerHeightWrapper(heightItem);
    }
    onLoad && onLoad();
  }, []);
  const renderNavigatorButton = (variant: string) => {
    return (
      <div
        onClick={() => {
          const instance = swiperRef.current;
          if (instance) {
            if (variant === 'next') {
              instance.slideNext(speed);
            } else {
              instance.slidePrev(speed);
            }
          }
        }}
        className={twMerge(
          'absolute z-[2] w-[32px] h-[32px] rounded-full border border-[#dad4d4] cursor-pointer top-[calc(50%-22px)] lg:top-[calc(50%-16px)] bg-white flex justify-center items-center',
          variant === 'next'
            ? 'right-[-10px] lg:right-[-16px]'
            : 'left-[-10px] lg:left-[-16px]',
          variant === 'next' ? classNameRight : classNameLeft,
        )}
      >
        {variant === 'next' ? (
          <RightOutlined className={'text-[#dad4d4] text-center '} />
        ) : (
          <LeftOutlined className={'text-[#dad4d4] text-center '} />
        )}
      </div>
    );
  };

  const handlerHeightWrapper = (height: number) => {
    setHeightWrapper(height * rows + (spaceBetween || 50));
  };

  const renderSwiper = useMemo(() => {
    return (
      <>
        <Swiper
          effect={'fade'}
          grid={isGrid ? { rows } : {}}
          // Chiều cao đến qua CSS custom property mà hộp bọc đặt (xem cuối
          // file), KHÔNG qua prop React: chuỗi này là hằng nên `heightWrapper`
          // không cần nằm trong deps của useMemo — mỗi lần nó đổi trước đây là
          // một lượt dựng lại toàn bộ thẻ sản phẩm của khối.
          // Đặt `height` trực tiếp lên hộp bọc thì SAI hai đường: (1) Tailwind
          // preflight bật `box-sizing: border-box`, nên với
          // `classNameContainer` có `p-3` + `border` (homeBrand/index.tsx:63)
          // thì content box hụt 26px và logo bị cắt; (2) style inline thắng
          // class nên `lg:h-[250px]` ở cùng hộp đó (homeBrand/index.tsx:64) mất
          // tác dụng, làm hai cột của khối Thương hiệu lệch chiều cao.
          style={{ height: 'var(--section-swiper-height, 100%)' }}
          modules={isGrid ? [Grid, Autoplay] : [Pagination, Autoplay]}
          autoplay={auto}
          loop={loop}
          speed={speed}
          cssMode={false}
          className={twMerge('mx-auto w-full')}
          wrapperClass={'mx-auto'}
          onSwiper={(instance) => {
            swiperRef.current = instance;
            onSwiper && onSwiper(instance);
          }}
          centeredSlides={isCenter}
          breakpoints={{
            320: {
              slidesPerView: slidePerViewMobile || slidesPerView,
              // `spaceBetweenMobile` phải thắng: ngược lại thì giá trị desktop
              // đè lên khoảng cách mobile. Trước đây `sectionSwiper/index.tsx`
              // che lỗi này bằng cách truyền `spaceBetween = spaceBetweenMobile`
              // ở nhánh mobile của nó; bỏ nhánh đó thì lỗi lộ ra.
              spaceBetween: spaceBetweenMobile ?? spaceBetween,
            },
            // Dải 768-1023 tái lập chính xác hành vi của develop: số cột của
            // mobile (vì breakpoint 320 của Swiper vốn đã thắng phép chọn bằng
            // JS ở dải này) nhưng khoảng cách của desktop (vì nhánh desktop cũ
            // truyền `spaceBetween`). Đây là một điểm không nhất quán có sẵn —
            // giữ lại để việc gộp hai nhánh không đổi giao diện; muốn dọn thì
            // cần chốt với người quyết định sản phẩm.
            768: {
              slidesPerView: slidePerViewMobile || slidesPerView,
              spaceBetween: spaceBetween ?? spaceBetweenMobile,
            },
            1024: {
              slidesPerView: slidesPerView,
              spaceBetween: spaceBetween,
            },
          }}
          onSlideChange={(instance) => {
            // Dùng instance mà Swiper truyền vào, không đọc state ngoài: state
            // cũ luôn trễ một nhịp nên `activeIndex` trước đây báo sai.
            onSlideChange && onSlideChange(instance?.activeIndex || 0);
          }}
        >
          {data &&
            data.map((content, index: number) => {
              return (
                <SwiperSlide key={index}>
                  <SectionSwiperSlide
                    setHeightItem={(height: number) => {
                      if (index === 0 && isUseHeightWrapper && !heightItem) {
                        handlerHeightWrapper(height);
                      }
                    }}
                    className={classNameItems}
                    key={index}
                  >
                    {renderItem(content)}
                  </SectionSwiperSlide>
                </SwiperSlide>
              );
            })}
        </Swiper>
        {data.length > 0 && !isNotDisplayNavigation && (
          <>
            {renderNavigatorButton('prev')}
            {renderNavigatorButton('next')}
          </>
        )}
      </>
    );
    // `heightWrapper` và instance Swiper CỐ Ý không nằm trong danh sách này:
    // cả hai đổi ngay sau khi tải, và mỗi lần đổi trước đây là một lượt dựng lại
    // toàn bộ thẻ sản phẩm của khối. Xem hai ghi chú ở trên.
    //
    // ⚠ RÀNG BUỘC ĐỐI VỚI CALLER: `data` và `renderItem` CỐ Ý không nằm ở đây.
    // Không phải quên. Cả hai đều không ổn định tham chiếu tại mọi call-site —
    // `groupCategory/index.tsx:116` truyền `data={...filter(...)}`, tức mảng mới
    // mỗi lần render, và `renderItem` là arrow tạo mới mỗi lần. Đưa bất kỳ cái
    // nào vào đây là memo mất tác dụng hoàn toàn và 169 thẻ sản phẩm của trang
    // chủ lại dựng lại mỗi lần cha render (đã đo: TBT tăng ~260 ms).
    //
    // HỆ QUẢ: lưới được chốt ở lần render có `ready === true`. Nếu bạn cần lưới
    // đổi theo state sau mount (filter, tab, phân trang), ĐỪNG chỉ đổi `data` —
    // hãy remount bằng `key`, như `productDetailImage.tsx:106` đang làm với
    // `key={JSON.stringify(mediaItems)}`.
    //
    // Đã rà toàn bộ 14 call-site tại thời điểm viết: không chỗ nào đổi `data`
    // sau mount mà không remount, nên chưa có luồng nào hỏng.
  }, [ready, speed]);

  return (
    <>
      {!ready ? (
        <></>
      ) : (
        <div
          className={twMerge('relative', classNameContainer)}
          style={
            heightWrapper
              ? ({
                  '--section-swiper-height': `${heightWrapper}px`,
                } as CSSProperties)
              : undefined
          }
        >
          {renderSwiper}
        </div>
      )}
    </>
  );
}
