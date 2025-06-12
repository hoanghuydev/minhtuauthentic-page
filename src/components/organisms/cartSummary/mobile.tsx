import { useContext, useState } from 'react';
import OrderContext from '@/contexts/orderContext';
import ImageWithFallback from '@/components/atoms/images/ImageWithFallback';
import { useIsMobile } from '@/hooks/useDevice';
import { formatMoney, generateSlugToHref } from '@/utils';
import Link from 'next/link';
import PriceWithLineThrough from '@/components/atoms/price/priceWithLineThrough';
import PriceMinus from '@/components/atoms/price/PriceMinus';
import { Button, InputNumber } from 'antd/es';
import { DeleteOutlined } from '@ant-design/icons';
import PriceInput from '@/components/atoms/price/priceInput';
import DeleteConfirmModal from '@/components/organisms/cart/DeleteConfirmModal';
import { OrderItemsDto } from '@/dtos/OrderItems.dto';

export default function CartSummaryMobile() {
  const orderCtx = useContext(OrderContext);
  const isMobile = useIsMobile();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    item: OrderItemsDto;
    index: number;
  } | null>(null);

  const handleDeleteClick = (item: OrderItemsDto, index: number) => {
    setItemToDelete({ item, index });
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete !== null && orderCtx?.updateCart) {
      orderCtx.updateCart(itemToDelete.index, 0);
    }
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
  };

  return (
    <>
      {isMobile && (
        <>
          <div className={'flex flex-col'}>
            {orderCtx?.cart?.items?.map((item, index) => {
              return (
                <div
                  key={index}
                  className={'p-3 border rounded-[10px] flex relative gap-1'}
                >
                  <div
                    className={
                      'flex flex-col justify-between items-center gap-2'
                    }
                  >
                    <ImageWithFallback
                      className={'w-[100px] h-[100px] mx-auto bk-product-image'}
                      image={item?.image}
                      alt={item.variant_name}
                    />
                    <Button
                      icon={<DeleteOutlined />}
                      danger
                      type={'link'}
                      onClick={() => handleDeleteClick(item, index)}
                      className="p-0"
                    />
                  </div>
                  <div className={'flex flex-col flex-1'}>
                    <Link
                      href={generateSlugToHref(item.slug)}
                      className={'text-primary font-semibold bk-product-name'}
                    >
                      {item.variant_name}
                    </Link>
                    {item?.variant_configurations?.map((config, index2) => {
                      return (
                        <p
                          key={index2}
                          className={'text-sm bk-product-property'}
                        >
                          ({config.name}: {config.value})
                        </p>
                      );
                    })}
                    <div className={'text-right'}>
                      <PriceWithLineThrough
                        regularPrice={item.variant_regular_price}
                        price={item.variant_price}
                        isHaveBKPrice={true}
                      />
                      <PriceMinus item={item} className={'justify-end'} />
                    </div>
                    <div
                      className={'flex gap-3 justify-between items-center mt-3'}
                    >
                      <div className="flex items-center gap-2">
                        <PriceInput
                          qty={item.qty || 1}
                          item={item}
                          className="text-center"
                        />
                      </div>
                      <input
                        type={'hidden'}
                        className={'hidden bk-product-qty'}
                        value={item.qty || 1}
                      />
                      <span className={'text-primary font-[700] lg:font-bold'}>
                        {formatMoney(item.price || 0, 0, '.', '.')}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <DeleteConfirmModal
            isOpen={isDeleteModalOpen}
            onClose={handleCancelDelete}
            onConfirm={handleConfirmDelete}
            item={itemToDelete?.item}
          />
        </>
      )}
    </>
  );
}
