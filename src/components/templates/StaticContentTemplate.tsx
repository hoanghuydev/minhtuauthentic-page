import { StaticContentsDto } from '@/dtos/StaticContents.dto';
import { twMerge } from 'tailwind-merge';

type Props = {
  staticContent: StaticContentsDto;
};
const StaticContentTemplate = ({ staticContent }: Props) => {
  return (
    <div
      className={twMerge(
        'w-full max-rounded-[10px] shadow-custom bg-white overflow-hidden relative mx-auto rounded-[10px] p-3',
      )}
    >
      <h1 className={'text-primary font-[700] lg:font-bold text-2xl mb-3'}>
        {staticContent?.title}
      </h1>
      <div
        className={'mt-6'}
        dangerouslySetInnerHTML={{ __html: staticContent?.content || '' }}
      />
    </div>
  );
};
export default StaticContentTemplate;
