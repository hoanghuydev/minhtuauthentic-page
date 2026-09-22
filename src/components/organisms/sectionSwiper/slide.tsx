import { ReactNode, useEffect, useRef } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
  setHeightItem: (height: number) => void;
};
const SectionSwiperSlide = ({ children, className, setHeightItem }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  // `setHeightItem` là arrow function tạo mới mỗi lần cha render, giữ qua ref để
  // effect dưới không phải chạy lại và vẫn luôn gọi bản mới nhất.
  const cbRef = useRef(setHeightItem);
  cbRef.current = setHeightItem;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Trước đây chỗ này đọc `ref.current.clientHeight` đồng bộ ngay trong effect.
    // Hai vấn đề: đó là một phép đọc layout cưỡng bức đúng lúc main thread đang
    // bận nhất, và nó trả 0 khi phần tử cha chưa được vẽ (ví dụ đang nằm trong
    // `content-visibility: auto`) — khi đó wrapper của swiper sập chiều cao.
    // ResizeObserver chỉ bắn khi phần tử thật sự có hộp, nên đúng ở cả hai ca.
    if (typeof ResizeObserver === 'undefined') {
      const h = el.clientHeight;
      if (h > 0) cbRef.current(h);
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const height = entries[0]?.contentRect?.height ?? 0;
      if (height > 0) {
        cbRef.current(height);
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};
export default SectionSwiperSlide;
