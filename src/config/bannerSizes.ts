/**
 * `sizes` của <img> banner và `imageSizes` của thẻ <link rel=preload> PHẢI trùng
 * khít nhau. Lệch một ký tự là trình duyệt chọn hai biến thể khác nhau cho cùng
 * một banner và tải cả hai — tệ hơn hẳn so với không tối ưu gì. Vì vậy cả hai
 * bên đều đọc từ file này.
 *
 * Bề rộng khung banner đo thật trên production build (13 viewport):
 *   vw  390 –  1023  ->  cây mobile, rộng 100vw (container chặn ở 768 từ mốc 768)
 *   vw 1024 –  1239  ->  797px   (container chặn ở 1024, trừ cột menu 220 + gap 8)
 *   vw 1240 trở lên  ->  1013px  (container chặn ở 1240, không rộng thêm nữa)
 *
 * Khai `100vw` cho cây desktop khiến Chrome chọn w=1920 cho một khung 1013px
 * (69.096 B thay vì 33.816 B) và w=3840 ở màn 2560.
 */
export const BANNER_SIZES_DESKTOP =
  '(min-width: 1240px) 1013px, (min-width: 1024px) 797px, 100vw';

/** Nhánh `isBannerFull`: banner tràn đúng chiều ngang màn hình. */
export const BANNER_SIZES_FULL = '100vw';

/** Cây mobile luôn rộng bằng khung nhìn. */
export const BANNER_SIZES_MOBILE = '100vw';
