import { build } from "esbuild";
import { glob } from "glob";
import { esbuildDecorators } from "esbuild-plugin-typescript-decorators"; // remove if unused

const entryPoints = await glob("src/**/*.ts", {
  ignore: ["src/**/*.test.ts", "src/**/*.spec.ts", "src/shared/generated/**"],
});

await build({
  entryPoints,
  outdir: "dist",
  platform: "node",
  target: "node24",
  format: "esm",          // or "cjs" — match your package.json "type"
  sourcemap: true,
  bundle: false,          // preserves file structure like tsc does
  outbase: "src",
  plugins: [
    esbuildDecorators({ tsconfig: "tsconfig.esbuild-decorators.json", cwd: process.cwd() }),
  ],
});
