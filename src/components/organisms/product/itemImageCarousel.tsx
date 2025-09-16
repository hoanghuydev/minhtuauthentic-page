import ImageWithFallback from "@/components/atoms/images/ImageWithFallback"
import { useProductImageDetail } from "@/contexts/productDetailCarousel";
import { ImageDto } from "@/dtos/Image.dto";
import { ProductDto } from "@/dtos/Product.dto";
import { useIsMobile } from "@/hooks/useDevice";
import { useEffect, useMemo, useState } from "react";

type Props = {
  image: ImageDto,
  clickAction?: () => void,
  product: ProductDto
}

export default function ItemImageCarousel ({ image, clickAction, product }: Props) {
  const { imageActive, setImageActive } = useProductImageDetail();
  const isMobile = useIsMobile();
  const active = imageActive?.id === image.id;

  const handleClickImage = (image: ImageDto) => {
    if (image) {
      setImageActive(image);
      clickAction && clickAction();
    }
  };  
  return (
    <div className={`${active ? 'border-primary' : 'border-transparent'} p-1 lg:hover:shadow-md transition-shadow duration-300 select-none lg:hover:border-primary border`}>
      <ImageWithFallback
        image={image}
        className={
          'w-full h-full object-contain hover:scale-105 select-none cursor-pointer border-[3px] border-[#e4e4e4]'
        }
        sizes="120px"
        onClick={() => handleClickImage(image)}
        product={product}
        onMouseEnter={() => {
          if (!isMobile) {
            handleClickImage(image)
          }
        }}
        unoptimized={false}
      />
    </div>
  )
}
