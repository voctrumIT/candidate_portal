/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@repo/ui @repo/types'],  // Add this line
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/Candidate/:path*',
        destination: 'https://erp-api.voctrum.com/api/Candidate/:path*',
      },
    ];
  },
};

export default nextConfig;