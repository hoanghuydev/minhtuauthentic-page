import { StaticComponentDto } from '@/dtos/StaticComponent.dto';
import { BrandDto } from '@/dtos/Brand.dto';
import { ProductFilterOptionDto } from '@/dtos/ProductFilterSettingOption/ProductFilterOption.dto';
export class ResponseMenuDto {
  homeMenuCategory?: StaticComponentDto[];
  brands?: BrandDto[];
  filterSetting?: ProductFilterOptionDto;
  constructor(init?: Partial<ResponseMenuDto>) {
    Object.assign(this, init);
  }
}
