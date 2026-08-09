import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { id } = req.query;
    const url = `${process.env.BE_URL}/api/pages/orders/${id}/cancel`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + (req.cookies['token'] || ''),
      },
    });
    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Error cancelling order:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
