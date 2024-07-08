import {resolve} from "node:path";
import react from "@vitejs/plugin-react-swc";
import {defineConfig} from "vite";
import dts from "vite-plugin-dts";
import {redaePluginLibAssets} from "@redae/vite-plugin-lib-assets";
import preserveDirectives from "rollup-plugin-preserve-directives";
import {readFileSync, writeFileSync} from "node:fs";

export default defineConfig({
  plugins: [
    dts({
      outDir: ["dist"],
      exclude: [
        "vite.config.ts",
        "vitest.config.ts",
        "**/tests/**",
        "**/**.test.ts",
        "**/**.stories.tsx",
      ],
      staticImport: true,
      clearPureImport: true,
    }),
    redaePluginLibAssets(),
    react(),
    {
      name: "vite-inject-css",
      apply: "build",
      writeBundle(options, bundle) {
        const indexFile = bundle["index.js"];

        if (indexFile) {
          const indexPath = resolve(options.dir || "dist", "index.js");
          const content = readFileSync(indexPath, "utf-8");
          const modifiedContent = `import "./style.css";\n${content}`;
          writeFileSync(indexPath, modifiedContent);
        }
      },
    },
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "lib/index.ts"),
      fileName: (_, fileName) => `${fileName}.js`,
      formats: ["es"],
    },
    minify: false,
    rollupOptions: {
      output: {
        preserveModules: true,
      },
      plugins: [preserveDirectives()],
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
        "@daesite/utils",
        "@daesite/shared",
        "@daesite/styles",
      ],
    },
  },
  css: {
    postcss: resolve(__dirname, "postcss.config.js"),
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
