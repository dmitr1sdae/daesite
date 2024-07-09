import react from "@vitejs/plugin-react";
import {resolve} from "path";
import {defineConfig} from "vite";
import dts from "vite-plugin-dts";

import preserveDirectives from "rollup-plugin-preserve-directives";

export default defineConfig({
  plugins: [
    dts({
      outDir: ["dist"],
      exclude: ["vite.config.ts"],
      rollupTypes: true,
      clearPureImport: true,
    }),
    react(),
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
        "react",
        "react-is",
        "react-dom",
        "react/jsx-runtime",
        "next/navigation",
        "@daesite/utils",
      ],
    },
  },
  resolve: {
    alias: {
      "~": resolve(__dirname, "./lib"),
    },
  },
});
