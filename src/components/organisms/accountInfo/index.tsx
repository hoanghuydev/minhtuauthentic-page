import { Tabs } from 'antd/es';
import type { TabsProps } from 'antd/es';
import AccountInfoUpdate from '@/components/organisms/accountInfo/updateInfo';
import AccountUpdatePassword from '@/components/organisms/accountInfo/updatePassword';
import { UserDto } from '@/dtos/User.dto';

type Props = {
  profile: UserDto;
};
export default function AccountInfo({ profile }: Props) {
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Hồ sơ',
      children: <AccountInfoUpdate profile={profile} />,
    },
    {
      key: '2',
      label: 'Đổi mật khẩu',
      children: <AccountUpdatePassword />,
    },
  ];
  return <Tabs defaultActiveKey="1" items={items} />;
}
