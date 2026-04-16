import { StaticContentsDto } from '@/dtos/StaticContents.dto';
import { generateSlugToHref } from '@/utils';
import ImageWithFallback from '@/components/atoms/images/ImageWithFallback';
import Link from 'next/link';

type Props = {
  contents?: StaticContentsDto[];
};

export default function BannerSquare({ contents }: Props) {
  if (!contents || contents.length === 0) return null;

  const validItems = contents.filter(
    (item) => item?.images?.[0]?.image?.url,
  );

  if (validItems.length === 0) return null;

  const count = validItems.length;

  const getGridClass = () => {
    switch (count) {
      case 1:
        return 'banner-square-grid banner-square-grid--1';
      case 2:
        return 'banner-square-grid banner-square-grid--2';
      case 3:
        return 'banner-square-grid banner-square-grid--3';
      case 4:
        return 'banner-square-grid banner-square-grid--4';
      case 5:
        return 'banner-square-grid banner-square-grid--5';
      default:
        return 'banner-square-grid banner-square-grid--3';
    }
  };

  return (
    <div className="mt-5">
      <div className={getGridClass()}>
        {validItems.map((item, index) => {
          const image = item.images![0].image;
          const slug = item.properties?.slug;

          const imageContent = (
            <div className="banner-square-item rounded-[10px] overflow-hidden">
              <ImageWithFallback
                image={image!}
                alt={item.title || 'Banner'}
                className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-300"
                unoptimized={true}
              />
            </div>
          );

          return slug ? (
            <Link key={`banner-square-${index}`} href={generateSlugToHref(slug)}>
              {imageContent}
            </Link>
          ) : (
            <div key={`banner-square-${index}`}>{imageContent}</div>
          );
        })}
      </div>

      <style jsx global>{`
        .banner-square-grid {
          display: grid;
          gap: 12px;
        }

        .banner-square-item {
          aspect-ratio: 1 / 1;
          width: 100%;
        }

        /* 1 image: centered */
        .banner-square-grid--1 {
          grid-template-columns: 1fr;
          max-width: 50%;
          margin: 0 auto;
        }

        /* 2 images: full row */
        .banner-square-grid--2 {
          grid-template-columns: repeat(2, 1fr);
        }

        /* 3 images: full row */
        .banner-square-grid--3 {
          grid-template-columns: repeat(3, 1fr);
        }

        /* 4 images: 2x2 */
        .banner-square-grid--4 {
          grid-template-columns: repeat(2, 1fr);
        }

        /* 5 images: 2 + 2 + 1 centered */
        .banner-square-grid--5 {
          grid-template-columns: repeat(2, 1fr);
        }
        .banner-square-grid--5 > *:last-child {
          grid-column: 1 / -1;
          max-width: 50%;
          margin: 0 auto;
        }

        /* Mobile: 1 image per row */
        @media (max-width: 768px) {
          .banner-square-grid--1 {
            max-width: 100%;
          }
          .banner-square-grid--2,
          .banner-square-grid--3,
          .banner-square-grid--4,
          .banner-square-grid--5 {
            grid-template-columns: 1fr;
          }
          .banner-square-grid--5 > *:last-child {
            max-width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
