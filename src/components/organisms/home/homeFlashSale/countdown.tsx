import { useEffect, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';
type Props = {
  end_date: Date;
  className?: string;
};
export default function Countdown({ end_date, className }: Props) {
  const commonClass =
    'bg-white p-1 lg:p-2 rounded-[10px] border border-gray-200 max-lg:text-sm';
  const refInterval = useRef<NodeJS.Timeout | null>(null);
  const [countdown, setCountdown] = useState<{
    hours: string;
    minutes: string;
    seconds: string;
    day: string;
  }>({
    hours: '00',
    minutes: '00',
    seconds: '00',
    day: '00',
  });
  useEffect(() => {
    startTimer();
    return () => {
      refInterval.current && clearInterval(refInterval.current);
    };
  }, []);

  function startTimer() {
    if (refInterval.current) {
      clearInterval(refInterval.current);
    }
    let date = new Date();
    let endDate: Date | number = new Date(end_date);
    if (date.getHours() >= 17) {
      endDate.setDate(endDate.getDate() + 1);
    }
    endDate = endDate.getTime();
    let diff, hours, minutes, seconds, day;

    function timer() {
      diff = (((endDate as number) - Date.now()) / 1000) | 0;

      // Setting and displaying hours, minutes, seconds
      day = (diff / 3600 / 24) | 0;
      hours = (diff / 3600) % 24 | 0;
      minutes = ((diff % 3600) / 60) | 0;
      seconds = diff % 60 | 0;

      day = day < 10 ? '0' + day : day.toString();
      hours = hours < 10 ? '0' + hours : hours.toString();
      minutes = minutes < 10 ? '0' + minutes : minutes.toString();
      seconds = seconds < 10 ? '0' + seconds : seconds.toString();

      setCountdown({
        day,
        hours,
        minutes,
        seconds,
      });
    }
    timer();
    refInterval.current = setInterval(timer, 1000);
  }
  return (
    <div className={className}>
      <p className={'text-white text-2xl'}>Kết thúc sau: </p>
      <div className={twMerge('flex gap-3')}>
        <span className={commonClass}>{countdown.day}</span>
        <span className={commonClass}>{countdown.hours}</span>
        <span className={commonClass}>{countdown.minutes}</span>
        <span className={commonClass}>{countdown.seconds}</span>
      </div>
    </div>

  );
}
