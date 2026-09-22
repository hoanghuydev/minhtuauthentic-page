import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useState,
} from 'react';
import { VariantDto } from '@/dtos/Variant.dto';
import { ProductDto } from '@/dtos/Product.dto';

export type TypeAppState = {
  variantActive: VariantDto | undefined;
  setVariantActive: Dispatch<SetStateAction<VariantDto | undefined>>;
  product: ProductDto | undefined;
  setProduct: Dispatch<SetStateAction<ProductDto | undefined>>;
};

const ProductDetailContext = createContext<TypeAppState | undefined>(undefined);

export const ProductDetailProvider = ({
  product: initialProduct,
  children,
}: {
  product?: ProductDto;
  children: React.ReactNode;
}) => {
  // Seeding from the server-rendered product keeps variantActive defined on the
  // very first render, so the product block (gallery included) is part of the
  // server HTML instead of appearing only after hydration.
  const [variantActive, setVariantActive] = useState<VariantDto | undefined>(
    () =>
      (initialProduct?.variants || []).find((item) => item.is_default) ||
      initialProduct?.variants?.[0],
  );
  const [product, setProduct] = useState<ProductDto | undefined>(
    initialProduct,
  );
  return (
    <ProductDetailContext.Provider
      value={{
        variantActive,
        setVariantActive,
        product,
        setProduct,
      }}
    >
      {children}
    </ProductDetailContext.Provider>
  );
};

export default ProductDetailContext;
