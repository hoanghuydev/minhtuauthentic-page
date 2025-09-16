import React, { createContext, useContext, useState, useEffect, JSX } from 'react';
import orderBy from 'lodash/orderBy';
import ProductDetailContext from './productDetailContext';
import { ImageDto } from '@/dtos/Image.dto';

const ProductImageDetailContext = createContext<{
  images: ImageDto[],
  imageActive?: ImageDto,
  setImageActive: (image: ImageDto) => void
}>({
  images: [],
  setImageActive: () => {}
});

export const ProductImageDetailProvider = ({ children }: { children: JSX.Element }) => {
  const productContext = useContext(ProductDetailContext);
  const [images, setImages] = useState<ImageDto[]>([]);
  const [imageActive, setImageActive] = useState<ImageDto>({});

  useEffect(() => {
    let activeVariant = productContext?.variantActive;
    const listImage = [] as ImageDto[];
    orderBy(activeVariant?.images || [], 'sort').forEach(item => {
      if (item?.image) listImage.push(item.image);
    });
    setImages(listImage);
    if (listImage[0]) {
      setImageActive(listImage[0]);
    }
  }, [productContext?.variantActive]);

  return (
    <ProductImageDetailContext.Provider value={{ images, imageActive, setImageActive }}>
      {children}
    </ProductImageDetailContext.Provider>
  );
};

export const useProductImageDetail = () => {
  const context = useContext(ProductImageDetailContext);
  if (!context) throw new Error('useProductImageDetail must be used within a ProductImageDetailProvider');
  return context;
};
