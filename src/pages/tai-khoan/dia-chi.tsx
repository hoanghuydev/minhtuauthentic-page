import Header from '@/components/organisms/header';
import Footer from '@/components/organisms/footer';
import AccountTemplate from '@/components/templates/AccountTemplate';
import BreadcrumbComponent from '@/components/molecules/breakcrumb';
import Layout from '@/components/templates/Layout';
import { PageSetting } from '@/config/type';
import Addresses from '@/components/organisms/address';

export default function UserHistory({
  menu,
  footerContent,
  settings,
}: PageSetting) {
  return (
    <>
      <Header settings={settings} menu={menu} />
      <Layout settings={settings} menu={menu}>
        <BreadcrumbComponent label={'Địa chỉ'} link={'/tai-khoan/dia-chi'} />
        <AccountTemplate>
          <Addresses />
        </AccountTemplate>
      </Layout>
      <Footer settings={settings} footerContent={footerContent} />
    </>
  );
}
