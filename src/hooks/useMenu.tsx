import { useEffect, useState } from 'react';
import { MenuDisplay, POPUP_TYPE } from '@/config/type';
import { ResponseMenuDto } from '@/dtos/responseMenu.dto';
import { StaticComponentDto } from '@/dtos/StaticComponent.dto';
export default function useMenu(menu: ResponseMenuDto) {
  const [menuDisplay, setMenuDisplay] = useState<MenuDisplay[]>([]);
  useEffect(() => {
    // Sort menu categories by sort field before mapping
    const sortedMenuCategories = (menu?.homeMenuCategory || [])
      .sort((a, b) => (a.sort || 0) - (b.sort || 0))
      .map((item: StaticComponentDto) => ({
        type: POPUP_TYPE.CATEGORY,
        data: item,
        isHaveChildren: !!(
          item?.category?.children?.length &&
          item?.category?.children?.length > 0
        ),
        sort: item.sort || 0,
      }));

    // Create all menu items with sort priority
    const allMenuItems = [
      {
        type: POPUP_TYPE.PRODUCT,
        data: [],
        sort: -999, // Always first
      },
      {
        type: POPUP_TYPE.BRAND,
        data: menu?.brands || [],
        sort: -998, // Always second
      },
      ...sortedMenuCategories,
      {
        type: POPUP_TYPE.NEWS,
        data: menu?.newsData || [],
        sort: 999, // Always last
      },
    ];

    // Sort all items and remove sort property for final result
    const finalMenuDisplay = allMenuItems
      .sort((a, b) => a.sort - b.sort)
      .map(({ sort, ...item }) => item);

    setMenuDisplay(finalMenuDisplay);
  }, [menu]);
  return {menuDisplay}
}
