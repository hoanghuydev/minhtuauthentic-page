import 'swiper/css';
import 'swiper/css/grid';
import 'swiper/css/pagination';
import dynamic from 'next/dynamic';
const SectionSwiperItem = dynamic(
  () => import('@/components/organisms/sectionSwiper/item'),
  { ssr: false },
);
import { SwiperProps } from '@/components/organisms/sectionSwiper/item';

/**
 * Một `SectionSwiperItem` duy nhất. Trước đây file này dựng HAI cái rồi dùng
 * `useIsMobile()`/`useIsDesktop()` (react-responsive) chọn một, việc đó vừa thừa
 * vừa sai:
 *
 * - Thừa: `item.tsx:136-145` đã truyền `breakpoints` cho Swiper tự đổi số cột
 *   theo bề rộng, và breakpoint của Swiper THẮNG phép chọn bằng JS. Ở 800px,
 *   JS chọn nhánh desktop nhưng Swiper thấy 800 < 1024 nên vẫn áp mốc 320 —
 *   tức số cột của mobile. Gộp lại giữ đúng hành vi đang chạy.
 * - Sai: ở ĐÚNG 768px thì `isMobile` (<=768) lẫn `isDesktop` (>=768) cùng đúng
 *   (`MOBILE_BREAKPOINT` = 768), nên hai bộ trượt cùng dựng và chồng lên nhau —
 *   hai instance Swiper, hai lần `onSwiper`, hai vòng autoplay.
 * - Trên SSR cả hai hook trả `false` nên không cây nào vào HTML. (Trên client
 *   thì react-responsive 10 khởi tạo `useState(mediaQuery.matches)` nên giá trị
 *   đã đúng ngay lượt render đầu — không phải nguồn của lượt dựng lại.)
 */
const SectionSwiper = (props: SwiperProps) => (
  <SectionSwiperItem
    {...props}
    slidesPerView={props.slidesPerView || 5}
    slidePerViewMobile={props.slidePerViewMobile || 2}
    speed={props.speed || 1500}
    spaceBetween={props.spaceBetween || 10}
    spaceBetweenMobile={props.spaceBetweenMobile ?? 5}
  />
);
export default SectionSwiper;
