import CheckOutlined from '@ant-design/icons/lib/icons/CheckOutlined';
import QuestionCircleOutlined from '@ant-design/icons/lib/icons/QuestionCircleOutlined';
import { Tooltip } from 'antd/es';
import { ProductConfigurationsDto } from '@/dtos/productConfigurations.dto';
import { ReactNode, useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { VariantDto } from '@/dtos/Variant.dto';
import Link from 'next/link';
import { generateSlugToHref } from '@/utils';
import { ProductConfigurationValuesDto } from '@/dtos/productConfigurationValues.dto';
import { useRouter } from 'next/router';
import orderBy from 'lodash/orderBy';
type Props = {
  productConfigurations: ProductConfigurationsDto[];
  onChange?: (value: StateProps[]) => void;
  value: StateProps[];
  variantMap: Map<number, VariantDto>;
  variants?: VariantDto[];
};
type StateProps = {
  configurationId: number;
  valueId: number;
  variant?: VariantDto;
};
type DisplayProps = Record<
  string,
  {
    configuration: ProductConfigurationsDto;
    values: ProductConfigurationValuesDto[];
  }
>;
export default function ProductConfiguration({
  productConfigurations,
  onChange,
  value,
  variantMap,
  variants,
}: Props) {
  const [valueIdActive, setValueActiveId] = useState<StateProps[]>(value);
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();
  const [displayVariant, setDisplayVariant] = useState<DisplayProps | null>(
    null,
  );

  useEffect(() => {
    const newObj: DisplayProps = {};
    productConfigurations.map((item) => {
      newObj[item?.id || 0] = {
        configuration: item,
        values: [],
      };
    });
    orderBy(variants || [], 'sort')?.map((item) => {
      (item?.variant_product_configuration_values || []).map((value) => {
        if (
          value.product_configuration_value &&
          !newObj[
            value?.product_configuration_value?.product_configuration_id || 0
          ].values.includes(value.product_configuration_value)
        ) {
          newObj[
            value.product_configuration_value?.product_configuration_id || 0
          ].values.push(value.product_configuration_value);
        }
      });
    });
    setDisplayVariant(newObj);
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (isReady) {
      onChange && onChange(valueIdActive);
    }
  }, [valueIdActive]);

  const renderItem = (
    value: ProductConfigurationValuesDto,
    isActived?: StateProps,
    variant?: VariantDto,
  ): ReactNode => {
    return (
      <>
        <span>{value.value}</span>
        {value.description && (
          <QuestionCircleOutlined className={'ml-1 text-gray-400 align-middle'} />
        )}
        {isActived && (
          <span
            className={
              'absolute bg-primary bottom-[-20px] right-[-20px] w-[35px] h-[35px] rotate-45'
            }
          >
            <CheckOutlined
              style={{
                transform: variant?.link
                  ? 'rotate(-45deg) translateX(-4px) translateY(5px)'
                  : 'rotate(-45deg) translateX(-15px) translateY(-3px)',
              }}
              className={'text-white w-[8px] h-[8px]'}
            />
          </span>
        )}
      </>
    ) as ReactNode;
  };

  const withDescriptionTooltip = (
    node: ReactNode,
    value: ProductConfigurationValuesDto,
  ): ReactNode => {
    if (!value.description) {
      return node;
    }
    return (
      <Tooltip
        placement={'top'}
        color={'#ffffff'}
        // để người dùng kịp rê chuột từ nút lên tooltip mà tooltip chưa đóng
        mouseEnterDelay={0.15}
        mouseLeaveDelay={0.4}
        overlayStyle={{ maxWidth: '320px' }}
        styles={{ body: { color: '#333333' } }}
        title={
          <div
            className={'product-configuration-description'}
            dangerouslySetInnerHTML={{ __html: value.description }}
          />
        }
      >
        {node}
      </Tooltip>
    );
  };

  return (
    <>
      {displayVariant &&
        Object.keys(displayVariant).map((key, index) => {
          const data = displayVariant?.[key];
          if (!data || !data.values || !data.configuration) {
            return null;
          }
          const item = data.configuration;
          return (
            <div key={index}>
              <p>{item?.name}: </p>
              <div className={'flex gap-1 lg:gap-3 flex-wrap items-center'}>
                {(data?.values || []).map((value, index2) => {
                  const isActived = (valueIdActive || []).find(
                    (item) => item.valueId === value.id,
                  );
                  if (!value.id) {
                    return null;
                  }
                  const variant = variantMap.get(value.id);
                  if (!variant) {
                    return null;
                  }

                  return (
                    <div
                      key={index + '_' + index2}
                      className={'flex gap-3 flex-wrap'}
                    >
                      {variant?.link &&
                      variant?.is_in_stock &&
                      router.asPath !== generateSlugToHref(variant?.link)
                        ? withDescriptionTooltip(
                            <Link
                              href={generateSlugToHref(variant?.link)}
                              className={twMerge(
                                'rounded-[10px] p-2 lg:p-3 border border-gray-300 relative overflow-hidden font-semibold',
                                isActived ? 'border-primary' : '',
                              )}
                            >
                              {renderItem(value, isActived, variant)}
                            </Link>,
                            value,
                          )
                        : withDescriptionTooltip(
                            <button
                              type={'button'}
                              onClick={() => {
                                setValueActiveId(() => {
                                  const indexConfiguration =
                                    valueIdActive.findIndex(
                                      (_item) =>
                                        _item.configurationId === item.id,
                                    );
                                  const newValue = [...valueIdActive];
                                  newValue[indexConfiguration].valueId =
                                    value.id!;
                                  return newValue;
                                });
                              }}
                              className={twMerge(
                                'rounded-[10px] p-2 lg:p-3 border border-gray-300 relative overflow-hidden font-semibold',
                                isActived ? 'border-primary' : '',
                                !variant?.is_in_stock && 'out-of-stock-variant',
                              )}
                            >
                              {renderItem(value, isActived)}
                            </button>,
                            value,
                          )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
    </>
  );
}
