import { Modal } from 'antd/es';
import { ReactNode, useContext, useEffect, useState } from 'react';
import AppContext from '@/contexts/appContext';
import { ResponseSlugPageDto } from '@/dtos/responseSlugPage.dto';
import { ResponseProductDetailPageDto } from '@/dtos/responseProductDetailPage.dto';
import ProductOverview from '@/components/organisms/product/overview';
import Loading from '@/components/atoms/loading';
import { ProductDetailProvider } from '@/contexts/productDetailContext';
import ProductQuickView from '@/components/organisms/product/quickView';

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

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <Modal
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        className={'!w-[98%] sm:!w-[80%] lg:!w-[65%] xl:!w-[50%] !max-h-[80%]'}
        destroyOnClose={true}
      >
        <div className={'py-3'}>
          {loading && <Loading className={'m-auto'} />}
          {data &&
            !loading &&
            data?.product &&
            ((
              <ProductDetailProvider>
                <ProductQuickView
                  product={data.product}
                  productConfigurations={data.productConfigurations}
                  isShouldSetProductActive={true}
                  setQuickViewModal={setIsModalOpen}
                />
              </ProductDetailProvider>
            ) as ReactNode)}
        </div>
      </Modal>
    </>
  );
}
