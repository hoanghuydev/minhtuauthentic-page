import { OrdersDto } from '@/dtos/Orders.dto';
import { twMerge } from 'tailwind-merge';

type Props = {
  orders: OrdersDto[];
  column: any[];
};
export default function HistoryMobileView({ orders, column }: Props) {
  return (
    <>
      {(orders || []).map((item, index) => {
        return (
          <table className={'mb-3 w-full'} key={index}>
            <tbody>
              {column.map((col, i) => {
                return (
                  <tr key={'table-' + i}>
                    <td className={twMerge('border', i === 0 && 'font-bold')}>{col.title}</td>
                    <td className={twMerge('border w-[70%]', i === 0 && 'font-bold')}>
                      {col.render(null, item)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        );
      })}
    </>
  );
}
