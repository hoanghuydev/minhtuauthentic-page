import { Form, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Button from 'antd/es/button';
import UserOutlined from '@ant-design/icons/UserOutlined';
import FormControl from '@/components/molecules/form/FormControl';
import { useEffect, useState } from 'react';
import { handleDataFetch } from '@/utils/api';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import useGoogleToken from '@/hooks/useGoogleToken';
const schema = yup
  .object({
    email: yup.string().required('Vui lòng nhập email'),
  })
  .required();
export default function FormForgetPassword() {
  const { handleReCaptchaVerify } = useGoogleToken('minhtuforget');
  const router = useRouter();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
    },
  });

  const afterSuccess = () => {
    toast.success(
      'Nếu email này đã được đăng ký, thì chúng tôi đã gửi email cho bạn',
    );
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
        fetch('/api/user/reset-password', {
          method: 'POST',
          body: JSON.stringify({ ...data, token }),
        })
          .then((rs) => rs.json())
          .then((data) => {
            const _data = handleDataFetch(data);
            afterSuccess();
          })
          .catch((error) => {
            toast.error('Yêu cầu thất bại');
            return null;
          });
      })}
      onError={(errors) => {
        console.log(errors);
      }}
      className={'p-4'}
    >
      <h1 className={'text-primary font-semibold text-[24px] mt-3 mb-3'}>
        Quên mật khẩu
      </h1>
      {errorSubmit && (
        <div className={'text-red-500 font-semibold mb-3'}>{errorSubmit}</div>
      )}
      <div className={'flex flex-col gap-3'}>
        <FormControl
          control={control}
          errors={errors}
          name={'email'}
          type={'text'}
          placeholder={'Email'}
          prefix={<UserOutlined />}
        />
        <Button htmlType={'submit'}>Gửi email</Button>
      </div>
    </form>
  );
}
