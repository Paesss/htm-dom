import { defineConfig, mergeConfig } from "vite";
import monkey from "vite-plugin-monkey";
import pkg from "./package.json" with { type: "json" };
import { sharedConfig } from "./vite.config.js";

export default mergeConfig(
  sharedConfig,
  defineConfig({
    plugins: [
      monkey({
        entry: "src/index.userscript.ts",
        userscript: {
          namespace: pkg.author.url,
          license: "MIT",
          match: ["*://*/*"],
        },
      }),
    ],
  })
);
