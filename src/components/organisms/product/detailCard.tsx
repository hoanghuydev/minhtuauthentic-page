import { ProductDto } from '@/dtos/Product.dto';
import ProductDetailImage from '@/components/molecules/product/image/productDetailImage';
import ProductProperty from '@/components/molecules/product/property';
import { useContext, useEffect, useState } from 'react';
import { ImageDto } from '@/dtos/Image.dto';
import { ProductConfigurationsDto } from '@/dtos/productConfigurations.dto';
import { VariantDto } from '@/dtos/Variant.dto';
import ProductDescription from '@/components/molecules/product/productDescription';
import ProductInformation from '@/components/molecules/product/productInformation';
import ProductQuestionAnswer from '@/components/molecules/product/productQuestionAnswer';
import ProductDealSock from '@/components/molecules/product/productDealSock';
import ListKeyword from '@/components/organisms/product/listKeyword';
import dynamic from 'next/dynamic';
import { SettingsDto } from '@/dtos/Settings.dto';
import { SETTING_KEY } from '@/config/enum';
import { TProductSeen } from '@/config/type';
import ProductOverview from '@/components/organisms/product/overview';
import ProductDetailContext from '@/contexts/productDetailContext';
import Head from 'next/head';
const ProductRating = dynamic(
  () => import('@/components/molecules/product/productRating'),
  {
    ssr: false,
  },
);

const ProductRelationWrapper = dynamic(
  () => import('@/components/organisms/product/productRelationWrapper'),
  {
    ssr: false,
  },
);

const PopupImage = dynamic(
  () => import('@/components/molecules/product/image/popupImage'),
  {
    ssr: false,
  },
);
const ProductSeen = dynamic(
  () => import('@/components/organisms/product/productSeen'),
  {
    ssr: false,
  },
);
type Props = {
  product?: ProductDto;
  relatedProducts: ProductDto[];
  productConfigurations: ProductConfigurationsDto[];
  settings: SettingsDto[];
};
const ProductDetailCard = ({
  product,
  productConfigurations,
  relatedProducts,
  settings,
}: Props) => {
  const [isOpen, setIsOpen] = useState<{
    display: boolean;
    image: ImageDto | null;
  }>({
    display: false,
    image: null,
  });
  const productContext = useContext(ProductDetailContext);
  const defaultVariant = product?.variants?.find(v => v.is_default);
  const productSchema = {
    "@context": "http://schema.org",
    "@type": "Product",
    "name": product?.name ?? '',
    "image": defaultVariant?.images?.map(image => image?.image?.url) || [],
    "description": product?.seo?.description || '',
    "sku": "Mã sku sp",
    "mpn": "Mã do nhà sản xuất cung cấp nếu có",
    "brand": product?.brands?.map(brand => ({
      "@type": "Brand",
      "name": brand?.brand?.name || '',
    })),
    "review": {
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "4",
        "bestRating": "5"
      },
      "author": {
        "@type": "Person",
        "name": "Minh Tú Authentic"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4,7",
      "reviewCount": "9"
    },
    "offers": {
      "@type": "AggregateOffer",
      "url": "URL sản phẩm",
      "priceCurrency": "VND",
      "offerCount": 1,
      "lowPrice": defaultVariant?.regular_price || 0,
      "highPrice": defaultVariant?.price || 0,
      "priceValidUntil": "2026-05-27",
      "itemCondition": "http://schema.org/NewCondition",
      "availability": "http://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": " Minh Tu Authentic",
        "url": "https://minhtuauthentic.com"
      }
    }
  }

  useEffect(() => {
    if (productContext?.setVariantActive && !productContext.variantActive) {
      productContext.setVariantActive(
        (product?.variants || [])?.find(
          (item: VariantDto) => item.is_default,
        ) || product?.variants?.[0],
      );
    }

    const resetItem = () => {
      localStorage.setItem(
        'product_seen',
        JSON.stringify({
          data: [product?.id || 0],
          created: new Date().getTime(),
        } as TProductSeen),
      );
    };
    if (localStorage) {
      const products = localStorage.getItem('product_seen');
      if (products) {
        const _product: TProductSeen = JSON.parse(products);
        if (_product.created < new Date().getTime() - 24 * 60 * 60 * 1000) {
          resetItem();
          return;
        }
        const index = _product.data.findIndex((item) => item == product?.id);
        if (index === -1) {
          _product.data.unshift(product?.id || 0);
          if (_product.data.length > 10) {
            _product.data.pop();
          }
          localStorage.setItem('product_seen', JSON.stringify(_product));
        }
      } else {
        resetItem();
      }
    }
  }, []);

  return (
    <>
      <Head>
        <script type="application/ld+json">
          {JSON.stringify(productSchema)}
        </script>
      </Head>
      {product && (
        <>
          {productContext?.variantActive && (
            <ProductOverview
              product={product}
              productConfigurations={productConfigurations}
              settings={settings}
              setIsOpen={setIsOpen}
            />
          )}
          <ProductDealSock
            setting={settings.find(
              (item) => item.key === SETTING_KEY.DEAL_SOCK_SECTION.KEY,
            )}
          />
          <div
            className={
              'flex flex-col-reverse lg:grid lg:grid-cols-3 gap-3 my-3'
            }
          >
            <div className={'col-span-2'}>
              <ProductDescription product={product} settings={settings} />
              <ListKeyword product={product} />
              <ProductQuestionAnswer
                questions={product?.question_answers || []}
              />
              {product.id && <ProductRating product_id={product.id} />}
              <ProductRelationWrapper
                display={'mobile'}
                products={relatedProducts}
              />
            </div>

            <div>
              <ProductInformation product={product} />
              <ProductRelationWrapper
                display={'desktop'}
                products={relatedProducts}
              />
            </div>
          </div>
          <ProductSeen product={product} />

          <PopupImage
            open={isOpen.display}
            setIsOpen={setIsOpen}
            image={isOpen.image}
            product={product}
          />
        </>
      )}
    </>
  );
};
export default ProductDetailCard;
