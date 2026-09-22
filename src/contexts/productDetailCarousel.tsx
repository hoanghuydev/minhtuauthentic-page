import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  JSX,
} from 'react';
import orderBy from 'lodash/orderBy';
import ProductDetailContext from './productDetailContext';
import { ImageDto } from '@/dtos/Image.dto';
import { VideoDetailDto } from '@/dtos/VideoDetail.dto';
import { ProductDto } from '@/dtos/Product.dto';
import MediaItem from '@/dtos/Media.dto';

const ProductImageDetailContext = createContext<{
  images: ImageDto[];
  videos: VideoDetailDto[];
  mediaItems: MediaItem[];
  mediaActive?: MediaItem;
  setMediaActive: (media: MediaItem) => void;
}>({
  images: [],
  videos: [],
  mediaItems: [],
  setMediaActive: () => {},
});

export const ProductImageDetailProvider = ({
  product,
  children,
}: {
  product?: ProductDto;
  children: JSX.Element;
}) => {
  const productContext = useContext(ProductDetailContext);
  // Both context values are only filled in after mount. Falling back to the
  // product prop keeps the media list available during SSR, which is what puts
  // the main product photo into the server HTML for Googlebot-Image.
  const _product = productContext?.product || product;
  const activeVariant =
    productContext?.variantActive ||
    (_product?.variants || []).find((item) => item.is_default) ||
    _product?.variants?.[0];

  const images = useMemo(() => {
    const list: ImageDto[] = [];
    orderBy(activeVariant?.images || [], 'sort').forEach((item) => {
      if (item?.image) list.push(item.image);
    });
    return list;
  }, [activeVariant]);

  const videos = useMemo(() => {
    const list: VideoDetailDto[] = [];
    orderBy(_product?.videos || [], 'sort').forEach((item) => {
      if (item?.video) list.push(item);
    });
    return list;
  }, [_product]);

  const mediaItems = useMemo(
    () =>
      orderBy(
        [
          ...videos.map((vid, index) => ({
            id: vid.video?.id,
            type: 'video' as const,
            data: vid,
            sort: index,
          })),
          ...images.map((img, index) => ({
            id: img.id,
            type: 'image' as const,
            data: img,
            sort: videos.length + index,
          })),
        ] as MediaItem[],
        'sort',
      ),
    [images, videos],
  );

  const firstImage = mediaItems[videos.length];
  const [mediaActive, setMediaActive] = useState<MediaItem>(
    firstImage || ({} as MediaItem),
  );

  // Reset the selection when the active variant swaps in a new image set.
  useEffect(() => {
    if (firstImage) setMediaActive(firstImage);
  }, [firstImage]);

  return (
    <ProductImageDetailContext.Provider
      value={{ images, videos, mediaItems, mediaActive, setMediaActive }}
    >
      {children}
    </ProductImageDetailContext.Provider>
  );
};

export const useProductImageDetail = () => {
  const context = useContext(ProductImageDetailContext);
  if (!context)
    throw new Error(
      'useProductImageDetail must be used within a ProductImageDetailProvider',
    );
  return context;
};
