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
      _listComponent.push(
        <HomeBrand
          contents={homePage?.homeBrand}
          setting={settingsHome[SETTING_KEY.BRAND_SECTION.KEY]}
        />,
      );
    }
    if (homePage?.homeSupport) {
      _listComponent.push(<HomeSupport contents={homePage?.homeSupport} />);
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
