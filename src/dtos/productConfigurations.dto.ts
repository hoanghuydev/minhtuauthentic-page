import { BaseDto } from '@/dtos/Base.dto';
import { ProductConfigurationValuesDto } from '@/dtos/productConfigurationValues.dto';

export class ProductConfigurationsDto extends BaseDto {
  name?: string;
  product_configuration_values?: ProductConfigurationValuesDto[];
  constructor(init?: Partial<ProductConfigurationsDto>) {
    super();
    Object.assign(this, init);
  }
}
