import { ProductDto } from '@/dtos/Product.dto';
import { twMerge } from 'tailwind-merge';
import { ImageDto } from '@/dtos/Image.dto';
import Link from 'next/link';
import ImageWithFallback from '@/components/atoms/images/ImageWithFallback';
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
      >
        <ImageWithFallback
          image={image}
          className={
            'object-contain w-full h-full hover:scale-105 transition-transform duration-300'
          }
          product={product}
          // Chỉ thumbnail trong card đi qua /_next/image. Ảnh chính ở trang chi
          // tiết sản phẩm tự truyền `unoptimized={true}` (productDetailImage.tsx)
          // nên không bị ảnh hưởng — file gốc 1000x1000 vẫn được phục vụ nguyên vẹn.
          unoptimized={false}
          // Bắt buộc 75: Next 16 mặc định chỉ cho phép `qualities: [75]`, mà
          // ImageWithFallback lùi về 70 khi không truyền ⇒ optimizer trả 400.
          quality={75}
          // Đo thực tế bề rộng card trên 6 breakpoint: tối đa 89vw ở ≤1023px
          // (card lớn trong lưới 1 cột) và tối đa 369px từ 1024px trở lên.
          // Khai báo nhỉnh hơn mức đo được để trình duyệt không bao giờ chọn
          // ảnh hẹp hơn khung hiển thị.
          sizes="(max-width: 1023px) 90vw, 380px"
        />
      </Link>
    </div>
  );
};
export default ProductCardImage;
