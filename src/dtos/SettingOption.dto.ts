import { ImageDto } from '@/dtos/Image.dto';
import { ImageDetailDto } from '@/dtos/ImageDetail.dto';

export class SettingOptionDto {
  backgroundColor?: string;
  content?: string;
  page_description?: string;
  page_title?: string;
  page_title_left?: string;
  page_title_right?: string;
  page_title_center?: string;
  page_keyword?: string;
  page_logo_header?: {
    image: ImageDto;
    sort: number;
  }[];
  page_logo_footer?: {
    image: ImageDto;
    sort: number;
  }[];
  isBannerFull?: boolean;
}
