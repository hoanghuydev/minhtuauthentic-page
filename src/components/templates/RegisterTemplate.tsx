import { twMerge } from 'tailwind-merge';
import FormRegister from '@/components/organisms/account/formRegister';
import BreadcrumbComponent from '@/components/molecules/breakcrumb';

export default function RegisterTemplate() {
  return (
    <>
      <BreadcrumbComponent
        label={'Đăng ký'}
        link={'/dang-ky'}
      />
      <div
        className={twMerge(
          'w-full max-w-[550px] rounded-[10px] shadow-custom bg-white overflow-hidden relative mx-auto',
        )}
      >
        <FormRegister />
      </div>
    </>

  );
}
