import Countdown from '@/components/organisms/home/homeFlashSale/countdown';

type Props = {
className?: string;
endDate: Date;
}
export default function CountdownContainer({className, endDate}: Props) {
  return <Countdown className={className} end_date={endDate} />
}