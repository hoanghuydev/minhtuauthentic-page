import { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { useIsMobile } from '@/hooks/useDevice';
import { Button } from 'antd';
import Link from 'next/link';
import {
  FireOutlined,
  ThunderboltOutlined,
  SearchOutlined,
  CloseOutlined,
} from '@ant-design/icons';

export default function CustomerService() {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Customer Service Widget */}
      <div
        className={twMerge(
          'hidden md:flex fixed right-0 top-1/2 transform -translate-y-1/2 z-50 flex flex-col items-end',
        )}
      >
        {/* Popup Menu */}
        {isOpen && (
          <div
            className={twMerge(
              'mb-3 bg-white shadow-xl border border-gray-200 overflow-hidden min-w-[200px]',
              'transform transition-all duration-300 ease-out',
              'animate-in slide-in-from-right-full',
            )}
          >
            <div className="bg-purple-200 px-4 py-3 border-b border-gray-200 relative">
              <h3 className="text-sm font-medium text-gray-800">
                🔥 Chương trình Hot
              </h3>
              <Button
                type="text"
                icon={<CloseOutlined />}
                onClick={() => setIsOpen(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 w-5 h-5 flex items-center justify-center p-0 border-0"
                size="small"
              />
            </div>

            <div className="p-3">
              {/* Flash Sale Option */}
              <Link href="/flash-sale">
                <Button
                  type="text"
                  icon={<ThunderboltOutlined className="text-orange-500" />}
                  className="flex items-center gap-3 px-3 py-3 hover:bg-gray-50 rounded-md transition-colors border-b border-gray-100 last:border-b-0 w-full justify-start h-auto"
                >
                  <span className="text-sm text-gray-700 font-medium">
                    Flash sale
                  </span>
                </Button>
              </Link>

              {/* Deal Sốc Option */}
              <Link href="/deal-sock">
                <Button
                  type="text"
                  icon={<FireOutlined className="text-red-500" />}
                  className="flex items-center gap-3 px-3 py-3 hover:bg-gray-50 rounded-md transition-colors w-full justify-start h-auto"
                >
                  <span className="text-sm text-gray-700 font-medium">
                    Deal sốc
                  </span>
                </Button>
              </Link>

              <Link href="/xu-huong-tim-kiem">
                <Button
                  type="text"
                  icon={<SearchOutlined className="text-blue-500" />}
                  className="flex items-center gap-3 px-3 py-3 hover:bg-gray-50 rounded-md transition-colors w-full justify-start h-auto"
                >
                  <span className="text-sm text-gray-700 font-medium">
                    Xu hướng tìm kiếm
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Vertical Text Label */}
        {!isOpen && (
          <div className="mt-2 w-8 md:w-10 flex flex-col items-center">
            <Button
              type="default"
              onClick={() => setIsOpen(!isOpen)}
              className="text-[14px] p-2 md:text-[16px] md:p-4 bg-white border-gray-400 border-[1px] text-gray-600 font-medium tracking-wider transform -rotate-90 origin-center whitespace-nowrap cursor-pointer h-auto"
            >
              🔥 CHƯƠNG TRÌNH HOT
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
