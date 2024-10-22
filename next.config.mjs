/** @type {import("next").NextConfig} */
const nextConfig = {
  output: "standalone",
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true
  },
  reactStrictMode: false // 禁用 React 严格模式
};

export default nextConfig;
