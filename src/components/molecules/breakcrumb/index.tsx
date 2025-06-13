import { useIsMobile } from '@/hooks/useDevice';
import { Breadcrumb } from 'antd/es';
import Link from 'next/link';
import { ReactNode, useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import Head from 'next/head';

type Props = {
  link: string;
  label: string;
  current?: { label: string; link: string };
  className?: string;
};
export default function BreadcrumbComponent({
  link,
  label,
  current,
  className,
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
  const [breadcrumbSchema, setBreadcrumbSchema] = useState<object>({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [],
  });
  const isMobile = useIsMobile();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const baseUrl = 'https://minhtuauthentic.com';
    const elementList = [
      {
        "@type": "ListItem",
        position: 1,
        name: "Trang chủ",
        item: `${baseUrl}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: label || '',
        item: `${baseUrl}${link}`,
      },
    ];

    if (current) {
      const _items = [...items];
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

      elementList.push({
        "@type": "ListItem",
        position: 3,
        name: current.label || '',
        item: `${baseUrl}${current.link}`,
      });
    }

    setBreadcrumbSchema({
      "@context": 'https://schema.org',
      "@type": 'BreadcrumbList',
      itemListElement: elementList,
    });
  }, []);
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
          'mb-3 overflow-auto scrollbar-hide [&>ol]:whitespace-nowrap [&>ol]:flex [&>ol]:flex-nowrap',
          className,
        )}
        items={items}
      />
    </>
  );
}
