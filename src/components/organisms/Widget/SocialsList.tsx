import { useState, useEffect } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { STATIC_COMPONENT_TYPE } from '@/config/enum';
import { StaticContentsDto } from '@/dtos/StaticContents.dto';
import ImageWithFallback from '@/components/atoms/images/ImageWithFallback';

const fetcher = () =>
  fetch('/api/static-contents/' + STATIC_COMPONENT_TYPE.SOCIALS, {
    method: 'GET',
  }).then((res) => res.json());

export default function SocialsList() {
  const { data, error } = useSWR(
    '/api/static-contents/' + STATIC_COMPONENT_TYPE.SOCIALS,
    fetcher,
  );
  const [display, setDisplay] = useState<StaticContentsDto[]>([]);

  useEffect(() => {
    if (data) {
      const socials = data?.data as StaticContentsDto[];
      setDisplay(socials || []);
    }
  }, [data]);

  if (!display || display.length === 0) {
    return null;
  }

  return (
    <div className="mb-3 flex flex-col gap-3">
      {display.map((social, index) => (
        <div
          key={index + '-social'}
          className="flex items-center group bg-[#c52927] text-white rounded-full justify-between"
        >
          <Link
            href={social?.properties?.url?.trim() || '/'}
            className="py-2 pr-[10px] pl-3 flex items-center"
          >
            {social?.title || 'Follow us'}
          </Link>
          <div className="z-[2]">
            <Link href={social?.properties?.url?.trim() || '/'}>
              <ImageWithFallback
                className="w-[42px] h-[42px] object-contain rounded-full"
                image={social?.images?.[0]?.image}
              />
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
