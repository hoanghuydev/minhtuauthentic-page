import { BaseDto } from '@/dtos/Base.dto';
import { SettingOptionDto } from '@/dtos/SettingOption.dto';

export class SettingsDto extends BaseDto {
  key?: string;
  value?: SettingOptionDto;
  type?: string;
}
