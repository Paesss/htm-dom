import type { VNodeChild } from "../dom/index.ts";
import { isNode } from "../utils/dom.ts";

export function appendChildren(parent: Node, children: VNodeChild[]): void {
  for (let i = 0; i < children.length; i++) {
    const child = children[i];

    if (child == null || typeof child === "boolean") continue;

    if (Array.isArray(child)) {
      appendChildren(parent, child);
    } else if (isNode(child)) {
      parent.appendChild(child);
    } else {
      parent.appendChild(document.createTextNode(String(child)));
    }
  }
}

import { isBooleanPropKey } from "./constants.ts";

export function setDataset(el: Element, dataset: Record<string, unknown>): void {
  if ("dataset" in el && el.dataset) {
    Object.assign(el.dataset, dataset);
    return;
  }

  for (const key in dataset) {
    const value = dataset[key];
    const attribute = `data-${key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`;
    if (value == null) el.removeAttribute(attribute);
    else el.setAttribute(attribute, String(value));
  }
}

export function setProps(el: Element, props: Record<string, unknown>, isSvg: boolean): void {
  for (const key in props) {
    const val = props[key];

    if (key === "ref") {
      if (typeof val === "function") val(el);
      else if (val && typeof val === "object") (val as { current: Element | null }).current = el;
      continue;
    }

    if (key === "children") continue;

    if (key.charCodeAt(0) === 46 /* '.' */) {
      (el as unknown as Record<string, unknown>)[key.slice(1)] = val;
      continue;
    }

    if (val === undefined || val === null) continue;

    if (key.charCodeAt(0) === 111 /* 'o' */ && key.charCodeAt(1) === 110 /* 'n' */) {
      const eventName = key.slice(2).toLowerCase();
      if (typeof val === "function" || (typeof val === "object" && val !== null)) {
        el.addEventListener(eventName, val as EventListenerOrEventListenerObject);
      }
      continue;
    }

    let attrName = key;
    if (key === "className") attrName = "class";
    else if (key === "htmlFor") attrName = "for";

    if (key === "style") {
      const styledEl = el as HTMLElement | SVGElement;
      if (typeof val === "object" && val !== null) Object.assign(styledEl.style, val);
      else styledEl.style.cssText = String(val);
      continue;
    }

    if (key === "dataset" && typeof val === "object") {
      setDataset(el, val as Record<string, unknown>);
      continue;
    }

    if (typeof val === "boolean") {
      if (!isSvg && isBooleanPropKey(key)) {
        (el as unknown as Record<string, unknown>)[key] = val;
      }
      if (val) el.setAttribute(attrName, "");
      else el.removeAttribute(attrName);
      continue;
    }

    el.setAttribute(attrName, String(val));
  }
}
