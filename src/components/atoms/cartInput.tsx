import { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { PlusIcon } from '@/components/icons/plus';
import { MinusIcon } from '@/components/icons/minus';

type Props = {
  value: number;
  onChange: (value: number) => void;
  className?: string;
  disabled?: boolean;
};
export default function CartInput({ value, onChange, className, disabled }: Props) {
  const [_value, setValue] = useState(value || 1);
  const [ready, setReady] = useState(false);
  const [debounce, setDebounce] = useState<number>(1);
  useEffect(() => {
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    const timeout = setTimeout(() => {
      setDebounce(_value);
    }, 350);
    return () => {
      clearTimeout(timeout);
    };
  }, [_value]);

  useEffect(() => {
    onChange && onChange(debounce < 1 ? 1 : debounce);
  }, [debounce]);

  return (
    <div
      className={twMerge(
        'flex items-center gap-2 justify-center border rounded-[10px] border-primary',
        disabled && 'opacity-50 border-gray-400',
        className,
      )}
    >
      <button
        className={twMerge(
          "text-[16px] font-extrabold block text-primary",
          disabled && "text-gray-400 cursor-not-allowed"
        )}
        disabled={disabled}
        onClick={() => {
          if (!disabled) {
            setValue((_value) => (_value - 1 < 0 ? 0 : _value - 1));
          }
        }}
      >
        <MinusIcon className={twMerge('w-6 h-6 text-primary', disabled && 'text-gray-400')} />
      </button>
      <input
        type="text"
        className={twMerge(
          "text-[16px] font-semibold w-[35px] text-black text-center bk-product-qty",
          disabled && "text-gray-400 cursor-not-allowed"
        )}
        value={_value}
        disabled={disabled}
        onChange={(e) => {
          if (!disabled) {
            setValue(parseInt(e.target.value) || 1);
          }
        }}
      />
      <button
        className={twMerge(
          "text-[16px] font-extrabold block text-primary",
          disabled && "text-gray-400 cursor-not-allowed"
        )}
        disabled={disabled}
        onClick={() => {
          if (!disabled) {
            setValue((_value) => _value + 1);
          }
        }}
      >
        <PlusIcon className={twMerge('w-6 h-6 text-primary', disabled && 'text-gray-400')} />
      </button>
    </div>
  );
}
