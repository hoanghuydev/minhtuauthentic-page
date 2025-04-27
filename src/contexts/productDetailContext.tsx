import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useState,
} from 'react';
import { VariantDto } from '@/dtos/Variant.dto';

export type TypeAppState = {
  variantActive: VariantDto | undefined;
  setVariantActive: Dispatch<SetStateAction<VariantDto | undefined>>;
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
  return (
    <ProductDetailContext.Provider
      value={{
        variantActive,
        setVariantActive,
      }}
    >
      {children}
    </ProductDetailContext.Provider>
  );
};

export default ProductDetailContext;
