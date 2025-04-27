export default class SendTransactionExtensionItemDto {
  item_id?: string;
  item_code?: string;
  item_name?: string;
  price_amount?: number;
  quantity?: number;
  url?: string;
  constructor(init?: Partial<SendTransactionExtensionItemDto>) {
    Object.assign(this, init);
  }
}
