import { useEffect, useId, useMemo, useState } from 'react';
import { AddressesDto } from '@/dtos/Addresses.dto';
import Select from 'antd/es/select';
import { Control } from 'react-hook-form';
import ListFieldFormAddress from '@/components/organisms/address/listField';
import { twMerge } from 'tailwind-merge';
import FormControl from '@/components/molecules/form/FormControl';
import useUser from "@/hooks/useUser";
type Props = {
  setValue: any;
  setFullAddress: any;
  errors: any;
  control: Control<any>;
  watch: any;
};
export default function CheckoutAddress({
  setValue,
  setFullAddress,
  control,
  watch,
  errors,
}: Props) {
  const id = useId();
  const user = useUser();
  const [addresses, setAddresses] = useState<AddressesDto[]>([]);
  const [address, setAddress] = useState<AddressesDto | undefined>();
  useEffect(() => {
    getListAddress().catch();
  }, []);

  useEffect(() => {
    if (setValue && address) {
      setValue('address', address?.shipping_address);
      setValue('email', address?.email);
      setValue('name', address?.name);
      setValue('phone', address?.phone);
      setValue('shipping_city', address?.city?.code);
      setValue('shipping_district', address?.district?.code);
      setValue('shipping_ward', address?.ward?.code);
      setFullAddress(address);
    }
  }, [address]);

  const getListAddress = async (isGetLast?: boolean) => {
    const rs: { data: AddressesDto[] } = await fetch(`/api/orders/addresses`, {
      method: 'GET',
    }).then((res) => res.json());
    setAddresses(rs?.data || []);
    if (rs?.data?.length && !address) {
      const address = rs?.data.find((i) => i.is_default);
      if (!address) {
        if (isGetLast) setAddress(rs?.data[rs?.data?.length - 1]);
        else setAddress(rs?.data[0]);
      } else {
        setAddress(address);
      }
    }
  };

  const renderSelectAddress = () => {
    return (
      <div>
          {addresses?.length > 0 && <Select
              value={address?.id || id}
              options={addresses.map((item) => ({
                  label:
                      item?.shipping_address +
                      ', ' +
                      item?.ward?.full_name +
                      ', ' +
                      item?.district?.full_name +
                      ', ' +
                      item?.city?.full_name,
                  value: item?.id,
              }))}
              onChange={(item) => setAddress(addresses.find((i) => i.id === item))}
          />}
      </div>
    );
  };

  return (
    <>
      <div className={'flex flex-col'}>
        <div className={'flex justify-between'}>
          <h3 className={'text-3xl font-[700] lg:font-bold mb-6'}>
            Thông tin vận chuyển
          </h3>
        </div>

        {renderSelectAddress()}
        <div
          className={twMerge(
            'grid grid-col-1 lg:grid-col-2 gap-1 lg:gap-3 mt-3',
          )}
        >
          <ListFieldFormAddress
            key={address?.id || id}
            watch={watch}
            control={control}
            setValue={setValue}
            errors={errors}
            isWaitForInit={!!address}
          />
          <FormControl
            control={control}
            errors={errors}
            name={'address'}
            type={'text'}
            placeholder={'Tên đường, số nhà'}
            className={'col-span-2'}
          />
        </div>
      </div>
    </>
  );
}
