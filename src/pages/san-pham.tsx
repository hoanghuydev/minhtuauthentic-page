import Header from '@/components/organisms/header';
import Footer from '@/components/organisms/footer';
import CategoryTemplate from '@/components/templates/CategoryTemplate';
import { ResponseSlugPageDto } from '@/dtos/responseSlugPage.dto';
import { ResponseCategoryFilterPageDto } from '@/dtos/responseCategoryFilterPage.dto';
import getDefaultSeverSide from '@/utils/getDefaultServerSide';

import Layout from '@/components/templates/Layout';
import { PageSetting } from '@/config/type';
import { useRouter } from 'next/router';
export const getServerSideProps = async (context: any) => {
  const [productRes, defaultData] = await Promise.all([
    fetch(
      process.env.BE_URL +
        '/api/pages/products/filter' +
        '?' +
        new URLSearchParams(context.query as any).toString(),
    ).catch((error) => {
      return null;
    }),
    getDefaultSeverSide(),
  ]);

  const data: { data: ResponseSlugPageDto<unknown> } = productRes
    ? await productRes.json()
    : null;

  // Build canonical URL with query parameters
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL + '/san-pham';
  const queryParams = new URLSearchParams();

  // Preserve important query parameters for product search/filter pages
  Object.keys(context.query).forEach((key) => {
    if (context.query[key]) {
      // Only include meaningful query parameters (not empty strings)
      if (typeof context.query[key] === 'string' && context.query[key].trim()) {
        queryParams.set(key, context.query[key]);
      } else if (Array.isArray(context.query[key])) {
        queryParams.set(key, context.query[key].join(','));
      }
    }
  });

  const canonical =
    baseUrl + (queryParams.toString() ? '?' + queryParams.toString() : '');

  return {
    props: {
      slug: data,
      canonical,
      ...defaultData,
    },
  };
};
export default function ProductPage({
  slug,
  settings,
  menu,
  footerContent,
  headerMarquee,
  canonical,
}: {
  slug: ResponseSlugPageDto<ResponseCategoryFilterPageDto>;
  headerMarquee?: any[];
  canonical: string;
} & PageSetting) {
  const router = useRouter();
  return (
    <>
      <Header settings={settings} menu={menu} headerMarquee={headerMarquee} />
      <Layout
        settings={settings}
        menu={menu}
        seo={{
          canonical,
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
