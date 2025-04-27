import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import useSWR from 'swr';
import { useCallback, useEffect, useState } from 'react';
import { PROVINCE } from '@/config/enum';
import { ProvinceDto } from '@/dtos/Province.dto';
import useUser from '@/hooks/useUser';
import FormControl from '@/components/molecules/form/FormControl';
import Button from 'antd/es/button/button';
import { toast } from 'react-toastify';
import { AddressesDto } from '@/dtos/Addresses.dto';
import ListFieldFormAddress from '@/components/organisms/address/listField';

export type FormData = {
  title: string;
  email: string;
  name: string;
  phone: string;
  shipping_city: string;
  shipping_district: string;
  shipping_ward: string;
  shipping_address: string;
  user_id?: number;
  is_default?: boolean;
};
const schema = yup
  .object({
    title: yup.string().required('Vui lòng nhập tiêu đề'),
    name: yup
      .string()
      .required('Vui lòng nhập tên người nhận')
      .test({
        message: () => 'Tên phải ít nhất 2 chữ',
        test: async (values: string) => {
          const arr = values.split(' ');
          return arr.length >= 2;
        },
      } as any),
    phone: yup.string().required('Vui lòng nhập số điện thoại'),
    email: yup
      .string()
      .email('Email không hợp lệ')
      .required('Vui lòng nhập email'),
    user_id: yup.number(),
    shipping_city: yup.string().required('Vui lòng chọn tỉnh/thành phố'),
    shipping_district: yup.string().required('Vui lòng chọn quận/huyện'),
    shipping_ward: yup.string().required('Vui lòng chọn phường/xã'),
    shipping_address: yup.string().required('Vui lòng nhập địa chỉ'),
    is_default: yup.boolean(),
  })
  .required();
type Props = {
  onDone: () => void;
};
export default function FormAddress({ onDone }: Props) {
  const { user } = useUser();
  const {
    handleSubmit,
    watch,
    control,
    formState: { errors },
    setValue,
    setError,
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      title: '',
      email: '',
      phone: '',
      shipping_city: '',
      shipping_district: '',
      shipping_ward: '',
      shipping_address: '',
      user_id: user?.id,
      is_default: false,
    },
  });
  const onSubmit = async (data: FormData) => {
    fetch('/api/orders/addresses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((rs: any) => {
        if (rs?.data) {
          toast.success('Đã thêm địa chỉ');
        }
      })
      .finally(() => {
        reset();
        onDone();
      });
  };
  return (
    <form className={'flex flex-col gap-3'} onSubmit={handleSubmit(onSubmit)}>
      <div className={'grid grid-col-1 lg:grid-col-2 gap-1 lg:gap-3'}>
        <FormControl
          control={control}
          errors={errors}
          name={'title'}
          type={'text'}
          placeholder={'Tên gợi nhớ'}
          className={'col-span-2'}
        />
        <ListFieldFormAddress
          watch={watch}
          control={control}
          errors={errors}
          setValue={setValue}
        />
        <FormControl
          control={control}
          errors={errors}
          name={'shipping_address'}
          type={'text'}
          placeholder={'Tên đường, số nhà'}
          className={'col-span-2'}
        />
        <FormControl
          control={control}
          errors={errors}
          name={'is_default'}
          type={'switch'}
          placeholder={'Mặc định'}
        />
      </div>

      <Button type={'primary'} htmlType={'submit'}>
        Thêm địa chỉ
      </Button>
    </form>
  );
}
