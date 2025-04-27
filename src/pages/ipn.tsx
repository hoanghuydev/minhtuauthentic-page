import { hashVNPAY } from '@/utils/vnpay';
import { OrdersDto } from '@/dtos/Orders.dto';
import { ORDER_STATUS } from '@/config/enum';

export const getServerSideProps = async ({ res, query }: any) => {
  const vnp_Params = query as Record<string, string>;
  const secureHash = vnp_Params['vnp_SecureHash'];
  if (vnp_Params?.vnp_SecureHashType) {
    delete vnp_Params['vnp_SecureHashType'];
  }
  if (vnp_Params?.vnp_SecureHash) {
    delete vnp_Params['vnp_SecureHash'];
  }
  const signed = hashVNPAY(vnp_Params);
  res.setHeader('Content-Type', 'application/json');
  const rs = await fetch(
    process.env.BE_URL + `/api/pages/order/getById/${vnp_Params['vnp_TxnRef']}`,
  ).then((res) => res.json());
  const order: OrdersDto | undefined = rs?.data;
  if (secureHash === signed) {
    if (
      vnp_Params['vnp_ResponseCode'] === '00' ||
      vnp_Params['vnp_ResponseCode'] === '99'
    ) {
      if (!order?.id) {
        res.write(
          JSON.stringify({ RspCode: '01', Message: 'Order not found' }),
        );
      } else if (Number(vnp_Params['vnp_Amount']) % 1000 !== 0) {
        res.write(JSON.stringify({ RspCode: '04', Message: 'Invalid amount' }));
      } else if (
        vnp_Params['vnp_ResponseCode'] === '00' &&
        order.status === ORDER_STATUS.DONE
      ) {
        res.write(
          JSON.stringify({ RspCode: '02', Message: 'Order already confirmed' }),
        );
      } else {
        await fetch(
          `${process.env.BE_URL}/api/orders/${vnp_Params['vnp_TxnRef']}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: vnp_Params['vnp_TxnRef'],
              status: ORDER_STATUS.DONE,
            }),
          },
        )
          .then((res) => res.json())
          .then((res) => {
            return res;
          })
          .catch((err) => {
            return null;
          });
        res.write(JSON.stringify({ RspCode: '00', Message: 'success' }));
      }
    } else {
      res.write(JSON.stringify({ RspCode: '98', Message: 'Fail' }));
    }
  } else {
    res.write(JSON.stringify({ RspCode: '97', Message: 'Fail checksum' }));
  }

  res.end();
  return {
    props: {},
  };
};
export default function Ipn() {
  return <></>;
}
