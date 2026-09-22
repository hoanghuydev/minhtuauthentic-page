import { createContext, useContext } from 'react';
import CommonSettingDto from '@/dtos/CommonSetting.dto';

/**
 * Giá trị `commonSettings` đọc được ngay trên server, dùng làm giá trị khởi tạo
 * cho các hook chạy trước khi `/api/settings` về. Mục đích là để giá trị KHÔNG
 * đổi giữa SSR và lần render client đầu tiên.
 */
const SsrCommonSettingsContext = createContext<CommonSettingDto | undefined>(
  undefined,
);

export const SsrCommonSettingsProvider = SsrCommonSettingsContext.Provider;

export function useSsrCommonSettings(): CommonSettingDto | undefined {
  return useContext(SsrCommonSettingsContext);
}
