import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import CheckoutTemplate from '@/components/templates/CheckoutTemplate';
import { PaymentsDto } from '@/dtos/Payments.dto';
import Layout from '@/components/templates/Layout';
import Header from '@/components/organisms/header';
import Footer from '@/components/organisms/footer';
import getDefaultSeverSide from '@/utils/getDefaultServerSide';

export const getServerSideProps = async (context: any) => {
  const headers = context.req?.headers;

  const [paymentsResponse, resDefault] = await Promise.all([
    fetch(`${process.env.BE_URL}/api/pages/payments`)
      .then((res) => res.json())
      .catch((error) => {
        console.log('Error:', error);
        return { data: [] };
      }),
    getDefaultSeverSide(),
  ]);

  return {
    props: {
      ...resDefault,
      payments: paymentsResponse?.data || [],
      ip: (headers?.['x-forwarded-for'] as string) || '',
    },
  };
};

export default function Checkout({
  payments,
  ip,
  settings,
  menu,
  footerContent,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Header settings={settings} menu={menu} />
      <Layout settings={settings} menu={menu}>
        <CheckoutTemplate payments={payments} ip={ip} />
      </Layout>
      <Footer settings={settings} footerContent={footerContent} />
    </>
  );
}
