import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    const query = req.query;
    const url =
      `${process.env.BE_URL}/api/pages/orders/check?` +
      new URLSearchParams(query as any).toString();

    const rs = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + req.cookies['token'] || '',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        return data;
      });
    res.status(200).json(rs);
  } else {
    res.status(400).json({ error: 'Only GET requests are allowed' });
  }
}
