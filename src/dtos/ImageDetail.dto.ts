import { BaseDto } from '@/dtos/Base.dto';
import { ImageDto } from '@/dtos/Image.dto';

export class ImageDetailDto extends BaseDto {
  model?: string;
  model_id?: number;
  image_id?: number;
  alt?: string;
  image?: ImageDto;
}
