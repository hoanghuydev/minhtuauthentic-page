import { ResponseHomePageDto } from '@/dtos/responseHomePage.dto';
import { SettingOptionDto } from '@/dtos/SettingOption.dto';
import { PageSetting } from '@/config/type';
import { SETTING_KEY } from '@/config/enum';

import BlockUnderSlide from '@/components/organisms/home/blockUnderSlide';
import Header from '@/components/organisms/header';
import Footer from '@/components/organisms/footer';
import HomeFlashSale from '@/components/organisms/home/homeFlashSale';
import Layout from '@/components/templates/Layout';
import HomeContent from '@/components/organisms/home/homeContent';
import HomeBanner from '@/components/organisms/home/homeBanner';
import HomeSupport from '@/components/organisms/home/homeSupport';

import Head from 'next/head';
import { ReactNode, useMemo } from 'react';

// Types
interface HomeProps extends PageSetting {
  homePage: ResponseHomePageDto;
  settingsHome: Record<string, SettingOptionDto | undefined>;
}

// Constants
const REVALIDATE_TIME = 300; // 5 minutes
const MAX_PRELOAD_BANNERS = 3;

// Schema data moved to separate function for better readability
const generateStoreSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Store',
  name: 'Minh Tu Authentic',
  image:
    'https://be.minhtuauthentic.com/public/Logo%20Thuong%20hieu/logo%20chinh%202070x540%2001.png',
  url: 'https://minhtuauthentic.com/',
  telephone: '0961693869',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '278 Hòa Bình, Q Tân Phú, TpHCM',
    addressLocality: 'TpHCM',
    addressRegion: 'Quận Tân Phú',
    postalCode: '72000',
    addressCountry: 'Viet Nam',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: '10.7726003',
    longitude: '106.6267201,17',
  },
  openingHoursSpecification: [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ].map((day) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: day,
    opens: '09:00',
    closes: '21:00',
  })),
  sameAs: [
    'https://www.facebook.com/minhtuauthentic/',
    'https://x.com/MinhTuAuthentic',
    'www.youtube.com/@MinhTuAuthentic',
    'https://www.reddit.com/user/minhtuauthentic/',
    'https://www.quora.com/profile/MinhTuAuthentic',
    'https://medium.com/@minhtuauthentic/minh-tú-authentic-chuyên-phân-phối-nước-hoa-chính-hãng-từ-các-thương-hiệu-uy-tín-toàn-cầu-404736b10787',
    'https://minhtuauthenticvn.blogspot.com/2025/05/minh-tu-authentic-chuyen-phan-phoi-nuoc.html',
    'https://www.linkedin.com/in/minh-tu-authentic-b56732364/',
  ],
});

// Utility function to extract banner images for preloading
const extractBannerImages = (banners: any[] = []) => {
  return banners
    .filter(
      (banner) =>
        banner?.is_mobile_visible &&
        (banner?.images?.length > 0 || banner?.images_mobile?.length > 0),
    )
    .slice(0, MAX_PRELOAD_BANNERS)
    .flatMap((banner) => {
      const images: string[] = [];

      // Add desktop image
      if (banner.images?.[0]?.image?.url) {
        images.push(banner.images[0].image.url);
      }

      // Add mobile image
      if (banner.images_mobile?.[0]?.image?.url) {
        images.push(banner.images_mobile[0].image.url);
      }

      return images;
    });
};

// Utility function to transform settings array to object
const transformSettingsToObject = (settings: any[] = []) => {
  return settings.reduce((acc, item) => {
    if (item?.key) {
      acc[item.key] = item?.value;
    }
    return acc;
  }, {} as Record<string, SettingOptionDto | undefined>);
};

// API fetch function
const fetchHomePageData = async () => {
  try {
    const response = await fetch(`${process.env.BE_URL}/api/pages/home`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: { data: ResponseHomePageDto } = await response.json();
    return data?.data || {};
  } catch (error) {
    console.error('Failed to fetch home page data:', error);
    return {};
  }
};

// Static Props
export async function getStaticProps() {
  const homePage = await fetchHomePageData();
  const settingsHome = transformSettingsToObject(homePage?.settings);

  return {
    props: {
      homePage,
      settingsHome,
    },
    revalidate: REVALIDATE_TIME,
  };
}

// Main Component
export default function Home({
  homePage,
  settingsHome,
  settings,
  menu,
  footerContent,
}: HomeProps) {
  // Memoized values to prevent unnecessary re-calculations
  const schema = useMemo(() => generateStoreSchema(), []);

  const bannerImages = useMemo(
    () => extractBannerImages(homePage?.banners),
    [homePage?.banners],
  );

  const hasFlashSale = Boolean(homePage?.homeFlashSale);
  const hasSupport = Boolean(homePage?.homeSupport?.length);

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />

        {/* Preload critical banner images */}
        {bannerImages.map((imageUrl, index) => (
          <link
            key={`preload-banner-${index}`}
            rel="preload"
            as="image"
            href={imageUrl}
            fetchPriority={index === 0 ? 'high' : 'low'}
          />
        ))}
      </Head>

      <Header settings={settings} menu={menu} />

      <HomeBanner
        setting={settingsHome[SETTING_KEY.BANNER_SECTION.KEY]}
        banners={homePage?.banners || []}
        menu={menu}
      />

      <Layout
        seo={homePage?.seo}
        settings={settings}
        menu={menu}
        className="overflow-hidden"
      >
        {/* Hidden H1 for SEO */}
        <h1 className="sr-only">{homePage?.seo?.title}</h1>

        <BlockUnderSlide contents={homePage?.homeBlockUnderSlide || []} />

        {/* Conditional Flash Sale Section */}
        {hasFlashSale && (
          <HomeFlashSale
            promotion={homePage.homeFlashSale}
            setting={settingsHome[SETTING_KEY.FLASH_SALE_SECTION.KEY]}
          />
        )}

        <HomeContent homePage={homePage} settingsHome={settingsHome} />
      </Layout>

      {/* Conditional Support Section */}
      {hasSupport && (
        <HomeSupport
          contents={homePage.homeSupport}
          setting={settingsHome[SETTING_KEY.SUPPORT_SECTION.KEY]}
        />
      )}

      <Footer settings={settings} footerContent={footerContent} />
    </>
  );
}
