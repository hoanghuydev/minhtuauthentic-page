export default class CustomerFudiinDto {
  phoneNumber?: string;
  email?: string;
  firstName?: string;
  lastName?: string;

  constructor(init?: Partial<CustomerFudiinDto>) {
    Object.assign(this, init);
  }
}
