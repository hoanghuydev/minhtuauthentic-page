import { TagLinkDto } from '@/dtos/tagLink.dto';
import { BLOCK_UNDER_CATEGORY_POSITION } from '@/config/enum';

export class StaticComponentPropertyDto {
  textColor?: string;
  backgroundColor?: string;
  borderColor?: string;
  slug?: string;
  url?: string;
  tagLinks?: TagLinkDto[];
  position?: string;
  direction?: BLOCK_UNDER_CATEGORY_POSITION;
  position_index?: number;
}
