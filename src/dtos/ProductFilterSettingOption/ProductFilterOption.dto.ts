import { ProductFilterPriceRangeDto } from '@/dtos/ProductFilterSettingOption/ProductFilterPriceRange.dto';
import { ConcentrationGradientDto } from '@/dtos/ConcentrationGradient.dto';
import { FragranceRetentionDto } from '@/dtos/FragranceRetention.dto';
import { ProductConfigurationsDto } from '@/dtos/productConfigurations.dto';
import { ProductConfigurationValuesDto } from '@/dtos/productConfigurationValues.dto';
import { BrandDto } from '@/dtos/Brand.dto';
import { CategoryDto } from '@/dtos/Category.dto';

export class ProductFilterOptionDto {
  categories?: CategoryDto[];
  // brands?: BrandDto[];
  concentration_gradients?: ConcentrationGradientDto[];
  fragrance_retention?: FragranceRetentionDto[];
  product_configurations?: {
    configuration: ProductConfigurationsDto;
    values: ProductConfigurationValuesDto[];
  }[];
  sex?: number[];
  price_range?: ProductFilterPriceRangeDto[];
}
