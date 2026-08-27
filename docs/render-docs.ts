import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

import Handlebars from "handlebars";
import { Marked } from "marked";
import markedShiki from "marked-shiki";
import { type BundledLanguage, createHighlighter } from "shiki";

import packageMetadata from "../package.json" with { type: "json" };
import xhtmGrammar from "./xhtm.tmLanguage.json" with { type: "json" };

const theme = "github-dark-default";
const root = resolve(import.meta.dirname, "..");

const readmeTemplatePath = resolve(root, "README.hbs");
const readmeMarkdownOutputPath = resolve(root, "README.md");
const readmeHtmlOutputPath = resolve(root, "README.html");

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

const readmeTemplate = await readFile(readmeTemplatePath, "utf8");

const readmeMarkdownContent = Handlebars.compile(readmeTemplate)({
  package: packageMetadata,
});
const readmeMarkdownWithComment: string = `<!-- This file is auto-generated. Edit README.hbs instead -->\n\n${readmeMarkdownContent}`;

await writeFile(readmeMarkdownOutputPath, readmeMarkdownWithComment);

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

const readmeHtmlContent = (await new Marked()
  .use(
    markedShiki({
      async highlight(code, lang) {
        const requestedLanguage = (lang ?? "").trim().split(/\s+/, 1)[0].toLowerCase();

        const language = languageAliases[requestedLanguage] ?? "text";

        return highlighter.codeToHtml(code, {
          lang: language,
          theme,
        });
      },
    })
  )
  .parse(readmeMarkdownWithComment, { gfm: true })) as string;

await writeFile(readmeHtmlOutputPath, readmeHtmlContent);
highlighter.dispose();

console.log(
  `Rendered ${readmeTemplatePath} -> ${readmeMarkdownOutputPath} and ${readmeHtmlOutputPath}`
);
