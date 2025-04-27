import { Form, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import UserOutlined from '@ant-design/icons/UserOutlined';
import LockOutlined from '@ant-design/icons/LockOutlined';
import FormControl from '@/components/molecules/form/FormControl';
import { UserDto } from '@/dtos/User.dto';
import useUser from '@/hooks/useUser';
import { useEffect, useState } from 'react';
import { handleDataFetch } from '@/utils/api';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import useGoogleToken from '@/hooks/useGoogleToken';
import WelcomeText from '@/components/atoms/account/welcomeText';
import LoginOptions from '@/components/atoms/account/LoginOptions';
import LoginButtonGroup from '@/components/atoms/account/LoginButtonGroup';
const schema = yup
  .object({
    username: yup.string().required('Vui lòng nhập tên đăng nhập'),
    password: yup.string().required('Vui lòng nhập mật khẩu'),
  })
  .required();
export default function FormLogin() {
  const { handleReCaptchaVerify } = useGoogleToken('minhtulogin');
  const router = useRouter();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      username: '',
      password: '',
    },
  });
  const { setCookieUser } = useUser();
  useEffect(() => {
    const handler = async (event: MessageEvent) => {
      const data = event?.data;
      if (data?.token) {
        afterLoginSuccess(data);
      }
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('message', handler);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('message', handler);
      }
    };
  }, []);

  const afterLoginSuccess = (data: UserDto) => {
    toast.success('Đăng nhập thành công');
    setCookieUser(data);
    const redirect = router.query.redirectUrl;
    if (redirect) {
      router.push(redirect as string);
    } else {
      router.push('/');
    }
  };

  const [errorSubmit, setErrorSubmit] = useState<string | null>(null);
  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        const token = await handleReCaptchaVerify();
        const rs: { data: UserDto } | null = await fetch('/api/login', {
          method: 'POST',
          body: JSON.stringify({ ...data, token }),
        })
          .then((rs) => rs.json())
          .then((data) => handleDataFetch(data))
          .catch((error) => {
            setErrorSubmit('Tên đăng nhập hoặc mật khẩu không đúng');
            toast.error('Đăng nhập thất bại');
            return null;
          });
        if (rs?.data?.token) {
          afterLoginSuccess(rs.data);
        }
      })}
      onError={(errors) => {
        console.log(errors);
      }}
      className={'p-4'}
    >
      <WelcomeText />
      <h1 className={'text-primary font-semibold text-[24px] mt-3 mb-3'}>
        Đăng Nhập
      </h1>
      {errorSubmit && (
        <div className={'text-red-500 font-semibold mb-3'}>{errorSubmit}</div>
      )}
      <div className={'flex flex-col gap-3'}>
        <FormControl
          control={control}
          errors={errors}
          name={'username'}
          type={'text'}
          placeholder={'Email / Số Điện thoại'}
          prefix={<UserOutlined />}
        />
        <FormControl
          control={control}
          errors={errors}
          name={'password'}
          type={'password'}
          placeholder={'Mật khẩu'}
          prefix={<LockOutlined />}
        />
        <LoginButtonGroup
          mainTitle={'Đăng nhập'}
          secondaryTitle={'Đăng ký'}
          secondarySubTitle={'Bạn chưa có tài khoản?'}
          secondaryHref={'/tai-khoan/dang-ky'}
        />
      </div>
      <LoginOptions title={'Đăng nhập với'} />
    </form>
  );
}
