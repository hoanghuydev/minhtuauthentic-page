import { useState, useEffect } from 'react';
import { twMerge } from 'tailwind-merge';
import { useIsMobile } from '@/hooks/useDevice';
import { Button } from 'antd/es';
import useSettings from '@/hooks/useSettings';
import { CloseOutlined } from '@ant-design/icons';

interface EventButtonProps {
  hasActiveEvents: boolean;
  onClick: () => void;
}

export default function EventButton({ hasActiveEvents, onClick }: EventButtonProps) {
  const isMobile = useIsMobile();
  const settings = useSettings();
  const eventTitle = settings?.commonSettings?.eventButtonTitle || '🎉 SỰ KIỆN';
  const [isClosed, setIsClosed] = useState(false);

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsClosed(true);
  };

  if (!hasActiveEvents || isMobile || isClosed) {
    return null;
  }

  return (
    <>
      {/* Event Button Widget for PC - Left Side */}
      <div
        className={twMerge(
          'hidden md:flex fixed left-0 top-1/2 transform -translate-y-1/2 z-40',
        )}
      >
        <div className="bg-black border-gray-800 border-l-0 border-[1px] flex flex-col items-center py-3 px-2 gap-3 rounded-r-md  overflow-hidden">
          <button
            onClick={handleClose}
            className="w-5 h-5 hover:bg-gray-700 rounded-full flex items-center justify-center text-white cursor-pointer transition-colors flex-shrink-0"
            aria-label="Đóng nút sự kiện"
          >
            <CloseOutlined className="text-[14px] font-bold" />
          </button>

          <button
            onClick={onClick}
            className="text-[14px] md:text-[16px] ps-4 text-white font-medium uppercase tracking-wider cursor-pointer hover:text-gray-200 transition-colors"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            {eventTitle}
          </button>
        </div>
      </div>
    </>
  );
}
