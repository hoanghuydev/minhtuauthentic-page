import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { id } = req.query;
  // Chặn id lạ ghép thẳng vào URL backend, tránh gọi sang endpoint khác
  // kèm theo token của khách.
  if (typeof id !== 'string' || !/^\d+$/.test(id)) {
    return res.status(400).json({ message: 'Mã đơn hàng không hợp lệ' });
  }

  try {
    const url = `${process.env.BE_URL}/api/pages/orders/${id}/cancel`;
    const token = JSON.parse(req?.cookies?.['user'] || '{}')?.token;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + (token || ''),
      },
    });

    // Không parse mù: gateway lỗi trả HTML, hoặc 204 không có body, sẽ làm
    // JSON.parse ném và biến một lần huỷ thành công thành lỗi 500.
    const raw = await response.text();
    let data: unknown = { message: response.ok ? 'success' : 'Huỷ đơn hàng thất bại' };
    if (raw) {
      try {
        data = JSON.parse(raw);
      } catch {
        data = { message: response.ok ? 'success' : raw.slice(0, 200) };
      }
    }
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Error cancelling order:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
