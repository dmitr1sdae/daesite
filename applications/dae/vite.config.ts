import react from "@vitejs/plugin-react";
import {defineConfig} from "vite";
import {resolve} from "path";

export default defineConfig({
  plugins: [react()],
  build: {
    minify: "terser",
    sourcemap: "hidden",
    cssCodeSplit: false,
    terserOptions: {
      mangle: true,
    },
  },
  resolve: {
    alias: {
      "@components": resolve(__dirname, "./src/app/components"),
      "@containers": resolve(__dirname, "./src/app/containers"),
      "@pages": resolve(__dirname, "./src/app/pages"),
      "@helpers": resolve(__dirname, "./src/helpers"),
    },
  },
});
