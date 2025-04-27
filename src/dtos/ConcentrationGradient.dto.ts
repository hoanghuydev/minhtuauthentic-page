import { BaseDto } from '@/dtos/Base.dto';
import { IProductConcentrationGradientDto } from '@/dtos/IProductConcentrationGradient.dto';

export class ConcentrationGradientDto extends BaseDto {
  name?: string;
  products?: IProductConcentrationGradientDto[];
}
