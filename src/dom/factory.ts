import { appendChildren } from "./children";
import { getSvgTagName, SVG_NAMESPACE } from "./constants";
import type {
  CanonicalHtmlTagName,
  CanonicalSvgTagName,
  ComponentFunction,
  DOMProps,
  HTMLProps,
  HtmlElementForTag,
  SVGProps,
  SvgElementForTag,
  VNodeChild,
} from "./dom";
import { setProps } from "./props";

// Tracks active SVG namespace context down the synchronous tree evaluation
let CURRENT_IS_SVG = false;

function h<P extends object, R extends Element | DocumentFragment | VNodeChild>(
  tag: (props: P & { children?: VNodeChild }) => R,
  props?: P | null,
  ...children: VNodeChild[]
): R;

function h(
  tag: null | undefined,
  props?: null | Record<string, unknown>,
  ...children: VNodeChild[]
): DocumentFragment;

function h<K extends keyof SVGElementTagNameMap>(
  tag: K,
  props?: SVGProps<SVGElementTagNameMap[K]> | null,
  ...children: VNodeChild[]
): SVGElementTagNameMap[K];

function h<K extends string>(
  tag: K & (CanonicalSvgTagName<K> extends never ? never : unknown),
  props?: SVGProps<SvgElementForTag<K>> | null,
  ...children: VNodeChild[]
): SvgElementForTag<K>;

function h<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  props?: HTMLProps<HTMLElementTagNameMap[K]> | null,
  ...children: VNodeChild[]
): HTMLElementTagNameMap[K];

function h<K extends string>(
  tag: K & (CanonicalHtmlTagName<K> extends never ? never : unknown),
  props?: HTMLProps<HtmlElementForTag<K>> | null,
  ...children: VNodeChild[]
): HtmlElementForTag<K>;

function h(tag: string, props?: DOMProps | null, ...children: VNodeChild[]): Element;

function h(
  tag?: string | ComponentFunction | null,
  props?: Record<string, unknown> | null,
  ...children: VNodeChild[]
): VNodeChild {
  if (typeof tag === "function") {
    const normalizedProps: Record<string, unknown> = Object.assign({}, props);
    normalizedProps.children =
      children.length === 0 ? undefined : children.length === 1 ? children[0] : children;
    return tag(normalizedProps);
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
