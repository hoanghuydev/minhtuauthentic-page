import RatingDto from '@/dtos/Rating.dto';
import { Avatar, Rate } from 'antd/es';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
type Props = {
  ratings: RatingDto[];
};
export function ProductRatingList({ ratings }: Props) {
  return (
    <div className={'flex flex-col gap-6'}>
      {ratings.map((rating, index) => {
        return (
          <div key={index} className={'flex flex-row gap-6'}>
            <Avatar className={'bg-primary shrink-0'} size="large">
              {rating?.name?.charAt(0).toUpperCase() || 'A'}
            </Avatar>
            <div className={'flex flex-col gap-3'}>
              <p className={'font-semibold '}>
                <span className={'mr-3'}>{rating?.name}</span>

                <span className={'text-gray-400 text-sm italic'}>
                  {dayjs(rating?.created_at).fromNow()}
                </span>
              </p>
              <Rate disabled defaultValue={rating.point} />
              <div
                className={'whitespace-pre-line'}
                dangerouslySetInnerHTML={{ __html: rating?.content || '' }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
