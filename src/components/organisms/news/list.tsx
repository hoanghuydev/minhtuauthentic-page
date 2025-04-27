import { NewsDto } from '@/dtos/News.dto';
import NewsItem from '@/components/organisms/news/item';
import { Pagination } from 'antd/es';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ResponseNewsPageDto } from '@/dtos/ResponseNewsPage.dto';

type Props = {
  news: NewsDto[];
  total: number;
  title?: string;
};

export default function NewsList({ news, total, title }: Props) {
  const router = useRouter();
  const queryString = new URLSearchParams(
    router.query as Record<string, string>,
  );
  const [page, setPage] = useState<number>(
    Number(queryString.get('page')) || 1,
  );
  const [count, setCount] = useState(0);
  const [newsList, setNewsList] = useState<NewsDto[]>(news || []);

  useEffect(() => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    updateRouter(params.toString());
  }, [page]);

  useEffect(() => {
    if (count > 1) {
      const params = new URLSearchParams(window.location.search);
      fetch('/api/news?' + params.toString())
        .then((res) => res.json())
        .then((data: { data: ResponseNewsPageDto }) => {
          setNewsList(data?.data?.news || []);
        });
    }
  }, [count]);

  const updateRouter = (params: string) => {
    setCount(count + 1);
    router.push(
      {
        pathname: router.pathname,
        query: params.toString(),
      },
      router.asPath.split('?')[0] + '?' + params,
      { shallow: true },
    );
  };

  return (
    <>
      <h1 className={'text-3xl text-primary font-[700] lg:font-bold mb-3'}>
        {title || 'Tin tức'}
      </h1>
      {newsList.length > 0 ? (
        <>
          <div className={'grid grid-cols-1 lg:grid-cols-3 gap-3'}>
            {newsList.map((item: NewsDto, key: number) => {
              return <NewsItem news={item} key={key} />;
            })}
          </div>
          <Pagination
            className={'mt-6 justify-center'}
            total={total}
            showQuickJumper={true}
            showSizeChanger={false}
            current={page || 1}
            pageSize={10}
            onChange={(page: number) => {
              setPage(page);
            }}
          />
        </>
      ) : (
        <p
          className={
            'text-3xl text-center text-primary font-[700] lg:font-bold'
          }
        >
          Hiện tại không có tin tức nào
        </p>
      )}
    </>
  );
}
