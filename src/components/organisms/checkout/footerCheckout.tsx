import { createPortal } from 'react-dom';
import PaymentButton from '@/components/molecules/paymentButton';
import { useIsMobile } from '@/hooks/useDevice';
type Props = {
  paymentType?: string;
  setValue?: any;
};

export default function FooterCheckout({ paymentType, setValue }: Props) {
  const isMobile = useIsMobile();
  return (
    <>
      {isMobile &&
        createPortal(
          <div
            className={
              'fixed left-0 bottom-0 w-[100dvw] z-10 shadow-custom2 bg-transparent'
            }
          >
            <PaymentButton
              onClick={() => {
                setValue('payment_type_id', undefined);
              }}
              type={paymentType}
              htmlType={'submit'}
              className={'w-full'}
            />
          </div>,
          document.getElementById('checkout-form') as HTMLElement,
        )}
    </>
  );
}
