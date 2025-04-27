import { Radio, RadioChangeEvent } from 'antd/es';
import { ChangeEvent, ReactNode, useEffect, useState } from 'react';

type Props = {
  value: string;
  onChange: (value: string) => void;
  radioOptions: { label: ReactNode; value: string }[];
};
export default function RadioForm({ value, onChange, radioOptions }: Props) {
  const [_val, setVal] = useState(value);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) {
      onChange(_val);
    }
  }, [_val]);
  const handleChange = (e: RadioChangeEvent) => {
    setVal(e.target.value);
  };

  return (
    <Radio.Group
      onChange={handleChange}
      value={_val.toString()}
      className={'flex flex-col gap-3'}
    >
      {radioOptions.map((option) => (
        <Radio
          className={'border border-gray-200 p-3 radio-custom'}
          key={option.value}
          value={option.value}
        >
          {option.label}
        </Radio>
      ))}
    </Radio.Group>
  );
}
