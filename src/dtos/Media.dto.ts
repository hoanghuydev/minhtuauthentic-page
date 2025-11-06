import { ImageDto } from "./Image.dto";
import { VideoDetailDto } from "./VideoDetail.dto";

export default class MediaItem {
    id?: number;
    type: 'image' | 'video' = 'image';
    data?: ImageDto | VideoDetailDto;
    sort?: number;
  };