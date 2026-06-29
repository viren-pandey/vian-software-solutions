/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: __dirname,
  async rewrites() {
    return [
      // Legacy page rewrites (not yet migrated to App Router)
      { source: '/careers', destination: '/careers.html' },
      { source: '/case-studies', destination: '/case-studies.html' },
      { source: '/disclaimer', destination: '/disclaimer.html' },
      { source: '/support', destination: '/support.html' },
    ];
  },
};

module.exports = nextConfig;