import GmailIcon from '@/components/icons/gmail';
type Props = {
  title?: string;
}
export default function LoginOptions({title}: Props){
  const handleLoginWithGmail = () => {
    window.open(
      `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_REDIRECT}&scope=https://www.googleapis.com/auth/userinfo.email&include_granted_scopes=true&response_type=token`,
      '_elfinder_',
      'top=250;left=550;scrollbars=yes,resizable=yes,width=800,height=400',
    );
  };
  return (
    <div className={'login-options'}>
      <div className={'login-options-title'}>
          <span className={'relative bg-white px-4 font-bold'}>
            {title}
          </span>
      </div>
      <div className={'w-full flex items-center justify-center'}>
        <div
          className={
            'rounded-[100%] cursor-pointer p-2 border border-gray-200'
          }
        >
          <GmailIcon
            className={'w-[20px] h-[20px] '}
            onClick={handleLoginWithGmail}
          />
        </div>
      </div>
    </div>
  )
}
