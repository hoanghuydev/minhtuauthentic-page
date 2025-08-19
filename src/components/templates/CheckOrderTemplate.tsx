import BreadcrumbComponent from '@/components/molecules/breakcrumb';
import { twMerge } from 'tailwind-merge';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormControl from '@/components/molecules/form/FormControl';
import {
  MailOutlined,
  PhoneOutlined,
  OrderedListOutlined,
} from '@ant-design/icons';
import SearchOrder from '@/static/images/tra_cuu_don_hang.png';
import { Button } from 'antd/es';
import { useState } from 'react';
import { OrdersDto } from '@/dtos/Orders.dto';
import OrderDetailTemplate from '@/components/templates/OrderDetailTemplate';
import Image from 'next/image';
const schema = yup
  .object({
    order_id: yup.string().required('Vui lòng nhập đơn hàng'),
    phone: yup.string().required('Vui lòng nhập số điện thoại'),
  })
  .required();
export default function CheckOrderTemplate() {
  const [order, setOrder] = useState<OrdersDto | null>(null);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      order_id: '',
      phone: '',
    },
  });
  return (
    <>
      <BreadcrumbComponent
        label={'Tra cứu đơn hàng'}
        link={'/kiem-tra-don-hang'}
      />
      <div
        className={twMerge(
          'w-full rounded-[10px] grid grid-cols-1 lg:grid-cols-2 shadow-custom bg-white overflow-hidden relative m-auto p-3',
        )}
      >
        <div>
          <Image
            src={SearchOrder}
            alt={'Tra cứu đơn hàng'}
            className={
              'w-[300px] h-[200px] lg:w-full lg:h-full m-auto  object-cover'
            }
          />
        </div>
        <div className="my-auto">
          <h1
            className={
              'text-center text-3xl text-primary font-[700] lg:font-bold'
            }
          >
            Tra cứu đơn hàng
          </h1>
          <p className={'mt-3 text-center'}>
            Để theo dõi đơn hàng của bạn, vui lòng nhập ID đơn hàng của bạn vào
            ô bên dưới và nhấn nút Theo dõi.
          </p>
          <form
            className={'mt-3'}
            onSubmit={handleSubmit(async (data) => {
              const search = new URLSearchParams();
              search.append('order_id', data.order_id);
              search.append('phone', data.phone);
              fetch('/api/orders/check?' + search.toString())
                .then((res) => res.json())
                .then((data) => {
                  setOrder(data?.data || null);
                })
                .catch((error) => {});
            })}
          >
            <FormControl
              control={control}
              errors={errors}
              name={'order_id'}
              type={'text'}
              placeholder={'Mã số đơn hàng *'}
              prefix={<OrderedListOutlined />}
              className={'mb-3'}
            />
            <FormControl
              control={control}
              errors={errors}
              name={'phone'}
              type={'text'}
              placeholder={'Số điện thoại*'}
              prefix={<PhoneOutlined />}
            />
            <Button
              className={'w-full mt-3'}
              type={'primary'}
              htmlType={'submit'}
            >
              Theo dõi
            </Button>
          </form>
        </div>
      </div>
      {order && (
        <div className={'mt-3 rounded-[10px] shadow-custom bg-white p-3'}>
          <OrderDetailTemplate order={order} />
        </div>
      )}
    </>
  );
}
