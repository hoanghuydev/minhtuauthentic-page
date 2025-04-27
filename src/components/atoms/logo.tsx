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
  return (
    <Image
      src={logo}
      height={image?.height}
      width={image?.width}
      className={twMerge(className)}
      alt={
        'Minh Tu Authentic, Nước hoa chính hãng Tphcm, Quận Tân Phú, Mỹ phẩm'
      }
    />
  );
}
