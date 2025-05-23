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

type Props = {
  settings?: ProductFilterOptionDto;
  products: ProductDto[];
  slugData: SlugDto;
  total: number;
  title?: string;
  category?: CategoryDto;
  menu?: ResponseMenuDto;
};

export default function ContentFilter({
  products,
  settings,
  slugData,
  total,
  menu,
  title,
  category,
}: Props) {
  const ctx = useContext(CategoryFilterContext);
  const [_products, setProducts] = useState<ProductDto[]>(products);
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    ctx?.setTotal && ctx.setTotal(total);
  }, []);

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
    if (ctx?.setProducts && products?.length > 0) {
      ctx.setProducts(products);
    }
  }, []);
  useEffect(() => {
    if (isReady) {
      setProducts((ctx?.products || []) as ProductDto[]);
    }
  }, [ctx?.products]);
  const renderProduct = useMemo(() => {
    return (
      <>
        {_products?.length ? (
          <div
            className={
              'grid grid-cols-2 lg:grid-cols-4 w-full gap-1 lg:gap-3 relative'
            }
          >
            {_products.map((product, index) => {
              const variant = (product?.variants || [])?.find(
                (item) => item.is_default || [],
              );
              if (!variant) {
                return;
              }
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  variant={variant}
                  isShowListVariant={true}
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
  }, [_products]);
  const renderTitle = () => {
    if (ctx?.search) {
      return (
        <h1 className={'mb-3 lg:mb-6'}>
          <span className={'text-3xl text-primary font-semibold'}>
            Kết quả tìm kiếm cho:{' '}
          </span>
          <span className={'text-2xl '}>{ctx?.search}</span>
        </h1>
      );
    } else if (title) {
      return (
        <div className="mb-3 lg:mb-6">
          <h1 className={'mb-2'}>
            <span className={'text-3xl text-primary font-semibold'}>
              {title}
            </span>
          </h1>
          {category?.children && category?.children?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {category.children.map((child, index) => (
                <button
                  type={'button'}
                  key={index}
                  onClick={() => {
                    ctx?.updateRouter &&
                      ctx.updateRouter('child', child.slugs?.slug || 'my-pham');
                  }}
                  className={twMerge(
                    'bg-[#f3f4f6] border border-[#e5e7eb] rounded-[10px] text-[12px] p-[5px_10px] transition-colors duration-300',
                    child.slugs?.slug === ctx?.router?.query['child'] &&
                      'bg-primary text-white',
                  )}
                >
                  <span>{child.name}</span>
                </button>
                //     <Link
                //     key={child.id}
                //      href={generateSlugToHref(child.slugs?.slug)}
                //      className="px-3 py-1 bg-gray-100 hover:bg-primary hover:text-white rounded-md text-sm transition-colors"
                // >
                //   {child.name}
                // </Link>
              ))}
            </div>
          )}
        </div>
      );
    }
    return (
      <h1 className={'mb-3 lg:mb-6'}>
        <span className={'text-3xl text-primary font-semibold'}>Sản phẩm</span>
      </h1>
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
        {ctx?.loading && (
          <div
            className={
              'absolute h-full w-full flex top-0 left-0 p-1 justify-center items-center z-[1] bg-[rgb(255_255_255_/_70%)]'
            }
          >
            <Loading />
          </div>
        )}
        {renderProduct}
        <div className={'flex justify-center mt-3'}>
          {ctx?.limit && ctx?.limit > -1 && ctx?.total > 0 && (
            <Pagination
              defaultCurrent={1}
              total={ctx?.total}
              showQuickJumper={true}
              showSizeChanger={false}
              current={ctx?.page || 1}
              pageSize={ctx?.limit || 12}
              onChange={(page: number) => {
                ctx?.updateRouter && ctx.updateRouter('page', page.toString());
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
