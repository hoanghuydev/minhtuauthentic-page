import getDefaultSeverSide from '@/utils/getDefaultServerSide';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { ServerSideProps } from '@/config/type';
import Header from '@/components/organisms/header';
import Layout from '@/components/templates/Layout';
import NotFoundTemplate from '@/components/templates/NotFoundTemplate';

export const getServerSideProps = (async () => {
  const resDefault = await getDefaultSeverSide();
  return {
    props: resDefault,
  };
}) satisfies GetServerSideProps<ServerSideProps>;

export default function NotFoundPage({
  menu,
  settings,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Header settings={settings} menu={menu} />
      <Layout settings={settings} menu={menu}>
        <NotFoundTemplate />
      </Layout>
    </>
  );
}
