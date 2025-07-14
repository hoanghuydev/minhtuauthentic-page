import { StaticComponentDto } from '@/dtos/StaticComponent.dto';
import { BrandDto } from '@/dtos/Brand.dto';
import { ProductFilterOptionDto } from '@/dtos/ProductFilterSettingOption/ProductFilterOption.dto';
import { CategoryNewsDto } from '@/dtos/CategoryNews.dto';
import { NewsDto } from '@/dtos/News.dto';
export class ResponseMenuDto {
  homeMenuCategory?: StaticComponentDto[];
  brands?: BrandDto[];
  newsData?: {
    news: NewsDto[];
    categoryNews: CategoryNewsDto[];
  };
  filterSetting?: ProductFilterOptionDto;
  constructor(init?: Partial<ResponseMenuDto>) {
    Object.assign(this, init);
  }
}
