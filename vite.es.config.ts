import { defineConfig } from "vite";

export default defineConfig({
  
  build: {
    target: "es2020",
    minify: false,
    emptyOutDir: false,
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
      fileName: (format) => {
        if (format === "es") return "xhtm-dom.js";
        return `xhtm-dom.${format}.js`;
      }
    },
  },
});
