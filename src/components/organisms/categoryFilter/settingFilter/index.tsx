import { ProductFilterOptionDto } from '@/dtos/ProductFilterSettingOption/ProductFilterOption.dto';
import { ReactNode, useEffect } from 'react';
import SettingFilterItem from '@/components/organisms/categoryFilter/settingFilter/item';
import { ConcentrationGradientDto } from '@/dtos/ConcentrationGradient.dto';
import { FragranceRetentionDto } from '@/dtos/FragranceRetention.dto';
import { SexName } from '@/utils';
import { ProductConfigurationsDto } from '@/dtos/productConfigurations.dto';
import { ProductConfigurationValuesDto } from '@/dtos/productConfigurationValues.dto';
import { ProductFilterPriceRangeDto } from '@/dtos/ProductFilterSettingOption/ProductFilterPriceRange.dto';
import orderBy from 'lodash/orderBy';
import { BrandDto } from '@/dtos/Brand.dto';
import { CategoryDto } from '@/dtos/Category.dto';
import { Entity } from '@/config/enum';
import { twMerge } from 'tailwind-merge';

type Props = {
  settings?: ProductFilterOptionDto;
  className?: string;
  isNav?: boolean;
  brands?: BrandDto[];
};
export default function SettingFilter({
  settings,
  className,
  isNav,
  brands,
}: Props) {
  const renderBrands = () => {
    if (!brands?.length) return null;
    return (
      <SettingFilterItem
        key="brands"
        filterKey="brands"
        title={'Nhãn hiệu'}
        entity={Entity.BRANDS}
        value={brands.map((item: BrandDto) => ({
          id: item.id,
          name: item.name,
        }))}
        isNav={isNav}
      />
    );
  };

  const renderTree = (): ReactNode[] => {
    let xhtml: { sort: number; data: ReactNode }[] = [];
    Object.keys(settings || {}).forEach((key) => {
      switch (key) {
        case 'categories':
          (settings?.[key] as CategoryDto[]).length > 0 &&
            xhtml.push({
              sort: 0,
              data: (
                <SettingFilterItem
                  key={key}
                  filterKey={key}
                  title={'Danh mục'}
                  value={settings?.[key] || []}
                  entity={Entity.CATEGORIES}
                  isNav={isNav}
                />
              ),
            });
          break;
        case 'concentration_gradients':
          (settings?.[key] as ConcentrationGradientDto[]).length > 0 &&
            xhtml.push({
              sort: 4,
              data: (
                <SettingFilterItem
                  key={key}
                  filterKey={key}
                  title={'Nồng độ'}
                  value={settings?.[key] || []}
                  isNav={isNav}
                />
              ),
            });
          break;
        case 'fragrance_retention':
          (settings?.[key] as FragranceRetentionDto[]).length > 0 &&
            xhtml.push({
              sort: 5,
              data: (
                <SettingFilterItem
                  key={key}
                  filterKey={key}
                  title={'Lưu hương'}
                  value={settings?.[key] || []}
                  isNav={isNav}
                />
              ),
            });
          break;
        case 'sex':
          (settings?.[key] as number[]).length > 0 &&
            xhtml.push({
              sort: 3,
              data: (
                <SettingFilterItem
                  key={key}
                  filterKey={key}
                  title={'Giới tính'}
                  value={(settings?.[key] || []).map((item) => ({
                    id: item,
                    name: SexName(item),
                  }))}
                  isNav={isNav}
                />
              ),
            });
          break;
        case 'price_range':
          (settings?.[key] as ProductFilterPriceRangeDto[]).length > 0 &&
            xhtml.push({
              sort: 1,
              data: (
                <SettingFilterItem
                  key={key}
                  filterKey={key}
                  title={'Phạm Vi Giá'}
                  value={(settings?.[key] || []).map(
                    (item: ProductFilterPriceRangeDto) => {
                      return {
                        id: item.min + '_' + item.max,
                        name: item.label,
                      };
                    },
                  )}
                  isNav={isNav}
                />
              ),
            });
          break;
        case 'product_configurations':
          (
            settings?.[key] as {
              configuration: ProductConfigurationsDto;
              values: ProductConfigurationValuesDto[];
            }[]
          ).length > 0 &&
            (settings?.[key] || []).map(
              (item: {
                configuration: ProductConfigurationsDto;
                values: ProductConfigurationValuesDto[];
              }) => {
                xhtml.push({
                  sort: 2,
                  data: (
                    <SettingFilterItem
                      key={key}
                      filterKey={key}
                      title={item.configuration.name || ''}
                      value={item.values.map((value) => ({
                        id: value.id,
                        name: value.value,
                      }))}
                      isNav={isNav}
                    />
                  ),
                });
              },
            );
          break;
      }
    });

    // Add brands to the tree with sort order 6
    if (brands?.length) {
      xhtml.push({
        sort: 6,
        data: renderBrands(),
      });
    }

    return orderBy(xhtml, ['sort'], ['asc']).map(
      (item: { sort: number; data: ReactNode }) => item?.data,
    );
  };
  return <div className={twMerge('p-3', className)}>{renderTree()}</div>;
}
