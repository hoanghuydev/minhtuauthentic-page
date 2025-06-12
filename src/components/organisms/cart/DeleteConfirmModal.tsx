import { Modal, Button } from 'antd/es';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { OrderItemsDto } from '@/dtos/OrderItems.dto';
import ImageWithFallback from '@/components/atoms/images/ImageWithFallback';
import { useIsMobile } from '@/hooks/useDevice';

type DeleteConfirmModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  item?: OrderItemsDto;
  className?: string;
};

const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  item,
  className,
}: DeleteConfirmModalProps) => {
  const isMobile = useIsMobile();

  return (
    <Modal
      className={`${className} ${isMobile ? 'mobile-delete-modal' : ''}`}
      title={
        <div className="flex items-center gap-2 text-red-500">
          <ExclamationCircleOutlined /> Xác nhận xóa sản phẩm
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
    >
      <div className="py-4">
        {item && (
          <div className="flex items-center gap-4 mb-4">
            <div className="w-[60px] h-[60px] shrink-0">
              <ImageWithFallback
                className="w-full h-full object-cover"
                image={item.image}
                alt={item.variant_name}
              />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold">{item.variant_name}</h4>
              {item.variant_configurations?.map((config, idx) => (
                <p key={idx} className="text-sm text-gray-500">
                  {config.name}: {config.value}
                </p>
              ))}
            </div>
          </div>
        )}
        <p className="text-base mb-6">
          Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?
        </p>
        <div className="flex justify-end gap-3">
          <Button onClick={onClose}>Hủy</Button>
          <Button type="primary" danger onClick={onConfirm}>
            Xác nhận xóa
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmModal;
