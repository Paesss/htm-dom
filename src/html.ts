import htm from "xhtm";
import { appendChildren } from "./dom/children";
import { h } from "./dom/factory";
import type { VNodeChild } from "./types/dom";
import { isNode } from "./utils/dom";

const boundHtm = htm.bind(h);

export default function html<R>(statics: TemplateStringsArray, ...args: VNodeChild[]): R;

// Wrapper needed so that one can appendChild/append the results of html`...`
export default function html(
  statics: TemplateStringsArray,
  ...args: VNodeChild[]
): DocumentFragment | Element | Text {
  const result = boundHtm(statics, ...args);

  if (Array.isArray(result)) {
    const fragment = document.createDocumentFragment();
    appendChildren(fragment, result as VNodeChild[]);
    return fragment;
  }

  if (isNode(result)) {
    return result;
  }

  return document.createTextNode(String(result ?? ""));
}
