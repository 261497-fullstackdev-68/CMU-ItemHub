import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    CMU_ENTRAID_URL: process.env.CMU_ENTRAID_URL,
    CMU_ENTRAID_GET_TOKEN_URL: process.env.CMU_ENTRAID_GET_TOKEN_URL,
    CMU_ENTRAID_GET_BASIC_INFO: process.env.CMU_ENTRAID_GET_BASIC_INFO,
    CMU_ENTRAID_LOGOUT_URL: process.env.CMU_ENTRAID_LOGOUT_URL,
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: process.env.OBJ_STORAGE_ADDR || "localhost",
        port: process.env.OBJ_STORAGE_PORT, // your MinIO port
        pathname: "/**",
      },
    ],
    domains: ["picsum.photos"], // ✅ allow picsum.photos
  },
};

export default nextConfig;
