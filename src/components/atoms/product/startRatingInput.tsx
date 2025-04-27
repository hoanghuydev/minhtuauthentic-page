import { ReactNode, useEffect, useState } from 'react';
import { Rate } from 'antd/es';
const desc = ['Kinh khủng', 'tệ', 'Bình thường', 'Tốt', 'Xuất sắc'];
type Props = {
  value?: number;
  onChange?: (value: number) => void;
};
export default function StartRatingInput({ value, onChange }: Props) {
  const [_value, setValue] = useState(value || 5);
  useEffect(() => {
    onChange && onChange(_value);
  }, [_value]);
  return (
    <>
      <Rate
        tooltips={desc}
        onChange={(value: number) => {
          setValue(value);
        }}
        value={_value}
      />
    </>
  );
}
