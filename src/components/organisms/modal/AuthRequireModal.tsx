import React from 'react'
import { Modal, Button } from 'antd'
import Image from 'next/image'
import characterShow from '@/static/images/character-show.png'
import Link from 'next/link'
import { CloseOutlined } from '@ant-design/icons'

interface AuthRequireModalProps {
  open: boolean
  onClose: () => void,
  redirectUrl: string
}

const AuthRequireModal = ({ open, onClose, redirectUrl }: AuthRequireModalProps) => {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      closable={false}
      width={370}
      className="auth-require-modal"
      maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
      closeIcon={
        <div 
          className="flex items-center justify-center w-8 h-8 rounded-full cursor-pointer"
          style={{ backgroundColor: 'hsla(0, 0%, 4%, .2)' }}
          onClick={onClose}
        >
          <CloseOutlined className="text-white text-sm" />
        </div>
      }
    >
      <div className="relative">
        <div 
          className="absolute -top-4 -right-4 flex items-center justify-center w-8 h-8 rounded-full cursor-pointer z-10"
          style={{ backgroundColor: 'hsla(0, 0%, 4%, .2)' }}
          onClick={onClose}
        >
          <CloseOutlined className="text-white text-sm" />
        </div>
        
        <div className="flex flex-col items-center p-1 gap-2">
          <div className="flex flex-col items-center justify-center mb-4">
            <span className="text-xl font-semibold text-primary text-center">Minhtuauthentic</span>
            <Image
              src={characterShow}
              height={80}
              width={80}
              alt="cps-smember-icon"
              className="h-20"
            />
          </div>
          
          <div className="text-center mb-6">
            <p className="text-gray-700 font-semibold">
              Vui lòng đăng nhập tài khoản Minhtuauthentic để xem ưu đãi và thanh toán dễ dàng hơn.
            </p>
          </div>
          
          <div className="flex gap-4 w-fit">
            <Link  
              href={"/tai-khoan/dang-ky?redirectUrl=" + redirectUrl} 
              className="flex-1 text-md truncate border-primary border-[2.5px] rounded-md !text-primary py-2 px-4 text-center transition-transform hover:scale-105"
            >
              Đăng ký
            </Link>
            <Link
              href={"/tai-khoan/dang-nhap?redirectUrl=" + redirectUrl} 
              className="flex-1 whitespace-nowrap !text-[16px] !text-white w-fit py-2 px-4 rounded-md text-center transition-transform hover:scale-105"
              style={{ backgroundImage: 'linear-gradient(90deg, #ff512f, #dd2440 51%, #ff512f)' }}
            >
              Đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default AuthRequireModal