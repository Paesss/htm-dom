import { defineConfig } from "vite";

export default defineConfig({
  build: {
    target: "es2020",
    minify: false,
    emptyOutDir: false,
    lib: {
      formats: ["es"],
      entry: "src/index.ts",
      fileName: (format) => {
        if (format === "es") {
          return "xhtm-dom.js";
        }
        return `xhtm-dom.${format}.js`;
      },
    },
  },
});
