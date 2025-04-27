import { useEffect, useState } from 'react';
import { MenuDisplay, POPUP_TYPE } from '@/config/type';
import { ResponseMenuDto } from '@/dtos/responseMenu.dto';
import { StaticComponentDto } from '@/dtos/StaticComponent.dto';
export default function useMenu(menu: ResponseMenuDto) {
  const [menuDisplay, setMenuDisplay] = useState<MenuDisplay[]>([]);
  useEffect(() => {
    setMenuDisplay([
      ...[
        {
          type: POPUP_TYPE.PRODUCT,
          data: [],
        },
        {
          type: POPUP_TYPE.BRAND,
          data: menu?.brands || [],
        },
      ],
      ...(menu?.homeMenuCategory || []).map((item: StaticComponentDto) => ({
        type: POPUP_TYPE.CATEGORY,
        data: item,
        isHaveChildren: !!(
          item?.category?.children?.length &&
          item?.category?.children?.length > 0
        ),
      })),
      ...[
        {
          type: POPUP_TYPE.NEWS,
          data: [],
        },
      ],
    ]);
  }, []);
  return {menuDisplay}
}