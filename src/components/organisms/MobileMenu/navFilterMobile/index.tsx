import React, { useContext, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import CategoryFilterContext from '@/contexts/categoryFilterContext';
import { twMerge } from 'tailwind-merge';
import SettingFilter from '@/components/organisms/categoryFilter/settingFilter';
import { ProductFilterOptionDto } from '@/dtos/ProductFilterSettingOption/ProductFilterOption.dto';
import Filter from '@/components/icons/filter';
import CloseCircle from '@/components/icons/closeCircle';
import { Button } from 'antd/es';
import { BrandDto } from '@/dtos/Brand.dto';

type Props = {
  settings?: ProductFilterOptionDto;
  brands?: BrandDto[];
};
export default function NavFilterMobile({ settings, brands }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const ctx = useContext(CategoryFilterContext);
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        ctx?.setIsOpenFilter && ctx.setIsOpenFilter(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);
  return (
    <>
      {createPortal(
        <div
          ref={ref}
          className={twMerge(
            'fixed right-0 top-0 w-[80vw] h-screen bg-white pb-[63px] overflow-auto z-[101] shadow-custom transition-all duration-300',
            ctx?.isOpenFilter
              ? 'translate-x-0 opacity-100 visible'
              : 'opacity-0 invisible translate-x-full',
          )}
        >
          <div className={'p-2 bg-primary flex justify-between'}>
            <span className={'text-white flex gap-3'}>
              <Filter className={'w-6 h-6'} />
              <span>Bộ Lọc</span>
            </span>
            <Button
              icon={<CloseCircle className={'w-6 h-6 text-white'} />}
              onClick={() => {
                ctx?.setIsOpenFilter && ctx.setIsOpenFilter(false);
              }}
              type={'link'}
            ></Button>
          </div>
          {settings && (
            <div className={'h-full overflow-auto'}>
              <SettingFilter settings={settings} isNav={true} brands={brands} />
            </div>
          )}
        </div>,
        document.body,
      )}
    </>
  );
}
