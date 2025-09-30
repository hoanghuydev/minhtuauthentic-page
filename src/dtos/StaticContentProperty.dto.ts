import { TagLinkDto } from '@/dtos/tagLink.dto';
import { BLOCK_UNDER_CATEGORY_POSITION } from '@/config/enum';
import { VariantDto } from './Variant.dto';

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
  slug_mobile?: string;
  variants?: VariantDto[];
  duration?: number; // in seconds
}
