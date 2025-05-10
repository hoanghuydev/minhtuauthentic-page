import { twMerge } from 'tailwind-merge';
import {
  BLOCK_UNDER_CATEGORY_POSITION,
  STATIC_COMPONENT_TYPE,
} from '@/config/enum';
import Link from 'next/link';
import ImageWithFallback from '@/components/atoms/images/ImageWithFallback';
import { StaticContentsDto } from '@/dtos/StaticContents.dto';
import useSWR from 'swr';
import { useEffect, useState } from 'react';
import supportMenu from '@/static/images/support_menu_icon.png';
import Image from 'next/image';

const fetcher = () =>
  fetch('/api/static-contents/' + STATIC_COMPONENT_TYPE.SOCIALS, {
    method: 'GET',
  }).then((res) => res.json());

export default function Socials() {
  const { data, error } = useSWR(
    '/api/static-contents/' + STATIC_COMPONENT_TYPE.SOCIALS,
    fetcher,
  );
  const [display, setDisplay] = useState<StaticContentsDto[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    if (data) {
      const socials = data?.data as StaticContentsDto[];
      setDisplay(socials || []);
    }
  }, [data]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Main social media toggle button */}
      <div
        className="fixed right-8 bottom-40 z-50 flex flex-col gap-3 items-end"
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* Social media list */}
        {isOpen && (
          <div className="mb-3 flex flex-col gap-3">
            {display.map((social, index) => (
              <div
                key={index + '-social'}
                className="flex items-center group bg-primary text-white rounded-full justify-between"
              >
                <Link
                  href={social?.properties?.url?.trim() || '/'}
                  className="py-2 pr-[10px] pl-3  flex items-center"
                >
                  {social?.title || 'Follow us'}
                </Link>
                <div className="z-[2]">
                  <Link href={social?.properties?.url?.trim() || '/'}>
                    <ImageWithFallback
                      className="w-[42px] h-[42px] object-contain rounded-full"
                      image={social?.images?.[0]?.image}
                    />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Toggle button */}
        <button
          className="w-[42px] h-[42px] bg-transparent select-none overflow-hidden rounded-full flex items-center justify-center text-white"
          aria-label="Nút đóng mở menu hỗ trợ"
        >
          {/* Temporary icon (can be replaced later) */}
          <Image
            src={supportMenu}
            alt="Hỗ trợ"
            className="w-[42px] h-[42px] bg-white"
          />
        </button>
      </div>
      <div className="fixed right-8 bottom-24 mb-2 z-50 flex flex-col gap-3 items-end">
        {/* Back to top button */}
        {showBackToTop && (
          <button
            onClick={scrollToTop}
            className="w-[42px] h-[42px] bg-primary rounded-full flex items-center justify-center text-white mt-3 z-50"
            aria-label="Back to top"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 15l7-7 7 7"
              />
            </svg>
          </button>
        )}
      </div>
    </>
  );
}
