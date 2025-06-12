import dynamic from 'next/dynamic';
import { ProductDto } from '@/dtos/Product.dto';
import { ReactNode } from 'react';
import ProductCard from '@/components/organisms/product/card';
import SectionSwiper from '@/components/organisms/sectionSwiper';
import ProductList from '@/components/molecules/product/list';
import { useIsDesktop } from '@/hooks/useDevice';
import { useIsMobile } from '@/hooks/useDevice';

const ProductRelation = dynamic(
  () => import('@/components/molecules/product/productRelation'),
  {
    ssr: false,
  },
);
type Props = {
  display?: 'mobile' | 'desktop';
  products: ProductDto[];
};
export default function ProductRelationWrapper({ display, products }: Props) {
  const isMobile = useIsMobile();
  const isDesktop = useIsDesktop();
  console.log('products', products);
  return (
    <>
      {display === 'mobile' && (
        <>
          {isMobile && (
            <>
              <ProductList products={products} title="Sản phẩm liên quan" />
            </>
          )}
        </>
      )}
      {display === 'desktop' && (
        <>{isDesktop && <ProductRelation products={products} />}</>
      )}
    </>
  );
}
