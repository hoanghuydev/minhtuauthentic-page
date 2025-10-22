import { STATIC_CONTENT_TYPE } from '@/config/enum';
import { ResponseMenuDto } from '@/dtos/responseMenu.dto';
import _ from 'lodash';
import dynamic from 'next/dynamic';
import { ResponseStaticContentDetailDto } from '@/dtos/responseStaticContentDetail.dto';
import { ResponseSlugPageDto } from '@/dtos/responseSlugPage.dto';
import FeaturedProductsCategoryTemplate from './FeaturedProductsCategoryTemplate';


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
const StaticContentTemplate = ({ data, menu, breadcrumb, isSearch }: Props) => {
  const renderContent = () => {
    switch(data?.data?.type) {
      case STATIC_CONTENT_TYPE.FEATURED_PRODUCTS_CATEGORY:
        return <FeaturedProductsCategoryTemplate data={data} menu={menu} breadcrumb={breadcrumb} isSearch={isSearch} />
    }
  }

  return (
    <>
      {renderContent()}
    </>
  )
};
export default StaticContentTemplate;
