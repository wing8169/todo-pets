/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  output: "standalone",
};

// const withBundleAnalyzer = require("@next/bundle-analyzer")({
//   enabled: process.env.ANALYZE === "true",
// });

module.exports = nextConfig;

// module.exports = {
//   webpack(config, options) {
//     config.reactStrictMode = false;
//     config.swcMinify = true;
//     config.output = "standalone";
//     config.experimental.reactMode = "concurrent";
//     config.module.rules.push({
//       test: /\.worker\.js$/,
//       loader: "worker-loader",
//       // options: { inline: true }, // also works
//       options: {
//         name: "static/[hash].worker.js",
//         publicPath: "/_next/",
//       },
//     });
//     return config;
//   },
// };
