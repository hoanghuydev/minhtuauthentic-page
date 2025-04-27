import { BaseDto } from '@/dtos/Base.dto';
import { ProductDto } from '@/dtos/Product.dto';
import { ConcentrationGradientDto } from '@/dtos/ConcentrationGradient.dto';

export class IProductConcentrationGradientDto extends BaseDto {
  product_id?: number;
  concentration_gradient_id?: number;
  product?: ProductDto;
  category?: ConcentrationGradientDto;
}
