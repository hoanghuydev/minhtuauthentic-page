import { ProductDto } from '@/dtos/Product.dto';
import ProductPrice from '@/components/molecules/product/price';
import ProductCardImage from '@/components/molecules/product/image/productCardImage';
import Link from 'next/link';
import ProductCardButtonGroup from '@/components/molecules/product/button-group';
import Badge from '@/components/atoms/badge';
import { twMerge } from 'tailwind-merge';
import { VariantDto } from '@/dtos/Variant.dto';
import {
  calculatePriceMinus,
  calculatePricePercent,
  formatMoney,
  promotionName,
} from '@/utils';
import { Fragment, useEffect, useState } from 'react';
import { PromotionsDto } from '@/dtos/Promotions.dto';
import CouponsDto from '@/dtos/Coupons.dto';
import SelectVariant from '@/components/organisms/product/selectVariant';
import { PROMOTION_TYPE } from '@/config/enum';
const ProductCard = ({
  product,
  variant,
  promotions,
  addText,
  coupon,
  isShowConfiguration,
  isShowListVariant,
  className,
  isDealSock,
  preloadVariants,
}: {
  product: ProductDto;
  variant: VariantDto;
  promotions?: PromotionsDto[];
  addText?: string;
  coupon?: CouponsDto;
  isShowConfiguration?: boolean;
  isShowListVariant?: boolean;
  className?: string;
  isDealSock?: boolean;
  preloadVariants?: boolean;
}) => {
  const [_variant, setVariant] = useState<VariantDto>(variant);

  // Cập nhật variant khi prop thay đổi
  useEffect(() => {
    if (variant && variant !== _variant) {
      setVariant(variant);
    }
  }, [variant]);

  return (
    <div
      className={twMerge(
        'bg-white rounded-[10px] border-[2px] border-[#e4e4e4] py-2 transition-colors duration-300 hover:border-primary hover:shadow-md flex flex-col',
        className,
      )}
    >
      <div>
        <div className={'flex items-center justify-end gap-2 px-2'}>
          <Badge className={'bg-green'}>
            Giảm {calculatePricePercent(_variant)}%
          </Badge>
          <Badge className={'bg-price'}>Trả góp 0%</Badge>
        </div>
        <ProductCardImage product={product} variant={_variant} />
        {/* <div className={'px-2 h-[110px] lg:h-[75px] xl:h-[63px]'}> */}
        <div className="px-2  overflow-hidden">
          <h3
            className={twMerge(
              'font-bold line-clamp-4 ',
              !isDealSock && 'h-[90px] sm:h-[72px]',
              isDealSock && 'h-[42px] line-clamp-2',
            )}
          >
            <Link className="block" href={`/${product?.slugs?.slug}`}>
              {product.title || product.name}
            </Link>
          </h3>
        </div>
        {/* <div className={'h-[50px] pt-2'}> */}
        <div className={'pt-2'}>
          {isShowConfiguration &&
            _variant?.variant_product_configuration_values?.map(
              (item, index) => {
                return (
                  <p key={index} className={'text-sm px-2'}>
                    {
                      item.product_configuration_value?.product_configuration
                        ?.name
                    }
                    : {item.product_configuration_value?.value}
                  </p>
                );
              },
            )}
          {isShowListVariant && (
            <SelectVariant
              key={`${product.id}-${_variant?.id || 'default'}`}
              product={product}
              defaultVariant={_variant}
              onChange={(rs) => {
                if (rs) {
                  setVariant(rs);
                }
              }}
              preloadVariants={preloadVariants}
            />
          )}
          {_variant && (
            <ProductPrice
              className={twMerge(
                'px-2',
                isDealSock && '[&>span:first-child]:text-[14px] ',
              )}
              variant={_variant}
            />
          )}
        </div>
      </div>
      {promotions && promotions.length > 0 && (
        <div className={' px-2 lg:px-[8px]'}>
          {promotions?.map((promotion, index) => {
            return (
              <Fragment key={'Product-card-' + index}>
                <p>
                  <span className={'font-semibold mr-1 lg:mr-3'}>
                    {promotionName(promotion)}:
                  </span>
                  <span
                    className={
                      'text-red-600 text-[13px] font-[700] lg:font-bold text-right cursor-pointer'
                    }
                  >
                    {formatMoney(
                      (_variant?.regular_price || 0) -
                        calculatePriceMinus(
                          _variant?.regular_price || 0,
                          coupon,
                        ),
                    )}
                  </span>
                </p>
                {promotion.type !== PROMOTION_TYPE.DEAL_SOCK && (
                  <p className={'text-sm'}>
                    <span className={'mr-1 lg:mr-3'}>Tiết kiệm thêm:</span>
                    <span className={'text-[13px] font-[700] lg:font-bold'}>
                      {formatMoney(
                        calculatePriceMinus(
                          _variant?.regular_price || 0,
                          coupon,
                        ),
                      )}
                    </span>
                  </p>
                )}
              </Fragment>
            );
          })}
        </div>
      )}
      <ProductCardButtonGroup
        className={'mt-[10px] px-2'}
        variant={_variant}
        product={product}
        addText={addText}
      />
    </div>
  );
};
export default ProductCard;
