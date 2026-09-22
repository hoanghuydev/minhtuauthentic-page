import { useEffect } from 'react';
import { useRouter } from 'next/router';

const ScrollToTop = () => {
  const router = useRouter();

  useEffect(() => {
    // Own the offset outright: left on 'auto' the browser re-applies the previous
    // scroll position on reload, which shows as a jump before this lands.
    window.history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    // Shallow pushes are the category filters and the news pager, which stay on
    // the page and pass `scroll: false` on purpose.
    const handleRouteChangeComplete = (
      _url: string,
      { shallow }: { shallow: boolean },
    ) => {
      if (!shallow) {
        window.scrollTo(0, 0);
      }
    };

    router.events.on('routeChangeComplete', handleRouteChangeComplete);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
    };
  }, [router]);

  return null;
};

export default ScrollToTop;
