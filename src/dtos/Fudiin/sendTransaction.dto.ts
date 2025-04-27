import CustomerDto from '@/dtos/Fudiin/customer.dto';
import ItemFudiinDto from '@/dtos/Fudiin/item.dto';
import ShippingFudiinDto from '@/dtos/Fudiin/shipping.dto';

export default class SendTransactionFudiinDto {
  merchantId?: string;
  referenceId?: string;
  storeId?: string;
  requestType?: string;
  paymentMethod?: string;
  description?: string;
  successRedirectUrl?: string;
  unSuccessRedirectUrl?: string;
  amount?: {
    currency?: string;
    value?: number;
  };
  items?: ItemFudiinDto[];
  customer?: CustomerDto;
  shipping?: ShippingFudiinDto;

  constructor(init?: Partial<SendTransactionFudiinDto>) {
    Object.assign(this, init);
  }
}
