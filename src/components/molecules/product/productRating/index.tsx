import RatingDto from '@/dtos/Rating.dto';
import { ProductDto } from '@/dtos/Product.dto';
import useSWR, { mutate } from 'swr';
import { useEffect, useState } from 'react';
import { ProductRatingList } from '@/components/molecules/product/productRating/list';
import RatingStatistics from '@/components/molecules/product/productRating/ratingStatistics';
import RatingModal from '@/components/molecules/product/productRating/ratingModal';

type Props = {
  product_id: number;
  product?: ProductDto;
};

export default function ProductRating({ product_id, product }: Props) {
  const fetcher = () =>
    fetch(`/api/product/rate/${product_id}`, {
      method: 'GET',
    }).then((res) => res.json());
  const { data } = useSWR(`getProductRating-${product_id}`, fetcher);
  const [ratings, setRatings] = useState<RatingDto[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (data?.data) {
      setRatings(data?.data);
    }
  }, [data]);

  const refreshData = () => {
    mutate(`getProductRating-${product_id}`).catch();
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div
      className={
        'rounded-xl overflow-hidden border-gray-500 bg-white shadow-custom mt-3'
      }
    >
      <div
        className={
          'bg-gray-100 text-primary font-semibold p-3 text-[16px] text-center'
        }
      >
        <h3 className={'uppercase'}>Đánh giá sản phẩm</h3>
      </div>
      <div className={'p-3'}>
        {/* Thống kê đánh giá */}
        <RatingStatistics ratings={ratings} onWriteReview={handleOpenModal} />

        {/* Danh sách đánh giá nếu có */}
        {ratings.length > 0 && (
          <div>
            <div
              className={
                'bg-white rounded-2xl pt-4 px-3 border border-gray-200'
              }
            >
              <ProductRatingList ratings={ratings} />
            </div>
          </div>
        )}
      </div>

      {/* Modal đánh giá */}
      <RatingModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        product_id={product_id}
        product={product}
        refreshData={refreshData}
      />
    </div>
  );
}
