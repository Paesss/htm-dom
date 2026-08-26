import { mergeConfig } from "vite";
import minimalConfig from "./vite.config.ts";

export default mergeConfig(minimalConfig, {
  build: {
    lib: {
      entry: "src/index.umd.ts",
      name: "html",
      formats: ["umd"],
    },
  },
});
