import type { NextApiRequest, NextApiResponse } from 'next';
import { StaticContentsDto } from '@/dtos/StaticContents.dto';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { type } = req.query;
  const params = new URLSearchParams(req.query as any);
  const url = `${process.env.BE_URL}/api/pages/static-contents/${type}?${params.toString()}`;
  return fetch(url)
    .then((response) => response.json())
    .then((data: { data: StaticContentsDto[] }) => {
      res.status(200).json(data);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
}
