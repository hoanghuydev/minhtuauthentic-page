import { ReactNode } from 'react';

type Props = {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showRating?: boolean;
};

export default function StaticStarRating({
  rating,
  maxRating = 5,
  size = 'md',
  showRating = false,
}: Props) {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const renderStars = (): ReactNode[] => {
    const stars: ReactNode[] = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    // Sao đầy
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={`full-${i}`} className="text-yellow-400">
          ★
        </span>,
      );
    }

    // Sao nửa (nếu có)
    if (hasHalfStar && fullStars < maxRating) {
      stars.push(
        <span key="half" className="text-yellow-400 relative">
          ☆
          <span
            className="absolute inset-0 overflow-hidden text-yellow-400"
            style={{ width: '50%' }}
          >
            ★
          </span>
        </span>,
      );
    }

    // Sao rỗng
    const emptyStars = maxRating - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="text-gray-300">
          ☆
        </span>,
      );
    }

    return stars;
  };

  return (
    <div className="flex items-center gap-1">
      <div className={`flex items-center ${sizeClasses[size]}`}>
        {renderStars()}
      </div>
      {showRating && (
        <span className="text-sm text-gray-600 ml-1">
          ({rating.toFixed(1)})
        </span>
      )}
    </div>
  );
}
