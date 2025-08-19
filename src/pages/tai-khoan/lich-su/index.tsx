import Header from '@/components/organisms/header';
import Footer from '@/components/organisms/footer';
import getDefaultSeverSide from '@/utils/getDefaultServerSide';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import AccountTemplate from '@/components/templates/AccountTemplate';
import HistoryList from '@/components/organisms/history/list';
import { getCookie } from '@/utils';
import { OrdersDto } from '@/dtos/Orders.dto';
import BreadcrumbComponent from '@/components/molecules/breakcrumb';
import Layout from '@/components/templates/Layout';
import { PageSetting, ServerSideProps } from '@/config/type';
import { getProfile, getHomeSupport } from '@/utils/getDefaultServerSide';
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

export default function UserHistory({
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
  console.log(settings);
  return (
    <>
      <Header settings={settings} menu={menu} />
      <Layout settings={settings} menu={menu}>
        <BreadcrumbComponent label={'Lich sử'} link={'/tai-khoan/lich-su'} />
        <AccountTemplate profile={profile}>
          <HistoryList />
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
