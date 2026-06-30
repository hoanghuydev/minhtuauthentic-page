import { ProductDto } from '@/dtos/Product.dto';
import { twMerge } from 'tailwind-merge';
import { ImageDto } from '@/dtos/Image.dto';
import Link from 'next/link';
import ImageWithFallback from '@/components/atoms/images/ImageWithFallback';
import { VariantDto } from '@/dtos/Variant.dto';
import { useEffect, useRef } from 'react';
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
  // When true, loads image src via client-side JS only so Google's crawler
  // cannot discover the URL in the initial HTML/SSR output.
  // Combined with X-Robots-Tag: noindex on the backend, this prevents
  // deal sock / related product images from being indexed by Google.
  noCrawl?: boolean;
}) => {
  const image: ImageDto | undefined =
    variant?.images?.sort((a, b) => (a.id || 0) - (b.id || 0))?.[0]?.image ||
    product?.feature_image_detail?.image;

  const imgRef = useRef<HTMLImageElement>(null);

  // When noCrawl is enabled, set the image src ONLY on the client side
  // via useEffect so the URL never appears in SSR HTML for Google to crawl.
  useEffect(() => {
    if (noCrawl && imgRef.current) {
      const src = image?.url || image?.thumbnail_url || noImage.src;
      imgRef.current.src = src;
    }
  }, [noCrawl, image]);

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
        {noCrawl ? (
          <img
            ref={imgRef}
            role="presentation"
            aria-hidden="true"
            alt=""
            loading="lazy"
            decoding="async"
            className={
              'object-contain w-full h-full hover:scale-105 transition-transform duration-300 select-none'
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
