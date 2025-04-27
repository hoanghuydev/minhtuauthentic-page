import useSWR from 'swr';
import { useEffect, useState } from 'react';
import { PageSetting } from '@/config/type';
const fetcher = () =>
  fetch(`/api/settings`, {
    method: 'GET',
  }).then((res) => res.json());
export default function useSettings(): PageSetting {
  const { data, error, isLoading, isValidating } = useSWR(
    'useSetting',
    fetcher,
  );
  const [_data, setData] = useState<PageSetting>({
    menu: undefined,
    footerContent: undefined,
    settings: [],
    commonSettings: undefined,
  });
  useEffect(() => {
    if (data) {
      setData(data);
    }
  }, [data]);

  return _data;
}
