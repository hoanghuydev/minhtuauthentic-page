import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import CheckoutTemplate from '@/components/templates/CheckoutTemplate';
import { PaymentsDto } from '@/dtos/Payments.dto';

export const getServerSideProps = async (context: any) => {
  const headers = context.req?.headers;
  const payments: { data: PaymentsDto[] } = await fetch(
    `${process.env.BE_URL}/api/pages/payments`,
  )
    .then((res) => res.json())
    .catch((error) => {
      console.log('Error:', error);
      return null;
    });
  return {
    props: {
      payments: payments?.data || [],
      ip: (headers?.['x-forwarded-for'] as string) || '',
    },
  };
};

export default function Checkout({
  payments,
  ip,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div className={'container mx-auto p-3 pb-[90px]'}>
      <CheckoutTemplate payments={payments} ip={ip} />
    </div>
  );
}
