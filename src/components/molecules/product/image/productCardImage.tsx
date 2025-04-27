import { ProductDto } from '@/dtos/Product.dto';
import { twMerge } from 'tailwind-merge';
import { ImageDto } from '@/dtos/Image.dto';
import Link from 'next/link';
import ImageWithFallback from '@/components/atoms/images/ImageWithFallback';
import { isMobile } from 'react-device-detect';
import { VariantDto } from '@/dtos/Variant.dto';
const ProductCardImage = ({
  variant,
  className,
  product,
}: {
  variant: VariantDto;
  product: ProductDto;
  className?: string;
}) => {
  const image: ImageDto | undefined =
    variant?.images?.[0]?.image || product?.feature_image_detail?.image;
  return (
    <div className={'relative pt-[100%]'}>
      <Link
        className={twMerge(
          'block absolute w-full h-full inset-0 p-2 ',
          'w-full h-full overflow-hidden',
          className,
        )}
        href={`/${product.slugs?.slug}`}
      >
        <ImageWithFallback
          image={image}
          className={
            'object-contain w-full h-full hover:scale-105 transition-transform duration-300'
          }
          product={product}
          unoptimized={!isMobile}
        />
      </Link>
    </div>
  );
};
export default ProductCardImage;
