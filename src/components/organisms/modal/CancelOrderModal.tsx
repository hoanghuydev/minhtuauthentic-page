import { Modal, Button } from 'antd/es';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useIsMobile } from '@/hooks/useDevice';

type CancelOrderModalProps = {
  isOpen: boolean;
  isLoading?: boolean;
  orderId?: number;
  onClose: () => void;
  onConfirm: () => void;
};

const CancelOrderModal = ({
  isOpen,
  isLoading,
  orderId,
  onClose,
  onConfirm,
}: CancelOrderModalProps) => {
  const isMobile = useIsMobile();

  return (
    <Modal
      className={isMobile ? 'mobile-delete-modal' : ''}
      title={
        <div className="flex items-center gap-2 text-red-500">
          <ExclamationCircleOutlined /> Xác nhận huỷ đơn hàng
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
    >
      <div className="py-4">
        <p className="text-base mb-6">
          Bạn có chắc chắn muốn huỷ đơn hàng{' '}
          {orderId ? `#${orderId}` : 'này'}? Hành động này không thể hoàn tác.
        </p>
        <div className="flex justify-end gap-3">
          <Button onClick={onClose} disabled={isLoading}>
            Đóng
          </Button>
          <Button
            type="primary"
            danger
            loading={isLoading}
            onClick={onConfirm}
          >
            Xác nhận huỷ đơn
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CancelOrderModal;
