import type { NextApiRequest, NextApiResponse } from 'next';
import { VariantDto } from '@/dtos/Variant.dto';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    const url = `${process.env.BE_URL}/api/orders/addToCart`;
    const rs: Promise<{ data: VariantDto }> = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + req.cookies['token'] || '',
        'x-forwarded-for': req.headers['x-forwarded-for'] as string,
      },
      body: JSON.stringify(req.body),
    }).then((response) => response.json());
    res.status(200).json(rs);
  }
}
