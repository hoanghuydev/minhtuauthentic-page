import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { CATEGORY_FILTER, Entity } from '@/config/enum';
const CategoryFilterContext = createContext<TypeAppState | undefined>(
  undefined,
);
import { NextRouter, useRouter } from 'next/router';
import { ProductDto } from '@/dtos/Product.dto';
import { ResponseCategoryFilterPageDto } from '@/dtos/responseCategoryFilterPage.dto';
import { SlugDto } from '@/dtos/Slug.dto';
import { getFilterFromQuery, parseQueryString } from '@/utils';
import { forEach } from 'lodash';

export type TypeAppState = {
  objFilterByValue: Record<string, Record<string, string>>;
  setObjFilterByValue:
    | Dispatch<SetStateAction<Record<string, Record<string, string>>>>
    | undefined;
  page: number;
  setPage: Dispatch<SetStateAction<number>> | undefined;
  total: number;
  setTotal: Dispatch<SetStateAction<number>> | undefined;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>> | undefined;
  search: string;
  setSearch: Dispatch<SetStateAction<string>> | undefined;
  dataSlug: SlugDto | null;
  setDataSlug: Dispatch<SetStateAction<SlugDto | null>> | undefined;
  products: ProductDto[];
  setProducts: Dispatch<SetStateAction<ProductDto[]>> | undefined;
  sortBy: string;
  setSortBy: Dispatch<SetStateAction<string>> | undefined;
  limit: number;
  setLimit: Dispatch<SetStateAction<number>> | undefined;
  settings?: Record<string, string>;
  setSettings?: Dispatch<SetStateAction<Record<string, string>>> | undefined;
  filters?: Record<string, (number | string)[]>;
  setFilters?:
    | Dispatch<SetStateAction<Record<string, (number | string)[]>>>
    | undefined;
  isOpenFilter?: boolean;
  setIsOpenFilter?: Dispatch<SetStateAction<boolean>> | undefined;
  updateRouter?: (key: string, value: string | object) => void;
  router?: NextRouter;
};

export const CategoryFilterProvider = ({
  children,
  isSearch,
}: {
  children: React.ReactNode;
  isSearch?: boolean;
}) => {
  const router = useRouter();
  const queryString = new URLSearchParams(
    router.query as Record<string, string>,
  );
  const [sortBy, setSortBy] = useState<string>(
    queryString.get('sort') || CATEGORY_FILTER.SORT_BY.DATE_DESC,
  );
  const [dataSlug, setDataSlug] = useState<SlugDto | null>(null);

  const [limit, setLimit] = useState<number>(
    Number(queryString.get('limit')) || 12,
  );
  const [isOpenFilter, setIsOpenFilter] = useState<boolean>(false);
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>(queryString.get('search') || '');
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [objFilterByValue, setObjFilterByValue] = useState<
    Record<string, Record<string, string>>
  >({});
  const [filters, setFilters] = useState<Record<string, (number | string)[]>>(
    parseQueryString(queryString.toString()),
  );
  const refTimer = React.useRef<NodeJS.Timeout | null>(null);
  const refTimerUpdateRoute = React.useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (dataSlug) {
      const object = getFinalFilter(getFilterFromQuery(queryString.toString()));
      if (router.query?.page && page !== Number(router.query?.page)) {
        setPage(Number(router.query?.page));
      }
      setFilters(object);
    }
  }, [dataSlug]);

  useEffect(() => {
    const handleRouteComplete = () => {
      const queryString = new URLSearchParams(
        router.query as Record<string, string>,
      );
      const filter = getFinalFilter(getFilterFromQuery(queryString.toString()));

      if (refTimer.current) {
        clearTimeout(refTimer.current as NodeJS.Timeout);
        refTimer.current = null;
      }
      refTimer.current = setTimeout(() => {
        setLoading(true);
        setPage(Number(queryString.get('page')) || 1);
        setSortBy(queryString.get('sort') || CATEGORY_FILTER.SORT_BY.DATE_DESC);
        setLimit(Number(queryString.get('limit')) || 12);
        setSearch(queryString.get('search') || '');
        setFilters(filter);
        refreshData()
          .catch((err) => {})
          .finally(() => {
            if (refTimer.current) {
              clearTimeout(refTimer.current as NodeJS.Timeout);
              refTimer.current = null;
            }
          });
      }, 500);
    };
    router.events.on('routeChangeComplete', handleRouteComplete);
    return () => {
      router.events.on('routeChangeComplete', handleRouteComplete);
      if (loading) setLoading(false);
    };
  }, [router.query]);
  const updateRouter = (key: string, value: string | object) => {
    const params = getQueryString(key, value);
    window.location.href = `${window.location.origin}/${window.location.pathname}?${params.toString()}`;
  };

  const getQueryString = (key: string, value: string | object) => {
    if (key === 'filter') {
      const keysArray = Array.from(queryString.keys());
      keysArray.map((key) => {
        if (key.search('filter') !== -1) {
          queryString.delete(key);
        }
      });
      Object.keys(value).forEach((key) => {
        (value as any)[key].forEach((item: string, index: number) => {
          queryString.append(
            `filter[${key}][${index}]`,
            item.toString() as string,
          );
        });
      });
    } else {
      if (queryString.has(key)) {
        queryString.delete(key);
      }
      queryString.append(key, value as string);
    }

    if (key !== 'page') {
      queryString.delete('page');
      queryString.append('page', '1');
    }
    return queryString;
  };

  const getFinalFilter = (filter: Record<string, (string | number)[]>) => {
    if (dataSlug?.model === Entity.CATEGORIES) {
      filter['categories'] = [dataSlug.model_id as number];
    } else if (dataSlug?.model === Entity.BRANDS) {
      filter['brands'] = [dataSlug.model_id as number];
    }
    return filter;
  };

  const refreshData = async () => {
    const params = new URLSearchParams(window.location.search);
    const url = isSearch
      ? `/api/getProduct/filter/?`
      : `/api/getProduct/${((router?.query?.slug as string[]) || []).join('/')}?`;
    fetch(url + params.toString())
      .then((res) => res.json())
      .then((res: { data: { data: ResponseCategoryFilterPageDto } }) => {
        setProducts(res?.data?.data?.products || []);
        setLoading(false);
        setTotal(res?.data?.data?.total || 0);
      })
      .catch((err) => {
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
        if (refTimer.current) {
          refTimer.current = null;
        }
      });
  };

  return (
    <CategoryFilterContext.Provider
      value={{
        total,
        setTotal,
        sortBy,
        setSortBy,
        limit,
        setLimit,
        filters,
        setFilters,
        loading,
        setLoading,
        products,
        setProducts,
        objFilterByValue,
        setObjFilterByValue,
        dataSlug,
        setDataSlug,
        search,
        setSearch,
        isOpenFilter,
        setIsOpenFilter,
        page,
        setPage,
        updateRouter,
        router,
      }}
    >
      {children}
    </CategoryFilterContext.Provider>
  );
};

export default CategoryFilterContext;
