import SearchOutlined from '@ant-design/icons/SearchOutlined';
import { Button, Input, InputRef } from 'antd';
import CloseCircle from '@/components/icons/closeCircle';
import { KeyboardEventHandler, RefObject, useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

type Props = {
  className?: string;
  onChange?: (value: string) => void;
  onClick?: (e: unknown) => void;
  onKeyUp?: (e: unknown) => void;
  onCloseClick?: () => void;
  ref?: RefObject<InputRef | undefined>;
};
export default function InputSearch({
  className,
  onChange,
  onClick,
  onKeyUp,
  onCloseClick,
  ref,
}: Props) {
  const [value, setValue] = useState<string>('');

  useEffect(() => {
    if (value.length > 0) {
      onChange && onChange(value);
    }
  }, [value]);

  return (
    <Input
      className={twMerge(
        'h-[40px] text-black rounded-[10px] border-0 p-[5px_10px] focus-visible:outline-none focus-visible:border-0 w-full',
        className,
      )}
      ref={ref as RefObject<InputRef>}
      type="text"
      placeholder="Tìm kiếm sản phẩm"
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
      }}
      prefix={<SearchOutlined className={'w-6 h-6'} />}
      onKeyUp={(e: unknown) => {
        onKeyUp && onKeyUp(e);
      }}
      suffix={
        <Button
          icon={<CloseCircle className={'w-6 h-6'} />}
          type={'link'}
          onClick={() => {
            setValue('');
            onCloseClick && onCloseClick();
          }}
        ></Button>
      }
      onClick={(e) => {
        onClick && onClick(e);
        // ctx?.setIsOpenSearch && ctx.setIsOpenSearch(true);
      }}
    />
  );
}
