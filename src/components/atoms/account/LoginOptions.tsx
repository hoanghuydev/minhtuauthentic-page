import GmailIcon from '@/components/icons/gmail';
import GoogleIcon from '@/components/icons/google';
import Image from 'next/image';
type Props = {
  title?: string;
};
export default function LoginOptions({ title }: Props) {
  const handleLoginWithGmail = () => {
    window.open(
      `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_REDIRECT}&scope=https://www.googleapis.com/auth/userinfo.email&include_granted_scopes=true&response_type=token`,
      '_elfinder_',
      'top=250;left=550;scrollbars=yes,resizable=yes,width=800,height=400',
    );
  };
  return (
    <div className="w-full flex justify-center">
      <button
        onClick={handleLoginWithGmail}
        type="button"
        className="flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed border border-gray-300 text-gray-800 bg-white hover:border-gray-400 hover:bg-gray-50 disabled:border-gray-300 disabled:text-gray-300 disabled:bg-white min-w-[120px] text-base px-4 py-3 min-h-[40px] rounded-md"
      >
        <div className="font-medium text-gray-900 flex items-center gap-2">
          <GoogleIcon className="w-[20px] h-[20px]" />
          Google
        </div>
      </button>
    </div>
  );
}
