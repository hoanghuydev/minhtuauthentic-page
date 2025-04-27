import { NextApiRequest, NextApiResponse } from 'next';
import { handleDataFetch, handleHeader } from '@/utils/api';
import { getCookie } from '@/utils';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const url = `${process.env.BE_URL}/api/pages/customers/reset-update-password`;
  if (req.method === 'PUT') {
    fetch(url, {
      method: 'PUT',
      body: req.body,
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const _data = handleDataFetch(data, res);
        res.status(200).json(_data);
      })
      .catch((error) => {
        res
          .status(error?.response?.statusCode || error?.status || 500)
          .json(error);
      });
  } else {
    res.status(400).json({ error: 'Only PUT requests are allowed' });
  }
}
