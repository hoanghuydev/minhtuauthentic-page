import {
  Entity,
  OrderStatus,
  PROMOTION_PRICE_TYPE,
  PROMOTION_TYPE,
} from '@/config/enum';
import { VariantDto } from '@/dtos/Variant.dto';
import { IVariantProductConfigurationValuesDto } from '@/dtos/iVariantProductConfigurationValues.dto';
import CouponsDto from '@/dtos/Coupons.dto';
import { PromotionsDto } from '@/dtos/Promotions.dto';

export function formatMoney(
  amount: number | string,
  decimalCount = 0,
  decimal = '.',
  thousands = ',',
) {
  try {
    decimalCount = Math.abs(decimalCount);
    decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

    const negativeSign = Number(amount) < 0 ? '-' : '';

    let i = parseInt(
      (amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)),
    ).toString();
    let j = i.length > 3 ? i.length % 3 : 0;

    return (
      negativeSign +
      (j ? i.substr(0, j) + thousands : '') +
      i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousands) +
      (decimalCount
        ? decimal +
          Math.abs(Number(amount) - Number(i))
            .toFixed(decimalCount)
            .slice(2)
        : '') +
      '₫'
    );
  } catch (e) {
    console.log(e);
  }
}
export const parseNameToField = (
  data: any,
  listField: string[],
  index: number,
): string => {
  try {
    if (!data) return '';
    const _data = data[listField[index]];
    if (index === listField.length - 1) {
      return _data;
    }
    return parseNameToField(_data, listField, index + 1);
  } catch (e) {
    throw e;
  }
};

export const getModelEntity = (model: string) => {
  switch (model) {
    case 'product':
    case 'products':
      return Entity.PRODUCTS;
    case 'news':
      return Entity.NEWS;
    case 'category-news':
      return Entity.CATEGORY_NEWS;
    case 'category':
    case 'categories':
      return Entity.CATEGORIES;
    case 'brand':
    case 'brands':
      return Entity.BRANDS;
    case 'keywords':
    case 'keyword':
      return Entity.KEYWORDS;
  }
};

export const generateSlugToHref = (slug?: string) => {
  if (!slug || slug === '/') return '/';
  if (slug.charAt(0) !== '/') {
    if (slug.startsWith('http') || slug.startsWith('https')) {
      return slug;
    }
    return `/${slug}`;
  }
  return slug.trim();
};

export function truncateString(str: string, num: number) {
  if (str?.length && str?.length > num) {
    return str.slice(0, num) + '...';
  } else {
    return str;
  }
}

export function isValidHttpUrl(string: string) {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === 'http:' || url.protocol === 'https:';
}

export function getPriceWithCoupon(
  price: number,
  coupons: CouponsDto | CouponsDto[],
) {
  if (!Array.isArray(coupons)) {
    coupons = [coupons];
  }
  coupons.map((coupon) => {
    price = price - calculatePriceMinus(price, coupon);
  });
  return price;
}

export function calculatePriceMinus(price: number, coupon?: CouponsDto) {
  let priceMinus = 0;

  if (!coupon) return priceMinus;
  if (coupon.price_minus_type === PROMOTION_PRICE_TYPE.PRICE) {
    priceMinus = coupon.price_minus_value || 0;
  } else {
    priceMinus = (price * (coupon?.price_minus_value || 0)) / 100;
  }
  return priceMinus;
}

export function calculatePricePercent(variant: VariantDto | undefined) {
  if (!variant) return 0;
  return Math.round(
    (((variant?.price || 0) - (variant?.regular_price || 0)) /
      (variant?.price || 1)) *
      100,
  );
}

export function SexName(sex: number) {
  switch (sex) {
    case 0:
      return 'Nữ';
    case 1:
      return 'Nam';
    case 2:
      return 'Unisex';
  }
}

