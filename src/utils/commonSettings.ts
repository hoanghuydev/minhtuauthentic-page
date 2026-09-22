import CommonSettingDto from '@/dtos/CommonSetting.dto';
import { SettingsDto } from '@/dtos/Settings.dto';
import { SETTING_KEY } from '@/config/enum';

const BE_URL = process.env.BE_URL || 'http://localhost:3002';
const CACHE_TTL = 60 * 1000;

let cache: { data: CommonSettingDto; expiresAt: number } | null = null;
let inflight: Promise<CommonSettingDto> | null = null;

/**
 * Dùng chung với `pages/api/settings/index.ts`. Hai bản sao sẽ phân kỳ khi thêm
 * key mới, mà lệch giữa SSR và client thì đúng là lỗi mà file này sinh ra để
 * sửa.
 */
export function parseCommonSettings(
  settings: SettingsDto[] = [],
): CommonSettingDto {
  const common = new CommonSettingDto();
  settings.forEach((setting) => {
    switch (setting.key) {
      case SETTING_KEY.GENERAL.PRIMARY_COLOR.KEY:
        common.primaryColor = setting.value?.backgroundColor;
        break;
      case SETTING_KEY.GENERAL.EVENT_BUTTON_TITLE.KEY:
        common.eventButtonTitle = setting.value?.title;
        break;
      case SETTING_KEY.GENERAL.SWIPER_SPEED.KEY:
        common.swiperSpeed = setting.value?.speed;
        break;
      case SETTING_KEY.GENERAL.FREE_SHIPPING.KEY:
        common.freeShippingMinOrderPrice = setting.value?.min_order_price;
        break;
    }
  });
  return common;
}

/**
 * Đọc `commonSettings` ngay trên server để HTML đầu tiên đã mang đúng giá trị.
 *
 * Trước đây chúng chỉ về qua `/api/settings` sau hydrate, kéo theo hai chi phí:
 * `--primary-color` đổi ⇒ recalc style toàn bộ cây (~8.000 element) cộng một
 * thay đổi hình ảnh muộn mà Speed Index tính là chậm; và `swiperSpeed` nhảy
 * 1500 → 1600 ⇒ prop `speed` đổi ⇒ `useMemo` trong sectionSwiper dựng lại toàn
 * bộ cây Swiper, tức vài trăm ProductCard render lại.
 *
 * Endpoint này nhỏ (~3.6KB) nên SSR nó rẻ; cache 60s + gộp request đang bay để
 * không thêm một lượt gọi BE cho mỗi request trang.
 */
export async function getCommonSettings(): Promise<CommonSettingDto> {
  if (typeof window !== 'undefined') {
    return new CommonSettingDto();
  }

  if (cache && cache.expiresAt > Date.now()) {
    return cache.data;
  }
  if (inflight) {
    return inflight;
  }

  inflight = fetch(`${BE_URL}/api/pages/settings`)
    .then((res) => {
      // BE lỗi vẫn trả JSON hợp lệ; không chặn ở đây thì DTO rỗng bị cache 60s
      // và màu chủ đạo rơi về mặc định suốt một phút.
      if (!res.ok) {
        throw new Error(`BE trả ${res.status} cho /api/pages/settings`);
      }
      return res.json();
    })
    .then((result) => {
      const data = parseCommonSettings(result?.data || []);
      cache = { data, expiresAt: Date.now() + CACHE_TTL };
      return data;
    })
    .catch((error) => {
      console.error('[SSR] Failed to fetch common settings:', error);
      // Giữ bản cũ khi BE lỗi để màu chủ đạo không nhảy về mặc định.
      return cache?.data || new CommonSettingDto();
    })
    .finally(() => {
      inflight = null;
    });

  return inflight;
}
