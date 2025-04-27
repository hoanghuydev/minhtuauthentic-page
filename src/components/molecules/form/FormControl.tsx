import { Checkbox, Input, Select, Switch } from 'antd/es';
import { Controller } from 'react-hook-form';
import { ReactNode } from 'react';
import RadioForm from '@/components/atoms/forms/radioForm';
import { removeVietnameseAccents } from '@/utils';
import { CollapseForm } from '@/components/atoms/forms/collapseForm';
import { PaymentsDto } from '@/dtos/Payments.dto';
import SelectField from '@/components/atoms/selectField';
const { TextArea } = Input;
type Props = {
  control: any;
  errors: any;
  name: string;
  type: string;
  placeholder?: string;
  className?: string;
  prefix?: ReactNode;
  field?: any;
  selectOptions?: {
    label: string | ReactNode;
    value: string;
    code_name?: string;
  }[];
  radioOptions?: { label: string | ReactNode; value: string }[];
  options?: PaymentsDto[];
};
type RenderFieldProps = Omit<Props, 'control' | 'errors' | 'name'> & {
  onChange: (value: string) => void;
};
const RenderField = ({
  type,
  field,
  prefix,
  placeholder,
  onChange,
  selectOptions,
  radioOptions,
  options,
}: RenderFieldProps) => {
  switch (type) {
    case 'password':
      return (
        <Input
          type={'password'}
          placeholder={placeholder}
          {...field}
          prefix={prefix}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    case 'collapse':
      return (
        <CollapseForm
          options={options || []}
          value={field.value}
          onChange={(value) => onChange(value)}
        />
      );
    case 'checkbox':
      return <Checkbox {...field} />;
    case 'switch':
      return (
        <div className={'flex gap-1'}>
          <span>{placeholder}</span>
          <Switch {...field} title={placeholder} />
        </div>
      );
    case 'radio':
      return (
        <RadioForm
          radioOptions={radioOptions || []}
          value={field.value}
          onChange={(value) => onChange(value)}
        />
      );
    case 'select':
      return (
        <SelectField
          selectOptions={selectOptions || []}
          placeholder={placeholder || ''}
          onChange={onChange}
          value={field.value}
        />
      );
    case 'textarea':
      return (
        <TextArea
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          style={{ height: 100 }}
          value={field.value}
        />
      );
    default:
      return (
        <Input
          placeholder={placeholder}
          value={field.value}
          prefix={prefix}
          onChange={(e) => onChange(e.target.value)}
        />
      );
  }
};
export default function FormControl({
  control,
  errors,
  name,
  type,
  placeholder,
  prefix,
  className,
  selectOptions,
  radioOptions,
  options,
}: Props) {
  return (
    <div className={className}>
      <Controller
        name={name}
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <RenderField
            prefix={prefix}
            placeholder={placeholder}
            type={type}
            selectOptions={selectOptions}
            radioOptions={radioOptions}
            field={field}
            options={options}
            onChange={(value: string) => {
              field.onChange(value);
            }}
          />
        )}
      />
      {errors && errors[name] && errors[name]?.message && (
        <p className={'ml-2 text-red-400 text-sm'}>{errors[name]?.message}</p>
      )}
    </div>
  );
}
