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
import { isMobile } from 'react-device-detect';
type Props = {
  product: ProductDto;
  productConfigurations: ProductConfigurationsDto[];
  settings?: SettingsDto[];
};
const ProductProperty = ({
  product,
  productConfigurations,
  settings,
}: Props) => {
  const productContext = useContext(ProductDetailContext);
  const variantMap = new Map<number, VariantDto>(
    (product?.variants || []).map((variant) => [variant.id || 0, variant]),
  );
  const appContext = useContext(AppContext);
  const overviewRef = useRef<HTMLDivElement>(null);
  const [variantConfigurationValueMap, setVariantConfigurationValueMap] =
    useState<Map<number, VariantDto> | null>(null);

  useEffect(() => {
    if (isMobile) {
      const handleScroll = () => {
        if (!overviewRef.current) return;

        const overviewRect = overviewRef.current.getBoundingClientRect();
        const buyButtonArea = overviewRect.bottom;

        if (buyButtonArea < 150 && appContext?.setShowProductFooter) {
          appContext.setShowProductFooter(true);

          if (appContext.setCurrentVariant && productContext?.variantActive) {
            appContext.setCurrentVariant(productContext.variantActive);
          }
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
          'font-[700] lg:font-bold text-[22px] leading-[1.2] bk-product-name'
        }
      >
        {product.title || product.name}
      </h1>
      <div className={'mt-3 grid grid-cols-2'}>
        <div>
          <span>Thương hiệu: </span>

          {product.brands?.map((item, index) => (
            <Link
              href={generateSlugToHref(item.brand?.slugs?.slug)}
              className={'font-semibold text-primary'}
              key={'brand-' + index}
            >
              {item.brand?.name +
                (index === (product?.brands?.length || 0) - 1 ? '' : ', ')}
            </Link>
          ))}
        </div>
        <div>
          <span>Giới tính: </span>
          <span className={'font-semibold text-primary'}>
            {SexName(
              product?.product_property?.sex === 0
                ? 0
                : product?.product_property?.sex || 2,
            )}
          </span>
        </div>
        <div>
          <span>Trạng thái: </span>
          <span
            className={twMerge(
              'font-semibold text-primary',
              product?.is_in_stock && productContext?.variantActive?.is_in_stock
                ? 'text-green'
                : 'text-red-600',
            )}
          >
            {product?.is_in_stock && productContext?.variantActive?.is_in_stock
              ? 'Còn hàng'
              : 'Hết Hàng'}
          </span>
        </div>
        <div className={'flex gap-2'}>
          <span>Đánh giá: </span>
          <Rate rootClassName={'rate-custom'} disabled defaultValue={5} />
        </div>
      </div>
      <hr className={'mt-3'} />
      <div className={'mt-3 overflow-hidden'}>
        <ProductPrice
          prefix={'Giá'}
          variant={productContext?.variantActive}
          classNameRegularPrice={
            'text-[24px] lg:text-[28px] font-[700] lg:font-bold'
          }
          classNamePrice={'font-[500] lg:text-[20px]'}
          displayGap
          classNameGap={
            'text-[14px] bg-red-600 ml-2 inline-block py-1 px-2 rounded-[10px] text-white'
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
      <div className={'mt-3'}>
        {productContext?.variantActive && (
          <div ref={overviewRef}>
            <ProductCartCheckout variant={productContext?.variantActive} />
          </div>
        )}
      </div>
      <PromotionDescription
        settings={settings}
        variant_id={productContext?.variantActive?.id}
        className={'mt-3'}
      />
      <div className={'mt-3'}>
        <span className={'font-semibold'}>Danh mục </span>
        <span className={'text-[12px]'}>
          {product?.categories?.map((item, index) => {
            return (
              <Link
                key={index}
                className={'text-gray-400'}
                href={generateSlugToHref(item.category?.slugs?.slug)}
              >
                {(item.category?.name || '') +
                  (index < (product?.categories?.length || 0) - 1 ? ', ' : '')}
              </Link>
            );
          })}
        </span>
      </div>
    </div>
  );
};
export default ProductProperty;
