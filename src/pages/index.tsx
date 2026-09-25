import { ResponseHomePageDto } from '@/dtos/responseHomePage.dto';
import { getRawSettings } from '@/utils/commonSettings';
import { SettingOptionDto } from '@/dtos/SettingOption.dto';
import { PageSetting } from '@/config/type';
import { SETTING_KEY } from '@/config/enum';

import BlockUnderSlide from '@/components/organisms/home/blockUnderSlide';
import Header from '@/components/organisms/header';
import Footer from '@/components/organisms/footer';
import HomeFlashSale from '@/components/organisms/home/homeFlashSale';
import Layout from '@/components/templates/Layout';
import HomeContent from '@/components/organisms/home/homeContent';
import HomeBanner from '@/components/organisms/home/homeBanner';
import {
  BANNER_SIZES_DESKTOP,
  BANNER_SIZES_FULL,
  BANNER_SIZES_MOBILE,
} from '@/config/bannerSizes';
import HomeSupport from '@/components/organisms/home/homeSupport';

import Head from 'next/head';
import { ReactNode, useMemo } from 'react';

// Types
interface HomeProps extends PageSetting {
  homePage: ResponseHomePageDto;
  settingsHome: Record<string, SettingOptionDto | undefined>;
}

// Constants
// Trùng breakpoint `lg` của Tailwind, nơi Banners đổi giữa cây desktop và mobile.
const DESKTOP_MEDIA = '(min-width: 1024px)';
const MOBILE_MEDIA = '(max-width: 1023.98px)';

// Schema data moved to separate function for better readability
const generateStoreSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Store',
  name: 'Minh Tu Authentic',
  image:
    'https://be.minhtuauthentic.com/public/Logo%20Thuong%20hieu/logo%20chinh%202070x540%2001.png',
  url: 'https://minhtuauthentic.com/',
  telephone: '0961693869',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '278 Hòa Bình, Q Tân Phú, TpHCM',
    addressLocality: 'TpHCM',
    addressRegion: 'Quận Tân Phú',
    postalCode: '72000',
    addressCountry: 'Viet Nam',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: '10.7726003',
    longitude: '106.6267201,17',
  },
  openingHoursSpecification: [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ].map((day) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: day,
    opens: '09:00',
    closes: '21:00',
  })),
  sameAs: [
    'https://www.facebook.com/minhtuauthentic/',
    'https://x.com/MinhTuAuthentic',
    'www.youtube.com/@MinhTuAuthentic',
    'https://www.reddit.com/user/minhtuauthentic/',
    'https://www.quora.com/profile/MinhTuAuthentic',
    'https://medium.com/@minhtuauthentic/minh-tú-authentic-chuyên-phân-phối-nước-hoa-chính-hãng-từ-các-thương-hiệu-uy-tín-toàn-cầu-404736b10787',
    'https://minhtuauthenticvn.blogspot.com/2025/05/minh-tu-authentic-chuyen-phan-phoi-nuoc.html',
    'https://www.linkedin.com/in/minh-tu-authentic-b56732364/',
  ],
});

// Chỉ ảnh đầu của mỗi cây là ứng viên LCP; mỗi preload gắn media để trình duyệt
// chỉ tải đúng ảnh của breakpoint đang hiển thị.
// Nhánh mobile lặp lại đúng logic chọn ảnh của Banners (molecules/header/banners).
const extractBannerPreloads = (
  banners: any[] = [],
): { url: string; media: string }[] => {
  const preloads: { url: string; media: string }[] = [];

  // ImageWithFallback lùi về thumbnail_url khi thiếu url, nên phải lấy y hệt.
  const srcOf = (imageDetail: any) =>
    imageDetail?.image?.url || imageDetail?.image?.thumbnail_url;

  const desktopUrl = srcOf(banners.find((banner) => banner?.images?.[0])?.images?.[0]);
  if (desktopUrl) {
    preloads.push({ url: desktopUrl, media: DESKTOP_MEDIA });
  }

  const mobileBanners = banners.filter(
    (banner) => banner?.is_mobile_visible && banner?.images_mobile?.length > 0,
  );
  const mobileUrl = mobileBanners.length
    ? srcOf(mobileBanners.find((banner) => banner?.images_mobile?.[0])?.images_mobile?.[0])
    : desktopUrl;
  if (mobileUrl) {
    preloads.push({ url: mobileUrl, media: MOBILE_MEDIA });
  }

  return preloads;
};

// next/image mặc định sinh srcset theo đúng danh sách này; preload phải dùng y hệt
// thì trình duyệt mới tái sử dụng được, nếu lệch sẽ tải ảnh hai lần.
const NEXT_DEVICE_SIZES = [640, 750, 828, 1080, 1200, 1920, 2048, 3840];
const NEXT_IMAGE_QUALITY = 75;

const optimizedSrcSet = (url: string) =>
  NEXT_DEVICE_SIZES.map(
    (w) =>
      `/_next/image?url=${encodeURIComponent(url)}&w=${w}&q=${NEXT_IMAGE_QUALITY} ${w}w`,
  ).join(', ');

// Utility function to transform settings array to object
const transformSettingsToObject = (settings: any[] = []) => {
  return settings.reduce((acc, item) => {
    if (item?.key) {
      acc[item.key] = item?.value;
    }
    return acc;
  }, {} as Record<string, SettingOptionDto | undefined>);
};

