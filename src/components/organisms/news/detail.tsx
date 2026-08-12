import NewsClock from '@/components/atoms/news/clock';
import { NewsDto } from '@/dtos/News.dto';
import Toc from '@/components/atoms/toc';
import { useMemo } from 'react';
import Head from 'next/head';

type Props = {
  news: NewsDto;
};

export default function NewsDetail({ news }: Props) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
  const newsSchema = {
    "@context": "http://schema.org",
    "@type": "Article",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${baseUrl}/${news?.slugs?.slug}`,
    },
    "headline": news?.seo?.title,
    "description": news?.seo?.description,
    "image": {
      "@type": "ImageObject",
      "url": news?.images?.[0]?.image?.url,
      "width": news?.images?.[0]?.image?.width,
      "height": news?.images?.[0]?.image?.height
    },
    "author": {
      "@type": "Person",
      "name": "Minh Tu Authentic"
    },
    "publisher": {
      "@type": "Organization",
      "name": "MinhTuAuthentic",
      "logo": {
        "@type": "ImageObject",
        "url": "https://minhtuauthentic.com/images/logo-minhtuauthentic.png",
        "width": 250,
        "height": 60
      }
    },
    "datePublished": "2025-05-20T08:00:00+07:00",
    "dateModified": "2025-05-25T10:00:00+07:00"
  }

  const renderContent = useMemo(() => {
    return (
      <>
        <div
          id={'toc-content'}
          className={'container-html'}
          dangerouslySetInnerHTML={{ __html: news?.content || '' }}
        />
      </>
    );
  }, [news?.content]);
  return (
    <>
      <Head>
        <script type="application/ld+json">
          {JSON.stringify(newsSchema)}
        </script>
      </Head>
      {news && <NewsClock item={news} />}
      <Toc contentKey={news?.id} />
      {renderContent}
    </>
  );
}
