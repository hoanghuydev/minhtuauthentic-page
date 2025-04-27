import { ResponseNewsDetailPageDto } from '@/dtos/ResponseNewsDetailPage.dto';
import { ResponseSlugPageDto } from '@/dtos/responseSlugPage.dto';
import { twMerge } from 'tailwind-merge';
import NewsClock from '@/components/atoms/news/clock';
import Image from 'next/image';
import { generateSlugToHref } from '@/utils';
import Link from 'next/link';
import BreadcrumbComponent from '@/components/molecules/breakcrumb';
// type Props = {
//     data: ResponseNewsDetailPageDto;
// };
type Props = {
  slug: ResponseSlugPageDto<ResponseNewsDetailPageDto>;
};
const NewsDetailTemplate = ({ slug }: Props) => {
  const data = slug.data;
  const image = data?.news?.images?.[0]?.image;
  return (
    <>
      <BreadcrumbComponent
        label={'Tin tức'}
        link={'/tin-tuc'}
        current={{
          label: data?.news?.name || '',
          link: generateSlugToHref(slug.slug),
        }}
      />
      <div
        className={twMerge(
          'w-full max-rounded-[10px] shadow-custom bg-white overflow-hidden relative mx-auto rounded-[10px] p-3',
        )}
      >
        {data?.news && <NewsClock item={data?.news} />}
        {image && (
          <div className={'w-full lg:w-[650px] p-3 mx-auto'}>
            <Image
              src={image?.url || ''}
              alt={data?.news?.name || ''}
              width={image?.width || 0}
              height={image?.height || 0}
              className={'object-contain w-full h-full '}
            />
          </div>
        )}

        <div
          dangerouslySetInnerHTML={{ __html: data?.news?.description || '' }}
        />
        <div dangerouslySetInnerHTML={{ __html: data?.news?.content || '' }} />
        {(data?.relationNews || [])?.length > 0 && (
          <div
            className={
              'p-3 rounded-[10px] border bg-gray-200 border-gray-200 mt-3'
            }
          >
            <h3 className={'font-[700] lg:font-bold text-xl '}>Xem thêm</h3>
            <ul className={'flex flex-col gap-3'}>
              {data?.relationNews?.map((item, key) => {
                return (
                  <li key={key} className={'p-3 border-b border-gray-200'}>
                    <Link href={generateSlugToHref(item.slugs?.slug)}>
                      {item?.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </>
  );
};
export default NewsDetailTemplate;
