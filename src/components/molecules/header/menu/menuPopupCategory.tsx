import { ProductFilterOptionDto } from '@/dtos/ProductFilterSettingOption/ProductFilterOption.dto';
import { CategoryDto } from '@/dtos/Category.dto';
import Link from 'next/link';
import { BrandDto } from '@/dtos/Brand.dto';
import { ImageDetailDto } from '@/dtos/ImageDetail.dto';
import BrandWithImage from '@/components/atoms/brands/brandWithImage';
import { useEffect, useRef, useState } from 'react';
import { ProductDto } from '@/dtos/Product.dto';
import ProductRelation from '@/components/molecules/product/productRelation';
import ProductSmallCard from '../../product/productSmallCard';
import { generateSlugToHref } from '@/utils';

type Props = {
  filterSetting?: ProductFilterOptionDto;
  categories: CategoryDto[];
  title?: string;
  brands: BrandDto[];
  currentCategoryId?: number;
};

const MenuPopupCategory = ({
  title,
  categories,
  brands,
  filterSetting,
  currentCategoryId,
}: Props) => {
  const [hintProducts, setHintProducts] = useState<ProductDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [brandsRandom, setBrandsRandom] = useState<BrandDto[]>([]);
  const [isReversed, setIsReversed] = useState<boolean>(false);
  const [filterOrder, setFilterOrder] = useState<string[]>([
    'concentration_gradients',
    'price_range',
  ]);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // Reset products when menu changes
    setHintProducts([]);
    // Toggle position between left-right and right-left
    setIsReversed((prev) => !prev);
    setFilterOrder(
      isReversed
        ? ['concentration_gradients', 'price_range']
        : ['price_range', 'concentration_gradients'],
    );

    const fetchHintProducts = async () => {
      if (currentCategoryId) {
        // Cancel previous fetch if it exists
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }

        // Create new AbortController for this fetch
        const abortController = new AbortController();
        abortControllerRef.current = abortController;

        setIsLoading(true);
        try {
          const response = await fetch(
            `/api/product/hint?categoryId=${currentCategoryId}&limit=4`,
            {
              signal: abortController.signal,
            },
          );
          const data = await response.json();
          // Only update state if this is the latest fetch
          if (!abortController.signal.aborted) {
            setHintProducts(data.data.products || []);
          }
        } catch (error: any) {
          // Only log error if it's not an abort error
          if (error.name !== 'AbortError') {
            console.error('Error fetching hint products:', error);
          }
        } finally {
          // Only update loading state if this is the latest fetch
          if (!abortController.signal.aborted) {
            setIsLoading(false);
          }
        }
      }
    };

    fetchHintProducts();

    // Cleanup function to abort fetch when component unmounts or currentCategoryId changes
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [currentCategoryId]);

  useEffect(() => {
    setBrandsRandom(brands.sort(() => 0.5 - Math.random()).slice(0, 8));
  }, [currentCategoryId]);

  const renderItem = () => {
    const listDisplay: Record<
      string,
      {
        label: string;
        data: {
          slug: string;
          name: string;
          images?: ImageDetailDto[];
        }[];
      }
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
      filterOrder.forEach((setting) => {
        switch (setting) {
          case 'concentration_gradients':
            if (!listDisplay.concentration_gradients) {
              listDisplay.concentration_gradients = {
                label: 'Nồng độ',
                data: [],
              };
            }
            listDisplay.concentration_gradients.data = (
              filterSetting?.concentration_gradients || []
            )
              .sort(() => 0.5 - Math.random())
              .map((concentration, index2) => {
                return {
                  slug:
                    `/san-pham?filter[${setting}][${index2}]=` +
                    concentration.id,
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
        {brands?.length > 0 && (
          <div className="h-full overflow-hidden">
            <h3 className={'text-xl font-semibold mb-3'}>Thương hiệu</h3>
            <div className={'flex flex-wrap gap-2'}>
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
        )}
        {Object.keys(listDisplay)
          .filter(
            (key) => key === 'categories_child' || filterOrder.includes(key),
          )
          .map((key) => {
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
                        className="block w-full px-2 py-1 hover:text-primary rounded"
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
    <div className="flex gap-8">
      <div className="flex-1">
        {title && (
          <p className={'mb-3 text-3xl font-[700] lg:font-bold'}>{title}</p>
        )}
        <div className={'grid grid-cols-4 gap-4'}>
          {renderItem()}
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
        </div>
      </div>
    </div>
  );
};

export default MenuPopupCategory;
