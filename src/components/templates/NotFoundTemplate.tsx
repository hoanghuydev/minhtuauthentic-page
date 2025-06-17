import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

type NotFoundTemplateProps = {
  title?: string;
  message?: string;
  buttonText?: string;
  redirectPath?: string;
  countdownSeconds?: number;
  showCountdown?: boolean;
};

const NotFoundTemplate = ({
  title = 'Trang không tìm thấy',
  message = 'Trang bạn đang tìm kiếm có thể đã bị xóa, đổi tên hoặc tạm thời không khả dụng.',
  buttonText = 'Quay lại trang chủ',
  redirectPath = '/',
  countdownSeconds = 5,
  showCountdown = true,
}: NotFoundTemplateProps) => {
  const router = useRouter();
  const [countdown, setCountdown] = useState(countdownSeconds);

  useEffect(() => {
    if (!showCountdown) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push(redirectPath);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router, redirectPath, showCountdown]);

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-full max-w-md mx-auto bg-white rounded-[10px] shadow-custom p-8">
        <h1 className="text-8xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">{title}</h2>
        <p className="text-gray-600 mb-8">{message}</p>
        <div className="flex flex-col space-y-4">
          <Link
            href={redirectPath}
            className="inline-block bg-primary hover:bg-primary/90 text-white font-medium py-3 px-6 rounded-md transition-colors"
          >
            {buttonText}
          </Link>
          {showCountdown && (
            <p className="text-sm text-gray-500">
              Tự động chuyển hướng sau{' '}
              <span className="font-semibold">{countdown}</span> giây
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotFoundTemplate;
