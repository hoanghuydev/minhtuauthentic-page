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
      title: <Link href={'/'}>Trang chủ</Link>,
    },
    {
      title: <Link href={link}>{label}</Link>,
    },
  ]);
  const [breadcrumbSchema, setBreadcrumbSchema] = useState<object>({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [],
  });
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
        title: <Link href={current?.link}>{current?.label}</Link>,
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

      <Breadcrumb
        className={twMerge('mb-3 overflow-auto', className)}
        items={items}
      />
    </>
  );
}
