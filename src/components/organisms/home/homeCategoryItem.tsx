import HomeFeatureCategory from "./homeFeatureCategory";

import { SETTING_KEY } from "@/config/enum";

import { Fragment } from "react";

import GroupCategory from "../groupCategory";
import BannerUnderCategory from "./bannerUnderCategory";
import { StaticComponentDto } from "@/dtos/StaticComponent.dto";
import { StaticContentsDto } from "@/dtos/StaticContents.dto";
import { SettingOptionDto } from "@/dtos/SettingOption.dto";

type Props = {
    index: number;
    position: number | null;
    homeBlockFeaturedCategory: StaticContentsDto[];
    settingsHome: Record<string, SettingOptionDto | undefined>;
    blockContents: Map<number | undefined, StaticComponentDto[]>;
    staticComponent: StaticComponentDto;
}

export default function HomeCategoryItem({index, position, homeBlockFeaturedCategory, settingsHome, blockContents, staticComponent}: Props) {
    return (
        <Fragment key={'GroupCategory_' + index}>
          {position !== null && (
            <BannerUnderCategory
              key={index + 'banner-under-category'}
              contents={blockContents.get(position) || []}
            />
          )}
          {position === 0 && homeBlockFeaturedCategory && (
            <HomeFeatureCategory
              contents={homeBlockFeaturedCategory || []}
              setting={settingsHome[SETTING_KEY.FEATURE_CATEGORY.KEY]}
            />
          )}
          <GroupCategory staticComponent={staticComponent} />
        </Fragment>
    )
}