// API fetch function
const fetchHomePageData = async () => {
  try {
    const response = await fetch(`${process.env.BE_URL}/api/pages/home`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: { data: ResponseHomePageDto } = await response.json();
    return data?.data || {};
  } catch (error) {
    console.error('Failed to fetch home page data:', error);
    return {};
  }
};

export async function getStaticProps() {
  // `getRawSettings()` dùng chung cache 60s với `getCommonSettings()` (đã được
  // _app.getInitialProps gọi cho cùng endpoint) nên không phát sinh lần gọi BE
  // thứ hai mỗi lượt ISR revalidate, và hai bên luôn thấy cùng một snapshot.
  // CỐ Ý không dùng getDefaultSeverSide(): hàm đó kéo thêm `menu` 370 KB, mà
  // nhét menu vào __NEXT_DATA__ đã bị bác (PERFORMANCE-ROADMAP.md mục 6).
  const [homePage, settings] = await Promise.all([
    fetchHomePageData(),
    getRawSettings(),
  ]);
  const settingsHome = transformSettingsToObject(homePage?.settings);

  return {
    props: {
      homePage,
      settingsHome,
      // Không trả `settings` ở đây thì `useSettings()` khởi tạo `settings: []`
      // (hooks/useSettings.tsx:13-19) thắng, nên HTML SSR vẽ logo dự phòng
      // (atoms/logo.tsx:24) rồi đổi sang logo CMS sau hydrate — trình duyệt tải
      // CẢ HAI logo, bản dự phòng 17,2 KB bị bỏ đi hoàn toàn.
      settings,
    },
    // 40s là quá gắt cho một trang chủ do CMS điều khiển: đo thật thấy cache đi
    // HIT-HIT-HIT-STALE trong 4 lượt liên tiếp, tức tới ~90 lần dựng lại mỗi giờ.
    // Mỗi lần dựng lại là một lượt fetch dữ liệu home + render 700+ thẻ +
    // serialize 220KB __NEXT_DATA__, chạy trên CHÍNH process Node đang phục vụ
    // /_next/image — nơi mỗi cache miss tốn 182-416ms encode bằng sharp (đã đo).
    // Nói cách khác, dựng lại trang quá thường xuyên làm chậm việc trả ảnh, và
    // ảnh mới là thứ chi phối LCP/SI.
    // `stale-while-revalidate` đã bật nên người dùng KHÔNG BAO GIỜ phải chờ
    // dựng lại — họ nhận bản cũ ngay lập tức. Cái giá duy nhất là độ tươi nội
    // dung, và thứ nhạy cảm thời gian nhất trên trang là flash sale thì đã tự
    // ẩn ở client khi hết hạn (homeFlashSale/index.tsx:34 so endDate với
    // `new Date()` lúc render), không phụ thuộc mốc này.
    revalidate: 300,
  };
}

// Main Component
export default function Home({
  homePage,
  settingsHome,
  settings,
  menu,
  footerContent,
}: HomeProps) {
  // Memoized values to prevent unnecessary re-calculations
  const schema = useMemo(() => generateStoreSchema(), []);

  // Cùng một điều kiện mà HomeBanner dùng để chọn nhánh full-width.
  const desktopBannerSizes = settingsHome[SETTING_KEY.BANNER_SECTION.KEY]
    ?.isBannerFull
    ? BANNER_SIZES_FULL
    : BANNER_SIZES_DESKTOP;

  const bannerPreloads = useMemo(
    () => extractBannerPreloads(homePage?.banners),
    [homePage?.banners],
  );

  const hasFlashSale = Boolean(homePage?.homeFlashSale);
  const hasSupport = Boolean(homePage?.homeSupport?.length);

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />

        {/* Preload critical banner images */}
        {bannerPreloads.map(({ url, media }) => (
          <link
            key={`preload-banner-${media}`}
            rel="preload"
            as="image"
            // Không đặt `href`: khi đã có imageSrcSet thì trình duyệt tải THÊM
            // cả href, thành ra hai lần tải cùng một banner ở hai kích thước.
            // next/image khi tự preload cũng chỉ phát imagesrcset + imagesizes.
            imageSrcSet={optimizedSrcSet(url)}
            // Phải bằng ĐÚNG `sizes` của <img> tương ứng trong banners.tsx,
            // nếu không trình duyệt tải một biến thể cho preload và một biến
            // thể khác cho <img>.
            imageSizes={
              media === DESKTOP_MEDIA ? desktopBannerSizes : BANNER_SIZES_MOBILE
            }
            media={media}
            fetchPriority="high"
          />
        ))}
      </Head>

      <Header settings={settings} menu={menu} headerMarquee={homePage?.headerMarquee} />

      <HomeBanner
        setting={settingsHome[SETTING_KEY.BANNER_SECTION.KEY]}
        banners={homePage?.banners || []}
        menu={menu}
      />

      <Layout
        seo={homePage?.seo}
        settings={settings}
        menu={menu}
        className="overflow-hidden"
      >
        {/* Hidden H1 for SEO */}
        <h1 className="sr-only">{homePage?.seo?.title}</h1>

        <BlockUnderSlide contents={homePage?.homeBlockUnderSlide || []} />

        {/* Conditional Flash Sale Section */}
        {hasFlashSale && (
          <HomeFlashSale
            promotion={homePage.homeFlashSale}
            setting={settingsHome[SETTING_KEY.FLASH_SALE_SECTION.KEY]}
          />
        )}

        <HomeContent homePage={homePage} settingsHome={settingsHome} />
      </Layout>

      {/* Conditional Support Section */}
      {hasSupport && (
        <HomeSupport
          contents={homePage.homeSupport}
          setting={settingsHome[SETTING_KEY.SUPPORT_SECTION.KEY]}
        />
      )}

      <Footer settings={settings} footerContent={footerContent} />
    </>
  );
}
