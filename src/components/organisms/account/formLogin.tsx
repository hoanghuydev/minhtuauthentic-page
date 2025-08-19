import { Form, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import UserOutlined from '@ant-design/icons/UserOutlined';
import LockOutlined from '@ant-design/icons/LockOutlined';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
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
import Link from 'next/link';
import Image from 'next/image';

const schema = yup
  .object({
    username: yup.string().required('Vui lòng nhập tên đăng nhập'),
    password: yup.string().required('Vui lòng nhập mật khẩu'),
  })
  .required();

export default function FormLogin() {
  const { handleReCaptchaVerify } = useGoogleToken('minhtulogin');
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const {
    handleSubmit,
    control,
    register,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const username = watch('username');
  const password = watch('password');

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
    <div className=" flex-1 p-4 justify-center">
      <div className="w-full flex justify-center">
        <div className="w-full h-full max-w-[440px] flex flex-col items-center pt-[30px]">
          <div className="w-full flex flex-col gap-2 lg:gap-3 justify-between items-center">
            <div className="w-full flex flex-col gap-2 lg:gap-3">
              {/* Login Form */}
              <h1 className="hidden lg:!block text-2xl lg:text-3xl text-center text-primary font-bold">
                Đăng nhập MINHTUAUTHENTIC
              </h1>
              <form
                className="w-full flex flex-col gap-2 lg:gap-3"
                onSubmit={handleSubmit(async (data) => {
                  const token = await handleReCaptchaVerify();
                  const rs: { data: UserDto } | null = await fetch(
                    '/api/login',
                    {
                      method: 'POST',
                      body: JSON.stringify({ ...data, token }),
                    },
                  )
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
              >
                {/* Error Message */}
                {errorSubmit && (
                  <div className="w-full text-sm p-3 border border-red-500 bg-red-50 rounded-md text-red-800">
                    {errorSubmit}
                  </div>
                )}

                {/* Username Field */}
                <div className="flex gap-2 group flex-col">
                  <label className="flex items-center gap-2 font-medium select-none text-base">
                    Email / Số điện thoại
                  </label>
                  <div className="flex flex-col gap-2">
                    <div className="p-2 flex items-center gap-2 min-w-0 border transition-colors border-gray-300 focus-within:border-gray-600 text-base min-h-[40px] rounded-md pl-4">
                      <input
                        {...register('username')}
                        type="text"
                        className="w-full h-full bg-transparent border-none outline-none shadow-none ring-0 focus:outline-none focus:border-none focus:ring-0 focus-visible:outline-none focus-visible:border-none focus-visible:ring-0 placeholder:text-gray-300 placeholder:select-none disabled:opacity-80 disabled:cursor-not-allowed disabled:text-gray-500 disabled:placeholder:text-gray-400 overflow-hidden text-ellipsis whitespace-nowrap"
                        placeholder="Nhập email hoặc số điện thoại"
                        value={username}
                      />
                    </div>
                    {errors.username && (
                      <span className="text-red-500 text-sm">
                        {errors.username.message}
                      </span>
                    )}
                  </div>
                </div>

                {/* Password Field */}
                <div className="flex gap-2 group flex-col">
                  <label className="flex items-center gap-2 font-medium select-none text-base">
                    Mật khẩu
                  </label>
                  <div className="flex flex-col gap-2">
                    <div className="p-2 flex items-center gap-2 min-w-0 border transition-colors border-gray-300 focus-within:border-gray-600 text-base min-h-[40px] rounded-md pl-4">
                      <input
                        {...register('password')}
                        type={showPassword ? 'text' : 'password'}
                        className="w-full h-full bg-transparent border-none outline-none shadow-none ring-0 focus:outline-none focus:border-none focus:ring-0 focus-visible:outline-none focus-visible:border-none focus-visible:ring-0 placeholder:text-gray-300 placeholder:select-none disabled:opacity-80 disabled:cursor-not-allowed disabled:text-gray-500 disabled:placeholder:text-gray-400 overflow-hidden text-ellipsis whitespace-nowrap"
                        autoComplete="off"
                        autoCapitalize="off"
                        spellCheck="false"
                        placeholder="Nhập mật khẩu của bạn"
                        value={password}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="flex cursor-pointer items-center justify-center rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 focus:outline-none transition-colors w-[20px] h-[20px] flex-shrink-0"
                        aria-label={
                          showPassword ? 'Hide password' : 'Show password'
                        }
                      >
                        {showPassword ? (
                          <EyeInvisibleOutlined className="w-3 h-3" />
                        ) : (
                          <EyeOutlined className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <span className="text-red-500 text-sm">
                        {errors.password.message}
                      </span>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="w-full">
                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed border border-primary bg-primary text-white hover:border-primary hover:bg-primary disabled:text-gray-300 disabled:bg-gray-200 disabled:border-gray-200 font-medium w-full text-base px-4 py-3 min-h-[40px] rounded-md"
                  >
                    Đăng nhập
                  </button>

                  <Link
                    href="/tai-khoan/quen-mat-khau"
                    className="flex items-center justify-center gap-2 cursor-pointer  text-primary font-medium w-full hover:bg-transparent hover:underline hover:border-transparent text-base px-4 py-3 min-h-[40px] rounded-md mt-2"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
              </form>

              {/* Divider */}
              <div className="w-full flex justify-between items-center gap-4 lg:gap-6">
                <div className="flex-1 h-[1px] bg-gray-200"></div>
                <div className="text-center text-gray-500 text-base flex-shrink-0">
                  Hoặc đăng nhập bằng
                </div>
                <div className="flex-1 h-[1px] bg-gray-200"></div>
              </div>

              <LoginOptions title="Đăng nhập bằng Google" />
            </div>

            {/* Register Link */}
            <div className="w-full flex items-center justify-center mt-2">
              <span className="flex-shrink-0 text-base text-gray-500">
                Bạn chưa có tài khoản?
              </span>
              <Link
                href="/tai-khoan/dang-ky"
                className="flex items-center justify-center gap-2 cursor-pointer border border-white text-primary bg-white hover:border-gray-50 hover:bg-gray-50 disabled:border-white disabled:text-gray-300 disabled:bg-white font-medium px-2 bg-transparent border-transparent hover:border-transparent hover:bg-transparent hover:underline text-base py-3 min-h-[40px] rounded-md"
              >
                Đăng ký ngay
              </Link>
            </div>

            {/* Footer Links */}
            <div className="w-full flex items-center justify-center text-gray-500 text-base text-center">
              <span>
                Mua sắm tại <br />
                <Link
                  href="/"
                  className="text-primary font-medium hover:underline"
                >
                  minhtuauthentic.com
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
