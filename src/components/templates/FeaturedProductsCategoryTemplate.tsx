import BreadcrumbComponent from '../molecules/breakcrumb';
import { ResponseMenuDto } from '@/dtos/responseMenu.dto';
import { generateSlugToHref } from '@/utils';
import { useIsDesktop } from '@/hooks/useDevice';
import _ from 'lodash';
import { CategoryFilterProvider } from '@/contexts/categoryFilterContext';
import dynamic from 'next/dynamic';
import FeaturedProductsFilter from '../organisms/customFilter/featuredProductsFilter';
import { SlugDto } from '@/dtos/Slug.dto';
import { ResponseStaticContentDetailDto } from '@/dtos/responseStaticContentDetail.dto';
import { ResponseSlugPageDto } from '@/dtos/responseSlugPage.dto';


const SettingFilter = dynamic(
  () => import('@/components/organisms/categoryFilter/settingFilter'),
  {
    ssr: false,
  },
);


type Props = {
  data: ResponseSlugPageDto<ResponseStaticContentDetailDto>;
  menu?: ResponseMenuDto;
  breadcrumb?: {
    label: string;
    link: string;
  };
  isSearch?: boolean;
};
const FeaturedProductsCategoryTemplate = ({ data, menu, breadcrumb, isSearch }: Props) => {
  const isDesktop = useIsDesktop();

  return (
    <>
      <CategoryFilterProvider isSearch={isSearch}>
        <BreadcrumbComponent
          label={
            breadcrumb
              ? breadcrumb?.label || ''
              : data.data?.title || ''
          }
          link={generateSlugToHref(breadcrumb?.link || data.slug)}
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
                  settings={data.data?.settings}
                  className={'lg:col-span-1'}
                  brands={menu?.brands}
                />
              )}
              <FeaturedProductsFilter 
                variants={data.data?.products || []} 
                title={data.data?.title}
                slugData={new SlugDto(
                  new SlugDto({
                    model: data.model,
                    model_id: data?.model_id,
                    slug: data?.slug,
                  })
                )}
                total={data.data?.total || 0}
              />
            </div>
          </div>
        </div>
      </CategoryFilterProvider>
    </>
  )
};
export default FeaturedProductsCategoryTemplate;
