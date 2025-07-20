import { SETTING_KEY } from '@/config/enum';
import HomeNews from '../homeNews';
import React, { ReactNode, useEffect, useState } from 'react';
import HomeBrand from '../homeBrand';
import HomeSupport from '../homeSupport';
import { SettingOptionDto } from '@/dtos/SettingOption.dto';
import { ResponseHomePageDto } from '@/dtos/responseHomePage.dto';
import { StaticComponentDto } from '@/dtos/StaticComponent.dto';
import { groupBy } from '@/utils';
import HomeCategoryItem from '../homeCategoryItem';
import HomeBannerBrand from '../homeBannerBrand';

type Props = {
  homePage: ResponseHomePageDto;
  settingsHome: Record<string, SettingOptionDto | undefined>;
};

export default function HomeContent({ homePage, settingsHome }: Props) {
  const [blockContents, setBlockContents] = useState<
    Map<number | undefined, StaticComponentDto[]>
  >(new Map());
  const [listComponent, setListComponent] = useState<ReactNode[]>([]);

  useEffect(() => {
    const contents = groupBy(
      homePage?.bannerUnderCategory || [],
      (item) => item.properties?.position_index,
    );
    setBlockContents(contents);
  }, []);

  useEffect(() => {
    const _listComponent = (homePage?.homeCategory || []).map(
      (item: StaticComponentDto, key: number) => {
        const position = key % 4 === 0 ? key / 4 : null;
        return (
          <HomeCategoryItem
            key={key}
            index={key}
            position={position}
            homeBlockFeaturedCategory={
              homePage?.homeBlockFeaturedCategory || []
            }
            settingsHome={settingsHome}
            blockContents={blockContents}
            staticComponent={item}
          />
        );
      },
    );
    if (homePage?.homeNews) {
      _listComponent.push(
        <HomeNews
          content={homePage?.homeNews}
          setting={settingsHome[SETTING_KEY.NEWS_SECTION.KEY]}
        />,
      );
    }
    if (homePage?.homeBrand) {
      const hasBannerBrand =
        homePage?.homeBannerBrand && homePage.homeBannerBrand.length > 0;

      if (hasBannerBrand) {
        // Có banner brand - hiển thị 2 cột
        _listComponent.push(
          <div className="grid grid-cols-1 lg:h-[300px] lg:grid-cols-2 gap-4 mt-3">
            <HomeBannerBrand contents={homePage?.homeBannerBrand} />
            <HomeBrand
              contents={homePage?.homeBrand}
              setting={settingsHome[SETTING_KEY.BRAND_SECTION.KEY]}
              slidePerView={4}
            />
          </div>,
        );
      } else {
        // Không có banner brand - home brand full width
        _listComponent.push(
          <HomeBrand
            contents={homePage?.homeBrand}
            setting={settingsHome[SETTING_KEY.BRAND_SECTION.KEY]}
            slidePerView={6}
          />,
        );
      }
    }
    setListComponent(_listComponent);
  }, [blockContents]);

  return (
    <div className="home-content">
      {listComponent.map((component, index) => (
        <React.Fragment key={index}>{component}</React.Fragment>
      ))}
    </div>
  );
}
