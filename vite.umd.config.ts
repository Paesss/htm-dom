import { mergeConfig } from "vite";
import baseConfig from "./vite.config.ts";

export default mergeConfig(baseConfig, {
  build: {
    lib: {
      entry: "src/index.umd.ts",
      name: "html",
      formats: ["umd"],
    },
  },
});
