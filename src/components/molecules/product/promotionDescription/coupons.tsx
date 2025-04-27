import { useEffect, useState } from 'react';
import Loading from '@/components/atoms/loading';
import CouponsDto from '@/dtos/Coupons.dto';
import ItemCoupon from '@/components/atoms/coupons';

type Props = {
  variant_id: number;
};
export default function PromotionDescriptionCoupons({ variant_id }: Props) {
  const [loading, setLoading] = useState(false);
  const [coupons, setCoupons] = useState<CouponsDto[]>([]);
  const [indexClick, setIndexClick] = useState<number>();
  useEffect(() => {
    fetchCoupon().catch();
  }, [variant_id]);
  const fetchCoupon = async () => {
    setLoading(true);
    return fetch(`/api/coupons/variants/${variant_id}`)
      .then((response) => response.json())
      .then((data: { data: CouponsDto[] }) => {
        setCoupons(data?.data || []);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  };
  return (
    <div className={'relative w-full h-full min-h-[50px]'}>
      {loading && (
        <div
          className={
            'absolute top-0 left-0 w-full h-full bg-white bg-opacity-90 flex items-center justify-center'
          }
        >
          <Loading />
        </div>
      )}
      <div className={'w-full h-full flex flex-col gap-3 bg-white'}>
        {coupons?.map((coupon, index) => {
          return (
            <ItemCoupon
              coupon={coupon}
              key={index}
              isClick={indexClick === index}
              isForCopy
              onClick={() => {
                setIndexClick(index);
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
