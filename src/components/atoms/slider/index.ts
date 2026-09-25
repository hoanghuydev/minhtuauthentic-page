// Main Component
export { NivoSlider } from './NivoSlider';
export { NivoSlide } from './NivoSlide';

// UI Components
export { NavButton } from './NavButton';
export { PaginationDot } from './PaginationDot';

// CỐ Ý KHÔNG re-export `Slice`, `Box` và nhóm overlay ở đây.
// Chúng là chi tiết nội bộ của NivoSlider, và cả 6 file đó import framer-motion.
// Barrel này được `molecules/header/banners.tsx:9` import TĨNH, nên mỗi export
// ở đây kéo framer-motion (147 KB raw / 46,6 KB nén) vào chunk khởi tạo của
// trang chủ — vô hiệu hoá `dynamic()` mà NivoSlider.tsx dùng để hoãn tải chúng.
// Đã kiểm: không file nào ngoài barrel này import chúng từ đây.
// Cần dùng trực tiếp thì import từ './Slice', './Box', './overlays'.

// Hooks
export { useNivoSlider } from './useNivoSlider';
export { SliderContext, useSlider } from './context';

// Types
export type {
  EffectType,
  NivoSliderProps,
  SlideProps,
  SliderContextProps,
} from './types';
export type { NavButtonProps } from './NavButton';
export type { PaginationDotProps } from './PaginationDot';
export type { UseNivoSliderProps, UseNivoSliderReturn } from './useNivoSlider';

// Utils
export { getRandomEffect, isSliceEffect, getImageSrc } from './utils';

// Default export
export { default } from './NivoSlider';
