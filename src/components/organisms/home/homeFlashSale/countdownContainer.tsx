import Countdown from '@/components/organisms/home/homeFlashSale/countdown';
import { twMerge } from 'tailwind-merge';

type Props = {
  className?: string;
  endDate: Date;
};
export default function CountdownContainer({ className, endDate }: Props) {
  return (
    <div
      className={twMerge(
        'flex items-center lg:gap-2 flex-col justify-center',
        className,
      )}
    >
      <p className="text-[18px] text-white font-bold leading-[1]">
        Kết thúc sau
      </p>
      <Countdown end_date={endDate} />
    </div>
  );
}
