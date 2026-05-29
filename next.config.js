/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // better-sqlite3 is a native module — keep it out of the bundle so it is
    // required directly from node_modules at runtime (server-side only).
    serverComponentsExternalPackages: ['better-sqlite3'],
  },
};

module.exports = nextConfig;
