import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { UserDto } from '@/dtos/User.dto';
import { MenuDisplay } from '@/config/type';
import { useRouter } from 'next/router';
import Loading from '@/components/atoms/loading';
export type TypeAppState = {
  isOpenMenu: boolean;
  setIsOpenMenu: Dispatch<SetStateAction<boolean>> | undefined;

  isOpenPopupProduct: string | null;
  setIsOpenPopupProduct: Dispatch<SetStateAction<string | null>> | undefined;
  isOpenNavMenu: boolean;
  setIsOpenNavMenu: Dispatch<SetStateAction<boolean>> | undefined;
  settings?: Record<string, string>;
  setSettings?: Dispatch<SetStateAction<Record<string, string>>> | undefined;
  user?: UserDto;
  setUser?: Dispatch<SetStateAction<UserDto | undefined>> | undefined;
};

const AppContext = createContext<TypeAppState | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpenPopupProduct, setIsOpenPopupProduct] = useState<string | null>(
    null,
  );
  const [isOpenMenu, setIsOpenMenu] = useState(false);

  const [user, setUser] = useState<UserDto | undefined>();
  const [isOpenNavMenu, setIsOpenNavMenu] = useState(false);
  const [settings, setSettings] = useState({});
  const router = useRouter();
  useEffect(() => {
    const handleRouteComplete = () => {
      setIsOpenNavMenu(false);
      setIsOpenMenu(false);
      setIsOpenPopupProduct(null);
    };
    router.events.on('routeChangeComplete', handleRouteComplete);
    return () => {
      router.events.on('routeChangeComplete', handleRouteComplete);
    };
  }, [router]);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        isOpenPopupProduct,
        setIsOpenPopupProduct,
        isOpenNavMenu,
        setIsOpenNavMenu,
        isOpenMenu,
        setIsOpenMenu,
        settings,
        setSettings,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
