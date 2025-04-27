import { OrdersDto } from '@/dtos/Orders.dto';
import crypto from 'crypto';
import dayjs from 'dayjs';
import querystring from 'qs';

function sortObject(obj: Record<string, string>) {
  let sorted: Record<string, string> = {};
  let str: string[] = [];
  Object.keys(obj).forEach((key) => {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  });
  str.sort();
  for (let key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
  }
  return sorted;
}

export function hashVNPAY(data: Record<string, string>): string {
  const hmac = crypto.createHmac(
    'sha512',
    process.env.NEXT_PUBLIC_VNPAY_SECRECT_KEY || '',
  );
  const signData = querystring.stringify(sortObject(data), { encode: false });
  const signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');
  return signed;
}

export function createVNPayUrl({
  order,
  ip,
}: {
  order: OrdersDto;
  ip: string;
}) {
  let vnpUrl = process.env.NEXT_PUBLIC_VNPAY_URL;
  let signDataObject: Record<string, string> = {};
  const params = new URLSearchParams();
  params.append('vnp_Amount', ((order.total_price || 0) * 100).toString());
  params.append('vnp_Command', 'pay');
  params.append('vnp_CreateDate', dayjs().format('YYYYMMDDHHmmss'));
  params.append('vnp_CurrCode', 'VND');
  params.append('vnp_IpAddr', ip);
  params.append('vnp_Locale', 'vn');
  params.append(
    'vnp_OrderInfo',
    `Thanh toan don hang cua user ${order.user_id} voi gia tri ${order.total_price}`,
  );
  params.append('vnp_OrderType', 'other');
  params.append(
    'vnp_ReturnUrl',
    process.env.NEXT_PUBLIC_RETURN_URL_VNPAY || '',
  );
  params.append('vnp_TmnCode', process.env.NEXT_PUBLIC_VNPAY_CODE || '');
  params.append('vnp_TxnRef', (order?.id || Math.random()).toString());
  params.append('vnp_Version', '2.1.0');

  params.forEach((value, key) => {
    signDataObject[key] = value;
  });
  const signed = hashVNPAY(signDataObject);
  params.append('vnp_SecureHash', signed);
  vnpUrl += '?' + params.toString();
  return vnpUrl;
}
