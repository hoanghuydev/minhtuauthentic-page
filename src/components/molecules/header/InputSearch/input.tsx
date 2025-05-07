import SearchOutlined from '@ant-design/icons/SearchOutlined';
import { Button, Input, InputRef } from 'antd';
import CloseCircle from '@/components/icons/closeCircle';
import { RefObject, useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

type Props = {
  className?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onClick?: (e: unknown) => void;
  onKeyUp?: (e: unknown) => void;
  onCloseClick?: () => void;
  onSearchClick?: () => void;
  ref?: RefObject<InputRef | undefined>;
};

export default function InputSearch({
  className,
  defaultValue = '',
  onChange,
  onClick,
  onKeyUp,
  onCloseClick,
  onSearchClick,
  ref,
}: Props) {
  const [value, setValue] = useState<string>(defaultValue);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    onChange?.(value);
  }, [value, onChange]);

  const handleSearch = () => {
    if (value.trim()) {
      onSearchClick?.();
    }
  };

  const handleClear = () => {
    setValue('');
    onCloseClick?.();
  };

  return (
    <Input
      className={twMerge(
        'h-[40px] text-black rounded-[20px] border-0 p-[5px_10px] focus-visible:outline-none focus-visible:border-0 w-full',
        className,
      )}
      ref={ref as RefObject<InputRef>}
      type="text"
      placeholder="Tìm kiếm sản phẩm"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      prefix={
        <Button
          type="link"
          className="p-0 hover:bg-transparent"
          onClick={handleSearch}
        >
          <SearchOutlined className="w-6 h-6" />
        </Button>
      }
      onKeyUp={onKeyUp}
      suffix={
        value && (
          <Button
            icon={<CloseCircle className="w-6 h-6" />}
            type="link"
            onClick={handleClear}
          />
        )
      }
      onClick={onClick}
    />
  );
}
