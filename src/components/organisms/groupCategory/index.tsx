import ProductCard from '../product/card';
import { TagLink } from '@/components/molecules/tagLink';
import { StaticComponentDto } from '@/dtos/StaticComponent.dto';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { TagLinkDto } from '@/dtos/tagLink.dto';
import { generateSlugToHref } from '@/utils';
import Link from 'next/link';
import { IProductCategoryDto } from '@/dtos/IProductCategory.dto';
import dynamic from 'next/dynamic';
import SectionSwiperItem from '@/components/organisms/sectionSwiper/item';
const TagLinkMobileView = dynamic(
  () => import('@/components/organisms/groupCategory/TagLinkMobileView'),
  {
    ssr: false,
  },
);
const GroupCategory = ({
  staticComponent,
}: {
  staticComponent: StaticComponentDto;
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const refContainer = useRef<HTMLDivElement | null>(null);
  const [tagLinks, setTagLinks] = useState<TagLinkDto[]>(
    staticComponent?.properties?.tagLink || [],
  );
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    setIsReady(true);
  }, []);

  useEffect(() => {}, [isReady]);

  return (
    <div
      className={'mt-3 mx-auto p-1 lg:p-3 rounded-[10px]'}
      style={{ backgroundColor: staticComponent?.properties?.backgroundColor }}
    >
      <div
        className={
          'flex flex-col lg:flex-row justify-between mb-3 gap-2 items-center'
        }
      >
        <div
          style={{ color: staticComponent?.properties?.textColor }}
          className={
            'w-max shrink-0 max-lg:items-center max-lg:flex max-lg:justify-between max-lg:w-full max-lg:mt-3'
          }
        >
          <h2 style={{ color: staticComponent?.properties?.textColor }}>
            <Link
              className={
                'text-[18px] lg:text-[22px] uppercase font-[700] lg:font-bold '
              }
              href={generateSlugToHref(staticComponent?.category?.slugs?.slug)}
            >
              {staticComponent?.title || staticComponent?.category?.name}
            </Link>
          </h2>
          <TagLinkMobileView
            slug={staticComponent?.category?.slugs?.slug || ''}
          />
        </div>
        <div
          className={'flex justify-end gap-3 w-full lg:basis-[60%] lg:w-[70%] '}
        >
          {tagLinks.length > 0 && (
            <div ref={ref} className={'w-full overflow-x-scroll '}>
              <div
                ref={refContainer}
                className={'flex gap-3 pb-2 justify-end w-max min-w-full'}
              >
                {tagLinks.map((tagLink, key: number) => {
                  return (
                    <TagLink
                      key={key}
                      tagLinks={tagLink}
                      className={'last:mr-0 whitespace-nowrap'}
                    />
                  );
                })}
              </div>
            </div>
          )}
          <TagLink
            className={'w-max max-lg:hidden shrink-0 h-[30px]'}
            tagLinks={
              new TagLinkDto({
                id: 0,
                name: 'Xem tất cả',
                slug: generateSlugToHref(
                  staticComponent?.category?.slugs?.slug,
                ),
              })
            }
          />
        </div>
      </div>
      <SectionSwiperItem
        isGrid={true}
        slidesPerView={5}
        slidePerViewMobile={2}
        spaceBetween={5}
        isUseHeightWrapper={true}
        renderItem={(item: unknown) => {
          const iProduct = item as IProductCategoryDto;
          const variant = iProduct?.product?.variants?.[0];
          if (!variant) {
            return (<></>) as ReactNode;
          }
          return (iProduct.product && (
            <ProductCard
              product={iProduct.product}
              variant={variant}
              isShowListVariant={true}
            />
          )) as ReactNode;
        }}
        data={
          (staticComponent?.category?.products || [])?.filter(
            (item: IProductCategoryDto) => item.product,
          ) || []
        }
      />
    </div>
  );
};
export default GroupCategory;
