/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@repo/ui @repo/types'],
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
        destination: 'https://dotnetapi.voctrum.com/api/Candidate/:path*',
      },
      {
        source: '/profile',
        destination: '/dashboard/profile',
      },
      {
        source: '/user-profile',
        destination: '/dashboard/profile',
      },
      {
        source: '/dashboard/user-profile',
        destination: '/dashboard/profile',
      },
      {
        source: '/view-job',
        destination: '/jobs',
      },
      {
        source: '/view-job/:id',
        destination: '/jobs/:id',
      },
      {
        source: '/dashboard/view-job',
        destination: '/dashboard/jobs',
      },
      {
        source: '/dashboard/view-job/:id',
        destination: '/dashboard/jobs/:id',
      },
    ];
  },
};

export default nextConfig;
