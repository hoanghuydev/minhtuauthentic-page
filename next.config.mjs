import withBundleAnalyzer from '@next/bundle-analyzer';
const nextConfig = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})({
  reactStrictMode: true,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  compress: true,
  images: {
    domains: [
      's3.ap-southeast-1.amazonaws.com',
      'localhost',
      'admin.mikiperfume.com',
      'minhtuauthentic-be.hak-app.com',
      'be.mikiperfume.com',
      'be.minhtuauthentic.com',
      'be-new.mikiperfume.com',
      'minhtuauthentic-be.minhtuauthentic.com',
    ],
    // Không đặt `formats: []`. Mảng rỗng làm Next mất khả năng thương lượng định
    // dạng: nó dán đại kiểu MIME đầu tiên trong `Accept` của client lên dữ liệu
    // thật (Chrome gửi image/apng trước ⇒ ảnh JPEG bị trả về là image/apng), và
    // request không kèm `Accept` thì trả 400. Content-type sai kèm
    // `Content-Disposition: attachment` khiến Google Images không index được.
    // Bỏ hẳn dòng này để dùng mặc định của Next (['image/webp']).
  },
  transpilePackages: [
    'antd',
    '@ant-design',
    'rc-util',
    '@ant-design/icons',
    '@ant-design/icons-svg',
    'rc-pagination',
    'rc-picker',
    'rc-tree',
    'rc-input',
    'rc-table',
  ],
  webpack: (config) => {
    return config;
  },
  turbopack: {},
});

export default nextConfig;