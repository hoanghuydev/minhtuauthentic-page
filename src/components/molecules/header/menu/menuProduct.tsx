import React, { useContext } from 'react';
import Link from 'next/link';
import { ProductDto } from '@/dtos/Product.dto';
import ProductSmallCard from '@/components/molecules/product/productSmallCard';
import AppContext from '@/contexts/appContext';

interface MenuProductProps {
  isLoadingProducts: boolean;
}

const MenuProduct = ({ isLoadingProducts }: MenuProductProps) => {
  const appCtx = useContext(AppContext);
  const products = appCtx?.menuProduct || [];
  console.log('products', products);
  return (
    <div className="flex flex-col">
      <h3 className="text-lg font-medium mb-4">Sản phẩm</h3>
      {isLoadingProducts ? (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-3">
            {products.map((product) => (
              <ProductSmallCard
                key={product.id}
                product={product}
                className="w-full"
              />
            ))}
          </div>
          <div className="mt-4 text-center">
            <Link
              href="/san-pham"
              className="inline-block px-4 py-2 text-sm font-medium text-primary hover:text-primary-dark"
            >
              Xem tất cả
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default MenuProduct;
