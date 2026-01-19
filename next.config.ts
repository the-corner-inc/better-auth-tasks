import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
      remotePatterns: [
          {
            protocol: "https",
            hostname: "avatars.githubusercontent.com",
            pathname: "/u/**"
          },
          {
              protocol: "https",
              hostname: "*.googleusercontent.com",
          },
      ],
  },
};

export default nextConfig;
