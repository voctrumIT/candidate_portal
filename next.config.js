/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@repo/ui @repo/types'],  // Add this line
};

export default nextConfig;