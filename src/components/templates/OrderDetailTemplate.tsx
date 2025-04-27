import { OrderItemsDto } from '@/dtos/OrderItems.dto';
import { OrdersDto } from '@/dtos/Orders.dto';
import { Fragment, ReactNode, useEffect, useState } from 'react';
import { Table, TableColumnsType } from 'antd/es';
import dayjs from 'dayjs';
import {
  calculatePriceMinus,
  formatMoney,
  generateSlugToHref,
  promotionName,
  statusOrder,
} from '@/utils';
import ImageWithFallback from '@/components/atoms/images/ImageWithFallback';
import Link from 'next/link';
import { DataType } from 'csstype';

type Props = {
  order: OrdersDto;
};
export default function OrderDetailTemplate({ order }: Props) {
  const [orderField, setOrderField] = useState<
    {
      label: string;
      render: ReactNode;
    }[]
  >([]);
  const [totalPriceWithoutCoupon, setTotalPriceWithoutCoupon] =
    useState<number>(0);

  useEffect(() => {
    let totalPriceWithoutCoupon: number = 0;
    order?.order_items?.forEach((item) => {
      totalPriceWithoutCoupon += Number(item.price) || 0;
    });
    setTotalPriceWithoutCoupon(totalPriceWithoutCoupon);
  }, []);

  const columns: TableColumnsType = [
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
      width: 500,
      render: (_: unknown, item: OrderItemsDto) => {
        return (
          <Link
            href={generateSlugToHref(item?.variant?.product?.slugs?.slug)}
            className={'flex gap-3'}
          >
            <ImageWithFallback
              image={item?.variant?.images?.[0]?.image}
              className={'w-[50px] h-[50px] object-contain'}
            />
            <span>{item.variant_name}</span>
          </Link>
        );
      },
    },
    {
      title: 'Đơn giá',
      dataIndex: 'variant_regular_price',
      key: 'variant_regular_price',
      render: (_: unknown, item: OrderItemsDto) => (
        <span>{formatMoney(item?.variant_regular_price || 0)}</span>
      ),
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (_: unknown, item: OrderItemsDto) => <span>{item.qty}</span>,
    },
    {
      title: 'Khuyến mãi',
      dataIndex: 'coupons',
      key: 'coupons',
      render: (_: unknown, item: OrderItemsDto) => (
        <ul className={'flex flex-col gap-3'}>
          {item?.coupon_details?.map((couponDetail, index) => (
            <li className={'flex items-center'} key={index}>
              <span className={'font-semibold mr-3'}>
                {promotionName(couponDetail?.coupon?.promotion)}:
              </span>
              <span
                className={
                  'text-red-600 text-[13px] font-[700] lg:font-bold text-right cursor-pointer'
                }
              >
                -
                {formatMoney(
                  calculatePriceMinus(
                    item?.variant_regular_price || 0,
                    couponDetail?.coupon,
                  ),
                )}
              </span>
            </li>
          ))}
        </ul>
      ),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'total_price',
      key: 'total_price',
      render: (_: unknown, item: OrderItemsDto) => (
        <span>{formatMoney(item?.price || 0)}</span>
      ),
    },
  ];

  useEffect(() => {
    const items: {
      label: string;
      render: ReactNode;
    }[] = [];
    Object.keys(order).forEach((key) => {
      const value = (order as any)[key];
      switch (key) {
        case 'id':
          items.push({
            label: 'Mã số đơn hàng',
            render: value,
          });
          break;
        case 'total_price':
          items.push({
            label: 'Tổng tiền',
            render: formatMoney(value),
          });
          break;
        case 'status':
          items.push({
            label: 'Trạng thái',
            render: (
              <span className={'text-red-500'}>{statusOrder(value)}</span>
            ),
          });
          break;
        case 'payment':
          items.push({
            label: 'Phương thức thanh toán',
            render: value?.label || value?.name,
          });
          break;
        case 'shipping_address':
          items.push({
            label: 'Địa chỉ nhận hàng',
            render:
              value +
              ', ' +
              (order?.ward as any)?.full_name +
              ', ' +
              (order?.district as any)?.full_name +
              ', ' +
              (order?.city as any)?.full_name,
          });
          break;
        case 'note':
          items.push({
            label: 'Note',
            render: <div dangerouslySetInnerHTML={{ __html: value }} />,
          });
          break;
        case 'created_at':
          items.push({
            label: 'Ngày tạo',
            render: dayjs(value).format('DD/MM/YYYY HH:mm:ss'),
          });
          break;
      }
      setOrderField(items);
    });
  }, []);

  return (
    <>
      {order && (
        <>
          <h1 className={'text-2xl text-primary font-[700] lg:font-bold mb-3'}>
            Chi tiết đơn hàng
          </h1>
          <div className={'grid grid-cols-2 gap-3'}>
            {orderField.map((item, key) => {
              return (
                <div key={key}>
                  <p className={'font-semibold'}>{item.label}</p>
                  <p>{item.render}</p>
                </div>
              );
            })}
          </div>
          <div className={'mt-3'}>
            <h2 className={'text-xl text-primary font-[700] lg:font-bold mb-3'}>
              Sản phẩm
            </h2>
            <Table
              className={'overflow-auto'}
              dataSource={order?.order_items || []}
              columns={columns}
              pagination={false}
            />
          </div>
          <div className={'mt-3 flex justify-end'}>
            <table className={''}>
              <tbody>
                <tr>
                  <td className={'text-primary text-xl'}>Tạm Tính:</td>
                  <td className={'text-right pr-5'}>
                    {formatMoney(totalPriceWithoutCoupon)}
                  </td>
                </tr>

                {order?.coupons &&
                  order?.coupons?.length > 0 &&
                  order?.coupons.map((couponDetail, index) => {
                    return (
                      <tr key={'OrderDetailTemplate-' + index}>
                        <td className={'text-lg'}>
                          <span className={'text-primary '}>Coupon {'  '}</span>
                          <span
                            className={
                              'font-[700] lg:font-bold p-1 bg-[#efefef] rounded-[4px] text-sm'
                            }
                          >
                            {couponDetail?.coupon?.code}
                          </span>{' '}
                          <span>: </span>
                        </td>
                        <td className={'text-right pr-5'}>
                          -
                          {formatMoney(
                            calculatePriceMinus(
                              order.total_price || 0,
                              couponDetail?.coupon,
                            ),
                          )}
                        </td>
                      </tr>
                    );
                  })}
                <tr>
                  <td className={'text-primary text-xl'}>Tổng tiền:</td>
                  <td>{formatMoney(order.total_price || 0)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}
