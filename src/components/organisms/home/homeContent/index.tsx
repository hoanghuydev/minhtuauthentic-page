import { SETTING_KEY } from '@/config/enum';
import HomeNews from '../homeNews';
import React, { ReactNode, useMemo } from 'react';
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
  const blockContents = useMemo<Map<string | undefined, StaticComponentDto[]>>(
    () =>
      groupBy(homePage?.bannerUnderCategory || [], (item) =>
        item.properties?.position_index?.toString(),
      ),
    [homePage?.bannerUnderCategory],
  );

  const blockSquareContents = useMemo<
    Map<string | undefined, StaticComponentDto[]>
  >(
    () =>
      groupBy(homePage?.bannerSquare || [], (item) =>
        item.properties?.position_index?.toString(),
      ),
    [homePage?.bannerSquare],
  );

  const listComponent = useMemo<ReactNode[]>(() => {
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
            blockSquareContents={blockSquareContents}
            featuredProductsCategories={homePage?.homeBlockFeaturedProductsCategory || []}
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
      _listComponent.push(
        <HomeBrand
          contents={homePage?.homeBrand}
          setting={settingsHome[SETTING_KEY.BRAND_SECTION.KEY]}
          homeBannerBrand={homePage?.homeBannerBrand}
        />,
      );
    }
    return _listComponent;
  }, [homePage, settingsHome, blockContents, blockSquareContents]);

  return (
    <div className="home-content">
      {listComponent.map((component, index) => (
        <React.Fragment key={index}>{component}</React.Fragment>
      ))}
    </div>
  );
}
