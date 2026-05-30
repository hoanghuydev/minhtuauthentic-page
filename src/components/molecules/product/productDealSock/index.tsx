import { PromotionsDto } from '@/dtos/Promotions.dto';
import CouponsDto from '@/dtos/Coupons.dto';
import SectionSwiper from '@/components/organisms/sectionSwiper';
import { ReactNode, useContext, useEffect, useState } from 'react';
import useSwiperSpeed from '@/hooks/useSwiperSpeed';
import useSWR from 'swr';
import { PROMOTION_TYPE } from '@/config/enum';
import { SettingsDto } from '@/dtos/Settings.dto';
import { VariantDto } from '@/dtos/Variant.dto';
import SkeletonProductCard from '@/components/organisms/product/skelecton';
import DealSockCard from '@/components/organisms/product/dealSockCard';
import ShoppingCartOutlined from '@ant-design/icons/lib/icons/ShoppingCartOutlined';
import OrderContext from '@/contexts/orderContext';
import { calculatePriceMinus, formatMoney } from '@/utils';
import { twMerge } from 'tailwind-merge';
import Image from 'next/image';
import Link from 'next/link';
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
  const swiperSpeed = useSwiperSpeed();
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
      isRemoving ? prevSavings - savings : prevSavings + savings,
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
  };

  return (
    <div
      data-nosnippet
      className={twMerge(
        'w-full relative shadow-custom mb-3 px-4 py-5 lg:px-[10px] mt-5 rounded-[8px] lg:py-[15px] min-h-[400px]',
        `bg-[${setting?.value?.backgroundColor ?? '#FFF2F6'}]`,
      )}
      style={{
        backgroundColor: setting?.value?.backgroundColor,
      }}
    >
      <div className="absolute top-[-18px] z-10 left-[5%] w-[285px] h-[55px]">
        <Image
          src="/sale_frame.webp"
          alt="Minh Tu Authentic, Nước hoa chính hãng Tphcm, Quận Tân Phú, Mỹ phẩm"
          className="object-contain object-center"
          fill
          unoptimized
          priority
        />
        <div className="relative w-full h-full min-w-[285px] min-h-[55px]">
          {promotion?.slugs && promotion?.slugs?.slug ? (
            <Link
              href={`${process.env.NEXT_PUBLIC_APP_URL}/${promotion.slugs.slug}`}
              className="absolute text-[18px] w-full z-10 left-[50%] translate-x-[-50%] top-[50%] translate-y-[-50%] line-clamp-1 text-center text-white font-semibold block"
            >
              {promotion?.name || 'MUA KÈM GIÁ SỐC'}
            </Link>
          ) : (
            <p className="absolute text-[18px] w-full z-10 left-[50%] translate-x-[-50%] top-[50%] translate-y-[-50%] line-clamp-1 text-center text-white font-semibold">
              {promotion?.name || 'MUA KÈM GIÁ SỐC'}
            </p>
          )}
        </div>
      </div>

      <div className="relative mt-4">
        {isLoading ? (
          renderSkeletonCards()
        ) : (
          <div className="transition-opacity duration-200 opacity-100">
            <SectionSwiper
              slidesPerView={5}
              slidePerViewMobile={2}
              speed={swiperSpeed}
              spaceBetween={10}
              auto={{
                delay: 6000,
                disableOnInteraction: false,
              }}
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
                  Đã chọn:{' '}
                  <span className="text-red-600">
                    {dealSockVariants.length} sản phẩm
                  </span>
                </p>
                <p className="text-gray-700 text-lg">
                  Tiết kiệm được:{' '}
                  <span className="text-red-600">
                    {formatMoney(totalSavings)}
                  </span>
                </p>
              </div>
              <div>
                <button
                  type={'button'}
                  className={`
                    block grow bg-primary text-white rounded-[8px] p-[7px_6px] lg:p-[10px_12px] max-lg:text-sm
                    ${
                      dealSockVariants.length === 0
                        ? 'opacity-50'
                        : 'opacity-100'
                    }
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
