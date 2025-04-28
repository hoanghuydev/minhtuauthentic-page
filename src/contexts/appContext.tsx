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
import { VariantDto } from '@/dtos/Variant.dto';

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
  showProductFooter: boolean;
  setShowProductFooter: Dispatch<SetStateAction<boolean>> | undefined;
  currentVariant?: VariantDto | null;
  setCurrentVariant: Dispatch<SetStateAction<VariantDto | null>> | undefined;
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
  const [showProductFooter, setShowProductFooter] = useState(false);
  const [currentVariant, setCurrentVariant] = useState<VariantDto | null>(null);

  const router = useRouter();
  useEffect(() => {
    const handleRouteComplete = () => {
      setIsOpenNavMenu(false);
      setIsOpenMenu(false);
      setIsOpenPopupProduct(null);
      setShowProductFooter(false);
      setCurrentVariant(null);
    };
    router.events.on('routeChangeComplete', handleRouteComplete);
    return () => {
      router.events.off('routeChangeComplete', handleRouteComplete);
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
        showProductFooter,
        setShowProductFooter,
        currentVariant,
        setCurrentVariant,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
