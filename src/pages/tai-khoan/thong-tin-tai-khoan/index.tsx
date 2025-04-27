import Header from '@/components/organisms/header';
import Footer from '@/components/organisms/footer';
import AccountTemplate from '@/components/templates/AccountTemplate';
import BreadcrumbComponent from '@/components/molecules/breakcrumb';
import Layout from '@/components/templates/Layout';
import AccountInfo from '@/components/organisms/accountInfo';
import { getProfile } from '@/utils/getDefaultServerSide';
import { PageSetting } from '@/config/type';
import { UserDto } from '@/dtos/User.dto';

export const getServerSideProps = async (context: any) => {
  const profile = await getProfile(context.req.cookies);
  return {
    props: {
      profile,
    },
  };
};
export default function AccountInfoPage({
  menu,
  footerContent,
  profile,
  settings,
}: {
  profile: UserDto;
} & PageSetting) {
  return (
    <>
      <Header settings={settings} menu={menu} />
      <Layout settings={settings} menu={menu}>
        <BreadcrumbComponent
          label={'Thông tin tài khoản'}
          link={'/tai-khoan/thong-tin-tai-khoan'}
        />
        <AccountTemplate>
          <AccountInfo profile={profile} />
        </AccountTemplate>
      </Layout>
      <Footer settings={settings} footerContent={footerContent} />
    </>
  );
}
