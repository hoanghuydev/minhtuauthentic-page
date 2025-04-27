import ClockCircleOutlined from '@ant-design/icons/lib/icons/ClockCircleOutlined';
import dayjs from 'dayjs';
import { NewsDto } from '@/dtos/News.dto';

const NewsClock = ({ item }: { item: NewsDto }) => {
  return (
    <p className={'text-[#777] text-[12px] flex items-center gap-2'}>
      <ClockCircleOutlined />
      <span>{dayjs(item.created_at).format('DD/MM/YYYY')}</span>
    </p>
  );
};
export default NewsClock;
