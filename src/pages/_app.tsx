import '@/styles/globals.css';
import '@/styles/swiper-custom.css';
import '@/styles/bk.css';
import '@/styles/toc.css';
import type { AppProps } from 'next/app';
import { AppProvider } from '@/contexts/appContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { OrderProvider } from '@/contexts/orderContext';
import Head from 'next/head';
import { Nunito_Sans } from 'next/font/google';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import * as gtag from '@/utils/gtag';

const nunitoSans = Nunito_Sans({
  subsets: ['latin'],
});
import useSettings from '@/hooks/useSettings';
import { SearchProvider } from '@/contexts/searchContext';

export default function App({ Component, pageProps }: AppProps) {
  const settings = useSettings();
  const router = useRouter();
  const _pageProps = { ...pageProps, ...settings };

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      gtag.pageview(url);
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

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
      <AppProvider>
        <OrderProvider>
          <SearchProvider>
            <Component className={nunitoSans.className} {..._pageProps} />
            <ToastContainer />
          </SearchProvider>
        </OrderProvider>
      </AppProvider>
    </>
  );
}
