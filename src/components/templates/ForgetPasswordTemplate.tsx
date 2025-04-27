import { twMerge } from 'tailwind-merge';
import FormRegister from '@/components/organisms/account/formRegister';
import BreadcrumbComponent from '@/components/molecules/breakcrumb';
import FormForgetPassword from '@/components/organisms/account/formForgetPassword';

export default function ForgetPasswordTemplate() {
  return (
    <>
      <BreadcrumbComponent label={'Quên mật khẩu'} link={'/quan-mat-khau'} />
      <div
        className={twMerge(
          'w-full max-w-[550px] rounded-[10px] shadow-custom bg-white overflow-hidden relative mx-auto',
        )}
      >
        <FormForgetPassword />
      </div>
    </>
  );
}
