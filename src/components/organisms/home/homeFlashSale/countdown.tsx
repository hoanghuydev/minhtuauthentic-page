import { useMemo } from 'react';
import { twMerge } from 'tailwind-merge';
import FlipClockCountdown from '@leenguyen/react-flip-clock-countdown';
import '@leenguyen/react-flip-clock-countdown/dist/index.css';

type Props = {
  end_date: Date;
  className?: string;
};

export default function Countdown({ end_date, className }: Props) {
  // Tính toán thời gian kết thúc
  const targetTime = useMemo(() => {
    const date = new Date();
    const endDate = new Date(end_date);
    
    // Nếu hiện tại sau 17h, đặt ngày kết thúc là ngày mai
    if (date.getHours() >= 17) {
      endDate.setDate(endDate.getDate() + 1);
    }
    
    return endDate.getTime();
  }, [end_date]);

  return (
    <div className="grid place-items-center max-sm:mt-5">
      <style jsx>{`
        .flip-clock-custom .fcc__unit_time {
          background-color:  var(--primary-color) !important;
        }
      `}</style>
      <FlipClockCountdown
        to={targetTime}
        labels={['NGÀY', 'GIỜ', 'PHÚT', 'GIÂY']}
        showLabels={true}
        showSeparators={false}
        className={twMerge('flip-clock-custom', className)}
        digitBlockStyle={{
          width: 32,
          height: 32,
          fontSize: 15,
          fontWeight: 'bold',
          backgroundColor: 'var(--primary-color)',
          color: '#ffffff',
        }}
        labelStyle={{
          fontSize: 12,
          fontWeight: 500,
          textTransform: 'uppercase',
          color: '#ffffff'
        }}
        duration={0.75}
        renderOnServer={true}
      />
    </div>
  );
}
