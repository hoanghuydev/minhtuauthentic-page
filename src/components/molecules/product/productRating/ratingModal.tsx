import { Modal } from 'antd/es';
import { ProductDto } from '@/dtos/Product.dto';
import FormProductRating from './form';
import Image from 'next/image';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  product_id: number;
  product?: ProductDto;
  refreshData: () => void;
};

export default function RatingModal({
  isOpen,
  onClose,
  product_id,
  product,
  refreshData,
}: Props) {
  const handleAfterSubmit = () => {
    // Đóng modal sau khi submit thành công
    onClose();
    refreshData();
  };

  return (
    <Modal
      title={
        <div className="text-center">
          <h3 className="text-lg font-semibold text-primary">
            Đánh giá sản phẩm
          </h3>
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
      destroyOnClose
      className="rating-modal"
      width={700}
    >
      <div>
        {/* Thông tin sản phẩm */}
        {product && (
          <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="relative w-16 h-16 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden">
              {product.feature_image_detail?.image?.url ? (
                <Image
                  src={product.feature_image_detail.image.url}
                  alt={product.name || 'Sản phẩm'}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <span className="text-gray-400 text-xs">No Image</span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-800 line-clamp-2">
                {product.name}
              </h4>
              {product.brands && product.brands.length > 0 && (
                <p className="text-sm text-gray-600 mt-1">
                  Thương hiệu: {product.brands[0]?.brand?.name}
                </p>
              )}
            </div>
          </div>
        )}

        <FormProductRating
          className="w-full"
          refreshData={handleAfterSubmit}
          product_id={product_id}
        />
      </div>
    </Modal>
  );
}
