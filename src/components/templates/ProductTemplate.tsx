import { ResponseProductDetailPageDto } from '@/dtos/responseProductDetailPage.dto';
import ProductDetailCard from '@/components/organisms/product/detailCard';
import BreadcrumbComponent from '@/components/molecules/breakcrumb';
import { generateSlugToHref } from '@/utils';
import { ResponseSlugPageDto } from '@/dtos/responseSlugPage.dto';
import dynamic from 'next/dynamic';
import Script from 'next/script';
import { ProductDetailProvider } from '@/contexts/productDetailContext';
const CustomScript = dynamic(() => import('@/components/atoms/customScript'), {
  ssr: false,
});

const ProductTemplate = ({
  data,
}: ResponseSlugPageDto<ResponseProductDetailPageDto>) => {
  return (
    <ProductDetailProvider>
      <BreadcrumbComponent
        label={data?.product?.categories?.[0]?.category?.name || 'Sản phẩm'}
        link={
          data?.product?.categories?.[0]?.category?.slugs?.slug || '/san-pham'
        }
        current={{
          label: data?.product?.title || data?.product?.name || '',
          link: generateSlugToHref(data?.product?.slugs?.slug),
        }}
        className={'breakcrumb-no-wrap'}
      />
      {data?.product && (
        <ProductDetailCard
          product={data?.product}
          relatedProducts={data?.relatedProducts || []}
          productConfigurations={data?.productConfigurations || []}
          settings={data?.settings || []}
        />
      )}
      <CustomScript isHaveFudiin={true} />
    </ProductDetailProvider>
  );
};
export default ProductTemplate;
