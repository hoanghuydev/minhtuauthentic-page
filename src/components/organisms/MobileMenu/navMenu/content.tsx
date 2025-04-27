import React, { Fragment, useContext } from 'react';
import { ProductFilterOptionDto } from '@/dtos/ProductFilterSettingOption/ProductFilterOption.dto';
import { MenuDisplay } from '@/config/type';
import { StaticComponentDto } from '@/dtos/StaticComponent.dto';
import Link from 'next/link';
import { generateSlugToHref, SexName } from '@/utils';
import { BrandDto } from '@/dtos/Brand.dto';
import BrandWithImage from '@/components/atoms/brands/brandWithImage';
import { ImageDetailDto } from '@/dtos/ImageDetail.dto';
import { SlugDto } from '@/dtos/Slug.dto';
import { ProductConfigurationsDto } from '@/dtos/productConfigurations.dto';
import { ProductConfigurationValuesDto } from '@/dtos/productConfigurationValues.dto';
import sortBy from 'lodash/sortBy';
import AppContext from '@/contexts/appContext';
type Props = {
  setting?: ProductFilterOptionDto;
  menu: MenuDisplay;
  brands: BrandDto[];
};

type DataValue = {
  label: string;
  value: string;
  image?: ImageDetailDto[];
  slug?: SlugDto;
};

type FilterSettingItem = {
  label: string;
  name: string;
  data: DataValue[];
  sort: number;
};

export default function NavMenuContent({ setting, menu, brands }: Props) {
  const _menu = menu.data as StaticComponentDto;

  const ctx = useContext(AppContext);

  const generateLabel = (label: string) => {
    const obj: Record<string, string> = {
      brands: 'Thương hiệu',
      price_range: 'Phạm vi giá',
      concentration_gradients: 'Nồng độ',
      fragrance_retention: 'Độ giữ mùi',
      sex: 'Giới tính',
      product_configurations: 'Biến thể',
    };
    return obj[label] || label;
  };

  const generateValue = (name: string, items: unknown[]): DataValue[] => {
    const obj: Record<string, () => any> = {
      brands: () => {
        return brands.slice(0, 20).map((item) => {
          return {
            label: item.name,
            value: item.id,
            image: item.images,
            slug: item.slugs,
          };
        });
      },
      sex: () => {
        return [0, 1, 2].map((item) => {
          return {
            label: SexName(item) as string,
            value: item.toString(),
          };
        });
      },
      price_range: () => {
        const priceRange = items as {
          label: string;
          min: number;
          max: number;
        }[];
        return priceRange.map((item) => {
          return {
            label: item.label,
            value: item.min + '_' + item.max,
          };
        });
      },
      product_configurations: () => {
        const _configurations = items as {
          configuration: ProductConfigurationsDto;
          values: ProductConfigurationValuesDto[];
        }[];
        const _itemConfigurations: Record<
          string,
          { label: string; value: number }[]
        > = {};
        _configurations.forEach((item) => {
          _itemConfigurations[item?.configuration?.name || ''] = [];
          item.values.forEach((value) => {
            _itemConfigurations[item.configuration.name || ''].push({
              label: value.value || '',
              value: value.id || 0,
            });
          });
        });
        return Object.keys(_itemConfigurations).map((key) => {
          return {
            label: key,
            data: _itemConfigurations[key],
          };
        });
      },
      fragrance_retention: () => {
        return items.map((item: any) => {
          return {
            label: item.name as string,
            value: item.id as number,
          };
        });
      },
      concentration_gradients: () => {
        return items.map((item: any) => {
          return {
            label: item.name as string,
            value: item.id as number,
          };
        });
      },
    };
    let data: any = [];
    if (obj[name]) {
      data = [...obj[name]()];
    }

    return data;
  };

  const renderItemDetail = (name: string, url: string, item: DataValue) => {
    switch (name) {
      case 'brands':
        return (
          <BrandWithImage
            className={'p-[5px_10px]'}
            classNameImage={'max-w-[50px] object-contain'}
            brand={
              new BrandDto({
                images: item.image,
                slugs: item.slug,
              })
            }
          />
        );
      default:
        return (
          <Link
            href={url}
            className={'border border-gray-200 p-2 rounded-[10px] block'}
            onClick={() => {
              ctx?.setIsOpenNavMenu && ctx?.setIsOpenNavMenu(false);
            }}
          >
            {item.label}
          </Link>
        );
    }
  };

  const filtersSetting: FilterSettingItem[] = Object.keys(setting || {}).map(
    (key) => {
      let sort = 0;
      switch (key) {
        case 'price_range':
          sort = 1;
          break;
        case 'product_configurations':
          sort = 3;
          break;
        case 'sex':
          sort = 4;
          break;
        case 'concentration_gradients':
          sort = 5;
          break;
        case 'fragrance_retention':
          sort = 6;
          break;
        case 'brands':
          sort = 7;
          break;
      }
      return {
        name: key,
        label: generateLabel(key),
        data: generateValue(key, (setting as any)[key]),
        sort,
        // value: setting[key],
      };
    },
  );

  const renderItem = (item: FilterSettingItem) => {
    return (
      <div className={'p-2'}>
        <p className={'font-semibold text-md pb-1'}>{item.label}</p>
        <div className={'flex flex-wrap gap-2'}>
          {(item.data || []).map((_item, index) => {
            const url =
              generateSlugToHref(_menu?.category?.slugs?.slug) +
              `?filter[${item.name}][0]=${_item.value}`;
            return (
              <Fragment key={'content-filter-' + index}>
                {renderItemDetail(item.name, url, _item)}
              </Fragment>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className={'flex items-center justify-between p-3'}>
        <Link
          className={'text-xl font-[700] lg:font-bold'}
          href={generateSlugToHref(_menu?.category?.slugs?.slug)}
        >
          {_menu.category?.name}
        </Link>
        <Link
          className={'text-sm'}
          href={generateSlugToHref(_menu?.category?.slugs?.slug)}
        >
          Xem tất cả
        </Link>
      </div>
      <div className={'flex flex-col'}>
        {sortBy(filtersSetting, 'sort').map((item, index) => {
          if (item.name === 'categories') {
            return null;
          }
          if (item.name === 'product_configurations') {
            const _item = item?.data as unknown as FilterSettingItem[];

            return (_item || []).map((__item, index2) => {
              __item.name = item.name;
              return (
                <Fragment key={'content-filter-' + index + index2}>
                  {renderItem(__item)}
                </Fragment>
              );
            });
          }
          return (
            <Fragment key={'content-filter-' + index}>
              {renderItem(item)}
            </Fragment>
          );
        })}
      </div>
    </>
  );
}
