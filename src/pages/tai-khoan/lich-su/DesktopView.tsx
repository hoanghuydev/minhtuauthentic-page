import { OrdersDto } from '@/dtos/Orders.dto';
import { Table } from 'antd/es';

type Props = {
  orders: OrdersDto[];
  column: unknown[];
};
export default function HistoryDesktopView({ orders, column }: Props) {
  return (
    <>
      {(orders || []).map((item, index) => {
        return (
          <Table
            key={index}
            dataSource={orders}
            columns={column as any}
            pagination={false}
          />
        );
      })}
    </>
  );
}
