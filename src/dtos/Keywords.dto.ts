import KeywordDetailDto from '@/dtos/KeywordDetail.dto';
import { SlugDto } from '@/dtos/Slug.dto';
import { SeoDto } from '@/dtos/Seo.dto';

export default class KeywordsDto {
  id?: number;
  value?: string;
  type?: string;
  keyword_detail?: KeywordDetailDto[];
  slugs?: SlugDto;
  seo?: SeoDto;
}
