/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for Render deployment
  output: 'export',
  
  // Image optimization settings
  images: {
    unoptimized: true, // Required for static export
    formats: ['image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Trailing slashes for cleaner URLs
  trailingSlash: true,
  
  // Disable x-powered-by header
  poweredByHeader: false,
  
  // Enable React strict mode for better development
  reactStrictMode: true,
  
  // Compiler options
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

module.exports = nextConfig;
