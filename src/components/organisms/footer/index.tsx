import LogoBCT from '@/static/images/icon-bct.png';
import LogoGrn from '@/static/images/DMCA_logo-grn-btn100w.png';
import Image from 'next/image';
import { StaticContentsDto } from '@/dtos/StaticContents.dto';
import { SETTING_KEY, STATIC_CONTENT_TYPE } from '@/config/enum';
import Link from 'next/link';
import orderBy from 'lodash/orderBy';
import { ResponseFooterDto } from '@/dtos/responseFooter.dto';
import dynamic from 'next/dynamic';
import { SettingsDto } from '@/dtos/Settings.dto';
import { LogoProps } from '@/config/type';
import LogoComponent from '@/components/atoms/logo';
const FooterContent = dynamic(
  () => import('@/components/organisms/footer/footerContent'),
  {
    ssr: false,
  },
);
const Footer = ({
  footerContent,
  settings,
}: {
  footerContent?: ResponseFooterDto;
  settings: SettingsDto[];
}) => {
  const setting = settings?.find(
    (item) => item.key === SETTING_KEY.GENERAL.FOOTER_COLOR.KEY,
  )?.value?.backgroundColor;
  return (
    <footer className={'relative z-[2] max-lg:pb-[68px]'}>
      <div
        style={{
          backgroundColor: setting || 'rgb(243 238 231/var(--tw-bg-opacity,1))',
        }}
        className={' px-3'}
      >
        <div className={'container mx-auto'}>
          <div
            className={
              'flex max-lg:flex-col justify-between w-full pt-[35px] max-lg:gap-y-3 pb-3'
            }
          >
            <FooterContent
              items={orderBy(footerContent?.footer || [], 'sort')}
            />
          </div>
          <div className={'w-full border-t border-t-[rgb(202_199_199)] pb-3'}>
            <div className={'container mx-auto '}>
              <div className={'grid grid-cols-1 lg:grid-cols-3 mt-3  '}>
                <LogoComponent
                  className={'object-contain w-[384px] h-[91px] max-lg:hidden'}
                  settings={settings}
                  position={LogoProps.FOOTER}
                />
                <div>
                  <p className={'uppercase font-[700] lg:font-bold mb-[10px]'}>
                    Kết nối với chúng tôi
                  </p>
                  <div className={'grid grid-cols-4 w-max gap-3'}>
                    {footerContent &&
                      footerContent[
                        STATIC_CONTENT_TYPE.FOOTER_LOGO_SOCIAL
                      ]?.map((item: StaticContentsDto, index: number) => {
                        const image = item?.images?.[0]?.image;
                        if (!image) return null;
                        return (
                          <div
                            key={index}
                            className={'w-[42px] h-[42px] overflow-hidden'}
                          >
                            <Link href={item?.title || ''} target={'_blank'}>
                              <Image
                                src={image.url || ''}
                                className={'object-contain w-full'}
                                width={image.width}
                                height={image.height}
                                alt={image?.alt || 'minhtuauthentic'}
                              />
                            </Link>
                          </div>
                        );
                      })}
                  </div>
                </div>
                <div>
                  <p className={'uppercase font-[700] lg:font-bold mb-[10px]'}>
                    Hình thức thanh toán
                  </p>
                  <div className={'grid grid-cols-6 w-max gap-3'}>
                    {footerContent &&
                      footerContent[
                        STATIC_CONTENT_TYPE.FOOTER_LOGO_PAYMENT
                      ]?.map((item: StaticContentsDto, index: number) => {
                        const image = item?.images?.[0]?.image;
                        if (!image) return null;
                        return (
                          <div
                            key={index}
                            className={'w-[42px] h-[42px] overflow-hidden'}
                          >
                            <Link href={item?.title || ''} target={'_blank'}>
                              <Image
                                src={image.url || ''}
                                className={'object-contain w-full'}
                                width={image.width}
                                height={image.height}
                                alt={image?.alt || 'minhtuauthentic'}
                              />
                            </Link>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={'bg-[#ededed] border border-t-[#333]'}>
        <div
          className={
            'container mx-auto flex max-lg:flex-col py-[14px] w-full justify-between items-center max-lg:px-3 max-lg:text-center'
          }
        >
          <p className={'py-2'}>
            Copyright ©2024 <b>MINH TU AUTHENTIC</b> . Phát triển bởi{' '}
            <b>
              <Link
                href={
                  'https://www.linkedin.com/in/hu%E1%BB%B3nh-anh-khoa-0b09971b7/'
                }
                target={'_blank'}
              >
                Khoa Huynh
              </Link>
            </b>
          </p>
          <div className={'flex items-center gap-3'}>
            <Link
              href={'http://online.gov.vn/Home/WebDetails/100324'}
              target={'_blank'}
            >
              <Image
                src={LogoBCT}
                height={57}
                width={188}
                className={'object-contain w-auto h-auto'}
                alt={
                  'Minh Tu Authentic, Nước hoa chính hãng Tphcm, Quận Tân Phú, Mỹ phẩm'
                }
              />
            </Link>
            <Link
              href={
                'https://www.dmca.com/Protection/Status.aspx?ID=095b6ac8-caa8-43b5-a6d2-4243cecf6d5e&refurl=https://minhtuauthentic.com/'
              }
              target={'_blank'}
            >
              <Image
                src={LogoGrn}
                height={54}
                width={118}
                className={'object-contain w-[118px] h-[27px]'}
                alt={
                  'Minh Tu Authentic, Nước hoa chính hãng Tphcm, Quận Tân Phú, Mỹ phẩm'
                }
              />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
