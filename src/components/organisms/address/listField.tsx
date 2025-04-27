import useSWR from 'swr';
import { useCallback, useEffect, useState } from 'react';
import { PROVINCE } from '@/config/enum';
import { ProvinceDto } from '@/dtos/Province.dto';
import FormControl from '@/components/molecules/form/FormControl';
import { toast } from 'react-toastify';

const fetcher = () =>
  fetch(`/api/orders/province`, {
    method: 'GET',
  }).then((res) => res.json());
type Props = {
  watch: any;
  setValue: any;
  control: any;
  errors: any;
  isWaitForInit?: boolean;
};
export default function ListFieldFormAddress({
  watch,
  setValue,
  control,
  errors,
  isWaitForInit,
}: Props) {
  const { data: provinceData, error } = useSWR('/api/orders/province', fetcher);
  const [districts, setDistricts] = useState<ProvinceDto[]>([]);
  const [wards, setWards] = useState<ProvinceDto[]>([]);
  const [ready, setReady] = useState<boolean>(false);

  useEffect(() => {
    if (!isWaitForInit) {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (!ready && districts.length > 0 && wards.length > 0) {
      setReady(true);
    }
  }, [districts, wards]);

  useEffect(() => {
    if (watch('shipping_city')) {
      fetchDataProvince(PROVINCE.DISTRICT, watch('shipping_city')).then(
        (rs) => {
          setDistricts(rs?.data || []);
          if (isWaitForInit) {
            if (ready) {
              setValue('shipping_ward', '');
              setValue('shipping_district', '');
              setWards([]);
            }
          } else {
            setValue('shipping_ward', '');
            setValue('shipping_district', '');
            setWards([]);
          }
        },
      );
    }
  }, [watch('shipping_city')]);
  useEffect(() => {
    if (watch('shipping_district')) {
      fetchDataProvince(PROVINCE.WARD, watch('shipping_district')).then(
        (rs) => {
          setWards(rs?.data || []);
          if (isWaitForInit) {
            if (ready) {
              setValue('shipping_ward', '');
            }
          } else {
            setValue('shipping_ward', '');
          }
        },
      );
    }
  }, [watch('shipping_district')]);

  const fetchDataProvince = useCallback(
    async (parent_key: string, parent_id: string) => {
      const query = new URLSearchParams();
      query.append('parent_key', parent_key);
      query.append('parent_id', parent_id);
      return await fetch('/api/orders/province?' + query.toString(), {
        method: 'GET',
      }).then((rs) => rs.json());
    },
    [],
  );

  return (
    <>
      <FormControl
        control={control}
        errors={errors}
        name={'name'}
        type={'text'}
        placeholder={'Tên người nhận'}
        className={'col-span-2'}
      />
      <FormControl
        control={control}
        errors={errors}
        name={'email'}
        type={'text'}
        placeholder={'Email'}
      />
      <FormControl
        control={control}
        errors={errors}
        name={'phone'}
        type={'text'}
        placeholder={'Số điện thoại'}
      />
      {ready && (
        <>
          <FormControl
            control={control}
            errors={errors}
            className={'col-span-2'}
            selectOptions={((provinceData as any)?.data || []).map(
              (item: ProvinceDto) => {
                return {
                  label: item?.full_name,
                  value: item?.code,
                  code_name: item?.code_name,
                };
              },
            )}
            name={'shipping_city'}
            type={'select'}
            placeholder={'Tỉnh/ Thành phố'}
          />
          <FormControl
            control={control}
            errors={errors}
            selectOptions={(districts || []).map((item: any) => {
              return {
                label: item?.full_name,
                value: item?.code,
              };
            })}
            name={'shipping_district'}
            type={'select'}
            placeholder={'Quận/ Huyện'}
          />
          <FormControl
            control={control}
            errors={errors}
            selectOptions={(wards || []).map((item: any) => {
              return {
                label: item?.full_name,
                value: item?.code,
              };
            })}
            name={'shipping_ward'}
            type={'select'}
            placeholder={'Phường/ Xã'}
          />
        </>
      )}
    </>
  );
}
