import { defineConfig, mergeConfig } from "vite";
import monkey from "vite-plugin-monkey";
import pkg from "./package.json" with { type: "json" };
import { sharedConfig, xhtmLicense } from "./vite.config.ts";

const xhtmVersion = pkg.dependencies.xhtm;
const packageName = pkg.name;
const homepage = pkg.homepage;
const supportURL = pkg.bugs.url


export default mergeConfig(sharedConfig, defineConfig({
 
  plugins: [
    monkey({
      entry: "src/index.userscript.ts",
      userscript: {
        name: packageName,
        author: "Paesss",
        namespace: "https://greasyfork.org/users/1635096-paesss",
        license: "MIT",
        description:
          "A tiny, framework-free DOM helper for writing HTML-like templates in plain JavaScript or TypeScript.",
        match: ["*://*/*"],
        version: xhtmVersion,
        supportURL,
        homepage
      },
    }),
  ],
}));
