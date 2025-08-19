import Header from '@/components/organisms/header';
import Footer from '@/components/organisms/footer';
import AccountTemplate from '@/components/templates/AccountTemplate';
import BreadcrumbComponent from '@/components/molecules/breakcrumb';
import Layout from '@/components/templates/Layout';
import AccountInfo from '@/components/organisms/accountInfo';
import { getProfile, getHomeSupport } from '@/utils/getDefaultServerSide';
import { PageSetting } from '@/config/type';
import { UserDto } from '@/dtos/User.dto';
import HomeSupport from '@/components/organisms/home/homeSupport';

export const getServerSideProps = async (context: any) => {
  const profile = await getProfile(context.req.cookies);
  const { homeSupport, supportSetting } = await getHomeSupport();
  return {
    props: {
      profile,
      homeSupport,
      supportSetting,
    },
  };
};

export default function AccountInfoPage({
  menu,
  footerContent,
  profile,
  settings,
  homeSupport,
  supportSetting,
}: {
  profile: UserDto;
  homeSupport: any[];
  supportSetting: any;
} & PageSetting) {
  const hasSupport = Boolean(homeSupport?.length);

  return (
    <>
      <Header settings={settings} menu={menu} />
      <Layout settings={settings} menu={menu}>
        <BreadcrumbComponent
          label={'Thông tin tài khoản'}
          link={'/tai-khoan/thong-tin-tai-khoan'}
        />
        <AccountTemplate profile={profile}>
          <AccountInfo profile={profile} />
        </AccountTemplate>
      </Layout>

      {/* Support Section - ngoài layout, cùng cấp với footer */}
      {hasSupport && (
        <HomeSupport contents={homeSupport} setting={supportSetting} />
      )}

      <Footer settings={settings} footerContent={footerContent} />
    </>
  );
}
