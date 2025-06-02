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
  return (
    <>
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
