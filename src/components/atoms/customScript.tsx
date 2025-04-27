import Script from 'next/script';
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
type Props = {
  isHaveFudiin?: boolean;
};
export default function CustomScript({ isHaveFudiin }: Props) {
  const router = useRouter();
  const [isRender, setIsRender] = useState(false);
  const [isRenderFudiin, setIsRenderIsFudiin] = useState(false);
  useEffect(() => {
    const loadEvent = new Event('load');
    window.dispatchEvent(loadEvent);
  }, [router.pathname]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://pc.baokim.vn/js/bk_plus_v2.popup.js';
    script.async = true;
    if (isHaveFudiin) {
      const script2 = document.createElement('script');
      script2.src = `${process.env.NEXT_PUBLIC_FUNDIN_URL}/merchants/productdetailjs/${process.env.NEXT_PUBLIC_FUNDIN_MERCHANT_ID}.js`;
      script2.async = true;
      if (!isRenderFudiin) {
        setTimeout(() => {
          setIsRenderIsFudiin(true);
          document.body.appendChild(script2);
        }, 1000);
      }
    }
    if (!isRender) {
      setTimeout(() => {
        setIsRender(true);
        document.body.appendChild(script);
        setTimeout(() => {
          const loadEvent = new Event('load');
          window.dispatchEvent(loadEvent);
        }, 500);
      }, 1000);
    }
  }, []);

  return <></>;
}
