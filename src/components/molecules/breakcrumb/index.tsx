import { Breadcrumb } from 'antd/es';
import Link from 'next/link';
import { ReactNode, useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

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
  useEffect(() => {
    if (current) {
      const _items = [...items];
      _items.push({
        title: <Link href={current?.link}>{current?.label}</Link>,
      });
      setItems(_items);
    }
  }, []);
  return (
    <Breadcrumb
      className={twMerge('mb-3 overflow-auto', className)}
      items={items}
    />
  );
}
