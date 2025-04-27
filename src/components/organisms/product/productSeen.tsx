import { useEffect, useState } from 'react';
import { ProductDto } from '@/dtos/Product.dto';
import ProductList from '@/components/molecules/product/list';
import Button from 'antd/es/button';
type Props = {
  product: ProductDto;
};
export default function ProductSeen({ product }: Props) {
  const [products, setProducts] = useState<ProductDto[]>([]);
  useEffect(() => {
    if (localStorage) {
      const productSeen = JSON.parse(
        localStorage.getItem('product_seen') || '',
      );
      const productSeenData = productSeen.data;
      if (productSeenData.length > 0) {
        loadData(productSeenData).then((data: ProductDto[]) => {
          setProducts(data.filter((item) => item.id !== product.id));
        });
        localStorage.setItem(
          'product_seen',
          JSON.stringify({
            data: productSeenData,
            created: new Date().getTime(),
          }),
        );
      }
    }
  }, []);
  const loadData = (ids: number[]) => {
    let query = '';
    ids.forEach((id, index) => {
      query += `ids[${index}]=${id}&`;
    });
    return fetch(`/api/product/listWithId?${query}`, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((data) => {
        return data?.data || [];
      })
      .catch((error) => {
        return [];
      });
  };

  return (
    <>
      {products?.length > 0 && (
        <ProductList
          products={products}
          title="Sản phẩm đã xem"
          rightTitle={
            <Button
              type={'link'}
              onClick={() => {
                localStorage.setItem(
                  'product_seen',
                  JSON.stringify({ data: [], created: new Date().getTime() }),
                );
                setProducts([]);
              }}
            >
              Xóa tất cả
            </Button>
          }
        />
      )}
    </>
  );
}
