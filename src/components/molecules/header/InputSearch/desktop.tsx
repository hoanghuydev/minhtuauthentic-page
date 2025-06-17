import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from 'react';
import { Button, Input, List, Skeleton } from 'antd/es';
import { twMerge } from 'tailwind-merge';
import { KEYCODE, SEARCH_KEYWORD } from '@/config/enum';
import { SearchData } from '@/config/type';
import appContext from '@/contexts/appContext';
import dynamic from 'next/dynamic';
import { useIsDesktop, useIsMobile } from '@/hooks/useDevice';
import { SettingsDto } from '@/dtos/Settings.dto';
import InputSearch from '@/components/molecules/header/InputSearch/input';
import searchContext from '@/contexts/searchContext';
import SearchContainer from '@/components/molecules/search/seachContainer';
type Props = {
  classname?: string;
  classNameInput?: string;
  isForMobile?: boolean;
  settings?: SettingsDto[];
};
export const InputSearchDesktop = ({ classname, isForMobile }: Props) => {
  const ctx = useContext(searchContext);
  const ref = useRef<HTMLDivElement | null>(null);
  const [ready, setReady] = useState<boolean>(false);
  const isDesktop = useIsDesktop();
  const isMobile = useIsMobile();
  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (
        ref.current &&
        !ref.current.contains(event.target) &&
        ctx?.setIsOpenSearch &&
        isDesktop
      ) {
        ctx.setIsOpenSearch(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);

  useEffect(() => {
    if (isMobile) {
      if (ctx?.isOpenSearch) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'auto';
      }
    }
  }, [ctx?.isOpenSearch]);

  useEffect(() => {
    const handleKeyUp = (e: KeyboardEvent) => {
      if (ctx?.isOpenSearch && ctx?.debounceValue && e.key === KEYCODE.ENTER) {
        ctx.saveKeyword && ctx.saveKeyword();
        ctx.setIsOpenSearch && ctx.setIsOpenSearch(false);
        window.location.href = `/san-pham?search=${ctx?.debounceValue}`;
      }
    };
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [ctx?.isOpenSearch, ctx?.debounceValue]);

  const renderContent = () => {
    return (
      <div className={twMerge('w-full relative z-[3]', classname)}>
        <InputSearch
          onChange={(value) => {
            ctx?.setSearchValue && ctx.setSearchValue(value);
          }}
          onCloseClick={() => {
            ctx?.saveKeyword && ctx.saveKeyword();
            ctx?.setIsOpenSearch && ctx.setIsOpenSearch(false);
          }}
          onClick={() => {
            ctx?.setIsOpenSearch && ctx.setIsOpenSearch(true);
          }}
        />
      </div>
    );
  };

  if (!isForMobile && isMobile) {
    return null;
  }

  return (
    <div className={'relative'}>
      {renderContent()}
      <div ref={ref}>
        <SearchContainer />
      </div>
    </div>
  );
};
export default InputSearchDesktop;
