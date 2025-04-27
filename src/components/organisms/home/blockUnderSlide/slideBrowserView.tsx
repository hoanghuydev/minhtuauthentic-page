import BlockUnderSlideItem from '@/components/molecules/blockUnderSlide/item';
import { BrowserView } from 'react-device-detect';
import { StaticContentsDto } from '@/dtos/StaticContents.dto';
import { useEffect } from 'react';

export default function SlideBrowserView({
  contents,
  onLoad,
}: {
  contents: StaticContentsDto[];
  onLoad: () => void;
}) {
  useEffect(() => {
    onLoad();
  }, []);
  return <BrowserView></BrowserView>;
}
