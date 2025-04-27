import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { limit, search } = req.query;
  const url = `${process.env.BE_URL}/api/pages/products/search?search=${search}&limit=${limit || 10}`;
  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
}
