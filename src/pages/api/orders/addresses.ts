import type { NextApiRequest, NextApiResponse } from 'next';
import { VariantDto } from '@/dtos/Variant.dto';
import { UserDto } from '@/dtos/User.dto';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  let url = `${process.env.BE_URL}/api/pages/orders/addresses`;
  const user: UserDto = JSON.parse(req.cookies['user'] || '{}');
  const config: Record<string, unknown> = {
    method: req.method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + user?.token || '',
      'x-forwarded-for': req.headers['x-forwarded-for'] as string,
    },
  };
  if (req.method === 'POST') {
    config.body = JSON.stringify(req.body);
  } else if (req.method === 'DELETE') {
    url += `/${req.query.id}`;
  }
  const rs = await fetch(url, config).then((response) => response.json());
  res.status(200).json(rs);
}
