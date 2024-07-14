import {resolve} from "node:path";
import react from "@vitejs/plugin-react-swc";
import {defineConfig} from "vite";
import dts from "vite-plugin-dts";
import {redaePluginLibAssets} from "@redae/vite-plugin-lib-assets";
import preserveDirectives from "rollup-plugin-preserve-directives";
import {readFileSync, writeFileSync} from "node:fs";
import fs from "fs";
import path from "path";
import {createHash} from "crypto";
import {Plugin} from "vite";

interface Asset {
  count: number;
  content: string;
  ext: string;
}

function inlineAssetsPlugin(): Plugin {
  const assetsDir = "assets";
  const assetMap = new Map<string, Asset>();

  function hashContent(content: string | Buffer): string {
    return createHash("md5").update(content).digest("hex").slice(0, 8);
  }

  return {
    name: "vite-plugin-inline-assets",
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
          fileContent = fs.readFileSync(filePath, "utf-8").replace(/\s/g, "");
        } else {
          const buffer = fs.readFileSync(filePath);
          fileContent = buffer.toString("base64");
        }

        const contentHash = hashContent(fileContent);
        const assetName = `${path.basename(filePath, ext)}.${contentHash}${ext}`;
        const assetPath = path.join(assetsDir, assetName);

        if (!assetMap.has(assetPath)) {
          assetMap.set(assetPath, {
            count: 1,
            content: fileContent,
            ext,
          });
        } else {
          assetMap.get(assetPath)!.count++;
        }

        const replacement =
          ext === ".svg"
            ? `const ${variableName} = ${JSON.stringify(fileContent)};`
            : `const ${variableName} = "data:image/${ext.slice(1)};base64,${fileContent}";`;

        result = result.replace(importStatement, replacement);
      }

      return result;
    },
  };
}

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
    inlineAssetsPlugin(),
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
