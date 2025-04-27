import { PageSetting, ServerSideProps } from '@/config/type';
import Layout from '@/components/templates/Layout';
import Header from '@/components/organisms/header';
import Footer from '@/components/organisms/footer';
import CheckOrderTemplate from '@/components/templates/CheckOrderTemplate';

export default function CheckOrderPage({
  menu,
  footerContent,
  settings,
}: PageSetting) {
  return (
    <>
      <Header settings={settings} menu={menu} />
      <Layout settings={settings} menu={menu}>
        <CheckOrderTemplate />
      </Layout>
      <Footer settings={settings} footerContent={footerContent} />
    </>
  );
}
