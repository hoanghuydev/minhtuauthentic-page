import Link from 'next/link';
import { POPUP_TYPE, PopupDisplay } from '@/config/type';
import { CategoryDto } from '@/dtos/Category.dto';
import { Fragment, ReactNode, useContext, useEffect, useState } from 'react';
import { chunk } from 'lodash';
import { BrandDto } from '@/dtos/Brand.dto';
import MenuBrand from '@/components/molecules/header/menu/menuBrand';
import { ResponseMenuDto } from '@/dtos/responseMenu.dto';
import MenuPopupCategory from '@/components/molecules/header/menu/menuPopupCategory';
import React from 'react';
import appContext from '@/contexts/appContext';
import { twMerge } from 'tailwind-merge';

const MenuPopup = ({
  data,
  onMouseEnter,
  onMouseLeave,
  menuCategoryChildrenPosition,
  menu,
  isOpenMenu,
}: {
  data: PopupDisplay;
  menu: ResponseMenuDto;
  menuCategoryChildrenPosition: { top: number; left: number; height: number };
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  isOpenMenu: boolean;
}) => {
  const wMenu = isOpenMenu ? 209 : 215;
  const gapWMenuAnd = 8;
  const [widthContainer, setWidthContainer] = useState(0);
  const [bgWH, setBgWH] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    if (document && document.getElementById('main-body')) {
      const width =
        document?.getElementById('main-body')?.getBoundingClientRect()?.width ||
        0;
      setWidthContainer(width - wMenu);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const homePage = document.getElementById('main-home-page');
      if (homePage) {
        setBgWH({
          width: homePage.offsetWidth - wMenu - (isOpenMenu ? gapWMenuAnd : 0),
          height: homePage.offsetHeight,
        });
      }
    }
  }, []);

  useEffect(() => {
    if (isOpenMenu && document.getElementById('main-body')) {
      const width =
        document?.getElementById('main-body')?.getBoundingClientRect()?.width ||
        0;
      setWidthContainer(width - wMenu);
    }
  }, [isOpenMenu]);

  const renderItem = () => {
    const obj: Record<string, () => ReactNode> = {
      [POPUP_TYPE.CATEGORY]: () => {
        return (
          <MenuPopupCategory
            title={data?.title}
            filterSetting={menu?.filterSetting}
            categories={Array.isArray(data?.data) ? data?.data : [data?.data]}
          />
        );
      },
      [POPUP_TYPE.PRODUCT]: () => {
        return <div className={'flex'}></div>;
      },
      [POPUP_TYPE.BRAND]: () => {
        return <MenuBrand brands={(data?.data as BrandDto[]) || []} />;
      },
    };
    return obj[data.type || '']();
  };
  return (
    <>
      {data?.display && (
        <div
          className="absolute top-0 left-[215px] z-[20] flex"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          style={{
            width: bgWH.width || widthContainer,
            top: `${menuCategoryChildrenPosition.top}px`,
            left: `${wMenu}px`,
            height: `${menuCategoryChildrenPosition.height}px`,
            maxWidth: widthContainer,
          }}
        >
          {/* <div
            className={twMerge(
              ' h-full bg-transparent flex-shrink-0',
              isOpenMenu ? 'w-[25px]' : 'w-[42px]',
            )}
          ></div> */}
          <div
            className={
              ' max-lg:hidden h-full lg:w-full bg-white p-4 pl-4 overflow-auto flex'
            }
          >
            <div className="flex-1 min-w-0">{renderItem()}</div>
          </div>
        </div>
      )}
    </>
  );
};
export default MenuPopup;
