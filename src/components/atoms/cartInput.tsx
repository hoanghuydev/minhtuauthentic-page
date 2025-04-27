import { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { PlusIcon } from '@/components/icons/plus';
import { MinusIcon } from '@/components/icons/minus';

type Props = {
  value: number;
  onChange: (value: number) => void;
  className?: string;
};
export default function CartInput({ value, onChange, className }: Props) {
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
        className,
      )}
    >
      <button
        className="text-[16px] font-extrabold block text-primary"
        onClick={() => {
          setValue((_value) => (_value - 1 < 0 ? 0 : _value - 1));
        }}
      >
        <MinusIcon className={'w-6 h-6 text-primary'} />
      </button>
      <input
        type="text"
        className="text-[16px] font-semibold w-[35px] text-black text-center bk-product-qty"
        value={_value}
        onChange={(e) => {
          setValue(parseInt(e.target.value) || 1);
        }}
      />
      <button
        className="text-[16px] font-extrabold block text-primary"
        onClick={() => {
          setValue((_value) => _value + 1);
        }}
      >
        <PlusIcon className={'w-6 h-6 text-primary'} />
      </button>
    </div>
  );
}
