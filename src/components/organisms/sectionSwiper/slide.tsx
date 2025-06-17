import { ReactNode, useEffect, useRef, useState } from 'react';
import { SwiperSlide } from 'swiper/react';

type Props = {
  children: ReactNode;
  className?: string;
  setHeightItem: (height: number) => void;
};
const SectionSwiperSlide = ({ children, className, setHeightItem }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (isReady && ref.current) {
      setHeightItem(ref.current.clientHeight);
    }
  }, [isReady]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};
export default SectionSwiperSlide;
