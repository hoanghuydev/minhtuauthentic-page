import { BaseDto } from '@/dtos/Base.dto';
import { ProductDto } from '@/dtos/Product.dto';
import { FragranceRetentionDto } from '@/dtos/FragranceRetention.dto';

export class IProductFragranceRetentionDto extends BaseDto {
  product_id?: number;
  fragrance_retention_id?: number;
  product?: ProductDto;
  fragrance_retentions?: FragranceRetentionDto;
}
