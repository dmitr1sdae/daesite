/** @type {import("next").NextConfig} */
const nextConfig = {
  output: "standalone",
  env: {
    API_BASE_URL: "http://127.0.0.1:3000",
  },
};

export default nextConfig;
