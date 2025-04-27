import { useRouter } from 'next/router';
import BreadcrumbComponent from '@/components/molecules/breakcrumb';
import { twMerge } from 'tailwind-merge';
import AccountResetUpdatePassword from '@/components/organisms/accountInfo/resetUpdatePassword';

export default function ResetTemplate() {
  const router = useRouter();
  return (
    <>
      <BreadcrumbComponent label={'Reset mật khẩu'} link={'/reset-mat-khau'} />
      <div
        className={twMerge(
          'w-full max-w-[550px] rounded-[10px] shadow-custom bg-white overflow-hidden relative mx-auto',
        )}
      >
        <AccountResetUpdatePassword token={router?.query?.token as string} />
      </div>
    </>
  );
}
