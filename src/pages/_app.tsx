import 'antd/dist/reset.css';
import '@/styles/globals.css';
import '@/styles/swiper-custom.css';
import '@/styles/bk.css';
import '@/styles/toc.css';

import type { AppContext, AppProps } from 'next/app';
import App from 'next/app';
import { AppProvider } from '@/contexts/appContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { OrderProvider } from '@/contexts/orderContext';
import Head from 'next/head';
import useSettings from '@/hooks/useSettings';
import { SearchProvider } from '@/contexts/searchContext';
import ScrollToTop from '@/components/atoms/ScrollToTop';
import CodeInjection from '@/components/molecules/CodeInjection';
import { getCodeInjectionData } from '@/utils/codeInjection';
import { CodeInjectionDto } from '@/dtos/codeInjection.dto';
import { getCommonSettings } from '@/utils/commonSettings';
import CommonSettingDto from '@/dtos/CommonSetting.dto';
import { SsrCommonSettingsProvider } from '@/contexts/ssrCommonSettingsContext';

interface MyAppProps extends AppProps {
  codeInjectionHeader: CodeInjectionDto[];
  codeInjectionFooter: CodeInjectionDto[];
  ssrCommonSettings: CommonSettingDto;
}

function MyApp({
  Component,
  pageProps,
  codeInjectionHeader,
  codeInjectionFooter,
  ssrCommonSettings,
}: MyAppProps) {
  const { isReady: isSettingsReady, ...settings } = useSettings();
  // `settings` từ useSettings() spread SAU nên nó ghi đè mọi thứ cùng tên trong
  // pageProps. Trước khi /api/settings về, mọi field của nó đều rỗng
  // (hooks/useSettings.tsx:13-19) nên nó xoá sạch những gì server đã trả:
  //   - `settings` -> logo vẽ bản dự phòng rồi đổi sau hydrate (tải hai logo)
  //   - `menu`/`footerContent` -> các trang dùng withSettings (HOCs/withSetting.ts:16)
  //     SSR ra menu rồi xoá trắng ở lần render client đầu, thêm lại sau khi fetch
  //     xong: vừa hydration mismatch vừa đúng cái nhảy giật này định sửa.
  // Áp ĐỒNG ĐỀU cho mọi field thay vì chỉ `settings`: giữ giá trị server cho tới
  // khi client tải xong, sau đó client thắng nên thay đổi trong CMS vẫn cập nhật.
  // Chồng từng field, không spread cả object. Spread cả object ghi luôn cả
  // `undefined` lên trên, nên hai ca sau đều xoá trắng dữ liệu server đã trả:
  //   - SWR lỗi mạng: `_data` đứng ở giá trị khởi tạo, các key TỒN TẠI nhưng
  //     bằng `undefined`/`[]` (hooks/useSettings.tsx:13-19)
  //   - BE trả một phần: `getDefaultSeverSide` cho `menu: undefined` khi fetch
  //     menu lỗi, dù `settings` vẫn có
  // Hậu quả từng thấy: trang dùng withSettings SSR ra menu + footer đầy đủ, rồi
  // menu biến mất và footer trắng sau khi fetch lỗi.
  const hasValue = (value: unknown) =>
    value !== undefined &&
    value !== null &&
    !(Array.isArray(value) && value.length === 0);
  const _pageProps: Record<string, unknown> = { ...pageProps };
  if (isSettingsReady) {
    for (const [key, value] of Object.entries(settings)) {
      if (hasValue(value)) _pageProps[key] = value;
    }
  } else {
    // Client chưa xong: server thắng, nhưng vẫn lấp những field server không có.
    for (const [key, value] of Object.entries(settings)) {
      if (!hasValue(_pageProps[key]) && hasValue(value)) _pageProps[key] = value;
    }
  }
  // Ưu tiên giá trị đọc được trên server: nó có mặt ngay từ HTML đầu tiên nên
  // không tạo ra cú đổi giá trị sau hydrate.
  const primaryColor =
    ssrCommonSettings?.primaryColor ||
    settings?.commonSettings?.primaryColor ||
    '#C44812';

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <style>{`:root { --primary-color: ${primaryColor}; }`}</style>
      </Head>
      <CodeInjection type="header" data={codeInjectionHeader} />
      <SsrCommonSettingsProvider value={ssrCommonSettings}>
      <AppProvider>
        <OrderProvider>
          <SearchProvider>
            <ScrollToTop />
            <Component {..._pageProps} />
            <ToastContainer />
            <CodeInjection type="footer" data={codeInjectionFooter} />
          </SearchProvider>
        </OrderProvider>
      </AppProvider>
      </SsrCommonSettingsProvider>
    </>
  );
}

MyApp.getInitialProps = async (appContext: AppContext) => {
  // Call the default App getInitialProps
  const appProps = await App.getInitialProps(appContext);
  
  // Fetch code injection data SSR
  const [codeInjectionHeader, codeInjectionFooter, ssrCommonSettings] =
    await Promise.all([
      getCodeInjectionData('code-injection-header'),
      getCodeInjectionData('code-injection-footer'),
      getCommonSettings(),
    ]);

  return {
    ...appProps,
    codeInjectionHeader,
    codeInjectionFooter,
    ssrCommonSettings,
  };
};

export default MyApp;
