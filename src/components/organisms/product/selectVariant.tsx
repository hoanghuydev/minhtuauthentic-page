import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { ProductDto } from '@/dtos/Product.dto';
import { VariantDto } from '@/dtos/Variant.dto';

type SelectOption = {
  label: string;
  value: number;
};

type Props = {
  product: ProductDto;
  onChange: (variant_id: VariantDto) => void;
  defaultVariant?: VariantDto;
};

export default function SelectVariant({
  product,
  onChange,
  defaultVariant,
}: Props) {
  const [isFetch, setIsFetch] = useState(false);
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [listVariant, setListVariant] = useState<VariantDto[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<number>(
    defaultVariant?.id || 0,
  );

  const loadOptions = () => {
    fetch('/api/product/variants/' + product.id)
      .then((res) => res.json())
      .then((res: { statusCode: number; data: VariantDto[] }) => {
        const listOptions: SelectOption[] = [];
        const { data } = res;
        data.map((item) => {
          const prefixLabel =
            item?.variant_product_configuration_values?.[0]
              ?.product_configuration_value?.product_configuration?.name;
          const suffixLabel =
            item?.variant_product_configuration_values?.[0]
              ?.product_configuration_value?.value;
          const label = `${prefixLabel}: ${suffixLabel}`;
          listOptions.push({
            label,
            value: item.id || 0,
          });
        });
        setListVariant(data);
        setOptions(listOptions);
        setIsFetch(true);
      });
  };

  // Cập nhật selectedVariant khi defaultVariant thay đổi
  useEffect(() => {
    if (defaultVariant && defaultVariant.id !== selectedVariant) {
      setSelectedVariant(defaultVariant.id || 0);
    }
  }, [defaultVariant]);

  // Tự động tải options khi component mount
  useEffect(() => {
    if (!isFetch) {
      loadOptions();
    }
  }, []);

  return (
    <div className={'px-1 lg:px-2'}>
      <select
        className={'p-2 rounded border w-full'}
        value={selectedVariant}
        onChange={(e: ChangeEvent<HTMLSelectElement>) => {
          const value = parseInt(e.target.value);
          setSelectedVariant(value);
          if (value !== 0) {
            const variant: VariantDto | undefined = listVariant.find(
              (item) => item.id === value,
            );
            variant && onChange(variant);
          }
        }}
        onClick={() => {
          if (!isFetch) {
            setOptions([
              {
                label: 'Loading...',
                value: 0,
              },
            ]);
            setTimeout(() => {
              loadOptions();
            }, 100);
          }
        }}
      >
        <option value="0">Mời chọn size</option>
        {options.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </div>
  );
}
