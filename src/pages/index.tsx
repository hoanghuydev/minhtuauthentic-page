import { ResponseHomePageDto } from '@/dtos/responseHomePage.dto';
import BlockUnderSlide from '@/components/organisms/home/blockUnderSlide';
import { SETTING_KEY } from '@/config/enum';
import Header from '@/components/organisms/header';
import Footer from '@/components/organisms/footer';
import { SettingOptionDto } from '@/dtos/SettingOption.dto';
import HomeFlashSale from '@/components/organisms/home/homeFlashSale';
import Layout from '@/components/templates/Layout';
import { ReactNode } from 'react';
import { PageSetting } from '@/config/type';
import HomeContent from '@/components/organisms/home/homeContent';
import HomeBanner from '@/components/organisms/home/homeBanner';
import Head from 'next/head';

export async function getStaticProps() {
  const res = await fetch(process.env.BE_URL + '/api/pages/home').catch(
    (error) => {
      return null;
    },
  );

  const data: { data: ResponseHomePageDto } = res ? await res.json() : null;
  const settingsHome: Record<string, SettingOptionDto | undefined> = {};
  (data?.data?.settings || [])?.map((item) => {
    settingsHome[item?.key || ''] = item?.value;
  });
  return {
    props: {
      homePage: data?.data || {},
      settingsHome,
    },
    revalidate: 300,
  };
}

export default function Home({
  homePage,
  settingsHome,
  settings,
  menu,
  footerContent,
}: {
  homePage: ResponseHomePageDto;
  settingsHome: Record<string, SettingOptionDto | undefined>;
} & PageSetting) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Store",
    "name": "Minh Tu Authentic",
    "image": "https://be.minhtuauthentic.com/public/Logo%20Thuong%20hieu/logo%20chinh%202070x540%2001.png",
    "url": "https://minhtuauthentic.com/",
    "telephone": "0961693869 ",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "278 Hòa Bình, Q Tân Phú, TpHCM",
      "addressLocality": "TpHCM",
      "addressRegion": "Quận Tân Phú",
      "postalCode": "72000",
      "addressCountry": "Viet Nam"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "10.7726003",
      "longitude": "106.6267201,17"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Monday",
        "opens": "09:00",
        "closes": "21:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Tuesday",
        "opens": "09:00",
        "closes": "21:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Wednesday",
        "opens": "09:00",
        "closes": "21:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Thursday",
        "opens": "09:00",
        "closes": "21:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Friday",
        "opens": "09:00",
        "closes": "21:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "09:00",
        "closes": "21:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Sunday",
        "opens": "09:00",
        "closes": "21:00"
      }
    ],
    "sameAs": [
      "https://www.facebook.com/minhtuauthentic/",
      "https://x.com/MinhTuAuthentic",
      "www.youtube.com/@MinhTuAuthentic",
      "https://www.reddit.com/user/minhtuauthentic/",
      "https://www.quora.com/profile/MinhTuAuthentic",
      "https://medium.com/@minhtuauthentic/minh-tú-authentic-chuyên-phân-phối-nước-hoa-chính-hãng-từ-các-thương-hiệu-uy-tín-toàn-cầu-404736b10787",
      "https://minhtuauthenticvn.blogspot.com/2025/05/minh-tu-authentic-chuyen-phan-phoi-nuoc.html"
      ,
      "https://www.linkedin.com/in/minh-tu-authentic-b56732364/"
    ]
  }

  return (
    <>
      <Head>
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      </Head>
      <Header settings={settings} menu={menu} />
      <HomeBanner
        setting={settingsHome[SETTING_KEY.BANNER_SECTION.KEY]}
        banners={homePage?.banners || []}
        bannersFullWidth={homePage?.bannersFullWidth || []}
        menu={menu}
      />
      <Layout
        seo={homePage?.seo}
        settings={settings}
        menu={menu}
        className={'overflow-hidden'}
      >
        <h1 className={'hidden'}>{homePage?.seo?.title}</h1>
        <BlockUnderSlide contents={homePage?.homeBlockUnderSlide || []} />
        {homePage?.homeFlashSale &&
          ((
            <HomeFlashSale
              promotion={homePage?.homeFlashSale}
              setting={settingsHome[SETTING_KEY.FLASH_SALE_SECTION.KEY]}
            />
          ) as ReactNode)}

        <HomeContent homePage={homePage} settingsHome={settingsHome} />
      </Layout>
      <Footer settings={settings} footerContent={footerContent} />
    </>
  );
}
