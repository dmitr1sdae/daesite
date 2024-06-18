import {defineConfig} from "tsup";

export default defineConfig({
  entry: ["lib/index.ts"],
  external: ["react", "react/jsx-runtime"],
  skipNodeModulesBundle: true,
  splitting: false,
  treeshake: true,
  format: ["esm"],
  minify: true,
  silent: true,
  clean: true,
  dts: true,
});
