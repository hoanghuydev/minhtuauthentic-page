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
  label?: string;
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
  const inputClassName =
    'w-full h-full bg-transparent border-none outline-none shadow-none ring-0 focus:outline-none focus:border-none focus:ring-0 focus-visible:outline-none focus-visible:border-none focus-visible:ring-0 placeholder:text-gray-300 placeholder:select-none disabled:opacity-80 disabled:cursor-not-allowed disabled:text-gray-500 disabled:placeholder:text-gray-400 overflow-hidden text-ellipsis whitespace-nowrap';

  switch (type) {
    case 'password':
      return (
        <div className="p-2 flex items-center gap-2 min-w-0 border transition-colors border-gray-300 focus-within:border-gray-600 text-base min-h-[40px] rounded-md pl-4">
          <input
            type="password"
            placeholder={placeholder}
            value={field.value}
            onChange={(e) => onChange(e.target.value)}
            className={inputClassName}
          />
          {prefix}
        </div>
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
        <div className="p-2 flex items-center gap-2 min-w-0 border transition-colors border-gray-300 focus-within:border-gray-600 text-base min-h-[100px] rounded-md pl-4">
          <textarea
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            value={field.value}
            className={inputClassName + ' resize-none'}
            style={{ height: 100 }}
          />
        </div>
      );
    default:
      return (
        <div className="p-2 flex items-center gap-2 min-w-0 border transition-colors border-gray-300 focus-within:border-gray-600 text-base min-h-[40px] rounded-md pl-4">
          <input
            type="text"
            placeholder={placeholder}
            value={field.value}
            onChange={(e) => onChange(e.target.value)}
            className={inputClassName}
          />
          {prefix}
        </div>
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
  label,
  selectOptions,
  radioOptions,
  options,
}: Props) {
  return (
    <div className={`flex gap-2 group flex-col ${className || ''}`}>
      {label && (
        <label className="flex items-center gap-2 font-medium select-none text-base">
          {label}
        </label>
      )}
      <div className="flex flex-col gap-2">
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
          <span className="text-red-500 text-sm">{errors[name]?.message}</span>
        )}
      </div>
    </div>
  );
}
