import { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import TabContent from '@/components/molecules/tabsContainer/content';
type Props = {
  header: string[];
  content: string[];
  className?: string;
};
export default function TabsContainer({ header, content, className }: Props) {
  const [indexActive, setIndexActive] = useState<number>(0);
  const [height, setHeight] = useState(0);
  function renderButton(item: string, index: number) {
    const active = index === indexActive;
    return (
      <button
        key={index}
        className={twMerge(
          'bg-primaryGrey rounded-[10px] px-3 py-2 text-[13px] font-semibold',
          active ? 'bg-primary text-white' : 'bg-white text-black',
        )}
        type={'button'}
        onClick={() => setIndexActive(index)}
      >
        <h2>{item}</h2>
      </button>
    );
  }

  return (
    <div
      className={twMerge('rounded-[10px] shadow-custom bg-white', className)}
    >
      <div
        className={
          'flex items-center gap-3 pb-3 border-b-gray-300 border-b p-3'
        }
      >
        {header.map((item: string, index: number) => {
          return renderButton(item, index);
        })}
      </div>
      <div className={'relative'}>
        {content.map((item, index: number) => {
          return (
            index === indexActive && (
              <TabContent
                key={index}
                item={item}
                index={index}
                indexActive={indexActive}
                setHeight={(value: number) => {
                  setHeight((height: number) => {
                    if (height < value) return value;
                    return height;
                  });
                }}
              />
            )
          );
        })}
      </div>
    </div>
  );
}
