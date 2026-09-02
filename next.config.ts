import type { NextConfig } from "next";
import { fileURLToPath } from "node:url";

const transformersWebPath = fileURLToPath(
  new URL("./node_modules/@huggingface/transformers/dist/transformers.web.js", import.meta.url),
);

const nextConfig: NextConfig = {
  output: "export",
  reactStrictMode: true,
  transpilePackages: ["@huggingface/transformers"],
  /**
   * Worker 与服务端会经过不同的条件导出；统一锁定浏览器构建，避免打包原生 Node 绑定。
   */
  webpack(config) {
    config.resolve.alias["@huggingface/transformers"] = transformersWebPath;
    return config;
  },
};

export default nextConfig;
