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
 * - Sai: cả hai hook đều trả `false` ở lần render client đầu (`MOBILE_BREAKPOINT`
 *   = 768), nên lần đầu không vẽ gì và phải chờ một nhịp ⇒ thêm một lượt dựng
 *   lại toàn bộ cây bên dưới.
 * - Và ở ĐÚNG 768px thì `isMobile` (<=768) lẫn `isDesktop` (>=768) cùng đúng,
 *   nên hai bộ trượt cùng dựng và chồng lên nhau.
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
