import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

const Badge = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div className={twMerge('py-[2px] px-[4px] text-white rounded-[10px] text-[12px]', className)}>
      <span>{children}</span>
    </div>
  );
};
export default Badge;
