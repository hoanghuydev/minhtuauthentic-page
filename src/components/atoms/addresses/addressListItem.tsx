import { Card, Tag } from 'antd/es';
import { AddressesDto } from '@/dtos/Addresses.dto';
import Button from 'antd/es/button/button';
import CloseCircleOutlined from '@ant-design/icons/CloseCircleOutlined';
import BookOutlined from '@ant-design/icons/BookOutlined';
import PhoneFilled from '@ant-design/icons/PhoneFilled';
import { toast } from 'react-toastify';
import UserOutlined from '@ant-design/icons/UserOutlined';
import { MailOutlined } from '@ant-design/icons';
type Props = {
  address: AddressesDto;
  refresh?: () => void;
};
export default function AddressListItem({ address, refresh }: Props) {
  const handleDelete = () => {
    const rs = fetch(`/api/orders/addresses?id=${address?.id}`, {
      method: 'DELETE',
    }).then((res) => res.json());
    toast.success('Đã xóa địa chỉ');
    refresh && refresh();
  };

  return (
    <Card
      title={
        <div className={'flex gap-1'}>
          <span>{address.title}</span>
          {address.is_default && <Tag color={'green'}>Mặc định</Tag>}
        </div>
      }
      extra={
        <Button
          icon={<CloseCircleOutlined />}
          type={'link'}
          danger
          onClick={handleDelete}
        />
      }
    >
      <p className={'flex gap-3'}>
        <UserOutlined />
        <span>{address.name}</span>
      </p>
      <p className={'flex gap-3'}>
        <BookOutlined />
        <span>
          {address.shipping_address}, {address.ward?.full_name},{' '}
          {address.district?.full_name}, {address.city?.full_name},
        </span>
      </p>

      <p className={'flex gap-3'}>
        <PhoneFilled />
        <span>{address.phone}</span>
      </p>
      <p className={'flex gap-3'}>
        <MailOutlined />
        <span>{address.email}</span>
      </p>
    </Card>
  );
}
