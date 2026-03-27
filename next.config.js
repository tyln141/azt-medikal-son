/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",

  typescript: {
    ignoreBuildErrors: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  async redirects() {
    return [
      {
        source: "/",
        has: [
          {
            type: "host",
            value: "admin.aztmedikal.com.tr",
          },
        ],
        destination: "/secure-admin-login",
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;