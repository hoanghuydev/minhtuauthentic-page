import { AddressesDto } from '@/dtos/Addresses.dto';
import { twMerge } from 'tailwind-merge';
import BookOutlined from '@ant-design/icons/BookOutlined';
import UserOutlined from '@ant-design/icons/UserOutlined';
import MailOutlined from '@ant-design/icons/MailOutlined';
import PhoneOutlined from '@ant-design/icons/PhoneOutlined';
import EditOutlined from '@ant-design/icons/EditOutlined';
import { Button } from 'antd/es';

type Props = {
  address: AddressesDto;
  className?: string;
  onClick?: () => void;
};
export default function AddressDetail({ address, className, onClick }: Props) {
  return (
    <div className={twMerge('w-full p-3 border-dashed border', className)}>
      <div
        className={'text-lg font-bold mb-3 text-primary flex justify-between'}
      >
        <p>{address.title}</p>
        <Button
          icon={<EditOutlined />}
          onClick={() => {
            onClick && onClick();
          }}
        />
      </div>

      <p className={'flex gap-1 mb-2'}>
        <UserOutlined />
        <span className={'font-semibold'}>{address.name}</span>
      </p>
      <p className={'flex gap-1 mb-2'}>
        <BookOutlined />
        <span>
          {address.shipping_address}, {address.ward?.full_name},{' '}
          {address.district?.full_name}, {address.city?.full_name}
        </span>
      </p>
      <p className={'flex gap-1 mb-2'}>
        <PhoneOutlined />
        <span>{address.phone}</span>
      </p>
      <p className={'flex gap-1 mb-2'}>
        <MailOutlined />
        <span>{address.email}</span>
      </p>
    </div>
  );
}
