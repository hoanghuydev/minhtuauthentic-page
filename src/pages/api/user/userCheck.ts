import { NextApiRequest, NextApiResponse } from 'next';
import { handleDataFetch } from '@/utils/api';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    const query: any = req.query;
    const queryPram = new URLSearchParams(query).toString();
    const url = `${process.env.BE_URL}/api/pages/customers/validate?${queryPram}`;
    fetch(url, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        const _data = handleDataFetch(data);
        res.status(200).json(_data);
      })
      .catch((error) => {
        res
          .status(error?.response?.statusCode || error?.status || 500)
          .json(error);
      });
  } else {
    res.status(400).json({ error: 'Only GET requests are allowed' });
  }
}
