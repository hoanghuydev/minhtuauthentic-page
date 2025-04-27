import useSWR from 'swr';
import { useContext, useEffect, useState } from 'react';
import { Control } from 'react-hook-form';
import FormControl from '@/components/molecules/form/FormControl';
import { ProvinceDto } from '@/dtos/Province.dto';
import { PROVINCE } from '@/config/enum';
import { Button, Radio } from 'antd/es';
import { UserDto } from '@/dtos/User.dto';
import { PaymentsDto } from '@/dtos/Payments.dto';
import OrderContext from '@/contexts/orderContext';
import { toast } from 'react-toastify';
import Link from 'next/link';
import ArrowLeftOutlined from '@ant-design/icons/lib/icons/ArrowLeftOutlined';

import ImageWithFallback from '@/components/atoms/images/ImageWithFallback';
import PlusOutlined from '@ant-design/icons/PlusOutlined';
import { AddressesDto } from '@/dtos/Addresses.dto';
import CheckoutAddress from '@/components/organisms/checkout/address';

export default function FormCheckout({
  payments,
  watch,
  setValue,
  control,
  errors,
  setFullAddress,
}: {
  user?: UserDto;
  payments: PaymentsDto[];
  ip: string;
  control: Control<any>;
  watch: any;
  setValue: any;
  setError: any;
  errors: any;
  setFullAddress: any;
}) {
  const orderCtx = useContext(OrderContext);

  useEffect(() => {
    if (!orderCtx?.cart) {
      toast('Giỏ hàng trống', { type: 'error' });
      window.location.href = '/';
    }
  }, []);

  return (
    <div className={'flex-1'}>
      <CheckoutAddress
        control={control}
        watch={watch}
        setValue={setValue}
        errors={errors}
        setFullAddress={setFullAddress}
      />
      <h3 className={'text-3xl font-[700] lg:font-bold my-6'}>
        Phương thức vận chuyển
      </h3>
      <div className={'flex flex-col'}>
        <Radio className={'border border-gray-200 p-3'} checked>
          Miễn phí vận chuyển
        </Radio>
      </div>
      <h3 className={'text-3xl font-[700] lg:font-bold my-6'}>
        Phương thức thanh toán
      </h3>
      <div className={'flex flex-col'}>
        <FormControl
          control={control}
          errors={errors}
          options={payments}
          radioOptions={payments.map((item) => {
            return {
              label: (
                <div className={'flex gap-2 justify-between w-full'}>
                  <div className={'flex flex-col gap-1'}>
                    <span className={'text-xl font-semibold'}>
                      {item.label || item.name}
                    </span>
                    {item.description && (
                      <div
                        className={'text-sm container-html'}
                        dangerouslySetInnerHTML={{ __html: item.description }}
                      />
                    )}
                  </div>
                  <ImageWithFallback
                    image={item?.images?.[0]?.image}
                    alt={item?.name}
                    className={'w-[60px] h-[60px] shrink-0'}
                  />
                </div>
              ),
              value: item?.id ? (item?.id || '').toString() : '',
            };
          })}
          name={'payment_id'}
          type={'collapse'}
          placeholder={'Chọn phương thức thanh toán'}
          className={'col-span-2'}
        />
      </div>
      <h3 className={'text-3xl font-[700] lg:font-bold my-6'}>Ghi chú</h3>
      <div className={'flex flex-col'}>
        <FormControl
          control={control}
          errors={errors}
          name={'note'}
          type={'textarea'}
          placeholder={'Ghi chú'}
          className={'col-span-2'}
        />
      </div>
    </div>
  );
}
