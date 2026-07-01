/** @type {import('next').NextConfig} */
const nextConfig = {
  optimizeFonts: false,
  experimental: {
    cpus: 1,
    workerThreads: false,
    serverActions: {
      bodySizeLimit: '100mb'
    }
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-8e93ec9b90cc4059b88ea9d7fd512aa1.r2.dev',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'biaiohzfozhumggxikez.supabase.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cf.shopee.vn',
        pathname: '/**',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig
