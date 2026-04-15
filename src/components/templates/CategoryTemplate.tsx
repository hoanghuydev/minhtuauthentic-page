import ContentFilter from '@/components/organisms/categoryFilter/ContentFilter';
import { CategoryFilterProvider } from '@/contexts/categoryFilterContext';
import { ResponseSlugPageDto } from '@/dtos/responseSlugPage.dto';
import { ResponseCategoryFilterPageDto } from '@/dtos/responseCategoryFilterPage.dto';
import { SlugDto } from '@/dtos/Slug.dto';
import { generateSlugToHref } from '@/utils';
import BreadcrumbComponent from '@/components/molecules/breakcrumb';
import { Entity } from '@/config/enum';
import { ResponseMenuDto } from '@/dtos/responseMenu.dto';
import dynamic from 'next/dynamic';
import { useIsDesktop } from '@/hooks/useDevice';
import { useMemo } from 'react';
import Head from 'next/head';
import dayjs from 'dayjs';

const NavFilterMobile = dynamic(
  () => import('@/components/organisms/MobileMenu/navFilterMobile'),
  {
    ssr: false,
  },
);

const SettingFilter = dynamic(
  () => import('@/components/organisms/categoryFilter/settingFilter'),
  {
    ssr: false,
  },
);

type Props = {
  slug?: ResponseSlugPageDto<ResponseCategoryFilterPageDto>;
  menu?: ResponseMenuDto;
  breadcrumb?: {
    label: string;
    link: string;
  };
  isSearch?: boolean;
};

export default function CategoryTemplate({
  slug,
  breadcrumb,
  isSearch,
  menu,
}: Props) {
  const data = slug?.data as ResponseCategoryFilterPageDto;
  const isDesktop = useIsDesktop();
  const renderLabelBreadcrumb: Record<string, string> = {
    [Entity.CATEGORIES]: data?.title || 'Danh mục',
    [Entity.BRANDS]: data?.title || 'Thương hiệu',
    [Entity.KEYWORDS]: slug?.keyword?.value || 'Từ khóa',
  };
  const description =
    data?.category?.static_components?.[0]?.description ||
    data?.brand?.static_components?.[0]?.description ||
    data?.keyword?.static_components?.[0]?.description ||
    '';

  const categorySchema = useMemo(() => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
    const itemListElement = data?.products?.map((product, index) => {
      const defaultVariant = product?.variants?.find((v) => v.is_default);
      return {
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Product',
          name: product?.title,
          description: product?.title,
          image: product?.feature_image_detail?.image?.url,
          url: `${baseUrl}/${product?.slugs?.slug}`,
          offers: {
            '@type': 'Offer',
            priceCurrency: 'VND',
            price: defaultVariant?.regular_price,
            priceValidUntil: dayjs(product?.created_at)
              .add(1, 'year')
              .format('YYYY-MM-DD'),
            availability: 'http://schema.org/InStock',
            itemCondition: 'http://schema.org/NewCondition',
          },
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.7',
            reviewCount: '89',
          },
          review: [
            {
              '@type': 'Review',
              author: {
                '@type': 'Person',
                name: 'Nguyễn Văn A',
              },
              datePublished: '2025-06-10',
              reviewBody:
                'Hương thơm rất nam tính và bền lâu, rất hài lòng với sản phẩm.',
              reviewRating: {
                '@type': 'Rating',
                ratingValue: '5',
                bestRating: '5',
              },
            },
            {
              '@type': 'Review',
              author: {
                '@type': 'Person',
                name: 'Trần Thị B',
              },
              datePublished: '2025-05-20',
              reviewBody: 'Chất lượng tốt, giao hàng nhanh chóng.',
              reviewRating: {
                '@type': 'Rating',
                ratingValue: '4',
                bestRating: '5',
              },
            },
          ],
        },
      };
    });

    return {
      '@context': 'http://schema.org',
      '@type': 'ItemList',
      url: `${baseUrl}/${slug?.slug}`,
      numberOfItems: data?.products?.length || 0,
      itemListOrder: 'http://schema.org/ItemListOrderAscending',
      itemListElement: itemListElement,
    };
  }, [data?.products, slug?.slug]);
  return (
    <>
      <Head>
        <script type="application/ld+json">
          {JSON.stringify(categorySchema)}
        </script>
      </Head>
      <CategoryFilterProvider isSearch={isSearch}>
        <BreadcrumbComponent
          label={
            breadcrumb
              ? breadcrumb?.label || ''
              : renderLabelBreadcrumb[slug?.model || ''] || ('' as string)
          }
          link={generateSlugToHref(breadcrumb?.link || slug?.slug)}
        />
        <div className={'flex flex-col gap-3'}>
          <div className={'container mx-auto'}>
            <div
              className={
                'grid grid-cols-1 lg:grid-cols-6 gap-3 w-full min-h-[50vh] rounded-[10px] border-gray-500 bg-white shadow-custom'
              }
            >
              {isDesktop && (
                <SettingFilter
                  settings={data?.settings}
                  className={'lg:col-span-1'}
                  brands={menu?.brands}
                />
              )}
              <ContentFilter
                products={data?.products || []}
                settings={data?.settings}
                slugData={
                  new SlugDto({
                    model: slug?.model,
                    model_id: slug?.model_id,
                    slug: slug?.slug,
                  })
                }
                total={data?.total || 0}
                title={data?.title}
                category={data?.category}
                menu={menu}
              />
            </div>
          </div>
        </div>
        {description && (
          <div
            className={
              'w-full shadow-custom p-3 rounded-[10px] mt-3 bg-white container-html'
            }
            dangerouslySetInnerHTML={{
              __html: description || '',
            }}
          />
        )}

        <NavFilterMobile
          key={'CategoryTemplate'}
          settings={data?.settings}
          brands={menu?.brands}
        />
      </CategoryFilterProvider>
    </>
  );
}
