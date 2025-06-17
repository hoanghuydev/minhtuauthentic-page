import type { NextApiRequest, NextApiResponse } from 'next';
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const url = `${process.env.BE_URL}/api/pages/products/hint?limit=${
      req.query.limit ?? 5
    }
    ${req.query.categoryId ? `&categoryId=${req.query.categoryId}` : ''}`;
    return fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({ error });
      });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
