import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    "house-power-flow-card": "src/index.ts"
  },
  format: ["esm"],
  target: "es2022",
  sourcemap: true,
  minify: false,
  clean: true,
  dts: false,
  outDir: "dist",
  outExtension: () => ({ js: ".js" })
});
