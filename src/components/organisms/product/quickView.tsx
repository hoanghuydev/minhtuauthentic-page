import { ProductDto } from '@/dtos/Product.dto';
import { ProductConfigurationsDto } from '@/dtos/productConfigurations.dto';
import { ImageDto } from '@/dtos/Image.dto';
import { SettingsDto } from '@/dtos/Settings.dto';
import { twMerge } from 'tailwind-merge';
import ImageWithFallback from '@/components/atoms/images/ImageWithFallback';
import { useIsMobile } from '@/hooks/useDevice';
import { useContext, useEffect } from 'react';
import ProductDetailContext from '@/contexts/productDetailContext';
import ProductPropertyQuickView from '@/components/molecules/product/property/quickView';

type Props = {
  product: ProductDto;
  productConfigurations?: ProductConfigurationsDto[];
  isShouldSetProductActive?: boolean;
  setQuickViewModal?: (isOpen: boolean) => void;
};
export default function ProductQuickView({
  product,
  productConfigurations,
  isShouldSetProductActive,
  setQuickViewModal,
}: Props) {
  const isMobile = useIsMobile();
  const productContext = useContext(ProductDetailContext);

  useEffect(() => {
    if (isShouldSetProductActive) {
      productContext?.setVariantActive &&
      productContext.setVariantActive(
        (product?.variants || [])?.find((item) => item.is_default) ||
        product?.variants?.[0],
      );
    }
  }, []);

  return (
    <div
      className={
        'p-3 grid grid-cols-1 sm:grid-cols-2 rounded-[10px] mt-3 bg-white gap-3 relative'
      }
    >
      <ImageWithFallback
        image={product?.feature_image_detail?.image as ImageDto}
        className={twMerge(
          'object-contain cursor-pointer bk-product-image select-none w-full m-auto',
        )}
        product={product}
        unoptimized={!isMobile}
        quality={100}
      />
      <ProductPropertyQuickView
        product={product}
        productConfigurations={productConfigurations || []}
        setQuickViewModal={setQuickViewModal}
      />
    </div>
  );
}
