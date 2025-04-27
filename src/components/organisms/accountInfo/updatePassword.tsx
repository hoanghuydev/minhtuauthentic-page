import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import FormControl from '@/components/molecules/form/FormControl';
import { LockOutlined } from '@ant-design/icons';
import { UserDto } from '@/dtos/User.dto';
import { toast } from 'react-toastify';
import { useState } from 'react';
import useUser from '@/hooks/useUser';
import { Button } from 'antd/es';

type DefaultFormProps = {
  password: string;
  newPassword: string;
  rePassword: string;
};

const schema = yup.object({
  password: yup.string().required('Vui lòng nhập mật khẩu cũ'),
  newPassword: yup
    .string()
    .min(6, 'Ít nhất 6 ký tự')
    .max(20, 'Nhiều nhất 20 ký tự')
    .required('Vui lòng nhập mật khẩu mới'),
  rePassword: yup
    .string()
    .oneOf([yup.ref('newPassword'), undefined], 'Mật khẩu không khớp')
    .required('Vui lòng nhập lại mật khẩu mới'),
});

export default function AccountUpdatePassword() {
  const [loading, setLoading] = useState(false);
  const { setCookieUser } = useUser();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<DefaultFormProps>({
    resolver: yupResolver(schema),
    defaultValues: {
      password: '',
      newPassword: '',
      rePassword: '',
    },
  });

  const onSubmit = async (data: DefaultFormProps) => {
    setLoading(true);
    await fetch('/api/user/update-password', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data: { data: UserDto }) => {
        if (data?.data) {
          toast.success('Cập nhật thành công');
          setCookieUser(data.data);
        }
      })
      .catch((e) => {
        console.log(e);
        toast.error('Có lỗi xảy ra');
      })
      .finally(() => {
        setLoading(false);
      });
  };
  console.log(errors);
  return (
    <div className={'p-4'}>
      <h1 className={'text-2xl font-[700] lg:font-bold mb-3 text-primary'}>
        Thay đổi mật khẩu
      </h1>
      <form
        className={'flex flex-col gap-3'}
        onSubmit={handleSubmit(onSubmit)}
        onError={(errors) => {
          console.log(errors);
        }}
      >
        <FormControl
          control={control}
          errors={errors}
          name={'password'}
          type={'password'}
          placeholder={'Mật khẩu cũ *'}
          prefix={<LockOutlined />}
        />
        <FormControl
          control={control}
          errors={errors}
          name={'newPassword'}
          type={'password'}
          placeholder={'Mật khẩu mới *'}
          prefix={<LockOutlined />}
        />
        <FormControl
          control={control}
          errors={errors}
          name={'rePassword'}
          type={'password'}
          placeholder={'Nhập lại mật khẩu *'}
          prefix={<LockOutlined />}
        />
        <div className={'flex justify-between'}>
          <Button type="primary" htmlType={'submit'} loading={loading}>
            Cập nhật
          </Button>
        </div>
      </form>
    </div>
  );
}
