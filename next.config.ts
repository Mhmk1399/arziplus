import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      
      {
        protocol: "https",
        hostname: "arziplus.storage.iran.liara.space",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
