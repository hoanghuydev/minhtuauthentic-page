import { ProductDto } from '@/dtos/Product.dto';
import ProductPrice from '@/components/molecules/product/price';
import ProductCardImage from '@/components/molecules/product/image/productCardImage';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';
import { VariantDto } from '@/dtos/Variant.dto';
import { calculatePriceMinus, formatMoney, promotionName } from '@/utils';
import { Fragment, useEffect, useState } from 'react';
import { PromotionsDto } from '@/dtos/Promotions.dto';
import CouponsDto from '@/dtos/Coupons.dto';
import { CheckOutlined } from '@ant-design/icons';
const DealSockCard = ({
  product,
  variant,
  promotions,
  coupon,
  className,
  isDealSock,
  checked = false,
  onToggleChecked,
  isShowConfiguration,
}: {
  product: ProductDto;
  variant: VariantDto;
  promotions?: PromotionsDto[];
  coupon: CouponsDto;
  className?: string;
  isDealSock?: boolean;
  checked?: boolean;
  onToggleChecked?: (variant: VariantDto, coupon: CouponsDto) => void;
  isShowConfiguration?: boolean;
}) => {
  const [_variant, setVariant] = useState<VariantDto>(variant);
  // Thêm local state để theo dõi trạng thái checked
  const [isChecked, setIsChecked] = useState<boolean>(checked);

  // Cập nhật variant khi prop thay đổi
  useEffect(() => {
    if (variant && variant !== _variant) {
      setVariant(variant);
    }
  }, [variant]);

  // Đồng bộ state checked từ props
  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  // Xử lý click checkbox
  const handleCheckboxClick = () => {
    const newCheckedState = !isChecked;
    setIsChecked(newCheckedState);
    onToggleChecked && onToggleChecked(variant, coupon);
  };

  return (
    <div
      className={twMerge(
        'relative bg-white rounded-[20px] py-4 my-2 transition-colors duration-300 flex flex-col border-[2px]',
        isChecked ? 'border-primary' : 'border-white hover:border-primary',
        className,
      )}
    >
      <div
        className={`absolute top-4 right-4 transition-colors duration-300 w-[28px] h-[28px] border-[2px] rounded-[12px] flex items-center justify-center z-10 cursor-pointer
        ${
          isChecked
            ? 'bg-primary border-primary'
            : 'bg-white border-gray-200 hover:border-primary'
        }`}
        onClick={handleCheckboxClick}
      >
        <CheckOutlined className="text-white" />
      </div>
      <div>
        <ProductCardImage
          product={product}
          variant={_variant}
          className={'px-4'}
        />
        {/* <div className={'px-2 h-[110px] lg:h-[75px] xl:h-[63px]'}> */}
        <div className="px-4 overflow-hidden">
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
                  <p key={index} className={'text-xs sm:text-sm px-4 line-clamp-1'}>
                    {
                      item.product_configuration_value?.product_configuration
                        ?.name
                    }
                    : {item.product_configuration_value?.value}
                  </p>
                );
              },
            )}
          {_variant && (
            <ProductPrice
              className={twMerge(
                'px-4',
                isDealSock && 'sm:[&>span:first-child]:text-[14px] [&>span:first-child]:text-[12px]',
              )}
              classNamePrice={'max-sm:text-[11px]'}
              variant={_variant}
            />
          )}
        </div>
      </div>
      {promotions && promotions.length > 0 && (
        <div className={'px-4'}>
          {promotions?.map((promotion, index) => {
            return (
              <Fragment key={'Product-card-' + index}>
                <p className="max-sm:text-[12px]">
                  <span className={'font-semibold mr-1'}>
                    {promotionName(promotion)}:
                  </span>
                  <span
                    className={
                      'text-primary lg:font-bold text-right cursor-pointer'
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
              </Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default DealSockCard;
