import { NextApiResponse } from 'next';

export const handleDataFetch = (data: any, res?: NextApiResponse) => {
  if (data.statusCode !== 200 && data.statusCode !== 201) {
    if (res) {
      res.status(data.statusCode).json(data);
    } else {
      throw new Error(data.statusCode);
    }
  }
  return data;
};

export const handleHeader = (token?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};
