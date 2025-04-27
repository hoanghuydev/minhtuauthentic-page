import { BaseDto } from '@/dtos/Base.dto';
import { ImageDetailDto } from '@/dtos/ImageDetail.dto';
import { StaticComponentPropertyDto } from '@/dtos/StaticContentProperty.dto';
import { SlugDto } from '@/dtos/Slug.dto';

export class StaticContentsDto extends BaseDto {
  type?: string;
  title?: string;
  content?: string;
  description?: string;
  images?: ImageDetailDto[];
  properties?: StaticComponentPropertyDto;

}
