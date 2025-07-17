import { NewsDto } from '@/dtos/News.dto';
import noImage from '@/static/images/no-image.png';
import Image from 'next/image';
import Link from 'next/link';
import NewsClock from '@/components/atoms/news/clock';
import { useRouter } from 'next/router';
import { generateSlugToHref } from '@/utils';
import ImageWithFallback from '@/components/atoms/images/ImageWithFallback';

type Props = {
  content: {
    featured: NewsDto[];
    news: NewsDto[];
  };
};
export default function HighlightedNews({ content }: Props) {
  const router = useRouter();
  return (
    <div
      className={'p-3 mt-3 rounded-[10px]'}
    >
      <h2 className={`text-[24px] font-[700] lg:font-bold text-primary mb-3`}>
        <Link href={'/tin-tuc'}>Tin tức nổi bật </Link>
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-5">
        <div
          className="relative rounded-xl overflow-hidden lg:h-[500px] h-64 cursor-pointer"
          onClick={() => router.push(generateSlugToHref(content.featured[0]?.slugs?.slug))}
        >
          <ImageWithFallback
            image={content.featured[0]?.images?.[0]?.image}
            alt={content.featured[0]?.title || 'Featured News'}
            isFill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-60" />
          <div className="absolute bottom-0 p-4 text-white">
            <div
              className="text-2xl font-semibold mb-2 line-clamp-2"
              dangerouslySetInnerHTML={{
                __html: content.featured[0]?.content || '',
              }}
            />
            <NewsClock item={content.featured[0]} className={'text-white text-md'} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 lg:gap-3">
          {content.news.map((post) => (
            <div
              key={post.id}
              className="relative rounded-xl overflow-hidden lg:h-full h-64 cursor-pointer"
              onClick={() => router.push(generateSlugToHref(content.featured[0]?.slugs?.slug))}
            >
              <ImageWithFallback
                image={post.images?.[0]?.image}
                alt={post.title || 'News Image'}
                isFill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-60" />
              <div className="absolute bottom-0 p-3 text-white">
                <div
                  className="text-xl font-semibold mb-2 line-clamp-2"
                  dangerouslySetInnerHTML={{
                    __html: post.content || '',
                  }}
                />
                <NewsClock item={post} className={'text-white text-md'} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
