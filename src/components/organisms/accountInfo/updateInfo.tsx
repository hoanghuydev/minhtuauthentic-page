import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormControl from '@/components/molecules/form/FormControl';
import {
  MailOutlined,
  PhoneOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons';
import { Button } from 'antd/es';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { UserDto } from '@/dtos/User.dto';
import useUser from '@/hooks/useUser';

type DefaultFormProps = {
  email: string;
  name?: string;
  phone: string;
};

type Props = {
  profile: UserDto;
};
let timeoutEmail: any = null;
let timeoutPhone: any = null;
export default function AccountInfoUpdate({ profile }: Props) {
  const schema = yup
    .object({
      name: yup.string(),
      email: yup
        .string()
        .email('Định dạng mail ko chính xác')
        .max(30)
        .required('Vui lòng nhập email')
        .test({
          message: () => 'Email này đã tồn tại',
          test: async (values: string) => {
            if (timeoutEmail) clearTimeout(timeoutEmail);
            const rsPromise = await new Promise((resolve) => {
              timeoutEmail = setTimeout(async () => {
                const result = await fetch(
                  `/api/user/userCheck/?type=email&value=${values}&id=${profile?.id}`,
                )
                  .then((res) => res.json())
                  .catch((e) => null);
                resolve(!result?.data?.id);
              }, 300);
            });
            return rsPromise;
          },
        } as any),
      phone: yup
        .string()
        .required('Số điện thoại không được để trống')
        .test({
          message: () => 'Phone này đã tồn tại',
          test: async (values: string) => {
            if (!values) return true;
            if (timeoutPhone) clearTimeout(timeoutPhone);
            const rsPromise = await new Promise((resolve) => {
              timeoutPhone = setTimeout(async () => {
                const result = await fetch(
                  `/api/user/userCheck/?type=phone&value=${values}&id=${profile?.id}`,
                )
                  .then((res) => res.json())
                  .catch((e) => {
                    console.log(e);
                    return null;
                  });
                resolve(!result?.data?.id);
              });
            });
            return rsPromise;
          },
        } as any),
    })
    .required();
  const [loading, setLoading] = useState(false);
  const { setCookieUser } = useUser();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<DefaultFormProps>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: profile?.name || '',
      email: profile?.email || '',
      phone: profile?.phone || '',
    },
  });

  const onSubmit = async (data: DefaultFormProps) => {
    setLoading(true);
    await fetch('/api/user/profile', {
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

  return (
    <div className={'p-4'}>
      <h1 className={'text-2xl font-[700] lg:font-bold mb-3 text-primary'}>
        Thông tin tài khoản
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        onError={(errors) => {
          console.log(errors);
        }}
      >
        <div className={'flex flex-col gap-3'}>
          <FormControl
            control={control}
            errors={errors}
            name={'email'}
            type={'text'}
            placeholder={'Email *'}
            prefix={<MailOutlined />}
          />
          <FormControl
            control={control}
            errors={errors}
            name={'phone'}
            type={'text'}
            placeholder={'Số điện thoại'}
            prefix={<PhoneOutlined />}
          />
          <FormControl
            control={control}
            errors={errors}
            name={'name'}
            type={'text'}
            placeholder={'Tên'}
            prefix={<UsergroupAddOutlined />}
          />
          <div className={'flex justify-between'}>
            <Button type="primary" htmlType={'submit'} loading={loading}>
              Cập nhật
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
