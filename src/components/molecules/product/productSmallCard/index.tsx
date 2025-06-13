import { ProductDto } from '@/dtos/Product.dto';
import Image from 'next/image';
import Link from 'next/link';
import { generateSlugToHref } from '@/utils';
import { twMerge } from 'tailwind-merge';

type Props = {
  product: ProductDto;
  className?: string;
};

const ProductSmallCard = ({ product, className }: Props) => {
  return (
    <Link
      href={generateSlugToHref(product?.slugs?.slug)}
      className={twMerge(
        'group block bg-white rounded-lg p-2 transition-all duration-300 hover:shadow-lg border border-gray-200',
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <div className="relative w-16 h-16 overflow-hidden rounded-md bg-gray-50">
          <Image
            src={
              product?.feature_image_detail?.image?.url ||
              '/images/no-image.png'
            }
            alt={product?.name || 'Product image'}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 64px) 100vw, 64px"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 truncate group-hover:text-primary whitespace-pre-wrap text-ellipsis line-clamp-2 overflow-hidden">
            {product?.name || product?.title}
          </h3>
        </div>
      </div>
    </Link>
  );
};

export default ProductSmallCard;