export function parseQueryString(queryString: string) {
  // Decode the query string
  const decodedString = decodeURIComponent(queryString);

  // Split the query string into individual key-value pairs
  const pairs = decodedString.split('&');

  // Initialize the result object
  const result: any = {};

  pairs.forEach((pair) => {
    // Split each pair into key and value
    const [key, value] = pair.split('=');

    // Extract the main key and index from the query key
    const match = key.match(/filter\[(.*?)\]\[(\d+)\]/);

    if (match) {
      const mainKey = match[1];
      const index = match[2];

      // Initialize the array if it doesn't exist
      if (!result[mainKey]) {
        result[mainKey] = [];
      }

      // Assign the value to the correct index
      result[mainKey][index] = value;
    }
  });

  return result;
}

export function variantName(
  variant_product_configuration_values?: IVariantProductConfigurationValuesDto[],
) {
  if (!variant_product_configuration_values) return '';
  let str = '';
  variant_product_configuration_values.map((item) => {
    str += `(${item?.product_configuration_value?.product_configuration?.name}: ${item?.product_configuration_value?.value}) `;
  });
  return str.trim();
}

export function getCookie(
  name: string,
  cookie: string,
  toObject: boolean = false,
) {
  if (toObject) {
    const rs = cookie.split(';').reduce((cookieObject: any, cookieString) => {
      let splitCookie: any = cookieString.split('=');
      try {
        cookieObject[splitCookie[0].trim()] = decodeURIComponent(
          splitCookie[1],
        );
      } catch (error) {
        cookieObject[splitCookie[0].trim()] = splitCookie[1];
      }
      return cookieObject;
    }, []);
    return rs ? rs[name] : null;
  }
  const value = `; ${cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return (parts.pop() || '').split(';').shift();
}

export function promotionName(promotion?: PromotionsDto) {
  if (!promotion) return '';
  if (promotion.name) {
    return promotion.name;
  }
  switch (promotion.type) {
    case PROMOTION_TYPE.DEAL_SOCK:
      return 'Giá mua kèm';
    case PROMOTION_TYPE.FLASH_SALE:
      return 'Flash Sale';
  }
}

export function groupBy<T, K>(
  array: T[],
  keySelector: (item: T) => K,
): Map<K, T[]> {
  return array.reduce((map, item) => {
    const key = keySelector(item);
    const group = map.get(key);
    if (group) {
      group.push(item);
    } else {
      map.set(key, [item]);
    }
    return map;
  }, new Map<K, T[]>());
}

export function getTitleNews(content: string) {
  const match = content.match(/<h1.*?>(.*?)<\/h1>/);
  if (match) {
    const text = match[1].replace(/<[^>]*>/g, '');
    return text;
  }
  return '';
}

export const validateGoogleRecaptcha = async (body: any) => {
  if (typeof body === 'string') {
    body = JSON.parse(body);
  }
  return fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `secret=${process.env.GOOGLE_SECRET_KEY}&response=${body.token}`,
  })
    .then((reCaptchaRes) => reCaptchaRes.json())
    .then((reCaptchaRes) => {
      return reCaptchaRes?.score > 0.5;
    })
    .catch((err) => {
      return false;
    });
};

export function statusOrder(status?: string) {
  switch (status) {
    case OrderStatus.NEW:
      return 'Đơn mới';
    case OrderStatus.APPROVED:
      return 'Đã xác nhận';
    case OrderStatus.PROCESSING:
      return 'Đang tiến hành';
    case OrderStatus.DONE:
      return 'Đã hoàn thành';
    case OrderStatus.CLOSE:
      return 'Đã Hủy';
    default:
      return '';
  }
}

export function getFilterFromQuery(queryString: string) {
  queryString = queryString.replaceAll('%5B', '[').replaceAll('%5D', ']');
  const result: Record<string, any[]> = {};

  const pairs = queryString.match(/([^&]+)=([^&]*)/g);
  if (!pairs) return result;

  pairs.forEach((pair) => {
    const [key, value] = pair.split('=');

    // Kiểm tra nếu key có dạng mảng (filter[categories][])
    const matchArray = key.match(/^filter\[([^\]]+)\]\[(\d+)\]$/);
    if (matchArray) {
      const arrayKey = matchArray[1];
      if (!result[arrayKey]) result[arrayKey] = [];
      decodeURIComponent(value)
        .split(',')
        .forEach((item) => {
          result[arrayKey].push(item);
        });
    }
  });
  return result;
}

export function removeVietnameseAccents(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/[^\w\s]/g, '');
}
