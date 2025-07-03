import { DoubleLeftOutlined, DoubleRightOutlined } from '@ant-design/icons';

interface ImageCountProps {
  currentIndex: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  className?: string;
}

const ImageCount = ({
  currentIndex,
  total,
  onPrev,
  onNext,
  className,
}: ImageCountProps) => {
  return (
    <div
      className={`absolute bottom-4 right-4 flex items-center gap-2 bg-black bg-opacity-50 text-white text-lg font-semibold tracking-[0.2em] px-3 py-1 rounded-[15px] z-[2] select-none ${className}`}
    >
      <DoubleLeftOutlined onClick={onPrev} />
      <div className="tracking-[0.2em] select-none">
        {currentIndex + 1}/{total}
      </div>
      <DoubleRightOutlined onClick={onNext} />
    </div>
  );
};

export default ImageCount;
