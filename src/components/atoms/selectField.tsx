import { removeVietnameseAccents } from '@/utils';
import { Select } from 'antd/es';
import { ReactNode, useEffect, useState } from 'react';

type Props = {
  selectOptions: {
    label: string | ReactNode;
    value: string;
    code_name?: string;
  }[];
  placeholder: string;
  onChange: (value: string) => void;
  value?: string;
};

export default function SelectField({
  selectOptions,
  placeholder,
  onChange,
  value,
}: Props) {
  const [_value, setValue] = useState<string | undefined>(
    !value ? undefined : value,
  );

  useEffect(() => {
    setValue(value);
  }, [value]);

  useEffect(() => {
    onChange && onChange(_value || '');
  }, [_value]);

  return (
    <Select
      className={'w-full'}
      options={selectOptions || []}
      onChange={(value) => setValue(value)}
      placeholder={placeholder}
      defaultValue={_value}
      showSearch
      filterOption={(input, option) => {
        return (
          removeVietnameseAccents(option?.label?.toString() || '')
            .toString()
            .toLowerCase()
            .search(removeVietnameseAccents(input).toLowerCase()) >= 0 ||
          (option?.code_name || '')
            ?.toString()
            .toLowerCase()
            .search(removeVietnameseAccents(input).toLowerCase()) >= 0
        );
      }}
    />
  );
}
