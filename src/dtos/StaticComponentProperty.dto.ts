import { TagLinkDto } from '@/dtos/tagLink.dto';

export class StaticComponentPropertyDto {
  theme?: string;
  textColor?: string;
  backgroundColor?: string;
  borderColor?: string;
  backgroundImage?: number;
  slug?: string;
  slug_mobile?: string;
  tagLink?: TagLinkDto[];
  position_index?: number;
}
