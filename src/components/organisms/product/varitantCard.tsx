import ImageWithFallback from "@/components/atoms/images/ImageWithFallback";
import ImageWithRatio from "@/components/atoms/images/imageWithRatio";
import { ImageDto } from "@/dtos/Image.dto";
import { VariantDto } from "@/dtos/Variant.dto";
import { useIsMobile } from "@/hooks/useDevice";
import Link from "next/link";

type Props = {
  variant: VariantDto
}

export default function VariantCard ({variant}: Props) {
  const isMobile = useIsMobile();
  return (
    <Link
      href={`/${(variant).product?.slugs?.slug}`}
        key={variant.id}
        className="group cursor-pointer overflow-hidden min-h-[285px]"
      >
        <div
          className={`rounded-lg md:rounded-xl bg-gray-50 transition-all duration-300`}
        >
          <div className="flex flex-col items-start md:flex-row md:items-center">
            {/* Cột 1: Hình ảnh sản phẩm */}
            {isMobile ? (
              <ImageWithFallback
                image={
                  variant.images?.[0]?.image as ImageDto
                }
                className={'object-contain w-full h-full rounded-lg'}
                // product={product}
                sizes={
                  '(max-width: 500px) 100vw, (max-width: 768px) 60vw, (max-width: 1024px) 40vw, 30vw'
                }
                unoptimized={false}
              />
            ) : (
              <div className="flex-shrink-0">
                <div className="w-16 h-16 md:w-24 md:h-24 bg-white rounded-lg md:rounded-xl flex items-center justify-center overflow-hidden">
                  <ImageWithRatio
                    image={
                      (variant).images?.[0]
                        ?.image as ImageDto
                    }
                    imageClassName="w-12 h-12 md:w-20 md:h-20 object-contain group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              </div>
            )}

            {/* Cột 2: Thông tin sản phẩm */}
            <div className="py-2 px-2">
              <h3 className="overflow-hidden text-[14px] min-h-[45px] line-clamp-2 font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                {variant.product?.title}
              </h3>
              {variant?.variant_product_configuration_values?.map(
                (item, index) => {
                  return (
                    <p
                      key={index}
                      className={
                        'text-[12px] min-h-[30px] text-gray-600 font-semibold'
                      }
                    >
                      {
                        item.product_configuration_value
                          ?.product_configuration?.name
                      }
                      : {item.product_configuration_value?.value}
                    </p>
                  );
                },
              )}
              <div className={'flex gap-3 items-center'}>
                <span
                  className={'text-red-600 text-[18px] font-semibold'}
                >
                  {(
                    variant.regular_price || ''
                  ).toLocaleString()}
                </span>
                <span className={'line-through text-[10px]'}>
                  {(variant.price || '').toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
  )
}
