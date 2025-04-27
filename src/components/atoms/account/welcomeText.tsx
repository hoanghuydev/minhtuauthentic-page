import { twMerge } from 'tailwind-merge';

type Props = {
  className?: string;
}
export default function WelcomeText({className}: Props){
  return (
    <p className={twMerge(
      'lg:text-[20px] text-center font-bold', className
    )}>Chào bạn đến với Minhtuauthentic.com | Xin vui lòng đăng nhập
      để xem ưu đãi và thanh toán dễ dàng hơn</p>
  )
}
