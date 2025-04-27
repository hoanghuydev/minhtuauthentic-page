export default class ItemFudiinDto {
  productId?: string;
  productName?: string;
  category?: string;
  currency?: string;
  quantity?: number;
  price?: number;
  totalAmount?: number;

  constructor(init?: Partial<ItemFudiinDto>) {
    Object.assign(this, init);
  }
}
