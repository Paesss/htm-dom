import { defineConfig, mergeConfig } from "vite";

export const sharedConfig = defineConfig({
  build: {
    target: "es2020",
    minify: true,
    emptyOutDir: false,
  },
});

export default mergeConfig(
  sharedConfig,
  defineConfig({
    build: {
      lib: {
        name: "HTMDOM",
        formats: ["es", "cjs", "umd"],
        entry: "src/index.ts",
        fileName: (format) => {
          switch (format) {
            case "cjs":
            case "commonjs":
              return "htm-dom.cjs";
            case "es":
            case "esm":
            case "module":
              return "htm-dom.js";
            default:
              return `htm-dom.${format}.js`;
          }
        },
      },
    },
  })
);

