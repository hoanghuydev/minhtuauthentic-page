import { BrandDto } from '@/dtos/Brand.dto';
import { chunk } from 'lodash';
import Link from 'next/link';
import { generateSlugToHref } from '@/utils';
import { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';
type Props = {
  brands: BrandDto[];
};
export default function MenuBrand({ brands }: Props) {
  const [letterActive, setLetterActive] = useState<string>('');
  const [chunkBrands, setChunkBrands] = useState<BrandDto[][]>(
    chunk(brands, Math.ceil(brands.length / 3)),
  );
  const listLetter = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) {
      if (letterActive) {
        const newBrands = brands.filter(
          (brand) =>
            (brand?.name || '').charAt(0).toUpperCase() === letterActive,
        );
        const lengthChunk =
          newBrands.length > 10
            ? newBrands.length < 20
              ? 10
              : Math.ceil(newBrands.length / 3)
            : newBrands.length;
        setChunkBrands(chunk(newBrands, lengthChunk));
      } else {
        setChunkBrands(chunk(brands, Math.ceil(brands.length / 3)));
      }
    }
  }, [letterActive]);

  return (
    <div className={'grid grid-cols-4 gap-3'}>
      <div className={'flex gap-2 flex-wrap h-max'}>
        {listLetter.map((item, index) => {
          return (
            <div
              key={index}
              className={twMerge(
                'p-3 border-gray-200 border bg-white cursor-pointer rounded-[5px] w-[25px] h-[25px] flex items-center justify-center hover:border-primary hover:text-primary',
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
              <span>{item}</span>
            </div>
          );
        })}
      </div>
      {chunkBrands.map((chunkBrand, index) => {
        return (
          <div key={index}>
            <ul className={'flex flex-col gap-3'}>
              {chunkBrand.map((brand, index) => {
                return (
                  <li key={'chunkBrand' + index} className="hover:text-primary">
                    <Link href={generateSlugToHref(brand?.slugs?.slug || '')}>
                      {brand.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
