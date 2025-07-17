import { NewsDto } from '@/dtos/News.dto';
import { SettingsDto } from '@/dtos/Settings.dto';
import noImage from '@/static/images/no-image.png';
import Image from 'next/image';

import Link from 'next/link';
import { generateSlugToHref, truncateString } from '@/utils';
import NewsClock from '@/components/atoms/news/clock';
import { SettingOptionDto } from '@/dtos/SettingOption.dto';
import NewsItem from '@/components/organisms/news/item';
import NewsSmallList from '@/components/organisms/news/smallList';

type Props = {
  content: {
    featured: NewsDto[];
    news: NewsDto[];
  };
  setting?: SettingOptionDto;
};
export default function HomeNews({ content, setting }: Props) {
  return (
    <div
      className={'p-3 mt-3 rounded-[10px]'}
      style={{ backgroundColor: setting?.backgroundColor || '#fff' }}
    >
      <h2 className={'text-[24px] font-[700] lg:font-bold'}>
        <Link href={'/tin-tuc'}>Tin tức nổi bật </Link>
      </h2>
      <div className={'mt-3 grid gap-3 grid-col-1 lg:grid-cols-3'}>
        <div className={'grid grid-cols-1 lg:grid-cols-2 gap-3 lg:col-span-2'}>
          {content.featured.map((item: NewsDto, key: number) => {
            return <NewsItem news={item} key={key} />;
          })}
        </div>
        <div className={'shrink-0 h-[500px] overflow-auto'}>
          <NewsSmallList news={content.news} />
        </div>
      </div>
    </div>
  );
}
