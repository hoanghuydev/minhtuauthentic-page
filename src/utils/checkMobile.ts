import { isMobile as detectMobile } from 'react-device-detect';

export const checkMobile = () => {
  return detectMobile;
};
