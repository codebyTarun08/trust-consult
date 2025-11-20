/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co"
      },   
      {
        protocol: "https",
        hostname: "avatar.iran.liara.run"
      }
    ],
    dangerouslyAllowSVG: true,
  },
  reactStrictMode:false
};

export default nextConfig;