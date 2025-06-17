import { ProductDto } from '@/dtos/Product.dto';
import ImageWithFallback from '@/components/atoms/images/ImageWithFallback';
import { twMerge } from 'tailwind-merge';
import { calculatePricePercent, generateSlugToHref } from '@/utils';
import Link from 'next/link';
import StartRating from '@/components/atoms/product/startRating';
import ProductPrice from '@/components/molecules/product/price';
import Badge from '@/components/atoms/badge';
import { useContext } from 'react';
import ProductDetailContext from '@/contexts/productDetailContext';

type Props = {
  products: ProductDto[];
};
export default function ProductRelation({ products }: Props) {
  const productContext = useContext(ProductDetailContext);
  return (
    <>
      <h2 className={'font-[700] lg:font-bold text-primary text-[24px] mt-3'}>
        Sản phẩm liên quan
      </h2>
      {products?.length > 0 && (
        <div className={'flex flex-col gap-3 mt-3 sticky top-0'}>
          {products.map((product, index) => {
            return (
              <Link
                href={generateSlugToHref(product?.slugs?.slug)}
                key={index}
                className={twMerge(
                  'bg-white rounded-[10px] p-3 border-[#e4e4e4] border-2 transition-colors duration-500 hover:border-primary',
                )}
              >
                <div className={'flex items-center gap-2'}>
                  <Badge className={'bg-green'}>
                    Giảm {calculatePricePercent(productContext?.variantActive)}%
                  </Badge>
                  <Badge className={'bg-price'}>Trả góp 0%</Badge>
                </div>
                <div className={twMerge('flex gap-3 mt-3')} key={index}>
                  <div>
                    <ImageWithFallback
                      image={
                        product?.feature_image_detail?.image ||
                        productContext?.variantActive?.images?.[0]?.image
                      }
                      className={
                        'w-[70px] h-[70px] min-w-[70px] object-contain'
                      }
                      quality={80}
                      sizes="70px"
                      unoptimized={false}
                    />
                  </div>
                  <div>
                    <h3 className={'font-semibold'}>
                      {product.title || product.name}
                    </h3>
                    <ProductPrice
                      variant={productContext?.variantActive}
                      classNameRegularPrice={'font-semibold'}
                      classNamePrice={'font-[500] text-[10px]'}
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
