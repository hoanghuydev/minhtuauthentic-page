export enum CONTROLLER_GROUP {
  PRICE = 'price',
}
export enum SUBMIT_TYPE {
  STAY = 'stay',
  BACK = 'back',
}
export const enum KEYCODE {
  ENTER = 'Enter',
}
export const MOBILE_BREAKPOINT = 768;

export enum FIELD_TYPE {
  SORT = 'sort',
  STRING = 'string',
  TREE_STRING = 'tree-string',
  BOOLEAN = 'boolean',
  SELECT_MULTIPLE = 'select-multiple',
  SELECT = 'select',
  NUMBER = 'number',
  PRICE = 'price',
  IMAGE = 'image',
  SLUG = 'slug',
  TEXT_EDITOR = 'text-editor',
  TEXT_AREA = 'text-area',
  JSON = 'json',
  COLOR = 'color',
  RADIO = 'radio',
  GROUP = 'group',
  CONTROLLER_GROUP = 'controller-group',
  TAG_LINK = 'tag_link',
  VARIANT = 'variant',
  SEO = 'seo',
  STATIC_DESCRIPTION = 'static-description',
  SETTING = 'setting',
}
export enum Entity {
  PRODUCTS = 'ProductsEntity',
  SLUGS = 'SlugsEntity',
  VARIANTS = 'VariantsEntity',
  NEWS = 'NewsEntity',
  KEYWORDS = 'KeywordEntity',
  CATEGORIES = 'CategoriesEntity',
  CATEGORY_NEWS = 'CategoryNewsEntity',
  BRANDS = 'BrandsEntity',
  IPRODUCTCATEGORIES = 'IProductCategoriesEntity',
  INEWSCATEGORIES = 'INewsCategoriesEntity',
  IPRODUCTBRANDS = 'IProductBrandsEntity',
}
export enum STATIC_COMPONENT_TYPE {
  CATEGORY = 'home-category',
  MENU_CATEGORY = 'home-menu-category',
  SOCIALS = 'home-socials',
}

export enum STATIC_CONTENT_TYPE {
  FOOTER = 'footer',
  FOOTER_LOGO_PAYMENT = 'footer-logo-payment',
  FOOTER_LOGO_SOCIAL = 'footer-logo-social',
  BANNER = 'banner',
  BANNER_ABOVE = 'banner-above',
  BANNER_BELOW = 'banner-below',
  BLOCK_UNDER_SLIDE = 'home-block-under-slide',
  BLOCK_UNDER_CATEGORY = 'banner-under-category',
  BANNER_FULL_WIDTH = 'banner-full-width',
  FEATURE_CATEGORY = 'home-feature-category',
  FOOTER_PRIVACY_POLICY = 'footer-privacy-policy',
}

export enum PRODUCT_CONFIGURATIONS {
  PRODUCT_CONFIGURATIONS = 'product-configurations',
  PRODUCT_CONFIGURATION_VALUES = 'product-configuration-values',
}
export enum BLOCK_UNDER_CATEGORY_POSITION {
  LEFT = 'trái',
  RIGHT = 'phải',
}
export enum POSITION {
  LEFT = 'left',
  RIGHT = 'right',
}
export enum SETTING_TYPE {
  HOME = 'home',
  GENERAL = 'general',
}
export const SETTING_KEY = {
  GENERAL: {
    PRIMARY_COLOR: {
      KEY: 'primary_color',
      LABEL: 'Màu chủ đạo',
    },
    FOOTER_COLOR: {
      KEY: 'footer_color',
      LABEL: 'Màu chân trang',
    },
    PAGE_INFORMATION: {
      KEY: 'page_information',
      LABEL: 'Thông tin trang',
    },
    PAGE_HEADER: {
      KEY: 'page_header',
      LABEL: 'Header Page',
      PAGE_TITLE_LEFT: 'page_title_left',
      PAGE_TITLE_RIGHT: 'page_title_right',
      PAGE_TITLE_CENTER: 'page_title_center',
    },
    LOGO: {
      KEY: 'logo',
      LABEL: 'Logo',
    },
  },
  BANNER_SECTION: {
    KEY: 'banner_section',
    LABEL: 'Vùng banner',
  },
  BRAND_SECTION: {
    KEY: 'brand_section',
    LABEL: 'Vùng thương hiệu nổi bật',
  },
  NEWS_SECTION: {
    KEY: 'news_section',
    LABEL: 'Vùng tin tức',
  },
  FLASH_SALE_SECTION: {
    KEY: 'flash_sale',
    LABEL: 'Vùng Flash Sale',
  },
  FEATURE_CATEGORY: {
    KEY: 'feature_category',
    LABEL: 'Danh mục nổi bật',
  },
  PRODUCT_DETAIL_OFFER_SPECIAL_CONTENT: {
    KEY: 'product_detail_offer_special_content',
    LABEL: 'Nội dung ưu đãi đặc biệt',
  },
  PRODUCT_DETAIL_HOW_TO_BUY: {
    KEY: 'product_detail_how_to_buy',
    LABEL: 'Hướng dẫn mua hàng và thanh toán',
  },
  PRODUCT_DETAIL_GUARANTEE: {
    KEY: 'product_detail_guarantee',
    LABEL: 'Chính sách đổi trả và bảo hành',
  },
  DEAL_SOCK_SECTION: {
    KEY: 'dealsock_section',
    LABEL: 'Vùng Deal Sock',
  },
};

export const CATEGORY_FILTER = {
  SORT_BY: {
    DATE_DESC: 'date_desc',
    DATE_ASC: 'date_asc',
    NAME_ASC: 'name_asc',
    NAME_DESC: 'name_desc',
    PRICE_ASC: 'price_asc',
    PRICE_DESC: 'price_desc',
  },
};
export enum PROVINCE {
  DISTRICT = 'district',
  WARD = 'ward',
}

export enum PROMOTION_TYPE {
  FLASH_SALE = 'flash-sale',
  DEAL_SOCK = 'deal-sock',
}

export enum PROMOTION_PRICE_TYPE {
  PERCENT = 'percent',
  PRICE = 'price',
}

export const ORDER_STATUS = {
  PROCESSING: 'processing',
  PENDING: 'pending',
  DONE: 'done',
  NEW: 'new',
  CLOSE: 'close',
};

export const PAYMENT = {
  COD: 'cod',
  MOMO: 'momo',
  VN_PAY: 'vnpay',
  BAO_KIM: 'baokim',
  CK: 'ck',
  FUDIIN: 'fudiin',
};

export const PAYMENT_TYPE_ID = {
  TRA_GOP_BAO_KIM: 339,
  TRA_GOP_BAO_KIM_CREDIT_CARD: 296,
};

export enum OrderStatus {
  APPROVED = 'approved',
  PROCESSING = 'processing',
  DONE = 'done',
  NEW = 'new',
  CLOSE = 'close',
}

export const SEARCH_KEYWORD = 'search-keyword';
