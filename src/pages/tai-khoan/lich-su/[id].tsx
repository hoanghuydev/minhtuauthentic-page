import Header from '@/components/organisms/header';
import Footer from '@/components/organisms/footer';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getCookie } from '@/utils';
import { OrdersDto } from '@/dtos/Orders.dto';
import { OrderItemsDto } from '@/dtos/OrderItems.dto';
import OrderDetailTemplate from '@/components/templates/OrderDetailTemplate';
import AccountTemplate from '@/components/templates/AccountTemplate';
import BreadcrumbComponent from '@/components/molecules/breakcrumb';
import Layout from '@/components/templates/Layout';
import { PageSetting } from '@/config/type';

export const getServerSideProps = async (context: any) => {
  const order = context.query.id;
  const user = JSON.parse(
    getCookie('user', context.req.headers.cookie || '', true) || '{}',
  );
  const rsOrderItems = await fetch(
    process.env.BE_URL + '/api/pages/orders/items/' + order,
    {
      headers: {
        Authorization: 'Bearer ' + user?.token,
      },
    },
  )
    .then((res) => res.json())
    .catch((err) => null);

  const dataOrderItems: {
    data: {
      order: OrdersDto;
      order_items: OrderItemsDto[];
    };
  } = rsOrderItems ? rsOrderItems : null;

  return {
    props: {
      data: dataOrderItems?.data,
    },
  };
};

export default function UserHistoryDetail({
  menu,
  footerContent,
  data,
  settings,
}: {
  data: { order: OrdersDto; order_items: OrderItemsDto[] };
} & PageSetting) {
  return (
    <>
      <Header settings={settings} menu={menu} />
      <Layout settings={settings} menu={menu}>
        <BreadcrumbComponent
          label={'Thông tin khách hàng'}
          link={'/tai-khoan/lich-su'}
          current={{
            label: 'Chi tiết đơn hàng ' + data?.order?.id,
            link: '/tai-khoan/lich-su/' + data?.order?.id,
          }}
        />
        <AccountTemplate>
          <OrderDetailTemplate order={data?.order} />
        </AccountTemplate>
      </Layout>
      <Footer settings={settings} footerContent={footerContent} />
    </>
  );
}
