import Link from 'next/link';
import { twMerge } from 'tailwind-merge';
import { Button } from 'antd/es';

const HeaderItem = ({
  icon,
  children,
  className,
  isButton,
  onClick,
  href,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  isButton?: boolean;
  onClick?: () => void;
  href?: string;
}) => {
  const renderItem = () => {
    return (
      <div className={'text-white flex text-[14px] items-center gap-[10px]'}>
        {icon}
        <div className={twMerge(className)}>{children}</div>
      </div>
    );
  };
  return (
    <>
      {isButton ? (
        <button type={'button'} onClick={onClick}>
          {renderItem()}
        </button>
      ) : (
        <Link
          href={href || '/'}
          className={
            'block rounded-[10px] hover:bg-linkHover transition-colors duration-300 p-2'
          }
        >
          {renderItem()}
        </Link>
      )}
    </>
  );
};
export default HeaderItem;
