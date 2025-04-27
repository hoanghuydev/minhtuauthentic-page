import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = req.query;
  const params = new URLSearchParams(req.query as any);
  params.append('fromClient', '1');
  const url = `${process.env.BE_URL}/api/pages/slug/${slug}?${params.toString()}`;
  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
}
