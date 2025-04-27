import { BaseDto } from '@/dtos/Base.dto';
import { VariantDto } from '@/dtos/Variant.dto';
import { ProductConfigurationValuesDto } from '@/dtos/productConfigurationValues.dto';

export class IVariantProductConfigurationValuesDto extends BaseDto {
  product_configuration_value_id?: number;
  variant_id?: number;
  variant?: VariantDto;
  product_configuration_value?: ProductConfigurationValuesDto;
  constructor(init?: Partial<IVariantProductConfigurationValuesDto>) {
    super();
    Object.assign(this, init);
  }
}
