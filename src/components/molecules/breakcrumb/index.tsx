import { useIsMobile } from '@/hooks/useDevice';
import { Breadcrumb } from 'antd/es';
import Link from 'next/link';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import Head from 'next/head';

type Props = {
  link: string;
  label: string;
  additions?: { label: string; link: string }[] ;
  current?: { label: string; link: string };
  className?: string;
};
export default function BreadcrumbComponent({
  link,
  label,
  current,
  className,
  additions
}: Props) {
  const [items, setItems] = useState<{ title: ReactNode | string }[]>([
    {
      title: (
        <Link href={'/'} style={{ color: '#323232' }}>
          Trang chủ
        </Link>
      ),
    },
    {
      title: current ? (
        <Link href={link} style={{ color: '#323232' }}>
          {label}
        </Link>
      ) : (
        <Link href={link} style={{ color: '#323232', fontWeight: 'bold' }}>
          {label}
        </Link>
      ),
    },
  ]);
  const isMobile = useIsMobile();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (current) {
      const _items = [...items];
      (additions || []).map(breadItem => {
        if(breadItem.label && breadItem.link) {
          _items.push({
            title: (
              <Link
                href={breadItem.link}
                style={{ color:'#323232' }}
              >
                {breadItem.label}
              </Link>
            ),
          })
        }
      })
      _items.push({
        title: (
          <Link
            href={current?.link}
            className="text-primary px-2 py-1 rounded"
            style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}
          >
            {current?.label}
          </Link>
        ),
      });
      setItems(_items);
    }
  }, []);

  const breadcrumbSchema = useMemo(() => {
    const baseUrl =
      typeof window !== 'undefined'
        ? window.location.origin
        : process.env.APP_URL;
    const elementList = [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Trang chủ',
        item: `${baseUrl}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: label,
        item: `${baseUrl}/${link}`,
      },
    ];

    (additions || []).forEach((item) => {
      if(item.label && item.link) {
        elementList.push({
          '@type': 'ListItem',
          position: elementList.length + 1,
          name: item.label,
          item: `${baseUrl}/${item.link}`,
        })
      }
    })

    if (current) {
      elementList.push({
        '@type': 'ListItem',
        position: elementList.length + 1,
        name: current.label,
        item: `${baseUrl}${current.link}`,
      });
    }

    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: elementList,
    };
  }, [label, link, current]);

  return (
    <>
      <Head>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Head>
      {isMounted && isMobile && <div className={'mt-16'}></div>}
      <Breadcrumb
        className={twMerge(
          'mb-3 overflow-auto scrollbar-hide [&>ol]:whitespace-nowrap [&>ol]:flex [&>ol]:flex-nowrap [&>ol>li]:h-6',
          className,
        )}
        items={items}
      />
    </>
  );
}
