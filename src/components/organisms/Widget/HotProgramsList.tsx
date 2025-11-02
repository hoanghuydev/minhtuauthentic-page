import { useState, useEffect } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { STATIC_CONTENT_TYPE } from '@/config/enum';
import { StaticContentsDto } from '@/dtos/StaticContents.dto';
import Image from 'next/image';

const fetcher = () =>
  fetch('/api/static-contents/' + STATIC_CONTENT_TYPE.HOT_PROGRAM, {
    method: 'GET',
  }).then((res) => res.json());

export default function HotProgramsList() {
  const { data, error } = useSWR(
    '/api/static-contents/' + STATIC_CONTENT_TYPE.HOT_PROGRAM,
    fetcher,
  );
  const [display, setDisplay] = useState<StaticContentsDto[]>([]);

  useEffect(() => {
    if (data) {
      const programs = data?.data as StaticContentsDto[];
      setDisplay(programs || []);
    }
  }, [data]);

  if (!display || display.length === 0) {
    return null;
  }

  return (
    <div className="mb-3 flex flex-col gap-3">
      {display.map((program, index) => (
        <div
          key={index + '-hot-program'}
          className="flex items-center group bg-red-500 text-white rounded-full justify-between shadow-lg"
        >
          <Link
            href={program?.properties?.url?.trim() || '/'}
            className="py-2 pr-[10px] pl-3 flex items-center"
          >
            {program?.title || 'Hot Program'}
          </Link>
          <div className="z-[2]">
            <Link href={program?.properties?.url?.trim() || '/'}>
              {program.images?.[0]?.image?.url ? (
                <Image
                  src={program.images[0].image.url}
                  alt={program.images[0].image.alt || program.title || 'Hot program'}
                  width={42}
                  height={42}
                  className="w-[42px] h-[42px] object-contain rounded-full bg-white p-1"
                />
              ) : (
                <div className="w-[42px] h-[42px] bg-white rounded-full flex items-center justify-center">
                  <span className="text-red-500 text-lg">🔥</span>
                </div>
              )}
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
