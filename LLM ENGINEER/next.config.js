/** @type {import('next').NextConfig} */
const nextConfig = {
  // Build-time optimizations
  eslint: {
    ignoreDuringBuilds: true, // Only use if you're not running ESLint in CI
  },
  typescript: {
    ignoreBuildErrors: false, // Good for production - ensures type safety
  },
  
  // Image handling
  images: {
    unoptimized: true, // Critical for Vercel to avoid unnecessary optimization costs
    domains: [
      'avatars.githubusercontent.com',
      // Add other domains if needed
    ],
  },

  // React and runtime config
  reactStrictMode: true,
  trailingSlash: false, // Explicitly set for consistent URL behavior
  
  // Security headers (recommended)
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        }
      ],
    }
  ],

  // Output configuration
  output: 'standalone', // Perfect for Vercel - creates optimized deployment

  // Remove the rewrites section unless you have specific routing needs
  // (Your current rewrite is redundant as it maps to the same path)
}

module.exports = nextConfig
