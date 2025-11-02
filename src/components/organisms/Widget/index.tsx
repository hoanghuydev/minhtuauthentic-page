import { useState, useEffect } from 'react';
import { twMerge } from 'tailwind-merge';
import { useIsMobile } from '@/hooks/useDevice';
import Image from 'next/image';
import SocialsList from './SocialsList';
import HotProgramsList from './HotProgramsList';
import supportMenu from '@/static/images/support_menu_icon.png';
import FireFlame from '@/components/icons/fire-flame';

type WidgetType = 'socials' | 'hotPrograms' | null;

export default function Widget() {
  const isMobile = useIsMobile();
  const [activeWidget, setActiveWidget] = useState<WidgetType>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

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

  const toggleWidget = (widget: WidgetType) => {
    setActiveWidget(activeWidget === widget ? null : widget);
  };

  return (
    <>
      {activeWidget && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setActiveWidget(null)}
        />
      )}

      <div
        className={twMerge(
          'fixed right-8 bottom-[155px] z-50 flex flex-col gap-3 items-end',
          isMobile ? 'right-4' : 'right-8',
        )}
      >
        {activeWidget === 'hotPrograms' && <HotProgramsList />}

        {activeWidget === 'socials' && <SocialsList />}

        {isMobile && (
          <HotProgramsButton
            isActive={activeWidget === 'hotPrograms'}
            onClick={() => toggleWidget('hotPrograms')}
          />
        )}

        <SocialsButton
          isActive={activeWidget === 'socials'}
          onClick={() => toggleWidget('socials')}
        />
      </div>

      <div
        className={twMerge(
          'fixed bottom-24 mb-2 z-50 flex flex-col gap-3 items-end',
          isMobile ? 'right-4' : 'right-8',
        )}
      >
        {showBackToTop && (
          <button
            onClick={scrollToTop}
            className="w-[48px] h-[48px] bg-primary rounded-full flex flex-col items-center justify-center text-white mt-3 z-50"
            aria-label="Back to top"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-[14px] w-[22px]"
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
            <span className="text-xs">Lên đầu</span>
          </button>
        )}
      </div>
    </>
  );
}

function HotProgramsButton({
  isActive,
  onClick,
}: {
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="relative w-[48px] h-[48px] bg-transparent select-none overflow-visible rounded-full flex items-center justify-center"
      aria-label="Chương trình Hot"
    >
      <span
        className="
          absolute z-0
          inset-[5px]
          rounded-full bg-red-500/40
          animate-[ping_1.1s_cubic-bezier(0.8,0,0.8,1)_infinite]
          pointer-events-none
        "
      />

      <div className="relative w-[48px] h-[48px] bg-red-500 rounded-full flex flex-col items-center justify-center text-white shadow-lg">
        <span className="text-[8px] font-bold leading-none">HOT</span>
        <span className="text-[8px] font-bold leading-none">SALE</span>
      </div>
    </button>
  );
}

// Socials Button (existing design)
function SocialsButton({
  isActive,
  onClick,
}: {
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-[48px] h-[48px] bg-transparent select-none overflow-hidden rounded-full flex items-center justify-center text-white"
      aria-label="Mạng xã hội"
    >
      <Image
        src={supportMenu}
        alt="Hỗ trợ"
        className="w-[48px] h-[48px] bg-white rounded-full"
        width={48}
        height={48}
        unoptimized
      />
    </button>
  );
}
