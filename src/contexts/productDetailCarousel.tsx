import React, { createContext, useContext, useState, useEffect, JSX } from 'react';
import orderBy from 'lodash/orderBy';
import ProductDetailContext from './productDetailContext';
import { ImageDto } from '@/dtos/Image.dto';
import { VideoDetailDto } from '@/dtos/VideoDetail.dto';
import MediaItem from '@/dtos/Media.dto';

const ProductImageDetailContext = createContext<{
  images: ImageDto[],
  videos: VideoDetailDto[],
  mediaItems: MediaItem[],
  mediaActive?: MediaItem,
  setMediaActive: (media: MediaItem) => void
}>({
  images: [],
  videos: [],
  mediaItems: [],
  setMediaActive: () => {}
});

export const ProductImageDetailProvider = ({ children }: { children: JSX.Element }) => {
  const productContext = useContext(ProductDetailContext);
  const [images, setImages] = useState<ImageDto[]>([]);
  const [videos, setVideos] = useState<VideoDetailDto[]>([]);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [mediaActive, setMediaActive] = useState<MediaItem>({} as MediaItem);

  useEffect(() => {
    let activeVariant = productContext?.variantActive;
    const listImage = [] as ImageDto[];
    orderBy(activeVariant?.images || [], 'sort').forEach(item => {
      if (item?.image) listImage.push(item.image);
    });
    setImages(listImage);
    
    const listVideo = [] as VideoDetailDto[];
    if (productContext?.product?.videos) {
      orderBy(productContext.product.videos, 'sort').forEach(item => {
        if (item?.video) listVideo.push(item);
      });
    }
    setVideos(listVideo);
    
    const combinedMedia: MediaItem[] = [
      ...listImage.map((img, index) => ({
        id: img.id,
        type: 'image' as const,
        data: img,
        sort: index
      })),
      ...listVideo.map((vid, index) => ({
        id: vid.video?.id,
        type: 'video' as const,
        data: vid,
        sort: listImage.length + index
      }))
    ];
    
    setMediaItems(orderBy(combinedMedia, 'sort'));
    
    if (listImage[0]) {
      setMediaActive(combinedMedia[0]);
    }
  }, [productContext?.variantActive]);

  return (
    <ProductImageDetailContext.Provider value={{ images, videos, mediaItems, mediaActive, setMediaActive }}>
      {children}
    </ProductImageDetailContext.Provider>
  );
};

export const useProductImageDetail = () => {
  const context = useContext(ProductImageDetailContext);
  if (!context) throw new Error('useProductImageDetail must be used within a ProductImageDetailProvider');
  return context;
};
