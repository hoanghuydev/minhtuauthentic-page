import { useIsMobile } from '@/hooks/useDevice';
import { CategoryNewsDto } from '@/dtos/CategoryNews.dto';
import { generateSlugToHref } from '@/utils';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { upperCase } from 'lodash';

type Props = {
  categoryNews: CategoryNewsDto[];
};

export default function NewsCategoryMobile({ categoryNews }: Props) {
  const router = useRouter();

  // Add "MỚI" as default tab
  const allTabs = useMemo(() => {
    const defaultTab = {
      id: 'news',
      name: 'TIN TỨC',
      slugs: { slug: '/tin-tuc' },
    };

    return [defaultTab, ...categoryNews];
  }, [categoryNews]);

  // Determine active tab based on current URL
  const activeTabId = useMemo(() => {
    const path = router.asPath;
    // Check if path matches any category from categoryNews
    const matchingCategory = categoryNews.find((category) =>
      path.includes(category.slugs?.slug || ''),
    );

    if (matchingCategory) return matchingCategory.id;

    // Default to "MỚI" tab
    return allTabs[0].id;
  }, [router.asPath, categoryNews]);

  return (
    <>
      <div className="w-full overflow-x-auto border-b mb-2">
        <div className="flex whitespace-nowrap">
          {allTabs.map((item, index) => (
            <Link
              href={generateSlugToHref(item?.slugs?.slug)}
              key={item.id || index}
              className={`px-4 py-2 font-medium text-sm inline-block ${
                item.id === activeTabId ||
                (activeTabId === allTabs[0].id && index === 0)
                  ? 'text-red-600 border-b-2 border-red-600 font-bold'
                  : 'text-gray-700'
              }`}
            >
              {item.name?.toUpperCase()}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
