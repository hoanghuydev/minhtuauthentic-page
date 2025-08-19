import { ProductDto } from '@/dtos/Product.dto';
import { twMerge } from 'tailwind-merge';
import ProductPrice from '@/components/molecules/product/price';
import { Star } from '@/components/icons/star';
import { useContext, useEffect, useRef, useState } from 'react';
import { ProductConfigurationsDto } from '@/dtos/productConfigurations.dto';
import { VariantDto } from '@/dtos/Variant.dto';
import ProductConfiguration from '@/components/molecules/product/configuration';
import ProductCartCheckout from '@/components/molecules/product/productCartCheckout';
import PromotionDescription from '@/components/molecules/product/promotionDescription';
import Link from 'next/link';
import { generateSlugToHref, SexName } from '@/utils';
import StartRating from '@/components/atoms/product/startRating';
import { Rate } from 'antd/es';
import { SettingsDto } from '@/dtos/Settings.dto';
import { useRouter } from 'next/router';
import ProductDetailContext from '@/contexts/productDetailContext';
import AppContext from '@/contexts/appContext';
import { useIsMobile } from '@/hooks/useDevice';
type Props = {
  product: ProductDto;
  productConfigurations: ProductConfigurationsDto[];
  setQuickViewModal?: (isOpen: boolean) => void;
};
const ProductPropertyQuickView = ({
  product,
  productConfigurations,
  setQuickViewModal,
 }: Props) => {
  const isMobile = useIsMobile();
  const productContext = useContext(ProductDetailContext);
  const variantMap = new Map<number, VariantDto>(
    (product?.variants || []).map((variant) => [variant.id || 0, variant]),
  );
  const appContext = useContext(AppContext);
  const overviewRef = useRef<HTMLDivElement>(null);
  const [variantConfigurationValueMap, setVariantConfigurationValueMap] =
    useState<Map<number, VariantDto> | null>(null);

  // Sync variant to AppContext immediately when variantActive changes (remove isMobile condition)
  useEffect(() => {
    if (productContext?.variantActive && appContext?.setCurrentVariant) {
      appContext.setCurrentVariant(productContext.variantActive);
    }
  }, [productContext?.variantActive]);

  useEffect(() => {
    if (isMobile) {
      const handleScroll = () => {
        if (!overviewRef.current) return;

        const overviewRect = overviewRef.current.getBoundingClientRect();
        const buyButtonArea = overviewRect.bottom;

        if (buyButtonArea < 150 && appContext?.setShowProductFooter) {
          appContext.setShowProductFooter(true);
          // Don't set variant here - it should already be synced by the useEffect above
        } else if (buyButtonArea >= 150 && appContext?.setShowProductFooter) {
          appContext.setShowProductFooter(false);
        }
      };

      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);

        appContext?.setShowProductFooter &&
        appContext.setShowProductFooter(false);
        appContext?.setCurrentVariant && appContext.setCurrentVariant(null);
      };
    }
  }, []);

  useEffect(() => {
    const _variantConfigurationValueMap = new Map<number, VariantDto>();
    (product?.variants || []).map((variant) => {
      return (variant?.variant_product_configuration_values || []).map(
        (item) => {
          _variantConfigurationValueMap.set(
            item.product_configuration_value_id || 0,
            variant,
          );
        },
      );
    });
    setVariantConfigurationValueMap(_variantConfigurationValueMap);
  }, []);

  const handleConfigurationChange = (
    value: { configurationId: number; valueId: number; variant?: VariantDto }[],
  ) => {
    if (variantConfigurationValueMap) {
      const _variant = variantConfigurationValueMap.get(value[0].valueId);
      if (_variant && productContext?.setVariantActive) {
        productContext.setVariantActive(_variant);
      }
    }
  };

  const getConfigurationValue = (): {
    configurationId: number;
    valueId: number;
  }[] => {
    const value: {
      configurationId: number;
      valueId: number;
      variant?: VariantDto;
    }[] = [];
    productContext?.variantActive?.variant_product_configuration_values?.map(
      (item) => {
        value.push({
          configurationId:
            item.product_configuration_value?.product_configuration_id || 0,
          valueId: item.product_configuration_value_id || 0,
          variant: variantMap.get(item.variant_id || 0),
        });
      },
    );
    return value;
  };

  return (
    <div>
      <h1
        className={
          'font-[700] lg:font-bold text-[20px] leading-[1.2] bk-product-name'
        }
      >
        {product.title || product.name}
      </h1>
      <div className={'mt-3 overflow-hidden'}>
        <ProductPrice
          prefix={'Giá'}
          variant={productContext?.variantActive}
          classNameRegularPrice={
            'text-[20px] lg:text-[24px] font-[700] lg:font-bold'
          }
          classNamePrice={'font-[500] text-[16px] lg:text-[18px]'}
          displayGap
          classNameGap={
            'text-[10px] bg-red-600 ml-2 inline-block py-1 px-2 rounded-[10px] text-white'
          }
          isHaveBKPrice={true}
        />
        {variantConfigurationValueMap && (
          <ProductConfiguration
            productConfigurations={productConfigurations}
            onChange={handleConfigurationChange}
            value={getConfigurationValue()}
            variants={product?.variants || []}
            variantMap={variantConfigurationValueMap}
          />
        )}
      </div>
      <div className={'mt-6'}>
        {productContext?.variantActive && (
          <div ref={overviewRef}>
            <ProductCartCheckout
              variant={productContext?.variantActive}
              isQuickView={true}
              setQuickViewModal={setQuickViewModal}
            />
          </div>
        )}
      </div>
    </div>
  );
};
export default ProductPropertyQuickView;
