import FormRegister from '@/components/organisms/account/formRegister';
import BreadcrumbComponent from '@/components/molecules/breakcrumb';
import Image from 'next/image';
import RegisterImage from '@/static/images/character-show.png';
import LoginOptions from '../atoms/account/LoginOptions';
export default function RegisterTemplate() {
  return (
    <>
      <BreadcrumbComponent label={'Đăng ký'} link={'/dang-ky'} />
      <div className="w-full p-2 lg:p-6">
        <div className="w-full max-w-[800px] mx-auto flex flex-col justify-center items-center gap-2">
          {/* Header */}
          <h1 className="text-base md:text-3xl lg:text-4xl text-center md:text-primary font-bold">
            Đăng ký thành viên
          </h1>

          {/* Register Ant Image */}
          <Image
            alt="Register Character"
            title="Register Character"
            width={250}
            height={250}
            className="w-[112px] h-[112px] md:w-[180px] md:h-[180px] object-contain"
            src={RegisterImage}
          />

          {/* Social Login Section */}
          <span className="font-normal text-base md:text-base text-gray-500">
            Đăng ký bằng tài khoản mạng xã hội
          </span>

          <div className="w-full flex gap-4 md:gap-8 justify-between items-center max-w-[450px]">
            {/* Google Button */}
            <LoginOptions title="Đăng ký bằng Google" className="w-full" />
          </div>

          {/* Or Text */}
          <span className="font-normal text-base md:text-base text-gray-500">
            Hoặc điền thông tin sau
          </span>

          {/* Register Form */}
          <FormRegister />
        </div>
      </div>
    </>
  );
}
