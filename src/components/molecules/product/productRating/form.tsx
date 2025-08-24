import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from 'antd/es';
import { TextField } from '@mui/material';
import StartRatingInput from '@/components/atoms/product/startRatingInput';
import { toast } from 'react-toastify';

const schema = yup.object({
  name: yup.string().required('Trường này là bắt buộc'),
  phone: yup.string().required('Trường này là bắt buộc'),
  point: yup.number().required('Trường này là bắt buộc'),
  content: yup.string().required('Trường này là bắt buộc'),
  product_id: yup.number().required('Trường này là bắt buộc'),
  is_active: yup.boolean(),
});

type Props = {
  product_id: number;
  refreshData: () => void;
  className?: string;
};

export default function FormProductRating({
  product_id,
  refreshData,
  className,
}: Props) {
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      phone: '',
      point: 5,
      content: '',
      product_id: product_id,
      is_active: false,
    },
  });
  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        data.is_active = false;
        const rs = await fetch('/api/product/rate/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...data }),
        })
          .then((res) => res.json())
          .then((res) => {
            toast(
              'Cảm ơn bạn đã đánh giá sản phẩm, đánh giá của bạn đang chờ duyệt',
            );
          })
          .catch((e) => {
            toast.error('Đánh giá thất bại');
          });
        reset();
        refreshData();
      })}
      className={className}
    >
      <div className={'flex gap-5 flex-col'}>
        <div className={'flex gap-3'}>
          <p>
            Xếp hạng của bạn <span className={'text-red-600'}>*</span>
          </p>
          <Controller
            name={'point'}
            control={control}
            render={({ field }) => <StartRatingInput {...field} />}
          />
        </div>
        <div className={'flex max-lg:flex-col gap-2 w-full'}>
          <div className={'flex flex-col gap-2 flex-1'}>
            <Controller
              name={'name'}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={'Tên của bạn'}
                  required
                  variant="outlined"
                  error={!!errors?.name}
                  helperText={errors?.name?.message}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                    },
                  }}
                />
              )}
            />
          </div>
          <div className={'flex flex-col gap-2 flex-1'}>
            <Controller
              name={'phone'}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={'Số điện thoại'}
                  required
                  variant="outlined"
                  error={!!errors?.phone}
                  helperText={errors?.phone?.message}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                    },
                  }}
                />
              )}
            />
          </div>
        </div>
        <div className={'flex flex-col gap-2'}>
          <Controller
            name={'content'}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={'Đánh giá *'}
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                error={!!errors?.content}
                helperText={errors?.content?.message}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px',
                  },
                }}
              />
            )}
          />
        </div>
      </div>
      <div className={'mt-6 ml-auto text-right'}>
        <Button type="primary" htmlType="submit" className={'bg-primary'}>
          Gửi đánh giá
        </Button>
      </div>
    </form>
  );
}
