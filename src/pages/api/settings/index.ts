import { NextApiRequest, NextApiResponse } from 'next';
import { handleDataFetch } from '@/utils/api';
import { ResponseMenuDto } from '@/dtos/responseMenu.dto';
import { ResponseFooterDto } from '@/dtos/responseFooter.dto';
import { SettingsDto } from '@/dtos/Settings.dto';
import { parseCommonSettings } from '@/utils/commonSettings';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    try {
      const [menuResponse, footerResponse, settingsResponse, marqueeResponse] =
        await Promise.all([
          fetch(process.env.BE_URL + '/api/pages/menu').then((res) =>
            res.json(),
          ),
          fetch(process.env.BE_URL + '/api/pages/footer').then((res) =>
            res.json(),
          ),
          fetch(process.env.BE_URL + '/api/pages/settings').then((res) =>
            res.json(),
          ),
          fetch(
            process.env.BE_URL + '/api/pages/static-contents/header-marquee',
          ).then((res) => res.json()),
        ]);

      // Dùng chung với đường SSR trong utils/commonSettings.ts để hai bên không
      // bao giờ lệch nhau.
      const commonSettings = parseCommonSettings(settingsResponse?.data || []);

      res.setHeader(
        'Cache-Control',
        'public, max-age=60, stale-while-revalidate=300',
      );
      res.status(200).json({
        menu: menuResponse?.data || undefined,
        footerContent: footerResponse?.data || undefined,
        settings: settingsResponse?.data as SettingsDto[],
        commonSettings,
        headerMarquee: marqueeResponse?.data || [],
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch data' });
    }
  } else {
    res.status(400).json({ error: 'Only GET requests are allowed' });
  }
}
