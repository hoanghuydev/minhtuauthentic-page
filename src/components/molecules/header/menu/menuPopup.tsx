import Link from 'next/link';
import { POPUP_TYPE, PopupDisplay } from '@/config/type';
import { CategoryDto } from '@/dtos/Category.dto';
import { Fragment, ReactNode, useEffect, useState } from 'react';
import { chunk } from 'lodash';
import { BrandDto } from '@/dtos/Brand.dto';
import MenuBrand from '@/components/molecules/header/menu/menuBrand';
import { ResponseMenuDto } from '@/dtos/responseMenu.dto';
import MenuPopupCategory from '@/components/molecules/header/menu/menuPopupCategory';

const MenuPopup = ({
  data,
  onMouseEnter,
  onMouseLeave,
  menuCategoryChildrenPosition,
  menu,
}: {
  data: PopupDisplay;
  menu: ResponseMenuDto;
  menuCategoryChildrenPosition: { top: number; left: number; height: number };
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) => {
  const wMenu = 220;
  const gapWMenuAnd = 8;
  const [widthContainer, setWidthContainer] = useState(0);
  const [bgWH, setBgWH] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });
  const [ready, setReady] = useState(false);

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
          width: homePage.offsetWidth - wMenu - gapWMenuAnd,
          height: homePage.offsetHeight,
        });
      }
    }
  }, []);

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
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          style={{
            width: bgWH.width || widthContainer,
            top: `${menuCategoryChildrenPosition.top}px`,
            left: `${wMenu}px`,
            height: `${menuCategoryChildrenPosition.height}px`,
            maxWidth: widthContainer,
          }}
          className={
            'absolute max-lg:hidden h-full lg:w-[53vw] bg-white z-[20] top-0 left-[200px] ml-2 p-2 overflow-auto shadow-custom'
          }
        >
          {renderItem()}
        </div>
      )}
    </>
  );
};
export default MenuPopup;
