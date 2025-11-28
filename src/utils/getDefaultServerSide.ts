import { handleHeader } from '@/utils/api';
import { UserDto } from '@/dtos/User.dto';
import { NextApiRequestCookies } from 'next/dist/server/api-utils';
import { ResponseMenuDto } from '@/dtos/responseMenu.dto';
import { ResponseFooterDto } from '@/dtos/responseFooter.dto';
import { SettingsDto } from '@/dtos/Settings.dto';
import { getCookie } from '@/utils';

export default async function getDefaultSeverSide(): Promise<{
  menu: ResponseMenuDto | undefined;
  footerContent: ResponseFooterDto | undefined;
  settings: SettingsDto[];
  headerMarquee?: any[];
}> {
  const resMenu: { data: ResponseMenuDto } = await fetch(
    process.env.BE_URL + '/api/pages/menu',
  )
    .then((res) => res.json())
    .catch((error) => {
      return null;
    });
  const resFooter: { data: ResponseFooterDto } = await fetch(
    process.env.BE_URL + '/api/pages/footer',
  )
    .then((res) => res.json())
    .catch((error) => {
      return null;
    });
  const resSetting: { data: SettingsDto[] } = await fetch(
    process.env.BE_URL + '/api/pages/settings',
  )
    .then((res) => res.json())
    .catch((error) => {
      return null;
    });
  const resHome: { data: any } = await fetch(
    process.env.BE_URL + '/api/pages/home',
  )
    .then((res) => res.json())
    .catch((error) => {
      return null;
    });
  return {
    menu: resMenu?.data || undefined,
    footerContent: resFooter?.data || undefined,
    settings: resSetting?.data as SettingsDto[],
    headerMarquee: resHome?.data?.headerMarquee || [],
  };
}

export async function getProfile(
  cookies: NextApiRequestCookies,
): Promise<UserDto> {
  try {
    // First try to get user data from cookies
    let userData = null;

    // Try to get from cookies.user first
    if (cookies.user) {
      try {
        userData = JSON.parse(cookies.user);
      } catch (error) {
        // If parsing fails, try to decode URL-encoded data
        try {
          userData = JSON.parse(decodeURIComponent(cookies.user));
        } catch (decodeError) {
          console.error('Error parsing user cookie:', decodeError);
        }
      }
    }

    // If we have user data, try to fetch profile from API
    if (userData?.token) {
      const url = `${process.env.BE_URL}/api/users/profile`;
      const profile = await fetch(url, {
        method: 'GET',
        headers: handleHeader(userData.token),
      })
        .then((response) => response.json())
        .then((data) => {
          return data?.data;
        })
        .catch((error) => {
          console.error('Error fetching profile from API:', error);
          return null;
        });

      // If API call succeeds, return profile data
      if (profile) {
        return profile;
      }
    }

    // If API call fails or no token, return user data from cookies as fallback
    if (userData) {
      return {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        phone: userData.phone,
        email_approved_at: userData.email_approved_at,
        token: userData.token,
      } as UserDto;
    }

    return {} as UserDto;
  } catch (error) {
    console.error('Error in getProfile:', error);
    return {} as UserDto;
  }
}

export async function getHomeSupport(): Promise<{
  homeSupport: any[];
  supportSetting: any;
}> {
  try {
    const response = await fetch(`${process.env.BE_URL}/api/pages/home`);
    if (!response.ok) {
      return {
        homeSupport: [],
        supportSetting: undefined,
      };
    }

    const data: { data: any } = await response.json();
    const homePage = data?.data || {};

    // Transform settings to object
    const settingsHome = (homePage?.settings || []).reduce(
      (acc: any, item: any) => {
        if (item?.key) {
          acc[item.key] = item?.value;
        }
        return acc;
      },
      {},
    );

    return {
      homeSupport: homePage?.homeSupport || [],
      supportSetting: settingsHome['support_section'],
    };
  } catch (error) {
    console.error('Failed to fetch home support data:', error);
    return {
      homeSupport: [],
      supportSetting: undefined,
    };
  }
}
