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
import { getProfile } from '@/utils/getDefaultServerSide';
import { UserDto } from '@/dtos/User.dto';

export const getServerSideProps = async (context: any) => {
  const profile = await getProfile(context.req.cookies);
  return {
    props: {
      profile,
    },
  };
};

export default function UserHistory({
  menu,
  footerContent,
  profile,
  settings,
}: {
  profile: UserDto;
} & PageSetting) {
  console.log(profile);
  return (
    <>
      <Header settings={settings} menu={menu} />
      <Layout settings={settings} menu={menu}>
        <BreadcrumbComponent label={'Lich sử'} link={'/tai-khoan/lich-su'} />
        <AccountTemplate profile={profile}>
          <HistoryList />
        </AccountTemplate>
      </Layout>
      <Footer settings={settings} footerContent={footerContent} />
    </>
  );
}
