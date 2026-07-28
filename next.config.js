/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [],
  },
  async headers() {
    const yearCache = [
      {
        key: "Cache-Control",
        value: "public, max-age=31536000, immutable",
      },
    ];
    return [
      {
        // Yerel Instagram medyası — içerik değişmez; agresif cache güvenli
        source: "/instagram/:path*",
        headers: yearCache,
      },
      {
        source: "/:path*.mp4",
        headers: yearCache,
      },
      {
        source: "/:path*.(jpg|jpeg|png|webp|gif|svg|ico)",
        headers: yearCache,
      },
    ];
  },
};

module.exports = nextConfig;
