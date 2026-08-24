import { defineConfig } from "vite";

export default defineConfig({
  build: {
    emptyOutDir: false,
    minify: false,
    lib: {
      entry: "src/entrypoints/legacy.ts",
      name: "html",
      formats: ["cjs", "umd"],
      fileName: (format) => {
        if (format === "cjs") return "xhtm-dom.cjs";
        return "xhtm-dom.umd.js";
      },
    },
  },
});