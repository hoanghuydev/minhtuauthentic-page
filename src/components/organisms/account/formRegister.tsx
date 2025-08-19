import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  UsergroupAddOutlined,
  LeftOutlined,
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
import Link from 'next/link';

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
    <div className="flex-1 p-2 justify-center w-full">
      <div className="w-full flex justify-center">
        <div className="w-full flex flex-col gap-2 lg:gap-3 justify-between items-center">
          {/* Register Form */}
          <form
            onSubmit={handleSubmit(async (data) => {
              const token = await handleReCaptchaVerify();
              const rs: { data: UserDto } | null = await fetch(
                '/api/register',
                {
                  method: 'POST',
                  body: JSON.stringify({ ...data, token }),
                },
              )
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
            className="w-full flex flex-col gap-4 relative"
          >
            {/* Error Message */}
            {errorSubmit && (
              <div className="w-full text-sm p-3 border border-red-500 bg-red-50 rounded-md text-red-800">
                {errorSubmit}
              </div>
            )}

            {/* Personal Information Section */}
            <h2 className="font-bold text-base md:text-lg">
              Thông tin cá nhân
            </h2>

            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
              {/* Full Name */}
              <div className="flex gap-2 group flex-col">
                <label className="flex items-center gap-2 font-medium select-none text-base">
                  Họ và tên
                </label>
                <FormControl
                  control={control}
                  errors={errors}
                  name="name"
                  type="text"
                  placeholder="Nhập họ và tên"
                  prefix={<UsergroupAddOutlined />}
                  className="flex flex-col gap-2"
                />
              </div>
              <div className="flex gap-2 group flex-col"></div>

              {/* Phone */}
              <div className="flex gap-2 group flex-col">
                <label className="flex items-center gap-2 font-medium select-none text-base">
                  Số điện thoại
                </label>
                <FormControl
                  control={control}
                  errors={errors}
                  name="phone"
                  type="text"
                  placeholder="Nhập số điện thoại"
                  prefix={<PhoneOutlined />}
                  className="flex flex-col gap-2"
                />
              </div>

              {/* Email */}
              <div className="flex gap-2 group flex-col">
                <label className="flex items-center gap-2 font-medium select-none text-base">
                  <span>Email</span>
                </label>
                <div className="flex flex-col gap-2">
                  <FormControl
                    control={control}
                    errors={errors}
                    name="email"
                    type="text"
                    placeholder="Nhập email"
                    prefix={<MailOutlined />}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="flex gap-2 group flex-col">
                <label className="flex items-center gap-2 font-medium select-none text-base">
                  Mật khẩu
                </label>
                <div className="flex flex-col gap-2">
                  <FormControl
                    control={control}
                    errors={errors}
                    name="password"
                    type="password"
                    placeholder="Nhập mật khẩu của bạn"
                    prefix={<LockOutlined />}
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div className="flex gap-2 group flex-col">
                <label className="flex items-center gap-2 font-medium select-none text-base">
                  Nhập lại mật khẩu
                </label>
                <div className="flex flex-col gap-2">
                  <FormControl
                    control={control}
                    errors={errors}
                    name="repassword"
                    type="password"
                    placeholder="Nhập lại mật khẩu của bạn"
                    prefix={<LockOutlined />}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full z-10 box-content grid px-2 md:px-4 py-4 grid-cols-2 gap-4 sticky bottom-0 left-0 right-0 -translate-x-2 md:-translate-x-4">
              <Link
                href="/tai-khoan/dang-nhap"
                className="flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed border border-gray-300 text-base px-4 py-2 min-h-[48px] rounded-md text-gray-800 bg-white hover:border-gray-400 hover:bg-gray-50 disabled:border-gray-300 disabled:text-gray-300 disabled:bg-white w-full px-0 md:px-4 font-medium gap-2"
              >
                <LeftOutlined
                  className="hidden md:inline-block"
                  style={{ fontSize: '22px' }}
                />
                Quay lại đăng nhập
              </Link>
              <button
                type="submit"
                className="flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed border text-base px-4 py-2 min-h-[48px] rounded-md border-primary bg-primary text-white hover:opacity-90 disabled:text-gray-300 disabled:bg-gray-200 disabled:border-gray-200 w-full font-medium px-0 md:px-4"
              >
                Hoàn tất đăng ký
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
