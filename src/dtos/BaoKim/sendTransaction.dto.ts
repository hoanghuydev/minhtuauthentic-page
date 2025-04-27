import SendTransactionExtensionItemDto from '@/dtos/sendTransactionExtensionItem.dto';

export default class SendTransactionBaoKimDto {
  mrc_order_id?: string;
  total_amount?: number;
  description?: string;
  url_success?: string;
  merchant_id?: number;
  url_detail?: string;
  webhooks?: string;
  bpm_id?: number;
  customer_email?: string;
  customer_name?: string;
  customer_phone?: string;
  customer_address?: string;
  extension?: {
    items: SendTransactionExtensionItemDto[]
  };
  constructor(init?: Partial<SendTransactionBaoKimDto>) {
    Object.assign(this, init);
  }
}
