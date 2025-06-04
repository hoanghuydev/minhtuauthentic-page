import { useEffect, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';
type Props = {
  end_date: Date;
  className?: string;
};
export default function Countdown({ end_date, className }: Props) {
  const digitClass =
    'bg-white text-primary w-8 h-8 flex items-center justify-center mx-1 rounded-md text-[15px] font-bold';
  const labelClass = 'text-white text-xs font-medium';
  const containerClass = 'bg-primary p-1 rounded-md flex flex-col items-center';

  const refInterval = useRef<NodeJS.Timeout | null>(null);
  const [countdown, setCountdown] = useState<{
    hours: string[];
    minutes: string[];
    seconds: string[];
    day: string[];
  }>({
    hours: ['0', '0'],
    minutes: ['0', '0'],
    seconds: ['0', '0'],
    day: ['0', '0'],
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
        day: day.split(''),
        hours: hours.split(''),
        minutes: minutes.split(''),
        seconds: seconds.split(''),
      });
    }
    timer();
    refInterval.current = setInterval(timer, 1000);
  }
  return (
    <div className="grid place-items-center pt-2">
      <div className={twMerge('flex gap-1', className)}>
        <div className={containerClass}>
          <span className={labelClass}>NGÀY</span>
          <div className="flex">
            {countdown.day.map((digit, index) => (
              <div key={`day-${index}`} className={digitClass}>
                {digit}
              </div>
            ))}
          </div>
        </div>

        <div className={containerClass}>
          <span className={labelClass}>GIỜ</span>
          <div className="flex">
            {countdown.hours.map((digit, index) => (
              <div key={`hour-${index}`} className={digitClass}>
                {digit}
              </div>
            ))}
          </div>
        </div>

        <div className={containerClass}>
          <span className={labelClass}>PHÚT</span>
          <div className="flex">
            {countdown.minutes.map((digit, index) => (
              <div key={`minute-${index}`} className={digitClass}>
                {digit}
              </div>
            ))}
          </div>
        </div>

        <div className={containerClass}>
          <span className={labelClass}>GIÂY</span>
          <div className="flex">
            {countdown.seconds.map((digit, index) => (
              <div key={`second-${index}`} className={digitClass}>
                {digit}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
