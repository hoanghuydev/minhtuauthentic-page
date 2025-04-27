import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const url = `${process.env.BE_URL}/api/pages/feature-category?limit=12`;

  if (req.method === 'GET') {
    const config: Record<string, unknown> = {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': req.headers['x-forwarded-for'] as string,
      },
    };
    const rs = await fetch(url, config).then((response) => response.json());
    res.status(200).json(rs);
  }
}
