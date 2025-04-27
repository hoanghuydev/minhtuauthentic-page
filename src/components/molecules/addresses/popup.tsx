import FormAddress from '@/components/organisms/account/formAddress';
import Modal from 'antd/es/modal/Modal';
import { useEffect, useState } from 'react';
type Props = {
  open: boolean;
  refresh?: () => Promise<void> | void;
  onClose: () => void;
};
export default function AddressPopup({ open, refresh, onClose }: Props) {
  const [_open, _setOpen] = useState(false);

  useEffect(() => {
    _setOpen(open);
  }, [open]);

  return (
    <Modal
      destroyOnClose
      title="Thêm địa chỉ"
      open={_open}
      footer={null}
      onCancel={() => {
        onClose();
      }}
    >
      <FormAddress
        onDone={() => {
          onClose();
          refresh && refresh();
        }}
      />
    </Modal>
  );
}
