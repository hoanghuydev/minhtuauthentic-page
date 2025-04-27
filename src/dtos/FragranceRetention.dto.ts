import { BaseDto } from '@/dtos/Base.dto';
import { IProductFragranceRetentionDto } from '@/dtos/IProductFragranceRetention.dto';

export class FragranceRetentionDto extends BaseDto {
  name?: string;
  products?: IProductFragranceRetentionDto[];
}
