export default class CommonSettingDto {
  primaryColor?: string;
  eventButtonTitle?: string;
  swiperSpeed?: number;
  freeShippingMinOrderPrice?: number;

  constructor(init?: Partial<CommonSettingDto>) {
    Object.assign(this, init);
  }
}
