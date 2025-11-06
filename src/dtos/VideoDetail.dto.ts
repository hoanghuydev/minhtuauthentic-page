import { BaseDto } from '@/dtos/Base.dto';
import { VideoDto } from '@/dtos/Video.dto';

export class VideoDetailDto extends BaseDto {
  model?: string;
  model_id?: number;
  type?: string;
  alt?: string;
  video_id?: number;
  video?: VideoDto;
}
