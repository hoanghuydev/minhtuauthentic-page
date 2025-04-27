import { BaseDto } from '@/dtos/Base.dto';
import { ImageDetailDto } from '@/dtos/ImageDetail.dto';

export class ImageDto extends BaseDto {
  url?: string;

  thumbnail_url?: string;

  name?: string;

  storage?: string;

  path?: string;

  size?: number;

  file_type?: string;

  width?: number;

  height?: number;

  alt?: string;

  type?: string;

  original_name?: string;

  file?: File;

  models?: ImageDetailDto[];
}
