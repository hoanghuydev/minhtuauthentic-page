import type { NextApiRequest, NextApiResponse } from 'next';
import { resolveAiDocument, resolveSlugPathFromRequest } from '@/utils/aiDocument';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD');
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }

  const slugPath = resolveSlugPathFromRequest(req, '.txt', '/api/text/');
  const { status, body } = await resolveAiDocument(slugPath);

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  if (status === 200) {
    res.setHeader(
      'Cache-Control',
      'public, max-age=300, stale-while-revalidate=3600',
    );
    res.setHeader('Content-Length', Buffer.byteLength(body));
  }

  if (req.method === 'HEAD') {
    res.status(status).end();
    return;
  }
  res.status(status).send(body);
}
