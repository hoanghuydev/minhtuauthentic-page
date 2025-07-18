import { useIsDesktop } from '@/hooks/useDevice';
import { CategoryNewsDto } from '@/dtos/CategoryNews.dto';
import { generateSlugToHref } from '@/utils';
import Link from 'next/link';
import { useMemo } from 'react';
import { useRouter } from 'next/router';

type Props = {
  categoryNews: CategoryNewsDto[];
};

export default function NewsCategory({ categoryNews }: Props) {
  const isDesktop = useIsDesktop();
  const router = useRouter();

  const allTabs = useMemo(() => {
    const defaultTab = {
      id: 'news',
      name: 'Tin tức',
      slugs: { slug: '/tin-tuc' },
    };

    return [defaultTab, ...categoryNews];
  }, [categoryNews]);

  // Determine active tab based on current URL
  const activeTabId = useMemo(() => {
    const path = router.asPath;
    const matchingCategory = categoryNews.find((category) =>
      path.includes(category.slugs?.slug || ''),
    );

    if (matchingCategory) return matchingCategory.id;

    return allTabs[0].id;
  }, [router.asPath, categoryNews]);

  return (
    <div className="mb-6">
      {isDesktop && (
        <ul className={'flex items-center justify-center gap-3'}>
          {allTabs.map((item, key: number) => {
            const active = item.id === activeTabId || (activeTabId === allTabs[0].id && key === 0);
            return (
              <li
                key={key}
                className={`p-3 text-lg font-semibold rounded-lg
                ${active ? 'text-white bg-primary' : ''}`}
              >
                <Link href={generateSlugToHref(item?.slugs?.slug)}>
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
