import { StaticContentsDto } from '@/dtos/StaticContents.dto';
import { StaticComponentDto } from '@/dtos/StaticComponent.dto';
import { BrandDto } from '@/dtos/Brand.dto';
import { NewsDto } from '@/dtos/News.dto';
import { SettingsDto } from '@/dtos/Settings.dto';
import { PromotionsDto } from '@/dtos/Promotions.dto';
import { SeoDto } from '@/dtos/Seo.dto';

export class ResponseHomePageDto {
  banners?: StaticContentsDto[];
  homeCategory?: StaticComponentDto[];
  homeBlockUnderSlide?: StaticContentsDto[];
  homeBlockFeaturedCategory?: StaticContentsDto[];
  homeBrand?: BrandDto[];
  homeSupport?: StaticComponentDto[];
  homeBlockFeaturedProductsCategory?: StaticContentsDto[];
  homeFlashSale?: PromotionsDto;
  homeNews?: {
    featured: NewsDto[];
    news: NewsDto[];
  };
  bannerUnderCategory?: StaticContentsDto[];
  bannerSquare?: StaticContentsDto[];
  homeBannerBrand?: StaticContentsDto[];
  headerMarquee?: StaticContentsDto[];
  settings?: SettingsDto[];
  seo?: SeoDto;

  constructor(init?: Partial<ResponseHomePageDto>) {
    Object.assign(this, init);
  }
}
