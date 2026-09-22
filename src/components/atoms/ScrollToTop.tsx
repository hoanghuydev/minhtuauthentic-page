import { useEffect } from 'react';
import { useRouter } from 'next/router';

const ScrollToTop = () => {
  const router = useRouter();

  // Xử lý khi component mount (refresh trang)
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    // Mặc định trình duyệt khôi phục vị trí cuộn cũ khi back/forward. Tắt hẳn để
    // mọi lần điều hướng — kể cả back — đều bắt đầu ở đầu trang.
    window.history.scrollRestoration = 'manual';
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  // Xử lý khi route thay đổi (chuyển trang, kể cả back/forward)
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handleRouteChangeComplete = (
      url: string,
      { shallow }: { shallow: boolean },
    ) => {
      // Bỏ qua shallow routing (đổi bộ lọc danh mục, phân trang tin tức) và link
      // neo #: đó không phải chuyển trang, kéo về đầu sẽ làm mất ngữ cảnh.
      if (shallow || window.location.hash) {
        return;
      }
      // 'auto' chứ không 'smooth': nội dung đã đổi rồi, cuộn mượt từ giữa trang
      // lên chỉ gây giật.
      window.scrollTo({ top: 0, behavior: 'auto' });
    };

    router.events.on('routeChangeComplete', handleRouteChangeComplete);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
    };
  }, [router]);

  // Component này không render gì cả
  return null;
};

export default ScrollToTop;
