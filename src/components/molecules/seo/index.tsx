import { NextSeo } from 'next-seo';
import { SettingsDto } from '@/dtos/Settings.dto';
import { SETTING_KEY } from '@/config/enum';
import { SEOProps } from '@/config/type';
import { useRouter } from 'next/router';
import { shouldNoIndexRoute, shouldUseBaseCanonical } from '@/config/seo';

type Props = {
  settings: SettingsDto[];
  seo?: SEOProps;
};

export default function DefaultSeo({ settings, seo }: Props) {
  const router = useRouter();
  const setting = (settings || []).find(
    (item) => item.key === SETTING_KEY.GENERAL.PAGE_INFORMATION.KEY,
  );

  // Check if current route should be noindexed
  const shouldNoIndex = seo?.noIndex || shouldNoIndexRoute(router.pathname);

  // Check if current route should use base canonical URL
  const useBaseCanonical = shouldUseBaseCanonical(router.pathname);

  // Determine canonical URL
  const canonicalUrl =
    seo?.canonical ||
    (useBaseCanonical
      ? process.env.NEXT_PUBLIC_APP_URL
      : process.env.NEXT_PUBLIC_APP_URL + router.asPath);

  return (
    <NextSeo
      title={seo?.title || setting?.value?.page_title || 'Minh tu Authentic'}
      description={
        seo?.description ||
        setting?.value?.page_description ||
        'Minh Tu Authentic, Shop nước hoa chính hãng uy tín Tphcm, Quận tân phú, Tân bình, Bình tân, sản phẩm khuyến mãi, Nước hoa trả góp, nước hoa chiết nam, chiết nữ, nuớc hoa Niche, Dubai, cao cấp, mỹ phẩm chính hãng'
      }
      noindex={shouldNoIndex}
      additionalMetaTags={[
        {
          property: 'keywords',
          content:
            seo?.keyword ||
            setting?.value?.page_keyword ||
            'Shop nước hoa chính hãng Tphcm, Authentic, auth, Tân phú, trả góp',
        },
      ]}
      openGraph={{
        type: 'website',
        siteName: 'Minh tu Authentic',
        title: seo?.title || setting?.value?.page_title || 'Minh tu Authentic',
        description:
          seo?.description ||
          setting?.value?.page_description ||
          'Minh tu Authentic',
        images: [
          {
            url:
              seo?.image ||
              process.env.NEXT_PUBLIC_APP_URL +
                '/_next/static/media/logo.fc400164.png',
            width: seo?.width || 253,
            height: seo?.height || 83,
            alt: 'Minh tu Authentic',
          },
        ],
        url: process.env.NEXT_PUBLIC_APP_URL + router.asPath,
      }}
      canonical={canonicalUrl}
    />
  );
}
