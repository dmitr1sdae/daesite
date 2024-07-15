import {resolve} from "node:path";
import react from "@vitejs/plugin-react-swc";
import {createFilter, defineConfig, FilterPattern} from "vite";
import dts from "vite-plugin-dts";
import preserveDirectives from "rollup-plugin-preserve-directives";
import {readFileSync, writeFileSync} from "node:fs";
import fs from "fs";
import path from "path";
import {createHash} from "crypto";
import {Plugin} from "vite";
//import {redaePluginLibAssets} from "@redae/vite-plugin-lib-assets";
import * as sass from "sass";

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

interface WrapStylesInReactComponentOptions {
  include?: FilterPattern;
  exclude?: FilterPattern;
}

// @ts-ignore
function wrapStylesInReactComponent(
  options: WrapStylesInReactComponentOptions = {},
): Plugin {
  const filter = createFilter(
    options.include || ["**/*.css", "**/*.scss"],
    options.exclude,
  );

  return {
    name: "vite-plugin-wrap-styles",
    enforce: "post",
    async transform(code: string, id: string) {
      if (!filter(id)) return null;

      if (id.endsWith(".scss")) {
        const srcCode = await fs.promises.readFile(id, "utf-8");

        const importRegex = /@import\s+["']([^"']+)["'];/;
        let transformedCode = srcCode;

        // Find all SCSS imports in the code
        let match;
        while ((match = importRegex.exec(srcCode)) !== null) {
          const importPath = match[1];

          // Resolve the import path using this.resolve
          const resolvedPath = await this.resolve(importPath, id);

          // Replace the import statement with the resolved path
          if (resolvedPath) {
            transformedCode = transformedCode.replace(
              match[0],
              `@import "${resolvedPath}";`,
            );
          }

          break;
        }

        console.log(transformedCode);

        const result = sass.compileString(transformedCode);

        console.log(id);
        console.log(result.css);
      }

      const componentName = id.replace(/[^a-zA-Z0-9]/g, "_");
      const fileContent = await fs.promises.readFile(id, "utf-8");
      const escapedContent = fileContent
        .replace(/`/g, "\\`")
        .replace(/\$/g, "\\$");
      const wrappedCode = `
        const ${componentName} = () => (
          <style dangerouslySetInnerHTML={{ __html: \`${escapedContent}\` }} />
        );

        export default ${componentName};
      `;

      return {
        code: wrappedCode,
        map: null,
      };
    },
    generateBundle(options, bundle) {
      const importStatements: string[] = [];
      const exportStatements: string[] = [];

      Object.keys(bundle).forEach((fileName) => {
        if (fileName.endsWith(".css")) {
          const componentName = fileName.replace(/[^a-zA-Z0-9]/g, "_");
          importStatements.push(
            `import ${componentName} from './${fileName}';`,
          );
          exportStatements.push(`export { ${componentName} };`);
        }
      });

      const entryPoint = `
        ${importStatements.join("\n")}

        const AllStyles = () => (
          <>
            ${Object.keys(bundle)
              .filter((fileName) => fileName.endsWith(".css"))
              .map(
                (fileName) => `<${fileName.replace(/[^a-zA-Z0-9]/g, "_")} />`,
              )
              .join("\n")}
          </>
        );

        export default AllStyles;
        ${exportStatements.join("\n")}
      `;

      this.emitFile({
        type: "asset",
        fileName: "styles.js",
        source: entryPoint,
      });
    },
  };
}

// @ts-ignore
function moveAssetsPlugin(): Plugin {
  return {
    name: "vite-plugin-move-assets",
    enforce: "pre",
    resolveId(source) {
      if (source.includes("?url")) {
        return source;
      }
      return null;
    },
    async load(id) {
      //if (id.includes('?url')) {
      //  const filePath = id.split('?')[0];
      //  const resolved = await this.resolve(filePath);
      //
      //  if (resolved && resolved.id) {
      //    const source = await fs.promises.readFile(resolved.id);
      //    const fileName = path.basename(resolved.id);
      //
      //    const referenceId = this.emitFile({
      //      type: 'asset',
      //      name: fileName,
      //      source,
      //    });
      //
      //    console.log(referenceId);
      //
      //    const assetsDir = path.resolve(process.cwd(), 'dist', 'assets');
      //    if (!fs.existsSync(assetsDir)) {
      //      fs.mkdirSync(assetsDir, { recursive: true });
      //    }
      //
      //    const newFilePath = path.resolve(assetsDir, fileName);
      //
      //    fs.copyFileSync(resolved.id, newFilePath);
      //
      //    const relativePath = path.relative(process.cwd(), newFilePath).replace(/\\/g, '/');
      //
      //    return `export default '/${relativePath}';`;
      //  }
      //
      //  return null;
      //}
      if (id.includes("?url")) {
        const filePath = id.split("?")[0];
        const resolved = await this.resolve(filePath);

        if (resolved && resolved.id) {
          if (!resolved.id || !path.isAbsolute(resolved.id)) {
            this.error(
              `File not found or not an absolute path: ${resolved.id}`,
            );
          }

          let fileName = path.basename(resolved.id);
          const source = await fs.promises.readFile(resolved.id);

          fileName = path.join("assets", fileName);

          const referenceId = this.emitFile({
            type: "asset",
            fileName: fileName,
            name: fileName,
            source,
          });

          console.log("\n\n\n", referenceId, "\n\n\n");
          return `export default ${JSON.stringify(path.join("../", fileName))};`;
        }
      }
      return null;
    },
    handleHotUpdate({file, server}) {
      if (file.includes("?url")) {
        server.ws.send({
          type: "full-reload",
        });
      }
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
    moveAssetsPlugin(),
    inlineAssetsPlugin(),
    react(),
    //redaePluginLibAssets(),
    //wrapStylesInReactComponent(),
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
