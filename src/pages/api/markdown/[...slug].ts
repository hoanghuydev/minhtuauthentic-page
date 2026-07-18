import type { NextApiRequest, NextApiResponse } from 'next';
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

// Reached both directly (dev/testing) and via middleware.ts rewriting `/<slug>.md`.
// In the rewritten case req.url still reflects the original `.md` path rather than
// this file's own `/api/markdown/...` path, so the slug is parsed from req.url
// instead of relying on the `[...slug]` catch-all's `req.query.slug`.
function resolveSlugPath(req: NextApiRequest): string {
  const pathname = decodeURIComponent((req.url || '').split('?')[0]);
  const withoutMdSuffix = pathname.endsWith('.md')
    ? pathname.slice(0, -'.md'.length)
    : pathname;
  const withoutApiPrefix = withoutMdSuffix.startsWith('/api/markdown/')
    ? withoutMdSuffix.slice('/api/markdown/'.length)
    : withoutMdSuffix;
  return withoutApiPrefix.replace(/^\/+/, '');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }

  const slugPath = resolveSlugPath(req);
  const canonical = process.env.NEXT_PUBLIC_APP_URL + '/' + slugPath;

  const beRes = await fetch(
    `${process.env.BE_URL}/api/pages/slug/${slugPath}`,
  ).catch((error) => {
    console.error('markdown route: BE fetch failed', error);
  });

  if (!beRes || !beRes.ok) {
    res.status(404).send('Not found');
    return;
  }

  const payload: { data: ResponseSlugPageDto<unknown> } = await beRes.json();
  const slug = payload?.data;

  if (!slug?.model || !MARKDOWN_SUPPORTED_ENTITIES.includes(slug.model)) {
    res.status(404).send('Not found');
    return;
  }

  let title = '';
  let description: string | undefined;
  let body = '';

  switch (slug.model) {
    case Entity.PRODUCTS: {
      const product = (slug as ResponseSlugPageDto<ResponseProductDetailPageDto>)
        .data?.product;
      if (!product) {
        res.status(404).send('Not found');
        return;
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
        res.status(404).send('Not found');
        return;
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
        res.status(404).send('Not found');
        return;
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
        res.status(404).send('Not found');
        return;
      }
      ({ title, description, body } = extracted);
      break;
    }
  }

  const markdown = buildDocument(title, description, body, canonical);

  res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
  res.setHeader(
    'Cache-Control',
    'public, max-age=300, stale-while-revalidate=3600',
  );
  res.status(200).send(markdown);
}
