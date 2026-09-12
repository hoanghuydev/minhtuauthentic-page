import { useMemo } from 'react';
import { twMerge } from 'tailwind-merge';
import Toc from '@/components/atoms/toc';
type Props = {
  className?: string;
  index: number;
  indexActive: number;
  item: string;
  showToc?: boolean;
};
export default function TabContent({
  className,
  index,
  item,
  indexActive,
  showToc,
}: Props) {
  // A fresh object would make React re-apply the markup on every parent render,
  // rebuilding the whole description and wiping the ids the TOC puts on headings.
  const html = useMemo(() => ({ __html: item }), [item]);

  return (
    <div
      key={index}
      className={twMerge(
        ' inset-0 p-3 opacity-0 invisible transition-opacity duration-500 z-[-1]',
        index === indexActive && 'opacity-100 visible z-[1]',
        className,
      )}
    >
      {showToc && <Toc />}
      <div
        id={showToc ? 'toc-content' : undefined}
        className={'container-html'}
        dangerouslySetInnerHTML={html}
      />
    </div>
  );
}
