import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d3v53265btnfty.cloudfront.net",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "arziplus.s3.eu-north-1.amazonaws.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "arziplus.storage.iran.liara.space",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "arziplus.storage.c2.liara.space",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
