import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    let _body: Record<string, any> = JSON.parse(req.body);
    _body = {
      merchantId: _body.merchantId,
      referenceId: _body.referenceId,
      storeId: _body.storeId,
      requestType: _body.requestType,
      paymentMethod: _body.paymentMethod,
      description: _body.description,
      successRedirectUrl: 'minhtuauthentic.com',
      unSuccessRedirectUrl: 'minhtuauthentic.com',
      amount: _body.amount,
      items: _body.items,
      customer: _body.customer,
      shipping: _body.shipping,
    };
    const _bodyString = JSON.stringify(_body);
    const hex = generateHmacSHA256Signature(
      process.env.NEXT_PUBLIC_FUNDIN_SECRET || '',
      _bodyString,
    );

    const url = `${process.env.NEXT_PUBLIC_FUNDIN_URL}/v2/payments`;
    fetch(url, {
      method: 'POST',
      body: _bodyString,
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Client-Id': process.env.NEXT_PUBLIC_FUNDIN_CLIENT_ID,
        Signature: hex,
      } as any,
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

export function generateHmacSHA256Signature(
  secretKey: string,
  data: string,
): string {
  const hmac = crypto.createHmac('sha256', secretKey);
  hmac.update(data);
  return hmac.digest('hex');
}

function verifyHmacSHA256Signature(
  secretKey: string,
  data: string,
  signatureToVerify: string,
) {
  const generatedSignature = generateHmacSHA256Signature(secretKey, data);
  return generatedSignature === signatureToVerify;
}
