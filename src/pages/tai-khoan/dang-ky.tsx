import Header from '@/components/organisms/header';
import Footer from '@/components/organisms/footer';
import RegisterTemplate from '@/components/templates/RegisterTemplate';
import Layout from '@/components/templates/Layout';
import { PageSetting, ServerSideProps } from '@/config/type';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

export default function Register({
  menu,
  footerContent,
  settings,
}: PageSetting) {
  return (
    <>
      <Header settings={settings} menu={menu} />
      <Layout settings={settings} menu={menu}>
        <GoogleReCaptchaProvider
          reCaptchaKey={process.env.NEXT_PUBLIC_GOOGLE_SITE_KEY || ''}
        >
          <RegisterTemplate />
        </GoogleReCaptchaProvider>
      </Layout>
      <Footer settings={settings} footerContent={footerContent} />
    </>
  );
}
