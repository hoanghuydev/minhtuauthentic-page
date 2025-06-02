import { useEffect } from 'react';
import { useRouter } from 'next/router';

/**
 * Component ScrollToTop
 * Tự động cuộn lên đầu trang khi:
 * 1. Component được mount (refresh trang)
 * 2. Route thay đổi (chuyển trang)
 */
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

    const handleRouteChange = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);

  // Component này không render gì cả
  return null;
};

export default ScrollToTop;
