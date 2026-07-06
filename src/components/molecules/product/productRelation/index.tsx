import { ProductDto } from '@/dtos/Product.dto';
import { twMerge } from 'tailwind-merge';
import { calculatePricePercent, generateSlugToHref } from '@/utils';
import Link from 'next/link';
import StartRating from '@/components/atoms/product/startRating';
import ProductPrice from '@/components/molecules/product/price';
import Badge from '@/components/atoms/badge';
import { useContext } from 'react';
import ProductDetailContext from '@/contexts/productDetailContext';
import noImage from '@/static/images/no-image.png';

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
            const variant = (product?.variants || [])?.find(
              (item) => item.is_default,
            );

            return (
              <Link
                href={generateSlugToHref(product?.slugs?.slug)}
                key={index}
                className={twMerge(
                  'bg-white rounded-[10px] p-3 border-[#e4e4e4] border-2 transition-colors duration-500 hover:border-primary',
                )}
              >
                <div className={'flex items-center gap-2'}>
                  <Badge className={'bg-price'}>
                    Giảm {calculatePricePercent(variant)}%
                  </Badge>
                  <Badge className={'bg-green'}>Trả góp 0%</Badge>
                </div>
                <div className={twMerge('flex gap-3 mt-3')} key={index}>
                  <div>
                    <div
                      aria-hidden="true"
                      style={{
                        backgroundImage: `url(${
                          (
                            product?.feature_image_detail?.image ||
                            productContext?.variantActive?.images?.[0]?.image
                          )?.url || noImage.src
                        })`,
                        backgroundSize: 'contain',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                      }}
                      className={'w-[70px] h-[70px] min-w-[70px]'}
                    />
                  </div>
                  <div>
                    <h3 className={'font-semibold'}>
                      {product.title || product.name}
                    </h3>
                    <ProductPrice
                      variant={variant}
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
