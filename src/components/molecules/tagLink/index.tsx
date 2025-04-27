import { TagLinkDto } from '@/dtos/tagLink.dto';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';
import { generateSlugToHref, isValidHttpUrl } from '@/utils';
type Props = {
  tagLinks: TagLinkDto;
  className?: string;
};
export function TagLink({ tagLinks, className }: Props) {
  return (
    <Link
      href={generateSlugToHref(tagLinks.slug)}
      className={twMerge(
        'bg-[#f3f4f6] border border-[#e5e7eb] rounded-[10px] text-[12px] p-[5px_10px]',
        className,
      )}
    >
      <span>{tagLinks.name}</span>
    </Link>
  );
}
