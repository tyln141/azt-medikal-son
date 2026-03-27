/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      {
        source: '/',
        has: [
          {
            type: 'host',
            value: 'admin.aztmedikal.com.tr',
          },
        ],
        destination: '/tr/admin',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
