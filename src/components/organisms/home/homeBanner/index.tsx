import { StaticContentsDto } from '@/dtos/StaticContents.dto';
import Banners from '@/components/molecules/header/banners';
import { useIsMobile } from '@/hooks/useDevice';
import MenuWrapper from '@/components/molecules/header/menu/menuWrapper';
import { ResponseMenuDto } from '@/dtos/responseMenu.dto';
import { SettingOptionDto } from '@/dtos/SettingOption.dto';
import { twMerge } from 'tailwind-merge';

type Props = {
  banners: StaticContentsDto[];
  menu?: ResponseMenuDto;
  setting?: SettingOptionDto;
};
export default function HomeBanner({ banners, menu, setting }: Props) {
  const isFullWidth = setting?.isBannerFull || false;
  const isSquareBannerMobile = setting?.isSquareBannerMobile || false;

  return (
    <>
      {isFullWidth ? (
        <div
          id={'main-home-page'}
          className={twMerge(
            'relative w-full max-lg:h-auto mt-[60px] lg:mt-0',
            isFullWidth ? 'h-[560px]' : 'h-[450px]',
          )}
        >
          {/* Desktop: Menu overlay + Full banner */}
          <div className={'container m-auto hidden lg:!block'}>
            <div className={'absolute top-3 z-[15] m-auto'}>
              <div className={'container m-auto relative'}>
                {menu && <MenuWrapper menu={menu} className={'w-[220px] '} />}
              </div>
            </div>
          </div>

          <Banners
            className={twMerge(
              'h-full',
              isFullWidth ? 'h-[560px]' : 'h-[450px]',
            )}
            banners={banners || []}
            classNameImage={'object-cover h-full object-center'}
            isFull={true}
            isSquareBannerMobile={isSquareBannerMobile}
          />
        </div>
      ) : (
        <div
          id={'main-home-page'}
          className={
            'mt-[60px] lg:mt-[10px] lg:flex w-full gap-2 relative container mx-auto'
          }
        >
          {/* Cột menu luôn chiếm chỗ 220px kể cả khi `menu` chưa về từ
              /api/settings. Trước đây khối này chỉ render khi có `menu`, nên
              banner rộng 1241px lúc SSR rồi co xuống 1013px sau hydrate ⇒ cao
              507px xuống 414px ⇒ CLS 0.239 trên desktop. */}
          {/* `lg:!block` chứ không `lg:block`: script Fundiin (customScript.tsx)
              chèn một <style> inline 946 byte có `.hidden{display:none}`, đứng
              SAU Tailwind nên thắng `.lg\:block`. Khi đó cột này sập về 0x0,
              banner giãn ra 1240px và CLS nhảy 0.0067 -> 0.12. Đây là element
              duy nhất trong codebase còn dùng `hidden lg:block` không dấu `!`. */}
          <div className="hidden lg:!block relative z-[15] flex-shrink-0 w-[220px]">
            {menu && <MenuWrapper menu={menu} className={'w-[220px]'} />}
          </div>

          {/* Một <Banners> duy nhất: bản thân nó đã tự tách cây desktop
              (hidden lg:!block) và cây mobile (lg:!hidden). Trước đây khối này
              được render hai lần nên có tới 4 NivoSlider cùng mount. */}
          {/* Cần CẢ HAI class, bỏ cái nào cũng hỏng — đã đo bằng ablation.
              Cơ chế: cột menu cao 415px, `align-items: stretch` của flex row
              kéo khung banner cao thêm 0.83px so với tỉ lệ ảnh. Slide kế tiếp
              vẽ <img> mới trong cái hộp lớn hơn đúng một hàng pixel (1013px²),
              Chrome coi đó là ứng viên LCP mới ⇒ LCP nhảy 0.3s -> 4.7s đúng lúc
              slider tự chuyển. `self-start` gỡ stretch; `aspect` giữ tỉ lệ vì
              đầu ra của /_next/image trôi theo width (414.17 -> 414.74).
              KHÔNG phải do file banner lệch tỉ lệ: đo marker SOF của JPEG cho
              thấy 9/9 file đúng 2030x830. */}
          <div
            className={
              'min-h-[140px] flex-grow overflow-hidden lg:self-start lg:aspect-[2030/830]'
            }
          >
            <Banners
              className={'w-full h-full rounded-3xl'}
              banners={banners || []}
              classNameImage={'object-contain lg:object-cover w-full h-full'}
              isSquareBannerMobile={isSquareBannerMobile}
            />
          </div>
        </div>
      )}
    </>
  );
}
