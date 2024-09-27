import * as esbuild from "esbuild";
import * as tsup from "tsup";

const build = async () => {
  const file = "./lib/index.ts";
  const dist = "./dist";

  const esbuildConfig = {
    entryPoints: [file],
    external: ["@norns-ui/*"],
    packages: "external",
    bundle: true,
    format: "esm",
    target: "es2022",
    outdir: dist,
  };

  await esbuild.build(esbuildConfig);
  console.log(`Built ./dist/index.js`);

  await esbuild.build({
    ...esbuildConfig,
    format: "cjs",
    outExtension: {".js": ".cjs"},
  });
  console.log(`Built ./dist/index.cjs`);

  // tsup is used to emit d.ts files only (esbuild can't do that).
  //
  // Notes:
  // 1. Emitting d.ts files is super slow for whatever reason.
  // 2. It could have fully replaced esbuild (as it uses that internally),
  //    but at the moment its esbuild version is somewhat outdated.
  //    It’s also harder to configure and esbuild docs are more thorough.
  await tsup.build({
    entry: [file],
    format: "esm",
    dts: {only: true},
    outDir: dist,
    silent: true,
    external: [/@norns-ui\/.+/],
  });
  console.log(`Built ./dist/index.d.ts`);
};

build();
