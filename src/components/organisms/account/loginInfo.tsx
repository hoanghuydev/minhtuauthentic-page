import Image from 'next/image';
import Link from 'next/link';
import loginPromotionCharacter from '@/static/images/login_promotion.png';
const LoginInfo = () => {
  return (
    <div className="hidden lg:!flex flex-1 bg-gray-50 flex justify-center items-center p-3 lg:p-6">
      <div className="w-full max-w-[840px]">
        <div className="w-full flex flex-col justify-center items-center gap-8 lg:gap-12 relative">
          {/* Header */}
          <div className="w-full flex flex-col justify-center items-center gap-4 lg:gap-6">
            <div className="flex flex-col items-center justify-center text-base lg:text-[20px] font-medium">
              <span className="text-center flex gap-2">
                Chào mừng đến với{' '}
                <span className="text-primary align-middle font-bold text-xl lg:text-2xl">
                  <h1>MINHTUAUTHENTIC</h1>
                </span>
              </span>
              <span className="text-center">
                Xin vui lòng đăng nhập để xem ưu đãi và thanh toán dễ dàng hơn
              </span>
            </div>
          </div>

          {/* Benefits Card */}
          <div className="w-full max-w-[400px] lg:max-w-[600px]">
            <div className="w-full h-fit min-w-[140px] min-h-[140px] relative">
              {/* Decorative corners */}
              <div className="select-none pointer-events-none w-[70px] h-[70px] border-t-[6px] border-l-[6px] border-primary z-10 rounded-tl-[25px] bg-transparent absolute top-[-3px] left-[-3px]">
                <div className="h-[6px] w-[6px] rounded-full bg-primary absolute bottom-[-3px] left-[-6px]"></div>
                <div className="h-[6px] w-[6px] rounded-full bg-primary absolute top-[-6px] right-[-3px]"></div>
              </div>
              <div className="select-none pointer-events-none w-[70px] h-[70px] border-t-[6px] border-r-[6px] border-primary z-10 rounded-tr-[25px] bg-transparent absolute top-[-3px] right-[-3px]">
                <div className="h-[6px] w-[6px] rounded-full bg-primary absolute top-[-6px] left-[-3px]"></div>
                <div className="h-[6px] w-[6px] rounded-full bg-primary absolute bottom-[-3px] right-[-6px]"></div>
              </div>
              <div className="select-none pointer-events-none w-[70px] h-[70px] border-b-[6px] border-l-[6px] border-primary z-10 rounded-bl-[25px] bg-transparent absolute bottom-[-3px] left-[-3px]">
                <div className="h-[6px] w-[6px] rounded-full bg-primary absolute top-[-3px] left-[-6px]"></div>
                <div className="h-[6px] w-[6px] rounded-full bg-primary absolute bottom-[-6px] right-[-3px]"></div>
              </div>
              <div className="select-none pointer-events-none w-[70px] h-[70px] border-b-[6px] border-r-[6px] border-primary z-10 rounded-br-[25px] bg-transparent absolute bottom-[-3px] right-[-3px]">
                <div className="h-[6px] w-[6px] rounded-full bg-primary absolute bottom-[-6px] left-[-3px]"></div>
                <div className="h-[6px] w-[6px] rounded-full bg-primary absolute top-[-3px] right-[-6px]"></div>
              </div>

              {/* Main card content */}
              <div className="min-h-[150px] relative w-full text-sm lg:text-base h-full p-6 lg:p-12 overflow-hidden rounded-[25px] bg-gradient-to-br from-[#F6F6F6] via-[#ECEBEB] to-[#E2E0E0]">
                {/* Benefits list */}
                <div className="w-full flex flex-col gap-2 lg:gap-4 relative">
                  {/* Description */}
                  Chào mừng bạn đến với thiên đường nước hoa chính hãng - nơi
                  hội tụ những chai nước hoa cao cấp từ các thương hiệu nổi
                  tiếng thế giới. Chúng tôi tự hào mang đến cho bạn trải nghiệm
                  mua sắm nước hoa an toàn và chất lượng nhất.
                </div>
              </div>
            </div>

            {/* Mascot image */}
            <Image
              alt="Ant Promotion Smember"
              title="Ant Promotion Smember"
              width={660}
              height={476}
              className="object-contain max-w-[500px] mx-auto w-full mt-[-40px] lg:mt-[-50px] z-10 relative select-none pointer-events-none"
              src={loginPromotionCharacter}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginInfo;
