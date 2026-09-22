import useSettings from '@/hooks/useSettings';
import { useSsrCommonSettings } from '@/contexts/ssrCommonSettingsContext';

const DEFAULT_SWIPER_SPEED = 1500;

export default function useSwiperSpeed(): number {
  // Giá trị SSR có mặt ngay ở render đầu tiên. Trước đây hook này trả 1500 lúc
  // SSR rồi nhảy sang 1600 khi /api/settings về; prop `speed` đổi làm useMemo
  // trong sectionSwiper dựng lại toàn bộ cây Swiper (~220 ProductCard).
  const ssrCommonSettings = useSsrCommonSettings();
  const { commonSettings } = useSettings();

  const speed = ssrCommonSettings?.swiperSpeed ?? commonSettings?.swiperSpeed;
  if (!speed || speed < 300 || speed > 2500) return DEFAULT_SWIPER_SPEED;
  return speed;
}
