import type { NextApiRequest } from 'next';
import { Entity, MARKDOWN_SUPPORTED_ENTITIES } from '@/config/enum';
import { ResponseSlugPageDto } from '@/dtos/responseSlugPage.dto';
import { ResponseProductDetailPageDto } from '@/dtos/responseProductDetailPage.dto';
import { ResponseNewsDetailPageDto } from '@/dtos/ResponseNewsDetailPage.dto';
import { ResponseCategoryFilterPageDto } from '@/dtos/responseCategoryFilterPage.dto';
import { CategoryDto } from '@/dtos/Category.dto';
import { BrandDto } from '@/dtos/Brand.dto';
import { htmlToMarkdown } from '@/utils/htmlToMarkdown';

function buildDocument(title: string, seoDescription: string | undefined, body: string, canonical: string) {
  const parts = [`# ${title}`];
  if (seoDescription) {
    parts.push(`> ${seoDescription}`);
  }
  if (body) {
    parts.push(body);
  }
  parts.push(`---\nNguồn: ${canonical}`);
  return parts.join('\n\n');
}

function extractCategoryLike(entity: CategoryDto | BrandDto | undefined) {
  if (!entity) {
    return null;
  }
  const title = entity.seo?.title || entity.name || '';
  const body = htmlToMarkdown(entity.static_components?.[0]?.description);
  return { title, description: entity.seo?.description, body };
}

// Reached both directly (dev/testing) and via middleware.ts rewriting `/<slug>.md`
// or `/<slug>.txt`. In the rewritten case req.url still reflects the original
// suffixed path rather than this file's own API route path, so the slug is
// parsed from req.url instead of relying on the `[...slug]` catch-all's
// req.query.slug.
export function resolveSlugPathFromRequest(
  req: NextApiRequest,
  suffix: string,
  apiPrefix: string,
): string {
  const pathname = decodeURIComponent((req.url || '').split('?')[0]);
  const withoutSuffix = pathname.endsWith(suffix)
    ? pathname.slice(0, -suffix.length)
    : pathname;
  const withoutApiPrefix = withoutSuffix.startsWith(apiPrefix)
    ? withoutSuffix.slice(apiPrefix.length)
    : withoutSuffix;
  return withoutApiPrefix.replace(/^\/+/, '');
}

export async function resolveAiDocument(
  slugPath: string,
): Promise<{ status: number; body: string }> {
  const canonical = process.env.NEXT_PUBLIC_APP_URL + '/' + slugPath;

  const beRes = await fetch(
    `${process.env.BE_URL}/api/pages/slug/${slugPath}`,
  ).catch((error) => {
    console.error('AI document: BE fetch failed', error);
  });

  if (!beRes || !beRes.ok) {
    return { status: 404, body: 'Not found' };
  }

  const payload: { data: ResponseSlugPageDto<unknown> } = await beRes.json();
  const slug = payload?.data;

  if (!slug?.model || !MARKDOWN_SUPPORTED_ENTITIES.includes(slug.model)) {
    return { status: 404, body: 'Not found' };
  }

  let title = '';
  let description: string | undefined;
  let body = '';

  switch (slug.model) {
    case Entity.PRODUCTS: {
      const product = (slug as ResponseSlugPageDto<ResponseProductDetailPageDto>)
        .data?.product;
      if (!product) {
        return { status: 404, body: 'Not found' };
      }
      title = product.seo?.title || product.name || '';
      description = product.seo?.description;
      body = htmlToMarkdown(
        product.product_property?.content || product.product_property?.description,
      );
      break;
    }
    case Entity.NEWS: {
      const news = (slug as ResponseSlugPageDto<ResponseNewsDetailPageDto>).data
        ?.news;
      if (!news) {
        return { status: 404, body: 'Not found' };
      }
      title = news.seo?.title || news.name || '';
      description = news.seo?.description;
      body = htmlToMarkdown(news.content || news.description);
      break;
    }
    case Entity.CATEGORIES: {
      const extracted = extractCategoryLike(
        (slug as ResponseSlugPageDto<ResponseCategoryFilterPageDto>).data
          ?.category,
      );
      if (!extracted) {
        return { status: 404, body: 'Not found' };
      }
      ({ title, description, body } = extracted);
      break;
    }
    case Entity.BRANDS: {
      const extracted = extractCategoryLike(
        (slug as ResponseSlugPageDto<ResponseCategoryFilterPageDto>).data
          ?.brand,
      );
      if (!extracted) {
        return { status: 404, body: 'Not found' };
      }
      ({ title, description, body } = extracted);
      break;
    }
  }

  return { status: 200, body: buildDocument(title, description, body, canonical) };
}
