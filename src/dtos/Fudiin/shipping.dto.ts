export default class ShippingFudiinDto {
  city?: string;
  district?: string;
  ward?: string;
  street?: string;
  houseNumber?: string;
  country?: string;

  constructor(init?: Partial<ShippingFudiinDto>) {
    Object.assign(this, init);
  }
}
