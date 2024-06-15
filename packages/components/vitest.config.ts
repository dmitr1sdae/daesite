import {defineConfig, mergeConfig} from "vitest/config";

import viteConfig from "./vite.config";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      reporters: ["default", "html"],
      outputFile: "./.vitest/index.html",
      environment: "jsdom",
      setupFiles: ["./tests/setup.ts"],
      globals: true,
      css: true,
      coverage: {
        include: ["lib/**"],
        exclude: [
          "**/index**",
          "coverage/**",
          "dist/**",
          "**/[.]**",
          "packages/*/test?(s)/**",
          "**/*.d.ts",
          "**/virtual:*",
          "**/__x00__*",
          "**/\x00*",
          "cypress/**",
          "test?(s)/**",
          "test?(-*).?(c|m)[jt]s?(x)",
          "**/*{.,-}{test,spec,stories}?(-d).?(c|m)[jt]s?(x)",
          "**/__tests__/**",
          "**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*",
          "**/vitest.{workspace,projects}.[jt]s?(on)",
          "**/.{eslint,mocha,prettier}rc.{?(c|m)js,yml}",
        ],
      },
    },
  }),
);
