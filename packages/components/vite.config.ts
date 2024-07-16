import {resolve} from "node:path";
import react from "@vitejs/plugin-react-swc";
import {defineConfig} from "vite";
import dts from "vite-plugin-dts";
import preserveDirectives from "rollup-plugin-preserve-directives";
import fs from "fs";
import path from "path";
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
        "**/**.stories.tsx",
      ],
      staticImport: true,
      clearPureImport: true,
    }),
    {
      name: "plugin-inline-assets",
      enforce: "pre",
      async transform(code: string, id: string) {
        if (!code.includes("?raw")) {
          return;
        }

        const regex = /import\s+(\w+)\s+from\s+['"](.+?\?raw)['"]/g;
        let result = code;
        let match: RegExpExecArray | null;

        while ((match = regex.exec(code)) !== null) {
          const [importStatement, variableName, importPath] = match;
          const rawPath = importPath.replace("?raw", "");
          const resolved = await this.resolve(rawPath);

          if (!resolved) {
            throw new Error(`Could not resolve path: ${rawPath}`);
          }

          const filePath = resolved.id || "";
          const ext = path.extname(filePath);

          if (!fs.existsSync(filePath)) {
            throw new Error(`File not found: ${filePath}`);
          }

          let fileContent: string;
          if (ext === ".svg") {
            fileContent = fs
              .readFileSync(filePath, "utf-8")
              .replace(/\s+/g, " ")
              .replace(/> </g, "><")
              .replace(/ \/></g, "/><")
              .replace("> ", ">");
          } else {
            const buffer = fs.readFileSync(filePath);
            fileContent = buffer.toString("base64");
          }

          const replacement =
            ext === ".svg"
              ? `const ${variableName} = ${JSON.stringify(fileContent)};`
              : `const ${variableName} = "data:image/${ext.slice(1)};base64,${fileContent}";`;

          result = result.replace(importStatement, replacement);
        }

        return result;
      },
    },
    redaePluginLibAssets(),
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
        "@daesite/hooks",
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
