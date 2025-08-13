import { useEffect } from 'react';
import { useRouter } from 'next/router';

const ScrollToTop = () => {
  const router = useRouter();

  // Xử lý khi component mount (refresh trang)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  }, []);

  // Xử lý khi route thay đổi (chuyển trang)
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handleRouteChangeComplete = () => {
      window.history.scrollRestoration = "auto";
    };

    const handleRouteChangeStart = () => {
      window.history.scrollRestoration = "manual";
    };

    router.events.on('routeChangeComplete', handleRouteChangeComplete);
    router.events.on('routeChangeStart', handleRouteChangeStart);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
      router.events.off('routeChangeStart', handleRouteChangeStart);
    };
  }, [router]);

  // Component này không render gì cả
  return null;
};

export default ScrollToTop;
