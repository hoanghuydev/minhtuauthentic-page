import { useIsDesktop } from '@/hooks/useDevice';
import { StaticContentsDto } from '@/dtos/StaticContents.dto';
import { JSX } from 'react';
import { Collapse } from 'antd/es';
type Props = {
  items: StaticContentsDto[];
};
export default function FooterContent({ items }: Props) {
  const isDesktop = useIsDesktop();
  const renderFooterDesktop = () => {
    const xhtml: JSX.Element[] = [];
    items.forEach((item, index) => {
      switch (index) {
        case 0:
          xhtml.push(
            <div key={item.id}>
              <p
                className={
                  'uppercase font-[700] lg:font-bold lg:mb-[10px] text-[16px]'
                }
              >
                VỀ CHÚNG TÔI
              </p>
              <div
                className={'lg:mt-[12px]'}
                dangerouslySetInnerHTML={{ __html: item.content || '' }}
              />
            </div>,
          );
          break;
        case 1:
        case 2:
          xhtml.push(
            <div key={item.id}>
              <p className={'uppercase font-semibold text-[16px]'}>
                {item.title}
              </p>
              <div
                className={'lg:mt-[12px]'}
                dangerouslySetInnerHTML={{ __html: item.content || '' }}
              />
            </div>,
          );
          break;
        case 3:
          xhtml.push(
            <div key={item.id}>
              <p className={'uppercase font-semibold text-[16px]'}>
                {item.title}
              </p>
              <div
                className={'lg:mt-[12px]'}
                dangerouslySetInnerHTML={{ __html: item.content || '' }}
              />
            </div>,
          );
          break;
      }
    });

    return <>{xhtml}</>;
  };
  const renderFooterMobile = () => {
    return (
      <Collapse>
        {items.map((item, index) => {
          return (
            <Collapse.Panel key={item?.id || 0} header={item.title}>
              <div
                className={'lg:mt-[12px]'}
                dangerouslySetInnerHTML={{ __html: item.content || '' }}
              />
            </Collapse.Panel>
          );
        })}
      </Collapse>
    );
  };
  return <>{isDesktop ? renderFooterDesktop() : renderFooterMobile()}</>;
}
