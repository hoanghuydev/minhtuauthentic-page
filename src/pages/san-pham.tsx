import Header from '@/components/organisms/header';
import Footer from '@/components/organisms/footer';
import CategoryTemplate from '@/components/templates/CategoryTemplate';
import { ResponseSlugPageDto } from '@/dtos/responseSlugPage.dto';
import { ResponseCategoryFilterPageDto } from '@/dtos/responseCategoryFilterPage.dto';

import Layout from '@/components/templates/Layout';
import { PageSetting } from '@/config/type';
import { useRouter } from 'next/router';
export const getServerSideProps = async (context: any) => {
  const res = await fetch(
    process.env.BE_URL +
      '/api/pages/products/filter' +
      '?' +
      new URLSearchParams(context.query as any).toString(),
  ).catch((error) => {
    return null;
  });
  const data: { data: ResponseSlugPageDto<unknown> } = res
    ? await res.json()
    : null;
  return {
    props: {
      slug: data,
    },
  };
};
export default function ProductPage({
  slug,
  settings,
  menu,
  footerContent,
}: {
  slug: ResponseSlugPageDto<ResponseCategoryFilterPageDto>;
} & PageSetting) {
  const router = useRouter();
  return (
    <>
      <Header settings={settings} menu={menu} />
      <Layout
        settings={settings}
        menu={menu}
        seo={{
          canonical:
            process.env.NEXT_PUBLIC_APP_URL +
            '/san-pham/?search=' +
            router.query.search,
        }}
      >
        <CategoryTemplate
          menu={menu}
          slug={slug as ResponseSlugPageDto<ResponseCategoryFilterPageDto>}
          breadcrumb={{
            label: 'Sản phẩm',
            link: '/san-pham',
          }}
          isSearch={true}
        />
      </Layout>
      <Footer settings={settings} footerContent={footerContent} />
    </>
  );
}
