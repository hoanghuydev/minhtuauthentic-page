import { useEffect, useState } from 'react';
import { Rate } from 'antd/es';
const desc = ['Kinh khủng', 'tệ', 'Bình thường', 'Tốt', 'Xuất sắc'];

type Props = {
  value?: number;
  onChange?: (value: number) => void;
  size?: number; // Optional: allow custom size via props
};

export default function StartRatingInput({
  value,
  onChange,
  size = 28,
}: Props) {
  // Default star size is 28px, can be overridden via props
  const [_value, setValue] = useState(value || 5);

  useEffect(() => {
    onChange && onChange(_value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_value]);

  return (
    <span
      style={{
        fontSize: size,
        display: 'inline-flex',
        alignItems: 'center',
        lineHeight: 1,
      }}
    >
      <Rate
        tooltips={desc}
        onChange={(value: number) => setValue(value)}
        value={_value}
        style={{ fontSize: size }}
      />
    </span>
  );
}
