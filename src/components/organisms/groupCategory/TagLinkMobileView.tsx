import { TagLink } from '@/components/molecules/tagLink';
import { TagLinkDto } from '@/dtos/tagLink.dto';
import { generateSlugToHref } from '@/utils';
import { MobileView } from 'react-device-detect';

export default function TagLinkMobileView({slug}: {slug: string}){
  return <MobileView>
    <TagLink
      tagLinks={
        new TagLinkDto({
          id: 0,
          name: 'Xem tất cả',
          slug: generateSlugToHref(
            slug,
          ),
        })
      }
      className={'lg:hidden last:mr-0 whitespace-nowrap text-black'}
    />
  </MobileView>
}