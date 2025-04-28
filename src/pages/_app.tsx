import '@/styles/globals.css';
import '@/styles/bk.css';
import '@/styles/toc.css';
import type { AppProps } from 'next/app';
import { AppProvider } from '@/contexts/appContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { OrderProvider } from '@/contexts/orderContext';
import Head from 'next/head';
import { Nunito_Sans } from 'next/font/google';
const nunitoSans = Nunito_Sans({
  subsets: ['latin'],
});
import useSettings from '@/hooks/useSettings';
import { SearchProvider } from '@/contexts/searchContext';

export default function App({ Component, pageProps }: AppProps) {
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
