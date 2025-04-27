import getDefaultSeverSide from '@/utils/getDefaultServerSide';

export async function withSettings(
  getServerSidePropsFunc: (...args: unknown[]) => Promise<{ props: unknown }>,
) {
  return async (context: unknown) => {
    const resDefault = await getDefaultSeverSide();
    let pageProps = {};
    if (getServerSidePropsFunc) {
      const result = await getServerSidePropsFunc(context);
      pageProps = result.props || {};
    }

    return {
      props: {
        ...resDefault,
        ...pageProps,
      },
    };
  };
}
