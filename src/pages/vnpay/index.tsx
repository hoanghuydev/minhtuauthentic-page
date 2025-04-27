import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import getDefaultSeverSide from '@/utils/getDefaultServerSide';
import Header from '@/components/organisms/header';
import Footer from '@/components/organisms/footer';
import Layout from '@/components/templates/Layout';
import { hashVNPAY } from '@/utils/vnpay';
import { PageSetting } from '@/config/type';

export const getServerSideProps = async ({ query }: any) => {
  const is_success = false;
  const vnp_Params = query as Record<string, string>;
  const secureHash = vnp_Params['vnp_SecureHash'];
  if (vnp_Params?.vnp_SecureHashType) {
    delete vnp_Params['vnp_SecureHashType'];
  }
  if (vnp_Params?.vnp_SecureHash) {
    delete vnp_Params['vnp_SecureHash'];
  }
  const signed = hashVNPAY(vnp_Params);
  if (secureHash === signed && vnp_Params['vnp_TransactionStatus'] === '00') {
    const order_id = vnp_Params['vnp_TxnRef'];
    return {
      redirect: {
        destination: '/gio-hang/thanh-cong?orderId=' + order_id,
        permanent: false,
      },
    };
  }

  return {
    props: {
      is_success,
    },
  };
};

export default function VnPaySuccess({
  menu,
  footerContent,
  settings,
  is_success,
}: {
  is_success: boolean;
} & PageSetting) {
  return (
    <>
      <Header settings={settings} menu={menu} />
      <Layout settings={settings} menu={menu}>
        {is_success ? <h1>VNPAY SUCCESS</h1> : <h1>Thanh toán thất bại</h1>}
      </Layout>
      <Footer settings={settings} footerContent={footerContent} />
    </>
  );
}
