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
      title: (
        <Link href={'/'} style={{ color: '#323232' }}>
          Trang chủ
        </Link>
      ),
    },
    {
      title: (
        <Link href={link} style={{ color: '#323232' }}>
          {label}
        </Link>
      ),
    },
  ]);
  useEffect(() => {
    if (current) {
      const _items = [...items];
      _items.push({
        title: (
          <Link
            href={current?.link}
            className="text-primary px-2 py-1 rounded"
            style={{ color: 'var(--primary-color)' }}
          >
            {current?.label}
          </Link>
        ),
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
