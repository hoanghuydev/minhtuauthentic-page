import { SETTING_KEY } from "@/config/enum"
import HomeNews from "../homeNews"
import {  ReactNode, useEffect, useState } from "react"
import HomeBrand from "../homeBrand"
import HomeSupport from "../homeSupport"
import { SettingOptionDto } from "@/dtos/SettingOption.dto"
import { ResponseHomePageDto } from "@/dtos/responseHomePage.dto"
import { StaticComponentDto } from "@/dtos/StaticComponent.dto"
import { groupBy } from "@/utils"
import HomeCategoryItem from "../homeCategoryItem"
import InfiniteScroll from "react-infinite-scroller"

type Props = {
    homePage: ResponseHomePageDto
    settingsHome: Record<string, SettingOptionDto | undefined>
}

export default function LazyLoadHome({ homePage, settingsHome }: Props) {
    const [blockContents, setBlockContents] = useState<
        Map<number | undefined, StaticComponentDto[]>
    >(new Map());

    const [loadMore, setLoadMore] = useState(false);
    const [page, setPage] = useState(0);

    const [listComponent, setListComponent] = useState<ReactNode[]>([]);

    useEffect(() => {
        const contents = groupBy(
            homePage?.bannerUnderCategory || [],
            (item) => item.properties?.position_index,
        );
        setBlockContents(contents);
    }, []);

    useEffect(() => {
        const _listComponent = (homePage?.homeCategory || []).map((item: StaticComponentDto, key: number) => {
        const position = key % 4 === 0 ? key / 4 : null;
        return (
            <HomeCategoryItem 
            key={key}
            index={key}
            position={position}
            homeBlockFeaturedCategory={homePage?.homeBlockFeaturedCategory || []}
            settingsHome={settingsHome}
            blockContents={blockContents}
            staticComponent={item}
            />
        );
        })
        if(homePage?.homeNews){
            _listComponent.push(
                <HomeNews
                    content={homePage?.homeNews}
                    setting={settingsHome[SETTING_KEY.NEWS_SECTION.KEY]}
                />
            )
        }
        if(homePage?.homeBrand){
            _listComponent.push(
                <HomeBrand
                    contents={homePage?.homeBrand}
                    setting={settingsHome[SETTING_KEY.BRAND_SECTION.KEY]}
                />
            )
        }
        if(homePage?.homeSupport){
            _listComponent.push(
                <HomeSupport
                    contents={homePage?.homeSupport}
                />
            )
        }
        setListComponent(_listComponent);
        setLoadMore(true);
    },[blockContents])
    const loadFunc = (page: number) => {
        if(!listComponent[page]){
            setLoadMore(false);
        }
        setPage(page);
    };

    return (
        <InfiniteScroll
            pageStart={0}
            loadMore={loadFunc}
            hasMore={loadMore}
            loader={<div className="loader" key={0}>Loading ...</div>}
        >
            {Array.from({length: page}).map((_, index) => listComponent[index])}
        </InfiniteScroll>
    )
}

