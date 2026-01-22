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
import { Nunito_Sans } from 'next/font/google';
import useSettings from '@/hooks/useSettings';
import { SearchProvider } from '@/contexts/searchContext';
import ScrollToTop from '@/components/atoms/ScrollToTop';
import PopupEvent from '@/components/molecules/event/popup-event';
import CodeInjection from '@/components/molecules/CodeInjection';
import { getCodeInjectionData } from '@/utils/codeInjection';
import { CodeInjectionDto } from '@/dtos/codeInjection.dto';

const nunitoSans = Nunito_Sans({
  subsets: ['latin'],
});

interface MyAppProps extends AppProps {
  codeInjectionHeader: CodeInjectionDto[];
  codeInjectionFooter: CodeInjectionDto[];
}

function MyApp({ Component, pageProps, codeInjectionHeader, codeInjectionFooter }: MyAppProps) {
  const settings = useSettings();
  const _pageProps = { ...pageProps, ...settings };

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <style>{`:root { --primary-color: ${
          settings?.commonSettings?.primaryColor || '#C44812'
        }; }`}</style>
      </Head>
      <CodeInjection type="header" data={codeInjectionHeader} />
      <AppProvider>
        <OrderProvider>
          <SearchProvider>
            <ScrollToTop />
            <Component className={nunitoSans.className} {..._pageProps} />
            <ToastContainer />
            <PopupEvent />
            <CodeInjection type="footer" data={codeInjectionFooter} />
          </SearchProvider>
        </OrderProvider>
      </AppProvider>
    </>
  );
}

MyApp.getInitialProps = async (appContext: AppContext) => {
  // Call the default App getInitialProps
  const appProps = await App.getInitialProps(appContext);
  
  // Fetch code injection data SSR
  const [codeInjectionHeader, codeInjectionFooter] = await Promise.all([
    getCodeInjectionData('code-injection-header'),
    getCodeInjectionData('code-injection-footer'),
  ]);

  return {
    ...appProps,
    codeInjectionHeader,
    codeInjectionFooter,
  };
};

export default MyApp;
