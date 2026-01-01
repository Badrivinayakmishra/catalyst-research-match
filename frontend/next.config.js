/** @type {import('next').NextConfig} */
const nextConfig = {
  // Force rebuild - updated Jan 1 2026
  generateBuildId: async () => {
    return 'catalyst-build-' + Date.now()
  }
}

module.exports = nextConfig
