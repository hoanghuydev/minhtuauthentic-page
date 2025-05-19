import Link from 'next/link';
import { generateSlugToHref } from '@/utils';
import ImageWithFallback from '@/components/atoms/images/ImageWithFallback';
import { BrandDto } from '@/dtos/Brand.dto';
import { twMerge } from 'tailwind-merge';

type Props = {
  brand: BrandDto;
  className?: string;
  classNameImage?: string;
};

export default function BrandWithImage({
  brand,
  className,
  classNameImage,
}: Props) {
  return (
    <div
      className={twMerge(
        'p-1 lg:p-[10px_20px] overflow-hidden rounded-[10px] border border-gray-200',
        className,
      )}
    >
      <Link href={generateSlugToHref(brand?.slugs?.slug || '')}>
        <ImageWithFallback
          image={brand?.images?.[0]?.image}
          className={classNameImage}
          duration={0}
          isLazy={false}
        />
      </Link>
    </div>
  );
}
