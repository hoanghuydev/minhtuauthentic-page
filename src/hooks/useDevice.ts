import { useMediaQuery } from 'react-responsive';
import { MOBILE_BREAKPOINT } from '../config/enum';

export const useIsMobile = () => useMediaQuery({ maxWidth: MOBILE_BREAKPOINT });
export const useIsDesktop = () =>
  useMediaQuery({ minWidth: MOBILE_BREAKPOINT });
