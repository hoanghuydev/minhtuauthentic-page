import { BaseDto } from '@/dtos/Base.dto';
import { CategoryDto } from '@/dtos/Category.dto';
import { StaticComponentPropertyDto } from '@/dtos/StaticComponentProperty.dto';
import { SlugDto } from '@/dtos/Slug.dto';

export class StaticComponentDto extends BaseDto {
  title?: string;
  model?: string;
  model_id?: number;
  parent_id?: number;
  type?: string;
  category?: CategoryDto;
  properties?: StaticComponentPropertyDto;
  slugs?: SlugDto;
  description?: string;
}
