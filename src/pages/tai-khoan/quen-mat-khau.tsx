import Header from '@/components/organisms/header';
import Footer from '@/components/organisms/footer';
import Layout from '@/components/templates/Layout';
import { PageSetting, ServerSideProps } from '@/config/type';
import ForgetPasswordTemplate from '@/components/templates/ForgetPasswordTemplate';

export default function ForgetPasswordPage({
  menu,
  footerContent,
  settings,
}: PageSetting) {
  return (
    <>
      <Header settings={settings} menu={menu} />
      <Layout settings={settings} menu={menu}>
        <ForgetPasswordTemplate />
      </Layout>
      <Footer settings={settings} footerContent={footerContent} />
    </>
  );
}
