export class ProductFilterPriceRangeDto {
  max?: number;
  min?: number;
  label?: string;
  id?: string;
  constructor(init?: Partial<ProductFilterPriceRangeDto>) {
    Object.assign(this, init);
  }
}