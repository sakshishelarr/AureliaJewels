// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    // Allow product images from these domains
    domains: ['images.unsplash.com', 'res.cloudinary.com'],
    // Optional: Use remotePatterns for stricter control or additional domains
    // remotePatterns: [
    //   { protocol: 'https', hostname: 'images.unsplash.com' },
    //   { protocol: 'https', hostname: 'res.cloudinary.com' },
    //   { protocol: 'https', hostname: 'cdn.yoursite.com' },
    // ]
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack(config) {
    // Enable importing SVG files as React components
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    })
    return config
  },
}

export default nextConfig
