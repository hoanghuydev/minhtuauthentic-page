import { NextApiRequest, NextApiResponse } from 'next';
import { handleDataFetch } from '@/utils/api';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    const now = Math.floor(Date.now() / 1000);
    const sign = {
      iat: now,
      exp: now + 86400,
      iss: process.env.NEXT_PUBLIC_BAO_KIM_API,
      nbf: now,
    };
    const auth = jwt.sign(sign, process.env.NEXT_PUBLIC_BAO_KIM_SECRET || '', {
      algorithm: 'HS256',
    });
    const url = `${process.env.NEXT_PUBLIC_BAO_KIM_URL}/payment/api/v5/order/send?jwt=${auth}`;
    fetch(url, {
      method: 'POST',
      body: req.body,
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((error) => {
        console.log('Error:', error);
        res
          .status(error?.response?.statusCode || error?.status || 500)
          .json(error);
      });
  } else {
    res.status(400).json({ error: 'Only POST requests are allowed' });
  }
}
