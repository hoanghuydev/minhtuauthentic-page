import { CheckCircleFilled } from '@ant-design/icons';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { OrdersDto } from '@/dtos/Orders.dto';
import { formatCurrency } from '@/utils/format';
import dayjs from 'dayjs';
import Loading from '../atoms/loading';
import Image from 'next/image';
import { statusOrder } from '@/utils';
import { Steps } from 'antd';
import { OrderStatus } from '../../config/enum';

const orderSteps = [
  { title: 'Đã đặt hàng' },
  { title: 'Đang xử lý' },
  { title: 'Đang giao hàng' },
  { title: 'Hoàn thành' },
  { title: 'Đã hủy' },
];

// Hàm map status sang index step
function getStepIndex(status: string) {
  switch (status) {
    case OrderStatus.NEW:
      return 0;
    case OrderStatus.APPROVED:
      return 1;
    case OrderStatus.PROCESSING:
      return 2;
    case OrderStatus.DONE:
      return 3;
    case OrderStatus.CLOSE:
      return 4;
    default:
      return 0;
  }
}

export default function OrderSuccessTemplate() {
  const router = useRouter();
  const orderId = router?.query?.orderId;
  const [order, setOrder] = useState<OrdersDto>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;
      try {
        setLoading(true);
        const res = await fetch(`/api/orders/getordersById?id=${orderId}`);
        const data = await res.json();
        setOrder(data.data);
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <Loading />
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-2">
      <div className="container mx-auto bg-white rounded-2xl shadow-xl p-4 md:p-12">
        {/* Success Icon & Message */}
        <div className="flex flex-col items-center mb-8">
          <CheckCircleFilled className="text-green text-6xl mb-2" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1 text-center">
            Cảm ơn bạn đã đặt hàng!
          </h1>
          <div className="text-gray-500 text-center mb-2">
            Đơn hàng của bạn đã được đặt thành công.
            <br />
            Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.
          </div>
          <div className="text-base text-gray-700 font-semibold mt-2">
            Mã đơn hàng:{' '}
            <span className="text-primary font-bold">#{order.id}</span>
          </div>
        </div>

        {/* Order & Customer Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">
              Thông tin người mua
            </h3>
            <div className="text-gray-800">{order.user?.name}</div>
            <div className="text-gray-600">{order.phone}</div>
            <div className="text-gray-600">{order.user?.email}</div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">
              Địa chỉ giao hàng
            </h3>
            <div className="text-gray-800">{order.shipping_address}</div>
            <div className="text-gray-600">
              {(order.ward as { full_name: string } | undefined)?.full_name},{' '}
              {(order.district as { full_name: string } | undefined)?.full_name}
            </div>
            <div className="text-gray-600">
              {(order.city as { full_name: string } | undefined)?.full_name}
            </div>
          </div>
        </div>

        {/* Order Status & Date */}
        <div className="flex flex-col  mb-6 border-b pb-4">
          <div className="text-gray-700 overflow-x-auto">
            <span className="font-semibold">Trạng thái:</span>
            <div className="min-w-[200px]">
              <Steps
                className="mt-2"
                current={getStepIndex(order.status || '')}
                items={orderSteps}
              />
            </div>
          </div>
          <div className="text-gray-500 mt-3">
            <span className="font-semibold">Ngày đặt:</span>{' '}
            {order.created_at
              ? dayjs(order.created_at).format('HH:mm DD/MM/YYYY')
              : ''}
          </div>
        </div>

        {/* Order Items Table */}
        <div className="mb-8">
          <h3 className="font-semibold text-gray-700 mb-3">
            Chi tiết sản phẩm
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border rounded-lg">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="p-2 text-left font-semibold">Sản phẩm</th>
                  <th className="p-2 text-center font-semibold">Số lượng</th>
                  <th className="p-2 text-right font-semibold">Giá</th>
                </tr>
              </thead>
              <tbody>
                {order.order_items?.map((item) => (
                  <tr key={item.id} className="border-b last:border-b-0">
                    <td className="flex items-center gap-3 p-2">
                      <Image
                        src={
                          item.variant?.images?.[0]?.image?.thumbnail_url ||
                          '/no-image.png'
                        }
                        alt={item.variant_name || ''}
                        width={48}
                        height={48}
                        className="rounded-md object-cover w-12 h-12 border"
                      />
                      <span className="font-medium text-gray-800">
                        {item.variant_name}
                      </span>
                    </td>
                    <td className="text-center p-2 text-gray-700">
                      {item.qty}
                    </td>
                    <td className="text-right p-2 text-gray-900 font-semibold">
                      {formatCurrency(item.variant_price || 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 rounded-lg p-4 mb-8">
          <div className="flex justify-between py-1 text-gray-700">
            <span>Tạm tính:</span>
            <span>
              {formatCurrency(
                Number(order.total_price || 0) +
                  Number(
                    order?.coupons?.reduce(
                      (acc, coupon) =>
                        acc + (coupon.coupon?.price_minus_value || 0),
                      0,
                    ) || 0,
                  ),
              )}
            </span>
          </div>
          {order.coupons?.map((coupon) => (
            <div
              key={coupon.id}
              className="flex justify-between py-1 text-green-600"
            >
              <span>Giảm giá ({coupon.coupon?.code}):</span>
              <span>
                -{formatCurrency(coupon.coupon?.price_minus_value || 0)}
              </span>
            </div>
          ))}
          <div className="flex justify-between py-1 text-gray-700">
            <span>Phí vận chuyển:</span>
            <span>{formatCurrency(order.shipping_price || 0)}</span>
          </div>
          <div className="flex justify-between py-2 mt-2 border-t font-bold text-lg text-primary">
            <span>Tổng cộng:</span>
            <span>{formatCurrency(order.total_price || 0)}</span>
          </div>
        </div>

        {/* Payment Method */}
        <div className="mb-8">
          <h3 className="font-semibold text-gray-700 mb-2">
            Phương thức thanh toán
          </h3>
          <div className="text-gray-800">{order.payment?.label}</div>
        </div>

        {/* View Order Link */}
        <div className="text-center">
          <Link
            href={'/tai-khoan/lich-su/' + orderId}
            className="inline-block bg-primary text-white px-6 py-2 rounded-lg shadow hover:bg-primary-dark transition-colors font-semibold"
          >
            Xem chi tiết đơn hàng
          </Link>
        </div>
      </div>
    </div>
  );
}
