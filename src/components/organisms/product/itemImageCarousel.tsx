import ImageWithFallback from "@/components/atoms/images/ImageWithFallback"
import { useProductImageDetail } from "@/contexts/productDetailCarousel";
import { ImageDto } from "@/dtos/Image.dto";
import { ProductDto } from "@/dtos/Product.dto";
import { useIsMobile } from "@/hooks/useDevice";
import { useEffect, useMemo, useState } from "react";
import MediaItem from "@/dtos/Media.dto";
import { VideoDetailDto } from "@/dtos/VideoDetail.dto";

type Props = {
  media: MediaItem,
  clickAction?: () => void,
  product: ProductDto
}

export default function ItemImageCarousel ({ media, clickAction, product }: Props) {
  const image = media.type === 'image' ? media.data as ImageDto : (media.data as VideoDetailDto).video! as ImageDto;
  const { mediaActive, setMediaActive } = useProductImageDetail();
  const isMobile = useIsMobile();
  const active = mediaActive?.id === media.id && mediaActive?.type === media.type;
  

  const handleClickImage = (media: MediaItem) => {
    if (media) {
      setMediaActive(media);
      clickAction && clickAction();
    }
  };  
  return (
    <div className={`${active ? 'border-primary' : 'border-transparent'} p-1 lg:hover:shadow-md transition-shadow duration-300 select-none lg:hover:border-primary border`}>
      <ImageWithFallback
        image={image}
        className={
          'w-full h-full hover:scale-105 select-none cursor-pointer aspect-square object-cover border-[3px] border-[#e4e4e4]'
        }
        sizes="120px"
        onClick={() => handleClickImage(media)}
        product={product}
        onMouseEnter={() => {
          if (!isMobile) {
            handleClickImage(media)
          }
        }}
        unoptimized={true}
      />
    </div>
  )
}
