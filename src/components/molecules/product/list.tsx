import SectionSwiper from '@/components/organisms/sectionSwiper';
import ProductCard from '@/components/organisms/product/card';
import { ProductDto } from '@/dtos/Product.dto';
import { PromotionsDto } from '@/dtos/Promotions.dto';
import { SettingsDto } from '@/dtos/Settings.dto';
import { ReactNode } from 'react';
type Props = {
  products: ProductDto[];
  isShowConfiguration?: boolean;
  title?: string;
  rightTitle?: string | ReactNode;
  setting?: SettingsDto;
  buttonText?: string;
  promotion?: PromotionsDto;
};
export default function ProductList({
  products,
  isShowConfiguration,
  title,
  setting,
  promotion,
  buttonText,
  rightTitle,
}: Props) {
  return (
    <div
      style={{ backgroundColor: setting?.value?.backgroundColor }}
      className={
        'w-full shadow-custom bg-white my-1 lg:my-3 p-1 lg:p-3 max-lg:overflow-hidden'
      }
    >
      <div className={'flex justify-between items-center'}>
        <p className={'text-2xl font-[700] lg:font-bold text-primary mb-3'}>
          {title}
        </p>
        {rightTitle}
      </div>

      <SectionSwiper
        slidesPerView={5}
        slidePerViewMobile={2}
        spaceBetween={10}
        auto={true}
        loop={false}
        renderItem={(item: unknown) => {
          const product = item as ProductDto;
          const variant = (product?.variants || [])?.find(
            (item) => item.is_default,
          );
          if (!variant || !variant.regular_price) {
            return (<></>) as ReactNode;
          }

          return (variant && (
            <ProductCard
              product={product}
              variant={variant}
              promotions={promotion && [promotion]}
              addText={buttonText}
              isShowConfiguration={isShowConfiguration}
            />
          )) as ReactNode;
        }}
        data={products}
      />
    </div>
  );
}
