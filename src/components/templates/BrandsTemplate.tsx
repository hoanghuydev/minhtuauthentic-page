import { BrandDto } from '@/dtos/Brand.dto';
import { twMerge } from 'tailwind-merge';
import { useEffect, useState } from 'react';
import orderBy from 'lodash/orderBy';
import BrandWithImage from '@/components/atoms/brands/brandWithImage';

type Props = {
  brands: BrandDto[];
};
export default function BrandsTemplate({ brands }: Props) {
  const [letterActive, setLetterActive] = useState<string>('');
  const listLetter = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const [ready, setReady] = useState(false);
  const [listProductDisplay, setProductDisplay] = useState<
    { data: BrandDto[]; keyword: string; sort: number }[]
  >([]);

  useEffect(() => {
    setReady(true);
    const listDisplay: { data: BrandDto[]; keyword: string; sort: number }[] =
      [];
    listLetter.map((item) => {
      const newBrands = brands.filter(
        (brand) => (brand?.name || '').charAt(0).toUpperCase() === item,
      );
      listDisplay.push({ data: newBrands, keyword: item, sort: 1 });
    });
    setProductDisplay(listDisplay);
  }, []);

  useEffect(() => {
    if (ready) {
      const newBrands = listProductDisplay.map((item) => {
        if (letterActive === item.keyword) {
          item.sort = 0;
        } else {
          item.sort = 1;
        }
        return item;
      });
      setProductDisplay(newBrands);
    }
  }, [letterActive]);

  return (
    <div
      className={twMerge(
        'w-full rounded-[10px] shadow-custom bg-white relative mx-auto p-3',
      )}
    >
      <h1 className={'text-2xl text-primary font-[700] lg:font-bold '}>
        Thương hiệu
      </h1>
      <div className={'flex gap-2 flex-wrap h-max mt-3'}>
        {listLetter.map((item, index) => {
          return (
            <div
              key={index}
              className={twMerge(
                'p-3 flex-1 border-gray-200 border bg-white cursor-pointer rounded-[10px] w-[35px] h-[25px] flex items-center justify-center',
                letterActive === item ? 'bg-primary text-white' : 'text-black',
              )}
              onClick={() => {
                if (letterActive === item) {
                  setLetterActive('');
                } else {
                  setLetterActive(item);
                }
              }}
            >
              <span className={'text-xl '}>{item}</span>
            </div>
          );
        })}
      </div>
      <div className={'mt-3'}>
        {orderBy(listProductDisplay, ['sort'], ['asc'])
          .filter((item) => item.data.length > 0)
          .map((item, index) => {
            return (
              <div
                className={
                  'flex py-[10px] lg:py-[20px] border-b border-gray-200 '
                }
                key={index}
              >
                <h4
                  className={twMerge(
                    'flex items-center justify-center font-[700] lg:font-bold w-[25px] lg:w-[50px] px-[2rem] lg:px-[3rem]',
                    letterActive === item.keyword
                      ? 'text-primary'
                      : 'text-gray-700',
                  )}
                >
                  <span className={'text-[1.3rem] lg:text-[2.5rem]'}>
                    {item.keyword}
                  </span>
                </h4>
                <div
                  className={
                    'grid grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3'
                  }
                >
                  {item.data.map((brand, index) => {
                    return <BrandWithImage brand={brand} key={index} />;
                  })}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
