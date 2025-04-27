export const getServerSideProps = async ({ query }: any) => {
  const params = query as Record<string, string>;
  return {
    redirect: {
      destination: '/gio-hang/thanh-cong?orderId=' + params.mrc_order_id,
      permanent: false,
    },
  };
};

export default function BaokimSuccess() {
  return <></>;
}
