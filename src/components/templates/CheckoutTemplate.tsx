import { twMerge } from 'tailwind-merge';
import FormCheckout from '@/components/organisms/checkout/formCheckout';
import ListCart from '@/components/organisms/checkout/listCart';
import useUser from '@/hooks/useUser';
import { PaymentsDto } from '@/dtos/Payments.dto';
import Logo from '@/static/images/logo.png';
import Image from 'next/image';
import Link from 'next/link';
import BreadcrumbComponent from '@/components/molecules/breakcrumb';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ORDER_STATUS, PAYMENT } from '@/config/enum';
import * as yup from 'yup';
import CartDto from '@/dtos/Cart.dto';
import { toast } from 'react-toastify';
import { createVNPayUrl } from '@/utils/vnpay';
import ResponseSendTransactionDto from '@/dtos/Fudiin/responseSendTransaction.dto';
import { useContext, useState } from 'react';
import OrderContext from '@/contexts/orderContext';
import { useRouter } from 'next/router';
import SendTransactionFudiinDto from '@/dtos/Fudiin/sendTransaction.dto';
import ItemFudiinDto from '@/dtos/Fudiin/item.dto';
import CustomerFudiinDto from '@/dtos/Fudiin/customer.dto';
import ShippingFudiinDto from '@/dtos/Fudiin/shipping.dto';
import { AddressesDto } from '@/dtos/Addresses.dto';

const schema = yup
  .object({
    name: yup.string().required(),
    note: yup.string(),
    payment_id: yup.number().required('Vui lòng chọn phương thức thanh toán'),
    email: yup
      .string()
      .email('Vui lòng nhập đúng dạng email')
      .required('Vui lòng nhập email'),
    phone: yup.string().required('Vui lòng nhập số điện thoại'),
    shipping_city: yup.string().required('Vui lòng chọn tỉnh/thành phố'),
    shipping_district: yup.string().required('Vui lòng chọn quận/huyện'),
    shipping_ward: yup.string().required('Vui lòng chọn phường/xã'),
    address: yup.string().required('Vui lòng nhập địa chỉ'),
  })
  .required();
