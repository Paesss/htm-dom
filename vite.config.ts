import { defineConfig, mergeConfig } from "vite";

export const minimalConfig = defineConfig({
  build: {
    target: "es2020",
    minify: false,
    emptyOutDir: false,

  },
});

export default mergeConfig(
  minimalConfig,
  defineConfig({
    build: {
      lib: {
        name: "htmdom",
        formats: ["es", "cjs", "umd"],
        entry: "src/index.ts",
        fileName: (format) => {
          switch (format) {
            case "cjs":
            case "commonjs":
              return "xhtm-dom.cjs";
            case "es":
            case "esm":
            case "module":
              return "xhtm-dom.js";
            default:
              return `xhtm-dom.${format}.js`;
          }
        },
      },
    },
  })
);

