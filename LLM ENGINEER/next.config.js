/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false, // Changed to false for production
  },
  images: {
    unoptimized: true, // Disable Image Optimization API
    domains: ['avatars.githubusercontent.com'],
  },
  reactStrictMode: true,
  // Add this for proper API route handling
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ]
  },
  // Enable standalone output for Vercel
  output: 'standalone',
}

module.exports = nextConfig
