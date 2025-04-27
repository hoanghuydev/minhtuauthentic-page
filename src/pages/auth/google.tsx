import Loading from '@/components/atoms/loading';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import useUser from '@/hooks/useUser';

export default function Google() {
  const router = useRouter();
  const userCookie = useUser();

  useEffect(() => {
    const path = router.asPath.split('access_token=')[1];
    const access_token = path.split('&')[0];
    fetchLogin(access_token);
  }, []);

  const fetchLogin = (access_token: string) => {
    fetch(`/api/loginWithGoogle`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ access_token }),
    })
      .then((res) => res.json())
      .then((response) => {
        if (response?.data) {
          window.opener.postMessage(response.data, '*');
          window.close();
        }
      });
  };

  return (
    <div className={'flex items-center justify-center w-screen h-screen'}>
      <Loading />
    </div>
  );
}
