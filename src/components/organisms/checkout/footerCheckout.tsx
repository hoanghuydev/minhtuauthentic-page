import { createPortal } from 'react-dom';
import PaymentButton from '@/components/molecules/paymentButton';
import { useIsMobile } from '@/hooks/useDevice';
import { useEffect, useState } from 'react';

type Props = {
  paymentType?: string;
  setValue?: any;
  loading?: boolean;
};

export default function FooterCheckout({ paymentType, setValue, loading }: Props) {
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Only render the portal on the client side when the DOM is available
  const checkoutElement =
    typeof document !== 'undefined'
      ? document.getElementById('checkout-form')
      : null;

  return (
    <>
      {isMobile &&
        checkoutElement &&
        createPortal(
          <div
            className={
              'fixed left-0 bottom-0 w-full z-[1002] rounded-t-[10px] shadow-custom2 bg-white'
            }
          >
            <PaymentButton
              onClick={() => {
                setValue('payment_type_id', undefined);
              }}
              type={paymentType}
              htmlType={'submit'}
              className={'w-full'}
              loading={loading}
            />
          </div>,
          checkoutElement,
        )}
    </>
  );
}
