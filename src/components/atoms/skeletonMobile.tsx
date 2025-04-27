import { Skeleton } from 'antd/es';
import { twMerge } from 'tailwind-merge';
import { Fragment } from 'react';
type Props = {
  className?: string;
  classNameItem?: string;
  total?: number;
};
export default function SkeletonMobile({
  className,
  classNameItem,
  total,
}: Props) {
  return (
    <div className={twMerge('grid grid-cols-4 gap-[10px] mt-6', className)}>
      {Array.from({ length: total || 8 }).map((_, index) => {
        return (
          <Fragment key={'skeleton-fragment-' + index}>
            <Skeleton.Image className={twMerge('w-full', classNameItem)} />
          </Fragment>
        );
      })}
    </div>
  );
}
