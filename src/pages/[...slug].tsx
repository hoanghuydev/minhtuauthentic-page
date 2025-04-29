import Header from '@/components/organisms/header';
import Footer from '@/components/organisms/footer';
import ProductTemplate from '@/components/templates/ProductTemplate';
import { ResponseSlugPageDto } from '@/dtos/responseSlugPage.dto';
import { Entity } from '@/config/enum';
import { ResponseProductDetailPageDto } from '@/dtos/responseProductDetailPage.dto';
import CategoryTemplate from '@/components/templates/CategoryTemplate';
import { ResponseCategoryFilterPageDto } from '@/dtos/responseCategoryFilterPage.dto';
import { ResponseNewsDetailPageDto } from '@/dtos/ResponseNewsDetailPage.dto';
import Layout from '@/components/templates/Layout';
import { PageSetting, ServerSideProps } from '@/config/type';
import { redirect } from 'next/navigation';
import { Fragment } from 'react';
import NewsTemplate from '@/components/templates/NewsTemplate';
import { generateSlugToHref } from '@/utils';
import BreadcrumbComponent from '@/components/molecules/breakcrumb';
import { ResponseNewsPageDto } from '@/dtos/ResponseNewsPage.dto';

export const getServerSideProps = async (context: any) => {
  const { slug } = context.query;
  let title = undefined,
    description = undefined,
    image = null,
    width = 0,
    height = 0;
  const res = await fetch(
    process.env.BE_URL +
      '/api/pages/slug/' +
      (slug as string[]).join('/') +
      '?' +
      new URLSearchParams(context.query as any).toString(),
  ).catch((error) => {
    console.error('Error:', error);
  });

  const data: { data: ResponseSlugPageDto<unknown> } = res
    ? await res.json()
    : null;
  if (!data) {
    redirect('not-found');
  }

  let keyword = undefined;

  if (
    data?.data?.model === Entity.PRODUCTS ||
    data?.data?.model === Entity.CATEGORIES ||
    data?.data?.model === Entity.BRANDS ||
    data?.data?.model === Entity.CATEGORY_NEWS ||
    data?.data?.model === Entity.NEWS ||
    data?.data?.model === Entity.KEYWORDS
  ) {
    switch (data?.data?.model) {
      case Entity.PRODUCTS:
        let product =
          data?.data as ResponseSlugPageDto<ResponseProductDetailPageDto>;
        title =
          product?.data?.product?.seo?.title || product?.data?.product?.name;
        image =
          product?.data?.product?.feature_image_detail?.image?.url || null;
        width = product?.data?.product?.feature_image_detail?.image?.width || 0;
        height =
          product?.data?.product?.feature_image_detail?.image?.height || 0;
        description = product?.data?.product?.seo?.description;
        keyword = product?.data?.product?.seo?.keyword;
        break;
      case Entity.NEWS:
        let news = data?.data as ResponseSlugPageDto<ResponseNewsDetailPageDto>;
        title = news?.data?.news?.seo?.title || news?.data?.news?.name;
        description =
          news?.data?.news?.seo?.description || news?.data?.news?.description;
        image = news?.data?.news?.images?.[0]?.image?.url || null;
        width = news?.data?.news?.images?.[0]?.image?.width || 0;
        height = news?.data?.news?.images?.[0]?.image?.height || 0;
        keyword = news?.data?.news?.seo?.keyword;
        break;
      case Entity.CATEGORY_NEWS:
        let newsCategory =
          data?.data as ResponseSlugPageDto<ResponseNewsPageDto>;
        title =
          newsCategory?.data?.categoryNews?.seo?.title ||
          newsCategory?.data?.categoryNews?.name ||
          null;
        keyword = newsCategory?.data?.categoryNews?.seo?.keyword;
        description =
          newsCategory?.data?.categoryNews?.seo?.description ||
          newsCategory?.data?.categoryNews?.name;
        break;
      case Entity.CATEGORIES:
        let category = (
          data?.data as ResponseSlugPageDto<ResponseCategoryFilterPageDto>
        ).data?.category;
        title = category?.seo?.title || category?.name;
        description = category?.seo?.description;
        keyword = category?.seo?.keyword;
        break;
      case Entity.BRANDS:
        let brand = (
          data?.data as ResponseSlugPageDto<ResponseCategoryFilterPageDto>
        ).data?.brand;
        title = brand?.seo?.title || brand?.name;
        description = brand?.seo?.description;
        keyword = brand?.seo?.keyword;
        break;
      case Entity.KEYWORDS:
        let keywordEntity = (
          data?.data as ResponseSlugPageDto<ResponseCategoryFilterPageDto>
        ).data?.keyword;
        title = keywordEntity?.seo?.title || keywordEntity?.value;
        description = keywordEntity?.seo?.description;
        keyword = keywordEntity?.seo?.keyword;
        break;
    }
    context.res.setHeader(
      'Cache-Control',
      'public, s-maxage=10, stale-while-revalidate=59',
    );
  }

  return {
    props: {
      slug: data?.data,
      title: title || null,
      description: description || null,
      width,
      height,
      image,
    },
  };
};

