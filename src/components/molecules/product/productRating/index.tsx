import RatingDto from '@/dtos/Rating.dto';
import FormProductRating from '@/components/molecules/product/productRating/form';
import useSWR, { mutate } from 'swr';
import { useEffect, useState } from 'react';
import { ProductRatingList } from '@/components/molecules/product/productRating/list';
type Props = {
  product_id: number;
};

export default function ProductRating({ product_id }: Props) {
  const fetcher = () =>
    fetch(`/api/product/rate/${product_id}`, {
      method: 'GET',
    }).then((res) => res.json());
  const { data } = useSWR(`getProductRating-${product_id}`, fetcher);
  const [ratings, setRatings] = useState<RatingDto[]>([]);
  useEffect(() => {
    if (data?.data) {
      setRatings(data?.data);
    }
  }, [data]);

  const refreshData = () => {
    mutate(`getProductRating-${product_id}`).catch();
  };

  return (
    <div
      className={'rounded-[10px] border-gray-500 bg-white shadow-custom mt-3'}
    >
      <div
        className={
          'bg-gray-100 text-primary font-semibold p-3 text-[16px] text-center'
        }
      >
        <h3 className={'uppercase'}>Đánh giá sản phẩm</h3>
      </div>
      <div className={'p-3'}>
        <FormProductRating refreshData={refreshData} product_id={product_id} />
        {ratings.length > 0 && (
          <div className={'mt-3 gap-3'}>
            <h3 className={'text-2xl mb-3 font-semibold'}>
              Có {ratings.length} đánh giá về sản phẩm này
            </h3>
            <ProductRatingList ratings={ratings} />
          </div>
        )}
      </div>
    </div>
  );
}
