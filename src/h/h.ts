import { getSvgTagName, SVG_NAMESPACE } from "@/h/constants";
import type {
  CanonicalHtmlTagName,
  CanonicalSvgTagName,
  HtmlElementForTag,
  SvgElementForTag,
} from "@/types/dom.types";
import type { ComponentFunction, DOMProps, HTMLProps, SVGProps, VNodeChild } from "./types";
import { appendChildren, setProps } from "./utils";

// Tracks active SVG namespace context down the synchronous tree evaluation
let CURRENT_IS_SVG = false;

export function h<P extends object, R extends Element | DocumentFragment | VNodeChild>(
  tag: (props: P & { children?: VNodeChild }) => R,
  props?: P | null,
  ...children: VNodeChild[]
): R;

export function h(
  tag: null | undefined,
  props?: null | Record<string, unknown>,
  ...children: VNodeChild[]
): DocumentFragment;

export function h<K extends keyof SVGElementTagNameMap>(
  tag: K,
  props?: SVGProps<SVGElementTagNameMap[K]> | null,
  ...children: VNodeChild[]
): SVGElementTagNameMap[K];

export function h<K extends string>(
  tag: K & (CanonicalSvgTagName<K> extends never ? never : unknown),
  props?: SVGProps<SvgElementForTag<K>> | null,
  ...children: VNodeChild[]
): SvgElementForTag<K>;

export function h<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  props?: HTMLProps<HTMLElementTagNameMap[K]> | null,
  ...children: VNodeChild[]
): HTMLElementTagNameMap[K];

export function h<K extends string>(
  tag: K & (CanonicalHtmlTagName<K> extends never ? never : unknown),
  props?: HTMLProps<HtmlElementForTag<K>> | null,
  ...children: VNodeChild[]
): HtmlElementForTag<K>;

export function h(tag: string, props?: DOMProps | null, ...children: VNodeChild[]): Element;

export function h(
  tag?: string | ComponentFunction | null,
  props?: Record<string, unknown> | null,
  ...children: VNodeChild[]
): Element | DocumentFragment {
  if (typeof tag === "function") {
    const normalizedProps: Record<string, unknown> = Object.assign({}, props);
    normalizedProps.children =
      children.length === 0 ? undefined : children.length === 1 ? children[0] : children;
    return tag(normalizedProps) as Element | DocumentFragment;
  }

  if (!tag) {
    const fragment = document.createDocumentFragment();
    appendChildren(fragment, children);
    return fragment;
  }

  const tagName = String(tag);
  const lowerTag = tagName.toLowerCase();
  const parentIsSvg = CURRENT_IS_SVG;

  // 1. Determine if current element should be SVG namespace
  let isSvg = parentIsSvg;
  if (lowerTag === "svg" || lowerTag === "foreignobject") {
    isSvg = true; // <svg> root and <foreignObject> container itself belong to SVG namespace
  } else if (!isSvg) {
    // Check fallback tag map for SVG elements rendered without a top-level <svg>
    isSvg = getSvgTagName(lowerTag) !== undefined;
  }

  // 2. Set scope state for children:
  // Children inside <foreignObject> switch back to HTML context (false),
  // while children inside standard SVG elements stay in SVG context (true).
  CURRENT_IS_SVG = lowerTag === "foreignobject" ? false : isSvg;

  let el: Element;

  try {
    if (isSvg) {
      const normalizedTag = getSvgTagName(lowerTag) ?? tagName;
      el = document.createElementNS(SVG_NAMESPACE, normalizedTag);
    } else {
      el = document.createElement(tagName);
    }

    if (props) setProps(el, props, isSvg);

    appendChildren(el, children);
  } finally {
    // 3. Restore parent context state when unwinding stack
    CURRENT_IS_SVG = parentIsSvg;
  }

  return el;
}

export default h;
