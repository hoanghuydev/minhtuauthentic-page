import { BaseDto } from '@/dtos/Base.dto';
import { ProductConfigurationsDto } from '@/dtos/productConfigurations.dto';
import { IVariantProductConfigurationValuesDto } from '@/dtos/iVariantProductConfigurationValues.dto';

export class ProductConfigurationValuesDto extends BaseDto {
  product_configuration_id?: number;
  value?: string;
  product_configuration?: ProductConfigurationsDto;
  variant_product_configuration_values?: IVariantProductConfigurationValuesDto[]
  constructor(init?: Partial<ProductConfigurationValuesDto>) {
      super();
      Object.assign(this, init);
  }
}
