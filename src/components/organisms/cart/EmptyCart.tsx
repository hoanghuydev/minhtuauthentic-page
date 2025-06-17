import { Button } from 'antd/es';
import Link from 'next/link';
import { ShoppingOutlined } from '@ant-design/icons';
import Image from 'next/image';
import emptyCart from '@/static/images/empty-cart.png';

export default function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
      <div className="mb-6">
        <Image
          src={emptyCart}
          alt="Giỏ hàng trống"
          width={150}
          height={150}
          onError={(e) => {
            e.currentTarget.src =
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 24 24' fill='none' stroke='%23cccccc' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='9' cy='21' r='1'%3E%3C/circle%3E%3Ccircle cx='20' cy='21' r='1'%3E%3C/circle%3E%3Cpath d='M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6'%3E%3C/path%3E%3C/svg%3E";
          }}
          className="mx-auto"
        />
      </div>
      <h2 className="text-2xl font-bold mb-2">Giỏ hàng của bạn đang trống</h2>
      <p className="text-gray-600 mb-6">
        Hãy thêm sản phẩm vào giỏ hàng để tiến hành mua sắm
      </p>
      <Link href="/">
        <Button
          type="primary"
          size="large"
          icon={<ShoppingOutlined />}
          className="font-semibold"
        >
          Tiếp tục mua sắm
        </Button>
      </Link>
    </div>
  );
}
