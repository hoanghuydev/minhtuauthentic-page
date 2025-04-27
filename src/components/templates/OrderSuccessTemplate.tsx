import { CheckCircleFilled } from '@ant-design/icons';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function OrderSuccessTemplate() {
  const router = useRouter();
  const orderId = router?.query?.orderId;
  return (
    <div className={'w-full flex items-center justify-center flex-col gap-6'}>
      <h1 className={'text-3xl text-primary font-[700] lg:font-bold'}>
        Cảm ơn bạn đã mua hàng thành công.
      </h1>
      <CheckCircleFilled className={'text-5xl text-primary'} />
      <h3 className={'text-2xl'}>
        <Link href={'/tai-khoan/lich-su/' + orderId}>
          Đơn hàng{' '}
          <span className={'text-primary font-semibold'}>#{orderId}</span>
        </Link>
      </h3>
      <p className={'text-lg text-center'}>
        Đơn hàng của bạn đã được đặt thành công.
      </p>
      <p className={'text-lg text-center'}>
        Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.
      </p>
    </div>
  );
}
