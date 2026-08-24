import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import Handlebars from "handlebars";
import { Marked } from "marked";
import markedShiki from "marked-shiki";
import { type BundledLanguage, createHighlighter, type LanguageRegistration } from "shiki";

const theme = "github-dark-default";
const root = resolve(import.meta.dirname, "..");

const packagePath = resolve(root, "package.json");
const docsPath = resolve(root, "docs");
const githubOutputPath = resolve(root, "README.md");
const outputPath = resolve(docsPath, "README.greasyfork.html");
const sourcePath = resolve(docsPath, "README.src.md");
const grammarPath = resolve(root, "scripts", "xhtm.tmLanguage.json");

const languageAliases: Record<string, BundledLanguage | "xhtm"> = {
  bash: "bash",
  html: "html",
  js: "javascript",
  jsx: "jsx",
  json: "json",
  markdown: "markdown",
  md: "markdown",
  sh: "bash",
  shell: "bash",
  ts: "typescript",
  tsx: "tsx",
  typescript: "typescript",
  xhtm: "xhtm",
  yaml: "yaml",
  yml: "yaml",
};

const source = await readFile(sourcePath, "utf8");
const packageMetadata = JSON.parse(await readFile(packagePath, "utf8")) as {
  name: string;
  version: string;
};
const xhtmGrammar = JSON.parse(await readFile(grammarPath, "utf8")) as LanguageRegistration;
xhtmGrammar.name = "xhtm";
const sourceWithMetadata = Handlebars.compile(source)({
  package: packageMetadata,
});
await writeFile(githubOutputPath, sourceWithMetadata);

const highlighter = await createHighlighter({
  langs: [
    "bash",
    "html",
    "javascript",
    "json",
    "markdown",
    "jsx",
    "tsx",
    "typescript",
    "yaml",
    xhtmGrammar,
  ],
  themes: [theme],
});

const output = (await new Marked()
  .use(
    markedShiki({
      async highlight(code, lang) {
        const requestedLanguage = (lang ?? "").trim().split(/\s+/, 1)[0].toLowerCase();
        const language = languageAliases[requestedLanguage] ?? "text";
        return highlighter.codeToHtml(code, {
          lang: language,
          theme: theme,
        });
      },
    })
  )
  .parse(sourceWithMetadata, { gfm: true })) as string;

await writeFile(outputPath, output);
highlighter.dispose();

console.log(`Rendered ${sourcePath} -> ${githubOutputPath} and ${outputPath}`);
