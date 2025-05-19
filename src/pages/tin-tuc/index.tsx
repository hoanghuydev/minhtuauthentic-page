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
    process.env.BE_URL + `/api/pages/news?page=${page || 1}`,
    {},
  )
    .then((res) => res.json())
    .catch((err) => null);
  return {
    props: {
      news: rsNews?.data,
    },
  };
};

export default function News({
  menu,
  footerContent,
  news,
  settings,
}: {
  news: ResponseNewsPageDto;
} & PageSetting) {
  const isMobile = useIsMobile();
  return (
    <>
      <Header settings={settings} menu={menu} />
      <Layout settings={settings} menu={menu}>
        <BreadcrumbComponent label={'Tin tức'} link={'/tin-tuc'} />
        <NewsTemplate
          news={news?.news || []}
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
