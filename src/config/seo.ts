/**
 * SEO configuration
 * This file contains routes that should not be indexed by search engines
 *
 * Để thêm hoặc xóa route, chỉ cần chỉnh sửa trực tiếp các mảng bên dưới
 */

/**
 * Danh sách các route không cần index (noindex, follow)
 * Các route này sẽ được thêm thẻ meta noindex, follow
 */
export const NO_INDEX_ROUTES: string[] = [
  // Account related pages - Trang liên quan đến tài khoản
  '/tai-khoan/dang-nhap',
  '/tai-khoan/dang-ky',
  '/tai-khoan/quen-mat-khau',
  '/tai-khoan/thong-tin-tai-khoan',
  '/tai-khoan/lich-su',
  '/tai-khoan/lich-su/[id]',

  // Cart related pages - Trang liên quan đến giỏ hàng
  '/gio-hang',
  '/gio-hang/thanh-toan',
  '/gio-hang/thanh-cong',
];

/**
 * Danh sách các route chỉ cần canonical là URL gốc
 * Các route này sẽ có canonical URL là URL gốc (không bao gồm đường dẫn)
 */
export const BASE_CANONICAL_ROUTES: string[] = [
  // Thêm các route cần canonical URL là URL gốc ở đây
  // Ví dụ: các trang chiến dịch tạm thời, trang không cần coi là nội dung riêng biệt
  '/gio-hang/thanh-cong',
];

/**
 * Kiểm tra xem một route có nên noindex hay không
 * @param path - Đường dẫn hiện tại
 * @returns boolean
 */
export const shouldNoIndexRoute = (path: string): boolean => {
  // Kiểm tra khớp chính xác
  if (NO_INDEX_ROUTES.includes(path)) {
    return true;
  }

  // Kiểm tra route động
  return NO_INDEX_ROUTES.some((route: string) => {
    if (route.includes('[') && route.includes(']')) {
      const routePattern = route.replace(/\[([^\]]+)\]/g, '[^/]+');
      const regex = new RegExp(`^${routePattern}$`);
      return regex.test(path);
    }
    return false;
  });
};

/**
 * Kiểm tra xem một route có nên dùng canonical URL gốc hay không
 * @param path - Đường dẫn hiện tại
 * @returns boolean
 */
export const shouldUseBaseCanonical = (path: string): boolean => {
  // Kiểm tra khớp chính xác
  if (BASE_CANONICAL_ROUTES.includes(path)) {
    return true;
  }

  // Kiểm tra route động
  return BASE_CANONICAL_ROUTES.some((route: string) => {
    if (route.includes('[') && route.includes(']')) {
      const routePattern = route.replace(/\[([^\]]+)\]/g, '[^/]+');
      const regex = new RegExp(`^${routePattern}$`);
      return regex.test(path);
    }
    return false;
  });
};
