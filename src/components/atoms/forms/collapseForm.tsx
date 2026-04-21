import { Collapse } from 'antd';
import ImageWithFallback from '@/components/atoms/images/ImageWithFallback';
import { useEffect, useState } from 'react';
import { OptionProps } from '@/config/type';
import { Radio } from 'antd/es';
import { PaymentsDto } from '@/dtos/Payments.dto';

type Props = {
  options: PaymentsDto[];
  value: string;
  onChange: (value: string) => void;
};
export function CollapseForm({ value, options, onChange }: Props) {
  const [currentValue, setCurrentValue] = useState<string>(
    options[0]?.id?.toString() || '',
  );
  useEffect(() => {
    onChange && onChange(currentValue);
  }, [currentValue]);
  return (
    <Collapse
      accordion
      onChange={(key: string[]) => {
        setCurrentValue(key[0] || options[0]?.id?.toString() || '');
      }}
      defaultActiveKey={options[0]?.id?.toString() || ''}
    >
      {options.map((item: PaymentsDto, index: number) => {
        return (
          <Collapse.Panel
            showArrow={false}
            header={
              <div className={'flex items-center gap-2'}>
                <Radio checked={currentValue === item?.id?.toString()} />
                <span className={'text-xl font-semibold'}>{item.label}</span>
              </div>
            }
            key={item.id?.toString() || ''}
            className={'border-b border-gray-500'}
          >
            <div className={'flex'}>
              {item.description && (
                <div
                  className={'text-sm container-html'}
                  dangerouslySetInnerHTML={{ __html: item.description }}
                />
              )}
              <ImageWithFallback
                image={item?.images?.[0]?.image}
                alt={item?.name}
                className={'w-[60px] h-[60px] shrink-0'}
              />
            </div>
          </Collapse.Panel>
        );
      })}
    </Collapse>
  );
}
