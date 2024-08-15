/** @type {import("next").NextConfig} */
const nextConfig = {
  webpack(config, options) {
    config.module.rules.push({
      test: /\.webm$/,
      use: [
        {
          loader: "url-loader",
          options: {
            limit: 8192,
            fallback: 'file-loader',
            publicPath: `/_next/static/media/`,
            outputPath: 'static/media/',
            name: '[name].[hash].[ext]',
          },
        },
      ],
    });
    return config;
  },
  output: "standalone",
  env: {
    API_BASE_URL: "http://127.0.0.1:3000",
  },
};

export default nextConfig;
