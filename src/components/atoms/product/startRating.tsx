import { Star } from '@/components/icons/star';
import { ReactNode } from 'react';

export default function StartRating() {
  const count = 5;
  const renderStart = () => {
    const arr: ReactNode[] = [];
    for (let i = 0; i < count; i++) {
      arr.push(<Star key={i} className={'w-4 h-4'} />);
    }
    return arr;
  };
  return (
    <>
      <span className={'font-semibold text-primary flex pt-[2px]'}>
        {renderStart()}
      </span>
    </>
  );
}
