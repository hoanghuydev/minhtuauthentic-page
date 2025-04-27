export default class ResponseSendTransactionDto {
  code?: number;
  message?: string[];
  count?: number;
  data?: {
    order_id?: string;
    redirect_url?: string;
    payment_url?: string;

  };

}
