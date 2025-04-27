import { ProductDto } from '@/dtos/Product.dto';
import { generateSlugToHref, SexName } from '@/utils';
import Link from 'next/link';

type Props = {
  product: ProductDto;
};
export default function ProductInformation({ product }: Props) {
  const fields = [
    {
      label: 'Thương hiệu',
      value: (
        <Link
          href={generateSlugToHref(product?.brands?.[0]?.brand?.slugs?.slug)}
          className={'text-primary font-[700] lg:font-bold'}
        >
          {product?.brands?.[0]?.brand?.name || ''}
        </Link>
      ),
      is_visible: !!product?.brands?.[0]?.brand?.name,
    },
    {
      label: 'Xuất xứ',
      value: (
        <span className={'font-[700] lg:font-bold'}>
          {product?.product_property?.origin}
        </span>
      ),
      is_visible: !!product?.product_property?.origin,
    },
    {
      label: 'Giới tính',
      value: (
        <span className={'font-[700] lg:font-bold'}>
          {SexName(
            product?.product_property?.sex === 0
              ? 0
              : product?.product_property?.sex || 2,
          )}
        </span>
      ),
      is_visible: !!product?.product_property?.sex != null,
    },
    {
      label: 'Nồng độ',
      value: (
        <span className={'font-[700] lg:font-bold'}>
          {product?.concentration_gradient?.name}
        </span>
      ),
      is_visible: !!product?.concentration_gradient?.name,
    },
    {
      label: 'Năm ra mắt',
      value: (
        <span className={'font-[700] lg:font-bold'}>
          {product?.product_property?.year}
        </span>
      ),
      is_visible: !!product?.product_property?.year,
    },
    {
      label: 'Nhà pha chế',
      value: (
        <span className={'font-[700] lg:font-bold'}>
          {product?.product_property?.mixer}
        </span>
      ),
      is_visible: !!product?.product_property?.mixer,
    },
    {
      label: 'Độ lưu hương',
      value: (
        <span className={'font-[700] lg:font-bold'}>
          {product?.fragrance_retention?.name}
        </span>
      ),
      is_visible: !!product?.fragrance_retention?.name,
    },
    {
      label: 'Độ toả hương',
      value: (
        <span className={'font-[700] lg:font-bold'}>
          {product?.product_property?.fragrance_level}
        </span>
      ),
      is_visible: !!product?.product_property?.fragrance_level,
    },
    {
      label: 'Phong cách',
      value: (
        <span className={'font-[700] lg:font-bold'}>
          {product?.product_property?.style}
        </span>
      ),
      is_visible: !!product?.product_property?.style,
    },
    {
      label: 'Khuyên dùng',
      value: (
        <span className={'font-[700] lg:font-bold'}>
          {product?.product_property?.recommend}
        </span>
      ),
      is_visible: !!product?.product_property?.recommend,
    },
  ];

  return (
    <div className={'rounded-[10px] shadow-custom bg-white'}>
      <h2 className={'font-[700] lg:font-bold text-primary text-[24px] p-3'}>
        Thông tin sản phẩm
      </h2>
      <table className={'w-full'}>
        <tbody>
          {fields
            .filter((item) => item.is_visible)
            .map((item, index) => {
              return (
                <tr
                  className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}
                  key={index}
                >
                  <td className={'p-3'}>{item.label}</td>
                  <td>{item.value}</td>
                </tr>
              );
            })}
          {product?.product_property?.fragrant && (
            <>
              <tr className={'bg-gray-100'}>
                <td className={'p-3'} colSpan={2}>
                  <span>Mùi hương</span>
                </td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <div
                    className={'p-3'}
                    dangerouslySetInnerHTML={{
                      __html: product?.product_property?.fragrant || '',
                    }}
                  />
                </td>
              </tr>
            </>
          )}
        </tbody>
      </table>
    </div>
  );
}
