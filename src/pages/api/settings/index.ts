import { NextApiRequest, NextApiResponse } from 'next';
import { handleDataFetch } from '@/utils/api';
import { ResponseMenuDto } from '@/dtos/responseMenu.dto';
import { ResponseFooterDto } from '@/dtos/responseFooter.dto';
import { SettingsDto } from '@/dtos/Settings.dto';
import CommonSettingDto from '@/dtos/CommonSetting.dto';
import { SETTING_KEY } from '@/config/enum';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    try {
      const [menuResponse, footerResponse, settingsResponse, homeResponse] =
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
          fetch(process.env.BE_URL + '/api/pages/home').then((res) =>
            res.json(),
          ),
        ]);

      const commonSettings: CommonSettingDto = new CommonSettingDto();
      settingsResponse?.data?.map((setting: SettingsDto) => {
        switch (setting.key) {
          case SETTING_KEY.GENERAL.PRIMARY_COLOR.KEY:
            commonSettings.primaryColor = setting.value?.backgroundColor;
            break;
          case SETTING_KEY.GENERAL.EVENT_BUTTON_TITLE.KEY:
            commonSettings.eventButtonTitle = setting.value?.title;
            break;
          case SETTING_KEY.GENERAL.SWIPER_SPEED.KEY:
            commonSettings.swiperSpeed = setting.value?.speed;
            break;
        }
      });

      res.status(200).json({
        menu: menuResponse?.data || undefined,
        footerContent: footerResponse?.data || undefined,
        settings: settingsResponse?.data as SettingsDto[],
        commonSettings,
        headerMarquee: homeResponse?.data?.headerMarquee || [],
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch data' });
    }
  } else {
    res.status(400).json({ error: 'Only GET requests are allowed' });
  }
}
