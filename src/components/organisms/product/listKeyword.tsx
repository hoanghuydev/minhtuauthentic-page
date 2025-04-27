import TagsOutlined from '@ant-design/icons/lib/icons/TagsOutlined';
import Link from 'next/link';
import { generateSlugToHref } from '@/utils';
import { useState } from 'react';
import { ProductDto } from '@/dtos/Product.dto';
import { twMerge } from 'tailwind-merge';
type Props = {
  product: ProductDto;
};
export default function ListKeyword({ product }: Props) {
  const [displayTags, setDisplayTags] = useState<boolean>(false);
  return (
    <div className={'mt-3'}>
      <TagsOutlined
        onClick={() => {
          setDisplayTags(!displayTags);
        }}
      />
      <div
        className={twMerge(
          'flex flex-wrap gap-1 items-center overflow-hidden',
          displayTags
            ? 'visible opacity-100 h-auto'
            : 'invisible opacity-0 h-0',
        )}
      >
        <span className={'font-[700] lg:font-bold'}>Từ khóa:</span>
        {product?.keywords?.map((item) => {
          return (
            <Link
              key={item?.id}
              href={generateSlugToHref(item?.keyword?.slugs?.slug)}
              className={'text-sm text-gray-500 hover:text-primary'}
              rel={'tag'}
            >
              {item.keyword?.value}
              {', '}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
