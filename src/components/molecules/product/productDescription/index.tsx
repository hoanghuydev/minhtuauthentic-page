import { ProductDto } from '@/dtos/Product.dto';
import { useContext, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import AppContext from '@/contexts/appContext';
import { SETTING_KEY } from '@/config/enum';
import TabsContainer from '@/components/molecules/tabsContainer';
import { SettingsDto } from '@/dtos/Settings.dto';

type Props = {
  product: ProductDto;
  settings: SettingsDto[];
};
export default function ProductDescription({ product, settings }: Props) {
  const mapSetting = new Map(settings.map((item) => [item.key, item.value]));
  return (
    <TabsContainer
      header={[
        'Mô tả sản phẩm',
        'Hướng dẫn mua hàng & thanh toán',
        'Chính sách đổi trả & bảo hành',
      ]}
      content={[
        product?.product_property?.content || '',
        mapSetting.get(SETTING_KEY.PRODUCT_DETAIL_HOW_TO_BUY.KEY)?.content ||
          '',
        mapSetting.get(SETTING_KEY.PRODUCT_DETAIL_GUARANTEE.KEY)?.content || '',
      ]}
    />
  );
}
