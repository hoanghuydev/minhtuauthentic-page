import { ProductFilterOptionDto } from '@/dtos/ProductFilterSettingOption/ProductFilterOption.dto';
import { CategoryDto } from '@/dtos/Category.dto';
import Link from 'next/link';
import { BrandDto } from '@/dtos/Brand.dto';
import { ImageDetailDto } from '@/dtos/ImageDetail.dto';
import BrandWithImage from '@/components/atoms/brands/brandWithImage';
import { useContext, useEffect, useRef, useState } from 'react';
import ProductSmallCard from '../../product/productSmallCard';
import { generateSlugToHref } from '@/utils';
import AppContext from '@/contexts/appContext';
import { twMerge } from 'tailwind-merge';

type MenuItemData = {
  slug: string;
  name: string;
  images?: ImageDetailDto[];
};

type MenuSection = {
  label: string;
  data: MenuItemData[];
};

type MenuSections = Record<string, MenuSection>;

type Props = {
  filterSetting?: ProductFilterOptionDto;
  data: CategoryDto;
  title?: string;
  brands: BrandDto[];
  currentCategoryId?: number;
};

const MenuPopupCategory = ({
  title,
  data,
  brands,
  filterSetting,
  currentCategoryId,
}: Props) => {
  const appCtx = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(false);
  const [brandsRandom, setBrandsRandom] = useState<BrandDto[]>([]);
  const [isReversed, setIsReversed] = useState<boolean>(false);
  const [filterOrder, setFilterOrder] = useState<string[]>([
    'concentration_gradients',
    'price_range',
  ]);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Get hint products from context or empty array if not available
  const hintProducts = data.hint_products || [];

  useEffect(() => {
    // Toggle position between left-right and right-left
    setIsReversed((prev) => !prev);
    setFilterOrder(
      isReversed
        ? ['concentration_gradients', 'price_range']
        : ['price_range', 'concentration_gradients'],
    );

    // Cleanup function to abort fetch when component unmounts or currentCategoryId changes
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [currentCategoryId, appCtx]);

  useEffect(() => {
    setBrandsRandom(brands.sort(() => 0.5 - Math.random()).slice(0, 8));
  }, [currentCategoryId]);

  // Helper function to create filter data
  const createFilterData = (
    setting: string,
    items: any[],
    mapFn: (item: any, index: number) => MenuItemData,
  ): MenuItemData[] => {
    return items.map(mapFn);
  };

  // Render a menu section with title and items
  const renderMenuSection = (section: MenuSection) => (
    <div>
      <h3 className={'text-xl font-semibold mb-3'}>{section.label}</h3>
      <ul className={'flex flex-col gap-1'}>
        {section.data.map((item, index) => (
          <li key={index}>
            <Link
              href={item.slug}
              className="block w-full px-2 py-1 hover:text-primary rounded"
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );

  // Render brands section
  const renderBrandsSection = () => (
    <div className="h-full overflow-hidden">
      <h3 className={'text-xl font-semibold mb-3'}>Thương hiệu</h3>
      <div className={'grid grid-cols-2 gap-2'}>
        {brandsRandom.map((item, index) => (
          <BrandWithImage
            className={'p-[5px_10px]'}
            classNameImage={'max-w-[50px] object-contain'}
            key={index}
            brand={
              new BrandDto({
                images: item.images,
                slugs: item.slugs,
              })
            }
          />
        ))}
      </div>
      {brands.length > 10 && (
        <div className="text-center mt-3">
          <Link
            href={generateSlugToHref('thuong-hieu')}
            className="inline-block px-4 py-2 text-primary hover:text-primary-dark font-medium"
          >
            Xem tất cả
          </Link>
        </div>
      )}
    </div>
  );

  // Render suggested products section
  const renderSuggestedProducts = () => (
    <div className="flex-1">
      <h3 className={'text-xl font-semibold mb-3'}>Sản phẩm gợi ý</h3>
      {isLoading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        hintProducts.length > 0 && (
          <div className="flex-1 flex flex-col gap-2">
            {hintProducts.map((product, index) => (
              <ProductSmallCard key={index} product={product} />
            ))}
          </div>
        )
      )}
    </div>
  );

  const buildMenuSections = (): MenuSections => {
    const listDisplay: MenuSections = {};

    // Add categories if they exist
    if (data?.children && data?.children?.length > 0) {
      listDisplay.categories_child = {
        label: '',
        data: data.children.map((category) => ({
          slug: category?.slugs?.slug || '',
          name: category.name || '',
        })),
      };
    }

    // Add filter settings if they exist
    if (filterSetting) {
      filterOrder.forEach((setting) => {
        switch (setting) {
          case 'concentration_gradients':
            listDisplay.concentration_gradients = {
              label: 'Nồng độ',
              data: createFilterData(
                setting,
                filterSetting?.concentration_gradients || [],
                (concentration, index) => ({
                  slug: `/san-pham?filter[${setting}][${index}]=${concentration.id}`,
                  name: concentration.name || '',
                }),
              ).sort(() => 0.5 - Math.random()),
            };
            break;
          case 'price_range':
            listDisplay.price_range = {
              label: 'Mức giá',
              data: createFilterData(
                setting,
                filterSetting?.price_range || [],
                (price, index) => ({
                  slug: `/san-pham?filter[${setting}][${index}]=${price.min}_${price.max}`,
                  name: price.label || '',
                }),
              ),
            };
            break;
        }
      });
    }

    return listDisplay;
  };

  const renderMenuItems = () => {
    const listDisplay = buildMenuSections();
    const showBrands =
      brands?.length > 0 && (!data.children || data.children.length === 0);

    return (
      <>
        {showBrands && renderBrandsSection()}

        {Object.keys(listDisplay)
          .filter(
            (key) => key === 'categories_child' || filterOrder.includes(key),
          )
          .map((key) => renderMenuSection(listDisplay[key]))}
      </>
    );
  };

  return (
    <div className="flex gap-8">
      <div className="flex-1">
        {title && (
          <p className={'mb-3 text-3xl font-[700] lg:font-bold'}>{title}</p>
        )}
        <div className={twMerge('grid gap-4 grid-cols-4')}>
          {renderMenuItems()}
          {renderSuggestedProducts()}
        </div>
      </div>
    </div>
  );
};

export default MenuPopupCategory;
