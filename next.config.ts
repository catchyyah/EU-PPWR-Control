import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Render.com 최적화 */
  reactStrictMode: true,

  /* 환경별 설정 */
  env: {
    NEXT_PUBLIC_API_URL: process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.RENDER_EXTERNAL_URL
        ? `https://${process.env.RENDER_EXTERNAL_URL}`
        : "http://localhost:3000",
  },
};

export default nextConfig;
