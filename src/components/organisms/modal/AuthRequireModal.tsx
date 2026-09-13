import React, { useEffect } from 'react';
import Image from 'next/image';
import characterShow from '@/static/images/character-show.png';
import Link from 'next/link';
import { CloseOutlined } from '@ant-design/icons';
import { setBodyScrollLocked } from '@/utils/bodyScroll';

interface AuthRequireModalProps {
  open: boolean;
  onClose: () => void;
  redirectUrl: string;
}

const AuthRequireModal = ({
  open,
  onClose,
  redirectUrl,
}: AuthRequireModalProps) => {
  useEffect(() => {
    setBodyScrollLocked(open);
    return () => {
      setBodyScrollLocked(false);
    };
  }, [open]);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
      onClick={handleBackdropClick}
    >
      <div className="relative bg-white rounded-lg shadow-xl max-w-sm w-full max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <div
          className="absolute top-2 right-2 flex items-center justify-center w-8 h-8 rounded-full cursor-pointer z-10"
          style={{ backgroundColor: 'hsla(0, 0%, 4%, .2)' }}
          onClick={onClose}
        >
          <CloseOutlined className="text-white text-sm" />
        </div>

        {/* Modal content */}
        <div className="flex flex-col items-center p-6 gap-2">
          <div className="flex flex-col items-center justify-center mb-4">
            <span className="text-xl font-semibold text-primary text-center">
              Minhtuauthentic
            </span>
            <Image
              src={characterShow}
              height={80}
              width={80}
              alt="cps-smember-icon"
              className="h-20"
            />
          </div>

          <div className="text-center mb-6">
            <p className="text-gray-700 font-semibold text-sm sm:text-base">
              Vui lòng đăng nhập tài khoản Minhtuauthentic để xem ưu đãi và
              thanh toán dễ dàng hơn.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Link
              href={'/tai-khoan/dang-ky?redirectUrl=' + redirectUrl}
              className="flex-1 text-sm sm:text-base border-primary border-[2.5px] rounded-md !text-primary py-2 px-4 text-center transition-transform hover:scale-105 min-h-[44px] flex items-center justify-center"
            >
              Đăng ký
            </Link>
            <Link
              href={'/tai-khoan/dang-nhap?redirectUrl=' + redirectUrl}
              className="flex-1 !text-sm sm:!text-base !text-white py-2 px-4 rounded-md text-center transition-transform hover:scale-105 min-h-[44px] flex items-center justify-center"
              style={{
                backgroundImage:
                  'linear-gradient(90deg, #ff512f, #dd2440 51%, #ff512f)',
              }}
            >
              Đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthRequireModal;
