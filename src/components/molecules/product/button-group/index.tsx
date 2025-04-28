import EyeOutlined from '@ant-design/icons/lib/icons/EyeOutlined';
import ShoppingCartOutlined from '@ant-design/icons/lib/icons/ShoppingCartOutlined';
import { twMerge } from 'tailwind-merge';
import { VariantDto } from '@/dtos/Variant.dto';
import { useContext, useState } from 'react';
import OrderContext from '@/contexts/orderContext';
import { ProductDto } from '@/dtos/Product.dto';
import { Modal } from 'antd/es';
import AppContext from '@/contexts/appContext';

const ProductCardButtonGroup = ({
  product,
  variant,
  className,
  addText,
}: {
  product: ProductDto;
  variant: VariantDto;
  className: string;
  addText?: string;
}) => {
  const order = useContext(OrderContext);
  const appCtx = useContext(AppContext);
  return (
    <div className={twMerge('flex gap-1 lg:gap-2', className)}>
      <button
        onClick={() => {
          appCtx?.setIsOpenPopupProduct &&
            appCtx?.setIsOpenPopupProduct(product?.slugs?.slug || null);
        }}
        className={
          'bg-primary rounded-[8px] text-white p-[6px_5px] lg:p-[8px_10px] flex items-center justify-center min-h-full max-h-full'
        }
        type={'button'}
      >
        <EyeOutlined />
      </button>
      <button
        type={'button'}
        className={
          'block grow bg-primary text-white rounded-[8px] p-[6px_5px] lg:p-[8px_10px] max-lg:text-sm'
        }
        onClick={() => {
          order?.addCart && order.addCart(variant);
        }}
      >
        <ShoppingCartOutlined />
        <span className={'ml-2'}>{addText || 'Thêm giỏ hàng'}</span>
      </button>
    </div>
  );
};
export default ProductCardButtonGroup;
