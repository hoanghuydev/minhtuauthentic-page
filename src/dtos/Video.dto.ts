import { BaseDto } from '@/dtos/Base.dto';

export class VideoDto extends BaseDto {
  url?: string;
  name?: string;
  type?: string;
  title?: string;
  thumbnail_url?: string;
  duration?: number;
  path?: string;
  storage?: string;
  file_type?: string;
  original_name?: string;
}
