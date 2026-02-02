export default class CommonSettingDto {
  primaryColor?: string;
  eventButtonTitle?: string;

  constructor(init?: Partial<CommonSettingDto>) {
    Object.assign(this, init);
  }
}
