export default class CommonSettingDto {
  primaryColor?: string;

  constructor(init?: Partial<CommonSettingDto>) {
    Object.assign(this, init);
  }
}
