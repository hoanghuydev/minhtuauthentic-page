import { twMerge } from 'tailwind-merge';
import { useContext } from 'react';
import OrderContext from '@/contexts/orderContext';
import { isMobile } from 'react-device-detect';
import { useRouter } from 'next/router';
import Link from "next/link";
const HeaderCart = ({
  className,
  classNumber,
}: {
  className?: string;
  classNumber?: string;
}) => {
  const cart = useContext(OrderContext);
  const router = useRouter();

  const renderContent = () => {
      return <>
          <div
              className={
                  'absolute w-full h-full top-0 left-0 flex items-center justify-center'
              }
          >
        <span className={twMerge('text-[14px] pt-3', classNumber)}>
          {cart?.cart?.items?.length || 0}
        </span>
          </div>
          <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 28.95 35.07"
              width="25"
              height="25"
              className="w-full h-full"
          >
              <defs></defs>
              <g id="Layer_2" data-name="Layer 2">
                  <g id="Layer_1-2" data-name="Layer 1">
                      <path
                          d="M10,10.54V5.35A4.44,4.44,0,0,1,14.47.9h0a4.45,4.45,0,0,1,4.45,4.45v5.19"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.8px"
                          fill="none"
                          stroke="#fff"
                      ></path>
                      <path
                          d="M23.47,34.17h-18A4.58,4.58,0,0,1,.91,29.24L2.5,8.78A1.44,1.44,0,0,1,3.94,7.46H25a1.43,1.43,0,0,1,1.43,1.32L28,29.24A4.57,4.57,0,0,1,23.47,34.17Z"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.8px"
                          fill="none"
                          stroke="#fff"
                      ></path>
                  </g>
              </g>
          </svg>
      </>
  }

  return (
    <>
        {
            !isMobile ? <div
                className={twMerge(className, 'relative')}
            >
                {renderContent()}
            </div> :
            <Link className={twMerge(className, 'relative')} href={'/gio-hang/tom-tat'}>
                {renderContent()}
            </Link>
        }
    </>
  );
};
export default HeaderCart;
