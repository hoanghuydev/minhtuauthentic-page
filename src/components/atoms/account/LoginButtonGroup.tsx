import { Button } from 'antd';
import Link from 'next/link';
type Props = {
  mainTitle?: string;
  secondaryTitle?: string;
  secondarySubTitle?: string;
  secondaryHref: string;
};
export default function LoginButtonGroup({
  mainTitle,
  secondaryTitle,
  secondaryHref,
  secondarySubTitle,
}: Props) {
  return (
    <div className={'flex flex-col justify-between items-center'}>
      <Button type="primary" htmlType={'submit'} className={'w-full'}>
        {mainTitle}
      </Button>
      <div className={'text-[12px] mt-3'}>
        <span>
          Quên mật khẩu?{' '}
          <Link
            className={'text-primary font-bold'}
            href={'/tai-khoan/quen-mat-khau'}
          >
            Gửi lại email
          </Link>
        </span>
      </div>
      <div className={'text-[12px] mt-3'}>
        <span className={'text-grey-50'}>{secondarySubTitle} </span>
        <Link className={'text-primary font-bold'} href={secondaryHref}>
          {secondaryTitle}
        </Link>
      </div>
    </div>
  );
}