export default function Page({
  slug,
  title,
  description,
  image,
  width,
  height,
  keyword,
  settings,
  menu,
  footerContent,
}: {
  slug: ResponseSlugPageDto<unknown>;
  title?: string | null;
  description?: string | null;
  image?: string;
  width?: number;
  height?: number;
  keyword?: string;
} & ServerSideProps &
  PageSetting) {
  const renderTemplate = () => {
    switch (slug?.model) {
      case Entity.VARIANTS:
      case Entity.PRODUCTS:
        return (
          <ProductTemplate data={slug?.data as ResponseProductDetailPageDto} />
        );
      case Entity.CATEGORIES:
      case Entity.BRANDS:
      case Entity.KEYWORDS:
        return (
          <CategoryTemplate
            slug={slug as ResponseSlugPageDto<ResponseCategoryFilterPageDto>}
            menu={menu}
          />
        );
      case Entity.CATEGORY_NEWS:
        const _newsCategory = slug?.data as ResponseNewsPageDto;
        return (
          <>
            <BreadcrumbComponent
              label={'Tin tức'}
              link={'/tin-tuc'}
              current={{
                label: _newsCategory?.categoryNews?.name || '',
                link: generateSlugToHref(slug.slug),
              }}
            />
            <NewsTemplate
              key={slug.slug}
              news={_newsCategory?.news || []}
              categoryNews={_newsCategory?.otherCategoryNews || []}
              newest={_newsCategory?.newest}
              total={_newsCategory?.total}
              title={_newsCategory?.categoryNews?.name}
            />
          </>
        );

      case Entity.NEWS:
        const _news = slug?.data as ResponseNewsDetailPageDto;

        return (
          <>
            <BreadcrumbComponent
              label={'Tin tức'}
              link={'/tin-tuc'}
              current={{
                label: _news?.news?.name || '',
                link: generateSlugToHref(slug.slug),
              }}
            />
            <NewsTemplate
              key={slug.slug}
              news={_news?.news || []}
              categoryNews={_news?.categoryNews || []}
              newest={_news?.newest}
              relationNews={_news?.relationNews}
              isDetail={true}
            />
          </>
        );
      default:
        return <div>Not Found</div>;
    }
  };

  return (
    <Fragment key={'Slug_' + slug?.slug}>
      <Header settings={settings} menu={menu} />
      <Layout
        settings={settings}
        menu={menu}
        seo={{
          title,
          description,
          image,
          width,
          height,
          keyword,
          canonical: process.env.NEXT_PUBLIC_APP_URL + '/' + slug?.slug,
        }}
      >
        {renderTemplate()}
      </Layout>
      <Footer settings={settings} footerContent={footerContent} />
    </Fragment>
  );
}
