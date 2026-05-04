import useSettings from '@/hooks/useSettings';

const DEFAULT_SWIPER_SPEED = 1500;

export default function useSwiperSpeed(): number {
  const { commonSettings } = useSettings();
  const speed = commonSettings?.swiperSpeed;
  if (!speed || speed < 300 || speed > 2500) return DEFAULT_SWIPER_SPEED;
  return speed;
}
