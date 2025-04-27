import { twMerge } from 'tailwind-merge';
import FormLogin from '@/components/organisms/account/formLogin';
import BreadcrumbComponent from '@/components/molecules/breakcrumb';

export default function LoginTemplate() {
  return (
    <>
      <BreadcrumbComponent
        label={'Đăng nhập'}
        link={'/dang-nhap'}
      />
      <div
        className={twMerge(
          'w-full max-w-[550px] rounded-[10px] shadow-custom bg-white overflow-hidden relative mx-auto',
        )}
      >
        <FormLogin />
      </div>
    </>

  );
}
