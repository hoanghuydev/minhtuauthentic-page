import { useIsDesktop } from '@/hooks/useDevice';
import { StaticContentsDto } from '@/dtos/StaticContents.dto';
import { JSX } from 'react';
import { Collapse } from 'antd/es';
type Props = {
  items: StaticContentsDto[];
};
export default function FooterContent({ items }: Props) {
  const isDesktop = useIsDesktop();
  const containerClass = 'flex flex-col gap-2';
  const panelClass = 'bg-white custom-rounded overflow-hidden';

  const renderFooterDesktop = () => {
    const xhtml: JSX.Element[] = [];
    items.forEach((item, index) => {
      switch (index) {
        case 0:
          xhtml.push(
            <div key={item.id} className={panelClass}>
              <p
                className={
                  'uppercase font-[700] lg:font-bold lg:mb-[10px] text-[16px] px-4 pt-4'
                }
              >
                VỀ CHÚNG TÔI
              </p>
              <div
                className={'lg:mt-[12px] px-4 pb-4'}
                dangerouslySetInnerHTML={{ __html: item.content || '' }}
              />
            </div>,
          );
          break;
        case 1:
        case 2:
        case 3:
          xhtml.push(
            <div key={item.id} className={panelClass}>
              <p className={'uppercase font-semibold text-[16px] px-4 pt-4'}>
                {item.title}
              </p>
              <div
                className={'lg:mt-[12px] px-4 pb-4'}
                dangerouslySetInnerHTML={{ __html: item.content || '' }}
              />
            </div>,
          );
          break;
      }
    });
    return <div className={containerClass}>{xhtml}</div>;
  };
  const renderFooterMobile = () => {
    return (
      <div className={containerClass}>
        <Collapse
          bordered={false}
          className={containerClass}
          expandIconPosition="end"
        >
          {items.map((item, index) => {
            return (
              <Collapse.Panel
                key={item?.id || 0}
                header={item.title}
                className={panelClass}
              >
                <div
                  className={'lg:mt-[12px]'}
                  dangerouslySetInnerHTML={{ __html: item.content || '' }}
                />
              </Collapse.Panel>
            );
          })}
        </Collapse>
      </div>
    );
  };
  return <>{isDesktop ? renderFooterDesktop() : renderFooterMobile()}</>;
}
