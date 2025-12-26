import Header from '@/components/organisms/header';
import Footer from '@/components/organisms/footer';
import ProductTemplate from '@/components/templates/ProductTemplate';
import { ResponseSlugPageDto } from '@/dtos/responseSlugPage.dto';
import { Entity, SETTING_KEY } from '@/config/enum';
import { ResponseProductDetailPageDto } from '@/dtos/responseProductDetailPage.dto';
import CategoryTemplate from '@/components/templates/CategoryTemplate';
import { ResponseCategoryFilterPageDto } from '@/dtos/responseCategoryFilterPage.dto';
import { ResponseNewsDetailPageDto } from '@/dtos/ResponseNewsDetailPage.dto';
import Layout from '@/components/templates/Layout';
import { PageSetting, ServerSideProps } from '@/config/type';
import { Fragment, useMemo } from 'react';
import NewsTemplate from '@/components/templates/NewsTemplate';
import { generateSlugToHref } from '@/utils';
import BreadcrumbComponent from '@/components/molecules/breakcrumb';
import { ResponseNewsPageDto } from '@/dtos/ResponseNewsPage.dto';
import NotFoundTemplate from '@/components/templates/NotFoundTemplate';
import HomeSupport from '@/components/organisms/home/homeSupport';
import { SettingOptionDto } from '@/dtos/SettingOption.dto';
import ResponseSendTransactionDto from '@/dtos/BaoKim/responseSendTransaction.dto';
import { StaticContentsDto } from '@/dtos/StaticContents.dto';
import StaticContentTemplate from '@/components/templates/StaticContentTemplate';
import { ResponseStaticContentDetailDto } from '@/dtos/responseStaticContentDetail.dto';

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
    return {
      redirect: {
        destination: '/not-found',
        permanent: false,
      },
    };
  }

  let keyword = undefined;

  // Build canonical URL with query parameters
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL + '/' + (slug as string[]).join('/');
  const queryParams = new URLSearchParams();

  // Preserve important query parameters for category/filter pages
  Object.keys(context.query).forEach((key) => {
    if (key !== 'slug' && context.query[key]) {
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

  if (
    data?.data?.model === Entity.PRODUCTS ||
    data?.data?.model === Entity.CATEGORIES ||
    data?.data?.model === Entity.BRANDS ||
    data?.data?.model === Entity.CATEGORY_NEWS ||
    data?.data?.model === Entity.NEWS ||
    data?.data?.model === Entity.KEYWORDS ||
    data?.data?.model === Entity.STATIC_CONTENTS_ENTITY ||
    data?.data?.model === Entity.PROMOTIONS
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
      case Entity.STATIC_CONTENTS_ENTITY:
        let staticContentResponse = (
          data?.data as ResponseSlugPageDto<ResponseStaticContentDetailDto>
        ).data;
        title = staticContentResponse?.title;
        break;
      case Entity.PROMOTIONS:
        let promotionResponse = (
          data?.data as ResponseSlugPageDto<ResponseCategoryFilterPageDto>
        ).data;
        title = promotionResponse?.title || 'Khuyến mãi';
        description = 'Danh sách sản phẩm khuyến mãi';
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
      keyword,
      canonical,
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
  canonical,
  settings,
  menu,
  footerContent,
  headerMarquee,
}: {
  slug: ResponseSlugPageDto<unknown>;
  title?: string | null;
  description?: string | null;
  image?: string;
  width?: number;
  height?: number;
  keyword?: string;
  canonical?: string;
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
      case Entity.PROMOTIONS:
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
              additions={[
                {
                  label: _news?.news?.categories_news?.name || '',
                  link: generateSlugToHref(
                    _news?.news?.categories_news?.slugs?.slug,
                  ),
                },
              ]}
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
      case Entity.STATIC_CONTENTS_ENTITY:
        return (
          <StaticContentTemplate
            data={slug as ResponseSlugPageDto<ResponseStaticContentDetailDto>}
          />
        );
      default:
        return <NotFoundTemplate />;
    }
  };

  const renderHomeSupport = useMemo(() => {
    if (slug?.model === Entity.PRODUCTS) {
      const product = slug?.data as ResponseProductDetailPageDto;
      const settingsHome: Record<string, SettingOptionDto | undefined> = {};

      (product?.settingsHome || []).forEach((item) => {
        if (item?.key) {
          settingsHome[item.key] = item.value;
        }
      });

      if (product?.homeSupport) {
        return (
          <HomeSupport
            contents={product.homeSupport}
            setting={settingsHome[SETTING_KEY.SUPPORT_SECTION.KEY]}
          />
        );
      }
    }

    return null;
  }, [slug]);

  return (
    <Fragment key={'Slug_' + slug?.slug}>
      <Header settings={settings} menu={menu} headerMarquee={headerMarquee} />
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
          canonical:
            canonical || process.env.NEXT_PUBLIC_APP_URL + '/' + slug?.slug,
        }}
      >
        {renderTemplate()}
      </Layout>
      {renderHomeSupport}
      <Footer settings={settings} footerContent={footerContent} />
    </Fragment>
  );
}
