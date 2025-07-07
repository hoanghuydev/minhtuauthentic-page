import { PromotionsDto } from '@/dtos/Promotions.dto';
import CouponsDto from '@/dtos/Coupons.dto';
import SectionSwiper from '@/components/organisms/sectionSwiper';
import { ReactNode, useContext, useEffect, useState } from 'react';
import useSWR from 'swr';
import { PROMOTION_TYPE } from '@/config/enum';
import { SettingsDto } from '@/dtos/Settings.dto';
import { VariantDto } from '@/dtos/Variant.dto';
import SkeletonProductCard from '@/components/organisms/product/skelecton';
import DealSockCard from '@/components/organisms/product/dealSockCard';
import ShoppingCartOutlined from '@ant-design/icons/lib/icons/ShoppingCartOutlined';
import OrderContext from '@/contexts/orderContext';
import { calculatePriceMinus, formatMoney } from '@/utils';

type Props = {
  setting?: SettingsDto;
  mainVariant: VariantDto;
};

const fetcher = () =>
  fetch('/api/promotions/' + PROMOTION_TYPE.DEAL_SOCK, {
    method: 'GET',
  }).then((res) => res.json());

export default function ProductDealSock({ setting, mainVariant }: Props) {
  const { data, error, isLoading } = useSWR(
    '/api/promotions/' + PROMOTION_TYPE.DEAL_SOCK,
    fetcher,
  );
  const order = useContext(OrderContext);
  const [dealSockVariants, setDealSockVariants] = useState<VariantDto[]>([]);
  const [totalSavings, setTotalSavings] = useState<number>(0);

  const [promotion, setPromotion] = useState<PromotionsDto>();
  useEffect(() => {
    setPromotion(data?.data);
  }, [data]);

  // Filter valid coupons that have variant data
  const validCoupons =
    promotion?.coupons?.filter(
      (item: CouponsDto) =>
        item?.coupon_details?.[0]?.variant &&
        item?.coupon_details?.[0]?.variant?.regular_price &&
        item?.coupon_details?.[0]?.variant?.product,
    ) || [];

  // Only render if there are valid coupons
  if (!validCoupons.length && !isLoading) {
    return null;
  }

  const renderSkeletonCards = () => {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 w-full gap-2 lg:gap-4">
        {[1, 2, 3, 4].map((item) => (
          <SkeletonProductCard key={item} />
        ))}
      </div>
    );
  };

  const toggleVariant = (variant: VariantDto, coupon: CouponsDto) => {
    const savings = calculatePriceMinus(variant.regular_price || 0, coupon);

    let isRemoving = false;
    setDealSockVariants((prev) => {
      const exists = prev.some((v) => v.id === variant.id);
      isRemoving = exists;

      return exists
        ? prev.filter((v) => v.id !== variant.id)
        : [...prev, variant];
    });

    setTotalSavings((prevSavings) =>
      isRemoving ? prevSavings - savings : prevSavings + savings
    );
  };

  const isVariantChecked = (variant: VariantDto) =>
    dealSockVariants.some((v) => v.id === variant.id);

  const handleAddDealSockToCart = () => {
    if (dealSockVariants.length > 0 && order?.addMultipleCart) {
      const updatedVariants = [mainVariant, ...dealSockVariants];
      order.addMultipleCart(updatedVariants);
      // setDealSockVariants([]);
      // setTotalSavings(0);
    }
  }

  return (
    <div
      className={
        'w-full shadow-custom bg-[#FFF2F6] my-1 lg:my-3 px-4 py-5 lg:px-[20px] lg:py-[25px] max-lg:overflow-hidden'
      }
    >
      <p className={'text-2xl font-[700] lg:font-bold text-primary mb-[10px]'}>
        MUA KÈM GIÁ SỐC
      </p>
      <div className="relative">
        {isLoading ? (
          renderSkeletonCards()
        ) : (
          <div className="transition-opacity duration-200 opacity-100">
            <SectionSwiper
              slidesPerView={5}
              slidePerViewMobile={2}
              spaceBetween={10}
              renderItem={(item: unknown) => {
                const iCoupon = item as CouponsDto;
                const variant = iCoupon?.coupon_details?.[0]?.variant;

                if (!variant?.product) {
                  return null;
                }

                return (
                  <DealSockCard
                    product={variant.product}
                    variant={
                      {
                        ...variant,
                        ...{ coupon: iCoupon },
                      } as VariantDto
                    }
                    isDealSock={true}
                    promotions={promotion && [promotion]}
                    coupon={iCoupon}
                    checked={isVariantChecked(variant)}
                    onToggleChecked={() => toggleVariant(variant, iCoupon)}
                    isShowConfiguration
                  />
                ) as ReactNode;
              }}
              data={validCoupons}
            />
            <div className="flex items-center justify-between mt-4">
              <div>
                <p className="text-gray-700 text-lg">
                  Đã chọn: <span className="text-red-500">{dealSockVariants.length} sản phẩm</span>
                </p>
                <p className="text-gray-700 text-lg">
                  Tiết kiệm được: <span className="text-red-500">{formatMoney(totalSavings)}</span>
                </p>
              </div>
              <div>
                <button
                  type={'button'}
                  className={`
                    block grow bg-primary text-white rounded-[8px] p-[7px_6px] lg:p-[10px_12px] max-lg:text-sm
                    ${dealSockVariants.length === 0 ? 'opacity-50' : 'opacity-100'}
                    transition-opacity duration-300 ease-in-out
                  `}
                  onClick={handleAddDealSockToCart}
                  disabled={dealSockVariants.length === 0}
                >
                  <ShoppingCartOutlined />
                  <span className={'ml-2'}>{'Thêm giỏ hàng'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
