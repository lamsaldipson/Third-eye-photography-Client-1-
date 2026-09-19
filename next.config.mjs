/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [],
    // Next's built-in optimizer needs `sharp`, which isn't available on
    // Cloudflare Workers (and Cloudflare Images isn't guaranteed to be
    // enabled on every account). Images are still served fine — just
    // without on-the-fly resizing/re-encoding.
    unoptimized: true,
  },
};

export default nextConfig;
