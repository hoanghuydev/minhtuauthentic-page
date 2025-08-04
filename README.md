# MinhTu Authentic - Customer Website

## 📋 Mục lục

- [Tổng quan dự án](#tổng-quan-dự-án)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [Kiến trúc hệ thống](#kiến-trúc-hệ-thống)
- [Flow hoạt động](#flow-hoạt-động)
- [Hướng dẫn phát triển](#hướng-dẫn-phát-triển)
- [API Integration](#api-integration)
- [Context & State Management](#context--state-management)
- [SEO & Performance](#seo--performance)
- [Responsive Design](#responsive-design)
- [Thiết lập và chạy dự án](#thiết-lập-và-chạy-dự-án)

## 🎯 Tổng quan dự án

**MinhTu Authentic Customer Website** là trang web bán hàng dành cho khách hàng cuối của hệ thống bán nước hoa authentic. Được xây dựng với Next.js 15 và áp dụng kiến trúc Atomic Design, website cung cấp trải nghiệm mua sắm hoàn chỉnh cho:

- 🛍️ **Mua sắm sản phẩm**: Tìm kiếm, lọc, xem chi tiết sản phẩm
- 🛒 **Giỏ hàng & Thanh toán**: Quản lý giỏ hàng, checkout với nhiều phương thức thanh toán
- 👤 **Tài khoản khách hàng**: Đăng ký, đăng nhập, quản lý thông tin cá nhân
- 📱 **Responsive Design**: Tối ưu cho cả desktop và mobile
- 📊 **SEO Optimized**: Tối ưu SEO và performance
- 🎨 **Dynamic Content**: Nội dung động từ CMS admin

## 🛠️ Công nghệ sử dụng

### Frontend Framework

- **Next.js 15.3.1** - React framework với Pages Router
- **React 19.0.0** - UI library
- **TypeScript 5** - Type-safe development
- **Tailwind CSS 3.4.1** - Utility-first CSS framework

### UI Components & Styling

- **Ant Design 5.24.6** - UI component library
- **Swiper 11.1.2** - Touch slider cho carousel
- **React Lazy Load Image Component 1.6.3** - Lazy loading images
- **React Responsive 10.0.1** - Responsive utilities

### State Management & Data Fetching

- **SWR 2.2.5** - Data fetching và caching
- **React Context** - State management
- **React Hook Form 7.51.5** - Form handling

### SEO & Analytics

- **Next SEO 6.5.0** - SEO optimization
- **Google Analytics** - Web analytics
- **Structured Data** - Schema.org markup

### Payment & Security

- **React Google reCAPTCHA v3 1.10.1** - Security
- **JsonWebToken 9.0.2** - Authentication
- **Multiple payment gateways** - VNPay, BaoKim, Fudiin

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky 9.1.7** - Git hooks
- **Lint-staged 15.5.0** - Pre-commit hooks

## 🏗️ Cấu trúc dự án

```
src/
├── 📁 pages/                        # Pages Router (Next.js)
│   ├── index.tsx                    # Trang chủ
│   ├── [...slug].tsx                # Dynamic routing cho tất cả pages
│   ├── _app.tsx                     # App wrapper
│   ├── _document.tsx                # HTML document
│   ├── 📁 tai-khoan/                # Tài khoản khách hàng
│   │   ├── dang-nhap.tsx            # Đăng nhập
│   │   ├── dang-ky.tsx              # Đăng ký
│   │   ├── thong-tin.tsx            # Thông tin cá nhân
│   │   └── don-hang.tsx             # Lịch sử đơn hàng
│   ├── 📁 gio-hang/                 # Giỏ hàng & Checkout
│   │   ├── index.tsx                # Giỏ hàng
│   │   └── thanh-toan.tsx           # Thanh toán
│   ├── 📁 tin-tuc/                  # Tin tức & Blog
│   ├── 📁 api/                      # API routes
│   │   ├── 📁 product/              # API sản phẩm
│   │   ├── 📁 user/                 # API người dùng
│   │   ├── 📁 orders/               # API đơn hàng
│   │   └── ...                      # Các API khác
│   ├── san-pham.tsx                 # Trang sản phẩm
│   ├── thuong-hieu.tsx              # Trang thương hiệu
│   └── kiem-tra-don-hang.tsx        # Kiểm tra đơn hàng
├── 📁 components/                   # Atomic Design components
│   ├── 📁 atoms/                    # Thành phần nhỏ nhất
│   │   ├── 📁 product/              # Product-related atoms
│   │   ├── 📁 forms/                # Form components
│   │   ├── 📁 images/               # Image components
│   │   └── ...                      # Các atoms khác
│   ├── 📁 molecules/                # Tổ hợp atoms
│   │   ├── 📁 product/              # Product molecules
│   │   ├── 📁 cart/                 # Cart molecules
│   │   ├── 📁 search/               # Search molecules
│   │   └── ...                      # Các molecules khác
│   ├── 📁 organisms/                # Tổ hợp molecules
│   │   ├── 📁 header/               # Header organism
│   │   ├── 📁 footer/               # Footer organism
│   │   ├── 📁 product/              # Product organisms
│   │   ├── 📁 home/                 # Homepage organisms
│   │   ├── 📁 checkout/             # Checkout organisms
│   │   └── ...                      # Các organisms khác
│   └── 📁 templates/                # Page templates
│       ├── Layout.tsx               # Main layout
│       ├── ProductTemplate.tsx      # Product detail template
│       ├── CategoryTemplate.tsx     # Category listing template
│       ├── CheckoutTemplate.tsx     # Checkout template
│       └── ...                      # Các templates khác
├── 📁 contexts/                     # React Context providers
│   ├── appContext.tsx               # Global app state
│   ├── orderContext.tsx             # Order/cart state
│   ├── searchContext.tsx            # Search state
│   └── categoryFilterContext.tsx    # Category filter state
├── 📁 hooks/                        # Custom React hooks
│   ├── useSettings.tsx              # Settings hook
│   ├── useUser.tsx                  # User authentication hook
│   ├── useDevice.ts                 # Device detection hook
│   └── useMenu.tsx                  # Navigation menu hook
├── 📁 utils/                        # Utility functions
│   ├── index.ts                     # General utilities
│   ├── api.ts                       # API utilities
│   ├── format.ts                    # Formatting functions
│   └── gtag.ts                      # Google Analytics
├── 📁 dtos/                         # Data Transfer Objects
├── 📁 config/                       # Configuration files
│   ├── enum.ts                      # Enums & constants
│   ├── type.ts                      # TypeScript types
│   └── seo.ts                       # SEO configuration
├── 📁 styles/                       # Global styles
│   ├── globals.css                  # Global CSS
│   ├── swiper-custom.css            # Swiper customization
│   └── bk.css                       # Additional styles
├── 📁 static/                       # Static assets
└── middleware.ts                    # Next.js middleware
```

## 🏛️ Kiến trúc hệ thống

### 1. **Pages Router Architecture**

Dự án sử dụng Next.js Pages Router với file-based routing:

- **Static Pages**: Trang chủ, trang sản phẩm, thương hiệu
- **Dynamic Routes**: `[...slug].tsx` xử lý tất cả dynamic pages
- **API Routes**: RESTful API endpoints trong `/pages/api/`
- **Special Pages**: `_app.tsx`, `_document.tsx` cho global setup

### 2. **Atomic Design Pattern**

Components được tổ chức theo Atomic Design:

- **Atoms**: Button, Input, Image, Price, Loading
- **Molecules**: ProductCard, SearchBox, Breadcrumb, CartItem
- **Organisms**: Header, Footer, ProductList, Checkout, HomeBanner
- **Templates**: Layout, ProductTemplate, CategoryTemplate
- **Pages**: Các page components trong `/pages/`

### 3. **State Management Strategy**

- **React Context**: Global state (app, order, search, filter)
- **SWR**: Server state caching và data fetching
- **Local State**: Component-specific state với useState
- **Form State**: React Hook Form cho form handling

### 4. **Responsive Design System**

- **Mobile-first approach**: Thiết kế từ mobile lên desktop
- **Breakpoint system**: sm, md, lg, xl, 2xl
- **Dynamic imports**: Lazy load components cho mobile/desktop
- **Touch-friendly**: Optimized cho mobile touch

## 🔄 Flow hoạt động

### 1. **Page Rendering Flow**

```
1. Next.js Router → Page component
2. getStaticProps/getServerSideProps → Fetch data từ backend
3. Page render với data → SEO metadata injection
4. Client hydration → Interactive features
5. SWR revalidation → Fresh data updates
```

### 2. **Product Discovery Flow**

```
1. Homepage → Featured categories/products
2. Category/Brand pages → Product listing với filters
3. Search → Real-time search results
4. Product detail → Variant selection
5. Add to cart → Cart management
```

### 3. **Checkout Flow**

```
1. Cart review → Item management
2. User authentication → Login/Register
3. Shipping info → Address selection
4. Payment method → Multiple gateways
5. Order confirmation → Success/tracking
```

### 4. **Authentication Flow**

```
1. Login/Register form → Validation
2. API call → Backend authentication
3. JWT token → Cookie storage
4. User context → Global state update
5. Protected routes → Middleware check
```

## 🛠️ Hướng dẫn phát triển

### 1. **Thêm Page Mới**

#### Static Page:

```tsx
// src/pages/new-page.tsx
import Header from '@/components/organisms/header';
import Footer from '@/components/organisms/footer';
import Layout from '@/components/templates/Layout';
import { PageSetting } from '@/config/type';

export async function getStaticProps() {
  // Fetch data nếu cần
  return {
    props: {
      // data
    },
    revalidate: 300, // ISR revalidation
  };
}

export default function NewPage({
  settings,
  menu,
  footerContent,
}: PageSetting) {
  return (
    <>
      <Header settings={settings} menu={menu} />
      <Layout settings={settings} menu={menu}>
        <h1>New Page Content</h1>
        {/* Page content */}
      </Layout>
      <Footer settings={settings} footerContent={footerContent} />
    </>
  );
}
```

#### Dynamic Page (sử dụng [...slug].tsx):

```tsx
// Trong src/pages/[...slug].tsx, thêm case mới:
case Entity.NEW_ENTITY:
  return <NewTemplate data={slug?.data as NewDataType} />;
```

### 2. **Tạo Component Mới**

#### Atom Example:

```tsx
// src/components/atoms/customButton/index.tsx
import { ButtonHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

interface CustomButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export default function CustomButton({
  variant = 'primary',
  size = 'md',
  loading = false,
  className,
  children,
  disabled,
  ...props
}: CustomButtonProps) {
  const baseClasses = 'font-semibold rounded-lg transition-colors duration-200';
  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary/90',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    outline:
      'border-2 border-primary text-primary hover:bg-primary hover:text-white',
  };
  const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={twMerge(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        loading && 'opacity-50 cursor-not-allowed',
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
}
```

#### Molecule Example:

```tsx
// src/components/molecules/productCard/index.tsx
import Image from 'next/image';
import Link from 'next/link';
import { ProductDto } from '@/dtos/Product.dto';
import { formatMoney, generateSlugToHref } from '@/utils';
import CustomButton from '@/components/atoms/customButton';

interface ProductCardProps {
  product: ProductDto;
  showAddToCart?: boolean;
}

export default function ProductCard({
  product,
  showAddToCart = true,
}: ProductCardProps) {
  const handleAddToCart = () => {
    // Add to cart logic
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={generateSlugToHref(product.slug?.slug)}>
        <div className="aspect-square relative">
          <Image
            src={product.feature_image_detail?.image?.url || '/placeholder.jpg'}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
      </Link>

      <div className="p-4">
        <Link href={generateSlugToHref(product.slug?.slug)}>
          <h3 className="font-semibold text-lg mb-2 hover:text-primary">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center justify-between mb-3">
          <span className="text-price font-bold">
            {formatMoney(product.min_regular_price)}
          </span>
          {product.min_price !== product.min_regular_price && (
            <span className="text-gray-500 line-through text-sm">
              {formatMoney(product.min_price)}
            </span>
          )}
        </div>

        {showAddToCart && (
          <CustomButton
            variant="primary"
            size="sm"
            className="w-full"
            onClick={handleAddToCart}
          >
            Thêm vào giỏ
          </CustomButton>
        )}
      </div>
    </div>
  );
}
```

### 3. **Thêm Context Mới**

```tsx
// src/contexts/newContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface NewContextType {
  data: any;
  setData: (data: any) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const NewContext = createContext<NewContextType | undefined>(undefined);

export const NewProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <NewContext.Provider value={{ data, setData, loading, setLoading }}>
      {children}
    </NewContext.Provider>
  );
};

export const useNewContext = () => {
  const context = useContext(NewContext);
  if (!context) {
    throw new Error('useNewContext must be used within NewProvider');
  }
  return context;
};
```

### 4. **Tạo Custom Hook**

```tsx
// src/hooks/useNewHook.tsx
import { useState, useEffect } from 'react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function useNewHook(param?: string) {
  const { data, error, isLoading } = useSWR(
    param ? `/api/new-endpoint?param=${param}` : null,
    fetcher,
  );

  const [localState, setLocalState] = useState(null);

  useEffect(() => {
    if (data) {
      setLocalState(data);
    }
  }, [data]);

  return {
    data: localState,
    loading: isLoading,
    error,
  };
}
```

## 🔌 API Integration

### 1. **API Routes Structure**

```
/api/
├── product/                 # Sản phẩm
│   ├── [slug].ts           # Chi tiết sản phẩm
│   └── search.ts           # Tìm kiếm sản phẩm
├── user/                   # Người dùng
│   ├── profile.ts          # Thông tin cá nhân
│   └── orders.ts           # Đơn hàng
├── orders/                 # Đơn hàng
│   ├── create.ts           # Tạo đơn hàng
│   └── track.ts            # Theo dõi đơn hàng
├── settings/               # Cấu hình
├── pages/                  # Pages data
└── search/                 # Tìm kiếm
```

### 2. **API Client Pattern**

```tsx
// src/utils/apiClient.ts
class ApiClient {
  private baseURL = process.env.NEXT_PUBLIC_API_URL;

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    return response.json();
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    return response.json();
  }
}

export const apiClient = new ApiClient();
```

### 3. **SWR Usage Pattern**

```tsx
// Trong component
const { data, error, isLoading, mutate } = useSWR(
  `/api/products?category=${categoryId}`,
  fetcher,
  {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    refreshInterval: 300000, // 5 minutes
  },
);
```

## 🧠 Context & State Management

### 1. **App Context Structure**

```tsx
// Global app state
interface AppContextType {
  user?: UserDto; // Current user
  isOpenMenu: boolean; // Mobile menu state
  isOpenPopupProduct: string | null; // Product popup state
  settings: Record<string, string>; // Site settings
  currentVariant?: VariantDto; // Selected product variant
}
```

### 2. **Order Context Structure**

```tsx
// Cart and order state
interface OrderContextType {
  cartItems: CartItemDto[]; // Cart items
  totalItems: number; // Total quantity
  totalPrice: number; // Total price
  addToCart: (item: CartItemDto) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
}
```

### 3. **Search Context Structure**

```tsx
// Search and filter state
interface SearchContextType {
  searchTerm: string; // Current search term
  filters: FilterState; // Applied filters
  sortBy: SortOption; // Sort option
  results: ProductDto[]; // Search results
}
```

## 🎨 SEO & Performance

### 1. **SEO Configuration**

```tsx
// src/config/seo.ts
export const defaultSEO = {
  title: 'MinhTu Authentic - Nước hoa chính hãng',
  description: 'Chuyên phân phối nước hoa chính hãng từ các thương hiệu uy tín',
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: 'https://minhtuauthentic.com',
    site_name: 'MinhTu Authentic',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'MinhTu Authentic',
      },
    ],
  },
  twitter: {
    cardType: 'summary_large_image',
  },
};
```

### 2. **Dynamic SEO**

```tsx
// Trong page component
export async function getStaticProps() {
  const seoData = {
    title: product.seo?.title || product.name,
    description: product.seo?.description,
    image: product.feature_image_detail?.image?.url,
  };

  return {
    props: { seoData },
    revalidate: 300,
  };
}
```

### 3. **Performance Optimizations**

- **Image Optimization**: Next.js Image component với lazy loading
- **Code Splitting**: Dynamic imports cho heavy components
- **Bundle Analysis**: @next/bundle-analyzer
- **Caching**: SWR cho API calls, ISR cho static pages
- **CSS Optimization**: Tailwind CSS purging

## 📱 Responsive Design

### 1. **Breakpoint System**

```tsx
// Tailwind breakpoints
const breakpoints = {
  sm: '640px', // Mobile landscape
  md: '768px', // Tablet
  lg: '1024px', // Desktop
  xl: '1240px', // Large desktop
  '2xl': '1240px', // Extra large (same as xl)
};
```

### 2. **Device Detection Hooks**

```tsx
// src/hooks/useDevice.ts
export const useIsMobile = () => {
  return useMediaQuery({ maxWidth: MOBILE_BREAKPOINT });
};

export const useIsDesktop = () => {
  return useMediaQuery({ minWidth: MOBILE_BREAKPOINT + 1 });
};
```

### 3. **Responsive Components**

```tsx
// Conditional rendering based on device
const isMobile = useIsMobile();
const isDesktop = useIsDesktop();

return (
  <>
    {isMobile && <MobileComponent />}
    {isDesktop && <DesktopComponent />}
  </>
);
```

## 🛒 E-commerce Features

### 1. **Cart Management**

```tsx
// Add to cart functionality
const addToCart = (variant: VariantDto, quantity: number) => {
  const cartItem: CartItemDto = {
    id: variant.id,
    variant,
    quantity,
    price: variant.regular_price,
  };

  // Update cart context
  setCartItems((prev) => [...prev, cartItem]);

  // Persist to localStorage
  localStorage.setItem('cart', JSON.stringify(cartItems));

  // Show notification
  toast.success('Đã thêm vào giỏ hàng');
};
```

### 2. **Payment Integration**

```tsx
// Multiple payment gateways
const PAYMENT_METHODS = {
  COD: 'cod', // Cash on delivery
  VNPAY: 'vnpay', // VNPay
  BAOKIM: 'baokim', // BaoKim
  FUDIIN: 'fudiin', // Fudiin installment
};

const handlePayment = async (method: string, orderData: OrderDto) => {
  switch (method) {
    case PAYMENT_METHODS.VNPAY:
      return await processVNPayPayment(orderData);
    case PAYMENT_METHODS.BAOKIM:
      return await processBaoKimPayment(orderData);
    // ... other methods
  }
};
```

### 3. **Order Tracking**

```tsx
// Order status tracking
const ORDER_STATUSES = {
  NEW: 'new',
  PROCESSING: 'processing',
  APPROVED: 'approved',
  DONE: 'done',
  CLOSE: 'close',
};

const statusLabels = {
  [ORDER_STATUSES.NEW]: 'Đơn hàng mới',
  [ORDER_STATUSES.PROCESSING]: 'Đang xử lý',
  [ORDER_STATUSES.APPROVED]: 'Đã duyệt',
  [ORDER_STATUSES.DONE]: 'Hoàn thành',
  [ORDER_STATUSES.CLOSE]: 'Đã hủy',
};
```

## ⚙️ Thiết lập và chạy dự án

### 1. **Cài đặt dependencies**

```bash
npm install
# hoặc
yarn install
```

### 2. **Environment Variables**

Tạo file `.env.local`:

```env
# Backend API
NEXT_PUBLIC_API_URL=http://localhost:3001
BE_URL=http://localhost:3001
APP_URL=http://localhost:3000

# Google Analytics
NEXT_PUBLIC_GA_TRACKING_ID=GA_TRACKING_ID

# reCAPTCHA
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key
RECAPTCHA_SECRET_KEY=your_secret_key

# Payment Gateways
VNPAY_TMN_CODE=your_tmn_code
VNPAY_HASH_SECRET=your_hash_secret
BAOKIM_API_KEY=your_api_key
```

### 3. **Chạy development server**

```bash
npm run dev
# hoặc
yarn dev
```

### 4. **Build for production**

```bash
npm run build
npm run start
```

### 5. **Linting & Formatting**

```bash
npm run lint
npx prettier --write .
```

### 6. **Bundle Analysis**

```bash
ANALYZE=true npm run build
```

## 🔧 Configuration Files

### 1. **next.config.mjs**

- Bundle analyzer configuration
- Image domains setup
- Transpile packages cho Ant Design
- Compression enabled

### 2. **tailwind.config.ts**

- Custom color scheme
- Container breakpoints
- Custom animations (fadeUp, fadeDown)
- Extended utilities

### 3. **tsconfig.json**

- TypeScript configuration
- Path aliases (`@/*`)
- Strict type checking

## 🚀 Performance Features

### 1. **Image Optimization**

- Next.js Image component
- Lazy loading với React Lazy Load Image Component
- WebP format support
- Responsive images

### 2. **Code Optimization**

- Dynamic imports cho heavy components
- Bundle splitting
- Tree shaking
- CSS purging

### 3. **Caching Strategy**

- SWR caching cho API calls
- ISR (Incremental Static Regeneration)
- Browser caching
- CDN optimization

### 4. **SEO Optimization**

- Server-side rendering
- Meta tags optimization
- Structured data (Schema.org)
- Sitemap generation
- Google Analytics integration

## 🔒 Security Features

### 1. **Authentication**

- JWT token-based authentication
- Secure cookie storage
- Protected routes với middleware
- Session management

### 2. **Form Security**

- reCAPTCHA v3 integration
- Input validation
- CSRF protection
- XSS prevention

### 3. **Payment Security**

- PCI DSS compliant payment gateways
- Encrypted payment data
- Secure checkout process

## 🎯 Best Practices

### 1. **Component Development**

- Atomic Design pattern
- TypeScript for type safety
- Reusable và composable components
- Proper error boundaries

### 2. **Performance**

- Lazy loading components
- Image optimization
- Bundle size monitoring
- Core Web Vitals optimization

### 3. **SEO**

- Server-side rendering
- Meta tags cho mọi page
- Structured data
- Fast loading times

### 4. **Accessibility**

- Semantic HTML
- ARIA labels
- Keyboard navigation
- Screen reader support

---

## 📚 Tài liệu tham khảo

- [Next.js Documentation](https://nextjs.org/docs)
- [SWR Documentation](https://swr.vercel.app/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Ant Design Documentation](https://ant.design/docs/react/introduce)
- [React Hook Form Documentation](https://react-hook-form.com/)

---

**Tác giả**: HoangHuyDev  
**Cập nhật**: 2025  
**License**: Private Project
