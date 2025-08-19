import { twMerge } from 'tailwind-merge';
import FormLogin from '@/components/organisms/account/formLogin';
import BreadcrumbComponent from '@/components/molecules/breakcrumb';
import LoginInfo from '../organisms/account/loginInfo';

export default function LoginTemplate() {
  return (
    <>
      <BreadcrumbComponent label={'Đăng nhập'} link={'/dang-nhap'} />
      <div className={twMerge('w-full flex justify-center items-stretch')}>
        <LoginInfo />
        <FormLogin />
      </div>
    </>
  );
}
