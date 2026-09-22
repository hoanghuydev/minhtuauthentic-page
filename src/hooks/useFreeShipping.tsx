import { useContext } from 'react';
import OrderContext from '@/contexts/orderContext';
import useSettings from '@/hooks/useSettings';

export default function useFreeShipping(): boolean {
  const { commonSettings } = useSettings();
  const order = useContext(OrderContext);
  const minOrderPrice = commonSettings?.freeShippingMinOrderPrice || 0;

  return (order?.cart?.total_price || 0) >= minOrderPrice;
}
