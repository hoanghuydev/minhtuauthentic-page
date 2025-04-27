import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons';
import FormControl from '@/components/molecules/form/FormControl';
import { UserDto } from '@/dtos/User.dto';
import useUser from '@/hooks/useUser';
import { useState } from 'react';
import { handleDataFetch } from '@/utils/api';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import useGoogleToken from '@/hooks/useGoogleToken';
import WelcomeText from '@/components/atoms/account/welcomeText';
import LoginOptions from '@/components/atoms/account/LoginOptions';
import LoginButtonGroup from '@/components/atoms/account/LoginButtonGroup';

let timeoutEmail: any = null;
let timeoutPhone: any = null;

const schema = yup
  .object({
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
                `/api/user/userCheck/?type=email&value=${values}`,
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
                `/api/user/userCheck/?type=phone&value=${values}`,
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
    name: yup.string(),
    password: yup
      .string()
      .min(6, 'Ít nhất 6 ký tự')
      .max(20, 'Nhiều nhất 20 ký tự')
      .required('Vui lòng nhập mật khẩu'),
    repassword: yup
      .string()
      .oneOf([yup.ref('password'), undefined], 'Mật khẩu không khớp')
      .required('Vui lòng nhập lại mật khẩu'),
  })
  .required();
export default function FormRegister() {
  const router = useRouter();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      phone: '',
      name: '',
      password: '',
      repassword: '',
    },
  });
  const { setCookieUser } = useUser();
  const [errorSubmit, setErrorSubmit] = useState<string | null>(null);
  const { handleReCaptchaVerify } = useGoogleToken('minhturegister');
  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        const token = await handleReCaptchaVerify();
        const rs: { data: UserDto } | null = await fetch('/api/register', {
          method: 'POST',
          body: JSON.stringify({ ...data, token }),
        })
          .then((rs) => rs.json())
          .then((data) => handleDataFetch(data))
          .catch((error) => {
            toast.error('Đăng ký thất bại');
            setErrorSubmit('Có lỗi xảy ra xin hãy thử lại');
            return null;
          });
        if (rs?.data) {
          toast.success('Đăng ký thành công');
          setCookieUser(rs.data);
          const redirect = router.query.redirectUrl;
          if (redirect) {
            router.push(redirect as string);
          } else {
            router.push('/');
          }
        }
      })}
      onError={(errors) => {
        console.log(errors);
      }}
      className={'p-4'}
    >
      <WelcomeText />
      <h1 className={'text-primary font-semibold text-[24px] mb-6'}>Đăng Ký</h1>
      {errorSubmit && (
        <div className={'text-red-500 font-semibold mb-3'}>{errorSubmit}</div>
      )}
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
          placeholder={'Số điện thoại *'}
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
        <FormControl
          control={control}
          errors={errors}
          name={'password'}
          type={'password'}
          placeholder={'Mật khẩu *'}
          prefix={<LockOutlined />}
        />
        <FormControl
          control={control}
          errors={errors}
          name={'repassword'}
          type={'password'}
          placeholder={'Nhập lại mật khẩu *'}
          prefix={<LockOutlined />}
        />
        <LoginButtonGroup
          mainTitle={'Đăng ký'}
          secondaryTitle={'Đăng nhập'}
          secondarySubTitle={'Bạn đã có tài khoản?'}
          secondaryHref={'/tai-khoan/dang-nhap'}
        />
      </div>
      <LoginOptions title={'Đăng ký với'} />
    </form>
  );
}
