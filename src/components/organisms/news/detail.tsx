import NewsClock from '@/components/atoms/news/clock';
import { NewsDto } from '@/dtos/News.dto';
import Script from 'next/script';
import Toc from '@/components/atoms/toc';
import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
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

  const router = useRouter();
  useEffect(() => {
    const handleRouteComplete = () => {
      if (window && window.onToc) {
        window.onToc();
      }
    };
    router.events.on('routeChangeComplete', handleRouteComplete);
    return () => {
      router.events.on('routeChangeComplete', handleRouteComplete);
    };
  }, [router]);

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
  }, []);
  return (
    <>
      <Head>
        <script type="application/ld+json">
          {JSON.stringify(newsSchema)}
        </script>
      </Head>
      {news && <NewsClock item={news} />}
      <Toc />
      {renderContent}
      <Script
        strategy={'beforeInteractive'}
        src={'https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js'}
        async={false}
      />
      <Script strategy={'beforeInteractive'} src={'/js/toc.js'} async={false} />
      <Script
        strategy={'afterInteractive'}
        src={'/toc.min.js'}
        async={false}
      />
    </>
  );
}