export type FormData = {
  name: string;
  email: string;
  phone: string;
  payment_id: number;
  note?: string;
  status?: string;
  payment_type_id?: string;
  order_external_id?: string;
  shipping_city: string;
  shipping_district: string;
  shipping_ward: string;
  address: string;
};
export default function CheckoutTemplate({
  payments,
  ip,
}: {
  payments: PaymentsDto[];
  ip: string;
}) {
  const { user } = useUser();
  const orderCtx = useContext(OrderContext);
  const router = useRouter();
  const [fullAddress, setFullAddress] = useState<AddressesDto | undefined>();
  const paymentMap = new Map(
    payments.map((item) => [item.id, item.name?.toLowerCase()]),
  );
  const {
    handleSubmit,
    watch,
    control,
    formState: { errors },
    setValue,
    setError,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      payment_id: payments[0]?.id || 0,
      note: '',
      phone: user?.phone || '',
      status: ORDER_STATUS.NEW as string,
      order_external_id: '',
      shipping_city: '',
      shipping_district: '',
      shipping_ward: '',
      address: '',
    },
  });

  const paymentType = (payment_id?: number) => {
    const payment = paymentMap.get(Number(payment_id));
    return (payment || '')?.toLowerCase();
  };
  const onSubmit = (data: FormData) => {
    if (!data?.payment_id) {
      setError('payment_id', {
        message: 'Vui lòng chọn phương thức thanh toán',
      });
      return;
    }
    if (!orderCtx?.cart) {
      return;
    }

    const order: FormData & {
      user_id: number;
      cart: CartDto | undefined;
    } = {
      ...data,
      user_id: user?.id || 0,
      cart: orderCtx?.cart,
    };
    fetch('/api/orders/create', {
      method: 'POST',
      body: JSON.stringify(order),
    })
      .then((rs) => rs.json())
      .then((res) => {
        if (res?.data?.id) {
          if (paymentType(res?.data?.payment_id) === PAYMENT.VN_PAY) {
            const urlVnPay = createVNPayUrl({
              order: res?.data,
              ip,
            });
            orderCtx?.clearCart && orderCtx?.clearCart();
            if (window) {
              window.location.href = urlVnPay || '';
            }
          } else if (paymentType(res?.data?.payment_id) === PAYMENT.FUDIIN) {
            const orderExtensionItem = orderCtx?.cart?.items?.map((item) => {
              return new ItemFudiinDto({
                productId: item?.variant_id?.toString(),
                productName: item?.variant_name,
                category: 'Perfume',
                currency: 'VND',
                quantity: 1,
                price: item?.price || 0,
                totalAmount: item?.price || 0,
              });
            });
            fetch('/api/fudiin/send', {
              method: 'POST',
              body: JSON.stringify(
                new SendTransactionFudiinDto({
                  merchantId: process.env.NEXT_PUBLIC_FUNDIN_MERCHANT_ID,
                  referenceId: res?.data?.id,
                  amount: {
                    currency: 'VND',
                    value: res?.data?.total_price,
                  },
                  storeId: process.env.NEXT_PUBLIC_FUNDIN_STORE_ID || '',
                  requestType: 'installment',
                  paymentMethod: 'WEB',
                  description:
                    'Thanh toan don hang cua user Fudiin ' +
                    res?.data?.user_id +
                    ' voi gia tri ' +
                    res?.data?.total_price,
                  successRedirectUrl:
                    process.env.NEXT_PUBLIC_APP_URL +
                    '/gio-hang/thanh-cong/?orderId=' +
                    res?.data?.id,
                  unSuccessRedirectUrl: '/',
                  customer: new CustomerFudiinDto({
                    phoneNumber: data?.phone,
                    email: data?.email,
                    firstName: data?.name.split(' ')[0],
                    lastName: data?.name.split(' ')[1],
                  }),
                  shipping: new ShippingFudiinDto({
                    city: fullAddress?.city?.full_name || '',
                    district: fullAddress?.district?.full_name || '',
                    ward: fullAddress?.ward?.full_name || '',
                    street: data?.address,
                    houseNumber: data?.phone,
                    country: 'VN',
                  }),
                  items: orderExtensionItem,
                }),
              ),
            })
              .then((rs) => rs.json())
              .then(async (item: ResponseSendTransactionDto) => {
                if (item?.referenceId) {
                  await fetch('/api/orders/update', {
                    method: 'PUT',
                    body: JSON.stringify({
                      id: res?.data?.id,
                      order_external_id: item?.referenceId,
                    }),
                  });
                }
                if (item?.paymentUrl) {
                  window.location.href = item.paymentUrl;
                } else {
                  toast.error('Đã có lỗi xảy ra');
                }
              });
          } else {
            toast.success('Đặt hàng thành công');
            orderCtx?.clearCart && orderCtx?.clearCart();
            router.push('/gio-hang/thanh-cong?orderId=' + res?.data?.id);
          }
        } else {
          toast.error('Đã có lỗi xảy ra');
        }
      })
      .catch((e) => {
        console.log('e', e);
        toast.error('Đã có lỗi xảy ra');
      });
  };

  return (
    <>
      <BreadcrumbComponent label={'Giỏ hàng'} link={'/gio-hang/tom-tat'} />
      <form
        id={'checkout-form'}
        className={twMerge(
          'w-full rounded-[10px] shadow-custom bg-white overflow-hidden relative mx-auto ',
        )}
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className={'flex flex-col-reverse lg:flex-row gap-3 p-3 '}>
          {user && (
            <FormCheckout
              watch={watch}
              control={control}
              payments={payments}
              user={user}
              setValue={setValue}
              ip={ip}
              setError={setError}
              errors={errors}
              setFullAddress={setFullAddress}
            />
          )}

          <ListCart
            setValue={setValue}
            paymentType={paymentType(watch('payment_id' as any) as number)}
          />
        </div>
      </form>
    </>
  );
}
