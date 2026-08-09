import { ProductDto } from '@/dtos/Product.dto';
import { SETTING_KEY } from '@/config/enum';
import TabsContainer from '@/components/molecules/tabsContainer';
import { SettingsDto } from '@/dtos/Settings.dto';
import Script from 'next/script';

type Props = {
  product: ProductDto;
  settings: SettingsDto[];
};
export default function ProductDescription({ product, settings }: Props) {
  const mapSetting = new Map(settings.map((item) => [item.key, item.value]));
  return (
    <>
      <TabsContainer
        key={product?.slugs?.slug || product?.id}
        header={[
          'Mô tả sản phẩm',
          'Hướng dẫn mua hàng & thanh toán',
          'Chính sách đổi trả & bảo hành',
        ]}
        content={[
          product?.product_property?.content || '',
          mapSetting.get(SETTING_KEY.PRODUCT_DETAIL_HOW_TO_BUY.KEY)?.content ||
            '',
          mapSetting.get(SETTING_KEY.PRODUCT_DETAIL_GUARANTEE.KEY)?.content ||
            '',
        ]}
        tocTabIndex={0}
      />
      <Script
        strategy={'beforeInteractive'}
        src={'https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js'}
        async={false}
      />
      <Script strategy={'beforeInteractive'} src={'/js/toc.js'} async={false} />
      <Script strategy={'afterInteractive'} src={'/toc.min.js'} async={false} />
    </>
  );
}
