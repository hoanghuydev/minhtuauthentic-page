import { ProductDto } from '@/dtos/Product.dto';
import ProductCard from '@/components/organisms/product/card';
import SortBy from '@/components/organisms/categoryFilter/ContentFilter/sortBy';
import { useContext, useEffect, useMemo, useState } from 'react';
import PageLimit from '@/components/organisms/categoryFilter/ContentFilter/pageLimit';
import CategoryFilterContext from '@/contexts/categoryFilterContext';
import Loading from '@/components/atoms/loading';
import FilterBy from '@/components/organisms/categoryFilter/ContentFilter/filterBy';
import { ProductFilterOptionDto } from '@/dtos/ProductFilterSettingOption/ProductFilterOption.dto';
import { ProductConfigurationValuesDto } from '@/dtos/productConfigurationValues.dto';
import { SlugDto } from '@/dtos/Slug.dto';
import { Pagination, Button } from 'antd/es';
import Filter from '@/components/icons/filter';
import { CategoryDto } from '@/dtos/Category.dto';
import { ResponseMenuDto } from '@/dtos/responseMenu.dto';
import Link from 'next/link';
import { generateSlugToHref } from '@/utils';
import { twMerge } from 'tailwind-merge';
import { VariantDto } from '@/dtos/Variant.dto';

type Props = {
  settings?: ProductFilterOptionDto;
  variants: VariantDto[];
  slugData: SlugDto;
  total: number;
  title?: string;
  menu?: ResponseMenuDto;
};

