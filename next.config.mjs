import withBundleAnalyzer from '@next/bundle-analyzer';
import withLess from 'next-with-less';
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
    formats: ['image/webp', 'image/avif'],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    minimumCacheTTL: 600,
    domains: [
      's3.ap-southeast-1.amazonaws.com',
      'localhost',
      'admin.mikiperfume.com',
      'minhtuauthentic-be.hak-app.com',
      'be.mikiperfume.com',
      'be.minhtuauthentic.com',
      'be-new.mikiperfume.com',
    ],
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
});

export default nextConfig;
