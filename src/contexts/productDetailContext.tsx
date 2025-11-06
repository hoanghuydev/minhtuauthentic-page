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
  children,
}: {
  children: React.ReactNode;
}) => {
  const [variantActive, setVariantActive] = useState<VariantDto | undefined>(
    undefined,
  );
  const [product, setProduct] = useState<ProductDto | undefined>(undefined);
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
