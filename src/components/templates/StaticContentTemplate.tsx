import { STATIC_CONTENT_TYPE } from '@/config/enum';
import { StaticContentsDto } from '@/dtos/StaticContents.dto';
import { twMerge } from 'tailwind-merge';
import BreadcrumbComponent from '../molecules/breakcrumb';
import { ResponseMenuDto } from '@/dtos/responseMenu.dto';
import { generateSlugToHref } from '@/utils';
import { useIsDesktop } from '@/hooks/useDevice';
import ProductCard from '../organisms/product/card';
import _ from 'lodash';
import { Button } from 'antd/es';
import Filter from '@/components/icons/filter';
import SortBy from '../organisms/categoryFilter/ContentFilter/sortBy';
import PageLimit from '../organisms/categoryFilter/ContentFilter/pageLimit';
import CategoryFilterContext, { CategoryFilterProvider } from '@/contexts/categoryFilterContext';
import { useContext } from 'react';
import dynamic from 'next/dynamic';
import FeaturedProductsFilter from '../organisms/customFilter/featuredProductsFilter';
import { SlugDto } from '@/dtos/Slug.dto';
import { ResponseStaticContentDetailDto } from '@/dtos/responseStaticContentDetail.dto';


const SettingFilter = dynamic(
  () => import('@/components/organisms/categoryFilter/settingFilter'),
  {
    ssr: false,
  },
);


type Props = {
  data: ResponseStaticContentDetailDto;
  menu?: ResponseMenuDto;
  breadcrumb?: {
    label: string;
    link: string;
  };
  isSearch?: boolean;
};
const StaticContentTemplate = ({ data, menu, breadcrumb, isSearch }: Props) => {
  const isDesktop = useIsDesktop();
  const ctx = useContext(CategoryFilterContext);
  const renderContent = () => {
    switch(data.staticContent?.type) {
      case STATIC_CONTENT_TYPE.FEATURED_PRODUCTS_CATEGORY:
    }
  }

  return (
    <>
      <CategoryFilterProvider isSearch={true}>
        <BreadcrumbComponent
          label={
            breadcrumb
              ? breadcrumb?.label || ''
              : data.title || ''
          }
          link={generateSlugToHref(breadcrumb?.link || data.staticContent?.slugs?.slug)}
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
                  settings={data.settings}
                  className={'lg:col-span-1'}
                  brands={menu?.brands}
                />
              )}
              <FeaturedProductsFilter 
                variants={data.staticContent?.properties?.variants || []} 
                title={data.staticContent?.title}
                slugData={new SlugDto(
                  new SlugDto({
                    model: data.staticContent?.slugs?.model,
                    model_id: data.staticContent?.slugs?.model_id,
                    slug: data.staticContent?.slugs?.slug,
                  })
                )}
                total={data.total || 0}
              />
            </div>
          </div>
        </div>
      </CategoryFilterProvider>
    </>
  )

  // return (
  //   <div
  //     className={twMerge(
  //       'w-full max-rounded-[10px] shadow-custom bg-white overflow-hidden relative mx-auto rounded-[10px] p-3',
  //     )}
  //   >
  //     <h1 className={'text-primary font-[700] lg:font-bold text-2xl mb-3'}>
  //       {staticContent?.title}
  //     </h1>
  //     <div
  //       className={'mt-6'}
  //       dangerouslySetInnerHTML={{ __html: staticContent?.content || '' }}
  //     />
  //   </div>
  // );
};
export default StaticContentTemplate;
