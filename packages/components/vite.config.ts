import {resolve} from "node:path";

import react from "@vitejs/plugin-react";
import {defineConfig} from "vite";
import dts from "vite-plugin-dts";
import {redaePluginLibAssets} from "@redae/vite-plugin-lib-assets";

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
    redaePluginLibAssets(),
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
        "next",
        "ttag",
        "react",
        "react-is",
        "next/link",
        "react-dom",
        "next/image",
        "next/navigation",
        "react-hook-form",
        "react/jsx-runtime",
        "@remix-run/router",
        "@daesite/utils",
        "@daesite/shared",
        "@daesite/styles",
      ],
    },
  },
  resolve: {
    alias: {
      "~": resolve(__dirname, "./lib"),
      "@components": resolve(__dirname, "./lib/components"),
      "@containers": resolve(__dirname, "./lib/containers"),
      "@hooks": resolve(__dirname, "./lib/hooks"),
    },
  },
});
