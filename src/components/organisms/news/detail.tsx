import NewsClock from '@/components/atoms/news/clock';
import { NewsDto } from '@/dtos/News.dto';
import Script from 'next/script';
import NewsToc from '@/components/atoms/news/toc';
import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';

type Props = {
  news: NewsDto;
};

export default function NewsDetail({ news }: Props) {
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
      {news && <NewsClock item={news} />}
      <NewsToc />
      {renderContent}
      <Script
        strategy={'beforeInteractive'}
        src={'https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js'}
        async={false}
      />
      <Script strategy={'beforeInteractive'} src={'/js/toc.js'} async={false} />
      <Script
        strategy={'afterInteractive'}
        src={'/news-detail.min.js'}
        async={false}
      />
    </>
  );
}
