import Logo from '@/static/images/logo.png';
import Image from 'next/image';
import { SETTING_KEY } from '@/config/enum';
import { twMerge } from 'tailwind-merge';
import { LogoProps } from '@/config/type';
import { SettingsDto } from '@/dtos/Settings.dto';
type Props = {
  position: string;
  className?: string;
  settings: SettingsDto[];
};
export default function LogoComponent({
  position,
  className,
  settings,
}: Props) {
  const setting = settings?.find(
    (item) => item.key === SETTING_KEY.GENERAL.LOGO.KEY,
  )?.value;
  const image =
    setting?.[
      position === LogoProps.FOOTER ? 'page_logo_footer' : 'page_logo_header'
    ]?.[0]?.image;
  const logo = setting ? image?.url || Logo : Logo;
  // Khung render thật: footer `w-[384px]` (footer/index.tsx:51, chỉ hiện từ lg),
  // header desktop `w-[230px]` (header/index.tsx:133) — nhưng khối đó là
  // `max-lg:hidden`, nên trên mobile header dùng `h-[45px] w-auto`
  // (listHeaderButton.tsx:38) ⇒ bề rộng = 45 x tỉ lệ ảnh = 172px (logo CMS
  // 2070x540) đến 190px (logo dự phòng 4926x1168). Khai cứng `230px` cho cả hai
  // làm mobile cần 230x1.75=402 ⇒ nhảy qua mốc 384 lên w=640 (18.730 B) trong
  // khi w=384 (10.188 B) là đủ. Khai 190px phủ cả hai logo và vẫn rơi vào mốc
  // 384 ở DPR 1.75-2. `sizes` không chứa vw nên Next phát trọn allSizes, DPR cao
  // vẫn tự chọn bản lớn hơn — khai nhỏ hơn khung mới là ảnh bị phóng to mờ.
  // Bề rộng thật trên mobile suy từ tỉ lệ ảnh: khung là `h-[45px] w-auto`
  // (MobileMenu/navMenu/header/listHeaderButton.tsx:36-39). Hằng số 190px chỉ
  // đúng với hai logo đang dùng (2070x540 -> 172px, 4926x1168 -> 190px); admin
  // đăng logo tỉ lệ khác, ví dụ 6:1, thì khung thật là 270px và khai 190px sẽ
  // làm ảnh bị phóng to mờ ở DPR cao.
  const mobileLogoWidth =
    image?.width && image?.height
      ? Math.ceil(45 * (image.width / image.height))
      : 190;
  const sizes =
    position === LogoProps.FOOTER
      ? '384px'
      : `(max-width: 1023.98px) ${mobileLogoWidth}px, 230px`;
  return (
    <Image
      src={logo}
      height={image?.height}
      width={image?.width}
      sizes={sizes}
      className={twMerge(className)}
      alt={
        'Minh Tu Authentic, Nước hoa chính hãng Tphcm, Quận Tân Phú, Mỹ phẩm'
      }
    />
  );
}
