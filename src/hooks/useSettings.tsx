import useSWR from 'swr';
import { useEffect, useState } from 'react';
import { PageSetting } from '@/config/type';
const fetcher = () =>
  fetch(`/api/settings`, {
    method: 'GET',
  }).then((res) => res.json());
export default function useSettings(): PageSetting & { isReady: boolean } {
  const { data, error } = useSWR('useSetting', fetcher);
  const [_data, setData] = useState<PageSetting>({
    menu: undefined,
    footerContent: undefined,
    settings: [],
    commonSettings: undefined,
    headerMarquee: [],
  });
  useEffect(() => {
    if (data) {
      setData(data);
    }
  }, [data]);

  // `_app` cần phân biệt "client CHƯA tải xong" với "client đã tải và trả về
  // mảng rỗng". Suy từ `settings.length` thì hai ca đó lẫn nhau: khi BE lỗi
  // (SWR error) mảng đứng ở `[]` vĩnh viễn, và snapshot server bị ghim mãi —
  // một thay đổi trong CMS sẽ không bao giờ tới được trang.
  // CỐ Ý không tính `error` là "xong": khi fetch lỗi, `_data` vẫn đứng ở giá trị
  // khởi tạo, nên coi là xong sẽ để giá trị rỗng thắng dữ liệu server. Fetch lỗi
  // thì giữ snapshot server là hành vi đúng — server có dữ liệu thật.
  return { ..._data, isReady: !!data };
}
