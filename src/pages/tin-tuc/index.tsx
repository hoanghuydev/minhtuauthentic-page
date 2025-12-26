import Header from '@/components/organisms/header';
import Footer from '@/components/organisms/footer';
import NewsTemplate from '@/components/templates/NewsTemplate';
import { ResponseNewsPageDto } from '@/dtos/ResponseNewsPage.dto';
import BreadcrumbComponent from '@/components/molecules/breakcrumb';
import Layout from '@/components/templates/Layout';
import { PageSetting } from '@/config/type';
import dynamic from 'next/dynamic';
import { useIsMobile } from '@/hooks/useDevice';
const NewsCategoryMobile = dynamic(
  () => import('@/components/organisms/news/categoryMobile'),
  {
    ssr: false,
  },
);

export const getServerSideProps = async (context: any) => {
  const page = context.query.page;
  const rsNews: { data: ResponseNewsPageDto } = await fetch(
    process.env.BE_URL + `/api/pages/news?page=${page || 1}&limit=12`,
    {},
  )
    .then((res) => res.json())
    .catch((err) => null);
  const canonical = process.env.NEXT_PUBLIC_APP_URL + '/tin-tuc';
  return {
    props: {
      news: rsNews?.data,
      canonical,
    },
  };
};

export default function News({
  menu,
  footerContent,
  news,
  settings,
  canonical,
}: {
  news: ResponseNewsPageDto;
  canonical: string;
} & PageSetting) {
  const isMobile = useIsMobile();
  return (
    <>
      <Header settings={settings} menu={menu} />
      <Layout
        settings={settings}
        menu={menu}
        seo={{
          canonical,
        }}
      >
        <BreadcrumbComponent
          label={'Tin tức'}
          link={'/tin-tuc'}
          className="overflow-auto"
        />
        <NewsTemplate
          news={news?.news || []}
          highlightedNews={news?.highlightedNews}
          categoryNews={news?.otherCategoryNews || []}
          newest={news.newest || []}
          total={news.total}
          isDetail={false}
        />
      </Layout>
      <Footer settings={settings} footerContent={footerContent} />
    </>
  );
}
