import { ProductDto } from '@/dtos/Product.dto';
import { twMerge } from 'tailwind-merge';
import { ImageDto } from '@/dtos/Image.dto';
import Link from 'next/link';
import ImageWithFallback from '@/components/atoms/images/ImageWithFallback';
import { VariantDto } from '@/dtos/Variant.dto';
import noImage from '@/static/images/no-image.png';

const ProductCardImage = ({
  variant,
  className,
  product,
  noCrawl,
}: {
  variant: VariantDto;
  product: ProductDto;
  className?: string;
  // When true, renders the image as a CSS background-image instead of
  // <img>/<Image>. Google does not index CSS background images, so this
  // keeps deal-sock / related-product thumbnails out of Google Images
  // while the same image rendered via <Image> on the product's own detail
  // page stays indexed normally.
  noCrawl?: boolean;
}) => {
  const image: ImageDto | undefined =
    variant?.images?.sort((a, b) => (a.id || 0) - (b.id || 0))?.[0]?.image ||
    product?.feature_image_detail?.image;

  return (
    <div className={'relative pt-[100%]'}>
      <Link
        className={twMerge(
          'block absolute w-full h-full inset-0 p-2 ',
          'w-full h-full overflow-hidden',
          className,
        )}
        href={`/${product.slugs?.slug}`}
        aria-label={noCrawl ? product.title || product.name : undefined}
      >
        {noCrawl ? (
          <div
            role="presentation"
            aria-hidden="true"
            style={{
              backgroundImage: `url(${
                image?.url || image?.thumbnail_url || noImage.src
              })`,
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
            className={
              'w-full h-full hover:scale-105 transition-transform duration-300'
            }
          />
        ) : (
          <ImageWithFallback
            image={image}
            className={
              'object-contain w-full h-full hover:scale-105 transition-transform duration-300'
            }
            product={product}
            // sizes={
            //   '(max-width: 500px) 100vw, (max-width: 768px) 60vw, (max-width: 1024px) 40vw, 30vw'
            // }
            unoptimized={true}
          />
        )}
      </Link>
    </div>
  );
};
export default ProductCardImage;
