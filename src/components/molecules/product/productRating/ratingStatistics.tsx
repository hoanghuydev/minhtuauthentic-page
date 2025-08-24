import RatingDto from '@/dtos/Rating.dto';
import { Button } from 'antd/es';
import { useMemo } from 'react';
import StaticStarRating from '@/components/atoms/product/staticStarRating';

type Props = {
  ratings: RatingDto[];
  onWriteReview: () => void;
};

export default function RatingStatistics({ ratings, onWriteReview }: Props) {
  // Tính toán thống kê đánh giá
  const ratingStats = useMemo(() => {
    const totalRatings = ratings.length;

    if (totalRatings === 0) {
      return {
        averageRating: 0,
        totalRatings: 0,
        starDistribution: [0, 0, 0, 0, 0], // 1 sao đến 5 sao
      };
    }

    // Tính điểm trung bình
    const totalPoints = ratings.reduce(
      (sum, rating) => sum + (rating.point || 0),
      0,
    );
    const averageRating = totalPoints / totalRatings;

    // Phân bố theo số sao (1-5 sao)
    const starDistribution = [0, 0, 0, 0, 0];
    ratings.forEach((rating) => {
      const point = rating.point || 0;
      if (point >= 1 && point <= 5) {
        starDistribution[point - 1]++;
      }
    });

    return {
      averageRating: Math.round(averageRating * 10) / 10, // Làm tròn 1 chữ số thập phân
      totalRatings,
      starDistribution: starDistribution.reverse(), // Đảo ngược để 5 sao ở đầu
    };
  }, [ratings]);

  const { averageRating, totalRatings, starDistribution } = ratingStats;

  if (totalRatings === 0) {
    // Hiển thị khi chưa có đánh giá
    return (
      <div className="bg-white rounded-2xl p-6 text-center">
        <div className="mb-4">
          <p className="text-lg font-semibold text-gray-600 mb-2">
            Hiện chưa có đánh giá nào.
          </p>
          <p className="text-gray-500">
            Bạn sẽ là người đầu tiên đánh giá sản phẩm này chứ?
          </p>
        </div>
        <Button type="primary" className="bg-primary" onClick={onWriteReview}>
          Đánh giá ngay
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6">
      {/* Hiển thị điểm trung bình và tổng số đánh giá */}
      <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
        <div className="text-center">
          <div className="text-5xl font-bold text-primary mb-1">
            {averageRating}
            <span className="text-lg text-gray-400">/5</span>
          </div>
          <div className="mb-2">
            <StaticStarRating rating={averageRating} size="lg" />
          </div>
          <div className="text-[14px] text-gray-600">
            {totalRatings} lượt đánh giá
          </div>
        </div>

        {/* Biểu đồ phân bố sao */}
        <div className="md:flex-1 w-full md:w-auto">
          {[5, 4, 3, 2, 1].map((star, index) => {
            const count = starDistribution[index] || 0;
            const percentage =
              totalRatings > 0 ? (count / totalRatings) * 100 : 0;

            return (
              <div key={star} className="flex items-center gap-2 mb-1">
                <span className="text-sm w-3">{star}</span>
                <span className="text-yellow-400">★</span>
                <div className="flex-1 max-w-[60%] md:max-w-[70%] h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-[75px] text-right">
                  {count} đánh giá
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Nút viết đánh giá */}
      <div className="text-center">
        <Button type="primary" className="bg-primary" onClick={onWriteReview}>
          Viết đánh giá
        </Button>
      </div>
    </div>
  );
}
