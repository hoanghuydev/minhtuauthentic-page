import { useEffect, useState } from 'react';
import { useIsMobile, useIsDesktop } from '@/hooks/useDevice';
import dynamic from 'next/dynamic';

const CountdownContainer = dynamic(
  () => import('@/components/organisms/home/homeFlashSale/countdownContainer'),
  {
    ssr: false,
  },
);

type Props = {
  endDate: Date;
};

export default function ResponsiveCountdown({ endDate }: Props) {
  const [mounted, setMounted] = useState(false);
  const isMobile = useIsMobile();
  const isDesktop = useIsDesktop();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything on server-side to avoid hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <>
      {/* Desktop Countdown */}
      {isDesktop && (
        <div className="absolute top-12 right-3 z-10">
          <CountdownContainer
            className={'relative flex items-center justify-center'}
            endDate={endDate}
          />
        </div>
      )}

      {/* Mobile Countdown */}
      {isMobile && (
        <div className="flex gap-3 mb-3 items-center justify-center">
          <CountdownContainer
            className={'flex gap-3 items-center justify-center'}
            endDate={endDate}
          />
        </div>
      )}
    </>
  );
}
