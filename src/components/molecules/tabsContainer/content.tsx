import { twMerge } from 'tailwind-merge';
import { useEffect, useRef, useState } from 'react';
type Props = {
  className?: string;
  index: number;
  indexActive: number;
  item: string;
  setHeight: (value: number) => void;
};
export default function TabContent({
  className,
  index,
  item,
  indexActive,
  setHeight,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) {
      const height = ref.current?.clientHeight;
      setHeight && setHeight(height ? height + 48 : 0);
    }
  }, [ready]);
  return (
    <div
      key={index}
      className={twMerge(
        ' inset-0 p-3 opacity-0 invisible transition-opacity duration-500 z-[-1]',
        index === indexActive && 'opacity-100 visible z-[1]',
        className,
      )}
    >
      <div
        ref={ref}
        className={'container-html'}
        dangerouslySetInnerHTML={{
          __html: item,
        }}
      />
    </div>
  );
}
