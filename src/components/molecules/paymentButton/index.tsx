import { twMerge } from 'tailwind-merge';
import { PAYMENT, PAYMENT_TYPE_ID } from '@/config/enum';

type Props = {
  onClick: () => void;
  type?: string;
  htmlType?: 'submit' | 'button';
  className?: string;
};
export default function PaymentButton({ onClick, type, htmlType, className }: Props) {
  const classSubText = 'font-extrabold uppercase text-2xl text-center mx-auto';
  const classText =
    'flex-1 flex flex-col gap-1 text-center p-3 text-center rounded-[10px] '+className;
  const renderItem = () => {
    switch (type) {
      case PAYMENT.FUDIIN:
        return (
          <button
            type={htmlType}
            style={{
              backgroundImage: `linear-gradient(#08D2CD, #6A61EE)`,
            }}
            className={twMerge(classText, 'text-white')}
            onClick={onClick}
          >
            <span className={classSubText}>Thanh toán qua Fudiin</span>
            <span className={'flex items-center justify-center m-auto'}>
              Xài trước, trả sau
            </span>
          </button>
        );
      case PAYMENT.VN_PAY:
        return (
          <button
            type={htmlType}
            style={{
              backgroundImage: `linear-gradient(#005BA9, #ED1C24)`,
            }}
            className={twMerge(classText, 'text-white')}
            onClick={onClick}
          >
            <span className={classSubText}>Thanh toán qua VNPAY</span>
            <span className={'flex items-center justify-center m-auto'}>
              Thanh toán qua cổng VNPAY
            </span>
          </button>
        );
      case PAYMENT.MOMO:
        return (
          <button
            type={htmlType}
            style={{
              background: `#AF126A`,
            }}
            className={twMerge(classText, 'text-white')}
            onClick={onClick}
          >
            <span className={classSubText}>Ví trả sau momo</span>
            <span className={'flex items-center justify-center m-auto'}>
              Xài trước, trả sau
            </span>
          </button>
        );
      case PAYMENT.COD:
        return (
          <button
            type={htmlType}
            className={twMerge(classText, 'bg-primary text-white')}
            onClick={onClick}
          >
            <span className={twMerge(classSubText)}>Thanh toán </span>
            <span className={'mx-auto'}>Thanh toán COD, chuyển khoản</span>
          </button>
        );
      default:
        return (
          <button
            type={htmlType}
            className={twMerge(classText, 'bg-primary text-white')}
            onClick={onClick}
          >
            <span className={twMerge(classSubText)}>Thanh toán</span>
            <span className={'mx-auto'}>Chuyển khoản qua ngân hàng</span>
          </button>
        );
    }
  };
  return <>{renderItem()}</>;
}
