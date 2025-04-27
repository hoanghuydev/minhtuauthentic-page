import { SyntheticEvent, useMemo, useState } from 'react';
import { ImageDto } from '@/dtos/Image.dto';
import Image from 'next/image';
import noImage from '@/static/images/no-image.png';
export default function ImageMagnifier({
  image,
  zoomLevel = 1.5,
  alt,
  onClick,
}: {
  image: ImageDto | null;
  zoomLevel?: number;
  alt?: string;
  onClick?: (image: ImageDto | null) => void;
}) {
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [[x, y], setXY] = useState([0, 0]);
  const [[imgWidth, imgHeight], setSize] = useState([0, 0]);
  const src = image?.url || noImage;
  const [[magnifieWidth, magnifierHeight], setMagnifierSize] = useState([
    100, 100,
  ]);
  const [ready, setReady] = useState(false);

  const renderImage = useMemo(() => {
    return (
      <Image
        src={src}
        // style={{ height: image.height, width: image.width }}
        alt={alt || 'image'}
        className={'object-cover w-full h-full absolute top-0 left-0 '}
        onMouseEnter={(e) => {
          const elem = e.currentTarget;
          const { width, height } = elem.getBoundingClientRect();
          setSize([width, height]);
          setShowMagnifier(true);
        }}
        onMouseMove={(e) => {
          const elem = e.currentTarget;
          const { top, left } = elem.getBoundingClientRect();
          // calculate cursor position on the image
          const x = e.pageX - left - window.pageXOffset;
          const y = e.pageY - top - window.pageYOffset;
          setXY([x, y]);
        }}
        onMouseLeave={() => {
          setShowMagnifier(false);
        }}
        loading={'eager'}
        sizes={'(max-width: 768px) 100vw, 33vw'}
        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mPs7u2tBwAFdgImpqLKKAAAAABJRU5ErkJggg=="
        width={image?.width || 0}
        height={image?.height || 0}
        onLoad={(img: SyntheticEvent<HTMLImageElement>) => {
          const _img = img.target as HTMLImageElement;
          setSize([_img.width, _img.height]);
          setReady(true);
        }}
      />
    );
  }, [image]);

  return (
    <div
      className={
        'relative pt-[100%] overflow-hidden rounded-[10px] z-1 cursor-pointer'
      }
      onClick={() => {
        onClick && onClick(image);
      }}
    >
      {renderImage}

      <div
        style={{
          display: showMagnifier ? '' : 'none',
          position: 'absolute',

          // prevent magnifier blocks the mousemove event of img
          pointerEvents: 'none',
          // set size of magnifier
          height: `${magnifierHeight}px`,
          width: `${magnifieWidth}px`,
          // move element center to cursor pos
          top: `${y - magnifierHeight / 2}px`,
          left: `${x - magnifieWidth / 2}px`,
          opacity: '1', // reduce opacity so you can verify position
          border: '1px solid lightgray', // show the border of magnifier
          backgroundColor: 'white',
          backgroundImage: `url('${src}')`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: `${imgWidth * zoomLevel}px ${imgHeight * zoomLevel}px`,
          backgroundPositionX: `${-x * zoomLevel + magnifieWidth / 2}px`,
          backgroundPositionY: `${-y * zoomLevel + magnifierHeight / 2}px`,
        }}
      ></div>
    </div>
  );
}
