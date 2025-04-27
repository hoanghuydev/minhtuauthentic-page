import { Modal } from 'antd/es';
import { ReactNode, useContext, useEffect, useState } from 'react';
import AppContext from '@/contexts/appContext';
import { ResponseSlugPageDto } from '@/dtos/responseSlugPage.dto';
import { ResponseProductDetailPageDto } from '@/dtos/responseProductDetailPage.dto';
import ProductOverview from '@/components/organisms/product/overview';
import Loading from '@/components/atoms/loading';
import { ProductDetailProvider } from '@/contexts/productDetailContext';

export default function PopupProduct() {
  const appCtx = useContext(AppContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ResponseProductDetailPageDto | null>(null);

  useEffect(() => {
    if (appCtx?.isOpenPopupProduct) {
      showModal();
    }
  }, [appCtx?.isOpenPopupProduct]);

  useEffect(() => {
    if (isModalOpen) {
      getProductWithSlug(appCtx?.isOpenPopupProduct || null).then((r) =>
        setData(r),
      );
    } else {
      setData(null);
      appCtx?.setIsOpenPopupProduct && appCtx.setIsOpenPopupProduct(null);
    }
  }, [isModalOpen]);

  const getProductWithSlug = async (
    slug: string | null,
  ): Promise<ResponseProductDetailPageDto | null> => {
    setLoading(true);
    return fetch(`/api/product/${slug}`)
      .then((r) => r.json())
      .then(
        ({
          data,
        }: {
          data: ResponseSlugPageDto<ResponseProductDetailPageDto>;
        }) => {
          setLoading(false);
          return data?.data || null;
        },
      )
      .catch((e) => {
        setLoading(false);
        return null;
      });
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <Modal
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        className={'!w-[98%] lg:!w-[90%] max-lg:top-0'}
        destroyOnClose={true}
      >
        <div className={'py-3'}>
          {loading && <Loading className={'m-auto'} />}
          {data &&
            !loading &&
            data?.product &&
            ((
              <ProductDetailProvider>
                <ProductOverview
                  product={data.product}
                  productConfigurations={data.productConfigurations}
                  settings={data?.settings || []}
                  isShouldSetProductActive={true}
                />
              </ProductDetailProvider>
            ) as ReactNode)}
        </div>
      </Modal>
    </>
  );
}
