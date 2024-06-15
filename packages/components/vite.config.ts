import {resolve} from "node:path";

import react from "@vitejs/plugin-react";
import {defineConfig} from "vite";
import dts from "vite-plugin-dts";
import {libInjectCss} from "vite-plugin-lib-inject-css";

export default defineConfig({
  plugins: [
    dts({
      outDir: ["dist"],
      exclude: [
        "vite.config.ts",
        "vitest.config.ts",
        "**/tests/**",
        "**/**.test.ts",
      ],
      rollupTypes: true,
      clearPureImport: true,
    }),
    libInjectCss(),
    react(),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "lib/index.ts"),
      fileName: () => "index.js",
      formats: ["es"],
    },
    rollupOptions: {
      external: [
        "ttag",
        "react",
        "react-is",
        "react-dom",
        "react-router",
        "react-hook-form",
        "react-router-dom",
        "react/jsx-runtime",
        "@remix-run/router",
        "@daesite/utils",
        "@daesite/styles",
      ],
    },
  },
  resolve: {
    alias: {
      "@components": resolve(__dirname, "./lib/components"),
      "@containers": resolve(__dirname, "./lib/containers"),
      "@hooks": resolve(__dirname, "./lib/hooks"),
    },
  },
});
