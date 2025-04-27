import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

export default function LayoutNews({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={twMerge(
        'w-full rounded-[10px] shadow-custom bg-white overflow-hidden relative mx-auto p-3',
        className,
      )}
    >
      {children}
    </div>
  );
}
