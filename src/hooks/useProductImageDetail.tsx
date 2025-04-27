import { useContext, useEffect, useState } from 'react';
import { ImageDto } from '@/dtos/Image.dto';
import { ProductDto } from '@/dtos/Product.dto';
import { VariantDto } from '@/dtos/Variant.dto';
import orderBy from 'lodash/orderBy';
import ProductDetailContext from '@/contexts/productDetailContext';
type Props = {
  variant?: VariantDto;
};
export function useProductImageDetail({ variant }: Props) {
  const [images, setImages] = useState<ImageDto[]>([]);
  const [imageActive, setImageActive] = useState<ImageDto | null>(null);
  const productContext = useContext(ProductDetailContext);
  useEffect(() => {
    const listImage: ImageDto[] = [];
    if (!variant) {
      variant = productContext?.variantActive;
    }
    orderBy(variant?.images || [], 'sort')?.map((item) => {
      if (item?.image) {
        listImage.push(item.image);
      }
    });
    setImages(listImage);
    if (listImage[0]) {
      setImageActive(listImage[0]);
    }
  }, [productContext?.variantActive, variant]);
  return {
    images,
    imageActive,
    setImageActive,
  };
}
