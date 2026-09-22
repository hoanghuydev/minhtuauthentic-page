import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { ProductDto } from '@/dtos/Product.dto';
import { VariantDto } from '@/dtos/Variant.dto';

type SelectOption = {
  label: string;
  value: number;
};

type Props = {
  product: ProductDto;
  onChange: (variant_id: VariantDto) => void;
  defaultVariant?: VariantDto;
  preloadVariants?: boolean; // Thêm prop để kiểm soát việc preload variants
};

export default function SelectVariant({
  product,
  onChange,
  defaultVariant,
  preloadVariants = false, // Mặc định là false
}: Props) {
  const [isFetch, setIsFetch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [listVariant, setListVariant] = useState<VariantDto[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<number>(
    defaultVariant?.id || 0,
  );
  // Chặn gọi trùng: pointerenter, pointerdown và focus có thể cùng bắn ra trong
  // một lần người dùng chạm vào select.
  const inflight = useRef(false);
  // Trang chủ có ~168 select. Rê chuột lướt ngang lưới sẽ bắn hàng chục request
  // nếu tải ngay ở pointerenter, nên chờ người dùng dừng lại một nhịp.
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadOptions = useCallback(() => {
    if (isFetch || inflight.current) {
      return;
    }
    inflight.current = true;
    setIsLoading(true);
    fetch('/api/product/variants/' + product.id)
      .then((res) => res.json())
      .then((res: { statusCode: number; data: VariantDto[] }) => {
        // pages/api/product/variants/[id].ts LUÔN trả HTTP 200, kể cả khi BE
        // hỏng thì body vẫn là {"data":null,"statusCode":500} — nên kiểm `res.ok`
        // là vô nghĩa. Chốt theo payload: chưa có mảng data thì coi như chưa tải
        // được, để `isFetch` giữ false và lần chạm sau còn thử lại.
        if (!Array.isArray(res?.data)) {
          throw new Error('payload variants không hợp lệ');
        }
        const listOptions: SelectOption[] = [];
        const data = res.data;
        data.map((item) => {
          const prefixLabel =
            item?.variant_product_configuration_values?.[0]
              ?.product_configuration_value?.product_configuration?.name;
          const suffixLabel =
            item?.variant_product_configuration_values?.[0]
              ?.product_configuration_value?.value;
          const label = `${prefixLabel}: ${suffixLabel}`;
          listOptions.push({
            label,
            value: item.id || 0,
          });
        });
        setListVariant(data);
        setOptions(listOptions);
        setIsFetch(true);
      })
      .catch(() => {
        // Để nguyên isFetch = false: lần chạm sau sẽ thử lại.
      })
      .finally(() => {
        inflight.current = false;
        setIsLoading(false);
      });
  }, [isFetch, product.id]);

  const cancelHoverLoad = useCallback(() => {
    if (hoverTimer.current) {
      clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
  }, []);

  const scheduleHoverLoad = useCallback(() => {
    if (isFetch || inflight.current || hoverTimer.current) {
      return;
    }
    hoverTimer.current = setTimeout(() => {
      hoverTimer.current = null;
      loadOptions();
    }, 180);
  }, [isFetch, loadOptions]);

  useEffect(() => cancelHoverLoad, [cancelHoverLoad]);

  // Cập nhật selectedVariant khi defaultVariant thay đổi
  useEffect(() => {
    if (defaultVariant && defaultVariant.id !== selectedVariant) {
      setSelectedVariant(defaultVariant.id || 0);
    }
  }, [defaultVariant]);

  // Chỉ tải options khi component mount nếu preloadVariants là true
  useEffect(() => {
    if (preloadVariants && !isFetch) {
      loadOptions();
    }
  }, [preloadVariants]);

  return (
    <div className={'px-1 lg:px-2'}>
      <select
        className={'p-2 rounded border w-full truncate'}
        value={selectedVariant}
        onChange={(e: ChangeEvent<HTMLSelectElement>) => {
          const value = parseInt(e.target.value);
          setSelectedVariant(value);
          if (value !== 0) {
            const variant: VariantDto | undefined = listVariant.find(
              (item) => item.id === value,
            );
            variant && onChange(variant);
          }
        }}
        // KHÔNG dùng onClick. Với <select> native, Chrome mở popup ngay ở
        // mousedown và chỉ dispatch `click` SAU KHI popup đóng lại — nên gọi
        // fetch trong onClick khiến danh sách size chỉ được tải khi người dùng
        // đã tắt select đi, phải mở lần thứ hai mới thấy.
        //
        // pointerenter: chuột dừng lại 180ms (desktop) — tải xong trước khi bấm.
        // pointerdown : bắn TRƯỚC khi popup mở, phủ cả chạm trên mobile.
        // focus       : phủ đường bàn phím (Tab rồi Space/Enter).
        onPointerEnter={scheduleHoverLoad}
        onPointerLeave={cancelHoverLoad}
        onPointerDown={() => {
          cancelHoverLoad();
          loadOptions();
        }}
        // focus cũng phải qua ngưỡng: giữ Tab lướt qua trang chủ là đi qua 168
        // select, gọi thẳng loadOptions ở đây bắn ~168 request.
        onFocus={scheduleHoverLoad}
        onBlur={cancelHoverLoad}
      >
        <option value="0">Mời chọn size</option>
        {isLoading && options.length === 0 && (
          <option value="0" disabled>
            Đang tải...
          </option>
        )}
        {options.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </div>
  );
}
