import { BaseDto } from '@/dtos/Base.dto';

export class UserDto extends BaseDto {
  email?: string;
  name?: string;
  phone?: string;
  email_approved_at?: Date;
  token?: string;
}
