/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/pin",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
