import { ProductFilterOptionDto } from '@/dtos/ProductFilterSettingOption/ProductFilterOption.dto';
import { CategoryDto } from '@/dtos/Category.dto';
import Link from 'next/link';

type Props = {
  filterSetting?: ProductFilterOptionDto;
  categories: CategoryDto[];
  title?: string;
};
export default function MenuPopupCategory({
  filterSetting,
  categories,
  title,
}: Props) {
  const renderItem = () => {
    const listDisplay: Record<
      string,
      { label: string; data: { slug: string; name: string }[] }
    > = {};
    if (categories?.length > 0) {
      listDisplay.categories_child = {
        label: 'Danh mục',
        data: [],
      };
      categories.forEach((category) => {
        listDisplay?.categories_child?.data.push({
          slug: category?.slugs?.slug || '',
          name: category.name || '',
        });
      });
    }

    if (filterSetting) {
      Object.keys(filterSetting).forEach((setting) => {
        switch (setting) {
          case 'brands':
            if (!listDisplay.brands) {
              listDisplay.brands = {
                label: 'Thương hiệu',
                data: [],
              };
            }
            listDisplay.brands.data = (filterSetting?.brands || []).map(
              (brand) => ({
                slug: `/san-pham?brands=` + brand.id,
                name: brand.name || '',
              }),
            );
            break;
          case 'concentration_gradients':
            if (!listDisplay.concentration_gradients) {
              listDisplay.concentration_gradients = {
                label: 'Nồng độ',
                data: [],
              };
            }
            listDisplay.concentration_gradients.data = (
              filterSetting?.concentration_gradients || []
            ).map((concentration, index2) => {
              return {
                slug:
                  `/san-pham?filter[${setting}][${index2}]=` + concentration.id,
                name: concentration.name || '',
              };
            });
            break;
          case 'price_range':
            if (!listDisplay.price_range) {
              listDisplay.price_range = {
                label: 'Mức giá',
                data: [],
              };
            }
            listDisplay.price_range.data = (
              filterSetting?.price_range || []
            ).map((price, index2) => {
              return {
                slug:
                  `/san-pham?filter[${setting}][${index2}]=` +
                  price.min +
                  '_' +
                  price.max,
                name: price.label || '',
              };
            });
            break;
        }
      });
    }

    return (
      <>
        {Object.keys(listDisplay).map((key) => {
          return (
            <div key={key}>
              <h3 className={'text-xl font-semibold mb-3'}>
                {listDisplay[key].label}
              </h3>
              <ul className={'flex flex-col gap-1'}>
                {listDisplay[key].data.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.slug}
                      className="block w-full px-2 py-1 hover:bg-gray-100 rounded"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </>
    );
  };

  return (
    <>
      {title && (
        <p className={'mb-3 text-3xl font-[700] lg:font-bold'}>{title}</p>
      )}
      <div className={'grid grid-cols-4'}>{renderItem()}</div>
    </>
  );
}