export default function FeaturedProductsFilter({
  variants,
  settings,
  slugData,
  total,
  menu,
  title,
}: Props) {
  const ctx = useContext(CategoryFilterContext);
  const [_variants, setVariants] = useState<VariantDto[]>(variants);
  const [isReady, setIsReady] = useState(false);
  const [currentUrl, setCurrentUrl] = useState<string>(
    typeof window !== 'undefined' ? window.location.search : '',
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleURLChange = () => {
        setCurrentUrl(window.location.search);
      };

      window.addEventListener('popstate', handleURLChange);

      return () => {
        window.removeEventListener('popstate', handleURLChange);
      };
    }
  }, []);

  // useEffect(() => {
  //   ctx?.setTotal && ctx.setTotal(total);
  // }, [total]);

  // // Cập nhật products khi props products thay đổi (SSR)
  useEffect(() => {
    if (variants?.length > 0) {
      setVariants(variants);
      ctx?.setProducts && ctx.setProducts(variants);
    }
  }, [variants]);

  const convertSettingToObject = () => {
    let obj: Record<string, Record<string, string>> = {
      sex: {
        0: 'Nữ',
        1: 'Nam',
        2: 'Unisex',
      },
    };
    if (settings) {
      Object.keys(settings).map((setting) => {
        const value = (settings as any)[setting];
        if (Array.isArray(value)) {
          switch (setting) {
            case 'concentration_gradients':
            case 'fragrance_retention':
            case 'categories':
              obj[setting] = value.reduce((acc, item) => {
                acc[item.id] = item.name;
                return acc;
              }, {});
              break;
            case 'price_range':
              obj[setting] = value.reduce((acc, item) => {
                acc[item.min + '_' + item.max] = item.label;
                return acc;
              }, {});
              break;
            case 'product_configurations':
              obj[setting] = {};
              value.map((item) => {
                item.values.map((item2: ProductConfigurationValuesDto) => {
                  obj[setting][item2.id as any] = item2.value || '';
                });
              });
              break;
          }
        }
      });
    }
    return obj;
  };

  useEffect(() => {
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (
      ctx?.setObjFilterByValue &&
      Object.keys(ctx?.objFilterByValue).length === 0
    ) {
      ctx.setObjFilterByValue(convertSettingToObject());
    }
    if (ctx?.setDataSlug) {
      ctx.setDataSlug(slugData);
    }
    // Initialize products from SSR
    if (ctx?.setProducts && variants?.length > 0) {
      ctx.setProducts(variants);
    }
  }, []);

  useEffect(() => {
    if (isReady && ctx?.products) {
      setVariants(ctx.products);
    }
  }, [ctx?.products, isReady]);

  const renderProduct = useMemo(() => {
    return (
      <>
        {_variants?.length ? (
          <div
            className={
              'grid grid-cols-2 lg:grid-cols-4 w-full gap-1 lg:gap-3 relative'
            }
          >
            {_variants.map((variant, index) => {
              if (!variant || !variant.product) {
                return null;
              }
              return (
                <ProductCard
                  key={`${variant.product.id}-${variant.id}`}
                  product={variant.product}
                  variant={variant}
                  isShowListVariant={true}
                  preloadVariants={true}
                />
              );
            })}
          </div>
        ) : (
          <h4 className={'text-center text-primary font-semibold w-full'}>
            Không có sản phẩm nào
          </h4>
        )}
      </>
    );
  }, [_variants]);
  const renderTitle = () => {
    return (
      <div className="mb-3 lg:mb-6">
        <h1 className={'mb-2'}>
          <span className={'text-3xl text-primary font-semibold'}>
            {title}
          </span>
        </h1>
      </div>
    );
  };
  return (
    <div className={'p-3 w-full lg:col-span-5'}>
      {renderTitle()}
      <div className={'hidden'}>
        {(menu?.homeMenuCategory || [])?.map((item, index) => {
          return <h2 key={index}>{item?.category?.name}</h2>;
        })}
      </div>
      <div className={'mb-3 lg:mb-6'}>
        <span className={'font-semibold text-[16px] shrink-0'}>Lọc theo:</span>
        <FilterBy brands={menu?.brands} />
      </div>
      <div className={'flex items-center gap-2 flex-wrap mb-3 lg:hidden'}>
        <Button
          type={'link'}
          className={'lg:hidden flex gap-1 p-0'}
          onClick={() => {
            ctx?.setIsOpenFilter && ctx.setIsOpenFilter(true);
          }}
        >
          <Filter className={'w-6 h-6'} />
          <span className={'font-semibold text-[14px] shrink-0 z'}>
            Bộ lọc |{' '}
          </span>
        </Button>
        <span className={'font-semibold text-[14px]'}>Sắp xếp theo</span>
        <SortBy isNeedWrapper={false} />
        <PageLimit />
      </div>
      <div className={'flex flex-col mb-3 lg:mb-6 max-lg:hidden'}>
        <span className={'font-semibold text-[16px] w-full mb-3'}>
          Sắp xếp theo
        </span>
        <div
          className={
            'flex max-lg:flex-col lg:justify-between lg:items-center gap-3'
          }
        >
          <SortBy isNeedWrapper={true} />
          <PageLimit />
        </div>
      </div>
      <div className={'relative'}>
        {/* {ctx?.loading && (
          <div
            className={
              'absolute h-full w-full flex top-0 left-0 p-1 justify-center items-center z-[1] bg-[rgb(255_255_255_/_70%)]'
            }
          >
            <Loading />
          </div>
        )} */}
        {renderProduct}
        <div className={'flex justify-center mt-3'}>
          {ctx?.limit && ctx?.limit > -1 && ctx?.total > 0 && (
            <Pagination
              key={currentUrl}
              defaultCurrent={1}
              total={ctx?.total}
              showQuickJumper={true}
              showSizeChanger={false}
              current={
                Number(
                  new URLSearchParams(window.location.search).get('page'),
                ) ||
                ctx?.page ||
                1
              }
              pageSize={ctx?.limit || 12}
              onChange={(page: number) => {
                const params = new URLSearchParams(window.location.search);
                params.set('page', page.toString());

                // Use router.push with shallow: false to ensure full page reload
                // which is better for pagination navigation
                if (ctx?.router) {
                  const newUrl = `${
                    window.location.pathname
                  }?${params.toString()}`;
                  ctx.router.push(newUrl);
                } else {
                  // Fallback to direct URL change if router is not available
                  window.location.href = `${process.env.NEXT_PUBLIC_APP_URL}${
                    window.location.pathname
                  }?${params.toString()}`;
                }
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
