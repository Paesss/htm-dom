import htm from "xhtm";
import { h } from "./entrypoints/es";
import type { VNodeChild } from "./h/types";
import { appendChildren } from "./h/utils";
import { isNode } from "./utils/domutils";

const boundHtm = htm.bind(h);

// Wrapper needed so that one can appendChild/append the results of html`...`
export default function html(statics: TemplateStringsArray, ...args: VNodeChild[]): Node {
  const result = boundHtm(statics, ...args);

  if (Array.isArray(result)) {
    const fragment = document.createDocumentFragment();
    appendChildren(fragment, result as VNodeChild[]);
    return fragment;
  }

  if (!isNode(result)) {
    return document.createTextNode(String(result ?? ""));
  }

  return result;
}
